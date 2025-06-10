from fastapi import FastAPI, HTTPException, logger
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
import pandas as pd
import mysql.connector
import logging
import sys
import numpy as np
import pickle
import os
import warnings
import uvicorn
import asyncio
import random
import re
from datetime import datetime
from transliterate import translit
from textblob import TextBlob
from mysql.connector import errorcode
import aiomysql

from sklearn.preprocessing import StandardScaler
import faiss
from fuzzywuzzy import fuzz
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# --- Logging setup ---
logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# --- FastAPI app initialization ---
app = FastAPI(
    title="Used Car Pricing & Recommendation",
    description="API for predicting used car prices and car recommendations",
    version="1.0.0"
)

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080", "http://localhost:5173", "http://localhost:8187"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Database connection setup ---
try:
    conn = mysql.connector.connect(
        host="localhost",
        user="springstudent",
        password="springstudent",
        port= 3306,
        database="defaultdb"
    )
    cursor = conn.cursor()
    logger.info("Successfully connected to the MySQL database")
except mysql.connector.Error as e:
    logger.error(f"Failed to connect to the MySQL database: {str(e)}")
    raise Exception("Database connection failed")

# --- Recommendation Engine Import ---
from link_recommendation.recommendation_engine import CarRecommendationSystem
system = CarRecommendationSystem(conn)
system.load_and_clean_data()
system.cursor.execute("SELECT id, user_id_id, search_query, timestamp FROM search_log")
searches = [list(row) for row in system.cursor.fetchall()]

# --- Models and Encoders ---
encoders = {}
scaler = None
scaler_A = None
xgb_model = None
gb_model = None
gb_model_A = None
rf_model = None

PREDICTION_METHODS = ["xgboost", "gradient_boosting", "random_forest", "ensemble"]

def load_models():
    global encoders, scaler, xgb_model, gb_model, rf_model, scaler_A, gb_model_A
    try:
        # Base directory including Full Project
        base_dir = r"Full Project\PREDICTION_SYSTEM\Fast_Api_2"
        directories = ["model1", "model2"]
        
        # Load encoders
        encoder_path = os.path.join(base_dir, "model1", "encoded_data_and_encoders.pkl")
        if os.path.exists(encoder_path):
            with open(encoder_path, "rb") as f:
                data_and_encoders = pickle.load(f)
                encoders = data_and_encoders.get("encoders", {})
        
        # Load scalers
        scaler_path = os.path.join(base_dir, "model1", "scaler.pkl")
        if os.path.exists(scaler_path):
            with open(scaler_path, "rb") as f:
                scaler = pickle.load(f)
        
        scaler_a_path = os.path.join(base_dir, "model2", "scaler.pkl")
        if os.path.exists(scaler_a_path):
            with open(scaler_a_path, "rb") as f:
                scaler_A = pickle.load(f)
        
        # Load XGBoost model
        xgb_path = os.path.join(base_dir, "model1", "xgboost_model.pkl")
        if os.path.exists(xgb_path):
            with open(xgb_path, "rb") as f:
                xgb_model = pickle.load(f)
        
        # Load Gradient Boosting models
        gb_path = os.path.join(base_dir, "model1", "gradient_boosting_model.pkl")
        if os.path.exists(gb_path):
            with open(gb_path, "rb") as f:
                gb_model = pickle.load(f)
        
        gb_a_path = os.path.join(base_dir, "model2", "gradient_boosting_model.pkl")
        if os.path.exists(gb_a_path):
            with open(gb_a_path, "rb") as f:
                gb_model_A = pickle.load(f)
        
        # Load Random Forest model
        rf_path = os.path.join(base_dir, "model1", "random_forest_model.pkl")
        if os.path.exists(rf_path):
            with open(rf_path, "rb") as f:
                rf_model = pickle.load(f)

        # Check if models were loaded
        models_loaded = all([encoders, scaler, xgb_model, gb_model, rf_model])
        if not models_loaded:
            missing = []
            if not encoders: missing.append("encoders")
            if not scaler: missing.append("scaler")
            if not xgb_model: missing.append("xgboost_model")
            if not gb_model: missing.append("gradient_boosting_model")
            if not rf_model: missing.append("random_forest_model")
            print(f"Some models could not be loaded: {', '.join(missing)}")
        else:
            print("All models loaded successfully")
            
    except Exception as e:
        print(f"Error loading files: {e}")
        raise

