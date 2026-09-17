package com.veridian.execagent.config;

import com.veridian.execagent.model.*;
import com.veridian.execagent.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class DataLoader implements CommandLineRunner {

    private final PersonRepository personRepo;
    private final CommitmentRepository commitmentRepo;
    private final CalendarEventRepository calendarRepo;
    private final EmailThreadRepository threadRepo;
    private final EmailMessageRepository messageRepo;
    private final MeetingRepository meetingRepo;
    private final VoiceNoteRepository voiceNoteRepo;

    public DataLoader(PersonRepository personRepo,
                      CommitmentRepository commitmentRepo,
                      CalendarEventRepository calendarRepo,
                      EmailThreadRepository threadRepo,
                      EmailMessageRepository messageRepo,
                      MeetingRepository meetingRepo,
                      VoiceNoteRepository voiceNoteRepo) {
        this.personRepo = personRepo;
        this.commitmentRepo = commitmentRepo;
        this.calendarRepo = calendarRepo;
        this.threadRepo = threadRepo;
        this.messageRepo = messageRepo;
        this.meetingRepo = meetingRepo;
        this.voiceNoteRepo = voiceNoteRepo;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (personRepo.count() > 0) {
            return;
        }

        // 1. Seed People
        Person arjun = personRepo.save(new Person("Arjun Malhotra", "VP Sales", "arjun.malhotra@veridian-corp.example", true));
        Person neha = personRepo.save(new Person("Neha Kapoor", "Marketing Lead", "neha.kapoor@veridian-corp.example", false));
        Person raghav = personRepo.save(new Person("Raghav Sethi", "Ops Manager", "raghav.sethi@veridian-corp.example", false));
        Person divya = personRepo.save(new Person("Divya Rao", "Finance", "divya.rao@veridian-corp.example", false));
        Person priya = personRepo.save(new Person("Priya Nair", "Meridian Logistics", "priya.nair@meridianlogistics.example", false));
        Person facilities = personRepo.save(new Person("Facilities", "Internal Facilities Team", "facilities@veridian-corp.example", false));

        // 2. Seed Meeting
        Meeting sync = new Meeting();
        sync.setTitle("Leadership Sync");
        sync.setDate("Monday 21 September 2026");
        sync.setTime("9:00–9:35 AM");
        sync.setAttendees("Arjun Malhotra, Neha Kapoor, Raghav Sethi, Divya Rao");
        sync.setTranscript(
            "Arjun: Let’s keep this quick. Neha, where are we on the Q3 campaign deck?\n" +
            "Neha: Draft is 80% done. I’ll send it to Arjun for review by Wednesday.\n" +
            "Arjun: Good. Also, remind me — I told Raghav I’d send him the updated vendor list. I’ll get that to him by end of day tomorrow.\n" +
            "Raghav: Appreciated. Separately, the Mumbai office renewal paperwork needs someone to sign off this week. Not sure whose desk that’s on right now.\n" +
            "Divya: I think that’s supposed to be Facilities, but I haven’t seen anyone pick it up.\n" +
            "Arjun: Okay, flag it, don’t assume. Divya, can you also pull the July expense variance report before Thursday’s board prep?\n" +
            "Divya: Yes, I’ll have it ready Wednesday evening.\n" +
            "Arjun: One more thing — client call with Meridian Logistics got pushed. I need to reconfirm the new time with their team myself.\n" +
            "Neha: Also, just a reminder, the campaign deck review — I said Wednesday, but realistically Thursday morning is safer.\n" +
            "Arjun: Noted. Let’s close here."
        );
        meetingRepo.save(sync);

        // 3. Seed Voice Notes
        VoiceNote vn1 = new VoiceNote();
        vn1.setNoteNumber(1);
        vn1.setTimestamp("Monday 21 Sep, 6:40 PM");
        vn1.setContext("Recorded in cab");
        vn1.setTranscript("Quick note to self — need to get Raghav that vendor list, I think I said today but it might slip to tomorrow morning, remind me. Also still haven’t heard back on the Mumbai lease thing, someone needs to own that, I don’t think it’s me.");
        vn1.setExtractedCommitments("1. Vendor list to Raghav needs sending (slipping to Tue morning). 2. Mumbai lease renewal still unowned, someone needs to take it.");
        voiceNoteRepo.save(vn1);

        VoiceNote vn2 = new VoiceNote();
        vn2.setNoteNumber(2);
        vn2.setTimestamp("Wednesday 23 Sep, 8:15 AM");
        vn2.setContext("Personal memo before workday");
        vn2.setTranscript("Reminder — expense variance report from Divya needs to be in my hands by Wednesday evening, not Thursday, I want time to go through it before board prep. Also Meridian call — I owe Priya a time, need to lock that in today.");
        vn2.setExtractedCommitments("1. Expense variance report must arrive Wed evening for board prep review. 2. Meridian call needs locking in.");
        voiceNoteRepo.save(vn2);

        // 4. Seed Calendars
        seedCalendars(arjun, neha, raghav, divya);

        // 5. Seed Email Threads & Messages
        seedEmailThreads(arjun, neha, raghav, divya, priya, facilities);

        // 6. Seed Commitments
        seedCommitments(arjun, neha, raghav, divya, priya);
    }

    private void seedCalendars(Person arjun, Person neha, Person raghav, Person divya) {
        // Arjun
        addEvent(arjun, "Mon 21 Sep", "2026-09-21", "09:00", "09:35", "9:00–9:35 AM", "Leadership Sync", false, false, null);
        addEvent(arjun, "Mon 21 Sep", "2026-09-21", "14:00", "14:30", "2:00–2:30 PM", "1:1 with Neha", false, false, null);
        addEvent(arjun, "Mon 21 Sep", "2026-09-21", "16:00", "17:00", "4:00–5:00 PM", "Blocked", true, false, null);
        addEvent(arjun, "Tue 22 Sep", "2026-09-22", "11:00", "12:00", "11:00 AM–12:00 PM", "Internal Budget Review", false, false, null);
        addEvent(arjun, "Tue 22 Sep", "2026-09-22", "15:00", "15:30", "3:00–3:30 PM", "Blocked", true, false, null);
        addEvent(arjun, "Wed 23 Sep", "2026-09-23", "15:00", "15:30", "3:00–3:30 PM", "Call — Meridian Logistics", false, false, "Client rescheduled call confirmed with Priya Nair.");
        addEvent(arjun, "Wed 23 Sep", "2026-09-23", "18:00", "18:15", "6:00–6:15 PM", "Blocked", true, false, null);
        addEvent(arjun, "Thu 24 Sep", "2026-09-24", "09:00", "10:00", "9:00–10:00 AM", "Board Prep Session", false, true, "CRITICAL CONFLICT: Neha scheduled 'Deck Review with Arjun' for 9:30–10:00 AM overlapping this session!");
        addEvent(arjun, "Thu 24 Sep", "2026-09-24", "16:00", "17:00", "4:00–5:00 PM", "Hiring Panel — Sales Associate", false, false, null);
        addEvent(arjun, "Fri 25 Sep", "2026-09-25", "10:00", "10:30", "10:00–10:30 AM", "Facilities Check-in", false, false, "Crucial touchpoint to resolve Mumbai lease sign-off before Friday EOD.");
        addEvent(arjun, "Fri 25 Sep", "2026-09-25", "13:00", "14:00", "1:00–2:00 PM", "Blocked", true, false, null);

        // Neha
        addEvent(neha, "Mon 21 Sep", "2026-09-21", "10:00", "11:00", "10:00–11:00 AM", "Blocked", true, false, null);
        addEvent(neha, "Mon 21 Sep", "2026-09-21", "14:00", "14:30", "2:00–2:30 PM", "1:1 with Arjun", false, false, null);
        addEvent(neha, "Tue 22 Sep", "2026-09-22", "13:00", "14:00", "1:00–2:00 PM", "Campaign Vendor Call", false, false, null);
        addEvent(neha, "Wed 23 Sep", "2026-09-23", "10:00", "10:30", "10:00–10:30 AM", "Deck Prep", false, false, null);
        addEvent(neha, "Wed 23 Sep", "2026-09-23", "13:00", "15:00", "1:00–3:00 PM", "Blocked", true, false, null);
        addEvent(neha, "Thu 24 Sep", "2026-09-24", "09:30", "10:00", "9:30–10:00 AM", "Deck Review with Arjun", false, true, "Conflicts with Arjun's 9:00-10:00 AM Board Prep Session.");
        addEvent(neha, "Fri 25 Sep", "2026-09-25", "11:00", "12:00", "11:00 AM–12:00 PM", "Blocked", true, false, null);

        // Raghav
        addEvent(raghav, "Mon 21 Sep", "2026-09-21", "09:00", "09:35", "9:00–9:35 AM", "Leadership Sync", false, false, null);
        addEvent(raghav, "Mon 21 Sep", "2026-09-21", "13:00", "14:00", "1:00–2:00 PM", "Blocked", true, false, null);
        addEvent(raghav, "Tue 22 Sep", "2026-09-22", "11:00", "12:00", "11:00 AM–12:00 PM", "Internal Budget Review", false, false, null);
        addEvent(raghav, "Tue 22 Sep", "2026-09-22", "15:30", "16:00", "3:30–4:00 PM", "Ops Standup", false, false, null);
        addEvent(raghav, "Wed 23 Sep", "2026-09-23", "09:00", "11:00", "9:00–11:00 AM", "Blocked", true, false, null);
        addEvent(raghav, "Thu 24 Sep", "2026-09-24", "14:00", "15:00", "2:00–3:00 PM", "Blocked", true, false, null);
        addEvent(raghav, "Fri 25 Sep", "2026-09-25", "10:00", "10:30", "10:00–10:30 AM", "Facilities Check-in", false, false, "With Arjun");
        addEvent(raghav, "Fri 25 Sep", "2026-09-25", "15:00", "16:00", "3:00–4:00 PM", "Blocked", true, false, null);

        // Divya
        addEvent(divya, "Mon 21 Sep", "2026-09-21", "14:30", "15:00", "2:30–3:00 PM", "Budget Prep", false, false, null);
        addEvent(divya, "Mon 21 Sep", "2026-09-21", "16:00", "17:00", "4:00–5:00 PM", "Blocked", true, false, null);
        addEvent(divya, "Tue 22 Sep", "2026-09-22", "09:00", "09:15", "9:00–9:15 AM", "Quick Call with Arjun", false, false, null);
        addEvent(divya, "Tue 22 Sep", "2026-09-22", "11:00", "12:00", "11:00 AM–12:00 PM", "Internal Budget Review", false, false, null);
        addEvent(divya, "Wed 23 Sep", "2026-09-23", "13:00", "14:00", "1:00–2:00 PM", "Blocked", true, false, null);
        addEvent(divya, "Thu 24 Sep", "2026-09-24", "09:00", "10:00", "9:00–10:00 AM", "Board Prep Session", false, false, "With Arjun");
        addEvent(divya, "Thu 24 Sep", "2026-09-24", "14:00", "15:00", "2:00–3:00 PM", "Blocked", true, false, null);
        addEvent(divya, "Fri 25 Sep", "2026-09-25", "10:00", "11:00", "10:00–11:00 AM", "Blocked", true, false, null);
    }

    private void addEvent(Person person, String dayDate, String isoDate, String startTime, String endTime,
                          String timeRange, String title, boolean isBlocked, boolean hasConflict, String conflictNotes) {
        CalendarEvent ev = new CalendarEvent();
        ev.setPerson(person);
        ev.setDayDate(dayDate);
        ev.setIsoDate(isoDate);
        ev.setStartTime(startTime);
        ev.setEndTime(endTime);
        ev.setTimeRange(timeRange);
        ev.setTitle(title);
        ev.setBlocked(isBlocked);
        ev.setHasConflict(hasConflict);
        ev.setConflictNotes(conflictNotes);
        calendarRepo.save(ev);
    }

    private void seedEmailThreads(Person arjun, Person neha, Person raghav, Person divya, Person priya, Person facilities) {
        // Thread 1: Vendor List
        EmailThread t1 = new EmailThread();
        t1.setSubject("Vendor List");
        t1.setStatusSummary("Raghav has followed up 3 times. Arjun promised for Tuesday morning, then Wednesday morning, but list is still pending.");
        t1.setWaitingOn("Waiting on Arjun");
        t1.setCategory("Operations");
        t1 = threadRepo.save(t1);

        addMsg(t1, 1, "Mon 21 Sep, 9:50 AM", raghav, arjun.getEmail(), "Following up from the sync — can you send the updated vendor list today?");
        addMsg(t1, 2, "Mon 21 Sep, 5:40 PM", arjun, raghav.getEmail(), "Running behind, will send first thing tomorrow morning instead.");
        addMsg(t1, 3, "Tue 22 Sep, 9:15 AM", raghav, arjun.getEmail(), "No worries, whenever you get a chance today works.");
        addMsg(t1, 4, "Tue 22 Sep, 6:30 PM", arjun, raghav.getEmail(), "Sorry, got pulled into board prep — will send by tomorrow (Wednesday) morning for sure.");
        addMsg(t1, 5, "Wed 23 Sep, 8:45 AM", raghav, arjun.getEmail(), "Just checking — still good for this morning?");

        // Thread 2: Q3 Campaign Deck
        EmailThread t2 = new EmailThread();
        t2.setSubject("Q3 Campaign Deck");
        t2.setStatusSummary("Review shifted to Thursday 9:30 AM. Neha completed the deck and delivered the draft on Thursday 8:00 AM ahead of schedule.");
        t2.setWaitingOn("Resolved / Delivered by Neha");
        t2.setCategory("Marketing");
        t2 = threadRepo.save(t2);

        addMsg(t2, 1, "Mon 21 Sep, 11:00 AM", neha, arjun.getEmail(), "Deck’s coming together, still targeting Wednesday for your review.");
        addMsg(t2, 2, "Tue 22 Sep, 4:15 PM", neha, arjun.getEmail(), "Heads up — shifting the review to Thursday morning instead of Wednesday, need one more day on the data slides.");
        addMsg(t2, 3, "Wed 23 Sep, 10:00 AM", arjun, neha.getEmail(), "Understood, Thursday morning works. What time exactly?");
        addMsg(t2, 4, "Wed 23 Sep, 10:20 AM", neha, arjun.getEmail(), "Let’s say 9:30 AM Thursday, before your board prep block.");
        addMsg(t2, 5, "Thu 24 Sep, 8:00 AM", neha, arjun.getEmail(), "Deck is ready, attaching the draft ahead of our 9:30 review.");

        // Thread 3: Call Reschedule
        EmailThread t3 = new EmailThread();
        t3.setSubject("Call Reschedule");
        t3.setStatusSummary("Meridian Logistics call rescheduled. Arjun proposed Wednesday 3:00 PM; Priya confirmed. Successfully scheduled on calendar.");
        t3.setWaitingOn("Resolved / Scheduled");
        t3.setCategory("Client");
        t3 = threadRepo.save(t3);

        addMsg(t3, 1, "Mon 21 Sep, 1:00 PM", priya, arjun.getEmail(), "Our scheduled call this week got bumped from our side — can you propose a new time? We’re flexible Tuesday–Thursday afternoons.");
        addMsg(t3, 2, "Tue 22 Sep, 3:00 PM", arjun, priya.getEmail(), "Apologies for the delay — how about Wednesday 3:00 PM?");
        addMsg(t3, 3, "Tue 22 Sep, 5:45 PM", priya, arjun.getEmail(), "Wednesday 3 PM works on our end, confirmed.");
        addMsg(t3, 4, "Wed 23 Sep, 1:30 PM", priya, arjun.getEmail(), "Quick check — still on for 3 PM today?");
        addMsg(t3, 5, "Wed 23 Sep, 2:00 PM", arjun, priya.getEmail(), "Yes, confirmed, see you at 3.");

        // Thread 4: Expense Variance Report
        EmailThread t4 = new EmailThread();
        t4.setSubject("Expense Variance Report");
        t4.setStatusSummary("Divya accelerated delivery to Wednesday evening per Arjun's request and delivered the report at 6:00 PM. Arjun acknowledged receipt. Arjun still needs to review before Board Prep.");
        t4.setWaitingOn("Arjun review before Board Prep");
        t4.setCategory("Finance");
        t4 = threadRepo.save(t4);

        addMsg(t4, 1, "Mon 21 Sep, 2:30 PM", divya, arjun.getEmail(), "Starting on the July variance numbers, targeting Thursday morning for board prep as discussed.");
        addMsg(t4, 2, "Tue 22 Sep, 9:00 AM", arjun, divya.getEmail(), "Actually, can I get it by Wednesday evening instead? Want time to review before Thursday.");
        addMsg(t4, 3, "Tue 22 Sep, 9:40 AM", divya, arjun.getEmail(), "Wednesday evening is tight but doable, I’ll prioritize it.");
        addMsg(t4, 4, "Wed 23 Sep, 6:00 PM", divya, arjun.getEmail(), "Report attached, sent as promised.");
        addMsg(t4, 5, "Wed 23 Sep, 6:10 PM", arjun, divya.getEmail(), "Got it, thank you — exactly what I needed before tomorrow.");

        // Thread 5: Mumbai Office Lease Renewal
        EmailThread t5 = new EmailThread();
        t5.setSubject("Mumbai Office Lease Renewal");
        t5.setStatusSummary("Critical unassigned risk. Sign-off deadline is Friday 25 Sep EOD. Facilities sent 2 reminders. Raghav escalated twice. Ownership remains unresolved.");
        t5.setWaitingOn("Unassigned / Escalated to Arjun");
        t5.setCategory("Facilities");
        t5 = threadRepo.save(t5);

        addMsg(t5, 1, "Mon 21 Sep, 10:15 AM", facilities, "All Staff", "Reminder: the Mumbai office lease renewal requires an authorized signature by Friday, 25 September.");
        addMsg(t5, 2, "Tue 22 Sep, 11:00 AM", raghav, "arjun.malhotra@veridian-corp.example, divya.rao@veridian-corp.example", "Following up from the sync — has anyone confirmed who’s signing off on the Mumbai renewal? Don’t think it’s been assigned.");
        addMsg(t5, 3, "Wed 23 Sep, 9:30 AM", divya, "raghav.sethi@veridian-corp.example, arjun.malhotra@veridian-corp.example", "Not on my end — I believe this typically sits with Facilities directly, not us.");
        addMsg(t5, 4, "Thu 24 Sep, 4:00 PM", facilities, "All Staff", "Second reminder: signature is still pending. Deadline is Friday, 25 September, end of day.");
        addMsg(t5, 5, "Thu 24 Sep, 4:45 PM", raghav, arjun.getEmail(), "This is now one day out and still unowned — can you confirm who’s handling it?");
    }

    private void addMsg(EmailThread thread, int seq, String timestamp, Person sender, String recipient, String body) {
        EmailMessage msg = new EmailMessage();
        msg.setThread(thread);
        msg.setSequenceNumber(seq);
        msg.setTimestamp(timestamp);
        msg.setSender(sender);
        msg.setSenderRaw(sender != null ? sender.getName() : "Unknown");
        msg.setRecipient(recipient);
        msg.setBody(body);
        messageRepo.save(msg);
    }

    private void seedCommitments(Person arjun, Person neha, Person raghav, Person divya, Person priya) {
        // 1. Vendor List
        Commitment c1 = new Commitment();
        c1.setTitle("Send Updated Vendor List to Raghav");
        c1.setDescription("Arjun promised to send Raghav the updated vendor list. The commitment was delayed repeatedly across Monday, Tuesday, and Wednesday.");
        c1.setOwner(arjun);
        c1.setCounterparty(raghav);
        c1.setStatus("OVERDUE");
        c1.setPriority("HIGH");
        c1.setCategory("Operations");
        c1.setOriginalDeadline("Tuesday 22 Sep, End of Day");
        c1.setCurrentDeadline("Wednesday 23 Sep, Morning");
        c1.setDelayCount(3);
        c1.setWhyItMatters("Raghav needs the vendor list for ongoing operations. He has followed up 3 separate times (Mon 9:50 AM, Tue 9:15 AM, Wed 8:45 AM).");
        c1.setSourceDocument("Leadership Sync (Mon 9:00 AM), Email Thread: Vendor List, Voice Note 1 (Mon 6:40 PM)");
        c1.setSourceQuote("Arjun in sync: 'I told Raghav I’d send him the updated vendor list. I’ll get that to him by end of day tomorrow.' Email Wed 8:45 AM: 'Just checking — still good for this morning?'");
        c1.setResolutionNotes("STILL PENDING. Arjun has not sent the vendor list as of Wednesday morning.");
        commitmentRepo.save(c1);

        // 2. Q3 Campaign Deck
        Commitment c2 = new Commitment();
        c2.setTitle("Deliver Q3 Campaign Deck Draft");
        c2.setDescription("Neha committed to sending the Q3 campaign deck for review. Review was shifted from Wednesday to Thursday 9:30 AM.");
        c2.setOwner(neha);
        c2.setCounterparty(arjun);
        c2.setStatus("RESOLVED");
        c2.setPriority("HIGH");
        c2.setCategory("Marketing");
        c2.setOriginalDeadline("Wednesday 23 Sep");
        c2.setCurrentDeadline("Thursday 24 Sep, 9:30 AM");
        c2.setDelayCount(1);
        c2.setWhyItMatters("Crucial for marketing roadmap and executive alignment.");
        c2.setSourceDocument("Leadership Sync (Mon 9:00 AM), Email Thread: Q3 Campaign Deck, Neha's Calendar");
        c2.setSourceQuote("Neha email Thu 8:00 AM: 'Deck is ready, attaching the draft ahead of our 9:30 review.'");
        c2.setResolutionNotes("COMPLETED & DELIVERED. Neha sent draft at 8:00 AM Thursday ahead of 9:30 AM review. Note: 9:30 review overlaps Arjun's Board Prep.");
        commitmentRepo.save(c2);

        // 3. Meridian Logistics Call
        Commitment c3 = new Commitment();
        c3.setTitle("Reschedule Client Call with Meridian Logistics");
        c3.setDescription("Arjun needed to reconfirm a rescheduled call time with external client Meridian Logistics.");
        c3.setOwner(arjun);
        c3.setCounterparty(priya);
        c3.setStatus("RESOLVED");
        c3.setPriority("HIGH");
        c3.setCategory("Client");
        c3.setOriginalDeadline("Tuesday–Thursday afternoons");
        c3.setCurrentDeadline("Wednesday 23 Sep, 3:00 PM");
        c3.setDelayCount(0);
        c3.setWhyItMatters("Key client relationship; ensuring sales alignment with Meridian Logistics.");
        c3.setSourceDocument("Leadership Sync (Mon 9:00 AM), Email Thread: Call Reschedule, Voice Note 2, Arjun's Calendar");
        c3.setSourceQuote("Priya email Tue 5:45 PM: 'Wednesday 3 PM works on our end, confirmed.' Arjun email Wed 2:00 PM: 'Yes, confirmed, see you at 3.'");
        c3.setResolutionNotes("CONFIRMED & SCHEDULED. Meeting locked on Arjun's calendar for Wednesday 3:00–3:30 PM.");
        commitmentRepo.save(c3);

        // 4. Expense Variance Report
        Commitment c4 = new Commitment();
        c4.setTitle("Pull July Expense Variance Report before Board Prep");
        c4.setDescription("Divya was tasked to pull July expense variance numbers. Arjun requested it for Wednesday evening to review prior to Thursday Board Prep.");
        c4.setOwner(divya);
        c4.setCounterparty(arjun);
        c4.setStatus("COMPLETED");
        c4.setPriority("HIGH");
        c4.setCategory("Finance");
        c4.setOriginalDeadline("Thursday 24 Sep morning");
        c4.setCurrentDeadline("Wednesday 23 Sep, 6:00 PM");
        c4.setDelayCount(0);
        c4.setWhyItMatters("Arjun requires these variance numbers to prepare for Thursday's 9:00 AM Board Prep Session.");
        c4.setSourceDocument("Leadership Sync (Mon 9:00 AM), Email Thread: Expense Variance Report, Voice Note 2");
        c4.setSourceQuote("Divya email Wed 6:00 PM: 'Report attached, sent as promised.' Arjun email Wed 6:10 PM: 'Got it, thank you — exactly what I needed before tomorrow.'");
        c4.setResolutionNotes("DELIVERED BY DIVYA. Report delivered Wednesday at 6:00 PM. Follow-up: Arjun still has the internal action item to review it before Board Prep.");
        commitmentRepo.save(c4);

        // 5. Mumbai Office Lease Renewal
        Commitment c5 = new Commitment();
        c5.setTitle("Resolve Sign-off & Ownership for Mumbai Office Lease Renewal");
        c5.setDescription("Mumbai office renewal requires authorized sign-off by Friday 25 Sep EOD. Ownership is unassigned and unowned.");
        c5.setOwner(null); // Unassigned
        c5.setCounterparty(arjun);
        c5.setStatus("AT_RISK");
        c5.setPriority("CRITICAL");
        c5.setCategory("Facilities");
        c5.setOriginalDeadline("Friday 25 Sep, End of Day");
        c5.setCurrentDeadline("Friday 25 Sep, End of Day");
        c5.setDelayCount(2);
        c5.setWhyItMatters("High organizational risk. Lease expiration without signature impacts Mumbai office operations. Raghav escalated on Tue and Thu.");
        c5.setSourceDocument("Leadership Sync (Mon 9:00 AM), Email Thread: Mumbai Office Lease Renewal, Voice Note 1");
        c5.setSourceQuote("Arjun in sync: 'flag it, don’t assume.' Voice Note 1: 'someone needs to own that, I don’t think it’s me.' Raghav email Thu 4:45 PM: 'This is now one day out and still unowned — can you confirm who’s handling it?'");
        c5.setResolutionNotes("UNRESOLVED / UNASSIGNED. Escalated to Arjun. Raghav and Arjun have a Facilities Check-in on Friday 10:00–10:30 AM where this must be addressed.");
        commitmentRepo.save(c5);

        // 6. Review July Expense Variance Report (Arjun's internal commitment)
        Commitment c6 = new Commitment();
        c6.setTitle("Review July Expense Variance Report before Board Prep");
        c6.setDescription("Review the numbers provided by Divya on Wednesday evening prior to the Board Prep Session at 9:00 AM Thursday.");
        c6.setOwner(arjun);
        c6.setCounterparty(divya);
        c6.setStatus("OPEN");
        c6.setPriority("HIGH");
        c6.setCategory("Finance");
        c6.setOriginalDeadline("Thursday 24 Sep, 9:00 AM");
        c6.setCurrentDeadline("Thursday 24 Sep, 9:00 AM");
        c6.setDelayCount(0);
        c6.setWhyItMatters("Required for executive readiness in the Board Prep Session.");
        c6.setSourceDocument("Leadership Sync, Email Thread 4, Voice Note 2");
        c6.setSourceQuote("Voice Note 2: 'expense variance report from Divya needs to be in my hands by Wednesday evening, not Thursday, I want time to go through it before board prep.'");
        c6.setResolutionNotes("PENDING ARJUN REVIEW. Divya completed delivery Wednesday 6 PM. Arjun must complete his review before 9:00 AM Thursday.");
        commitmentRepo.save(c6);
    }
}
