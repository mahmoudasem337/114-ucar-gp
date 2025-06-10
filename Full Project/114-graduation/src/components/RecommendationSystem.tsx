import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { cars as carData } from "../data/cars";
import { Car } from "../types/types";
import { useNavigate } from "react-router-dom";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 4,
  slidesToScroll: 2,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 2 } },
    { breakpoint: 768, settings: { slidesToShow: 1 } }
  ]
};

const RecommendedCars: React.FC = () => {
  const navigate = useNavigate();
  const [recommendedCars, setRecommendedCars] = useState<Car[]>([]);

  useEffect(() => {
    const userId = localStorage.getItem("id");
    const username = localStorage.getItem("username");

    if (userId && username) {
      fetch(`http://127.0.0.1:8000/recommendations/${userId}`)
        .then((response) => response.json())
        .then(async (data) => {
          const mappedCars = await Promise.all(data.map(async (item: any) => {
            const matchedCar = carData.find(
              (car) =>
                `${item.carmake} ${item.carmodel}`.toLowerCase() === car.name.toLowerCase()
            );

            // Fetch images for this advertisement
            let advertisementImages: string[] = [];
            try {
              const imageResponse = await fetch(`http://127.0.0.1:8000/advertisements/${item.advertisementid}/images`);
              if (imageResponse.ok) {
                advertisementImages = await imageResponse.json();
              }
            } catch (error) {
              console.error(`Error fetching images for ad ${item.advertisementid}:`, error);
            }

            return {
              // Backend fields
              id: item.advertisementid,
              name: `${item.carmake} ${item.carmodel}`,
              price: item.carprice,
              year: item.carproductionyear,
              mileage: item.kilometers,
              location: item.ownerlocation,
              fuel: item.carfueltype,
              body: item.carbodytype,
              color: item.carcolor,
              transmission: item.cartransmissiontype,
              engine: item.enginecapacity,
              description: item.cardescription || (matchedCar ? matchedCar.description : ''),
              phonenumber: item.ownerphonenumber || (matchedCar ? matchedCar.phonenumber : ''),
              // Prefer backend images, fallback to local carData images
              images: advertisementImages.length > 0
                ? advertisementImages
                : (matchedCar && matchedCar.images ? matchedCar.images : [matchedCar && matchedCar.img ? matchedCar.img : '']),
              // For card display - use first image from backend or fallback
              img: advertisementImages.length > 0 
                ? advertisementImages[0] 
                : (matchedCar ? matchedCar.img : 'https://via.placeholder.com/300x200?text=No+Image'),
              rating: 4,
              reviews: 0,
              features: [
                `Body: ${item.carbodytype}`,
                `Color: ${item.carcolor}`,
                `Fuel: ${item.carfueltype}`,
                `Year: ${item.carproductionyear}`,
                `Transmission: ${item.cartransmissiontype}`,
                `Engine: ${item.enginecapacity}cc`,
                `KM: ${item.kilometers}`,
                `Location: ${item.ownerlocation}`,
              ],
            };
          }));
          setRecommendedCars(mappedCars);
        })
        .catch((error) => console.error("Error fetching recommended cars:", error));
    } else {
      setRecommendedCars(carData); // fallback to default data
    }
  }, []);

  return (
    <section className="deals" id="deals">
      <div className="section_container deals_container">
        <h2 className="section__header">Recommended Cars</h2>
        <p className="section__description">
          Get personalized car recommendations tailored to your needs. 🚗✨
        </p>

        <Slider {...settings} className="deals__slider">
          {recommendedCars.map((car) => (
            <div key={car.id} className="deals__card">
              <img src={car.img || undefined} alt={car.name} />
              <div className="deals__rating">

              </div>
              <h4>{car.name}</h4>
              <div className="deals_card_grid">
                {car.features.map((feature, index) => (
                  <div key={index}>
                    <span>✔</span> {feature}
                  </div>
                ))}
              </div>
              <hr />
              <div className="deals_card_footer">
                <h3>{car.price} EGP </h3>
                <button
                  className="drive-now-btn"
                  onClick={() => navigate(`/details/${car.id}`, { state: { car } })}
                  style={{ background: "none", border: "none", color: "#007bff", cursor: "pointer", padding: 0 }}
                >
                  Show <span className="big-arrow">➡</span>
                </button>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default RecommendedCars;
// // components/RecommendedCars.tsx
// import React, { useEffect, useState } from "react";
// import Slider from "react-slick";
// import { cars as carData } from "../data/cars";
// import { Car } from "../types/types";

// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";

// const settings = {
//   dots: true,
//   infinite: true,
//   speed: 500,
//   slidesToShow: 4,
//   slidesToScroll: 2,
//   responsive: [
//     { breakpoint: 1024, settings: { slidesToShow: 2 } },
//     { breakpoint: 768, settings: { slidesToShow: 1 } }
//   ]
// };

// const RecommendedCars: React.FC = () => {
//   const [recommendedCars, setRecommendedCars] = useState<Car[]>([]);

//   useEffect(() => {
//     const userId = localStorage.getItem("id");
//     const username = localStorage.getItem("username");

//     if (userId && username) {
//       fetch(`http://127.0.0.1:8000/recommendations/${userId}`)
//         .then((response) => response.json())
//         .then((data) => {
//           console.log("Recommended cars data:", data); // Log the fetched data
//           const mappedCars = data.map((item: any) => {
//             const matchedCar = carData.find(
//               (car) => `${item.Brand_str} ${item.Model_str}`.toLowerCase() === car.name.toLowerCase()
//             );
//             return {
//               id: Math.random(), // Generate a unique ID for each car
//               img: matchedCar ? matchedCar.img : "", // Use matched image or fallback
//               name: `${item.Brand_str} ${item.Model_str}`,
//               rating: 4, // Default rating
//               reviews: 0, // Default reviews
//               features: [], // Default features
//               price: `$${item.Price}`
//             };
//           });
//           setRecommendedCars(mappedCars);
//           console.log("Recommended cars:", mappedCars); // Log the recommended cars
//         })
//         .catch((error) => console.error("Error fetching recommended cars:", error));
//     } else {
//       setRecommendedCars(carData); // Set default data from carsde.ts
//     }
//   }, []);

//   return (
//     <section className="deals" id="deals">
//       <div className="section__container deals__container">
//         <h2 className="section__header">Recommended Cars</h2>
//         <p className="section__description">
//           Get personalized car recommendations tailored to your needs. 🚗✨
//         </p>

//         <Slider {...settings} className="deals__slider">
//           {recommendedCars.map((car) => (
//             <div key={car.id} className="deals__card">
//               <img src={car.img || null} alt={car.name} />
//               <div className="deals__rating">
//                 {Array(car.rating)
//                   .fill(null)
//                   .map((_, index) => (
//                     <span key={index}>⭐</span>
//                   ))}
//                 <span> ({car.reviews})</span>
//               </div>
//               <h4>{car.name}</h4>
//               <div className="deals__card__grid">
//                 {car.features.map((feature, index) => (
//                   <div key={index}>
//                     <span>✔</span> {feature}
//                   </div>
//                 ))}
//               </div>
//               <hr />
//               <div className="deals__card__footer">
//                 <h3>{car.price}</h3>
//                 <a href="#">Drive Now <span className="big-arrow">➡</span></a>
//               </div>
//             </div>
//           ))}
//         </Slider>
//       </div>
//     </section>
//   );
// };

// export default RecommendedCars;

