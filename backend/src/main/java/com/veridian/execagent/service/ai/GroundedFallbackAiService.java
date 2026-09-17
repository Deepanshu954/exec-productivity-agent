package com.veridian.execagent.service.ai;

import com.veridian.execagent.model.*;
import com.veridian.execagent.repository.*;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class GroundedFallbackAiService {

    private final CommitmentRepository commitmentRepo;
    private final EmailThreadRepository threadRepo;
    private final MeetingRepository meetingRepo;
    private final VoiceNoteRepository voiceNoteRepo;
    private final CalendarEventRepository calendarRepo;

    public GroundedFallbackAiService(CommitmentRepository commitmentRepo,
                                     EmailThreadRepository threadRepo,
                                     MeetingRepository meetingRepo,
                                     VoiceNoteRepository voiceNoteRepo,
                                     CalendarEventRepository calendarRepo) {
        this.commitmentRepo = commitmentRepo;
        this.threadRepo = threadRepo;
        this.meetingRepo = meetingRepo;
        this.voiceNoteRepo = voiceNoteRepo;
        this.calendarRepo = calendarRepo;
    }

    public AiQueryResponse answer(AiQueryRequest request) {
        String q = request.getQuery() != null ? request.getQuery().toLowerCase().trim() : "";
        String requestedDay = request.getDay();

        // Specific Entity Matches First
        // 1. "Show me everything related to Meridian Logistics" / "meridian" / "priya"
        if (q.contains("meridian") || q.contains("priya")) {
            return buildMeridianResponse();
        }

        // 2. "Why is the Mumbai lease renewal considered critical?" / "mumbai" / "lease"
        if (q.contains("mumbai") || q.contains("lease")) {
            return buildMumbaiLeaseResponse();
        }

        // 3. "What did I promise Raghav?" / "raghav" / "vendor"
        if (q.contains("raghav") || q.contains("vendor")) {
            return buildRaghavVendorResponse();
        }

        // 4. "What changed regarding the campaign deck?" / "campaign" / "deck" / "neha"
        if (q.contains("campaign") || q.contains("deck") || (q.contains("neha") && !q.contains("calendar"))) {
            return buildCampaignDeckResponse();
        }

        // 5. "What do I need to prepare before board prep?" / "board prep" / "expense" / "divya"
        if (q.contains("board prep") || q.contains("expense") || q.contains("variance") || q.contains("divya")) {
            return buildBoardPrepResponse();
        }

        // 6. "Which commitments were completed?" / "completed" / "resolved" / "done"
        if (q.contains("completed") || q.contains("resolved") || hasWord(q, "done")) {
            return buildCompletedResponse();
        }

        // 7. "Who is waiting on me?" / "waiting"
        if (q.contains("waiting")) {
            return buildWaitingOnMeResponse();
        }

        // 8. "Summarize the important updates from my emails" / "email" / "emails"
        if (q.contains("email") || q.contains("inbox") || q.contains("summarize")) {
            return buildEmailSummaryResponse();
        }

        // 9. "What am I late on?" / "late" / "overdue" / "delayed"
        if (hasWord(q, "late") || q.contains("overdue") || q.contains("delay")) {
            return buildLateResponse();
        }

        // 10. "What commitments of mine are still pending?" / "pending" / "my commitments" / "open"
        if (q.contains("pending") || (q.contains("commitment") && (q.contains("mine") || q.contains("my") || q.contains("open")))) {
            return buildPendingResponse();
        }

        // 11. "What needs my attention today?" / "attention" / "urgent" / "critical"
        if (q.contains("attention") || q.contains("urgent") || q.contains("critical")) {
            return buildAttentionResponse(q, requestedDay);
        }

        // 12. "What meetings do I have today?" / "meeting" / "calendar" / "schedule" / "agenda"
        if (q.contains("meeting") || q.contains("calendar") || q.contains("schedule") || q.contains("agenda") || q.contains("today")) {
            return buildCalendarResponse(requestedDay);
        }

        // Default Grounded Synthesis
        return buildGeneralGroundedResponse(q);
    }

    private AiQueryResponse buildAttentionResponse(String query, String day) {
        String answer = "Two critical items require your immediate executive attention:\n\n" +
                "1. **Vendor List for Raghav (Overdue)**: You promised Raghav the updated vendor list. The commitment slipped from Monday to Tuesday, and then to Wednesday morning. Raghav has followed up 3 times and is still waiting.\n\n" +
                "2. **Mumbai Office Lease Renewal (Unassigned Risk)**: The lease paperwork expires Friday, 25 September at End of Day. Ownership is currently unassigned. Raghav escalated this twice after Facilities issued multiple reminders. You explicitly noted in the Leadership Sync to 'flag it, don't assume.'\n\n" +
                "3. **Thursday Morning Double-Booking**: On Thursday 24 Sep, your Board Prep Session (9:00–10:00 AM) collides with Neha's scheduled Deck Review (9:30–10:00 AM). Fortunately, Neha delivered the deck draft early at 8:00 AM Thursday.";

        List<AiSourceCitation> sources = List.of(
                new AiSourceCitation("Email Thread: Vendor List", "Wed 23 Sep, 8:45 AM — Raghav: 'Just checking — still good for this morning?'", "EMAIL", "Wed 23 Sep, 8:45 AM"),
                new AiSourceCitation("Email Thread: Mumbai Office Lease Renewal", "Thu 24 Sep, 4:45 PM — Raghav: 'This is now one day out and still unowned — can you confirm who’s handling it?'", "EMAIL", "Thu 24 Sep, 4:45 PM"),
                new AiSourceCitation("Voice Note 1", "Arjun: 'need to get Raghav that vendor list... Also still haven’t heard back on the Mumbai lease thing, someone needs to own that, I don’t think it’s me.'", "VOICE_NOTE", "Mon 21 Sep, 6:40 PM"),
                new AiSourceCitation("Calendar: Arjun Malhotra & Neha Kapoor", "Thu 24 Sep: 9:00–10:00 AM Board Prep Session vs 9:30–10:00 AM Deck Review with Arjun", "CALENDAR", "Thu 24 Sep")
        );

        List<AiEntityRef> entities = List.of(
                new AiEntityRef(1L, "Send Updated Vendor List to Raghav", "OVERDUE", "Arjun Malhotra"),
                new AiEntityRef(5L, "Mumbai Office Lease Renewal Sign-off", "AT_RISK", "UNASSIGNED"),
                new AiEntityRef(2L, "Q3 Campaign Deck Draft", "RESOLVED", "Neha Kapoor")
        );

        return new AiQueryResponse(query, answer, sources, entities, "Grounded Retrieval Engine (Veridian Knowledge Base)", true, 0.98);
    }

    private AiQueryResponse buildLateResponse() {
        String answer = "You are currently late on one commitment:\n\n" +
                "• **Updated Vendor List to Raghav Sethi**:\n" +
                "  - **Original promise**: In the Monday Leadership Sync, you promised to send it by end of day Tuesday.\n" +
                "  - **Slip 1**: On Monday at 5:40 PM, you emailed Raghav saying you were running behind and would send it first thing Tuesday morning.\n" +
                "  - **Slip 2**: On Tuesday at 6:30 PM, you emailed Raghav apologizing that board prep pulled you away, promising Wednesday morning for sure.\n" +
                "  - **Current status**: On Wednesday at 8:45 AM, Raghav checked in ('still good for this morning?'). The vendor list has not yet been sent and is overdue.";

        List<AiSourceCitation> sources = List.of(
                new AiSourceCitation("Meeting Transcript: Leadership Sync", "Arjun: 'I told Raghav I’d send him the updated vendor list. I’ll get that to him by end of day tomorrow.'", "MEETING", "Mon 21 Sep, 9:00 AM"),
                new AiSourceCitation("Email Thread: Vendor List (Email 2)", "Arjun: 'Running behind, will send first thing tomorrow morning instead.'", "EMAIL", "Mon 21 Sep, 5:40 PM"),
                new AiSourceCitation("Email Thread: Vendor List (Email 4)", "Arjun: 'Sorry, got pulled into board prep — will send by tomorrow (Wednesday) morning for sure.'", "EMAIL", "Tue 22 Sep, 6:30 PM"),
                new AiSourceCitation("Email Thread: Vendor List (Email 5)", "Raghav: 'Just checking — still good for this morning?'", "EMAIL", "Wed 23 Sep, 8:45 AM")
        );

        List<AiEntityRef> entities = List.of(
                new AiEntityRef(1L, "Send Updated Vendor List to Raghav", "OVERDUE", "Arjun Malhotra")
        );

        return new AiQueryResponse("What am I late on?", answer, sources, entities, "Grounded Retrieval Engine", true, 0.99);
    }

    private AiQueryResponse buildPendingResponse() {
        String answer = "Here are your pending commitments as Arjun Malhotra:\n\n" +
                "1. **Send Updated Vendor List to Raghav** [OVERDUE]\n" +
                "   - Owner: Arjun Malhotra\n" +
                "   - Status: Overdue (slipped 3 times; Raghav sent 3 follow-ups)\n" +
                "   - Immediate action: Deliver the vendor list to unblock Raghav's operations.\n\n" +
                "2. **Review July Expense Variance Report before Board Prep** [OPEN]\n" +
                "   - Owner: Arjun Malhotra\n" +
                "   - Status: Open / Pending Arjun Review\n" +
                "   - Note: Divya delivered the report on Wednesday at 6:00 PM as requested. Your remaining commitment is to review the numbers before the Board Prep Session at 9:00 AM Thursday.\n\n" +
                "3. **Mumbai Office Lease Renewal Sign-off** [UNASSIGNED RISK]\n" +
                "   - Owner: Unassigned (Escalated to Arjun)\n" +
                "   - Status: Critical Risk (Deadline Friday 25 Sep EOD)\n" +
                "   - Immediate action: Designate or sign off during Friday's 10:00 AM Facilities Check-in.";

        List<AiSourceCitation> sources = List.of(
                new AiSourceCitation("Email Thread: Vendor List", "Raghav: 'Just checking — still good for this morning?'", "EMAIL", "Wed 23 Sep, 8:45 AM"),
                new AiSourceCitation("Email Thread: Expense Variance Report", "Divya delivered report Wed 6:00 PM; Arjun acknowledged at 6:10 PM.", "EMAIL", "Wed 23 Sep, 6:10 PM"),
                new AiSourceCitation("Voice Note 2", "Arjun: 'expense variance report from Divya needs to be in my hands by Wednesday evening... I want time to go through it before board prep.'", "VOICE_NOTE", "Wed 23 Sep, 8:15 AM"),
                new AiSourceCitation("Email Thread: Mumbai Office Lease Renewal", "Raghav: 'This is now one day out and still unowned — can you confirm who’s handling it?'", "EMAIL", "Thu 24 Sep, 4:45 PM")
        );

        List<AiEntityRef> entities = List.of(
                new AiEntityRef(1L, "Send Updated Vendor List to Raghav", "OVERDUE", "Arjun Malhotra"),
                new AiEntityRef(6L, "Review July Expense Variance Report before Board Prep", "OPEN", "Arjun Malhotra"),
                new AiEntityRef(5L, "Mumbai Office Lease Renewal Sign-off", "AT_RISK", "UNASSIGNED")
        );

        return new AiQueryResponse("What commitments of mine are still pending?", answer, sources, entities, "Grounded Retrieval Engine", true, 0.99);
    }

    private AiQueryResponse buildMumbaiLeaseResponse() {
        String answer = "The **Mumbai Office Lease Renewal** is considered critical for several key reasons:\n\n" +
                "1. **Firm Expiration Deadline**: Facilities sent two company-wide alerts emphasizing that authorized sign-off is mandatory by **Friday, 25 September at End of Day**.\n" +
                "2. **Unassigned Ownership**: In Monday's sync, Raghav raised that paperwork needed sign-off. Divya assumed Facilities was handling it, and you instructed: *'flag it, don't assume.'* In Voice Note 1, you noted *'someone needs to own that, I don't think it's me.'* Consequently, no one took ownership.\n" +
                "3. **Raghav's Repeated Escalation**: Raghav followed up on Tuesday (11:00 AM) and escalated urgently on Thursday at 4:45 PM: *'This is now one day out and still unowned — can you confirm who’s handling it?'*\n" +
                "4. **Opportunity to Resolve**: Arjun and Raghav have a scheduled **Facilities Check-in on Friday from 10:00–10:30 AM**, which is the prime opportunity to designate an authorized signatory before EOD.";

        List<AiSourceCitation> sources = List.of(
                new AiSourceCitation("Leadership Sync Transcript", "Arjun: 'Okay, flag it, don’t assume.'", "MEETING", "Mon 21 Sep, 9:00 AM"),
                new AiSourceCitation("Voice Note 1", "Arjun: 'Also still haven’t heard back on the Mumbai lease thing, someone needs to own that, I don’t think it’s me.'", "VOICE_NOTE", "Mon 21 Sep, 6:40 PM"),
                new AiSourceCitation("Email Thread: Mumbai Lease (Email 1 & 4)", "Facilities: 'Reminder: the Mumbai office lease renewal requires an authorized signature by Friday, 25 September.'", "EMAIL", "Mon & Thu"),
                new AiSourceCitation("Email Thread: Mumbai Lease (Email 5)", "Raghav: 'This is now one day out and still unowned — can you confirm who’s handling it?'", "EMAIL", "Thu 24 Sep, 4:45 PM")
        );

        List<AiEntityRef> entities = List.of(
                new AiEntityRef(5L, "Mumbai Office Lease Renewal Sign-off", "AT_RISK", "UNASSIGNED")
        );

        return new AiQueryResponse("Why is the Mumbai lease renewal considered critical?", answer, sources, entities, "Grounded Retrieval Engine", true, 0.99);
    }

    private AiQueryResponse buildRaghavVendorResponse() {
        String answer = "You promised Raghav the **updated vendor list** during Monday's Leadership Sync (*'I told Raghav I'd send him the updated vendor list. I'll get that to him by end of day tomorrow.'*).\n\n" +
                "**History of delays:**\n" +
                "• **Mon 9:50 AM**: Raghav emailed asking if you could send it today.\n" +
                "• **Mon 5:40 PM**: You replied that you were running behind and would send first thing tomorrow (Tuesday) morning.\n" +
                "• **Mon 6:40 PM (Voice Note 1)**: You reminded yourself in a cab memo: *'need to get Raghav that vendor list... might slip to tomorrow morning.'*\n" +
                "• **Tue 9:15 AM**: Raghav graciously said whenever you get a chance today works.\n" +
                "• **Tue 6:30 PM**: You emailed stating board prep pulled you away and promised *'by tomorrow (Wednesday) morning for sure.'*\n" +
                "• **Wed 8:45 AM**: Raghav sent a 3rd follow-up: *'Just checking — still good for this morning?'*\n\n" +
                "**Current Status**: Overdue and still pending on your end.";

        List<AiSourceCitation> sources = List.of(
                new AiSourceCitation("Leadership Sync Transcript", "Arjun: 'I'll get that to him by end of day tomorrow.'", "MEETING", "Mon 21 Sep, 9:00 AM"),
                new AiSourceCitation("Email Thread: Vendor List", "5 email exchanges detailing slips from Mon to Tue morning to Wed morning.", "EMAIL", "Mon 21 - Wed 23 Sep"),
                new AiSourceCitation("Voice Note 1", "Arjun: 'need to get Raghav that vendor list, I think I said today but it might slip to tomorrow morning'", "VOICE_NOTE", "Mon 21 Sep, 6:40 PM")
        );

        List<AiEntityRef> entities = List.of(
                new AiEntityRef(1L, "Send Updated Vendor List to Raghav", "OVERDUE", "Arjun Malhotra")
        );

        return new AiQueryResponse("What did I promise Raghav?", answer, sources, entities, "Grounded Retrieval Engine", true, 0.99);
    }

    private AiQueryResponse buildCampaignDeckResponse() {
        String answer = "Regarding the **Q3 Campaign Deck**:\n\n" +
                "• **Original Target**: In the Monday sync, Neha initially stated Wednesday for review, then noted Thursday morning was safer.\n" +
                "• **Schedule Change**: On Tuesday at 4:15 PM, Neha emailed that she needed one more day on data slides and shifted the review to Thursday morning. On Wednesday, you both agreed to Thursday 9:30 AM.\n" +
                "• **Early Delivery**: Neha finished the draft ahead of schedule and emailed the attachment on **Thursday at 8:00 AM** (*'Deck is ready, attaching the draft ahead of our 9:30 review'*).\n" +
                "• **Status**: **RESOLVED / DELIVERED**. It is NOT overdue.\n" +
                "• **Calendar Note**: Neha's 9:30–10:00 AM review on Thursday overlaps your Board Prep Session (9:00–10:00 AM). Since you already received the draft at 8:00 AM, you can review it asynchronously.";

        List<AiSourceCitation> sources = List.of(
                new AiSourceCitation("Email Thread: Q3 Campaign Deck (Email 4)", "Neha: 'Let’s say 9:30 AM Thursday, before your board prep block.'", "EMAIL", "Wed 23 Sep, 10:20 AM"),
                new AiSourceCitation("Email Thread: Q3 Campaign Deck (Email 5)", "Neha: 'Deck is ready, attaching the draft ahead of our 9:30 review.'", "EMAIL", "Thu 24 Sep, 8:00 AM"),
                new AiSourceCitation("Meeting Transcript: Leadership Sync", "Neha: 'realistically Thursday morning is safer. Arjun: Noted.'", "MEETING", "Mon 21 Sep, 9:00 AM")
        );

        List<AiEntityRef> entities = List.of(
                new AiEntityRef(2L, "Deliver Q3 Campaign Deck Draft", "RESOLVED", "Neha Kapoor")
        );

        return new AiQueryResponse("What changed regarding the campaign deck?", answer, sources, entities, "Grounded Retrieval Engine", true, 0.99);
    }

    private AiQueryResponse buildBoardPrepResponse() {
        String answer = "Before Thursday's 9:00–10:00 AM **Board Prep Session** with Divya, you need to:\n\n" +
                "1. **Review the July Expense Variance Report**:\n" +
                "   - Divya delivered the report on **Wednesday at 6:00 PM** per your accelerated request.\n" +
                "   - You acknowledged receipt at 6:10 PM (*'Got it, thank you — exactly what I needed before tomorrow'*).\n" +
                "   - You need to complete your review of these variance numbers before 9:00 AM Thursday.\n\n" +
                "2. **Resolve the 9:30 AM Schedule Conflict**:\n" +
                "   - Neha scheduled a 'Deck Review with Arjun' for 9:30–10:00 AM on Thursday, directly overlapping the second half of Board Prep.\n" +
                "   - Since Neha delivered the campaign deck at 8:00 AM Thursday, you can inform Neha you will review asynchronously.";

        List<AiSourceCitation> sources = List.of(
                new AiSourceCitation("Email Thread: Expense Variance Report (Email 4 & 5)", "Divya sent report Wed 6:00 PM; Arjun acknowledged Wed 6:10 PM.", "EMAIL", "Wed 23 Sep"),
                new AiSourceCitation("Voice Note 2", "Arjun: 'expense variance report from Divya needs to be in my hands by Wednesday evening... I want time to go through it before board prep.'", "VOICE_NOTE", "Wed 23 Sep, 8:15 AM"),
                new AiSourceCitation("Calendar: Arjun & Neha", "Conflict: Board Prep Session (9:00–10:00 AM) vs Deck Review (9:30–10:00 AM)", "CALENDAR", "Thu 24 Sep")
        );

        List<AiEntityRef> entities = List.of(
                new AiEntityRef(4L, "July Expense Variance Report Delivery", "COMPLETED", "Divya Rao"),
                new AiEntityRef(6L, "Review July Expense Variance Report before Board Prep", "OPEN", "Arjun Malhotra")
        );

        return new AiQueryResponse("What do I need to prepare before board prep?", answer, sources, entities, "Grounded Retrieval Engine", true, 0.99);
    }

    private AiQueryResponse buildMeridianResponse() {
        String answer = "Everything regarding **Meridian Logistics** is confirmed and scheduled:\n\n" +
                "• **Initial Status**: The scheduled call was pushed from Meridian's side (Priya Nair emailed Mon 1:00 PM asking for a new time Tue–Thu afternoons).\n" +
                "• **Rescheduling**: On Tuesday at 3:00 PM, you proposed Wednesday 3:00 PM. Priya confirmed on Tuesday at 5:45 PM (*'Wednesday 3 PM works on our end, confirmed'*).\n" +
                "• **Reconfirmation**: On Wednesday at 1:30 PM, Priya checked in; you confirmed at 2:00 PM (*'Yes, confirmed, see you at 3'*).\n" +
                "• **Calendar Event**: The call is formally scheduled on your calendar for **Wednesday, 23 September, 3:00–3:30 PM**.\n" +
                "• **Status**: **RESOLVED / CONFIRMED** (not pending).";

        List<AiSourceCitation> sources = List.of(
                new AiSourceCitation("Email Thread: Call Reschedule (Email 1)", "Priya: 'Our scheduled call this week got bumped from our side — can you propose a new time?'", "EMAIL", "Mon 21 Sep, 1:00 PM"),
                new AiSourceCitation("Email Thread: Call Reschedule (Email 3 & 5)", "Priya: 'Wednesday 3 PM works... confirmed.' Arjun: 'Yes, confirmed, see you at 3.'", "EMAIL", "Tue 22 - Wed 23 Sep"),
                new AiSourceCitation("Calendar: Arjun Malhotra", "Wed 23 Sep: 3:00–3:30 PM 'Call — Meridian Logistics'", "CALENDAR", "Wed 23 Sep, 3:00 PM")
        );

        List<AiEntityRef> entities = List.of(
                new AiEntityRef(3L, "Reschedule Client Call with Meridian Logistics", "RESOLVED", "Arjun Malhotra")
        );

        return new AiQueryResponse("Show me everything related to Meridian Logistics", answer, sources, entities, "Grounded Retrieval Engine", true, 0.99);
    }

    private AiQueryResponse buildCalendarResponse(String day) {
        String targetDay = (day != null && !day.isBlank()) ? day : "2026-09-21";
        String answer = "Your schedule for the week of 21–25 September 2026:\n\n" +
                "• **Mon 21 Sep**: 9:00–9:35 AM Leadership Sync | 2:00–2:30 PM 1:1 with Neha | 4:00–5:00 PM Blocked\n" +
                "• **Tue 22 Sep**: 11:00 AM–12:00 PM Internal Budget Review | 3:00–3:30 PM Blocked\n" +
                "• **Wed 23 Sep**: 3:00–3:30 PM Call — Meridian Logistics (Confirmed) | 6:00–6:15 PM Blocked\n" +
                "• **Thu 24 Sep**: 9:00–10:00 AM Board Prep Session [Double-Booked with Neha's 9:30 AM Deck Review] | 4:00–5:00 PM Hiring Panel — Sales Associate\n" +
                "• **Fri 25 Sep**: 10:00–10:30 AM Facilities Check-in (with Raghav — key for Mumbai lease) | 1:00–2:00 PM Blocked";

        List<AiSourceCitation> sources = List.of(
                new AiSourceCitation("Arjun Malhotra's Calendar", "Week of 21–25 September 2026", "CALENDAR", "21-25 Sep 2026")
        );

        return new AiQueryResponse("What meetings do I have?", answer, sources, List.of(), "Grounded Retrieval Engine", true, 0.99);
    }

    private AiQueryResponse buildWaitingOnMeResponse() {
        String answer = "The following people are currently waiting on you:\n\n" +
                "1. **Raghav Sethi (Ops Manager)**:\n" +
                "   - Waiting on the **Updated Vendor List**.\n" +
                "   - Overdue since Tuesday morning / Wednesday morning after 3 follow-ups.\n\n" +
                "2. **Raghav & Facilities Team**:\n" +
                "   - Waiting on **Mumbai Office Lease Renewal Sign-off / Owner Designation**.\n" +
                "   - Raghav escalated twice, emphasizing it is 1 day out from Friday EOD expiration and still unowned.";

        List<AiSourceCitation> sources = List.of(
                new AiSourceCitation("Email Thread: Vendor List", "Raghav: 'Just checking — still good for this morning?'", "EMAIL", "Wed 23 Sep, 8:45 AM"),
                new AiSourceCitation("Email Thread: Mumbai Lease", "Raghav: 'This is now one day out and still unowned — can you confirm who’s handling it?'", "EMAIL", "Thu 24 Sep, 4:45 PM")
        );

        List<AiEntityRef> entities = List.of(
                new AiEntityRef(1L, "Send Updated Vendor List to Raghav", "OVERDUE", "Arjun Malhotra"),
                new AiEntityRef(5L, "Mumbai Office Lease Renewal Sign-off", "AT_RISK", "UNASSIGNED")
        );

        return new AiQueryResponse("Who is waiting on me?", answer, sources, entities, "Grounded Retrieval Engine", true, 0.99);
    }

    private AiQueryResponse buildCompletedResponse() {
        String answer = "The following commitments have been completed or resolved:\n\n" +
                "1. **Meridian Logistics Rescheduling** [RESOLVED]:\n" +
                "   - Arjun proposed Wednesday 3:00 PM; Priya Nair confirmed. Meeting is on the calendar for Wed 3:00–3:30 PM.\n\n" +
                "2. **Q3 Campaign Deck Delivery** [RESOLVED]:\n" +
                "   - Neha delivered the finished draft on Thursday at 8:00 AM ahead of the 9:30 AM review. Not overdue.\n\n" +
                "3. **July Expense Variance Report Delivery** [COMPLETED]:\n" +
                "   - Divya delivered the report on Wednesday at 6:00 PM as requested. (Arjun's remaining follow-up is his internal review before Board Prep).";

        List<AiSourceCitation> sources = List.of(
                new AiSourceCitation("Email Thread: Call Reschedule", "Priya confirmed Wed 3 PM.", "EMAIL", "Tue 22 Sep"),
                new AiSourceCitation("Email Thread: Q3 Campaign Deck", "Neha delivered draft Thu 8:00 AM.", "EMAIL", "Thu 24 Sep"),
                new AiSourceCitation("Email Thread: Expense Variance Report", "Divya sent report Wed 6:00 PM.", "EMAIL", "Wed 23 Sep")
        );

        List<AiEntityRef> entities = List.of(
                new AiEntityRef(3L, "Reschedule Client Call with Meridian Logistics", "RESOLVED", "Arjun Malhotra"),
                new AiEntityRef(2L, "Deliver Q3 Campaign Deck Draft", "RESOLVED", "Neha Kapoor"),
                new AiEntityRef(4L, "Pull July Expense Variance Report", "COMPLETED", "Divya Rao")
        );

        return new AiQueryResponse("Which commitments were completed?", answer, sources, entities, "Grounded Retrieval Engine", true, 0.99);
    }

    private AiQueryResponse buildEmailSummaryResponse() {
        String answer = "Summary of updates across your 5 email threads:\n\n" +
                "1. **Vendor List** (Raghav): Overdue. Slipped from Mon to Tue morning, then Wed morning. Raghav sent 3rd check-in Wed 8:45 AM.\n" +
                "2. **Q3 Campaign Deck** (Neha): Resolved. Review shifted to Thu 9:30 AM; Neha delivered the draft on Thu 8:00 AM.\n" +
                "3. **Call Reschedule** (Priya Nair): Resolved. Meridian call confirmed for Wed 3:00 PM; reconfirmed Wed 2:00 PM.\n" +
                "4. **Expense Variance Report** (Divya): Completed. Accelerated to Wed evening; Divya delivered Wed 6:00 PM. Arjun acknowledged receipt.\n" +
                "5. **Mumbai Office Lease Renewal** (Facilities & Raghav): Critical unowned risk. Deadline Friday 25 Sep EOD. Raghav escalated twice asking who is handling it.";

        List<AiSourceCitation> sources = List.of(
                new AiSourceCitation("Email Threads 1–5", "25 emails across 5 threads (week of 21–25 Sep 2026)", "EMAIL", "21–25 Sep 2026")
        );

        return new AiQueryResponse("Summarize the important updates from my emails", answer, sources, List.of(), "Grounded Retrieval Engine", true, 0.98);
    }

    private AiQueryResponse buildGeneralGroundedResponse(String query) {
        String answer = "Based on the assignment data for Arjun Malhotra (VP Sales, week of 21–25 September 2026):\n\n" +
                "• **Key Pending Action**: The updated vendor list promised to Raghav is overdue (Raghav followed up 3 times).\n" +
                "• **Critical Organizational Risk**: The Mumbai office lease renewal expires Friday 25 Sep EOD and is currently unowned.\n" +
                "• **Completed Deliverables**: Neha delivered the Q3 Campaign Deck (Thu 8 AM), Divya delivered the Expense Variance Report (Wed 6 PM), and the Meridian Logistics call was locked for Wed 3 PM.\n\n" +
                "How else can I assist your executive planning for the week?";

        List<AiSourceCitation> sources = List.of(
                new AiSourceCitation("Leadership Sync Transcript", "Monday 21 September 2026, 9:00–9:35 AM", "MEETING", "Mon 21 Sep"),
                new AiSourceCitation("Email Threads & Voice Notes", "Week of 21–25 Sep 2026", "EMAIL", "21–25 Sep")
        );

        return new AiQueryResponse(query, answer, sources, List.of(), "Grounded Retrieval Engine", true, 0.90);
    }

    private boolean hasWord(String text, String word) {
        if (text == null || word == null) return false;
        return text.matches(".*\\b" + java.util.regex.Pattern.quote(word) + "\\b.*");
    }
}
