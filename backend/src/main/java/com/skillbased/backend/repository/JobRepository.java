package com.skillbased.backend.repository;

import com.skillbased.backend.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByStatus(Job.JobStatus status);

    List<Job> findByClientId(Long clientId);

    List<Job> findByFreelancerId(Long freelancerId);
}
