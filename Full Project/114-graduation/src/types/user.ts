export interface User {
    id: string;
    name: string;
    type: 'Admin' | 'User';
    email: string;
    phoneNumber: string;
  }