package com.skillsphere.controller;

import com.skillsphere.dto.ReviewDto;
import com.skillsphere.model.Review;
import com.skillsphere.model.User;
import com.skillsphere.repository.ReviewRepository;
import com.skillsphere.repository.UserRepository;
import com.skillsphere.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userService.findByEmail(auth.getName()).orElseThrow(() -> new RuntimeException("User not found"));
    }

    private void sanitizeUser(User user) {
        if (user != null) user.setPassword(null);
    }

    @PostMapping
    public ResponseEntity<?> addReview(@RequestBody ReviewDto dto) {
        User reviewer = getAuthenticatedUser();
        
        if (reviewer.getId().equals(dto.getRevieweeId())) {
            return ResponseEntity.badRequest().body("You cannot review yourself");
        }

        Optional<User> revieweeOpt = userRepository.findById(dto.getRevieweeId());
        if (revieweeOpt.isEmpty()) return ResponseEntity.notFound().build();

        if (dto.getRating() < 1 || dto.getRating() > 5) {
            return ResponseEntity.badRequest().body("Rating must be between 1 and 5");
        }

        Review review = new Review();
        review.setReviewer(reviewer);
        review.setReviewee(revieweeOpt.get());
        review.setRating(dto.getRating());
        review.setComment(dto.getComment());
        review.setCreatedAt(LocalDateTime.now());

        Review saved = reviewRepository.save(review);
        sanitizeUser(saved.getReviewer());
        sanitizeUser(saved.getReviewee());
        
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Review>> getUserReviews(@PathVariable Long userId) {
        List<Review> reviews = reviewRepository.findByRevieweeIdOrderByCreatedAtDesc(userId);
        reviews.forEach(review -> {
            sanitizeUser(review.getReviewer());
            sanitizeUser(review.getReviewee());
        });
        return ResponseEntity.ok(reviews);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Review>> getMyReviews() {
        User user = getAuthenticatedUser();
        List<Review> reviews = reviewRepository.findByRevieweeIdOrderByCreatedAtDesc(user.getId());
        reviews.forEach(review -> {
            sanitizeUser(review.getReviewer());
            sanitizeUser(review.getReviewee());
        });
        return ResponseEntity.ok(reviews);
    }
}
