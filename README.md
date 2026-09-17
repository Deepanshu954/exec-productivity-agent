# AI-Powered Executive Productivity Agent — Veridian Corp

[![Java](https://img.shields.io/badge/Java-21%2B-orange.svg)](https://openjdk.org/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.3.4-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.3-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)

A production-grade, AI-powered Executive Productivity Agent built for **Arjun Malhotra (VP Sales)** at Veridian Corp.

Unlike static dashboards or rule-based viewers, this system operates as a **grounded AI executive agent** combining a **Java Spring Boot 3 REST API backend**, **PostgreSQL relational persistence**, and a **React + TypeScript executive cockpit**. It provides natural-language conversational reasoning strictly grounded in the week's meetings, emails, voice notes, and team calendars (Monday 21 September – Friday 25 September 2026), citing exact source evidence for every insight.

---

## 🚀 Live Production & Repository

- **Deployed Live Application**: [https://exec-agent-rho.vercel.app](https://exec-agent-rho.vercel.app)
- **GitHub Repository**: [https://github.com/Deepanshu954/exec-productivity-agent](https://github.com/Deepanshu954/exec-productivity-agent)

---

## 🏛️ System Architecture

```
                                      +---------------------------------------------+
                                      |         React + TypeScript Frontend         |
                                      |     (Executive Cockpit & Chat Drawer)       |
                                      +---------------------------------------------+
                                                             |
                                                       REST / JSON
                                                             v
+-----------------------------------------------------------------------------------------------------------------------+
|                                           Spring Boot 3.3 REST Backend                                                |
|                                                                                                                       |
|  [REST Controllers]                                                                                                   |
|    • /api/ai/query         • /api/briefing         • /api/commitments         • /api/calendar       • /api/emails     |
|                                                                                                                       |
|  [Domain Services]                                                                                                    |
|    • BriefingService       • CommitmentService     • CalendarService          • EmailService                          |
|                                                                                                                       |
|  [AI Reasoning Layer]                                                                                                 |
|    • AiGroundingContextBuilder (Structured prompt injection from DB)                                                   |
|    • GroundedLlmAiService      (OpenAI / Gemini LLM API client)                                                       |
|    • GroundedFallbackAiService (Local deterministic semantic engine - 0 hallucinations)                               |
+-----------------------------------------------------------------------------------------------------------------------+
                                                             |
                                                       Spring Data JPA
                                                             v
                                      +---------------------------------------------+
                                      |        PostgreSQL / In-Memory H2 DB         |
                                      |  (People, Commitments, Events, Threads,     |
                                      |   Messages, Meetings, VoiceNotes)           |
                                      +---------------------------------------------+
```

---

## 🧠 Grounded AI Executive Assistant

The AI Assistant is accessible directly on the main Executive Briefing screen and via a dedicated command center.

### Natural-Language Executive Queries Supported:
- *"What needs my attention today?"*
- *"What commitments of mine are still pending?"*
- *"What am I late on?"*
- *"What is the most urgent unresolved issue?"*
- *"Why is the Mumbai lease renewal considered critical?"*
- *"What did I promise Raghav?"*
- *"What changed regarding the campaign deck?"*
- *"Summarize the important updates from my emails."*
- *"What do I need to prepare before board prep?"*
- *"Show me everything related to Meridian Logistics."*
- *"What meetings do I have today?"*
- *"Who is waiting on me?"*
- *"Which commitments were completed?"*

### Trust & Grounding Guarantee:
1. **Strict Source Attribution**: Every response cites supporting documents (`[Leadership Sync]`, `[Email Thread: Vendor List]`, `[Voice Note 1]`, `[Calendar]`) with exact timestamps and quotes.
2. **Commitment Ownership Distinction**: Clearly separates Arjun's commitments from team deliverables (Neha, Divya, Priya, Facilities).
3. **Status Reconciled Across Sources**: Accurately tracks changed deadlines and completed deliverables without false alarms.
4. **Server-Side Security**: External AI API keys (OpenAI / Gemini) remain in server-side environment variables (`AI_API_KEY`) and are **never exposed to the client bundle**.

---

## 🎯 Critical Assignment Scenarios (Reconciled & Tested)

| Scenario | Ground Truth Evolution | Grounded System Outcome |
| :--- | :--- | :--- |
| **1. Vendor List** | Promised to Raghav by Tue EOD (Mon sync). Slipped to Tue morning (Mon email), then Wed morning (Tue email). Raghav checked in 3 times (Mon 9:50 AM, Tue 9:15 AM, Wed 8:45 AM). Arjun noted delay in Voice Note 1. | **Status: OVERDUE / AT-RISK**. Owner: Arjun. Counterparty: Raghav. Highlighted with 3 delay milestones; Raghav waiting. |
| **2. Q3 Campaign Deck** | Originally Wed, moved to Thu 9:30 AM (before board prep). Neha delivered finished draft **Thu 8:00 AM** ahead of review. | **Status: RESOLVED / DELIVERED**. Not overdue. AI notes double-booking on Thu 9:30 AM and suggests asynchronous review. |
| **3. Meridian Logistics** | Call bumped by client (Mon). Arjun proposed Wed 3:00 PM; Priya confirmed Tue 5:45 PM. Reconfirmed Wed 1:30 PM & 2:00 PM. | **Status: RESOLVED / CONFIRMED**. On calendar for Wed 23 Sep 3:00–3:30 PM. Not pending. |
| **4. Expense Variance Report** | Arjun requested July variance before Thu board prep. Divya delivered **Wed 6:00 PM** as promised. Arjun acknowledged at 6:10 PM. | **Status: COMPLETED (Divya) / PENDING REVIEW (Arjun)**. Delivery complete; Arjun must review before Thu 9:00 AM board prep. |
| **5. Mumbai Lease Renewal** | Sign-off required by **Friday 25 Sep EOD**. Ownership unassigned in sync (*"flag it, don't assume"*). Raghav escalated Tue 11 AM and Thu 4:45 PM. Voice Note 1: *"someone needs to own that, I don't think it's me."* | **Status: UNASSIGNED / CRITICAL RISK**. #1 organizational risk. Primed for resolution during Friday 10:00 AM Facilities Check-in. |

---

## 🛠️ Technology Stack & Interview Defensibility

| Layer | Technology | Engineering Rationale |
| :--- | :--- | :--- |
| **Backend** | **Java 21 / Spring Boot 3.3** | Enterprise-grade standard for high-throughput microservices, OOP domain modeling, and REST APIs. |
| **Persistence** | **PostgreSQL & Spring Data JPA** | Relational integrity with Foreign Keys connecting People, Commitments, Calendar Events, Email Threads, and Transcripts. H2 PostgreSQL mode for zero-config local dev. |
| **AI Integration** | **Spring RestClient + Grounded Prompt Context** | Clean `AiService` interface supporting live LLM inference (Gemini / OpenAI) with automatic fallback to a local deterministic engine with 0 hallucinations. |
| **Frontend** | **React 18, TypeScript, Tailwind CSS v4, Framer Motion** | Type-safe, component-driven UI with smooth micro-animations, no layout clipping, and clean responsive flex/grid layouts. |
| **Containers** | **Docker & Docker Compose** | Reproducible multi-container runtime orchestrating PostgreSQL and the Spring Boot fat JAR. |

---

## 🚀 Running Locally

### Option 1: One-Command Spring Boot Run (Frontend Pre-Bundled)

The Spring Boot application serves both the backend REST APIs and the production-optimized React SPA at `http://localhost:8080`:

```bash
cd exec-agent/backend
mvn clean compile test package -DskipTests=true
java -jar target/exec-agent-backend-1.0.0.jar
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

### Option 2: Docker Compose (PostgreSQL + Spring Boot)

```bash
cd exec-agent
docker compose up --build
```

### Option 3: Full Development Mode (Hot Reload)

1. **Start Backend**:
   ```bash
   cd exec-agent/backend
   mvn spring-boot:run
   ```
2. **Start Frontend Dev Server**:
   ```bash
   cd exec-agent
   npm install
   npm run dev
   ```
   Open [http://localhost:5173](http://localhost:5173). Requests to `/api/**` automatically proxy to `http://localhost:8080`.

---

## 🧪 Automated Testing

Run the Spring Boot integration test suite:

```bash
cd exec-agent/backend
mvn clean test
```

Verifies:
- Complete database seeding (6 people, 6 commitments, 25 calendar events, 5 email threads, 2 voice notes, 1 meeting transcript).
- Scenario 1 (Vendor List identified as overdue with 3 delays).
- Scenario 2 (Q3 Campaign Deck recognized as delivered Thu 8 AM).
- Scenario 3 (Meridian Logistics call verified as confirmed for Wed 3 PM).
- Scenario 4 (Expense report delivery completed, Arjun review pending).
- Scenario 5 (Mumbai Lease recognized as unassigned critical risk due Friday EOD).
- Natural-language query response accuracy and source citations.

---

## 🛡️ Security & Environmental Discipline

- **No Public API Keys**: Never embed keys in frontend bundles or `VITE_*` public variables.
- **Server-Side Isolation**: AI credentials reside solely in server environment variables (`AI_API_KEY`).
- **Input Sanitization**: Query endpoints validate parameters and protect against injection.
