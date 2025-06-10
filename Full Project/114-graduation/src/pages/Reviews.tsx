import { useEffect, useState } from 'react';
import ReviewCard from '../components/ReviewCard.tsx';
import { Review } from '../types/index.ts';
import './Reviews.css';
import Navbarreview from '../components/Navbarreview.tsx';

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    // Fetch reviews from the API
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:8187/api/reviews');
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const data = await response.json();
        const formattedData = data.map((item) => ({
          id: item.reviewId,
          carMake: item.brand,
          carModel: item.carModel,
          carYear: item.year,
          review: item.carReview,
          reviewDate: item.reviewDate, // Add current date
          reviewBy: item.reviewBy // Get username from localStorage
        }));
        setReviews(formattedData);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, []);

  const handlePrevious = () => {
    setCurrentPage(0); // Show all reviews
  };

  const handleNext = () => {
    const lastReview = reviews[reviews.length - 1];
    if (lastReview) {
      setCurrentPage(1); // Show only the last review
    }
  };

  const displayedReviews = currentPage === 1 ?
    [reviews[reviews.length - 1]] :
    reviews;

  useEffect(() => {
    console.log('عدد المراجعات:', reviews.length);
    reviews.forEach(review => {
      console.log(`مراجعة ${review.id}: ${review.carMake} ${review.carModel}`);
    });
  }, [reviews]);

  return (
    <div className="reviews-container">
      <Navbarreview />
      <div className="content-wrapper">
        <div className="grid-layout">
          {displayedReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
        <div className="button-group">
          <button
            onClick={handlePrevious}
            className="custom-button"
          >
            Previous
          </button>
          <button
            onClick={handleNext}
            className="custom-button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}