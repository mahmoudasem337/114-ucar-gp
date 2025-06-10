import React, { useState } from "react";
import { FormData } from "../types/carData";
import '../styles/prediction.css'
import {
  carBrands,
  carModels,
  engineCCOptions,
  cityOptions,
  transmissionOptions,
  fuelTypes,
  body,
  color
} from "../data/formOptions";

interface Props {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  onSubmit: () => void;
}

const PriceForm: React.FC<Props> = ({ formData, setFormData, onSubmit }) => {
  const [modelInput, setModelInput] = useState<string>("");
  const [filteredModels, setFilteredModels] = useState<string[]>([]);
  
  const [engineInput, setEngineInput] = useState<string>("");
  const [filteredCCs, setFilteredCCs] = useState<string[]>([]);

  const [cityInput, setCityInput] = useState<string>("");
  const [filteredCities, setFilteredCities] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (
    value: string,
    setInput: React.Dispatch<React.SetStateAction<string>>,
    setFiltered: React.Dispatch<React.SetStateAction<string[]>>,
    options: string[],
    fieldName: keyof FormData
  ) => {
    setInput(value);
    setFiltered(options.filter(item => item.toLowerCase().includes(value.toLowerCase())));
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleSelectOption = (
    value: string,
    setInput: React.Dispatch<React.SetStateAction<string>>,
    setFiltered: React.Dispatch<React.SetStateAction<string[]>>,
    fieldName: keyof FormData
  ) => {
    setInput(value);
    setFormData(prev => ({ ...prev, [fieldName]: value }));
    setFiltered([]);
  };


  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit();
      }}
      className="form-container"
    >
      {/* Brand Input */}
      <div className="input-group">
        <label htmlFor="brand">Car Brand:</label>
        <select
          name="brand"
          value={formData.brand}
          onChange={handleChange}
        >
          <option value="">Select a brand</option>
          {carBrands.map(brand => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      {/* Model Input */}
      <div className="input-group">
        <label htmlFor="model">Car Model:</label>
        <input
          type="text"
          name="model"
          value={modelInput}
          onChange={e =>
            handleInputChange(
              e.target.value,
              setModelInput,
              setFilteredModels,
              carModels,
              "model"
            )
          }
        />
        {filteredModels.length > 0 && (
          <ul className="autocomplete-options">
            {filteredModels.map((model, index) => (
              <li
                key={index}
                onClick={() =>
                  handleSelectOption(
                    model,
                    setModelInput,
                    setFilteredModels,
                    "model"
                  )
                }
              >
                {model}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Engine CC Input */}
      <div className="input-group">
        <label htmlFor="engineCc">Engine CC:</label>
        <input
          type="text"
          name="engineCc"
          value={engineInput}
          onChange={e =>
            handleInputChange(
              e.target.value,
              setEngineInput,
              setFilteredCCs,
              engineCCOptions,
              "engineCc"
            )
          }
        />
        {filteredCCs.length > 0 && (
          <ul className="autocomplete-options">
            {filteredCCs.map((cc, index) => (
              <li
                key={index}
                onClick={() =>
                  handleSelectOption(
                    cc,
                    setEngineInput,
                    setFilteredCCs,
                    "engineCc"
                  )
                }
              >
                {cc}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="input-group">
  <label htmlFor="body">Body</label>
  <select
    id="body"
    name="body"
    value={formData.body}
    onChange={handleChange}
    required
  >
    <option value="">Select a body type</option>
    {body.map((body) => (
      <option key={body} value={body}>
        {body}
      </option>
    ))}
  </select>
</div>
<div className="input-group">
  <label htmlFor="engineFuelType">Engine Fuel Type:</label>
  <select
    id="engineFuelType"
    name="engineFuelType"
    value={formData.engineFuelType}
    onChange={handleChange}
    required
  >
    <option value="">Select fuel type</option>
    {fuelTypes.map((fuel) => (
      <option key={fuel} value={fuel}>
        {fuel}
      </option>
    ))}
  </select>
</div>

      {/* City Input */}
      <div className="input-group">
        <label htmlFor="city">City:</label>
        <input
          type="text"
          name="city"
          value={cityInput}
          onChange={e =>
            handleInputChange(
              e.target.value,
              setCityInput,
              setFilteredCities,
              cityOptions,
              "city"
            )
          }
        />
        {filteredCities.length > 0 && (
          <ul className="autocomplete-options">
            {filteredCities.map((city, index) => (
              <li
                key={index}
                onClick={() =>
                  handleSelectOption(
                    city,
                    setCityInput,
                    setFilteredCities,
                    "city"
                  )
                }
              >
                {city}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Transmission Type */}
      <div className="input-group">
        <label htmlFor="transmissionType">Transmission</label>
        <select
          name="transmissionType"
          value={formData.transmissionType}
          onChange={handleChange}
          required
        >
          <option value="">Select Transmission Type</option>
          {transmissionOptions.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
      <div className="input-group">
  <label htmlFor="color">Color:</label>
  <select
    id="color"
    name="color"
    value={formData.color}
    onChange={handleChange}
    required
  >
    <option value="">Select a color</option>
  {color.map((color) => (
      <option key={color} value={color}>
        {color}
      </option>
    ))}
  </select>
</div>
<div className="input-group">
  <label htmlFor="year">Year: {formData.year}</label>
  <div className="range-container">
    <button
      type="button"
      onClick={() =>
        setFormData((prev) => ({
          ...prev,
          year: Math.max(1964, prev.year - 1),
        }))
      }
    >
      -
    </button>

    <input
      type="range"
      id="year"
      name="year"
      min="1964"
      max="2023"
      value={formData.year}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          year: Number(e.target.value),
        }))
      }
    />

    <button
      type="button"
      onClick={() =>
        setFormData((prev) => ({
          ...prev,
          year: Math.min(2023, prev.year + 1),
        }))
      }
    >
      +
    </button>
  </div>
</div>
<div className="input-group">
  <label htmlFor="kilometersDriven">Kilometers Driven</label>
  <div className="range-container">
    <button
      type="button"
      onClick={() =>
        setFormData((prev) => ({
          ...prev,
          kilometersDriven: Math.max(0, prev.kilometersDriven - 1),
        }))
      }
    >
      -
    </button>

    <input
      type="range"
      id="kilometersDriven"
      name="kilometersDriven"
      min="0"
      max="520000"
      step="1000"
      value={formData.kilometersDriven}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          kilometersDriven: Number(e.target.value),
        }))
      }
    />

    <button
      type="button"
      onClick={() =>
        setFormData((prev) => ({
          ...prev,
          kilometersDriven: Math.min(520000, prev.kilometersDriven + 1),
        }))
      }
    >
      +
    </button>
  </div>
  <span>{formData.kilometersDriven} km</span>
</div>
<div className="input-group">
  <label htmlFor="Car_Age">
    Car Age: {formData.Car_Age} years
  </label>
  <div className="range-container">
    <button
      type="button"
      onClick={() =>
        setFormData((prev) => ({
          ...prev,
          Car_Age: Math.max(2, prev.Car_Age - 1),
        }))
      }
    >
      -
    </button>

    <input
      type="range"
      id="Car_Age"
      name="Car_Age"
      min="2"
      max="61"
      value={formData.Car_Age}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          Car_Age: Number(e.target.value),
        }))
      }
      className="range-slider"
    />

    <button
      type="button"
      onClick={() =>
        setFormData((prev) => ({
          ...prev,
          Car_Age: Math.min(61, prev.Car_Age + 1),
        }))
      }
    >
      +
    </button>
  </div>
</div>
      <button type="submit" className="submit-btn">
        Predict
      </button>
    </form>
  );
};

export default PriceForm;
