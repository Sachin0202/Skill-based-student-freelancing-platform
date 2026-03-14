package com.skillbased.backend.repository;

import com.skillbased.backend.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface MessageRepository extends JpaRepository<Message, Long> {
    @Query("SELECT m FROM Message m WHERE (m.sender.id = :u1 AND m.receiver.id = :u2) OR (m.sender.id = :u2 AND m.receiver.id = :u1) ORDER BY m.timestamp ASC")
    List<Message> findChatHistory(@Param("u1") Long u1, @Param("u2") Long u2);

    @Query("SELECT DISTINCT CASE WHEN m.sender.id = :userId THEN m.receiver ELSE m.sender END FROM Message m WHERE m.sender.id = :userId OR m.receiver.id = :userId")
    List<com.skillbased.backend.entity.User> findChatPartners(@Param("userId") Long userId);

    List<Message> findByJobId(Long jobId);
}
