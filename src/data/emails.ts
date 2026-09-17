export interface Email {
  id: string;
  threadId: string;
  subject: string;
  from: string;
  to: string | string[];
  date: string;
  time: string;
  body: string;
  timestamp: number; // for sorting
}

export interface EmailThread {
  id: string;
  subject: string;
  emails: Email[];
}

export const emailThreads: EmailThread[] = [
  {
    id: 'thread-1',
    subject: 'Vendor List',
    emails: [
      {
        id: 'e1-1', threadId: 'thread-1', subject: 'Vendor List',
        from: 'raghav.sethi@veridian-corp.example',
        to: 'arjun.malhotra@veridian-corp.example',
        date: '2026-09-21', time: '9:50 AM',
        body: 'Following up from the sync — can you send the updated vendor list today?',
        timestamp: 1,
      },
      {
        id: 'e1-2', threadId: 'thread-1', subject: 'Vendor List',
        from: 'arjun.malhotra@veridian-corp.example',
        to: 'raghav.sethi@veridian-corp.example',
        date: '2026-09-21', time: '5:40 PM',
        body: 'Running behind, will send first thing tomorrow morning instead.',
        timestamp: 2,
      },
      {
        id: 'e1-3', threadId: 'thread-1', subject: 'Vendor List',
        from: 'raghav.sethi@veridian-corp.example',
        to: 'arjun.malhotra@veridian-corp.example',
        date: '2026-09-22', time: '9:15 AM',
        body: 'No worries, whenever you get a chance today works.',
        timestamp: 3,
      },
      {
        id: 'e1-4', threadId: 'thread-1', subject: 'Vendor List',
        from: 'arjun.malhotra@veridian-corp.example',
        to: 'raghav.sethi@veridian-corp.example',
        date: '2026-09-22', time: '6:30 PM',
        body: 'Sorry, got pulled into board prep — will send by tomorrow (Wednesday) morning for sure.',
        timestamp: 4,
      },
      {
        id: 'e1-5', threadId: 'thread-1', subject: 'Vendor List',
        from: 'raghav.sethi@veridian-corp.example',
        to: 'arjun.malhotra@veridian-corp.example',
        date: '2026-09-23', time: '8:45 AM',
        body: 'Just checking — still good for this morning?',
        timestamp: 5,
      },
    ],
  },
  {
    id: 'thread-2',
    subject: 'Q3 Campaign Deck',
    emails: [
      {
        id: 'e2-1', threadId: 'thread-2', subject: 'Q3 Campaign Deck',
        from: 'neha.kapoor@veridian-corp.example',
        to: 'arjun.malhotra@veridian-corp.example',
        date: '2026-09-21', time: '11:00 AM',
        body: "Deck's coming together, still targeting Wednesday for your review.",
        timestamp: 6,
      },
      {
        id: 'e2-2', threadId: 'thread-2', subject: 'Q3 Campaign Deck',
        from: 'neha.kapoor@veridian-corp.example',
        to: 'arjun.malhotra@veridian-corp.example',
        date: '2026-09-22', time: '4:15 PM',
        body: 'Heads up — shifting the review to Thursday morning instead of Wednesday, need one more day on the data slides.',
        timestamp: 7,
      },
      {
        id: 'e2-3', threadId: 'thread-2', subject: 'Q3 Campaign Deck',
        from: 'arjun.malhotra@veridian-corp.example',
        to: 'neha.kapoor@veridian-corp.example',
        date: '2026-09-23', time: '10:00 AM',
        body: 'Understood, Thursday morning works. What time exactly?',
        timestamp: 8,
      },
      {
        id: 'e2-4', threadId: 'thread-2', subject: 'Q3 Campaign Deck',
        from: 'neha.kapoor@veridian-corp.example',
        to: 'arjun.malhotra@veridian-corp.example',
        date: '2026-09-23', time: '10:20 AM',
        body: "Let's say 9:30 AM Thursday, before your board prep block.",
        timestamp: 9,
      },
      {
        id: 'e2-5', threadId: 'thread-2', subject: 'Q3 Campaign Deck',
        from: 'neha.kapoor@veridian-corp.example',
        to: 'arjun.malhotra@veridian-corp.example',
        date: '2026-09-24', time: '8:00 AM',
        body: 'Deck is ready, attaching the draft ahead of our 9:30 review.',
        timestamp: 10,
      },
    ],
  },
  {
    id: 'thread-3',
    subject: 'Call Reschedule',
    emails: [
      {
        id: 'e3-1', threadId: 'thread-3', subject: 'Call Reschedule',
        from: 'priya.nair@meridianlogistics.example',
        to: 'arjun.malhotra@veridian-corp.example',
        date: '2026-09-21', time: '1:00 PM',
        body: "Our scheduled call this week got bumped from our side — can you propose a new time? We're flexible Tuesday–Thursday afternoons.",
        timestamp: 11,
      },
      {
        id: 'e3-2', threadId: 'thread-3', subject: 'Call Reschedule',
        from: 'arjun.malhotra@veridian-corp.example',
        to: 'priya.nair@meridianlogistics.example',
        date: '2026-09-22', time: '3:00 PM',
        body: 'Apologies for the delay — how about Wednesday 3:00 PM?',
        timestamp: 12,
      },
      {
        id: 'e3-3', threadId: 'thread-3', subject: 'Call Reschedule',
        from: 'priya.nair@meridianlogistics.example',
        to: 'arjun.malhotra@veridian-corp.example',
        date: '2026-09-22', time: '5:45 PM',
        body: 'Wednesday 3 PM works on our end, confirmed.',
        timestamp: 13,
      },
      {
        id: 'e3-4', threadId: 'thread-3', subject: 'Call Reschedule',
        from: 'priya.nair@meridianlogistics.example',
        to: 'arjun.malhotra@veridian-corp.example',
        date: '2026-09-23', time: '1:30 PM',
        body: 'Quick check — still on for 3 PM today?',
        timestamp: 14,
      },
      {
        id: 'e3-5', threadId: 'thread-3', subject: 'Call Reschedule',
        from: 'arjun.malhotra@veridian-corp.example',
        to: 'priya.nair@meridianlogistics.example',
        date: '2026-09-23', time: '2:00 PM',
        body: 'Yes, confirmed, see you at 3.',
        timestamp: 15,
      },
    ],
  },
  {
    id: 'thread-4',
    subject: 'Expense Variance Report',
    emails: [
      {
        id: 'e4-1', threadId: 'thread-4', subject: 'Expense Variance Report',
        from: 'divya.rao@veridian-corp.example',
        to: 'arjun.malhotra@veridian-corp.example',
        date: '2026-09-21', time: '2:30 PM',
        body: 'Starting on the July variance numbers, targeting Thursday morning for board prep as discussed.',
        timestamp: 16,
      },
      {
        id: 'e4-2', threadId: 'thread-4', subject: 'Expense Variance Report',
        from: 'arjun.malhotra@veridian-corp.example',
        to: 'divya.rao@veridian-corp.example',
        date: '2026-09-22', time: '9:00 AM',
        body: 'Actually, can I get it by Wednesday evening instead? Want time to review before Thursday.',
        timestamp: 17,
      },
      {
        id: 'e4-3', threadId: 'thread-4', subject: 'Expense Variance Report',
        from: 'divya.rao@veridian-corp.example',
        to: 'arjun.malhotra@veridian-corp.example',
        date: '2026-09-22', time: '9:40 AM',
        body: "Wednesday evening is tight but doable, I'll prioritize it.",
        timestamp: 18,
      },
      {
        id: 'e4-4', threadId: 'thread-4', subject: 'Expense Variance Report',
        from: 'divya.rao@veridian-corp.example',
        to: 'arjun.malhotra@veridian-corp.example',
        date: '2026-09-23', time: '6:00 PM',
        body: 'Report attached, sent as promised.',
        timestamp: 19,
      },
      {
        id: 'e4-5', threadId: 'thread-4', subject: 'Expense Variance Report',
        from: 'arjun.malhotra@veridian-corp.example',
        to: 'divya.rao@veridian-corp.example',
        date: '2026-09-23', time: '6:10 PM',
        body: 'Got it, thank you — exactly what I needed before tomorrow.',
        timestamp: 20,
      },
    ],
  },
  {
    id: 'thread-5',
    subject: 'Mumbai Office Lease Renewal',
    emails: [
      {
        id: 'e5-1', threadId: 'thread-5', subject: 'Mumbai Office Lease Renewal',
        from: 'facilities@veridian-corp.example',
        to: 'All Staff',
        date: '2026-09-21', time: '10:15 AM',
        body: 'Reminder: the Mumbai office lease renewal requires an authorized signature by Friday, 25 September.',
        timestamp: 21,
      },
      {
        id: 'e5-2', threadId: 'thread-5', subject: 'Mumbai Office Lease Renewal',
        from: 'raghav.sethi@veridian-corp.example',
        to: ['arjun.malhotra@veridian-corp.example', 'divya.rao@veridian-corp.example'],
        date: '2026-09-22', time: '11:00 AM',
        body: "Following up from the sync — has anyone confirmed who's signing off on the Mumbai renewal? Don't think it's been assigned.",
        timestamp: 22,
      },
      {
        id: 'e5-3', threadId: 'thread-5', subject: 'Mumbai Office Lease Renewal',
        from: 'divya.rao@veridian-corp.example',
        to: ['raghav.sethi@veridian-corp.example', 'arjun.malhotra@veridian-corp.example'],
        date: '2026-09-23', time: '9:30 AM',
        body: "Not on my end — I believe this typically sits with Facilities directly, not us.",
        timestamp: 23,
      },
      {
        id: 'e5-4', threadId: 'thread-5', subject: 'Mumbai Office Lease Renewal',
        from: 'facilities@veridian-corp.example',
        to: 'All Staff',
        date: '2026-09-24', time: '4:00 PM',
        body: 'Second reminder: signature is still pending. Deadline is Friday, 25 September, end of day.',
        timestamp: 24,
      },
      {
        id: 'e5-5', threadId: 'thread-5', subject: 'Mumbai Office Lease Renewal',
        from: 'raghav.sethi@veridian-corp.example',
        to: 'arjun.malhotra@veridian-corp.example',
        date: '2026-09-24', time: '4:45 PM',
        body: "This is now one day out and still unowned — can you confirm who's handling it?",
        timestamp: 25,
      },
    ],
  },
];
