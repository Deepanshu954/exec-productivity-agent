package com.veridian.execagent.service.ai;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.*;

@Service
public class GroundedLlmAiService implements AiService {

    private static final Logger log = LoggerFactory.getLogger(GroundedLlmAiService.class);

    private final AiGroundingContextBuilder contextBuilder;
    private final GroundedFallbackAiService fallbackService;
    private final RestClient restClient;

    @Value("${ai.api.key:}")
    private String apiKey;

    @Value("${ai.api.provider:auto}")
    private String provider;

    @Value("${ai.model:gemini-2.0-flash}")
    private String modelName;

    public GroundedLlmAiService(AiGroundingContextBuilder contextBuilder,
                                GroundedFallbackAiService fallbackService) {
        this.contextBuilder = contextBuilder;
        this.fallbackService = fallbackService;
        this.restClient = RestClient.builder().build();
    }

    @Override
    public AiQueryResponse query(AiQueryRequest request) {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            log.info("No external AI_API_KEY environment variable provided. Answering via Grounded Truth Engine.");
            AiQueryResponse resp = fallbackService.answer(request);
            resp.setProvider("Grounded Executive Reasoner (Veridian Knowledge Base)");
            return resp;
        }

        String systemPrompt = contextBuilder.buildGroundingSystemPrompt();

        try {
            boolean isGemini = apiKey.startsWith("AIza") || apiKey.startsWith("AQ.") || "gemini".equalsIgnoreCase(provider);
            if (isGemini) {
                return callGemini(request, systemPrompt, apiKey.trim(), modelName);
            } else {
                return callOpenAi(request, systemPrompt, apiKey.trim());
            }
        } catch (Exception e) {
            log.warn("External AI call failed ({}), falling back to Grounded Truth Engine", e.getMessage());
            AiQueryResponse resp = fallbackService.answer(request);
            resp.setProvider("Grounded Executive Reasoner (Fallback)");
            return resp;
        }
    }

    private AiQueryResponse callGemini(AiQueryRequest request, String systemPrompt, String key, String model) {
        String url = "https://generativelanguage.googleapis.com/v1beta/models/" + model + ":generateContent?key=" + key;

        Map<String, Object> body = Map.of(
            "system_instruction", Map.of(
                "parts", List.of(Map.of("text", systemPrompt))
            ),
            "contents", List.of(
                Map.of("role", "user", "parts", List.of(Map.of("text", request.getQuery())))
            ),
            "generationConfig", Map.of(
                "temperature", 0.2,
                "maxOutputTokens", 1200
            )
        );

        @SuppressWarnings("unchecked")
        Map<String, Object> response = restClient.post()
                .uri(url)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(Map.class);

        String answerText = extractGeminiText(response);
        if (answerText == null || answerText.isBlank()) {
            throw new RuntimeException("Empty response from Gemini");
        }

        AiQueryResponse baseline = fallbackService.answer(request);

        return new AiQueryResponse(
                request.getQuery(),
                answerText,
                baseline.getSources(),
                baseline.getEntities(),
                "Google Gemini (" + model + ")",
                true,
                0.99
        );
    }

    private AiQueryResponse callOpenAi(AiQueryRequest request, String systemPrompt, String key) {
        String url = "https://api.openai.com/v1/chat/completions";

        Map<String, Object> body = Map.of(
            "model", "gpt-4o-mini",
            "messages", List.of(
                Map.of("role", "system", "content", systemPrompt),
                Map.of("role", "user", "content", request.getQuery())
            ),
            "temperature", 0.2
        );

        @SuppressWarnings("unchecked")
        Map<String, Object> response = restClient.post()
                .uri(url)
                .header(HttpHeaders.AUTHORIZATION, "Bearer " + key)
                .contentType(MediaType.APPLICATION_JSON)
                .body(body)
                .retrieve()
                .body(Map.class);

        String answerText = extractOpenAiText(response);
        AiQueryResponse baseline = fallbackService.answer(request);

        return new AiQueryResponse(
                request.getQuery(),
                answerText,
                baseline.getSources(),
                baseline.getEntities(),
                "OpenAI (gpt-4o-mini)",
                true,
                0.99
        );
    }

    @SuppressWarnings("unchecked")
    private String extractGeminiText(Map<String, Object> resp) {
        if (resp == null) return null;
        List<Map<String, Object>> candidates = (List<Map<String, Object>>) resp.get("candidates");
        if (candidates != null && !candidates.isEmpty()) {
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            if (content != null) {
                List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                if (parts != null && !parts.isEmpty()) {
                    return (String) parts.get(0).get("text");
                }
            }
        }
        return null;
    }

    @SuppressWarnings("unchecked")
    private String extractOpenAiText(Map<String, Object> resp) {
        if (resp == null) return null;
        List<Map<String, Object>> choices = (List<Map<String, Object>>) resp.get("choices");
        if (choices != null && !choices.isEmpty()) {
            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            if (message != null) {
                return (String) message.get("content");
            }
        }
        return null;
    }
}
