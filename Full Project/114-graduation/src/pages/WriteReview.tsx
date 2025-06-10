import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import './WriteReview.css';
import cover from "../assets/imgs/صورة واتساب بتاريخ 2025-04-26 في 01.54.45_d2c67048.jpg";

export default function WriteReview() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    carMake: '',
    carModel: '',
    carYear: '',
    review: ''
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const username = localStorage.getItem("username");
    const newReview = {
      carModel: formData.carModel,
      brand: formData.carMake,
      year: parseInt(formData.carYear, 10),
      carReview: formData.review,
      reviewDate: new Date().toISOString().split('T')[0], // Add current date
      reviewBy: username || 'Anonymous User', // Use username from localStorage
    };
  
    try {
      const response = await fetch('http://localhost:8187/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReview),
      });
  
      if (response.ok) {
        console.log('Review submitted successfully');
        navigate('/');
      } else {
        console.error('Failed to submit review:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };
  return (
    <div className="write-review-container" style={{ backgroundImage: `url(${cover})` }}>
      <div className="write-review-form-container">
        <div className="write-review-card">
          <h2 className="write-review-title">Share Your Car Experience</h2>
          <form onSubmit={handleSubmit} className="write-review-form">
            <div className="form-group">
              <label htmlFor="carMake" className="form-label">
                Car Make
              </label>
              <input
                type="text"
                id="carMake"
                value={formData.carMake}
                onChange={(e) => setFormData({ ...formData, carMake: e.target.value })}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="carModel" className="form-label">
                Car Model
              </label>
              <input
                type="text"
                id="carModel"
                value={formData.carModel}
                onChange={(e) => setFormData({ ...formData, carModel: e.target.value })}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="carYear" className="form-label">
                Car Year
              </label>
              <input
                type="text"
                id="carYear"
                value={formData.carYear}
                onChange={(e) => setFormData({ ...formData, carYear: e.target.value })}
                className="form-input"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="review" className="form-label">
                Your Review
              </label>
              <textarea
                id="review"
                rows={5}
                value={formData.review}
                onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                className="form-textarea"
                required
              />
            </div>
            <button
              type="submit"
              className="submit-button"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
      <footer className="write-review-footer">
        2023 Car Reviews. All rights reserved
      </footer>
    </div>
  );
}