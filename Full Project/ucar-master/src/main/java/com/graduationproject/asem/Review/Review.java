package com.graduationproject.asem.Review;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity // Add this to mark the class as a JPA entity
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reviewId;
    private String carModel;
    private String brand;
    private int year;
    private String carReview;
    private String reviewBy;
    private LocalDate reviewDate;

    public Review(Long reviewId, String carModel, String brand, int year, String carReview, String reviewBy, LocalDate reviewDate) {
        this.reviewId = reviewId;
        this.carModel = carModel;
        this.brand = brand;
        this.year = year;
        this.carReview = carReview;
        this.reviewBy = reviewBy;
        this.reviewDate = reviewDate;
    }

    public Review() {
    }

    public Long getReviewId() {
        return reviewId;
    }

    public void setReviewId(Long reviewId) {
        this.reviewId = reviewId;
    }

    public String getCarModel() {
        return carModel;
    }

    public void setCarModel(String carModel) {
        this.carModel = carModel;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public int getYear() {
        return year;
    }

    public void setYear(int year) {
        this.year = year;
    }

    public String getCarReview() {
        return carReview;
    }

    public void setCarReview(String carReview) {
        this.carReview = carReview;
    }

    public String getReviewBy() {
        return reviewBy;
    }

    public void setReviewBy(String reviewBy) {
        this.reviewBy = reviewBy;
    }

    public LocalDate getReviewDate() {
        return reviewDate;
    }

    public void setReviewDate(LocalDate reviewDate) {
        this.reviewDate = reviewDate;
    }
}