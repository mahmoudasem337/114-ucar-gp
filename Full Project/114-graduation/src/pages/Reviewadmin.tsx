import { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { ReviewTable } from '../components/reviews/ReviewTable';

export function Reviewadmin() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await fetch('http://localhost:8187/api/reviews');
        if (!response.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const data = await response.json();
        const formattedData = data.map((review: any) => ({
          id: review.reviewId,
          content: review.carReview,
          author: review.reviewBy || 'Anonymous',
          rating: review.year, // Assuming year is used as a rating placeholder
        }));
        setReviews(formattedData);
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    fetchReviews();
  }, []);

  const handleDelete = (id: string) => {
    setReviews(reviews.filter(review => review.id !== id));
  };

  return (
    <div className="p-8">
      <Header title="Reviews" onRefresh={() => window.location.reload()} />
      <ReviewTable reviews={reviews} onDelete={handleDelete} />
    </div>
  );
}

export default Reviewadmin;