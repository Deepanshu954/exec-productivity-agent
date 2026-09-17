import { calendarEvents } from '../data/calendar';

export interface ConflictAlert {
  id: string;
  type: 'calendar-overlap' | 'deadline-risk' | 'unowned-task' | 'missed-commitment' | 'scheduling-note';
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  date: string;
  recommendation: string;
}

export function detectConflicts(): ConflictAlert[] {
  const conflicts: ConflictAlert[] = [];

  // 1. Deck review at 9:30 overlaps/collides with Board Prep at 9:00
  const deckReview = calendarEvents.find(e =>
    e.person === 'Neha Kapoor' && e.event === 'Deck Review with Arjun' && e.date === '2026-09-24'
  );
  const boardPrep = calendarEvents.find(e =>
    e.person === 'Arjun Malhotra' && e.event === 'Board Prep Session' && e.date === '2026-09-24'
  );
  if (deckReview && boardPrep) {
    conflicts.push({
      id: 'conflict-1',
      type: 'calendar-overlap',
      severity: 'warning',
      title: 'Deck Review overlaps with Board Prep',
      description: `Neha's deck review is at 9:30–10:00 AM, but Arjun's Board Prep Session runs 9:00–10:00 AM on Thu 24 Sep. The deck review falls within the board prep block.`,
      date: '2026-09-24',
      recommendation: 'Suggest Arjun review the deck at 9:30 as part of board prep prep, or reschedule one of them. The 30-min deck review could be a quick pre-meeting before the broader board prep.',
    });
  }

  // 2. Mumbai lease — CRITICAL unowned deadline
  conflicts.push({
    id: 'conflict-2',
    type: 'unowned-task',
    severity: 'critical',
    title: 'Mumbai Lease Renewal — No Owner Assigned',
    description: 'The Mumbai office lease renewal requires an authorized signature by Friday 25 Sep EOD. As of Thu 4:45 PM, no one has been assigned. Facilities sent two reminders. Raghav escalated to Arjun.',
    date: '2026-09-25',
    recommendation: 'Arjun should immediately designate a signer (likely himself or escalate to legal/admin). The Facilities Check-in on Fri 10 AM is the last window to resolve this.',
  });

  // 3. Vendor list — repeated delays
  conflicts.push({
    id: 'conflict-3',
    type: 'missed-commitment',
    severity: 'warning',
    title: 'Vendor List — Delayed Twice, Still Pending',
    description: 'Arjun promised the vendor list to Raghav on Monday EOD, then Tuesday morning, then Wednesday morning. As of Wednesday 8:45 AM, Raghav is still waiting (3rd follow-up).',
    date: '2026-09-23',
    recommendation: 'Prioritize sending the vendor list immediately. Multiple delays risk credibility with the Ops team.',
  });

  // 4. Note about Thu scheduling density
  conflicts.push({
    id: 'conflict-4',
    type: 'scheduling-note',
    severity: 'info',
    title: 'Thursday is heavily packed',
    description: 'Arjun has: Deck Review (9:30 AM), Board Prep (9:00–10:00 AM), and Hiring Panel (4:00–5:00 PM). Plus the Mumbai lease deadline is the next day. Thu is a high-pressure day.',
    date: '2026-09-24',
    recommendation: 'Review the expense variance report before 9 AM. Keep afternoon light for any Mumbai lease escalation.',
  });

  // 5. Expense variance report review window
  conflicts.push({
    id: 'conflict-5',
    type: 'deadline-risk',
    severity: 'warning',
    title: 'Expense Report Review Window is Tight',
    description: 'Arjun requested the expense variance report by Wed evening (received at 6 PM). Board prep is at 9 AM Thu. Only the evening/early morning window to review.',
    date: '2026-09-24',
    recommendation: 'Block 30 minutes Wed evening or Thu before 9 AM to review the report.',
  });

  return conflicts;
}

export const conflicts = detectConflicts();
