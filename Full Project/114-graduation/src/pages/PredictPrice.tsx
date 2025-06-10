import React, { useState } from "react";
import PriceForm from "../components/PriceForm";
import Sidebar from "../components/PriceSidebar";
import { FormData } from "../types/carData";
import '../styles/prediction.css';
import 'remixicon/fonts/remixicon.css';
import Navbar from "../components/Navbar";

const PredictPrice: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    brand: "",
    model: "",
    engineCc: 0,
    city: "",
    transmissionType: "",
    body: "",
    engineFuelType: '',
    year: 2020,
    kilometersDriven: 0,
    Car_Age: 2,
    color: "",
    commonproblem:"",
  });

  const [predictedPrice, setPredictedPrice] = useState<number | null>(null);
  const [showSidebar, setShowSidebar] = useState<boolean>(false); // Sidebar visibility state

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/predict/gradient_boosting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Engine_CC: formData.engineCc,
          Car_Age: formData.Car_Age,
          Brand: formData.brand,
          Model: formData.model,
          Kilometers_Driven: formData.kilometersDriven,
          Transmission: formData.transmissionType
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

  const handleSidebarClose = () => {
    setShowSidebar(false); // Hide sidebar
  };

  return (
    <div className="predict-price-page">
      <div className="navbar-container" style={{ position: 'fixed', top: 0, width: '100%', backgroundColor: 'white', zIndex: 1000 }}>
        <Navbar />
      </div>

      <div style={{ paddingTop: '60px' }}> 
        {/* Show sidebar only when showSidebar is true */}
        {showSidebar && (
          <Sidebar
            price={predictedPrice ?? 0}
            onClose={handleSidebarClose}
          />
        )}

        <div className="form-container">
          <h1>Predict Car Price</h1>
          <PriceForm
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
