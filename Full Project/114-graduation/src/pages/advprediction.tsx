import React, { FC, useState} from "react";
import AdvPriceSidebar from "../components/advside";
import { FormData } from "../types/carData";
import "../styles/prediction.css";
import "remixicon/fonts/remixicon.css";
import VriceForm from "../components/advform";
import Navbar from "../components/Navbar";


const PredictPrice: FC = () => {
  // Main form data state
  const [formData, setFormData] = useState<FormData>({
    brand: "",
    model: "",
    engineCc: 0,
    city: "",
    transmissionType: "",
    body: "",
    engineFuelType: "",
    year: 2020,
    kilometersDriven: 0,
    Car_Age: 5,
    color: "",
    commonproblem: "",
  });

  // Predicted price and sidebar visibility
  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
  const [showSidebar, setShowSidebar] = useState<boolean>(false);

  // Price prediction logic
  const predictPrice = (data: FormData) => {
    let basePrice = 10000;
    basePrice += (2023 - data.year) * 500;
    basePrice -= data.kilometersDriven * 0.1;
    basePrice += data.engineCc * 0.2;
    if (data.transmissionType === "Automatic") {
      basePrice += 1000;
    }
    return basePrice;
  };

  // Handle form submit
  const handleSubmit = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Body: formData.body,
          Brand: formData.brand,
          COMMON_PROBLEM: formData.commonproblem,
          City: formData.city,
          Color: formData.color,
          Engine_CC: formData.engineCc,
          Fuel: formData.engineFuelType,
          Kilometers_Driven: formData.kilometersDriven,
          Model: formData.model,
          Transmission: formData.transmissionType,
          Year: formData.year,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch predicted price");
      }

      const data = await response.json();
      setPredictedPrice(data.predicted_price);
      setShowSidebar(true);
    } catch (error) {
      console.error("Error predicting price:", error);
      alert("An error occurred while predicting the price. Please try again.");
    }
  };

  // Close sidebar
  const handleSidebarClose = () => {
    setShowSidebar(false);
  };

  
  return (
    <div className="predict-price-page">
      <div className="navbar-container" style={{ position: 'fixed', top: 0, width: '100%', backgroundColor: 'white', zIndex: 1000 }}>
        <Navbar />
      </div>

      <div style={{ paddingTop: '60px' }}>
        {/* Show sidebar only when showSidebar is true */}
        {showSidebar && (
          <AdvPriceSidebar
            price={predictedPrice ?? 0}
            onClose={handleSidebarClose}
          />
        )}

        
        <div className="form-container">
          <h1> Advanced Predict Car Price</h1>
          <VriceForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
          />

          
        </div>
      </div>
    </div>
  );
};

export default PredictPrice;
