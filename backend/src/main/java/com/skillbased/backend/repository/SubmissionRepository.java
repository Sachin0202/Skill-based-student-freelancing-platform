package com.skillbased.backend.repository;

import com.skillbased.backend.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SubmissionRepository extends JpaRepository<Submission, Long> {
    List<Submission> findByJobId(Long jobId);

    List<Submission> findByStudentId(Long studentId);
}
