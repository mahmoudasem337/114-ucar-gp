import { useEffect, useState } from 'react';
import axios from 'axios';
import { Users, Car, ListChecks } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { StatCard } from '../components/dashboard/StatCard';
import { mockStats } from '../data/mockData';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import  "./Dashboard.css"

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function Dashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAdvertisements, setTotalAdvertisements] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const usersResponse = await axios.get('http://localhost:8187/api/users');
        setTotalUsers(usersResponse.data.length);
        console.log(usersResponse.data.length);

        const advertisementsResponse = await axios.get('http://localhost:8187/api/advertisements');
        setTotalAdvertisements(advertisementsResponse.data.length);
        console.log(advertisementsResponse.data.length);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  const pieData = {
    labels: mockStats.carTypeDistribution.map(item => item.label),
    datasets: [
      {
        data: mockStats.carTypeDistribution.map(item => item.value),
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
      },
    ],
  };

  const barData = {
    labels: mockStats.monthlyAdvertisements.map(item => item.month),
    datasets: [
      {
        label: 'Advertisements',
        data: mockStats.monthlyAdvertisements.map(item => item.count),
        backgroundColor: '#3B82F6',
      },
    ],
  };

  return (
    <div className="dashboard-container">
      <Header title="Dashboard" onRefresh={() => window.location.reload()} />
      
      <div className="stats-grid">
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={Users}
        />
        <StatCard
          title="Total Advertisements"
          value={totalAdvertisements}
          icon={Car}
        />
        {/* <StatCard
          title="Active Listings"
          value={mockStats.activeListings}
          icon={ListChecks}
        /> */}
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <h2>Car Type Distribution</h2>
          <div className="chart-container">
            <Pie data={pieData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="chart-card">
          <h2>Monthly Advertisements</h2>
          <div className="chart-container">
            <Bar data={barData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
}
