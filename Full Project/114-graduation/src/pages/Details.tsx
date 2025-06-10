import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Calendar, Gauge, MapPin, Fuel, Car, Phone, Settings, Cog } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Navbar from '../components/Navbar';
import carsData from '../data/cars.json';
import './Details.css';

export default function Details() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const [imagesLoading, setImagesLoading] = useState<{ [key: number]: boolean }>({});

  const getCar = () => {
    const savedCars = localStorage.getItem('carsList');
    if (savedCars) {
      const cars = JSON.parse(savedCars);
      return cars.find((c: any) => c.id === Number(id));
    }
    return carsData.cars.find((c) => c.id === Number(id));
  };

  const car = location.state?.car || getCar(); // Prioritize car data from state
  const carColor = car.color ? car.color.toLowerCase() : 'unknown'; // Provide a fallback value

  useEffect(() => {
    if (car && car.images) {
      const images = car.images.map((imageKey: any) => {
        if (typeof imageKey === 'string') {
          return imageKey;
        } else if (typeof imageKey === 'object' && imageKey.url) {
          return imageKey.url;
        }
        return '/images/default-car.jpg'; // Fallback for invalid entries
      });
      setLoadedImages(images);
    }
  }, [car]);

  const handleImageLoad = (index: number) => {
    setImagesLoading(prev => ({ ...prev, [index]: false }));
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, index: number) => {
    (e.target as HTMLImageElement).src = '/images/default1.jpg';
    setImagesLoading(prev => ({ ...prev, [index]: false }));
  };

  if (!car) {
    return <div className="details-not-found">Car not found</div>;
  }

  return (
    <div className="details-page">
      <div className="details-wrapper">
        <div className="details-car-card">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            className="details-swiper-container"
          >
            {loadedImages.map((image, index) => (
              <SwiperSlide key={index} className="details-swiper-slide">
                <div className="details-image-container">
                  {imagesLoading[index] !== false && (
                    <div className="details-loading-spinner">
                      <div className="spinner" /> {/* هنا تحط لودر متحرك بسيط */}
                    </div>
                  )}
                  <img
                    src={image}
                    alt={`${car.name} - Image ${index + 1}`}
                    className="details-car-image details-object-cover"
                    onLoad={() => handleImageLoad(index)}
                    onError={(e) => handleImageError(e, index)}
                    style={{ display: imagesLoading[index] === false ? 'block' : 'none' }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Car Details */}
          <div className="details-content-wrapper">
            <div className="details-header-price-row">
              <h1 className="details-car-name">{car.name}</h1>
              <p className="details-car-price">
                {car.price.toLocaleString()} EGP
              </p>
            </div>

            <div className="details-specs-grid">
              <div className="details-spec-item">
                <Calendar size={20} className="details-spec-icon" />
                <span className="details-spec-label">Year:</span>
                <span className="details-spec-value">{car.year}</span>
              </div>
              <div className="details-spec-item">
                <Gauge size={20} className="details-spec-icon" />
                <span className="details-spec-label">Mileage:</span>
                <span className="details-spec-value">{car.mileage}</span>
              </div>
              <div className="details-spec-item">
                <MapPin size={20} className="details-spec-icon" />
                <span className="details-spec-label">Location:</span>
                <span className="details-spec-value">{car.location}</span>
              </div>
              <div className="details-spec-item">
                <Fuel size={20} className="details-spec-icon" />
                <span className="details-spec-label">Fuel:</span>
                <span className="details-spec-value">{car.fuel}</span>
              </div>
              <div className="details-spec-item">
                <Car size={20} className="details-spec-icon" />
                <span className="details-spec-label">Body:</span>
                <span className="details-spec-value">{car.body}</span>
              </div>
              <div className="details-spec-item">
                <div className="details-color-dot" style={{ backgroundColor: carColor }} />
                <span className="details-spec-label">Color:</span>
                <span className="details-spec-value">{car.color || 'Unknown'}</span>
              </div>
              <div className="details-spec-item">
                <Settings size={20} className="details-spec-icon" />
                <span className="details-spec-label">Transmission:</span>
                <span className="details-spec-value">{car.transmission}</span>
              </div>
              <div className="details-spec-item">
                <Cog size={20} className="details-spec-icon" />
                <span className="details-spec-label">Engine:</span>
                <span className="details-spec-value">{car.engine}cc</span>
              </div>
            </div>

            <div className="details-description-section">
              <h2 className="details-description-title">Description</h2>
              <p className="details-description-text">{car.description}</p>
            </div>

            <div className="details-contact-section">
              <a href={`tel:${car.phonenumber}`} className="details-contact-button">
                <Phone size={20} className="details-phone-icon" />
                Contact with car owner: {car.phonenumber}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
