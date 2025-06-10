import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CarFront } from 'lucide-react';
import { FilterContext } from '../context/filterProvider.tsx';
import { Car2 } from '../types/types';
import './SellCar.css';
import HowItWorks from '../components/HowItWorks';
import Carcover from '../assets/imgs/car2.jpg';
import Heroo from '../components/Heroo'

export default function SellCar() {
  const navigate = useNavigate();
  const context = useContext(FilterContext);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    year: '',
    price: '',
    mileage: '',
    transmission: '',
    description: '',
    phone: '',
    engineFuelType: '',
    vehicleStyle: '',
    color: '',
    city: '',
    street: '',
    district: '',
    imageFiles: null as FileList | null,
    engineCC: '',
  });
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [errors, setErrors] = useState<Partial<typeof formData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!context) {
    throw new Error("filter context must be wrapped inside filterProvider");
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, imageFiles: e.target.files });
      setPreviewUrls(Array.from(e.target.files).map(file => URL.createObjectURL(file)));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<typeof formData> = {};
    if (!formData.brand) newErrors.brand = 'Brand is required';
    if (!formData.model) newErrors.model = 'Model is required';
    if (!formData.year) newErrors.year = 'Year is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.mileage) newErrors.mileage = 'Mileage is required';
    if (!formData.transmission) newErrors.transmission = 'Transmission is required';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const username = localStorage.getItem("username");

    if (!username) {
      alert("You must be logged in to post an advertisement.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData object to handle multipart/form-data
      const formDataToSend = new FormData();
      
      const advertisementData = {
        ownerLocation: `${formData.city}${formData.district ? ', ' + formData.district : ''}`,
        carColor: formData.color,
        carBodyType: formData.vehicleStyle,
        carDescription: formData.description,
        carMake: formData.brand,
        carModel: formData.model,
        carFuelType: formData.engineFuelType,
        carPrice: parseFloat(formData.price),
        carProductionYear: parseInt(formData.year),
        carTransmissionType: formData.transmission,
        engineCapacity: formData.engineCC ? parseFloat(formData.engineCC) : 0,
        kilometers: parseInt(formData.mileage),
        ownerPhoneNumber: formData.phone,
        ownerName: username
      };

      // Add the advertisement data as JSON string in a part named 'advertisement'
      formDataToSend.append('advertisement', new Blob([JSON.stringify(advertisementData)], {
        type: 'application/json'
      }));
      
      // Add each image file to the form data as part of 'images'
      if (formData.imageFiles) {
        Array.from(formData.imageFiles).forEach(file => {
          formDataToSend.append('images', file);
        });
      }

      console.log("Sending advertisement data:", advertisementData);


      const response = await fetch("http://localhost:8187/api/advertisements", {
        method: "POST",
        body: formDataToSend,
        // Do not set Content-Type header, the browser will set it automatically with the boundary
      });

      console.log("Response Status:", response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server Error:", errorText);
        throw new Error("Failed to post advertisement");
      }

      alert("Advertisement posted successfully!");
      navigate("/cars");
    } catch (error) {
      console.error("Error posting advertisement:", error);
      alert("An error occurred while posting the advertisement. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };
  
  return (
    <>
      <Heroo/>

      <div className="sell-car-page">
        <div className="sell-car-bg-container" style={{ backgroundImage: `url(${Carcover})` }}>
          <div className="form-main-container">
            <div className="form-header-container">
              <CarFront className="form-header-icon" />
              <h1 className="form-main-title">Sell Your Car</h1>
            </div>
            
            <form onSubmit={handleSubmit} className="sell-car-form" encType="multipart/form-data">
              <div className="form-grid-layout">
                <div className="form-group-item">
                  <label className="form-input-label">Brand</label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    placeholder="e.g. Toyota"
                    className={`form-input-field ${errors.brand ? 'error' : ''}`}
                  />
                  {errors.brand && <p className="error-message-text">{errors.brand}</p>}
                </div>
                
                <div className="form-group-item">
                  <label className="form-input-label">Model</label>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    placeholder="e.g. Corolla"
                    className={`form-input-field ${errors.model ? 'error' : ''}`}
                  />
                  {errors.model && <p className="error-message-text">{errors.model}</p>}
                </div>

                <div className="form-group-item">
                  <label className="form-input-label">Engine CC</label>
                  <input
                    type="text"
                    name="engineCC"
                    value={formData.engineCC}
                    onChange={handleChange}
                    placeholder="e.g. 1600"
                    className="form-input-field"
                  />
                </div>

                <div className="form-group-item">
                  <label className="form-input-label">Kilometers Driven</label>
                  <input
                    type="number"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleChange}
                    placeholder="e.g. 50000"
                    className={`form-input-field ${errors.mileage ? 'error' : ''}`}
                  />
                  {errors.mileage && <p className="error-message-text">{errors.mileage}</p>}
                </div>

                <div className="form-group-item">
                  <label className="form-input-label">Year</label>
                  <input
                    type="number"
                    name="year"
                    value={formData.year}
                    onChange={handleChange}
                    placeholder="e.g. 2020"
                    className={`form-input-field ${errors.year ? 'error' : ''}`}
                  />
                  {errors.year && <p className="error-message-text">{errors.year}</p>}
                </div>

                <div className="form-group-item">
                  <label className="form-input-label">Vehicle Style</label>
                  <input
                    type="text"
                    name="vehicleStyle"
                    value={formData.vehicleStyle}
                    onChange={handleChange}
                    placeholder="e.g. Sedan"
                    className="form-input-field"
                  />
                </div>

                <div className="form-group-item">
                  <label className="form-input-label">Engine Fuel Type</label>
                  <input
                    type="text"
                    name="engineFuelType"
                    value={formData.engineFuelType}
                    onChange={handleChange}
                    placeholder="e.g. Petrol"
                    className="form-input-field"
                  />
                </div>

                <div className="form-group-item">
                  <label className="form-input-label">Transmission Type</label>
                  <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleChange}
                    className={`form-select-field ${errors.transmission ? 'error' : ''}`}
                  >
                    <option value="">Select transmission</option>
                    <option value="Automatic">Automatic</option>
                    <option value="Manual">Manual</option>
                  </select>
                  {errors.transmission && <p className="error-message-text">{errors.transmission}</p>}
                </div>

                <div className="form-group-item">
                  <label className="form-input-label">Color</label>
                  <input
                    type="text"
                    name="color"
                    value={formData.color}
                    onChange={handleChange}
                    placeholder="e.g. Red"
                    className="form-input-field"
                  />
                </div>

                <div className="form-group-item">
                  <label className="form-input-label">Your City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Cairo"
                    className="form-input-field"
                  />
                </div>

                <div className="form-group-item">
                  <label className="form-input-label">Your District</label>
                  <input
                    type="text"
                    name="district"
                    value={formData.district}
                    onChange={handleChange}
                    placeholder="e.g. Nasr City"
                    className="form-input-field"
                  />
                </div>

                <div className="form-group-item">
                  <label className="form-input-label">Your Street</label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="e.g. 12th Street"
                    className="form-input-field"
                  />
                </div>

                <div className="form-group-item full-width-column">
                  <label className="form-input-label">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="e.g. 01001234567"
                    className={`form-input-field ${errors.phone ? 'error' : ''}`}
                  />
                  {errors.phone && <p className="error-message-text">{errors.phone}</p>}
                </div>

                <div className="form-group-item full-width-column">
                  <label className="form-input-label">Car Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your car"
                    rows={4}
                    className="form-textarea-field"
                  />
                </div>

                <div className="form-group-item">
                  <label className="form-input-label">Car Price</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g. 450000"
                    className={`form-input-field ${errors.price ? 'error' : ''}`}
                  />
                  {errors.price && <p className="error-message-text">{errors.price}</p>}
                </div>

                <div className="form-group-item full-width-column">
                  <label className="form-input-label">Choose Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    name="imageFiles"
                    onChange={handleImageChange}
                    className="form-input-field"
                  />
                  {previewUrls.length > 0 && (
                    <div className="image-previews-container">
                      {previewUrls.map((url, index) => (
                        <img
                          key={index}
                          src={url}
                          alt={`Preview ${index + 1}`}
                          className="preview-image-item"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group-item full-width-column">
                <button
                  type="submit"
                  className="submit-button-main"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Add Advertisement'}
                </button>
              </div>
            </form>
          </div>
          
        </div>
        <HowItWorks />
      </div>
    </>
  );
}