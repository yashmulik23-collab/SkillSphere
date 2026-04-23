package com.skillsphere.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import com.skillsphere.service.UserService;
import com.skillsphere.dto.UserProfileDto;
import com.skillsphere.model.User;
import java.util.Optional;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<?> getUserProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName(); // The subject of the JWT is the email
        
        Optional<User> userOptional = userService.findByEmail(email);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // Don't return password
            user.setPassword(null);
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateUserProfile(@RequestBody UserProfileDto profileDto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        try {
            User updatedUser = userService.updateProfile(email, profileDto);
            updatedUser.setPassword(null);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating profile: " + e.getMessage());
        }
    }
}
