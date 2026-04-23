package com.skillsphere.controller;

import com.skillsphere.dto.MessageDto;
import com.skillsphere.model.Chat;
import com.skillsphere.model.Message;
import com.skillsphere.model.User;
import com.skillsphere.repository.ChatRepository;
import com.skillsphere.repository.MessageRepository;
import com.skillsphere.repository.UserRepository;
import com.skillsphere.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/chats")
@CrossOrigin(origins = "http://localhost:5173")
public class ChatController {

    @Autowired
    private ChatRepository chatRepository;

    @Autowired
    private MessageRepository messageRepository;

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

    @GetMapping
    public ResponseEntity<List<Chat>> getMyChats() {
        User user = getAuthenticatedUser();
        List<Chat> chats = chatRepository.findByUserId(user.getId());
        chats.forEach(chat -> {
            sanitizeUser(chat.getUser1());
            sanitizeUser(chat.getUser2());
        });
        return ResponseEntity.ok(chats);
    }

    @PostMapping("/with/{otherUserId}")
    public ResponseEntity<?> getOrCreateChat(@PathVariable Long otherUserId) {
        User me = getAuthenticatedUser();
        
        if (me.getId().equals(otherUserId)) {
            return ResponseEntity.badRequest().body("You cannot chat with yourself");
        }

        Optional<User> otherUserOpt = userRepository.findById(otherUserId);
        if (otherUserOpt.isEmpty()) return ResponseEntity.notFound().build();

        Optional<Chat> existing = chatRepository.findExistingChat(me.getId(), otherUserId);
        if (existing.isPresent()) {
            Chat chat = existing.get();
            sanitizeUser(chat.getUser1());
            sanitizeUser(chat.getUser2());
            return ResponseEntity.ok(chat);
        }

        Chat newChat = new Chat();
        newChat.setUser1(me);
        newChat.setUser2(otherUserOpt.get());
        newChat.setUpdatedAt(LocalDateTime.now());
        
        Chat saved = chatRepository.save(newChat);
        sanitizeUser(saved.getUser1());
        sanitizeUser(saved.getUser2());
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/{chatId}/messages")
    public ResponseEntity<?> getChatMessages(@PathVariable Long chatId) {
        User me = getAuthenticatedUser();
        Optional<Chat> chatOpt = chatRepository.findById(chatId);
        
        if (chatOpt.isEmpty()) return ResponseEntity.notFound().build();
        Chat chat = chatOpt.get();
        
        if (!chat.getUser1().getId().equals(me.getId()) && !chat.getUser2().getId().equals(me.getId())) {
            return ResponseEntity.status(403).body("Not authorized");
        }

        List<Message> messages = messageRepository.findByChatIdOrderByTimestampAsc(chatId);
        messages.forEach(msg -> sanitizeUser(msg.getSender()));
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/{chatId}/messages")
    public ResponseEntity<?> sendMessage(@PathVariable Long chatId, @RequestBody MessageDto dto) {
        User me = getAuthenticatedUser();
        Optional<Chat> chatOpt = chatRepository.findById(chatId);
        
        if (chatOpt.isEmpty()) return ResponseEntity.notFound().build();
        Chat chat = chatOpt.get();
        
        if (!chat.getUser1().getId().equals(me.getId()) && !chat.getUser2().getId().equals(me.getId())) {
            return ResponseEntity.status(403).body("Not authorized");
        }

        Message msg = new Message();
        msg.setChat(chat);
        msg.setSender(me);
        msg.setContent(dto.getContent());
        msg.setTimestamp(LocalDateTime.now());
        
        Message savedMsg = messageRepository.save(msg);
        
        // Update chat timestamp
        chat.setUpdatedAt(LocalDateTime.now());
        chatRepository.save(chat);

        sanitizeUser(savedMsg.getSender());
        return ResponseEntity.ok(savedMsg);
    }
}
