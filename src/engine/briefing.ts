import { calendarEvents, type CalendarEvent } from '../data/calendar';
import { actionItems } from './actionItems';
import { emailThreadSummaries } from './emailSummary';

export interface DailyBriefing {
  date: string;
  dayLabel: string;
  greeting: string;
  agenda: CalendarEvent[];
  pendingActions: typeof actionItems;
  deadlinesToday: typeof actionItems;
  keyInsights: string[];
  emailUpdates: string[];
}

const dayLabels: Record<string, string> = {
  '2026-09-21': 'Monday, September 21',
  '2026-09-22': 'Tuesday, September 22',
  '2026-09-23': 'Wednesday, September 23',
  '2026-09-24': 'Thursday, September 24',
  '2026-09-25': 'Friday, September 25',
};

export function generateBriefing(date: string): DailyBriefing {
  const arjunEvents = calendarEvents
    .filter(e => e.person === 'Arjun Malhotra' && e.date === date)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const pending = actionItems.filter(a =>
    a.status !== 'completed' && a.owner === 'Arjun Malhotra'
  );

  const deadlinesToday = actionItems.filter(a => a.deadline === date && a.status !== 'completed');

  const insights = generateInsights(date);
  const emailUpdates = generateEmailUpdates(date);

  return {
    date,
    dayLabel: dayLabels[date] || date,
    greeting: getGreeting(date),
    agenda: arjunEvents,
    pendingActions: pending,
    deadlinesToday,
    keyInsights: insights,
    emailUpdates,
  };
}

function getGreeting(date: string): string {
  const greetings: Record<string, string> = {
    '2026-09-21': "Good morning, Arjun. It's the start of a busy week. You have the Leadership Sync first thing, and a 1:1 with Neha this afternoon.",
    '2026-09-22': "Good morning, Arjun. Today's focus is the Internal Budget Review. You also have a quick call with Divya at 9 AM. The vendor list for Raghav is still pending — you promised it this morning.",
    '2026-09-23': "Good morning, Arjun. Key day — the Meridian Logistics call is at 3 PM (confirmed with Priya). The expense variance report from Divya is due tonight. The vendor list for Raghav is now two days late.",
    '2026-09-24': "Good morning, Arjun. Board Prep at 9 AM — make sure you've reviewed the expense variance report from Divya. Campaign deck review with Neha at 9:30. Mumbai lease deadline is TOMORROW — still no owner assigned.",
    '2026-09-25': "Good morning, Arjun. CRITICAL: The Mumbai office lease renewal signature is due by end of day TODAY. Facilities Check-in at 10 AM is your chance to sort this out. This is your last working day of the week.",
  };
  return greetings[date] || 'Good morning, Arjun.';
}

function generateInsights(date: string): string[] {
  const insights: string[] = [];

  if (date >= '2026-09-22') {
    insights.push('⚠️ Vendor list for Raghav is overdue — promised Mon EOD, now slipping.');
  }
  if (date >= '2026-09-24') {
    insights.push('🔴 Mumbai lease renewal — STILL UNOWNED. Deadline is Friday EOD. Two Facilities reminders sent.');
  }
  if (date === '2026-09-25') {
    insights.push('🚨 CRITICAL: Mumbai lease signature due TODAY. If unsigned, the lease may lapse.');
  }
  if (date === '2026-09-24') {
    insights.push('📋 Board prep session at 9 AM — expense variance report should be reviewed beforehand (received Wed 6 PM).');
    insights.push('📝 Campaign deck review with Neha at 9:30 AM — deck was sent at 8:00 AM.');
  }
  if (date === '2026-09-23') {
    insights.push('📞 Meridian Logistics call at 3 PM — confirmed with Priya.');
    insights.push('📊 Expense variance report from Divya due by tonight.');
  }

  return insights;
}

function generateEmailUpdates(date: string): string[] {
  return emailThreadSummaries
    .filter(s => s.relevantOn.includes(date))
    .map(s => `${s.icon} ${s.subject}: ${s.latestStatus}`);
}

export const briefings = [
  generateBriefing('2026-09-21'),
  generateBriefing('2026-09-22'),
  generateBriefing('2026-09-23'),
  generateBriefing('2026-09-24'),
  generateBriefing('2026-09-25'),
];
