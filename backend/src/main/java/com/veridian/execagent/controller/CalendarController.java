package com.veridian.execagent.controller;

import com.veridian.execagent.model.CalendarEvent;
import com.veridian.execagent.service.CalendarService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/calendar")
public class CalendarController {

    private final CalendarService calendarService;

    public CalendarController(CalendarService calendarService) {
        this.calendarService = calendarService;
    }

    @GetMapping
    public ResponseEntity<List<CalendarEvent>> getCalendar(
            @RequestParam(required = false) String date,
            @RequestParam(defaultValue = "false") boolean arjunOnly) {

        if (arjunOnly) {
            return ResponseEntity.ok(calendarService.getEventsForArjun(date));
        }
        if (date != null && !date.isBlank()) {
            return ResponseEntity.ok(calendarService.getEventsByDate(date));
        }
        return ResponseEntity.ok(calendarService.getAllEvents());
    }

    @GetMapping("/conflicts")
    public ResponseEntity<List<Map<String, Object>>> getConflicts() {
        return ResponseEntity.ok(calendarService.detectConflicts());
    }
}
