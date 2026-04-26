package com.skillsphere.controller;

import com.skillsphere.dto.SkillDto;
import com.skillsphere.model.Skill;
import com.skillsphere.model.User;
import com.skillsphere.repository.SkillRepository;
import com.skillsphere.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/skills")
public class SkillController {

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private UserService userService;

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        return userService.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
    }

    // Get all skills
    @GetMapping
    public ResponseEntity<List<Skill>> getAllSkills() {
        List<Skill> skills = skillRepository.findAll();
        // Remove password from returned user details for security
        skills.forEach(skill -> {
            if (skill.getUser() != null) skill.getUser().setPassword(null);
        });
        return ResponseEntity.ok(skills);
    }

    // Search and filter skills
    @GetMapping("/search")
    public ResponseEntity<List<Skill>> searchSkills(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String level,
            @RequestParam(required = false) String price) {
        
        List<Skill> skills = skillRepository.searchSkills(keyword, category, level, price);
        skills.forEach(skill -> {
            if (skill.getUser() != null) skill.getUser().setPassword(null);
        });
        return ResponseEntity.ok(skills);
    }

    // Get skills of the currently authenticated user
    @GetMapping("/my")
    public ResponseEntity<List<Skill>> getMySkills() {
        User user = getAuthenticatedUser();
        List<Skill> skills = skillRepository.findByUserId(user.getId());
        skills.forEach(s -> s.getUser().setPassword(null));
        return ResponseEntity.ok(skills);
    }

    // Create a new skill post
    @PostMapping
    public ResponseEntity<?> createSkill(@RequestBody SkillDto skillDto) {
        try {
            User user = getAuthenticatedUser();
            Skill skill = new Skill();
            skill.setTitle(skillDto.getTitle());
            skill.setCategory(skillDto.getCategory());
            skill.setDescription(skillDto.getDescription());
            skill.setLevel(skillDto.getLevel());
            skill.setPrice(skillDto.getPrice());
            skill.setMode(skillDto.getMode());
            skill.setUser(user);

            Skill savedSkill = skillRepository.save(skill);
            savedSkill.getUser().setPassword(null);
            return ResponseEntity.ok(savedSkill);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error creating skill: " + e.getMessage());
        }
    }

    // Update a skill post
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSkill(@PathVariable Long id, @RequestBody SkillDto skillDto) {
        User user = getAuthenticatedUser();
        Optional<Skill> skillOpt = skillRepository.findById(id);

        if (skillOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Skill skill = skillOpt.get();
        // Check if the skill belongs to the user
        if (!skill.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("You are not authorized to edit this skill");
        }

        skill.setTitle(skillDto.getTitle());
        skill.setCategory(skillDto.getCategory());
        skill.setDescription(skillDto.getDescription());
        skill.setLevel(skillDto.getLevel());
        skill.setPrice(skillDto.getPrice());
        skill.setMode(skillDto.getMode());

        Skill updatedSkill = skillRepository.save(skill);
        updatedSkill.getUser().setPassword(null);
        return ResponseEntity.ok(updatedSkill);
    }

    // Delete a skill post
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSkill(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        Optional<Skill> skillOpt = skillRepository.findById(id);

        if (skillOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Skill skill = skillOpt.get();
        if (!skill.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("You are not authorized to delete this skill");
        }

        skillRepository.delete(skill);
        return ResponseEntity.ok(java.util.Map.of("message", "Skill deleted successfully"));
    }
}
