import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <div className="section__container footer__container">
        <div className="footer__col">
          <div className="footer__logo">
            <a href="#" className="logo">
              <img src="assets/logo-white.png" alt="logo" />
              <span>UCAR</span>
            </a>
          </div>
          <p>
            We're here to provide you with the best vehicles and a seamless
            driving experience. Stay connected for updates, special offers, and
            more. Drive with confidence!
          </p>
          <ul className="footer__socials">
            <li>
              <a href="#"><i className="ri-facebook-fill"></i></a>
            </li>
            <li>
              <a href="#"><i className="ri-twitter-fill"></i></a>
            </li>
            <li>
              <a href="#"><i className="ri-linkedin-fill"></i></a>
            </li>
            <li>
              <a href="#"><i className="ri-instagram-line"></i></a>
            </li>
            <li>
              <a href="#"><i className="ri-youtube-fill"></i></a>
            </li>
          </ul>
        </div>
        <div className="footer__col">
          <h4>Our Services</h4>
          <ul className="footer__links">
            <li><Link to="/">Home</Link></li>
            <li><a href="#about">About</a></li>
            <li><a href="#deals">Car Deals</a></li>
            <li><a href="#choose">Why Choose Us</a></li>
            <li><Link to="/FAQ">FAQ</Link></li>
          </ul>
        </div>

        <div className="footer__col">
          <h4>Contact</h4>
          <ul className="footer__links">
            <li>
              <a href="#">
                <span><i className="ri-phone-fill"></i></span> +91 0987654321
              </a>
            </li>
            <li>
              <a href="#">
                <span><i className="ri-map-pin-fill"></i></span> Egypt
              </a>
            </li>
            <li>
              <a href="#">
                <span><i className="ri-mail-fill"></i></span> info@UCAR
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer__bar">
        Copyright © 2025 UCAR. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
