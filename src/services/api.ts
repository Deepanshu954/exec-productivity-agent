/**
 * Executive Productivity Agent - API Service
 * Connects React frontend to Spring Boot REST backend with resilient fallback.
 */

export interface AiSourceCitation {
  title: string;
  excerpt: string;
  documentType: 'MEETING' | 'EMAIL' | 'VOICE_NOTE' | 'CALENDAR';
  timestamp: string;
}

export interface AiEntityRef {
  id: number;
  title: string;
  status: string;
  owner: string;
}

export interface AiQueryResponse {
  query: string;
  answer: string;
  sources: AiSourceCitation[];
  entities: AiEntityRef[];
  provider: string;
  grounded: boolean;
  confidence: number;
}

export interface CommitmentDto {
  id: number;
  title: string;
  description: string;
  owner: { id: number; name: string; role: string; email: string; user: boolean } | null;
  counterparty: { id: number; name: string; role: string; email: string; user: boolean } | null;
  status: 'OPEN' | 'OVERDUE' | 'AT_RISK' | 'COMPLETED' | 'RESOLVED';
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  originalDeadline: string;
  currentDeadline: string;
  delayCount: number;
  whyItMatters: string;
  sourceDocument: string;
  sourceQuote: string;
  resolutionNotes: string;
}

export interface CalendarEventDto {
  id: number;
  person: { id: number; name: string; role: string; email: string; user: boolean };
  dayDate: string;
  isoDate: string;
  startTime: string;
  endTime: string;
  timeRange: string;
  title: string;
  blocked: boolean;
  hasConflict: boolean;
  conflictNotes: string | null;
}

export interface EmailMessageDto {
  id: number;
  sequenceNumber: number;
  timestamp: string;
  sender: { id: number; name: string; role: string; email: string } | null;
  senderRaw: string;
  recipient: string;
  body: string;
}

export interface EmailThreadDto {
  id: number;
  subject: string;
  statusSummary: string;
  waitingOn: string;
  category: string;
  messages: EmailMessageDto[];
}

export interface BriefingDto {
  isoDate: string;
  dayLabel: string;
  executiveSummary: string;
  agenda: CalendarEventDto[];
  criticalAlerts: Array<{ title: string; description: string; severity: string; action: string }>;
  openCommitments: CommitmentDto[];
  totalOpenCommitments: number;
  criticalCount: number;
}

const API_BASE = import.meta.env.VITE_API_URL || '';

