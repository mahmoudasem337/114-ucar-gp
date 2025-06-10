import { User } from '../types/user';
import { DashboardStats } from '../types/stats';
import { Article } from '../types/article';
import { Video } from '../types/video'

export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Esther Howard',
    type: 'User',
    email: 'esther.howard@example.com',
    phoneNumber: '+1-234-567-8901'
  },
  {
    id: '2',
    name: 'David Miller',
    type: 'User',
    email: 'david.miller@example.com',
    phoneNumber: '+1-234-567-8902'
  },
  {
    id: '3',
    name: 'Jane Doe',
    type: 'User',
    email: 'jane.doe@example.com',
    phoneNumber: '+1-234-567-8903'
  },
  {
    id: '4',
    name: 'John Smith',
    type: 'User',
    email: 'john.smith@example.com',
    phoneNumber: '+1-234-567-8904'
  },
  {
    id: '5',
    name: 'Emily Johnson',
    type: 'User',
    email: 'emily.johnson@example.com',
    phoneNumber: '+1-234-567-8905'
  }
];

export const mockStats: DashboardStats = {
  totalUsers: 1250,
  totalAdvertisements: 3450,
  activeListings: 890,
  carTypeDistribution: [
    { label: 'SUV', value: 38 },
    { label: 'Sedan', value: 31 },
    { label: 'Hatchback', value: 21 },
    { label: 'Other', value: 10 }
  ],
  monthlyAdvertisements: [
    { month: 'Jan', count: 65 },
    { month: 'Feb', count: 85 },
    { month: 'Mar', count: 95 },
    { month: 'Apr', count: 75 },
    { month: 'May', count: 90 },
    { month: 'Jun', count: 100 }
  ]
};

export const mockArticles: Article[] = [
  {
    id: '1',
    title: 'Top 10 SUVs in 2025',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    createdAt: '2025-03-15',
    author: 'John Smith'
  },
  {
    id: '2',
    title: 'Electric Cars: The Future of Transportation',
    content: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
    createdAt: '2025-03-14',
    author: 'Emily Johnson'
  },
  {
    id: '3',
    title: 'Car Maintenance Tips for Beginners',
    content: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco...',
    createdAt: '2025-03-13',
    author: 'David Miller'
  }
];

export const mockVideos: Video[] = [
  {
    id: '1',
    title: '2025 Model X Review',
    description: 'A comprehensive review of the latest Model X features',
    url: 'https://example.com/video1',
    thumbnail: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=300&q=80',
    createdAt: '2025-03-15'
  },
  {
    id: '2',
    title: 'DIY Car Maintenance',
    description: 'Learn basic car maintenance tips and tricks',
    url: 'https://example.com/video2',
    thumbnail: 'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=300&q=80',
    createdAt: '2025-03-14'
  },
  {
    id: '3',
    title: 'Electric vs Gas Cars',
    description: 'Comparing the pros and cons of electric and gas vehicles',
    url: 'https://example.com/video3',
    thumbnail: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c3?auto=format&fit=crop&w=300&q=80',
    createdAt: '2025-03-13'
  }
];