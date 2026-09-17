package com.veridian.execagent.service;

import com.veridian.execagent.model.EmailThread;
import com.veridian.execagent.repository.EmailThreadRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmailService {

    private final EmailThreadRepository threadRepo;

    public EmailService(EmailThreadRepository threadRepo) {
        this.threadRepo = threadRepo;
    }

    public List<EmailThread> getAllThreads() {
        return threadRepo.findAll();
    }

    public Optional<EmailThread> getThreadById(Long id) {
        return threadRepo.findById(id);
    }
}
