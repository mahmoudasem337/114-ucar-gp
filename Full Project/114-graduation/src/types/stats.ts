export interface DashboardStats {
    totalUsers: number;
    totalAdvertisements: number;
    activeListings: number;
    carTypeDistribution: {
      label: string;
      value: number;
    }[];
    monthlyAdvertisements: {
      month: string;
      count: number;
    }[];
  }