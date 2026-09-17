package com.veridian.execagent.controller;

import com.veridian.execagent.service.BriefingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/briefing")
public class BriefingController {

    private final BriefingService briefingService;

    public BriefingController(BriefingService briefingService) {
        this.briefingService = briefingService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getBriefing(@RequestParam(defaultValue = "2026-09-21") String date) {
        return ResponseEntity.ok(briefingService.getBriefingForDate(date));
    }
}
