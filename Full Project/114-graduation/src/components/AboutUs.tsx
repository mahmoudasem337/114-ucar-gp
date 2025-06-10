

const HowItWorks = () => {
  return (
    <section className="section__container about__container" id="about">
      <h2 className="section__header">How It Works</h2>
      <p className="section__description">
        Driving a car with us is simple! Choose your vehicle, Connect with its owner, Buy it, and start your journey!
      </p>
      <div className="about__grid">
        <div className="about__card">
          <span><img src="/assets/browsing2.png" alt="Browse Car" width="50" height="50" /></span>
          <h4>Browse Car</h4>
          <p>Browse the latest cars available and choose the one that suits you best!</p>
        </div>
        <div className="about__card">
          <span><img src="/assets/select.png" alt="Choose Car" width="50" height="50" /></span>
          <h4>Choose Car</h4>
          <p>Choose your perfect car from our wide selection!</p>
        </div>
        <div className="about__card">
          <span><img src="/assets/connection.png" alt="Connect With Owner" width="50" height="50" /></span>
          <h4>Connect With Owner</h4>
          <p>Connect directly with the owner for more details!</p>
        </div>
      </div>
    </section>
  );
}

export default HowItWorks;
