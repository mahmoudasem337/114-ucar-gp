// src/types/carData.ts

export interface FormData {
    brand: string;
    model: string;
    engineCc: number;
    kilometersDriven: number;
    year: number;
    Car_Age: number;
    engineFuelType: string;
    city: string;
    transmissionType: string;
    color: string;
    body: string;
    commonproblem: string;
  }
  
  export interface FilterData {
    modelInput: string;
    cityInput: string;
    engineInput: string;
    filteredModels: string[];
    filteredCities: string[];
    filteredCCs: number[];
  }
  