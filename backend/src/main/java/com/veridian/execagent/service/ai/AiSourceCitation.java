package com.veridian.execagent.service.ai;

public class AiSourceCitation {
    private String title;
    private String excerpt;
    private String documentType; // MEETING, EMAIL, VOICE_NOTE, CALENDAR
    private String timestamp;

    public AiSourceCitation() {}

    public AiSourceCitation(String title, String excerpt, String documentType, String timestamp) {
        this.title = title;
        this.excerpt = excerpt;
        this.documentType = documentType;
        this.timestamp = timestamp;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getExcerpt() { return excerpt; }
    public void setExcerpt(String excerpt) { this.excerpt = excerpt; }

    public String getDocumentType() { return documentType; }
    public void setDocumentType(String documentType) { this.documentType = documentType; }

    public String getTimestamp() { return timestamp; }
    public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
}
