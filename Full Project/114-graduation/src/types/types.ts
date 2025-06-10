// src/types.ts
export interface Car {
    id: number;
    img: string;
    name: string;
    rating: number;
    reviews: number;
    features: string[];
    price: string;
  }
  export interface FormData {
    username: string;
    email: string;
    password: string;
    phone: string;
    otp: string;
  }
  
  export interface Errors {
    username?: string;
    email?: string;
    password?: string;
    phone?: string;
  }
  export interface Car2 {
    id: number;
    name: string;
    fuel: string;
    mileage: string;
    body: string;
    color: string;
    transmission: string;
    year: number;
    location: string;
    price: number;
    engine: number;
    phone: string;
    description: string;
    images: string[];
  }
  



  // src/types.ts
export interface Car3 {
  id: number;
  name: string;
  fuel: string;
  mileage: string;
  body: string;
  color: string;
  transmission: string;
  year: number;
  location: string;
  price: number;
  engine: number;
  phone: string;
  description: string;
  images: string[];
}
