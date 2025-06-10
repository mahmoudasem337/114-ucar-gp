import React from "react";
import 'remixicon/fonts/remixicon.css';

interface SidebarProps {
  price: number; 
  onClose: () => void;
}

const AdvPriceSidebar: React.FC<SidebarProps> = ({ price, onClose }) => {

  if (price <= 0) {
    console.warn("Price is not valid. Ensure that price is set correctly.");
  }

  return (
    <div className="sidebar">
      <h2>Predicted Price:</h2>
      <div className="price-box">${price}</div>
      <button className="closse-btn" onClick={onClose} aria-label="Close sidebar">
  <i className="ri-close-line" style={{ fontSize: "24px", color: "red" }}></i>
</button>
<div>
      <div className="warning-box">
      ⚠ Important Notice: The provided values are AI-generated estimates and may not reflect the exact condition of the vehicle. Previous maintenance or repair work—especially following accidents—can significantly impact the car’s value. For a more accurate assessment, we strongly recommend visiting a certified service center to inspect the vehicle’s condition and verify any past repairs.
      </div>
    </div>
    </div>
  );
};

export default AdvPriceSidebar;
