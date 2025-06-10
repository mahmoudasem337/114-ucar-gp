import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <div className="header__container">
      <div className="header__image">
        <img src="/assets/header.png" alt="header" />
      </div>
      <div className="header__content">
        <h2>👍 100% Trusted car platform in Egypt</h2>
        <h1>FAST AND EASY WAY To BUY A USED CAR</h1>
        <p className="section__description">
          Discover a seamless car-buying experience with us. Explore a wide range of high-quality used vehicles,
          carefully inspected to meet your needs and lifestyle.
        </p>
      </div>
    </div>
  );
};

export default HeroSection;
