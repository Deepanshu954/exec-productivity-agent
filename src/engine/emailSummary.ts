export interface ThreadSummary {
  threadId: string;
  subject: string;
  icon: string;
  status: 'resolved' | 'pending' | 'escalating' | 'at-risk';
  latestStatus: string;
  waitingOn: string;
  keyPoints: string[];
  relevantOn: string[];
  timeline: { date: string; event: string }[];
}

export const emailThreadSummaries: ThreadSummary[] = [
  {
    threadId: 'thread-1',
    subject: 'Vendor List',
    icon: '📋',
    status: 'at-risk',
    latestStatus: 'Arjun has delayed twice. Raghav is following up for a third time (Wed morning). Vendor list still not sent.',
    waitingOn: 'Arjun Malhotra',
    keyPoints: [
      'Arjun committed to sending the vendor list in the Leadership Sync (Mon).',
      'Promised Mon EOD → slipped to Tue morning → slipped to Wed morning.',
      'Raghav has sent 3 follow-up emails asking about it.',
      'As of Wed 8:45 AM, still not delivered.',
    ],
    relevantOn: ['2026-09-21', '2026-09-22', '2026-09-23', '2026-09-24', '2026-09-25'],
    timeline: [
      { date: 'Mon 9:50 AM', event: 'Raghav asks for vendor list' },
      { date: 'Mon 5:40 PM', event: 'Arjun says he\'ll send it tomorrow' },
      { date: 'Tue 9:15 AM', event: 'Raghav says no worries, today works' },
      { date: 'Tue 6:30 PM', event: 'Arjun delays again — promises Wed morning' },
      { date: 'Wed 8:45 AM', event: 'Raghav follows up again' },
    ],
  },
  {
    threadId: 'thread-2',
    subject: 'Q3 Campaign Deck',
    icon: '🎨',
    status: 'resolved',
    latestStatus: 'Deck delivered by Neha on Thu 8:00 AM. Review at 9:30 AM Thu confirmed.',
    waitingOn: 'Nobody — resolved',
    keyPoints: [
      'Neha was preparing the Q3 campaign deck for Arjun\'s review.',
      'Originally targeted for Wednesday, shifted to Thursday morning.',
      'Review time confirmed as 9:30 AM Thursday.',
      'Deck delivered ahead of schedule at 8:00 AM Thursday.',
    ],
    relevantOn: ['2026-09-21', '2026-09-22', '2026-09-23', '2026-09-24'],
    timeline: [
      { date: 'Mon 11:00 AM', event: 'Neha: deck 80% done, targeting Wed' },
      { date: 'Tue 4:15 PM', event: 'Neha shifts review to Thu morning' },
      { date: 'Wed 10:00 AM', event: 'Arjun confirms Thu works' },
      { date: 'Wed 10:20 AM', event: 'Neha locks in 9:30 AM Thu' },
      { date: 'Thu 8:00 AM', event: 'Deck delivered' },
    ],
  },
  {
    threadId: 'thread-3',
    subject: 'Call Reschedule (Meridian Logistics)',
    icon: '📞',
    status: 'resolved',
    latestStatus: 'Call confirmed for Wed 3 PM. Both parties confirmed. Call in Arjun\'s calendar.',
    waitingOn: 'Nobody — resolved',
    keyPoints: [
      'Original call was bumped from Meridian\'s side.',
      'Priya asked Arjun to propose a new time (flexible Tue–Thu afternoons).',
      'Arjun proposed Wed 3 PM.',
      'Priya confirmed. Call happened.',
    ],
    relevantOn: ['2026-09-21', '2026-09-22', '2026-09-23'],
    timeline: [
      { date: 'Mon 1:00 PM', event: 'Priya asks to reschedule' },
      { date: 'Tue 3:00 PM', event: 'Arjun proposes Wed 3 PM' },
      { date: 'Tue 5:45 PM', event: 'Priya confirms Wed 3 PM' },
      { date: 'Wed 1:30 PM', event: 'Priya checks — still on?' },
      { date: 'Wed 2:00 PM', event: 'Arjun confirms — see you at 3' },
    ],
  },
  {
    threadId: 'thread-4',
    subject: 'Expense Variance Report',
    icon: '📊',
    status: 'resolved',
    latestStatus: 'Report delivered by Divya on Wed 6:00 PM. Arjun acknowledged receipt.',
    waitingOn: 'Nobody — resolved',
    keyPoints: [
      'Arjun asked Divya for the July expense variance report for board prep.',
      'Originally due Thursday morning, moved up to Wednesday evening by Arjun.',
      'Divya confirmed Wednesday evening was doable.',
      'Report delivered on time at 6:00 PM Wednesday.',
      'Arjun confirmed receipt at 6:10 PM.',
    ],
    relevantOn: ['2026-09-21', '2026-09-22', '2026-09-23', '2026-09-24'],
    timeline: [
      { date: 'Mon 2:30 PM', event: 'Divya starts work, targeting Thu' },
      { date: 'Tue 9:00 AM', event: 'Arjun moves deadline to Wed evening' },
      { date: 'Tue 9:40 AM', event: 'Divya accepts Wed evening deadline' },
      { date: 'Wed 6:00 PM', event: 'Report delivered' },
      { date: 'Wed 6:10 PM', event: 'Arjun confirms receipt' },
    ],
  },
  {
    threadId: 'thread-5',
    subject: 'Mumbai Office Lease Renewal',
    icon: '🏢',
    status: 'escalating',
    latestStatus: 'CRITICAL: Signature deadline is Friday EOD. Still no owner. Two reminders sent by Facilities. Raghav escalated to Arjun.',
    waitingOn: 'Arjun Malhotra (needs to assign an owner)',
    keyPoints: [
      'Mumbai lease renewal requires an authorized signature by Friday 25 Sep EOD.',
      'Facilities sent reminder to All Staff on Monday.',
      'Raghav flagged it Tuesday — nobody has been assigned.',
      'Divya said it\'s not on her — thinks Facilities handles it.',
      'Second Facilities reminder sent Thursday — STILL PENDING.',
      'Raghav escalated directly to Arjun on Thursday: "can you confirm who\'s handling it?"',
      'This is a compliance/operational risk — lease could lapse.',
    ],
    relevantOn: ['2026-09-21', '2026-09-22', '2026-09-23', '2026-09-24', '2026-09-25'],
    timeline: [
      { date: 'Mon 10:15 AM', event: 'Facilities: lease renewal reminder (All Staff)' },
      { date: 'Tue 11:00 AM', event: 'Raghav asks: who\'s signing?' },
      { date: 'Wed 9:30 AM', event: 'Divya says not her — thinks Facilities' },
      { date: 'Thu 4:00 PM', event: 'Facilities: 2nd reminder, still pending' },
      { date: 'Thu 4:45 PM', event: 'Raghav escalates to Arjun directly' },
    ],
  },
];
