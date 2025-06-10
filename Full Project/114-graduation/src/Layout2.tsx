
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './pages/Dashboard';
import { Users } from './pages/Users';
import { Articles } from './pages/Articles';
import { Videos } from './pages/Videos';
import { Settings } from './pages/Settings';
import { Reviewadmin } from './pages/Reviewadmin';
import { Advertisements } from './pages/Advertisements';

import './Layout2.css'; // نستورد ملف السي اس اس الجديد

function Layout2() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/reviewadmin" element={<Reviewadmin />} />
            <Route path="/articles" element={<Articles />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/advertisements" element={<Advertisements />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default Layout2;
