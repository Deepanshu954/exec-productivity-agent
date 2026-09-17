package com.veridian.execagent.model;

import jakarta.persistence.*;

@Entity
@Table(name = "commitments")
public class Commitment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "owner_id")
    private Person owner;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "counterparty_id")
    private Person counterparty;

    @Column(nullable = false)
    private String status; // OPEN, OVERDUE, AT_RISK, COMPLETED, RESOLVED

    @Column(nullable = false)
    private String priority; // CRITICAL, HIGH, MEDIUM, LOW

    private String category; // Operations, Marketing, Finance, Client, Facilities

    private String originalDeadline;

    private String currentDeadline;

    private int delayCount;

    @Column(length = 2000)
    private String whyItMatters;

    @Column(length = 2000)
    private String sourceDocument;

    @Column(length = 2000)
    private String sourceQuote;

    @Column(length = 2000)
    private String resolutionNotes;

    public Commitment() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Person getOwner() { return owner; }
    public void setOwner(Person owner) { this.owner = owner; }

    public Person getCounterparty() { return counterparty; }
    public void setCounterparty(Person counterparty) { this.counterparty = counterparty; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getOriginalDeadline() { return originalDeadline; }
    public void setOriginalDeadline(String originalDeadline) { this.originalDeadline = originalDeadline; }

    public String getCurrentDeadline() { return currentDeadline; }
    public void setCurrentDeadline(String currentDeadline) { this.currentDeadline = currentDeadline; }

    public int getDelayCount() { return delayCount; }
    public void setDelayCount(int delayCount) { this.delayCount = delayCount; }

    public String getWhyItMatters() { return whyItMatters; }
    public void setWhyItMatters(String whyItMatters) { this.whyItMatters = whyItMatters; }

    public String getSourceDocument() { return sourceDocument; }
    public void setSourceDocument(String sourceDocument) { this.sourceDocument = sourceDocument; }

    public String getSourceQuote() { return sourceQuote; }
    public void setSourceQuote(String sourceQuote) { this.sourceQuote = sourceQuote; }

    public String getResolutionNotes() { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }
}
