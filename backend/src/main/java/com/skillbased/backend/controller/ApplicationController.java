package com.skillbased.backend.controller;

import com.skillbased.backend.entity.Application;
import com.skillbased.backend.entity.Job;
import com.skillbased.backend.repository.ApplicationRepository;
import com.skillbased.backend.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @PostMapping("/apply/{jobId}/{studentId}")
    public ResponseEntity<Application> apply(@PathVariable Long jobId, @PathVariable Long studentId) {
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));
        com.skillbased.backend.entity.User student = new com.skillbased.backend.entity.User();
        student.setId(studentId);

        Application application = new Application();
        application.setJob(job);
        application.setStudent(student);
        application.setStatus(Application.ApplicationStatus.PENDING);

        return ResponseEntity.ok(applicationRepository.save(application));
    }

    @GetMapping("/job/{jobId}")
    public List<Application> getApplicationsByJob(@PathVariable Long jobId) {
        return applicationRepository.findByJobId(jobId);
    }
    
    @GetMapping("/student/{studentId}")
    public List<Application> getApplicationsByStudent(@PathVariable Long studentId) {
        return applicationRepository.findByStudentId(studentId);
    }

    @PostMapping("/hire/{applicationId}")
    public ResponseEntity<Job> hire(@PathVariable Long applicationId) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.setStatus(Application.ApplicationStatus.HIRED);
        applicationRepository.save(application);

        Job job = application.getJob();
        job.setFreelancer(application.getStudent());
        job.setStatus(Job.JobStatus.IN_PROGRESS);

        // Reject other applications for the same job
        List<Application> others = applicationRepository.findByJobId(job.getId());
        for (Application other : others) {
            if (!other.getId().equals(applicationId)) {
                other.setStatus(Application.ApplicationStatus.REJECTED);
                applicationRepository.save(other);
            }
        }

        return ResponseEntity.ok(jobRepository.save(job));
    }
}