try:
    load_models()
except Exception as e:
    print(f"Failed to load models: {e}")

# --- Data Models ---
class CarFeaturesPredict(BaseModel):
    Body: Optional[str] = None
    Brand: str
    COMMON_PROBLEM: str
    City: Optional[str] = None
    Color: Optional[str] = None
    Engine_CC: int
    Fuel: Optional[str] = None
    Kilometers_Driven: int
    Model: str
    Transmission: str
    Year: int

    model_config = {
        "json_schema_extra": {
            "example": {
                "Body": "Sedan",
                "Brand": "Toyota",
                "COMMON_PROBLEM": "No problems",
                "City": "Riyadh",
                "Color": "Silver",
                "Engine_CC": 1600,
                "Fuel": "Petrol",
                "Kilometers_Driven": 80000,
                "Model": "Corolla",
                "Transmission": "Automatic",
                "Year": 2015
            }
        }
    }

class CarFeatures(BaseModel):
    Engine_CC: float
    Car_Age: int
    Brand: str
    Model: str
    Kilometers_Driven: float
    Transmission: str

# --- Helper Functions for Prediction ---
def encode_input(data):
    required_columns = ['Brand', 'Model', 'Transmission', 'Engine_CC', 'Car_Age', 'Kilometers_Driven']
    filtered_data = {key: data[key] for key in required_columns if key in data}
    for col in ['Brand', 'Model', 'Transmission']:
        if filtered_data[col] in encoders[col].classes_:
            filtered_data[col] = encoders[col].transform([filtered_data[col]])[0]
        else:
            filtered_data[col] = encoders[col].transform([encoders[col].classes_[0]])[0]
    return filtered_data

def prepare_input(input_data):
    num_features = np.array([[input_data['Kilometers_Driven'], input_data['Engine_CC'], input_data['Car_Age']]])
    num_features = scaler.transform(num_features)
    categorical_features = np.array([
        input_data['Brand'], 
        input_data['Model'], 
        input_data['Transmission']
    ]).reshape(1, -1)
    encoded_data = np.hstack((num_features, categorical_features))
    return encoded_data

def prepare_features(car_data: Dict[str, Any]):
    if not isinstance(car_data, pd.DataFrame):
        car_data = pd.DataFrame([car_data])
    car_data["Car_Age"] = 2025 - car_data["Year"]
    for col, encoder in encoders.items():
        if col == "COMMON PROBLEM" and "COMMON_PROBLEM" in car_data.columns:
            car_data["COMMON PROBLEM"] = car_data.pop("COMMON_PROBLEM")
        if col in car_data.columns:
            try:
                car_data[col] = encoder.transform(car_data[col])
            except Exception as e:
                print(f"Error encoding {col}: {e}")
                car_data[col] = 0
    selected_features = [
        "Engine_CC",
        "Car_Age",
        "Brand",
        "Model",
        "Kilometers_Driven",
        "Transmission",
        "COMMON PROBLEM",
    ]
    for feature in selected_features:
        if feature not in car_data.columns:
            car_data[feature] = 0
    if scaler_A:
        num_features = ["Kilometers_Driven", "Engine_CC", "Car_Age"]
        for feat in num_features:
            if feat not in car_data.columns:
                car_data[feat] = 0
        car_data[num_features] = scaler_A.transform(car_data[num_features])
    return car_data[selected_features]

