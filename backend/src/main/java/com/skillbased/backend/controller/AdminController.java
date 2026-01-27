package com.skillbased.backend.controller;

import com.skillbased.backend.entity.Job;
import com.skillbased.backend.entity.User;
import com.skillbased.backend.repository.JobRepository;
import com.skillbased.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    @GetMapping("/stats")
    public Map<String, Object> getStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStudents", userRepository.countByRole(User.Role.STUDENT));
        stats.put("totalClients", userRepository.countByRole(User.Role.CLIENT));
        stats.put("totalJobs", jobRepository.count());
        return stats;
    }

    @GetMapping("/recent-jobs")
    public List<Job> getRecentJobs() {
        // ideally findTop5ByOrderByIdDesc, but findAll is fine for MVP small data
        List<Job> allJobs = jobRepository.findAll();
        // Return only last 5 reversed
        int start = Math.max(0, allJobs.size() - 5);
        List<Job> recent = allJobs.subList(start, allJobs.size());
        java.util.Collections.reverse(recent);
        return recent;
    }
}
