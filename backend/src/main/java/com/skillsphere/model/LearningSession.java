package com.skillsphere.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "learning_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LearningSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private User student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "instructor_id", nullable = false)
    private User instructor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "skill_id", nullable = false)
    private Skill skill;

    @Column(nullable = false)
    private LocalDate sessionDate;

    @Column(nullable = false)
    private LocalTime sessionTime;

    @Column(nullable = false)
    private String status; // SCHEDULED, CANCELLED, COMPLETED
}
