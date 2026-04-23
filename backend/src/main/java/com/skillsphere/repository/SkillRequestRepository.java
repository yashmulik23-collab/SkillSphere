package com.skillsphere.repository;

import com.skillsphere.model.SkillRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SkillRequestRepository extends JpaRepository<SkillRequest, Long> {
    List<SkillRequest> findBySenderId(Long senderId);
    List<SkillRequest> findByReceiverId(Long receiverId);
}
