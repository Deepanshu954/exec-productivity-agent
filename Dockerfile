# Multi-stage Dockerfile for Executive Productivity Agent
# Builds Maven Spring Boot backend and bundles React frontend

# Stage 1: Runtime
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY backend/target/exec-agent-backend-1.0.0.jar app.jar

ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