# --- FastAPI Endpoints ---
@app.get("/advertisements/{advertisement_id}/images", response_model=List[str])
async def get_advertisement_images(advertisement_id: int):
    """
    Returns a list of image URLs for a given advertisement ID.
    """
    try:
        query = """
            SELECT url FROM image WHERE advertisement_id = %s
        """
        cursor.execute(query, (advertisement_id,))
        rows = cursor.fetchall()
        return [row[0] for row in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch images: {str(e)}")


@app.get("/")
def hello():
    return {"message": "Hello World"}

@app.get("/recommendations/{user_id}", response_model=List[Dict])
async def get_recommendations(user_id: int):
    """
    Get car recommendations for a specific user.
    """
    try:
        recommendations = system.recommend_cars(user_id, searches)
        display_columns = [
            'advertisementid', 'created_at', 'carbodytype_original', 'carcolor', 'cardescription', 'carfueltype',
            'carmake_original', 'carmodel_original', 'carprice', 'carproductionyear', 'cartransmissiontype',
            'enginecapacity', 'kilometers', 'owner', 'ownerlocation_original', 'ownerphonenumber',
        ]
        renamed_columns = {col: col.replace('_original', '') for col in display_columns}
        rec_list = recommendations[display_columns].rename(columns=renamed_columns).to_dict(orient='records')[:10]
        return rec_list
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating recommendations: {str(e)}")

@app.get("/models")
def get_available_models():
    return {"available_models": PREDICTION_METHODS}

@app.post("/predict")
async def predict(features: CarFeaturesPredict):
    input_data = features.dict()
    prepared_data = prepare_features(input_data)
    prediction = gb_model_A.predict(prepared_data)[0]
    return {
        "predicted_price": round(float(prediction), 2),
        "input_data": input_data
    }

@app.post("/predict/gradient_boosting")
async def predict_gb(features: CarFeatures):
    input_data = encode_input(features.dict())
    encoded_data = prepare_input(input_data)
    prediction = gb_model.predict(encoded_data)[0]
    return {"predicted_price": round(float(prediction), 2)}

@app.post("/predict/xgboost")
async def predict_xgb(features: CarFeatures):
    input_data = encode_input(features.dict())
    encoded_data = prepare_input(input_data)
    prediction = xgb_model.predict(encoded_data)[0]
    return {"predicted_price": round(float(prediction), 2)}

@app.post("/predict/random_forest")
async def predict_rf(features: CarFeatures):
    input_data = encode_input(features.dict())
    encoded_data = prepare_input(input_data)
    prediction = rf_model.predict(encoded_data)[0]
    return {"predicted_price": round(float(prediction), 2)}

@app.get("/brands")
def get_car_brands():
    """Get a list of all available car brands"""
    try:
        brand_encoder = encoders.get("Brand")
        if brand_encoder:
            brands = brand_encoder.classes_.tolist()
            return {"brands": brands}
        return {"brands": [], "message": "No encoder found for brands"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving car brands: {str(e)}")

@app.get("/models/{brand}")
def get_car_models(brand: str):
    """Get a list of all car models for a specific brand"""
    try:
        model_encoder = encoders.get("Model")
        if model_encoder:
            return {"brand": brand, "models": model_encoder.classes_.tolist(), "message": "You may need to filter models by brand"}
        return {"brand": brand, "models": [], "message": "No encoder found for models"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving car models: {str(e)}")

@app.get("/health")
def health_check():
    """Check the health of the API"""
    models_status = {
        "xgboost": xgb_model is not None,
        "gradient_boosting": gb_model is not None,
        "random_forest": rf_model is not None,
        "encoders_available": len(encoders) > 0,
        "scaler_available": scaler is not None
    }
    all_ok = all(models_status.values())
    return {
        "status": "healthy" if all_ok else "degraded",
        "models_status": models_status
    }

if __name__ == "__main__":
    uvicorn.run("Last_model:app", host="0.0.0.0", port=8000, reload=True)