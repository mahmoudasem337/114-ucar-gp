import { Review } from '../types/index.ts';
import './ReviewCard.css';

interface ReviewCardProps {
  review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="review-card">
      <h3 className="review-title">
        {review.carMake} {review.carModel} ({review.carYear})
      </h3>
      <p className="review-text">
        {review.review}
      </p>
      <div className="review-meta">
        <p>Reviewed on: {review.reviewDate || 'N/A'}</p>
        <p>Reviewed by: {review.reviewBy || 'N/A'}</p>
      </div>
    </div>
  );
}
