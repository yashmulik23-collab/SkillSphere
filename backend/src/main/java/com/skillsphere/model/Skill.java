package com.skillsphere.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "skills")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String category;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String level; // e.g., Beginner, Intermediate, Expert

    private String price;

    private String mode; // e.g., Online, In-person

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
