import React, { useState, useEffect } from 'react';
import { MapPin, Calendar, Gauge } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Car2 } from "../types/types";
import './ProductCard.css'; 

interface ProductCardProps {
  car: Car2;
}

const ProductCard: React.FC<ProductCardProps> = ({ car }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<string[]>([]);
  const [imageLoadError, setImageLoadError] = useState(false);
  
  useEffect(() => {
    const loadImages = () => {
      const images = car.images.map(image => {
        if (typeof image === 'object' && image.url) {
          return image.url;
        }
        return '/images/default-car.jpg';
      });
      setLoadedImages(images.length > 0 ? images : ['/images/default-car.jpg']);
      setImageLoadError(false);
    };

    loadImages();
  }, [car.images]);

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev + 1) % loadedImages.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev - 1 + loadedImages.length) % loadedImages.length);
  };

  const handleImageError = () => {
    setImageLoadError(true);
  };

  const currentImage = loadedImages[currentImageIndex] || '/images/default-car.jpg';
  console.log(currentImage)
  // const fallbackImage = 'https://via.placeholder.com/300x200?text=No+Image';

  //   const currentImage = loadedImages && loadedImages.length > 0 ? loadedImages[currentImageIndex] : fallbackImage;


  return (
    <Link to={`/details/${car.id}`} className="product-card-link" state={{ car }}>
      <div className="product-card">
        <div className="image-container">
          <img
            src={currentImage}
            alt={car.name}
            className="car-image"
            onError={handleImageError}
            loading="lazy"
          />
          
          {loadedImages.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="nav-button prev-button"
                aria-label="Previous image"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={handleNextImage}
                className="nav-button next-button"
                aria-label="Next image"
              >
                <FaChevronRight />
              </button>
              <div className="image-indicators">
                {loadedImages.map((_, index) => (
                  <div
                    key={index}
                    className={`indicator ${index === currentImageIndex ? 'active' : ''}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        <div className="card-content">
          <h3 className="car-title">{car.name}</h3>
          
          <div className="price-year-container">
            <span className="car-price">{car.price.toLocaleString()} EGP </span>
            <div className="year-info">
              <Calendar className="icon" />
              <span>{car.year}</span>
            </div>
          </div>

          <div className="car-specs">
            <div className="spec-row">
              <div className="spec-item">
                <Gauge className="icon" />
                <span>{car.mileage} km</span>
              </div>
              <span>{car.transmission}</span>
              <span>{car.engine}cc</span>
            </div>
            
            <div className="location-info">
              <MapPin className="icon" />
              <span>{car.location}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;