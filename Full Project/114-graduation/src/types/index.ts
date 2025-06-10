export interface Review {
    id: string;
    carMake: string;
    carModel: string;
    carYear: string;
    review: string;
    reviewedOn: string;
    reviewedBy: string;
  }
  
  export interface User {
    id: string;
    name: string;
    email: string;
    advertisements: string[];
  }