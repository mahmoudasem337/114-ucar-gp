import React, { createContext, ReactNode, useEffect, useState } from "react";
import { Car2 } from "../types/types";
import carsData from "../data/cars.json";

export interface FilterContextType {
    filter: Record<string, any>;
    setFilter: React.Dispatch<React.SetStateAction<Record<string, any>>>;
    minPrice: number;
    setMinPrice: React.Dispatch<React.SetStateAction<number>>;
    cars: Car2[];
    setCars: React.Dispatch<React.SetStateAction<Car2[]>>;
    addCar: (car: Car2) => void;
}

export const FilterContext = createContext<FilterContextType | null>(null);

interface FilterProviderProps {
    children: ReactNode;
}

const FilterProvider: React.FC<FilterProviderProps> = ({ children }) => {
    const [filter, setFilter] = useState<Record<string, any>>({
        search: '',
        brand: '',
        yearFrom: '',
        yearTo: '',
        kilometers: '',
        bodyStyle: '',
        transmission: '',
        engineCC: '',
        vehicleStyle: '',
        city: '',
        street: '',
        district: '',
        color: '',
        brands: [], // Initialize brands as an empty array
        models: [] // Initialize models as an empty array
    });

    const [minPrice, setMinPrice] = useState<number>(0);

    const getInitialCars = () => {
        const savedCars = localStorage.getItem('carsList');
        if (savedCars) {
            try {
                const parsedCars = JSON.parse(savedCars);
                console.log('Initial cars loaded:', parsedCars);
                return Array.isArray(parsedCars) ? parsedCars : carsData.cars;
            } catch (error) {
                console.error('Error parsing saved cars:', error);
                return carsData.cars;
            }
        }
        localStorage.setItem('carsList', JSON.stringify(carsData.cars));
        return carsData.cars;
    };

    const [cars, setCars] = useState<Car2[]>(getInitialCars());

    useEffect(() => {
        console.log('Cars updated in context:', cars);
        localStorage.setItem('carsList', JSON.stringify(cars));
    }, [cars]);

    const addCar = (newCar: Car2) => {
        console.log('Adding car to context:', newCar);
        setCars(prevCars => {
            const updatedCars = [...prevCars, newCar];
            console.log('Updated cars list:', updatedCars);
            return updatedCars;
        });
    };

    const filteredCars = cars.filter((car) => {
        const searchTerm = filter.search?.toLowerCase() || '';
        const matchName = car.name?.toLowerCase().includes(searchTerm);

        const matchPrice = typeof car.price === 'number' && car.price >= minPrice;

        const matchBrand = !filter.brand || car.name?.toLowerCase().startsWith(filter.brand.toLowerCase());

        const yearFrom = filter.yearFrom ? parseInt(filter.yearFrom) : 0;
        const yearTo = filter.yearTo ? parseInt(filter.yearTo) : new Date().getFullYear();
        const carYear = car.year || new Date().getFullYear(); // Handle potential undefined year
        const matchYear = !filter.yearFrom && !filter.yearTo ? true : (
            (!filter.yearFrom || carYear >= yearFrom) && (!filter.yearTo || carYear <= yearTo)
        );

        const maxKilometers = filter.kilometers ? parseInt(filter.kilometers) : Infinity;
        const carKilometers = parseInt(car.mileage?.replace(/[^0-9]/g, '') || '0');
        const matchKilometers = !filter.kilometers ? true : (!isNaN(carKilometers) && carKilometers <= maxKilometers);

        const matchBodyStyle = !filter.bodyStyle || car.body?.toLowerCase() === filter.bodyStyle.toLowerCase();

        const matchTransmission = !filter.transmission || car.transmission?.toLowerCase() === filter.transmission.toLowerCase();

        const engineCCFilter = filter.engineCC ? parseInt(filter.engineCC) : undefined;
        const carEngineCC = car.engine ? parseInt(car.engine.toString()) : undefined;
        const matchEngineCC = engineCCFilter === undefined || (carEngineCC !== undefined && carEngineCC === engineCCFilter);

        const matchVehicleStyle = !filter.vehicleStyle || car.body?.toLowerCase() === filter.vehicleStyle.toLowerCase();

        const matchCity = !filter.city || car.location?.toLowerCase().includes(filter.city.toLowerCase());
        const matchStreet = !filter.street || car.location?.toLowerCase().includes(filter.street.toLowerCase());
        const matchDistrict = !filter.district || car.location?.toLowerCase().includes(filter.district.toLowerCase());

        const matchColor = !filter.color || car.color?.toLowerCase() === filter.color.toLowerCase();

        const result =
            matchName &&
            matchPrice &&
            matchBrand &&
            matchYear &&
            matchKilometers &&
            matchBodyStyle &&
            matchTransmission &&
            matchEngineCC &&
            matchVehicleStyle &&
            matchCity &&
            matchStreet &&
            matchDistrict &&
            matchColor;

        if (!result) {
            console.log('❌ Car filtered out:', car, filter);
        }

        return result;
    });

    return (
        <FilterContext.Provider
            value={{
                filter,
                setFilter,
                minPrice,
                setMinPrice,
                cars: filteredCars,
                setCars,
                addCar,
            }}
        >
            {children}
        </FilterContext.Provider>
    );
};

export default FilterProvider;