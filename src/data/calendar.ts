export interface CalendarEvent {
  person: string;
  day: string;
  date: string;
  startTime: string;
  endTime: string;
  event: string;
  isBlocked: boolean;
}

export const calendarEvents: CalendarEvent[] = [
  // Arjun Malhotra
  { person: 'Arjun Malhotra', day: 'Mon', date: '2026-09-21', startTime: '09:00', endTime: '09:35', event: 'Leadership Sync', isBlocked: false },
  { person: 'Arjun Malhotra', day: 'Mon', date: '2026-09-21', startTime: '14:00', endTime: '14:30', event: '1:1 with Neha', isBlocked: false },
  { person: 'Arjun Malhotra', day: 'Mon', date: '2026-09-21', startTime: '16:00', endTime: '17:00', event: 'Blocked', isBlocked: true },
  { person: 'Arjun Malhotra', day: 'Tue', date: '2026-09-22', startTime: '11:00', endTime: '12:00', event: 'Internal Budget Review', isBlocked: false },
  { person: 'Arjun Malhotra', day: 'Tue', date: '2026-09-22', startTime: '15:00', endTime: '15:30', event: 'Blocked', isBlocked: true },
  { person: 'Arjun Malhotra', day: 'Wed', date: '2026-09-23', startTime: '15:00', endTime: '15:30', event: 'Call — Meridian Logistics', isBlocked: false },
  { person: 'Arjun Malhotra', day: 'Wed', date: '2026-09-23', startTime: '18:00', endTime: '18:15', event: 'Blocked', isBlocked: true },
  { person: 'Arjun Malhotra', day: 'Thu', date: '2026-09-24', startTime: '09:00', endTime: '10:00', event: 'Board Prep Session', isBlocked: false },
  { person: 'Arjun Malhotra', day: 'Thu', date: '2026-09-24', startTime: '16:00', endTime: '17:00', event: 'Hiring Panel — Sales Associate', isBlocked: false },
  { person: 'Arjun Malhotra', day: 'Fri', date: '2026-09-25', startTime: '10:00', endTime: '10:30', event: 'Facilities Check-in', isBlocked: false },
  { person: 'Arjun Malhotra', day: 'Fri', date: '2026-09-25', startTime: '13:00', endTime: '14:00', event: 'Blocked', isBlocked: true },

  // Neha Kapoor
  { person: 'Neha Kapoor', day: 'Mon', date: '2026-09-21', startTime: '10:00', endTime: '11:00', event: 'Blocked', isBlocked: true },
  { person: 'Neha Kapoor', day: 'Mon', date: '2026-09-21', startTime: '14:00', endTime: '14:30', event: '1:1 with Arjun', isBlocked: false },
  { person: 'Neha Kapoor', day: 'Tue', date: '2026-09-22', startTime: '13:00', endTime: '14:00', event: 'Campaign Vendor Call', isBlocked: false },
  { person: 'Neha Kapoor', day: 'Wed', date: '2026-09-23', startTime: '10:00', endTime: '10:30', event: 'Deck Prep', isBlocked: false },
  { person: 'Neha Kapoor', day: 'Wed', date: '2026-09-23', startTime: '13:00', endTime: '15:00', event: 'Blocked', isBlocked: true },
  { person: 'Neha Kapoor', day: 'Thu', date: '2026-09-24', startTime: '09:30', endTime: '10:00', event: 'Deck Review with Arjun', isBlocked: false },
  { person: 'Neha Kapoor', day: 'Fri', date: '2026-09-25', startTime: '11:00', endTime: '12:00', event: 'Blocked', isBlocked: true },

  // Raghav Sethi
  { person: 'Raghav Sethi', day: 'Mon', date: '2026-09-21', startTime: '09:00', endTime: '09:35', event: 'Leadership Sync', isBlocked: false },
  { person: 'Raghav Sethi', day: 'Mon', date: '2026-09-21', startTime: '13:00', endTime: '14:00', event: 'Blocked', isBlocked: true },
  { person: 'Raghav Sethi', day: 'Tue', date: '2026-09-22', startTime: '11:00', endTime: '12:00', event: 'Internal Budget Review', isBlocked: false },
  { person: 'Raghav Sethi', day: 'Tue', date: '2026-09-22', startTime: '15:30', endTime: '16:00', event: 'Ops Standup', isBlocked: false },
  { person: 'Raghav Sethi', day: 'Wed', date: '2026-09-23', startTime: '09:00', endTime: '11:00', event: 'Blocked', isBlocked: true },
  { person: 'Raghav Sethi', day: 'Thu', date: '2026-09-24', startTime: '14:00', endTime: '15:00', event: 'Blocked', isBlocked: true },
  { person: 'Raghav Sethi', day: 'Fri', date: '2026-09-25', startTime: '10:00', endTime: '10:30', event: 'Facilities Check-in', isBlocked: false },
  { person: 'Raghav Sethi', day: 'Fri', date: '2026-09-25', startTime: '15:00', endTime: '16:00', event: 'Blocked', isBlocked: true },

  // Divya Rao
  { person: 'Divya Rao', day: 'Mon', date: '2026-09-21', startTime: '14:30', endTime: '15:00', event: 'Budget Prep', isBlocked: false },
  { person: 'Divya Rao', day: 'Mon', date: '2026-09-21', startTime: '16:00', endTime: '17:00', event: 'Blocked', isBlocked: true },
  { person: 'Divya Rao', day: 'Tue', date: '2026-09-22', startTime: '09:00', endTime: '09:15', event: 'Quick Call with Arjun', isBlocked: false },
  { person: 'Divya Rao', day: 'Tue', date: '2026-09-22', startTime: '11:00', endTime: '12:00', event: 'Internal Budget Review', isBlocked: false },
  { person: 'Divya Rao', day: 'Wed', date: '2026-09-23', startTime: '13:00', endTime: '14:00', event: 'Blocked', isBlocked: true },
  { person: 'Divya Rao', day: 'Thu', date: '2026-09-24', startTime: '09:00', endTime: '10:00', event: 'Board Prep Session', isBlocked: false },
  { person: 'Divya Rao', day: 'Thu', date: '2026-09-24', startTime: '14:00', endTime: '15:00', event: 'Blocked', isBlocked: true },
  { person: 'Divya Rao', day: 'Fri', date: '2026-09-25', startTime: '10:00', endTime: '11:00', event: 'Blocked', isBlocked: true },
];

export function getEventsForPerson(personName: string): CalendarEvent[] {
  return calendarEvents.filter(e => e.person === personName);
}

export function getEventsForDate(date: string): CalendarEvent[] {
  return calendarEvents.filter(e => e.date === date);
}

export function getArjunEvents(): CalendarEvent[] {
  return getEventsForPerson('Arjun Malhotra');
}

export const weekDays = [
  { day: 'Mon', date: '2026-09-21', label: 'Mon 21 Sep' },
  { day: 'Tue', date: '2026-09-22', label: 'Tue 22 Sep' },
  { day: 'Wed', date: '2026-09-23', label: 'Wed 23 Sep' },
  { day: 'Thu', date: '2026-09-24', label: 'Thu 24 Sep' },
  { day: 'Fri', date: '2026-09-25', label: 'Fri 25 Sep' },
];
