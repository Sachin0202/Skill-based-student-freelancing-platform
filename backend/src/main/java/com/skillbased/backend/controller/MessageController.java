package com.skillbased.backend.controller;

import com.skillbased.backend.entity.Message;
import com.skillbased.backend.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*")
public class MessageController {

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private com.skillbased.backend.repository.UserRepository userRepository;

    @Autowired
    private com.skillbased.backend.repository.JobRepository jobRepository;

    @PostMapping
    public ResponseEntity<?> sendMessage(@RequestBody Message message) {
        try {
            if (message.getSender() != null && message.getSender().getId() != null) {
                message.setSender(userRepository.findById(message.getSender().getId()).orElse(null));
            }
            if (message.getReceiver() != null && message.getReceiver().getId() != null) {
                message.setReceiver(userRepository.findById(message.getReceiver().getId()).orElse(null));
            }
            if (message.getJob() != null && message.getJob().getId() != null) {
                message.setJob(jobRepository.findById(message.getJob().getId()).orElse(null));
            }
            return ResponseEntity.ok(messageRepository.save(message));
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to send message: " + e.getMessage());
        }
    }

    @GetMapping("/history/{u1}/{u2}")
    public List<Message> getChatHistory(@PathVariable Long u1, @PathVariable Long u2) {
        return messageRepository.findChatHistory(u1, u2);
    }

    @GetMapping("/conversations/{userId}")
    public List<com.skillbased.backend.entity.User> getConversations(@PathVariable Long userId) {
        return messageRepository.findChatPartners(userId);
    }
}
