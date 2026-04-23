package com.skillsphere.controller;

import com.skillsphere.dto.RequestDto;
import com.skillsphere.model.Skill;
import com.skillsphere.model.SkillRequest;
import com.skillsphere.model.User;
import com.skillsphere.repository.SkillRepository;
import com.skillsphere.repository.SkillRequestRepository;
import com.skillsphere.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/requests")
@CrossOrigin(origins = "http://localhost:5173")
public class RequestController {

    @Autowired
    private SkillRequestRepository requestRepository;

    @Autowired
    private SkillRepository skillRepository;

    @Autowired
    private UserService userService;

    private User getAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return userService.findByEmail(auth.getName()).orElseThrow(() -> new RuntimeException("User not found"));
    }

    private void sanitizeRequest(SkillRequest req) {
        if (req.getSender() != null) req.getSender().setPassword(null);
        if (req.getReceiver() != null) req.getReceiver().setPassword(null);
        if (req.getSkill() != null && req.getSkill().getUser() != null) req.getSkill().getUser().setPassword(null);
    }

    @PostMapping("/send")
    public ResponseEntity<?> sendRequest(@RequestBody RequestDto requestDto) {
        User sender = getAuthenticatedUser();
        
        Optional<Skill> skillOpt = skillRepository.findById(requestDto.getSkillId());
        if (skillOpt.isEmpty()) return ResponseEntity.badRequest().body("Skill not found");
        
        Skill skill = skillOpt.get();
        if (skill.getUser().getId().equals(sender.getId())) {
            return ResponseEntity.badRequest().body("You cannot request your own skill");
        }

        SkillRequest request = new SkillRequest();
        request.setSender(sender);
        request.setReceiver(skill.getUser());
        request.setSkill(skill);
        request.setMessage(requestDto.getMessage());
        request.setStatus("PENDING");

        SkillRequest saved = requestRepository.save(request);
        sanitizeRequest(saved);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/incoming")
    public ResponseEntity<List<SkillRequest>> getIncomingRequests() {
        User user = getAuthenticatedUser();
        List<SkillRequest> requests = requestRepository.findByReceiverId(user.getId());
        requests.forEach(this::sanitizeRequest);
        return ResponseEntity.ok(requests);
    }

    @GetMapping("/outgoing")
    public ResponseEntity<List<SkillRequest>> getOutgoingRequests() {
        User user = getAuthenticatedUser();
        List<SkillRequest> requests = requestRepository.findBySenderId(user.getId());
        requests.forEach(this::sanitizeRequest);
        return ResponseEntity.ok(requests);
    }

    @PutMapping("/{id}/accept")
    public ResponseEntity<?> acceptRequest(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        Optional<SkillRequest> reqOpt = requestRepository.findById(id);
        
        if (reqOpt.isEmpty()) return ResponseEntity.notFound().build();
        SkillRequest req = reqOpt.get();
        
        if (!req.getReceiver().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Not authorized");
        }
        
        req.setStatus("ACCEPTED");
        SkillRequest saved = requestRepository.save(req);
        sanitizeRequest(saved);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectRequest(@PathVariable Long id) {
        User user = getAuthenticatedUser();
        Optional<SkillRequest> reqOpt = requestRepository.findById(id);
        
        if (reqOpt.isEmpty()) return ResponseEntity.notFound().build();
        SkillRequest req = reqOpt.get();
        
        if (!req.getReceiver().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Not authorized");
        }
        
        req.setStatus("REJECTED");
        SkillRequest saved = requestRepository.save(req);
        sanitizeRequest(saved);
        return ResponseEntity.ok(saved);
    }
}
