package com.veridian.execagent.service.ai;

public class AiQueryRequest {
    private String query;
    private String day; // optional ISO date, e.g. "2026-09-23"

    public AiQueryRequest() {}

    public AiQueryRequest(String query, String day) {
        this.query = query;
        this.day = day;
    }

    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }

    public String getDay() { return day; }
    public void setDay(String day) { this.day = day; }
}
