package com.skillsphere.repository;

import com.skillsphere.model.Chat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    
    @Query("SELECT c FROM Chat c WHERE c.user1.id = :userId OR c.user2.id = :userId ORDER BY c.updatedAt DESC")
    List<Chat> findByUserId(@Param("userId") Long userId);

    @Query("SELECT c FROM Chat c WHERE (c.user1.id = :userId1 AND c.user2.id = :userId2) OR (c.user1.id = :userId2 AND c.user2.id = :userId1)")
    Optional<Chat> findExistingChat(@Param("userId1") Long userId1, @Param("userId2") Long userId2);
}
