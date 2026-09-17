package com.veridian.execagent.controller;

import com.veridian.execagent.model.Commitment;
import com.veridian.execagent.service.CommitmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/commitments")
public class CommitmentController {

    private final CommitmentService commitmentService;

    public CommitmentController(CommitmentService commitmentService) {
        this.commitmentService = commitmentService;
    }

    @GetMapping
    public ResponseEntity<List<Commitment>> getCommitments(
            @RequestParam(required = false) String owner,
            @RequestParam(required = false) String status) {

        List<Commitment> list;
        if ("arjun".equalsIgnoreCase(owner)) {
            list = commitmentService.getArjunCommitments();
        } else if ("open".equalsIgnoreCase(status) || "pending".equalsIgnoreCase(status)) {
            list = commitmentService.getOpenOrOverdueCommitments();
        } else if ("completed".equalsIgnoreCase(status) || "resolved".equalsIgnoreCase(status)) {
            list = commitmentService.getCompletedOrResolvedCommitments();
        } else {
            list = commitmentService.getAllCommitments();
        }
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Commitment> getCommitmentById(@PathVariable Long id) {
        return commitmentService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
