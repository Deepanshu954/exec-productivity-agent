package com.veridian.execagent.service.ai;

import java.util.ArrayList;
import java.util.List;

public class AiQueryResponse {
    private String query;
    private String answer;
    private List<AiSourceCitation> sources = new ArrayList<>();
    private List<AiEntityRef> entities = new ArrayList<>();
    private String provider;
    private boolean grounded;
    private double confidence;

    public AiQueryResponse() {}

    public AiQueryResponse(String query, String answer, List<AiSourceCitation> sources,
                           List<AiEntityRef> entities, String provider, boolean grounded, double confidence) {
        this.query = query;
        this.answer = answer;
        this.sources = sources;
        this.entities = entities;
        this.provider = provider;
        this.grounded = grounded;
        this.confidence = confidence;
    }

    public String getQuery() { return query; }
    public void setQuery(String query) { this.query = query; }

    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }

    public List<AiSourceCitation> getSources() { return sources; }
    public void setSources(List<AiSourceCitation> sources) { this.sources = sources; }

    public List<AiEntityRef> getEntities() { return entities; }
    public void setEntities(List<AiEntityRef> entities) { this.entities = entities; }

    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }

    public boolean isGrounded() { return grounded; }
    public void setGrounded(boolean grounded) { this.grounded = grounded; }

    public double getConfidence() { return confidence; }
    public void setConfidence(double confidence) { this.confidence = confidence; }
}
