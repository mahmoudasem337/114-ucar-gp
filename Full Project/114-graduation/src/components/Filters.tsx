import React, { useContext } from "react";
import { FilterContext } from "../context/filterProvider";
import './Filters.css'; // استيراد ملف الـ CSS

export default function Filters({ brands }: { brands: string[] }) {
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 30 }, (_, i) => currentYear - i);
    const context = useContext(FilterContext);
    if (!context) {
        throw new Error("FilterContext must be used within a FilterProvider");
    }
    console.log(context);
    const { filter, setFilter, minPrice, setMinPrice } = context; // Removed brands from context

    const minCarPrice = 0; // Replace with the actual minimum car price from the data
    const maxCarPrice = 10000000; // Replace with the actual maximum car price from the data

    const handleFilterChange = (name: string, value: any) => {
        setFilter((prevFilter) => ({
            ...prevFilter,
            [name]: value
        }));
    };

    return (
        <div className="filters-container">
            <div>
                <label className="filter-label">
                    Price
                </label>
                <div className="price-range-container">
                    <input
                        type="range"
                        className="price-range-input"
                        min={minCarPrice}
                        max={maxCarPrice}
                        step="1000"
                        value={minPrice}
                        onChange={(e) => {
                            const value = Number(e.target.value);
                            setMinPrice(value);
                            handleFilterChange('minPrice', value);
                            const progress = ((value - minCarPrice) / (maxCarPrice - minCarPrice)) * 100;
                            e.target.style.setProperty('--progress', `${progress}%`);
                        }}
                        style={{ '--progress': `${((minPrice - minCarPrice) / (maxCarPrice - minCarPrice)) * 100}%` as React.CSSProperties['--progress'] }}
                    />
                    <div className="price-value">
                        {minPrice.toLocaleString()} $
                    </div>
                </div>
            </div>

            <div>
                <label className="filter-label">
                    Brand & Model
                </label>
                <div className="brand-checkbox-container">
                    {brands.map((brand) => (
                        <div key={brand}>
                            <input
                                type="checkbox"
                                id={brand}
                                className="brand-checkbox"
                                checked={filter.brand === brand}
                                onChange={(e) => handleFilterChange('brand', e.target.checked ? brand : '')}
                            />
                            <label htmlFor={brand} className="brand-label">
                                {brand}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="year-select-container">
                <label className="filter-label">
                    Year
                </label>
                <div>
                    <label className="year-select-label">From</label>
                    <select
                        className="year-select"
                        value={filter.yearFrom || ''}
                        onChange={(e) => handleFilterChange('yearFrom', e.target.value)}
                    >
                        <option value="">Select Year</option>
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="year-select-label">To</label>
                    <select
                        className="year-select"
                        value={filter.yearTo || ''}
                        onChange={(e) => handleFilterChange('yearTo', e.target.value)}
                    >
                        <option value="">Select Year</option>
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="filter-label">
                    Kilometers
                </label>
                <select
                    className="kilometers-select"
                    value={filter.kilometers || ''}
                    onChange={(e) => handleFilterChange('kilometers', e.target.value)}
                >
                    <option value="">Select Kilometers</option>
                    <option value="10000">10,000 KM & Less</option>
                    <option value="20000">20,000 KM & Less</option>
                    <option value="50000">50,000 KM & Less</option>
                </select>
            </div>

            <div>
                <label className="filter-label">
                    Body Style
                </label>
                <select
                    className="body-style-select"
                    value={filter.bodyStyle || ''}
                    onChange={(e) => handleFilterChange('bodyStyle', e.target.value)}
                >
                    <option value="">Select Body Style</option>
                    <option value="4x4">4x4</option>
                    <option value="sedan">Sedan</option>
                    <option value="suv">SUV</option>
                    <option value="hatchback">Hatchback</option>
                </select>
            </div>

            <div>
                <label className="filter-label">
                    Transmission
                </label>
                <select
                    className="transmission-select"
                    value={filter.transmission || ''}
                    onChange={(e) => handleFilterChange('transmission', e.target.value)}
                >
                    <option value="">Select Transmission</option>
                    <option value="automatic">Automatic</option>
                    <option value="manual">Manual</option>
                </select>
            </div>
        </div>
    );
}