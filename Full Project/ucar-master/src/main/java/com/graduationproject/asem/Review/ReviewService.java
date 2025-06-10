package com.graduationproject.asem.Review;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

@Service
public class ReviewService {

    private final ReviewRepository repository;
    public ReviewService(ReviewRepository repository) {
        this.repository = repository;
    }

    public List<Review> getAllReviews() {
        return repository.findAll();
    }

    public Optional<Review> getReviewById(Long id) {
        return repository.findById(id);
    }

    public Review createReview(Review review) {
        review.setReviewDate(LocalDate.now()); // Automatically set the review date to the current date
        return repository.save(review);
    }

    public void deleteReview(Long id) {
        repository.deleteById(id);
    }

    public Review updateReview(Long id, Review updatedReview) {
        return repository.findById(id).map(review -> {
            review.setCarModel(updatedReview.getCarModel());
            review.setBrand(updatedReview.getBrand());
            review.setYear(updatedReview.getYear());
            review.setCarReview(updatedReview.getCarReview());
            review.setReviewBy(updatedReview.getReviewBy()); // Update reviewBy
            review.setReviewDate(updatedReview.getReviewDate()); // Update reviewDate
            return repository.save(review);
        }).orElse(null);
    }
}
