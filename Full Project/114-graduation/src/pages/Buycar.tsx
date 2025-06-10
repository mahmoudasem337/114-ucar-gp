import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CarFront } from 'lucide-react';
// import Navbar from "../components/NavbarC";
import HowItWorks from "../components/HowItWorks";
import { FilterContext } from "../context/filterProvider";
import { Car2 } from "../types/types";

interface FormData {
  brand: string;
  model: string;
  year: string;
  price: string;
  mileage: string;
  transmission: string;
  description: string;
  phone: string;
  engineFuelType: string;
  vehicleStyle: string;
  color: string;
  city: string;
  street: string;
  district: string;
  imageFile: File | null;
  engineCC: string;
}

export default function Home() {
    const navigate = useNavigate();
    const filterContext = useContext(FilterContext);
    const [formData, setFormData] = useState<FormData>({
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
        imageFile: null,
        engineCC: '',
    });

    const [errors, setErrors] = useState<Partial<FormData>>({});

    const validateForm = () => {
        const newErrors: Partial<FormData> = {};
        
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (validateForm() && filterContext) {
            const newCar: Car2 = {
                id: Date.now(),
                name: `${formData.brand} ${formData.model}`,
                fuel: formData.engineFuelType,
                mileage: formData.mileage,
                body: formData.vehicleStyle,
                color: formData.color,
                transmission: formData.transmission,
                year: parseInt(formData.year),
                location: `${formData.city}, ${formData.district}, ${formData.street}`,
                price: parseInt(formData.price),
                engine: parseInt(formData.engineCC),
                phone: formData.phone,
                description: formData.description,
                images: formData.imageFile ? [URL.createObjectURL(formData.imageFile)] : ['/images/default-car.jpg']
            };

            filterContext.addCar(newCar);
            navigate('/cars');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    return (
        <div>
            {/* <Navbar /> */}
            
            <div className="min-h-screen bg-cover bg-center" style={{ backgroundImage: "url('/images/car-bg.jpg')" }}>
                <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 mb-6">
                        <CarFront className="text-purple-600" size={28} />
                        <h1 className="text-2xl font-bold text-purple-600">Sell Your Car</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Brand</label>
                                <input
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    placeholder="e.g. Toyota"
                                    className={`mt-1 block w-full rounded-md border ${errors.brand ? 'border-red-500' : 'border-gray-300'} p-2`}
                                />
                                {errors.brand && <p className="mt-1 text-sm text-red-500">{errors.brand}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Model</label>
                                <input
                                    type="text"
                                    name="model"
                                    value={formData.model}
                                    onChange={handleChange}
                                    placeholder="e.g. Corolla"
                                    className={`mt-1 block w-full rounded-md border ${errors.model ? 'border-red-500' : 'border-gray-300'} p-2`}
                                />
                                {errors.model && <p className="mt-1 text-sm text-red-500">{errors.model}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Engine CC</label>
                                <input
                                    type="text"
                                    name="engineCC"
                                    value={formData.engineCC}
                                    onChange={handleChange}
                                    placeholder="e.g. 1600"
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Kilometers Driven</label>
                                <input
                                    type="number"
                                    name="mileage"
                                    value={formData.mileage}
                                    onChange={handleChange}
                                    placeholder="e.g. 50000"
                                    className={`mt-1 block w-full rounded-md border ${errors.mileage ? 'border-red-500' : 'border-gray-300'} p-2`}
                                />
                                {errors.mileage && <p className="mt-1 text-sm text-red-500">{errors.mileage}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Year</label>
                                <input
                                    type="number"
                                    name="year"
                                    value={formData.year}
                                    onChange={handleChange}
                                    placeholder="e.g. 2020"
                                    className={`mt-1 block w-full rounded-md border ${errors.year ? 'border-red-500' : 'border-gray-300'} p-2`}
                                />
                                {errors.year && <p className="mt-1 text-sm text-red-500">{errors.year}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Vehicle Style</label>
                                <input
                                    type="text"
                                    name="vehicleStyle"
                                    value={formData.vehicleStyle}
                                    onChange={handleChange}
                                    placeholder="e.g. Sedan"
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Engine Fuel Type</label>
                                <input
                                    type="text"
                                    name="engineFuelType"
                                    value={formData.engineFuelType}
                                    onChange={handleChange}
                                    placeholder="e.g. Petrol"
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Transmission Type</label>
                                <select
                                    name="transmission"
                                    value={formData.transmission}
                                    onChange={handleChange}
                                    className={`mt-1 block w-full rounded-md border ${errors.transmission ? 'border-red-500' : 'border-gray-300'} p-2`}
                                >
                                    <option value="">Select transmission</option>
                                    <option value="Automatic">Automatic</option>
                                    <option value="Manual">Manual</option>
                                </select>
                                {errors.transmission && <p className="mt-1 text-sm text-red-500">{errors.transmission}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Color</label>
                                <input
                                    type="text"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleChange}
                                    placeholder="e.g. Red"
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Your City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    placeholder="e.g. Cairo"
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Your District</label>
                                <input
                                    type="text"
                                    name="district"
                                    value={formData.district}
                                    onChange={handleChange}
                                    placeholder="e.g. Nasr City"
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Your Street</label>
                                <input
                                    type="text"
                                    name="street"
                                    value={formData.street}
                                    onChange={handleChange}
                                    placeholder="e.g. 12th Street"
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="e.g. 01001234567"
                                    className={`mt-1 block w-full rounded-md border ${errors.phone ? 'border-red-500' : 'border-gray-300'} p-2`}
                                />
                                {errors.phone && <p className="mt-1 text-sm text-red-500">{errors.phone}</p>}
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Car Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Describe your car"
                                    className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Choose Images</label>
                                <input
                                    type="file"
                                    name="imageFile"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0] || null;
                                        setFormData(prev => ({ ...prev, imageFile: file }));
                                    }}
                                    accept="image/*"
                                    multiple
                                    className="mt-1 block w-full"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700">Car Price</label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    placeholder="e.g. 450000"
                                    className={`mt-1 block w-full rounded-md border ${errors.price ? 'border-red-500' : 'border-gray-300'} p-2`}
                                />
                                {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
                            </div>
                        </div>

                        <div className="mt-6">
                            <button
                                type="submit"
                                className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors"
                            >
                                Submit Listing
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <HowItWorks />
        </div>
    );
}
