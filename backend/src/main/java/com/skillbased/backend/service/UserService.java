package com.skillbased.backend.service;

import com.skillbased.backend.entity.User;
import com.skillbased.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already taken");
        }
        // In a real app, hash the password here
        return userRepository.save(user);
    }

    public User loginUser(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isPresent() && user.get().getPassword().equals(password)) {
            return user.get();
        }
        throw new RuntimeException("Invalid credentials");
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateProfile(Long id, User profileUpdates) {
        User user = getUserById(id);
        if (profileUpdates.getBio() != null)
            user.setBio(profileUpdates.getBio());
        if (profileUpdates.getSkills() != null)
            user.setSkills(profileUpdates.getSkills());
        if (profileUpdates.getName() != null)
            user.setName(profileUpdates.getName());
        if (profileUpdates.getResumeUrl() != null)
            user.setResumeUrl(profileUpdates.getResumeUrl());
        return userRepository.save(user);
    }
}