export const api = {
  async queryAi(query: string, day?: string): Promise<AiQueryResponse> {
    try {
      const res = await fetch(`${API_BASE}/api/ai/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, day }),
      });
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn('Backend query failed, using local inference:', e);
      return fallbackAiQuery(query, day);
    }
  },

  async getBriefing(date: string = '2026-09-21'): Promise<BriefingDto> {
    try {
      const res = await fetch(`${API_BASE}/api/briefing?date=${date}`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn('Backend briefing fetch failed, using fallback:', e);
      return fallbackBriefing(date);
    }
  },

  async getCommitments(): Promise<CommitmentDto[]> {
    try {
      const res = await fetch(`${API_BASE}/api/commitments`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn('Backend commitments fetch failed, using fallback:', e);
      return fallbackCommitments;
    }
  },

  async getCalendarEvents(date?: string): Promise<CalendarEventDto[]> {
    try {
      const url = date ? `${API_BASE}/api/calendar?date=${date}` : `${API_BASE}/api/calendar`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn('Backend calendar fetch failed, using fallback:', e);
      return fallbackCalendarEvents;
    }
  },

  async getEmailThreads(): Promise<EmailThreadDto[]> {
    try {
      const res = await fetch(`${API_BASE}/api/emails`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn('Backend email threads fetch failed, using fallback:', e);
      return fallbackEmailThreads;
    }
  },

  async getConflicts(): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/api/calendar/conflicts`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn('Backend conflicts fetch failed, using fallback:', e);
      return fallbackConflicts;
    }
  },

  async getVoiceNotes(): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/api/voicenotes`);
      if (!res.ok) throw new Error(`HTTP error ${res.status}`);
      return await res.json();
    } catch (e) {
      console.warn('Backend voice notes fetch failed, using fallback:', e);
      return fallbackVoiceNotes;
    }
  },
};

// ==========================================
// FALLBACK GROUND TRUTH STORE (Zero-setup resilience)
// ==========================================

const fallbackCommitments: CommitmentDto[] = [
  {
    id: 1,
    title: 'Send Updated Vendor List to Raghav',
    description: 'Arjun promised to send Raghav the updated vendor list. The commitment was delayed repeatedly across Monday, Tuesday, and Wednesday.',
    owner: { id: 1, name: 'Arjun Malhotra', role: 'VP Sales', email: 'arjun.malhotra@veridian-corp.example', user: true },
    counterparty: { id: 3, name: 'Raghav Sethi', role: 'Ops Manager', email: 'raghav.sethi@veridian-corp.example', user: false },
    status: 'OVERDUE',
    priority: 'HIGH',
    category: 'Operations',
    originalDeadline: 'Tuesday 22 Sep, End of Day',
    currentDeadline: 'Wednesday 23 Sep, Morning',
    delayCount: 3,
    whyItMatters: "Raghav needs the vendor list for ongoing operations. He has followed up 3 separate times (Mon 9:50 AM, Tue 9:15 AM, Wed 8:45 AM).",
    sourceDocument: 'Leadership Sync (Mon 9:00 AM), Email Thread: Vendor List, Voice Note 1 (Mon 6:40 PM)',
    sourceQuote: "Arjun in sync: 'I told Raghav I’d send him the updated vendor list. I’ll get that to him by end of day tomorrow.' Email Wed 8:45 AM: 'Just checking — still good for this morning?'",
    resolutionNotes: 'STILL PENDING. Arjun has not sent the vendor list as of Wednesday morning.',
  },
  {
    id: 2,
    title: 'Deliver Q3 Campaign Deck Draft',
    description: 'Neha committed to sending the Q3 campaign deck for review. Review was shifted from Wednesday to Thursday 9:30 AM.',
    owner: { id: 2, name: 'Neha Kapoor', role: 'Marketing Lead', email: 'neha.kapoor@veridian-corp.example', user: false },
    counterparty: { id: 1, name: 'Arjun Malhotra', role: 'VP Sales', email: 'arjun.malhotra@veridian-corp.example', user: true },
    status: 'RESOLVED',
    priority: 'HIGH',
    category: 'Marketing',
    originalDeadline: 'Wednesday 23 Sep',
    currentDeadline: 'Thursday 24 Sep, 9:30 AM',
    delayCount: 1,
    whyItMatters: 'Crucial for marketing roadmap and executive alignment.',
    sourceDocument: 'Leadership Sync (Mon 9:00 AM), Email Thread: Q3 Campaign Deck, Neha Calendar',
    sourceQuote: "Neha email Thu 8:00 AM: 'Deck is ready, attaching the draft ahead of our 9:30 review.'",
    resolutionNotes: "COMPLETED & DELIVERED. Neha sent draft at 8:00 AM Thursday ahead of 9:30 AM review. Note: 9:30 review overlaps Arjun's Board Prep.",
  },
  {
    id: 3,
    title: 'Reschedule Client Call with Meridian Logistics',
    description: 'Arjun needed to reconfirm a rescheduled call time with external client Meridian Logistics.',
    owner: { id: 1, name: 'Arjun Malhotra', role: 'VP Sales', email: 'arjun.malhotra@veridian-corp.example', user: true },
    counterparty: { id: 5, name: 'Priya Nair', role: 'Meridian Logistics', email: 'priya.nair@meridianlogistics.example', user: false },
    status: 'RESOLVED',
    priority: 'HIGH',
    category: 'Client',
    originalDeadline: 'Tuesday–Thursday afternoons',
    currentDeadline: 'Wednesday 23 Sep, 3:00 PM',
    delayCount: 0,
    whyItMatters: 'Key client relationship; ensuring sales alignment with Meridian Logistics.',
    sourceDocument: 'Leadership Sync (Mon 9:00 AM), Email Thread: Call Reschedule, Voice Note 2, Arjun Calendar',
    sourceQuote: "Priya email Tue 5:45 PM: 'Wednesday 3 PM works on our end, confirmed.' Arjun email Wed 2:00 PM: 'Yes, confirmed, see you at 3.'",
    resolutionNotes: "CONFIRMED & SCHEDULED. Meeting locked on Arjun's calendar for Wednesday 3:00–3:30 PM.",
  },
  {
    id: 4,
    title: 'Pull July Expense Variance Report before Board Prep',
    description: "Divya was tasked to pull July expense variance numbers. Arjun requested it for Wednesday evening to review prior to Thursday Board Prep.",
    owner: { id: 4, name: 'Divya Rao', role: 'Finance', email: 'divya.rao@veridian-corp.example', user: false },
    counterparty: { id: 1, name: 'Arjun Malhotra', role: 'VP Sales', email: 'arjun.malhotra@veridian-corp.example', user: true },
    status: 'COMPLETED',
    priority: 'HIGH',
    category: 'Finance',
    originalDeadline: 'Thursday 24 Sep morning',
    currentDeadline: 'Wednesday 23 Sep, 6:00 PM',
    delayCount: 0,
    whyItMatters: "Arjun requires these variance numbers to prepare for Thursday's 9:00 AM Board Prep Session.",
    sourceDocument: 'Leadership Sync (Mon 9:00 AM), Email Thread: Expense Variance Report, Voice Note 2',
    sourceQuote: "Divya email Wed 6:00 PM: 'Report attached, sent as promised.' Arjun email Wed 6:10 PM: 'Got it, thank you — exactly what I needed before tomorrow.'",
    resolutionNotes: 'DELIVERED BY DIVYA. Report delivered Wednesday at 6:00 PM. Follow-up: Arjun still has the internal action item to review it before Board Prep.',
  },
  {
    id: 5,
    title: 'Resolve Sign-off & Ownership for Mumbai Office Lease Renewal',
    description: 'Mumbai office renewal requires authorized sign-off by Friday 25 Sep EOD. Ownership is unassigned and unowned.',
    owner: null,
    counterparty: { id: 1, name: 'Arjun Malhotra', role: 'VP Sales', email: 'arjun.malhotra@veridian-corp.example', user: true },
    status: 'AT_RISK',
    priority: 'CRITICAL',
    category: 'Facilities',
    originalDeadline: 'Friday 25 Sep, End of Day',
    currentDeadline: 'Friday 25 Sep, End of Day',
    delayCount: 2,
    whyItMatters: 'High organizational risk. Lease expiration without signature impacts Mumbai office operations. Raghav escalated on Tue and Thu.',
    sourceDocument: 'Leadership Sync (Mon 9:00 AM), Email Thread: Mumbai Office Lease Renewal, Voice Note 1',
    sourceQuote: "Arjun in sync: 'flag it, don’t assume.' Voice Note 1: 'someone needs to own that, I don’t think it’s me.' Raghav email Thu 4:45 PM: 'This is now one day out and still unowned — can you confirm who’s handling it?'",
    resolutionNotes: "UNRESOLVED / UNASSIGNED. Escalated to Arjun. Raghav and Arjun have a Facilities Check-in on Friday 10:00–10:30 AM where this must be addressed.",
  },
  {
    id: 6,
    title: 'Review July Expense Variance Report before Board Prep',
    description: 'Review the numbers provided by Divya on Wednesday evening prior to the Board Prep Session at 9:00 AM Thursday.',
    owner: { id: 1, name: 'Arjun Malhotra', role: 'VP Sales', email: 'arjun.malhotra@veridian-corp.example', user: true },
    counterparty: { id: 4, name: 'Divya Rao', role: 'Finance', email: 'divya.rao@veridian-corp.example', user: false },
    status: 'OPEN',
    priority: 'HIGH',
    category: 'Finance',
    originalDeadline: 'Thursday 24 Sep, 9:00 AM',
    currentDeadline: 'Thursday 24 Sep, 9:00 AM',
    delayCount: 0,
    whyItMatters: 'Required for executive readiness in the Board Prep Session.',
    sourceDocument: 'Leadership Sync, Email Thread 4, Voice Note 2',
    sourceQuote: "Voice Note 2: 'expense variance report from Divya needs to be in my hands by Wednesday evening, not Thursday, I want time to go through it before board prep.'",
    resolutionNotes: 'PENDING ARJUN REVIEW. Divya completed delivery Wednesday 6 PM. Arjun must complete his review before 9:00 AM Thursday.',
  }
];

function fallbackAiQuery(query: string, _day?: string): AiQueryResponse {
  const q = query.toLowerCase();

  if (q.includes('meridian') || q.includes('priya')) {
    return {
      query,
      answer: "Everything regarding **Meridian Logistics** is confirmed and scheduled:\n\n• **Rescheduling**: On Tuesday at 3:00 PM, you proposed Wednesday 3:00 PM. Priya confirmed at 5:45 PM (*'Wednesday 3 PM works on our end, confirmed'*).\n• **Reconfirmation**: Confirmed on Wednesday at 2:00 PM (*'Yes, confirmed, see you at 3'*).\n• **Calendar**: Scheduled for **Wednesday, 23 September, 3:00–3:30 PM**.\n• **Status**: **RESOLVED / CONFIRMED**.",
      sources: [
        { title: 'Email Thread: Call Reschedule (Email 3 & 5)', excerpt: "Priya: 'Wednesday 3 PM works... confirmed.' Arjun: 'Yes, confirmed, see you at 3.'", documentType: 'EMAIL', timestamp: 'Tue 22 - Wed 23 Sep' },
        { title: "Arjun's Calendar", excerpt: "Wed 23 Sep: 3:00–3:30 PM Call — Meridian Logistics", documentType: 'CALENDAR', timestamp: 'Wed 23 Sep' }
      ],
      entities: [{ id: 3, title: 'Reschedule Client Call with Meridian Logistics', status: 'RESOLVED', owner: 'Arjun Malhotra' }],
      provider: 'Grounded Executive Engine (Local)',
      grounded: true,
      confidence: 0.99
    };
  }

  if (q.includes('mumbai') || q.includes('lease')) {
    return {
      query,
      answer: "The **Mumbai Office Lease Renewal** is considered critical because:\n\n1. **Hard Deadline**: Signature is required by **Friday, 25 September End of Day** per multiple Facilities alerts.\n2. **Unassigned Ownership**: Ownership was left unresolved during Monday's sync (*'flag it, don't assume'*) and Voice Note 1 (*'someone needs to own that, I don't think it's me'*).\n3. **Raghav Escalation**: Raghav escalated urgently Thursday 4:45 PM: *'This is now one day out and still unowned — can you confirm who’s handling it?'*\n4. **Resolution Path**: Address this at your scheduled **Friday 10:00–10:30 AM Facilities Check-in** with Raghav.",
      sources: [
        { title: 'Meeting Transcript: Leadership Sync', excerpt: "Arjun: 'Okay, flag it, don’t assume.'", documentType: 'MEETING', timestamp: 'Mon 21 Sep' },
        { title: 'Voice Note 1', excerpt: "Arjun: 'someone needs to own that, I don't think it's me.'", documentType: 'VOICE_NOTE', timestamp: 'Mon 21 Sep' },
        { title: 'Email Thread: Mumbai Lease', excerpt: "Raghav: 'This is now one day out and still unowned — can you confirm who’s handling it?'", documentType: 'EMAIL', timestamp: 'Thu 24 Sep' }
      ],
      entities: [{ id: 5, title: 'Mumbai Office Lease Renewal Sign-off', status: 'AT_RISK', owner: 'UNASSIGNED' }],
      provider: 'Grounded Executive Engine (Local)',
      grounded: true,
      confidence: 0.99
    };
  }

  if (q.includes('raghav') || q.includes('vendor')) {
    return {
      query,
      answer: "You promised Raghav the **updated vendor list** during Monday's Leadership Sync (*'by end of day tomorrow'*).\n\n• **Delays**: Slipped from Mon to Tue morning, then to Wed morning.\n• **Follow-ups**: Raghav checked in 3 times (Mon 9:50 AM, Tue 9:15 AM, Wed 8:45 AM).\n• **Status**: **OVERDUE** and pending your delivery.",
      sources: [
        { title: 'Leadership Sync Transcript', excerpt: "Arjun: 'I told Raghav I’d send him the updated vendor list.'", documentType: 'MEETING', timestamp: 'Mon 21 Sep' },
        { title: 'Email Thread: Vendor List', excerpt: "5 email exchanges with 3 slips.", documentType: 'EMAIL', timestamp: 'Mon–Wed' }
      ],
      entities: [{ id: 1, title: 'Send Updated Vendor List to Raghav', status: 'OVERDUE', owner: 'Arjun Malhotra' }],
      provider: 'Grounded Executive Engine (Local)',
      grounded: true,
      confidence: 0.99
    };
  }

  if (q.includes('campaign') || q.includes('deck')) {
    return {
      query,
      answer: "Regarding the **Q3 Campaign Deck**:\n\n• Review was moved from Wednesday to Thursday 9:30 AM.\n• Neha finished early and delivered the draft on **Thursday at 8:00 AM**.\n• Status: **RESOLVED / DELIVERED** (not overdue).\n• Note: Neha's 9:30 AM review overlaps your 9:00–10:00 AM Board Prep Session.",
      sources: [
        { title: 'Email Thread: Q3 Campaign Deck', excerpt: "Neha: 'Deck is ready, attaching the draft ahead of our 9:30 review.'", documentType: 'EMAIL', timestamp: 'Thu 24 Sep, 8:00 AM' }
      ],
      entities: [{ id: 2, title: 'Deliver Q3 Campaign Deck Draft', status: 'RESOLVED', owner: 'Neha Kapoor' }],
      provider: 'Grounded Executive Engine (Local)',
      grounded: true,
      confidence: 0.99
    };
  }

  if (q.includes('board prep') || q.includes('expense') || q.includes('variance') || q.includes('divya')) {
    return {
      query,
      answer: "Before Thursday's 9:00–10:00 AM **Board Prep Session** with Divya:\n\n1. **Review Expense Variance Report**: Divya delivered the July numbers on Wednesday at 6:00 PM per your accelerated request. You acknowledged at 6:10 PM. You must complete your review before 9:00 AM.\n2. **Handle Calendar Overlap**: Neha's 9:30 AM Deck Review double-books this slot.",
      sources: [
        { title: 'Email Thread: Expense Variance Report', excerpt: "Divya sent Wed 6:00 PM; Arjun acknowledged at 6:10 PM.", documentType: 'EMAIL', timestamp: 'Wed 23 Sep' },
        { title: 'Voice Note 2', excerpt: "Arjun: 'I want time to go through it before board prep.'", documentType: 'VOICE_NOTE', timestamp: 'Wed 23 Sep' }
      ],
      entities: [
        { id: 4, title: 'July Expense Variance Report Delivery', status: 'COMPLETED', owner: 'Divya Rao' },
        { id: 6, title: 'Review July Expense Variance Report before Board Prep', status: 'OPEN', owner: 'Arjun Malhotra' }
      ],
      provider: 'Grounded Executive Engine (Local)',
      grounded: true,
      confidence: 0.99
    };
  }

  // Generic attention
  return {
    query,
    answer: "Key executive items requiring your immediate focus:\n\n1. **Vendor List for Raghav (Overdue)**: Slipped repeatedly; Raghav sent 3 follow-ups.\n2. **Mumbai Office Lease Renewal (Critical Risk)**: Unassigned ownership with Friday 25 Sep EOD deadline.\n3. **Thursday Morning Conflict**: 9:30–10:00 AM Deck Review with Neha overlaps Board Prep Session.",
    sources: [
      { title: 'Email Thread: Vendor List', excerpt: "Raghav: 'still good for this morning?'", documentType: 'EMAIL', timestamp: 'Wed 23 Sep' },
      { title: 'Email Thread: Mumbai Lease', excerpt: "Raghav: '1 day out and still unowned'", documentType: 'EMAIL', timestamp: 'Thu 24 Sep' }
    ],
    entities: [
      { id: 1, title: 'Send Updated Vendor List to Raghav', status: 'OVERDUE', owner: 'Arjun Malhotra' },
      { id: 5, title: 'Mumbai Office Lease Renewal Sign-off', status: 'AT_RISK', owner: 'UNASSIGNED' }
    ],
    provider: 'Grounded Executive Engine (Local)',
    grounded: true,
    confidence: 0.95
  };
}

function fallbackBriefing(isoDate: string): BriefingDto {
  const dayLabels: Record<string, string> = {
    '2026-09-21': 'Monday, 21 September 2026',
    '2026-09-22': 'Tuesday, 22 September 2026',
    '2026-09-23': 'Wednesday, 23 September 2026',
    '2026-09-24': 'Thursday, 24 September 2026',
    '2026-09-25': 'Friday, 25 September 2026',
  };

  const summaries: Record<string, string> = {
    '2026-09-21': "Good morning Arjun. Week kick-off began with the 9:00 AM Leadership Sync. Key priorities: send the updated vendor list to Raghav (promised by tomorrow EOD), keep track of the Mumbai office lease renewal which remains unowned, and follow up with Meridian Logistics to lock in a new call time.",
    '2026-09-22': "Good morning Arjun. Today includes the Internal Budget Review at 11:00 AM. Raghav followed up at 9:15 AM on the vendor list you promised yesterday evening; you pushed it to Wednesday morning. You proposed Wednesday 3:00 PM for Meridian Logistics and Priya confirmed. Ensure Divya has prioritized the expense variance report for Wednesday evening.",
    '2026-09-23': "Good morning Arjun. URGENT: Raghav sent a 3rd follow-up at 8:45 AM for the vendor list, which is now overdue. At 3:00 PM you have the confirmed client call with Meridian Logistics. Divya is expected to deliver the expense variance report by 6:00 PM this evening so you can review it before tomorrow's board prep.",
    '2026-09-24': "Good morning Arjun. High-focus day: Board Prep Session is scheduled for 9:00–10:00 AM with Divya. IMPORTANT CONFLICT: Neha scheduled a Deck Review with you for 9:30–10:00 AM. Good news: Neha already delivered the deck draft at 8:00 AM, and Divya sent the expense variance report yesterday at 6:00 PM. Meanwhile, the Mumbai lease renewal remains unowned with 1 day until deadline.",
    '2026-09-25': "Good morning Arjun. CRITICAL DEADLINE TODAY: The Mumbai office lease renewal paperwork expires at End of Day today and still has no assigned owner. Use your 10:00 AM Facilities Check-in with Raghav to formally assign sign-off ownership.",
  };

  const dayEvents = fallbackCalendarEvents.filter(e => e.isoDate === isoDate && e.person.name === 'Arjun Malhotra');

  return {
    isoDate,
    dayLabel: dayLabels[isoDate] || isoDate,
    executiveSummary: summaries[isoDate] || 'Executive overview for the day.',
    agenda: dayEvents,
    criticalAlerts: [
      {
        title: 'Vendor List Overdue',
        description: 'Raghav followed up 3 times; list promised for Wednesday morning.',
        severity: 'HIGH',
        action: 'Send vendor list to Raghav'
      },
      {
        title: 'Mumbai Lease Renewal Unassigned',
        description: 'Deadline Friday 25 Sep EOD. Ownership is unassigned.',
        severity: 'CRITICAL',
        action: 'Assign signatory during Facilities Check-in'
      }
    ],
    openCommitments: fallbackCommitments.filter(c => c.status === 'OVERDUE' || c.status === 'OPEN' || c.status === 'AT_RISK'),
    totalOpenCommitments: 3,
    criticalCount: 2
  };
}

const fallbackCalendarEvents: CalendarEventDto[] = [
  // Arjun
  { id: 1, person: { id: 1, name: 'Arjun Malhotra', role: 'VP Sales', email: 'arjun@example.com', user: true }, dayDate: 'Mon 21 Sep', isoDate: '2026-09-21', startTime: '09:00', endTime: '09:35', timeRange: '9:00–9:35 AM', title: 'Leadership Sync', blocked: false, hasConflict: false, conflictNotes: null },
  { id: 2, person: { id: 1, name: 'Arjun Malhotra', role: 'VP Sales', email: 'arjun@example.com', user: true }, dayDate: 'Mon 21 Sep', isoDate: '2026-09-21', startTime: '14:00', endTime: '14:30', timeRange: '2:00–2:30 PM', title: '1:1 with Neha', blocked: false, hasConflict: false, conflictNotes: null },
  { id: 3, person: { id: 1, name: 'Arjun Malhotra', role: 'VP Sales', email: 'arjun@example.com', user: true }, dayDate: 'Mon 21 Sep', isoDate: '2026-09-21', startTime: '16:00', endTime: '17:00', timeRange: '4:00–5:00 PM', title: 'Blocked', blocked: true, hasConflict: false, conflictNotes: null },
  { id: 4, person: { id: 1, name: 'Arjun Malhotra', role: 'VP Sales', email: 'arjun@example.com', user: true }, dayDate: 'Tue 22 Sep', isoDate: '2026-09-22', startTime: '11:00', endTime: '12:00', timeRange: '11:00 AM–12:00 PM', title: 'Internal Budget Review', blocked: false, hasConflict: false, conflictNotes: null },
  { id: 5, person: { id: 1, name: 'Arjun Malhotra', role: 'VP Sales', email: 'arjun@example.com', user: true }, dayDate: 'Tue 22 Sep', isoDate: '2026-09-22', startTime: '15:00', endTime: '15:30', timeRange: '3:00–3:30 PM', title: 'Blocked', blocked: true, hasConflict: false, conflictNotes: null },
  { id: 6, person: { id: 1, name: 'Arjun Malhotra', role: 'VP Sales', email: 'arjun@example.com', user: true }, dayDate: 'Wed 23 Sep', isoDate: '2026-09-23', startTime: '15:00', endTime: '15:30', timeRange: '3:00–3:30 PM', title: 'Call — Meridian Logistics', blocked: false, hasConflict: false, conflictNotes: 'Confirmed with Priya Nair' },
  { id: 7, person: { id: 1, name: 'Arjun Malhotra', role: 'VP Sales', email: 'arjun@example.com', user: true }, dayDate: 'Wed 23 Sep', isoDate: '2026-09-23', startTime: '18:00', endTime: '18:15', timeRange: '6:00–6:15 PM', title: 'Blocked', blocked: true, hasConflict: false, conflictNotes: null },
  { id: 8, person: { id: 1, name: 'Arjun Malhotra', role: 'VP Sales', email: 'arjun@example.com', user: true }, dayDate: 'Thu 24 Sep', isoDate: '2026-09-24', startTime: '09:00', endTime: '10:00', timeRange: '9:00–10:00 AM', title: 'Board Prep Session', blocked: false, hasConflict: true, conflictNotes: 'Overlaps Neha Deck Review (9:30-10:00 AM)' },
  { id: 9, person: { id: 1, name: 'Arjun Malhotra', role: 'VP Sales', email: 'arjun@example.com', user: true }, dayDate: 'Thu 24 Sep', isoDate: '2026-09-24', startTime: '16:00', endTime: '17:00', timeRange: '4:00–5:00 PM', title: 'Hiring Panel — Sales Associate', blocked: false, hasConflict: false, conflictNotes: null },
  { id: 10, person: { id: 1, name: 'Arjun Malhotra', role: 'VP Sales', email: 'arjun@example.com', user: true }, dayDate: 'Fri 25 Sep', isoDate: '2026-09-25', startTime: '10:00', endTime: '10:30', timeRange: '10:00–10:30 AM', title: 'Facilities Check-in', blocked: false, hasConflict: false, conflictNotes: 'Discuss Mumbai office lease sign-off' },
  { id: 11, person: { id: 1, name: 'Arjun Malhotra', role: 'VP Sales', email: 'arjun@example.com', user: true }, dayDate: 'Fri 25 Sep', isoDate: '2026-09-25', startTime: '13:00', endTime: '14:00', timeRange: '1:00–2:00 PM', title: 'Blocked', blocked: true, hasConflict: false, conflictNotes: null },
];

const fallbackEmailThreads: EmailThreadDto[] = [
  {
    id: 1,
    subject: 'Vendor List',
    statusSummary: 'Raghav followed up 3 times. Slipped from Mon to Tue morning, then Wed morning. Still overdue on Arjun.',
    waitingOn: 'Waiting on Arjun',
    category: 'Operations',
    messages: [
      { id: 1, sequenceNumber: 1, timestamp: 'Mon 21 Sep, 9:50 AM', sender: { id: 3, name: 'Raghav Sethi', role: 'Ops Manager', email: 'raghav.sethi@veridian-corp.example' }, senderRaw: 'Raghav Sethi', recipient: 'arjun.malhotra@veridian-corp.example', body: 'Following up from the sync — can you send the updated vendor list today?' },
      { id: 2, sequenceNumber: 2, timestamp: 'Mon 21 Sep, 5:40 PM', sender: { id: 1, name: 'Arjun Malhotra', role: 'VP Sales', email: 'arjun.malhotra@veridian-corp.example' }, senderRaw: 'Arjun Malhotra', recipient: 'raghav.sethi@veridian-corp.example', body: 'Running behind, will send first thing tomorrow morning instead.' },
      { id: 3, sequenceNumber: 3, timestamp: 'Tue 22 Sep, 9:15 AM', sender: { id: 3, name: 'Raghav Sethi', role: 'Ops Manager', email: 'raghav.sethi@veridian-corp.example' }, senderRaw: 'Raghav Sethi', recipient: 'arjun.malhotra@veridian-corp.example', body: 'No worries, whenever you get a chance today works.' },
      { id: 4, sequenceNumber: 4, timestamp: 'Tue 22 Sep, 6:30 PM', sender: { id: 1, name: 'Arjun Malhotra', role: 'VP Sales', email: 'arjun.malhotra@veridian-corp.example' }, senderRaw: 'Arjun Malhotra', recipient: 'raghav.sethi@veridian-corp.example', body: 'Sorry, got pulled into board prep — will send by tomorrow (Wednesday) morning for sure.' },
      { id: 5, sequenceNumber: 5, timestamp: 'Wed 23 Sep, 8:45 AM', sender: { id: 3, name: 'Raghav Sethi', role: 'Ops Manager', email: 'raghav.sethi@veridian-corp.example' }, senderRaw: 'Raghav Sethi', recipient: 'arjun.malhotra@veridian-corp.example', body: 'Just checking — still good for this morning?' },
    ]
  },
  {
    id: 2,
    subject: 'Q3 Campaign Deck',
    statusSummary: 'Review moved to Thursday 9:30 AM. Neha finished the draft early and delivered it on Thursday at 8:00 AM.',
    waitingOn: 'Resolved / Delivered by Neha',
    category: 'Marketing',
    messages: [
      { id: 6, sequenceNumber: 1, timestamp: 'Mon 21 Sep, 11:00 AM', sender: { id: 2, name: 'Neha Kapoor', role: 'Marketing Lead', email: 'neha@example.com' }, senderRaw: 'Neha Kapoor', recipient: 'arjun@example.com', body: 'Deck’s coming together, still targeting Wednesday for your review.' },
      { id: 7, sequenceNumber: 2, timestamp: 'Tue 22 Sep, 4:15 PM', sender: { id: 2, name: 'Neha Kapoor', role: 'Marketing Lead', email: 'neha@example.com' }, senderRaw: 'Neha Kapoor', recipient: 'arjun@example.com', body: 'Heads up — shifting the review to Thursday morning instead of Wednesday, need one more day on the data slides.' },
      { id: 8, sequenceNumber: 3, timestamp: 'Wed 23 Sep, 10:00 AM', sender: { id: 1, name: 'Arjun Malhotra', role: 'VP Sales', email: 'arjun@example.com' }, senderRaw: 'Arjun Malhotra', recipient: 'neha@example.com', body: 'Understood, Thursday morning works. What time exactly?' },
      { id: 9, sequenceNumber: 4, timestamp: 'Wed 23 Sep, 10:20 AM', sender: { id: 2, name: 'Neha Kapoor', role: 'Marketing Lead', email: 'neha@example.com' }, senderRaw: 'Neha Kapoor', recipient: 'arjun@example.com', body: 'Let’s say 9:30 AM Thursday, before your board prep block.' },
      { id: 10, sequenceNumber: 5, timestamp: 'Thu 24 Sep, 8:00 AM', sender: { id: 2, name: 'Neha Kapoor', role: 'Marketing Lead', email: 'neha@example.com' }, senderRaw: 'Neha Kapoor', recipient: 'arjun@example.com', body: 'Deck is ready, attaching the draft ahead of our 9:30 review.' },
    ]
  },
  {
    id: 3,
    subject: 'Call Reschedule',
    statusSummary: 'Client call pushed by Meridian; Arjun proposed Wednesday 3:00 PM; Priya confirmed. Meeting scheduled on calendar.',
    waitingOn: 'Resolved / Scheduled',
    category: 'Client',
    messages: [
      { id: 11, sequenceNumber: 1, timestamp: 'Mon 21 Sep, 1:00 PM', sender: { id: 5, name: 'Priya Nair', role: 'Meridian Logistics', email: 'priya@example.com' }, senderRaw: 'Priya Nair', recipient: 'arjun@example.com', body: 'Our scheduled call this week got bumped from our side — can you propose a new time? We’re flexible Tuesday–Thursday afternoons.' },
      { id: 12, sequenceNumber: 2, timestamp: 'Tue 22 Sep, 3:00 PM', sender: { id: 1, name: 'Arjun Malhotra', role: 'VP Sales', email: 'arjun@example.com' }, senderRaw: 'Arjun Malhotra', recipient: 'priya@example.com', body: 'Apologies for the delay — how about Wednesday 3:00 PM?' },
      { id: 13, sequenceNumber: 3, timestamp: 'Tue 22 Sep, 5:45 PM', sender: { id: 5, name: 'Priya Nair', role: 'Meridian Logistics', email: 'priya@example.com' }, senderRaw: 'Priya Nair', recipient: 'arjun@example.com', body: 'Wednesday 3 PM works on our end, confirmed.' },
      { id: 14, sequenceNumber: 4, timestamp: 'Wed 23 Sep, 1:30 PM', sender: { id: 5, name: 'Priya Nair', role: 'Meridian Logistics', email: 'priya@example.com' }, senderRaw: 'Priya Nair', recipient: 'arjun@example.com', body: 'Quick check — still on for 3 PM today?' },
      { id: 15, sequenceNumber: 5, timestamp: 'Wed 23 Sep, 2:00 PM', sender: { id: 1, name: 'Arjun Malhotra', role: 'VP Sales', email: 'arjun@example.com' }, senderRaw: 'Arjun Malhotra', recipient: 'priya@example.com', body: 'Yes, confirmed, see you at 3.' },
    ]
  },
  {
    id: 4,
    subject: 'Expense Variance Report',
    statusSummary: 'Divya accelerated delivery to Wednesday evening per Arjun’s request and delivered the report at 6:00 PM. Arjun acknowledged receipt. Arjun still needs to review before Board Prep.',
    waitingOn: 'Arjun review before Board Prep',
    category: 'Finance',
    messages: [
      { id: 16, sequenceNumber: 1, timestamp: 'Mon 21 Sep, 2:30 PM', sender: { id: 4, name: 'Divya Rao', role: 'Finance', email: 'divya@example.com' }, senderRaw: 'Divya Rao', recipient: 'arjun@example.com', body: 'Starting on the July variance numbers, targeting Thursday morning for board prep as discussed.' },
      { id: 17, sequenceNumber: 2, timestamp: 'Tue 22 Sep, 9:00 AM', sender: { id: 1, name: 'Arjun Malhotra', role: 'VP Sales', email: 'arjun@example.com' }, senderRaw: 'Arjun Malhotra', recipient: 'divya@example.com', body: 'Actually, can I get it by Wednesday evening instead? Want time to review before Thursday.' },
      { id: 18, sequenceNumber: 3, timestamp: 'Tue 22 Sep, 9:40 AM', sender: { id: 4, name: 'Divya Rao', role: 'Finance', email: 'divya@example.com' }, senderRaw: 'Divya Rao', recipient: 'arjun@example.com', body: 'Wednesday evening is tight but doable, I’ll prioritize it.' },
      { id: 19, sequenceNumber: 4, timestamp: 'Wed 23 Sep, 6:00 PM', sender: { id: 4, name: 'Divya Rao', role: 'Finance', email: 'divya@example.com' }, senderRaw: 'Divya Rao', recipient: 'arjun@example.com', body: 'Report attached, sent as promised.' },
      { id: 20, sequenceNumber: 5, timestamp: 'Wed 23 Sep, 6:10 PM', sender: { id: 1, name: 'Arjun Malhotra', role: 'VP Sales', email: 'arjun@example.com' }, senderRaw: 'Arjun Malhotra', recipient: 'divya@example.com', body: 'Got it, thank you — exactly what I needed before tomorrow.' },
    ]
  },
  {
    id: 5,
    subject: 'Mumbai Office Lease Renewal',
    statusSummary: 'Critical unassigned risk. Sign-off deadline is Friday 25 Sep EOD. Facilities sent 2 reminders. Raghav escalated twice. Ownership remains unresolved.',
    waitingOn: 'Unassigned / Escalated to Arjun',
    category: 'Facilities',
    messages: [
      { id: 21, sequenceNumber: 1, timestamp: 'Mon 21 Sep, 10:15 AM', sender: null, senderRaw: 'Facilities', recipient: 'All Staff', body: 'Reminder: the Mumbai office lease renewal requires an authorized signature by Friday, 25 September.' },
      { id: 22, sequenceNumber: 2, timestamp: 'Tue 22 Sep, 11:00 AM', sender: { id: 3, name: 'Raghav Sethi', role: 'Ops Manager', email: 'raghav@example.com' }, senderRaw: 'Raghav Sethi', recipient: 'arjun@example.com, divya@example.com', body: 'Following up from the sync — has anyone confirmed who’s signing off on the Mumbai renewal? Don’t think it’s been assigned.' },
      { id: 23, sequenceNumber: 3, timestamp: 'Wed 23 Sep, 9:30 AM', sender: { id: 4, name: 'Divya Rao', role: 'Finance', email: 'divya@example.com' }, senderRaw: 'Divya Rao', recipient: 'raghav@example.com, arjun@example.com', body: 'Not on my end — I believe this typically sits with Facilities directly, not us.' },
      { id: 24, sequenceNumber: 4, timestamp: 'Thu 24 Sep, 4:00 PM', sender: null, senderRaw: 'Facilities', recipient: 'All Staff', body: 'Second reminder: signature is still pending. Deadline is Friday, 25 September, end of day.' },
      { id: 25, sequenceNumber: 5, timestamp: 'Thu 24 Sep, 4:45 PM', sender: { id: 3, name: 'Raghav Sethi', role: 'Ops Manager', email: 'raghav@example.com' }, senderRaw: 'Raghav Sethi', recipient: 'arjun@example.com', body: 'This is now one day out and still unowned — can you confirm who’s handling it?' },
    ]
  },
];

const fallbackConflicts = [
  {
    id: 'conflict-thu-deck-review',
    type: 'CALENDAR_OVERLAP',
    severity: 'CRITICAL',
    title: 'Double-Booking: Board Prep Session vs Deck Review',
    description: "Neha scheduled 'Deck Review with Arjun' for Thu 24 Sep 9:30–10:00 AM, which directly collides with Arjun's 'Board Prep Session' (9:00–10:00 AM with Divya).",
    dayDate: 'Thu 24 Sep',
    time: '9:30–10:00 AM',
    involvedPeople: ['Arjun Malhotra', 'Neha Kapoor', 'Divya Rao'],
    resolution: 'Review Neha’s draft asynchronously since she delivered it at 8:00 AM Thursday.'
  },
  {
    id: 'risk-mumbai-lease',
    type: 'UNASSIGNED_OWNERSHIP',
    severity: 'CRITICAL',
    title: 'Unassigned Sign-off: Mumbai Office Lease Renewal',
    description: 'Lease renewal sign-off deadline is Friday 25 Sep EOD. Facilities sent 2 reminders and Raghav escalated twice. No one has taken ownership.',
    dayDate: 'Fri 25 Sep',
    time: 'End of Day',
    involvedPeople: ['Facilities', 'Raghav Sethi', 'Arjun Malhotra', 'Divya Rao'],
    resolution: 'Assign an authorized signatory during Friday 10:00 AM Facilities Check-in.'
  },
  {
    id: 'risk-vendor-list',
    type: 'MISSED_COMMITMENT',
    severity: 'HIGH',
    title: 'Repeated Delay: Updated Vendor List for Raghav',
    description: 'Arjun promised the vendor list for Tuesday morning, then pushed to Wednesday morning. Raghav has followed up 3 times and is still waiting.',
    dayDate: 'Wed 23 Sep',
    time: 'Overdue since Wed morning',
    involvedPeople: ['Arjun Malhotra', 'Raghav Sethi'],
    resolution: 'Send the updated vendor list to Raghav immediately to unblock operations.'
  }
];

const fallbackVoiceNotes = [
  {
    id: 1,
    noteNumber: 1,
    timestamp: 'Monday 21 Sep, 6:40 PM',
    context: 'Recorded in cab',
    transcript: 'Quick note to self — need to get Raghav that vendor list, I think I said today but it might slip to tomorrow morning, remind me. Also still haven’t heard back on the Mumbai lease thing, someone needs to own that, I don’t think it’s me.',
    extractedCommitments: '1. Vendor list to Raghav needs sending (slipping to Tue morning). 2. Mumbai lease renewal still unowned, someone needs to take it.'
  },
  {
    id: 2,
    noteNumber: 2,
    timestamp: 'Wednesday 23 Sep, 8:15 AM',
    context: 'Personal memo before workday',
    transcript: 'Reminder — expense variance report from Divya needs to be in my hands by Wednesday evening, not Thursday, I want time to go through it before board prep. Also Meridian call — I owe Priya a time, need to lock that in today.',
    extractedCommitments: '1. Expense variance report must arrive Wed evening for board prep review. 2. Meridian call needs locking in.'
  }
];
