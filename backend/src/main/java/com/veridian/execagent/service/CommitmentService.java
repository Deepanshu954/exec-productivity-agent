package com.veridian.execagent.service;

import com.veridian.execagent.model.Commitment;
import com.veridian.execagent.model.Person;
import com.veridian.execagent.repository.CommitmentRepository;
import com.veridian.execagent.repository.PersonRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CommitmentService {

    private final CommitmentRepository commitmentRepo;
    private final PersonRepository personRepo;

    public CommitmentService(CommitmentRepository commitmentRepo, PersonRepository personRepo) {
        this.commitmentRepo = commitmentRepo;
        this.personRepo = personRepo;
    }

    public List<Commitment> getAllCommitments() {
        return commitmentRepo.findAll();
    }

    public List<Commitment> getArjunCommitments() {
        Person arjun = personRepo.findByName("Arjun Malhotra").orElse(null);
        if (arjun == null) return List.of();
        return commitmentRepo.findByOwner(arjun);
    }

    public List<Commitment> getOpenOrOverdueCommitments() {
        return commitmentRepo.findAll().stream()
                .filter(c -> "OPEN".equalsIgnoreCase(c.getStatus()) ||
                             "OVERDUE".equalsIgnoreCase(c.getStatus()) ||
                             "AT_RISK".equalsIgnoreCase(c.getStatus()))
                .toList();
    }

    public List<Commitment> getCompletedOrResolvedCommitments() {
        return commitmentRepo.findAll().stream()
                .filter(c -> "COMPLETED".equalsIgnoreCase(c.getStatus()) ||
                             "RESOLVED".equalsIgnoreCase(c.getStatus()))
                .toList();
    }

    public Optional<Commitment> getById(Long id) {
        return commitmentRepo.findById(id);
    }
}
