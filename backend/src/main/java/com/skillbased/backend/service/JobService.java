package com.skillbased.backend.service;

import com.skillbased.backend.entity.Job;
import com.skillbased.backend.repository.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public Job createJob(Job job) {
        return jobRepository.save(job);
    }

    public List<Job> getJobsByClient(Long clientId) {
        return jobRepository.findByClientId(clientId);
    }

    public List<Job> getJobsByFreelancer(Long freelancerId) {
        return jobRepository.findByFreelancerId(freelancerId);
    }

    public Job acceptJob(Long jobId, Long studentId) {
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));
        com.skillbased.backend.entity.User student = new com.skillbased.backend.entity.User();
        student.setId(studentId);
        job.setFreelancer(student);
        job.setStatus(Job.JobStatus.IN_PROGRESS);
        return jobRepository.save(job);
    }

    public Job approveJob(Long jobId) {
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));
        job.setStatus(Job.JobStatus.COMPLETED);
        return jobRepository.save(job);
    }
}
