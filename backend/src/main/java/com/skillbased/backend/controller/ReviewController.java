package com.skillbased.backend.controller;

import com.skillbased.backend.entity.Review;
import com.skillbased.backend.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private com.skillbased.backend.repository.UserRepository userRepository;

    @Autowired
    private com.skillbased.backend.repository.JobRepository jobRepository;

    @PostMapping
    public ResponseEntity<?> submitReview(@RequestBody Review review) {
        try {
            if (review.getReviewer() != null && review.getReviewer().getId() != null) {
                review.setReviewer(userRepository.findById(review.getReviewer().getId()).orElse(null));
            }
            if (review.getReviewee() != null && review.getReviewee().getId() != null) {
                review.setReviewee(userRepository.findById(review.getReviewee().getId()).orElse(null));
            }
            if (review.getJob() != null && review.getJob().getId() != null) {
                review.setJob(jobRepository.findById(review.getJob().getId()).orElse(null));
            }
            return ResponseEntity.ok(reviewRepository.save(review));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to save review: " + e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public List<Review> getReviewsForUser(@PathVariable Long userId) {
        return reviewRepository.findByRevieweeId(userId);
    }
}
