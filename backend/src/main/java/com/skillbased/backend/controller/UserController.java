package com.skillbased.backend.controller;

import com.skillbased.backend.entity.User;
import com.skillbased.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/{id}")
    public ResponseEntity<User> getUser(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(userService.getUserById(id));
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<User> updateProfile(
            @PathVariable Long id,
            @RequestParam("name") String name,
            @RequestParam("bio") String bio,
            @RequestParam("skills") String skills,
            @RequestParam(value = "resume", required = false) org.springframework.web.multipart.MultipartFile resume) {
        System.out.println("Update Profile Attempt for User ID: " + id);
        System.out.println("Name: " + name + ", Bio: " + bio + ", Skills: " + skills);
        try {
            User profileUpdates = new User();
            profileUpdates.setName(name);
            profileUpdates.setBio(bio);
            profileUpdates.setSkills(skills);

            if (resume != null && !resume.isEmpty()) {
                System.out.println("Resume file detected: " + resume.getOriginalFilename());
                String fileName = System.currentTimeMillis() + "_" + resume.getOriginalFilename().replace(" ", "_");
                java.nio.file.Path uploadPath = java.nio.file.Paths.get("uploads");
                if (!java.nio.file.Files.exists(uploadPath)) {
                    java.nio.file.Files.createDirectories(uploadPath);
                }
                java.nio.file.Files.copy(resume.getInputStream(), uploadPath.resolve(fileName));
                profileUpdates.setResumeUrl(fileName);
            }

            User updated = userService.updateProfile(id, profileUpdates);
            System.out.println("Profile updated successfully in database for User ID: " + id);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            System.err.println("Profile update failed for User ID: " + id);
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }
}
