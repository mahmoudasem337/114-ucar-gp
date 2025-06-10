import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import 'remixicon/fonts/remixicon.css';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    setUsername(storedUsername);
  }, []);

  const toggleMenu = (): void => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <nav>
      <div className="nav__header">
        <div className="nav__logo">
          <Link to="/" className="logo">
            <img src="assets/logo-white.png" alt="logo" className="logo-white" />
            <img src="assets/logo-dark.png" alt="logo" className="logo-dark" />
            <span>UCAR</span>
          </Link>
        </div>

        <div className={`nav__menu__btn ${isMenuOpen ? 'hide' : ''}`} id="menu-btn" onClick={toggleMenu}>
          <i className="ri-menu-line"></i>
        </div>
      </div>

      <ul className={`nav__links ${isMenuOpen ? 'nav__links--open' : ''}`} id="nav-links">
        <li><Link to="#home" onClick={toggleMenu}>Home</Link></li>
        <li><a href="#about" onClick={toggleMenu}>About</a></li>
        <li><a href="#deals" onClick={toggleMenu}>Recommendations</a></li>
        <li><a href="#choose" onClick={toggleMenu}>Why Choose Us</a></li>
        <li><Link to="/sell-car" onClick={toggleMenu}>Sell Car</Link></li>
        <li><Link to="/PredictPrice" onClick={toggleMenu}>Price prediction</Link></li>
        <li><Link to="/reviews" onClick={toggleMenu}>Review</Link></li>
        <li><Link to="/cars" onClick={toggleMenu}>Buy Car</Link></li>
        <li><Link to="/Login" className="btn" onClick={toggleMenu}>Login</Link></li>
        
        {username && (
          <div className="nav__profile-icon">
            <Link to="/profile">
              <i className="ri-user-fill"></i>
            </Link>
          </div>
        )}
      </ul>

      <div className={`close-btn ${isMenuOpen ? 'show' : ''}`} onClick={toggleMenu}>
        <i className="ri-close-line"></i>
      </div>
    </nav>
  );
};

export default Navbar;
