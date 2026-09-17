package com.veridian.execagent.service.ai;

import com.veridian.execagent.model.*;
import com.veridian.execagent.repository.*;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AiGroundingContextBuilder {

    private final MeetingRepository meetingRepo;
    private final VoiceNoteRepository voiceNoteRepo;
    private final EmailThreadRepository threadRepo;
    private final CalendarEventRepository calendarRepo;
    private final CommitmentRepository commitmentRepo;

    public AiGroundingContextBuilder(MeetingRepository meetingRepo,
                                     VoiceNoteRepository voiceNoteRepo,
                                     EmailThreadRepository threadRepo,
                                     CalendarEventRepository calendarRepo,
                                     CommitmentRepository commitmentRepo) {
        this.meetingRepo = meetingRepo;
        this.voiceNoteRepo = voiceNoteRepo;
        this.threadRepo = threadRepo;
        this.calendarRepo = calendarRepo;
        this.commitmentRepo = commitmentRepo;
    }

    public String buildGroundingSystemPrompt() {
        StringBuilder sb = new StringBuilder();
        sb.append("You are the AI Executive Productivity Agent for Arjun Malhotra (VP Sales at Veridian Corp).\n");
        sb.append("Arjun is your ONLY user. Neha Kapoor, Raghav Sethi, Divya Rao, Priya Nair, and Facilities are external information sources, NOT users.\n");
        sb.append("STRICT GROUNDING RULE: You must answer ONLY using the ground-truth facts provided below for the week of Monday 21 Sep – Friday 25 Sep 2026.\n");
        sb.append("Do NOT invent any facts, deadlines, commitments, or outcomes.\n");
        sb.append("Always cite your sources (e.g. [Leadership Sync], [Email Thread: Vendor List], [Voice Note 1], [Calendar]).\n\n");

        sb.append("=== 1. COMMITMENT STATUS GROUND TRUTH ===\n");
        List<Commitment> commitments = commitmentRepo.findAll();
        for (Commitment c : commitments) {
            String ownerName = c.getOwner() != null ? c.getOwner().getName() : "UNASSIGNED";
            sb.append(String.format("- Commitment #%d: '%s' | Owner: %s | Status: %s | Priority: %s | Deadline: %s | Delays: %d\n  Why it matters: %s\n  Evidence: %s\n",
                    c.getId(), c.getTitle(), ownerName, c.getStatus(), c.getPriority(), c.getCurrentDeadline(), c.getDelayCount(), c.getWhyItMatters(), c.getSourceQuote()));
        }
        sb.append("\n");

        sb.append("=== 2. MEETINGS & TRANSCRIPTS ===\n");
        List<Meeting> meetings = meetingRepo.findAll();
        for (Meeting m : meetings) {
            sb.append(String.format("Meeting: %s (%s, %s)\nAttendees: %s\nTranscript:\n%s\n\n",
                    m.getTitle(), m.getDate(), m.getTime(), m.getAttendees(), m.getTranscript()));
        }

        sb.append("=== 3. VOICE NOTES (ARJUN'S PERSONAL DICTATED MEMOS) ===\n");
        List<VoiceNote> voiceNotes = voiceNoteRepo.findAllByOrderByNoteNumberAsc();
        for (VoiceNote vn : voiceNotes) {
            sb.append(String.format("Voice Note %d — %s (%s):\n\"%s\"\nExtracted: %s\n\n",
                    vn.getNoteNumber(), vn.getTimestamp(), vn.getContext(), vn.getTranscript(), vn.getExtractedCommitments()));
        }

        sb.append("=== 4. EMAIL THREADS (ALL 25 EMAILS) ===\n");
        List<EmailThread> threads = threadRepo.findAll();
        for (EmailThread t : threads) {
            sb.append(String.format("Thread: '%s' | Status: %s | Waiting On: %s\n", t.getSubject(), t.getStatusSummary(), t.getWaitingOn()));
            for (EmailMessage m : t.getMessages()) {
                String senderName = m.getSender() != null ? m.getSender().getName() : m.getSenderRaw();
                sb.append(String.format("  [%d] %s — From: %s — To: %s: \"%s\"\n",
                        m.getSequenceNumber(), m.getTimestamp(), senderName, m.getRecipient(), m.getBody()));
            }
            sb.append("\n");
        }

        sb.append("=== 5. CALENDAR SCHEDULES (WEEK OF 21-25 SEP 2026) ===\n");
        List<CalendarEvent> events = calendarRepo.findAll();
        for (CalendarEvent ev : events) {
            String personName = ev.getPerson() != null ? ev.getPerson().getName() : "Unknown";
            sb.append(String.format("- %s | %s | %s | %s%s\n",
                    personName, ev.getDayDate(), ev.getTimeRange(), ev.getTitle(),
                    ev.isHasConflict() ? " [CONFLICT: " + ev.getConflictNotes() + "]" : ""));
        }
        sb.append("\n");

        sb.append("=== SPECIAL RECONCILIATION INSTRUCTIONS ===\n");
        sb.append("1. Vendor List: Slipped repeatedly (promised Mon, delayed to Tue morning, then Wed morning). Raghav followed up 3 times. Overdue and pending on Arjun.\n");
        sb.append("2. Q3 Campaign Deck: Shifted from Wed to Thu 9:30 AM. Neha delivered the draft on Thu 8:00 AM ahead of the review. RESOLVED / NOT OVERDUE. Note calendar overlap at 9:30 AM with Board Prep.\n");
        sb.append("3. Meridian Logistics: Call rescheduled. Arjun proposed Wed 3 PM; Priya confirmed. RESOLVED / CONFIRMED and on calendar for Wed 3:00–3:30 PM.\n");
        sb.append("4. Expense Variance Report: Accelerated to Wed evening. Divya delivered Wed 6:00 PM; Arjun confirmed receipt at 6:10 PM. Divya's delivery is COMPLETE, but Arjun still needs to review it before Thu 9:00 AM Board Prep Session.\n");
        sb.append("5. Mumbai Office Lease Renewal: Sign-off deadline Friday 25 Sep EOD. Ownership is UNASSIGNED / UNRESOLVED. Facilities sent 2 notices; Raghav escalated twice. Critical organizational risk.\n");

        return sb.toString();
    }
}
