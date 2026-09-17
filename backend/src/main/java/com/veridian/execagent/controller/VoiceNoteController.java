package com.veridian.execagent.controller;

import com.veridian.execagent.model.Meeting;
import com.veridian.execagent.model.VoiceNote;
import com.veridian.execagent.repository.MeetingRepository;
import com.veridian.execagent.repository.VoiceNoteRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/voicenotes")
public class VoiceNoteController {

    private final VoiceNoteRepository voiceNoteRepo;
    private final MeetingRepository meetingRepo;

    public VoiceNoteController(VoiceNoteRepository voiceNoteRepo, MeetingRepository meetingRepo) {
        this.voiceNoteRepo = voiceNoteRepo;
        this.meetingRepo = meetingRepo;
    }

    @GetMapping
    public ResponseEntity<List<VoiceNote>> getVoiceNotes() {
        return ResponseEntity.ok(voiceNoteRepo.findAllByOrderByNoteNumberAsc());
    }

    @GetMapping("/transcript")
    public ResponseEntity<List<Meeting>> getMeetings() {
        return ResponseEntity.ok(meetingRepo.findAll());
    }
}
