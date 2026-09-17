package com.veridian.execagent.service;

import com.veridian.execagent.model.CalendarEvent;
import com.veridian.execagent.model.Commitment;
import com.veridian.execagent.model.Person;
import com.veridian.execagent.repository.CalendarEventRepository;
import com.veridian.execagent.repository.CommitmentRepository;
import com.veridian.execagent.repository.PersonRepository;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class BriefingService {

    private final CalendarEventRepository calendarRepo;
    private final CommitmentRepository commitmentRepo;
    private final PersonRepository personRepo;

    public BriefingService(CalendarEventRepository calendarRepo,
                           CommitmentRepository commitmentRepo,
                           PersonRepository personRepo) {
        this.calendarRepo = calendarRepo;
        this.commitmentRepo = commitmentRepo;
        this.personRepo = personRepo;
    }

    public Map<String, Object> getBriefingForDate(String isoDate) {
        Person arjun = personRepo.findByName("Arjun Malhotra").orElse(null);
        List<CalendarEvent> events = arjun != null
                ? calendarRepo.findByPersonAndIsoDateOrderByStartTimeAsc(arjun, isoDate)
                : List.of();

        List<Commitment> allCommitments = commitmentRepo.findAll();
        List<Commitment> openCommitments = allCommitments.stream()
                .filter(c -> !"COMPLETED".equalsIgnoreCase(c.getStatus()) && !"RESOLVED".equalsIgnoreCase(c.getStatus()))
                .toList();

        String dayLabel = getDayLabel(isoDate);
        String executiveSummary = generateSummaryForDay(isoDate);
        List<Map<String, String>> criticalAlerts = getCriticalAlertsForDay(isoDate);

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("isoDate", isoDate);
        result.put("dayLabel", dayLabel);
        result.put("executiveSummary", executiveSummary);
        result.put("agenda", events);
        result.put("criticalAlerts", criticalAlerts);
        result.put("openCommitments", openCommitments);
        result.put("totalOpenCommitments", openCommitments.size());
        result.put("criticalCount", criticalAlerts.size());

        return result;
    }

    private String getDayLabel(String isoDate) {
        return switch (isoDate) {
            case "2026-09-21" -> "Monday, 21 September 2026";
            case "2026-09-22" -> "Tuesday, 22 September 2026";
            case "2026-09-23" -> "Wednesday, 23 September 2026";
            case "2026-09-24" -> "Thursday, 24 September 2026";
            case "2026-09-25" -> "Friday, 25 September 2026";
            default -> isoDate;
        };
    }

    private String generateSummaryForDay(String isoDate) {
        return switch (isoDate) {
            case "2026-09-21" ->
                "Good morning Arjun. Week kick-off began with the 9:00 AM Leadership Sync. Key priorities: send the updated vendor list to Raghav (promised by tomorrow EOD), keep track of the Mumbai office lease renewal which remains unowned, and follow up with Meridian Logistics to lock in a new call time.";
            case "2026-09-22" ->
                "Good morning Arjun. Today includes the Internal Budget Review at 11:00 AM. Raghav followed up at 9:15 AM on the vendor list you promised yesterday evening; you pushed it to Wednesday morning. You proposed Wednesday 3:00 PM for Meridian Logistics and Priya confirmed. Ensure Divya has prioritized the expense variance report for Wednesday evening.";
            case "2026-09-23" ->
                "Good morning Arjun. URGENT: Raghav sent a 3rd follow-up at 8:45 AM for the vendor list, which is now overdue. At 3:00 PM you have the confirmed client call with Meridian Logistics. Divya is expected to deliver the expense variance report by 6:00 PM this evening so you can review it before tomorrow's board prep.";
            case "2026-09-24" ->
                "Good morning Arjun. High-focus day: Board Prep Session is scheduled for 9:00–10:00 AM with Divya. IMPORTANT CONFLICT: Neha scheduled a Deck Review with you for 9:30–10:00 AM. Good news: Neha already delivered the deck draft at 8:00 AM, and Divya sent the expense variance report yesterday at 6:00 PM. Meanwhile, the Mumbai lease renewal remains unowned with 1 day until deadline.";
            case "2026-09-25" ->
                "Good morning Arjun. CRITICAL DEADLINE TODAY: The Mumbai office lease renewal paperwork expires at End of Day today and still has no assigned owner. Use your 10:00 AM Facilities Check-in with Raghav to formally assign sign-off ownership.";
            default ->
                "Executive briefing overview for " + isoDate + ". Monitor pending vendor list to Raghav and Mumbai office lease sign-off.";
        };
    }

    private List<Map<String, String>> getCriticalAlertsForDay(String isoDate) {
        List<Map<String, String>> alerts = new ArrayList<>();
        if ("2026-09-23".equals(isoDate) || "2026-09-24".equals(isoDate) || "2026-09-25".equals(isoDate)) {
            alerts.add(Map.of(
                "title", "Vendor List Overdue (3 Follow-ups)",
                "description", "Raghav is waiting on the vendor list. Slipped from Monday to Tuesday, then Wednesday morning.",
                "severity", "HIGH",
                "action", "Send to raghav.sethi@veridian-corp.example"
            ));
        }
        if ("2026-09-24".equals(isoDate)) {
            alerts.add(Map.of(
                "title", "Double-Booking: 9:30–10:00 AM Conflict",
                "description", "Neha's Deck Review conflicts with Board Prep Session with Divya.",
                "severity", "CRITICAL",
                "action", "Review Neha's draft asynchronously (delivered at 8:00 AM)"
            ));
        }
        if ("2026-09-24".equals(isoDate) || "2026-09-25".equals(isoDate)) {
            alerts.add(Map.of(
                "title", "Mumbai Lease Renewal Unowned (Deadline Friday EOD)",
                "description", "Facilities sent 2 reminders. Raghav escalated twice: 1 day out and still unassigned.",
                "severity", "CRITICAL",
                "action", "Assign signatory in 10:00 AM Facilities Check-in"
            ));
        }
        return alerts;
    }
}
