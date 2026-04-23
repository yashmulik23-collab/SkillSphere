package com.skillsphere.controller;

import com.skillsphere.model.Skill;
import com.skillsphere.model.User;
import com.skillsphere.repository.SkillRepository;
import com.skillsphere.repository.UserRepository;
import com.skillsphere.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private UserService userService;

    private void requireAdmin() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findByEmail(auth.getName()).orElseThrow(() -> new RuntimeException("User not found"));
        if (!"ROLE_ADMIN".equals(user.getRole())) {
            throw new RuntimeException("Access Denied: Admins only");
        }
    }

    private void sanitizeUser(User user) {
        if (user != null) user.setPassword(null);
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        requireAdmin();
        List<User> users = userRepository.findAll();
        users.forEach(this::sanitizeUser);
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        requireAdmin();
        userRepository.deleteById(id);
        return ResponseEntity.ok(java.util.Map.of("message", "User deleted successfully"));
    }

    @GetMapping("/skills")
    public ResponseEntity<List<Skill>> getAllSkills() {
        requireAdmin();
        List<Skill> skills = skillRepository.findAll();
        skills.forEach(skill -> {
            if (skill.getUser() != null) sanitizeUser(skill.getUser());
        });
        return ResponseEntity.ok(skills);
    }

    @DeleteMapping("/skills/{id}")
    public ResponseEntity<?> deleteSkill(@PathVariable Long id) {
        requireAdmin();
        skillRepository.deleteById(id);
        return ResponseEntity.ok(java.util.Map.of("message", "Skill deleted successfully"));
    }
}
