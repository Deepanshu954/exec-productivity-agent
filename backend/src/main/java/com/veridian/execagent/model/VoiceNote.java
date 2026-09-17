package com.veridian.execagent.model;

import jakarta.persistence.*;

@Entity
@Table(name = "voice_notes")
public class VoiceNote {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int noteNumber;

    @Column(nullable = false)
    private String timestamp;

    private String context; // e.g. "recorded in cab"

    @Column(length = 4000, nullable = false)
    private String transcript;

    @Column(length = 2000)
    private String extractedCommitments;

    public VoiceNote() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public int getNoteNumber() { return noteNumber; }
    public void setNoteNumber(int noteNumber) { this.noteNumber = noteNumber; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public String getContext() { return context; }
    public void setContext(String context) { this.context = context; }

    public String getTranscript() { return transcript; }
    public void setTranscript(String transcript) { this.transcript = transcript; }

    public String getExtractedCommitments() { return extractedCommitments; }
    public void setExtractedCommitments(String extractedCommitments) { this.extractedCommitments = extractedCommitments; }
}
