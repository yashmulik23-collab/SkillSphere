package com.skillsphere.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reviewee_id", nullable = false)
    private User reviewee;

    @Column(nullable = false)
    private Integer rating; // 1 to 5

    @Column(columnDefinition = "TEXT")
    private String comment;

    private LocalDateTime createdAt;
}
