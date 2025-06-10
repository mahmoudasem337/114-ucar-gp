import React, { JSX } from 'react';

interface ChooseCardProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

const ChooseCard: React.FC<ChooseCardProps> = ({ icon, title, description }) => (
  <div className="choose__card">
    <span>{icon}</span>
    <div>
      <h4>{title}</h4>
      <p>{description}</p>
    </div>
  </div>
);

const ChooseUs: React.FC = () => {
  return (
    <>
      <section className="choose__container" id="choose">
        <div className="choose__image">
          <img src="/assets/choose.png" alt="choose" />
        </div>
        <div className="choose__content">
          <h2 className="section__header">Why choose us</h2>
          <p className="section__description">
            Discover the difference with our car service.
            we offer reliable vehicles, exceptional AI chatbot customer service,
            and a price prediction AI model to ensure a seamless pricing experience.
          </p>
          <div className="choose__grid">
            <ChooseCard 
              icon={<i className="ri-customer-service-line"></i>} 
              title="Customer Support" 
              description="Our dedicated support team is available to assist you 24/7."
            />
            <ChooseCard 
              icon={<i className="ri-map-pin-line"></i>} 
              title="Many Locations" 
              description="The cars offered by us are from different places so that you find the right car in the nearest place to you."
            />
            <ChooseCard 
              icon={<i className="ri-wallet-line"></i>} 
              title="Pricing Service" 
              description="Enjoy with our AI model that provides a fair price for every car."
            />
            <ChooseCard 
              icon={<i className="ri-verified-badge-line"></i>} 
              title="Verified Brands" 
              description="Choose from trusted and well-maintained car brands."
            />
          </div>
        </div>
      </section>

      <section className="subscribe__container">
        <div className="subscribe__image">
          <img src="assets/subscribe.png" alt="subscribe" />
        </div>
        <div className="subscribe__content">
          <h2 className="section__header">
            Follow for the latest car updates
          </h2>
          <p className="section__description">
            Stay in the know! follow to know about the latest car deals,
            exclusive offers. Don't miss out on
            special promotions and the newest additions to our fleet.
          </p>
        </div>
      </section>
    </>
  );
}

export default ChooseUs;
