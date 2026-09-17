package com.veridian.execagent.controller;

import com.veridian.execagent.service.ai.AiQueryRequest;
import com.veridian.execagent.service.ai.AiQueryResponse;
import com.veridian.execagent.service.ai.AiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/query")
    public ResponseEntity<AiQueryResponse> query(@RequestBody AiQueryRequest request) {
        if (request == null || request.getQuery() == null || request.getQuery().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        AiQueryResponse response = aiService.query(request);
        return ResponseEntity.ok(response);
    }
}
