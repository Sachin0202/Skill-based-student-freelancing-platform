package com.skillbased.backend.controller;

import com.skillbased.backend.entity.Job;
import com.skillbased.backend.service.JobService;
import com.skillbased.backend.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/jobs")
@CrossOrigin(origins = "*")
public class JobController {

    @Autowired
    private JobService jobService;

    @Autowired
    private JobRepository jobRepository;

    @GetMapping
    public List<Job> getAllJobs() {
        return jobService.getAllJobs();
    }

    @GetMapping("/client/{clientId}")
    public List<Job> getJobsByClient(@PathVariable Long clientId) {
        return jobRepository.findByClientId(clientId);
    }

    @GetMapping("/freelancer/{freelancerId}")
    public List<Job> getJobsByFreelancer(@PathVariable Long freelancerId) {
        return jobService.getJobsByFreelancer(freelancerId);
    }

    @PostMapping
    public ResponseEntity<Job> createJob(@RequestBody Job job) {
        return ResponseEntity.ok(jobService.createJob(job));
    }

    @PostMapping("/accept/{jobId}/{studentId}")
    public ResponseEntity<Job> acceptJob(@PathVariable Long jobId, @PathVariable Long studentId) {
        return ResponseEntity.ok(jobService.acceptJob(jobId, studentId));
    }

    @PostMapping("/approve/{jobId}")
    public ResponseEntity<Job> approveJob(@PathVariable Long jobId) {
        return ResponseEntity.ok(jobService.approveJob(jobId));
    }
}
