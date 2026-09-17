package com.veridian.execagent.repository;

import com.veridian.execagent.model.EmailThread;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmailThreadRepository extends JpaRepository<EmailThread, Long> {
    Optional<EmailThread> findBySubject(String subject);
}
