from fastapi import FastAPI, HTTPException, logger
from recommendation_engine import CarRecommendationSystem
from typing import List, Dict
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
import mysql.connector
import logging
from fastapi.responses import JSONResponse
import sys
from recommendation_engine import CarRecommendationSystem
app = FastAPI()


logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


# إضافة وسيط CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # السماح لـ Spring Boot
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database connection setup
try:
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root",
        database="recommendation"
    )
    cursor = conn.cursor()
    logger.info("Successfully connected to the MySQL database")
    
except mysql.connector.Error as e:
    logger.error(f"Failed to connect to the MySQL database: {str(e)}")
    raise Exception("Database connection failed")
system = CarRecommendationSystem(conn)

system = CarRecommendationSystem(conn)
system.load_and_clean_data()

system.cursor.execute("SELECT id, user_id_id, search_query, timestamp FROM search_log")
searches = [list(row) for row in system.cursor.fetchall()]

@app.get("/")
def hello():
    return {"message": "Hello World"}

@app.on_event("shutdown")
def shutdown_event():
    """Close the database connection when the app shuts down."""
    system.close()

@app.get("/recommendations/{user_id}", response_model=List[Dict])
async def get_recommendations(user_id: int):
    """
    Get car recommendations for a specific user.

    Parameters:
    - user_id: The ID of the user to get recommendations for.

    Returns:
    - A list of recommended cars with their details.
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

@app.get("/")
async def root():
    """Root endpoint to check if the API is running."""
    return {"message": "Car Recommendation API is running!"}