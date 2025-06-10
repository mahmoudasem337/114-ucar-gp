import { Link } from 'react-router-dom';
import './Navbarreview.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">

          <div className="navbar-left">
            <div className="nav__logo">
              <Link to="/" className="logo">
                <img src="assets/logo-white.png" alt="logo white" className="logo-img logo-white" />
                <img src="assets/logo-dark.png" alt="logo dark" className="logo-img logo-dark" />
                <span className="logo-text">UCAR</span>
              </Link>
          
          </div>
       
        </div>
        <div className="navbar-right">
            <Link to="/write-review" className="review-button">
              Write A Review
            </Link>
          </div>
      </div>


    </nav>
  );
}