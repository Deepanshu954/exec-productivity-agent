package com.veridian.execagent.service.ai;

public class AiEntityRef {
    private Long id;
    private String title;
    private String status;
    private String owner;

    public AiEntityRef() {}

    public AiEntityRef(Long id, String title, String status, String owner) {
        this.id = id;
        this.title = title;
        this.status = status;
        this.owner = owner;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getOwner() { return owner; }
    public void setOwner(String owner) { this.owner = owner; }
}
