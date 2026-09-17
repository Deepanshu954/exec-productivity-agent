package com.veridian.execagent;

import com.veridian.execagent.model.Commitment;
import com.veridian.execagent.repository.*;
import com.veridian.execagent.service.ai.AiQueryRequest;
import com.veridian.execagent.service.ai.AiQueryResponse;
import com.veridian.execagent.service.ai.AiService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class ExecAgentApplicationTests {

    @Autowired
    private PersonRepository personRepo;

    @Autowired
    private CommitmentRepository commitmentRepo;

    @Autowired
    private CalendarEventRepository calendarRepo;

    @Autowired
    private EmailThreadRepository threadRepo;

    @Autowired
    private MeetingRepository meetingRepo;

    @Autowired
    private VoiceNoteRepository voiceNoteRepo;

    @Autowired
    private AiService aiService;

    @Test
    @DisplayName("Verify assignment database entities are fully seeded")
    void verifyDataSeeding() {
        assertEquals(6, personRepo.count(), "6 people should be seeded");
        assertEquals(6, commitmentRepo.count(), "6 commitments should be seeded");
        assertTrue(calendarRepo.count() >= 25, "Calendar events should be seeded");
        assertEquals(5, threadRepo.count(), "5 email threads should be seeded");
        assertEquals(1, meetingRepo.count(), "1 leadership sync meeting should be seeded");
        assertEquals(2, voiceNoteRepo.count(), "2 voice notes should be seeded");
    }

    @Test
    @DisplayName("Scenario 1: Vendor List is identified as overdue with 3 delays")
    void testScenario1VendorList() {
        AiQueryResponse resp = aiService.query(new AiQueryRequest("What did I promise Raghav?", "2026-09-23"));
        assertNotNull(resp);
        assertTrue(resp.isGrounded());
        assertTrue(resp.getAnswer().toLowerCase().contains("vendor list"));
        assertTrue(resp.getAnswer().toLowerCase().contains("overdue") || resp.getAnswer().toLowerCase().contains("delay"));
        assertFalse(resp.getSources().isEmpty(), "Sources must be cited");

        Commitment vendor = commitmentRepo.findAll().stream()
                .filter(c -> c.getTitle().toLowerCase().contains("vendor"))
                .findFirst()
                .orElseThrow();
        assertEquals("OVERDUE", vendor.getStatus());
        assertEquals(3, vendor.getDelayCount());
    }

    @Test
    @DisplayName("Scenario 2: Q3 Campaign Deck is recognized as resolved and delivered on Thu 8 AM")
    void testScenario2CampaignDeck() {
        AiQueryResponse resp = aiService.query(new AiQueryRequest("What changed regarding the campaign deck?", "2026-09-24"));
        assertNotNull(resp);
        assertTrue(resp.getAnswer().toLowerCase().contains("8:00 am") || resp.getAnswer().toLowerCase().contains("delivered"));
        assertFalse(resp.getSources().isEmpty());

        Commitment deck = commitmentRepo.findAll().stream()
                .filter(c -> c.getTitle().toLowerCase().contains("campaign deck"))
                .findFirst()
                .orElseThrow();
        assertEquals("RESOLVED", deck.getStatus());
    }

    @Test
    @DisplayName("Scenario 3: Meridian Logistics call is confirmed for Wed 3 PM")
    void testScenario3MeridianLogistics() {
        AiQueryResponse resp = aiService.query(new AiQueryRequest("Show me everything related to Meridian Logistics", "2026-09-23"));
        assertNotNull(resp);
        assertTrue(resp.getAnswer().toLowerCase().contains("3:00 pm") || resp.getAnswer().toLowerCase().contains("confirmed"));
        assertFalse(resp.getSources().isEmpty());

        Commitment meridian = commitmentRepo.findAll().stream()
                .filter(c -> c.getTitle().toLowerCase().contains("meridian"))
                .findFirst()
                .orElseThrow();
        assertEquals("RESOLVED", meridian.getStatus());
    }

    @Test
    @DisplayName("Scenario 4: Expense Variance Report delivered by Divya, review pending before Board Prep")
    void testScenario4ExpenseReport() {
        AiQueryResponse resp = aiService.query(new AiQueryRequest("What do I need to prepare before board prep?", "2026-09-24"));
        assertNotNull(resp);
        assertTrue(resp.getAnswer().toLowerCase().contains("variance") || resp.getAnswer().toLowerCase().contains("expense"));
        assertFalse(resp.getSources().isEmpty());
    }

    @Test
    @DisplayName("Scenario 5: Mumbai Lease Renewal is unassigned critical risk due Friday EOD")
    void testScenario5MumbaiLease() {
        AiQueryResponse resp = aiService.query(new AiQueryRequest("Why is the Mumbai lease renewal considered critical?", "2026-09-25"));
        assertNotNull(resp);
        assertTrue(resp.getAnswer().toLowerCase().contains("unowned") || resp.getAnswer().toLowerCase().contains("unassigned"));
        assertTrue(resp.getAnswer().toLowerCase().contains("friday"));
        assertFalse(resp.getSources().isEmpty());

        Commitment lease = commitmentRepo.findAll().stream()
                .filter(c -> c.getTitle().toLowerCase().contains("mumbai"))
                .findFirst()
                .orElseThrow();
        assertEquals("AT_RISK", lease.getStatus());
        assertEquals("CRITICAL", lease.getPriority());
        assertNull(lease.getOwner(), "Owner should be unassigned");
    }

    @Test
    @DisplayName("Executive Attention query returns synthesized attention items with source citations")
    void testAttentionQuery() {
        AiQueryResponse resp = aiService.query(new AiQueryRequest("What needs my attention today?", "2026-09-21"));
        assertNotNull(resp);
        assertTrue(resp.isGrounded());
        assertTrue(resp.getAnswer().contains("Vendor List"));
        assertTrue(resp.getAnswer().contains("Mumbai"));
        assertFalse(resp.getSources().isEmpty());
    }
}
