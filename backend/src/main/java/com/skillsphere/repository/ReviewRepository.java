package com.skillsphere.repository;

import com.skillsphere.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByRevieweeIdOrderByCreatedAtDesc(Long revieweeId);
}
