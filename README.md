# Executive Productivity Agent

An AI-powered executive productivity agent built for **Arjun Malhotra (VP Sales)** at Veridian Corp. This application processes meeting transcripts, calendars, email threads, and voice notes to provide intelligent briefings, action item tracking, conflict detection, and more.

## 🚀 Live Demo

[**Open the deployed application →**](https://exec-agent-rho.vercel.app)

## 📋 Features

| Feature | Description |
|---------|-------------|
| **Daily Briefing** | Day-by-day executive briefing with agenda, key insights, pending actions, and email updates |
| **Action Items** | Extracted from meetings, emails, and voice notes — with owner, deadline, status, and source tracking |
| **Calendar View** | Week-at-a-glance for all 4 team members with color-coded events and conflict highlighting |
| **Email Intelligence** | Thread-by-thread summaries — latest status, who's waiting on whom, full email trail, and timeline |
| **Alerts & Risks** | Calendar overlaps, deadline risks, unowned tasks, and missed commitments with recommendations |
| **Voice Notes** | Arjun's personal voice memos with extracted commitments and concerns |
| **Smart Scheduler** | Find common free meeting slots across multiple people's calendars |
| **Search** | Full-text search across all data sources — meetings, emails, voice notes, calendar, and action items |

## 🧠 Intelligence Engine

The application includes a structured intelligence engine that:

- **Extracts action items** from meeting transcripts, email threads, and voice notes
- **Cross-references** information across sources (e.g., Neha's deck timeline in meeting → email → calendar)
- **Detects conflicts** — calendar overlaps, unowned deadlines, repeated delays
- **Tracks status** — distinguishing between commitments by Arjun vs. by others, pending vs. completed, owned vs. unowned
- **Generates daily briefings** — context-aware insights for each day of the week

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | React + TypeScript |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS v4 |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Deployment** | Vercel |

### Architecture Decision: Why No Backend?

The assignment data is **static and known at build time** (25 emails, 4 calendars, 1 meeting transcript, 2 voice notes). Adding a Spring Boot backend + PostgreSQL database for this fixed dataset would be unnecessary complexity without clear benefit. The intelligence engine runs entirely client-side with a well-structured separation between data, engine, and UI layers.

If this were a **production system with dynamic data**, the architecture would include:
- Spring Boot REST APIs for data ingestion
- PostgreSQL for persistent storage
- Redis for session/cache management
- WebSocket for real-time updates

## 📁 Project Structure

```
src/
├── data/           # Structured assignment data
│   ├── people.ts       # People & email addresses
│   ├── calendar.ts     # Calendar events (4 people)
│   ├── emails.ts       # Email threads (5 threads, 25 emails)
│   ├── meetings.ts     # Meeting transcript
│   └── voiceNotes.ts   # Voice note transcripts
├── engine/         # Intelligence logic
│   ├── actionItems.ts  # Action item extraction
│   ├── briefing.ts     # Daily briefing generator
│   ├── conflicts.ts    # Conflict detection
│   ├── emailSummary.ts # Thread summarization
│   ├── scheduler.ts    # Free slot finder
│   └── search.ts       # Cross-source search
├── components/     # React UI components
│   ├── Dashboard.tsx       # Daily briefing view
│   ├── ActionItems.tsx     # Action item board
│   ├── CalendarView.tsx    # Weekly calendar
│   ├── EmailThreads.tsx    # Email intelligence
│   ├── ConflictAlerts.tsx  # Alerts & risks
│   ├── VoiceNotes.tsx      # Voice notes display
│   ├── SchedulerView.tsx   # Smart scheduler
│   ├── SearchView.tsx      # Search
│   └── Sidebar.tsx         # Navigation
├── App.tsx         # Main app shell
├── main.tsx        # Entry point
└── index.css       # Global styles
```

## 🏃 Local Development

```bash
# Clone the repository
git clone https://github.com/Deepanshu954/exec-productivity-agent.git
cd exec-productivity-agent

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## 📊 Key Assignment Scenarios

The agent correctly handles all assignment-provided scenarios:

1. **Vendor List (Raghav → Arjun)**: Tracked as "at-risk" — Arjun promised Mon EOD, delayed to Tue, then Wed. Three follow-ups by Raghav.
2. **Q3 Campaign Deck (Neha → Arjun)**: Originally Wed review, shifted to Thu 9:30 AM. Deck delivered Thu 8:00 AM. Status: resolved.
3. **Meridian Logistics Call**: Rescheduled to Wed 3 PM. Both parties confirmed. Status: resolved.
4. **Expense Variance Report (Divya → Arjun)**: Deadline moved to Wed evening (from Thu). Delivered on time at 6 PM. Status: resolved.
5. **Mumbai Office Lease Renewal**: CRITICAL — Friday EOD deadline, no owner assigned despite 2 Facilities reminders and Raghav escalation.

## 👤 Author

**Deepanshu Chauhan**  
B.Tech CSE, Bennett University (CGPA: 8.33)  
[GitHub](https://github.com/Deepanshu954) | [LinkedIn](https://linkedin.com/in/deepanshu954) | [LeetCode](https://leetcode.com/u/Deepanshu954)
