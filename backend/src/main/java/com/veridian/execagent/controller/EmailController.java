package com.veridian.execagent.controller;

import com.veridian.execagent.model.EmailThread;
import com.veridian.execagent.service.EmailService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/emails")
public class EmailController {

    private final EmailService emailService;

    public EmailController(EmailService emailService) {
        this.emailService = emailService;
    }

    @GetMapping
    public ResponseEntity<List<EmailThread>> getThreads() {
        return ResponseEntity.ok(emailService.getAllThreads());
    }

    @GetMapping("/{id}")
    public ResponseEntity<EmailThread> getThreadById(@PathVariable Long id) {
        return emailService.getThreadById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
