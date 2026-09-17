package com.veridian.execagent.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "email_messages")
public class EmailMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "thread_id", nullable = false)
    @JsonBackReference
    private EmailThread thread;

    private int sequenceNumber;

    @Column(nullable = false)
    private String timestamp;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sender_id")
    private Person sender;

    private String senderRaw;

    @Column(nullable = false)
    private String recipient;

    @Column(length = 4000, nullable = false)
    private String body;

    public EmailMessage() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public EmailThread getThread() { return thread; }
    public void setThread(EmailThread thread) { this.thread = thread; }

    public int getSequenceNumber() { return sequenceNumber; }
    public void setSequenceNumber(int sequenceNumber) { this.sequenceNumber = sequenceNumber; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }

    public Person getSender() { return sender; }
    public void setSender(Person sender) { this.sender = sender; }

    public String getSenderRaw() { return senderRaw; }
    public void setSenderRaw(String senderRaw) { this.senderRaw = senderRaw; }

    public String getRecipient() { return recipient; }
    public void setRecipient(String recipient) { this.recipient = recipient; }

    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }
}
