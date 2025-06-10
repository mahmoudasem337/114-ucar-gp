import { Link } from 'react-router-dom';
import './hero.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <div className="nav__logo">
            <Link to="/" className="logo">
              <img src="assets/logo-white.png" alt="logo white" className="logo-img logo-white" />
              <img src="assets/logo-dark.png" alt="logo dark" className="logo-img logo-dark" />
              <span className="logo-text">sell a car</span>
            </Link>
          </div>
        </div>
        
        <div className="navbar-right">
          <div className="auth-buttons">
            <Link to="/login" className="login-button">
              Login
            </Link>
            <Link to="/register" className="register-button">
              Register
            </Link>
          </div>
       
        </div>
      </div>
    </nav>
  );
}