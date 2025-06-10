import React from "react";
import { Link } from "react-router-dom";
import 'remixicon/fonts/remixicon.css';

interface SidebarProps {
  price: number; 
  onClose: () => void;
}

const PriceSidebar: React.FC<SidebarProps> = ({ price, onClose }) => {

  if (price <= 0) {
    console.warn("Price is not valid. Ensure that price is set correctly.");
  }

  return (
    <div className="sidebar">
      <h2>Predicted Price:</h2>
      <div className="price-box">EGP{price}</div>
      <button className="closse-btn" onClick={onClose} aria-label="Close sidebar">
  <i className="ri-close-line" style={{ fontSize: "24px", color: "red" }}></i>
</button>
<div>
      <div className="warning-box">
        ⚠️ The price is based on the entered specs. If the car has any scratches or damage, use
        <strong> Advanced Prediction</strong> for more accuracy.
        <br /><br />
        If you're unsure, visit a service center and come back with details.
      </div>
      <Link to="/advprediction" className="advanced-btn">Advanced Predict</Link>
    </div>
    </div>
  );
};

export default PriceSidebar;
