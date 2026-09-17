export type ActionStatus = 'pending' | 'in-progress' | 'completed' | 'overdue' | 'at-risk';
export type ActionPriority = 'critical' | 'high' | 'medium' | 'low';
export type ActionSource = 'meeting' | 'email' | 'voice-note';

export interface ActionItem {
  id: string;
  title: string;
  owner: string;
  assignedBy: string;
  deadline: string;
  deadlineLabel: string;
  status: ActionStatus;
  priority: ActionPriority;
  source: ActionSource;
  sourceDetail: string;
  notes: string;
  relatedThreadId?: string;
}

export const actionItems: ActionItem[] = [
  {
    id: 'ai-1',
    title: 'Send updated vendor list to Raghav',
    owner: 'Arjun Malhotra',
    assignedBy: 'Self (Meeting + Voice Note)',
    deadline: '2026-09-23',
    deadlineLabel: 'Wed 23 Sep morning',
    status: 'at-risk',
    priority: 'high',
    source: 'meeting',
    sourceDetail: 'Leadership Sync — "I\'ll get that to him by end of day tomorrow." Then delayed twice in email (Mon→Tue→Wed). Voice note confirms awareness of delay.',
    notes: 'Originally promised Mon EOD, then Tue morning, then Wed morning. Raghav followed up 3 times. Still pending as of Wed 8:45 AM.',
    relatedThreadId: 'thread-1',
  },
  {
    id: 'ai-2',
    title: 'Review Q3 Campaign Deck from Neha',
    owner: 'Arjun Malhotra',
    assignedBy: 'Neha Kapoor',
    deadline: '2026-09-24',
    deadlineLabel: 'Thu 24 Sep, 9:30 AM',
    status: 'pending',
    priority: 'high',
    source: 'meeting',
    sourceDetail: 'Leadership Sync — originally Wed review, shifted to Thu AM. Email confirms 9:30 AM slot. Neha sent deck Thu 8:00 AM.',
    notes: 'Deck review now on Arjun\'s calendar at 9:30 AM Thu. Deck delivered by Neha ahead of meeting.',
    relatedThreadId: 'thread-2',
  },
  {
    id: 'ai-3',
    title: 'Clarify ownership of Mumbai office lease renewal signature',
    owner: 'Arjun Malhotra',
    assignedBy: 'Raghav Sethi (escalation)',
    deadline: '2026-09-25',
    deadlineLabel: 'Fri 25 Sep EOD (HARD DEADLINE)',
    status: 'overdue',
    priority: 'critical',
    source: 'email',
    sourceDetail: 'Facilities sent 2 reminders (Mon + Thu). Raghav flagged twice. Divya says it\'s not her. Nobody owns it.',
    notes: 'CRITICAL: Signature deadline is Friday EOD. As of Thu 4:45 PM, still no owner assigned. Arjun flagged it in meeting ("flag it, don\'t assume") and voice note ("someone needs to own that"). No action taken.',
    relatedThreadId: 'thread-5',
  },
  {
    id: 'ai-4',
    title: 'Pull July expense variance report for board prep',
    owner: 'Divya Rao',
    assignedBy: 'Arjun Malhotra',
    deadline: '2026-09-23',
    deadlineLabel: 'Wed 23 Sep evening',
    status: 'completed',
    priority: 'high',
    source: 'meeting',
    sourceDetail: 'Leadership Sync — Arjun asked for it before Thu board prep. Email thread moved deadline from Thu to Wed evening. Divya delivered Wed 6:00 PM.',
    notes: 'Report delivered on time. Arjun confirmed receipt at 6:10 PM Wed.',
    relatedThreadId: 'thread-4',
  },
  {
    id: 'ai-5',
    title: 'Reconfirm Meridian Logistics call time with Priya',
    owner: 'Arjun Malhotra',
    assignedBy: 'Self (Meeting)',
    deadline: '2026-09-23',
    deadlineLabel: 'Wed 23 Sep',
    status: 'completed',
    priority: 'medium',
    source: 'meeting',
    sourceDetail: 'Meeting — "I need to reconfirm the new time." Email thread shows Arjun proposed Wed 3 PM, Priya confirmed. Call happened.',
    notes: 'Resolved: call confirmed for Wed 3:00 PM. Both parties confirmed. Calendar shows the event.',
    relatedThreadId: 'thread-3',
  },
  {
    id: 'ai-6',
    title: 'Review expense variance report before board prep',
    owner: 'Arjun Malhotra',
    assignedBy: 'Self (Voice Note)',
    deadline: '2026-09-24',
    deadlineLabel: 'Before Thu 24 Sep board prep (9 AM)',
    status: 'pending',
    priority: 'high',
    source: 'voice-note',
    sourceDetail: 'Voice Note 2 — "I want time to go through it before board prep." Report received Wed 6 PM.',
    notes: 'Report delivered. Arjun needs to review it before the 9 AM Thu board prep session.',
  },
];

export function getActionsByOwner(owner: string): ActionItem[] {
  return actionItems.filter(a => a.owner === owner);
}

export function getActionsByStatus(status: ActionStatus): ActionItem[] {
  return actionItems.filter(a => a.status === status);
}

export function getActionsByPriority(priority: ActionPriority): ActionItem[] {
  return actionItems.filter(a => a.priority === priority);
}

export function getArjunActions(): ActionItem[] {
  return getActionsByOwner('Arjun Malhotra');
}
