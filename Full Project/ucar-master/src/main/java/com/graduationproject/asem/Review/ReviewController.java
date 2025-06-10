package com.graduationproject.asem.Review;

import java.time.LocalDate;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "http://localhost:5173")  // React app's URL
@RequestMapping("/api/reviews")
public class ReviewController {

    
    private final ReviewService service;

    public ReviewController(ReviewService service) {
        this.service = service;
    }
    // @CrossOrigin(origins = "http://localhost:5173")  // React app's URL
    @GetMapping
    public List<Review> getAllReviews() {
        return service.getAllReviews();
    }
    // @CrossOrigin(origins = "http://localhost:5173")  // React app's URL
    @GetMapping("/{id}")
    public ResponseEntity<Review> getReview(@PathVariable Long id) {
        return service.getReviewById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // @CrossOrigin(origins = "http://localhost:5173")  // React app's URL
    @PostMapping
    public Review createReview(@RequestBody Review review) {
        review.setReviewDate(LocalDate.now()); // Automatically set the review date to the current date
        return service.createReview(review);
    }

    // @CrossOrigin(origins = "http://localhost:5173")  // React app's URL
    @PutMapping("/{id}")
    public ResponseEntity<Review> updateReview(@PathVariable Long id, @RequestBody Review review) {
        Review updated = service.updateReview(id, review);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }
    
    // @CrossOrigin(origins = "http://localhost:5173")  // React app's URL
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable Long id) {
        service.deleteReview(id);
        return ResponseEntity.noContent().build();
    }
}
