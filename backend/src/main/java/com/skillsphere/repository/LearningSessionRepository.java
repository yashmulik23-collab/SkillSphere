package com.skillsphere.repository;

import com.skillsphere.model.LearningSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface LearningSessionRepository extends JpaRepository<LearningSession, Long> {
    
    @Query("SELECT s FROM LearningSession s WHERE s.student.id = :userId OR s.instructor.id = :userId ORDER BY s.sessionDate ASC, s.sessionTime ASC")
    List<LearningSession> findByUserId(@Param("userId") Long userId);
}
