package com.skillbased.backend.controller;

import com.skillbased.backend.entity.Submission;
import com.skillbased.backend.service.SubmissionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@CrossOrigin(origins = "*")
public class SubmissionController {

    @Autowired
    private SubmissionService submissionService;

    @Autowired
    private com.skillbased.backend.repository.UserRepository userRepository;

    @Autowired
    private com.skillbased.backend.repository.JobRepository jobRepository;

    @PostMapping
    public ResponseEntity<?> submitWork(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file,
            @RequestParam("jobId") Long jobId,
            @RequestParam("studentId") Long studentId) {
        System.out.println("Submission attempt for Job ID: " + jobId + " by Student ID: " + studentId);
        try {
            // 1. Fetch Job and Student
            com.skillbased.backend.entity.Job jobInDb = jobRepository.findById(jobId)
                    .orElseThrow(() -> new RuntimeException("Job not found"));

            com.skillbased.backend.entity.User studentInDb = userRepository.findById(studentId)
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            // 2. Save File
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename().replace(" ", "_");
            java.nio.file.Path uploadPath = java.nio.file.Paths.get("uploads");
            if (!java.nio.file.Files.exists(uploadPath)) {
                java.nio.file.Files.createDirectories(uploadPath);
            }
            java.nio.file.Files.copy(file.getInputStream(), uploadPath.resolve(fileName));
            System.out.println("File saved: " + fileName);

            // 3. Create Submission
            Submission submission = new Submission();
            submission.setWorkLink(fileName);
            submission.setJob(jobInDb);
            submission.setStudent(studentInDb);

            // 4. Update Job status
            jobInDb.setStatus(com.skillbased.backend.entity.Job.JobStatus.SUBMITTED);
            jobRepository.save(jobInDb);

            Submission savedSubmission = submissionService.submitWork(submission);
            System.out.println("Submission saved successfully: " + savedSubmission.getId());
            return ResponseEntity.ok(savedSubmission);
        } catch (Exception e) {
            System.err.println("Submission failed: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body("Submission failed: " + e.getMessage());
        }
    }

    @GetMapping("/job/{jobId}")
    public List<Submission> getSubmissionsByJob(@PathVariable Long jobId) {
        return submissionService.getSubmissionsByJobId(jobId);
    }

    @GetMapping("/student/{studentId}")
    public List<Submission> getSubmissionsByStudent(@PathVariable Long studentId) {
        return submissionService.getSubmissionsByStudentId(studentId);
    }
}
