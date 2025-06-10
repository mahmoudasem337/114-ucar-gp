import React, { useEffect } from 'react';
import HeroSection from '../components/HeaderContent'; 
import ScrollReveal from 'scrollreveal';
import HowItWorks from '../components/AboutUs';
import Navbar from '../components/Navbar'
import RecommendedCars from '../components/RecommendationSystem';
import ChooseUs from '../components/WhyChooseUs'
import Footer from "../components/Footer";

import Chatbox from '../components/ChatBot'
import "../styles/styles.css";

const Home: React.FC = () => {
 
  useEffect(() => {
    const scrollRevealOption = {
      distance: "50px",
      origin: "bottom",
      duration: 1000,
    };
    ScrollReveal().reveal(".header__image img", { ...scrollRevealOption, origin: "right" });
    ScrollReveal().reveal(".header__content h2", { ...scrollRevealOption, delay: 500 });
  }, []);

  return (
    <div className="home">
         {/* navbar  */}
         <div>
     <Navbar/>
     </div>
      {/* Hero Section */}
      <div>
      <HeroSection/>
      </div>
      <div>
        {/* about us  */}
      <HowItWorks />
      </div>
      {/* recommendation system*/}
      <div>
        <RecommendedCars/>
      </div>
    {/* choose us  */}
    <div>
    <ChooseUs/>
    </div>
    {/*footer*/}
    <div>
        <Footer/>
    </div>
    {/*chatboat*/}
    <div>
        <Chatbox/>
    </div>
     </div> 
      
    );
};

export default Home;