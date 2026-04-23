package com.skillsphere.controller;

import com.skillsphere.dto.SessionDto;
import com.skillsphere.model.LearningSession;
import com.skillsphere.model.Skill;
import com.skillsphere.model.User;
import com.skillsphere.repository.LearningSessionRepository;
import com.skillsphere.repository.SkillRepository;
import com.skillsphere.repository.UserRepository;
import com.skillsphere.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "http://localhost:5173")
public class SessionController {

    @Autowired
    private LearningSessionRepository sessionRepository;

    @Autowired
    private SkillRepository skillRepository;

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

    private void sanitizeSession(LearningSession s) {
        sanitizeUser(s.getStudent());
        sanitizeUser(s.getInstructor());
        if (s.getSkill() != null) sanitizeUser(s.getSkill().getUser());
    }

    @GetMapping
    public ResponseEntity<List<LearningSession>> getMySessions() {
        User user = getAuthenticatedUser();
        List<LearningSession> sessions = sessionRepository.findByUserId(user.getId());
        sessions.forEach(this::sanitizeSession);
        return ResponseEntity.ok(sessions);
    }

    @PostMapping("/book")
    public ResponseEntity<?> bookSession(@RequestBody SessionDto dto) {
        try {
            User student = getAuthenticatedUser();
            
            Optional<Skill> skillOpt = skillRepository.findById(dto.getSkillId());
            if (skillOpt.isEmpty()) return ResponseEntity.badRequest().body("Skill not found");
            
            Optional<User> instructorOpt = userRepository.findById(dto.getInstructorId());
            if (instructorOpt.isEmpty()) return ResponseEntity.badRequest().body("Instructor not found");

            LearningSession session = new LearningSession();
            session.setStudent(student);
            session.setInstructor(instructorOpt.get());
            session.setSkill(skillOpt.get());
            session.setSessionDate(dto.getSessionDate());
            session.setSessionTime(dto.getSessionTime());
            session.setStatus("SCHEDULED");

            LearningSession saved = sessionRepository.save(session);
            sanitizeSession(saved);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error booking session: " + e.getMessage());
        }
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelSession(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        Optional<LearningSession> sessionOpt = sessionRepository.findById(id);

        if (sessionOpt.isEmpty()) return ResponseEntity.notFound().build();
        LearningSession session = sessionOpt.get();

        if (!session.getStudent().getId().equals(user.getId()) && !session.getInstructor().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Not authorized");
        }

        session.setStatus("CANCELLED");
        LearningSession saved = sessionRepository.save(session);
        sanitizeSession(saved);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<?> completeSession(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        Optional<LearningSession> sessionOpt = sessionRepository.findById(id);

        if (sessionOpt.isEmpty()) return ResponseEntity.notFound().build();
        LearningSession session = sessionOpt.get();

        if (!session.getStudent().getId().equals(user.getId()) && !session.getInstructor().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Not authorized");
        }

        session.setStatus("COMPLETED");
        LearningSession saved = sessionRepository.save(session);
        sanitizeSession(saved);
        return ResponseEntity.ok(saved);
    }
}
