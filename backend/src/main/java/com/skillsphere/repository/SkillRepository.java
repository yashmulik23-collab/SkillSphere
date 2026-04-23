package com.skillsphere.repository;

import com.skillsphere.model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface SkillRepository extends JpaRepository<Skill, Long> {
    List<Skill> findByUserId(Long userId);

    @Query("SELECT s FROM Skill s WHERE " +
           "(:keyword IS NULL OR :keyword = '' OR LOWER(s.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(s.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:category IS NULL OR :category = '' OR LOWER(s.category) = LOWER(:category)) AND " +
           "(:level IS NULL OR :level = '' OR LOWER(s.level) = LOWER(:level)) AND " +
           "(:price IS NULL OR :price = '' OR LOWER(s.price) = LOWER(:price))")
    List<Skill> searchSkills(@Param("keyword") String keyword, 
                             @Param("category") String category, 
                             @Param("level") String level, 
                             @Param("price") String price);
}
