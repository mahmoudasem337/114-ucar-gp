import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, Video, Settings } from 'lucide-react';
import './Sidebar.css'; // استيراد ملف التنسيق

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Users', path: '/users' },
  { icon: Users, label: 'Review', path: '/Reviewadmin' },
  { icon: FileText, label: 'Articles', path: '/articles' },
  { icon: FileText, label: 'Advertisements', path: '/advertisements' },
  { icon: Video, label: 'Videos', path: '/videos' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">
      <div className='head'>
        <h1 className="sidebar__logo">UCar</h1>
        {/* <div className="sidebar__search">
          <input
            type="text"
            placeholder="Search"
            className="sidebar__search-input"
          />
        </div> */}

        <div><input
            type="text"
            placeholder="Search"
            className="sidebar__search-input"
          /></div>

        <nav className="sidebar__nav">
          {navItems.map(({ icon: Icon, label, path }) => (
            <Link
              key={path}
              to={path}
              className={`sidebar__link ${location.pathname === path ? 'sidebar__link--active' : ''}`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
        </nav>
      </div>

      <div className="sidebar__footer">
        {/* <div className="sidebar__profile">
          <img
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces"
            alt="Profile"
            className="sidebar__profile-image"
          />
          <span className="sidebar__profile-name">Olivia Williams</span>
        </div> */}
        <button
          className="mt-10 sidebar__logout-button" 
          onClick={() => {
            localStorage.removeItem('username');
            localStorage.removeItem('id');
            localStorage.setItem('role', 'ROLE_USER');
            window.location.reload();
          }}
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
