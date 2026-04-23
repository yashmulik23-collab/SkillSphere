package com.skillsphere.service;

import com.skillsphere.model.User;
import com.skillsphere.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(String name, String email, String password) {
        if(userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already exists!");
        }
        User user = new User();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        if ("admin@skillsphere.com".equalsIgnoreCase(email)) {
            user.setRole("ROLE_ADMIN");
        } else {
            user.setRole("ROLE_USER");
        }
        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User updateProfile(String email, com.skillsphere.dto.UserProfileDto profileDto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setName(profileDto.getName());
        user.setBio(profileDto.getBio());
        user.setSkills(profileDto.getSkills());
        user.setExperience(profileDto.getExperience());
        user.setLinks(profileDto.getLinks());
        user.setEducation(profileDto.getEducation());
        user.setAvailability(profileDto.getAvailability());
        return userRepository.save(user);
    }
}
