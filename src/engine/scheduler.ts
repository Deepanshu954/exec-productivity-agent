import { calendarEvents, weekDays } from '../data/calendar';

export interface FreeSlot {
  date: string;
  dayLabel: string;
  startTime: string;
  endTime: string;
  durationMinutes: number;
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour12}:${m.toString().padStart(2, '0')} ${suffix}`;
}

export function findFreeSlots(
  peopleNames: string[],
  minDurationMinutes: number = 30,
  workdayStart: string = '09:00',
  workdayEnd: string = '18:00'
): FreeSlot[] {
  const slots: FreeSlot[] = [];
  const startMin = timeToMinutes(workdayStart);
  const endMin = timeToMinutes(workdayEnd);

  for (const day of weekDays) {
    // Get all events for the requested people on this day
    const dayEvents = calendarEvents
      .filter(e => peopleNames.includes(e.person) && e.date === day.date)
      .map(e => ({
        start: timeToMinutes(e.startTime),
        end: timeToMinutes(e.endTime),
      }))
      .sort((a, b) => a.start - b.start);

    // Find gaps
    let cursor = startMin;
    for (const event of dayEvents) {
      if (event.start > cursor) {
        const gap = event.start - cursor;
        if (gap >= minDurationMinutes) {
          slots.push({
            date: day.date,
            dayLabel: day.label,
            startTime: minutesToTime(cursor),
            endTime: minutesToTime(event.start),
            durationMinutes: gap,
          });
        }
      }
      cursor = Math.max(cursor, event.end);
    }
    // Check remaining time after last event
    if (endMin > cursor) {
      const gap = endMin - cursor;
      if (gap >= minDurationMinutes) {
        slots.push({
          date: day.date,
          dayLabel: day.label,
          startTime: minutesToTime(cursor),
          endTime: minutesToTime(endMin),
          durationMinutes: gap,
        });
      }
    }
  }

  return slots;
}

export { formatTime };
