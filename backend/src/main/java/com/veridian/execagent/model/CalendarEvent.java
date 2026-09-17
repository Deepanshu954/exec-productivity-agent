package com.veridian.execagent.model;

import jakarta.persistence.*;

@Entity
@Table(name = "calendar_events")
public class CalendarEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "person_id")
    private Person person;

    @Column(nullable = false)
    private String dayDate; // Mon 21 Sep

    @Column(nullable = false)
    private String isoDate; // 2026-09-21

    @Column(nullable = false)
    private String startTime; // 09:00

    @Column(nullable = false)
    private String endTime; // 09:35

    @Column(nullable = false)
    private String timeRange; // 9:00–9:35 AM

    @Column(nullable = false)
    private String title;

    private boolean isBlocked;

    private boolean hasConflict;

    @Column(length = 1000)
    private String conflictNotes;

    public CalendarEvent() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Person getPerson() { return person; }
    public void setPerson(Person person) { this.person = person; }

    public String getDayDate() { return dayDate; }
    public void setDayDate(String dayDate) { this.dayDate = dayDate; }

    public String getIsoDate() { return isoDate; }
    public void setIsoDate(String isoDate) { this.isoDate = isoDate; }

    public String getStartTime() { return startTime; }
    public void setStartTime(String startTime) { this.startTime = startTime; }

    public String getEndTime() { return endTime; }
    public void setEndTime(String endTime) { this.endTime = endTime; }

    public String getTimeRange() { return timeRange; }
    public void setTimeRange(String timeRange) { this.timeRange = timeRange; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public boolean isBlocked() { return isBlocked; }
    public void setBlocked(boolean blocked) { isBlocked = blocked; }

    public boolean isHasConflict() { return hasConflict; }
    public void setHasConflict(boolean hasConflict) { this.hasConflict = hasConflict; }

    public String getConflictNotes() { return conflictNotes; }
    public void setConflictNotes(String conflictNotes) { this.conflictNotes = conflictNotes; }
}
