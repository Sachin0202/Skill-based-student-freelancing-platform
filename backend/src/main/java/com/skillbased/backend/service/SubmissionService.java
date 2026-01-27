package com.skillbased.backend.service;

import com.skillbased.backend.entity.Submission;
import com.skillbased.backend.repository.SubmissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SubmissionService {

    @Autowired
    private SubmissionRepository submissionRepository;

    public Submission submitWork(Submission submission) {
        return submissionRepository.save(submission);
    }

    public List<Submission> getSubmissionsByJobId(Long jobId) {
        return submissionRepository.findByJobId(jobId);
    }

    public List<Submission> getSubmissionsByStudentId(Long studentId) {
        return submissionRepository.findByStudentId(studentId);
    }
}
