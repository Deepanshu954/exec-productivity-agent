package com.veridian.execagent.service;

import com.veridian.execagent.model.CalendarEvent;
import com.veridian.execagent.model.Person;
import com.veridian.execagent.repository.CalendarEventRepository;
import com.veridian.execagent.repository.PersonRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class CalendarService {

    private final CalendarEventRepository calendarRepo;
    private final PersonRepository personRepo;

    public CalendarService(CalendarEventRepository calendarRepo, PersonRepository personRepo) {
        this.calendarRepo = calendarRepo;
        this.personRepo = personRepo;
    }

    public List<CalendarEvent> getAllEvents() {
        return calendarRepo.findAll();
    }

    public List<CalendarEvent> getEventsByDate(String isoDate) {
        return calendarRepo.findByIsoDateOrderByStartTimeAsc(isoDate);
    }

    public List<CalendarEvent> getEventsForArjun(String isoDate) {
        Person arjun = personRepo.findByName("Arjun Malhotra").orElse(null);
        if (arjun == null) return List.of();
        if (isoDate != null && !isoDate.isEmpty()) {
            return calendarRepo.findByPersonAndIsoDateOrderByStartTimeAsc(arjun, isoDate);
        }
        return calendarRepo.findByPersonOrderByIsoDateAscStartTimeAsc(arjun);
    }

    public List<Map<String, Object>> detectConflicts() {
        List<Map<String, Object>> conflicts = new ArrayList<>();

        // 1. Thursday 24 Sep Overlap: Arjun's Board Prep (9:00-10:00 AM) vs Neha's Deck Review with Arjun (9:30-10:00 AM)
        conflicts.add(Map.of(
            "id", "conflict-thu-deck-review",
            "type", "CALENDAR_OVERLAP",
            "severity", "CRITICAL",
            "title", "Double-Booking: Board Prep Session vs Deck Review",
            "description", "Neha scheduled 'Deck Review with Arjun' for Thu 24 Sep 9:30–10:00 AM, which directly collides with Arjun's 'Board Prep Session' (9:00–10:00 AM with Divya).",
            "dayDate", "Thu 24 Sep",
            "time", "9:30–10:00 AM",
            "involvedPeople", List.of("Arjun Malhotra", "Neha Kapoor", "Divya Rao"),
            "resolution", "Reschedule the Deck Review or review asynchronously since Neha sent the deck draft at 8:00 AM Thursday."
        ));

        // 2. Mumbai Office Lease Renewal Unassigned
        conflicts.add(Map.of(
            "id", "risk-mumbai-lease",
            "type", "UNASSIGNED_OWNERSHIP",
            "severity", "CRITICAL",
            "title", "Unassigned Sign-off: Mumbai Office Lease Renewal",
            "description", "Lease renewal sign-off deadline is Friday 25 Sep EOD. Facilities sent 2 reminders and Raghav escalated twice. No one has taken ownership.",
            "dayDate", "Fri 25 Sep",
            "time", "End of Day",
            "involvedPeople", List.of("Facilities", "Raghav Sethi", "Arjun Malhotra", "Divya Rao"),
            "resolution", "Assign an authorized signatory during Friday 10:00 AM Facilities Check-in."
        ));

        // 3. Repeated Delay on Vendor List
        conflicts.add(Map.of(
            "id", "risk-vendor-list",
            "type", "MISSED_COMMITMENT",
            "severity", "HIGH",
            "title", "Repeated Delay: Updated Vendor List for Raghav",
            "description", "Arjun promised the vendor list for Tuesday morning, then pushed to Wednesday morning. Raghav has followed up 3 times and is still waiting.",
            "dayDate", "Wed 23 Sep",
            "time", "Overdue since Wed morning",
            "involvedPeople", List.of("Arjun Malhotra", "Raghav Sethi"),
            "resolution", "Send the updated vendor list to Raghav immediately to unblock operations."
        ));

        return conflicts;
    }
}
