import React, { useContext, useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { FilterContext } from '../context/filterProvider';
import { Car2 } from '../types/types';
import ProductCard from '../components/ProductCard';
import './CarListings.css';
import Filters from '../components/Filters';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function CarListings() {
    const context = useContext(FilterContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [displayedCars, setDisplayedCars] = useState<Car2[]>([]);
    const [allCars, setAllCars] = useState<Car2[]>([]); // State to store the original list of cars
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    if (!context) {
        throw new Error("filter context must be wrapped inside filterProvider");
    }

    useEffect(() => {
        const fetchCars = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:8187/api/advertisements');
                const carsData = response.data.map((ad: any) => ({
                    id: ad.advertisementId,
                    name: `${ad.carMake} ${ad.carModel}`,
                    price: ad.carPrice,
                    year: ad.carProductionYear,
                    mileage: ad.kilometers,
                    transmission: ad.carTransmissionType,
                    fuel: ad.carFuelType,
                    body: ad.carBodyType,
                    color: ad.carColor,
                    phonenumber: ad.ownerPhoneNumber,
                    description: ad.carDescription,
                    engine: ad.engineCapacity,
                    location: ad.ownerLocation,
                    images: ad.imageUrls,
                }));
                setAllCars(carsData); // Store the original list of cars
                setDisplayedCars(carsData); // Display all cars initially

                const minPrice = Math.min(...carsData.map(car => car.price));
                const maxPrice = Math.max(...carsData.map(car => car.price));

                // Extract unique brands and models from the fetched data
                const uniqueBrands = [...new Set(carsData.map(car => car.name.split(' ')[0]))];
                const uniqueModels = [...new Set(carsData.map(car => car.name.split(' ').slice(1).join(' ')))];
                console.log('Unique Brands:', uniqueBrands);
                console.log('Unique Models:', uniqueModels);

                context?.setFilter(prev => ({
                    ...prev,
                    brands: uniqueBrands,
                    models: uniqueModels,
                    minPrice,
                    maxPrice
                }));

                setError(null);
            } catch (err) {
                setError('Failed to load cars data');
                console.error('Error loading cars:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCars();
    }, []); // Fetch cars on component mount

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setDisplayedCars(allCars); // Reset to all cars when search query is empty
        } else {
            const filteredCars = allCars.filter((car) =>
                car.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setDisplayedCars(filteredCars);
        }
    }, [searchQuery, allCars]); // Filter cars when searchQuery changes

    useEffect(() => {
        const applyFilters = () => {
            if (!context) return;

            const { filter } = context;
            const filteredCars = allCars.filter((car) => {
                const matchesBrand = !filter.brand || car.name.toLowerCase().includes(filter.brand.toLowerCase());
                const matchesYear = (!filter.yearFrom || car.year >= parseInt(filter.yearFrom)) &&
                                   (!filter.yearTo || car.year <= parseInt(filter.yearTo));
                const matchesPrice = (!filter.minPrice || car.price >= filter.minPrice);
                const matchesKilometers = !filter.kilometers || car.mileage <= parseInt(filter.kilometers);
                const matchesBodyStyle = !filter.bodyStyle || car.body.toLowerCase() === filter.bodyStyle.toLowerCase();
                const matchesTransmission = !filter.transmission || car.transmission.toLowerCase() === filter.transmission.toLowerCase();
                const matchesFuel = !filter.fuel || car.fuel.toLowerCase() === filter.fuel.toLowerCase();

                return matchesBrand && matchesYear && matchesPrice && matchesKilometers && matchesBodyStyle && matchesTransmission && matchesFuel;
            });

            setDisplayedCars(filteredCars);
        };

        applyFilters();
    }, [context?.filter, allCars]); // Reapply filters when filter criteria or car data changes

    if (loading) {
        return <div className="loading-message">Loading cars...</div>;
    }

    if (error) {
        return (
            <div className="error-message">
                <h3>Error loading car advertisements</h3>
                <p>{error}</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    return (
        <div className="car-listings-page">
            <div className="car-listings-container">
                <div className="car-listings-wrapper">
                    <div className="header-section">
                        <div className="logo-container">
                            <div className="nav__logo">
                                <Link to="/" className="logo">
                                    <img src="assets/logo-white.png" alt="logo" className="logo-white" />
                                    <img src="assets/logo-dark.png" alt="logo" className="logo-dark" />
                                </Link>
                            </div>
                            <h1 className="page-title">Advertisements</h1>
                        </div>
                        <div className="search-container">
                            <input
                                type="text"
                                placeholder="Search cars..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="search-input"
                            />
                            <Search className="search-icon" size={20} />
                        </div>
                    </div>

                    <div className="main-grid">
                        <div className="filters-section">
                            <Filters brands={context.filter.brands || []} />
                        </div>

                        <div className="cards-grid">
                            {displayedCars.length > 0 ? (
                                displayedCars.map((car: Car2) => (
                                    <ProductCard key={car.id} car={car} />
                                ))
                            ) : (
                                <p>No cars found matching your search</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}