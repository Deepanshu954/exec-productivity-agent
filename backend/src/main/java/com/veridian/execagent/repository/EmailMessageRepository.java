package com.veridian.execagent.repository;

import com.veridian.execagent.model.EmailMessage;
import com.veridian.execagent.model.EmailThread;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EmailMessageRepository extends JpaRepository<EmailMessage, Long> {
    List<EmailMessage> findByThreadOrderBySequenceNumberAsc(EmailThread thread);
}
