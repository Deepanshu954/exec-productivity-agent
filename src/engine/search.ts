import { meetings } from '../data/meetings';
import { emailThreads } from '../data/emails';
import { voiceNotes } from '../data/voiceNotes';
import { actionItems } from './actionItems';
import { emailThreadSummaries } from './emailSummary';
import { calendarEvents } from '../data/calendar';
import { people } from '../data/people';

export interface SearchResult {
  type: 'action-item' | 'email' | 'meeting' | 'voice-note' | 'calendar' | 'thread-summary';
  title: string;
  snippet: string;
  relevance: number;
  source: string;
  date?: string;
}

export function search(query: string): SearchResult[] {
  if (!query.trim()) return [];
  
  const q = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  // Search action items
  for (const item of actionItems) {
    const searchText = `${item.title} ${item.owner} ${item.notes} ${item.sourceDetail} ${item.status} ${item.priority}`.toLowerCase();
    if (searchText.includes(q) || fuzzyMatch(q, searchText)) {
      results.push({
        type: 'action-item',
        title: item.title,
        snippet: item.notes,
        relevance: calculateRelevance(q, searchText),
        source: `Action Item — ${item.source}`,
        date: item.deadline,
      });
    }
  }

  // Search email threads
  for (const thread of emailThreads) {
    for (const email of thread.emails) {
      const from = people.find(p => p.email === email.from)?.name || email.from;
      const searchText = `${email.subject} ${email.body} ${from}`.toLowerCase();
      if (searchText.includes(q) || fuzzyMatch(q, searchText)) {
        results.push({
          type: 'email',
          title: `${thread.subject} — ${from}`,
          snippet: email.body,
          relevance: calculateRelevance(q, searchText),
          source: `Email — ${email.date} ${email.time}`,
          date: email.date,
        });
      }
    }
  }

  // Search thread summaries
  for (const summary of emailThreadSummaries) {
    const searchText = `${summary.subject} ${summary.latestStatus} ${summary.waitingOn} ${summary.keyPoints.join(' ')}`.toLowerCase();
    if (searchText.includes(q) || fuzzyMatch(q, searchText)) {
      results.push({
        type: 'thread-summary',
        title: `Thread: ${summary.subject}`,
        snippet: summary.latestStatus,
        relevance: calculateRelevance(q, searchText) + 2,
        source: `Email Thread Summary`,
      });
    }
  }

  // Search meeting transcript
  for (const meeting of meetings) {
    for (const segment of meeting.segments) {
      const searchText = `${segment.speaker} ${segment.text}`.toLowerCase();
      if (searchText.includes(q) || fuzzyMatch(q, searchText)) {
        results.push({
          type: 'meeting',
          title: `${meeting.title} — ${segment.speaker}`,
          snippet: segment.text,
          relevance: calculateRelevance(q, searchText),
          source: `Meeting — ${meeting.date}`,
          date: meeting.date,
        });
      }
    }
  }

  // Search voice notes
  for (const note of voiceNotes) {
    const searchText = `${note.transcript} ${note.context}`.toLowerCase();
    if (searchText.includes(q) || fuzzyMatch(q, searchText)) {
      results.push({
        type: 'voice-note',
        title: `Voice Note — ${note.day} ${note.time}`,
        snippet: note.transcript,
        relevance: calculateRelevance(q, searchText),
        source: `Voice Note — ${note.date}`,
        date: note.date,
      });
    }
  }

  // Search calendar events
  for (const event of calendarEvents) {
    const searchText = `${event.person} ${event.event} ${event.day}`.toLowerCase();
    if (searchText.includes(q) || fuzzyMatch(q, searchText)) {
      results.push({
        type: 'calendar',
        title: `${event.event} — ${event.person}`,
        snippet: `${event.day} ${event.date}, ${event.startTime}–${event.endTime}`,
        relevance: calculateRelevance(q, searchText),
        source: `Calendar`,
        date: event.date,
      });
    }
  }

  // Sort by relevance
  results.sort((a, b) => b.relevance - a.relevance);
  return results;
}

function calculateRelevance(query: string, text: string): number {
  let score = 0;
  const words = query.split(/\s+/);
  for (const word of words) {
    if (text.includes(word)) score += 3;
    // Bonus for exact phrase
    if (text.includes(query)) score += 5;
  }
  return score;
}

function fuzzyMatch(query: string, text: string): boolean {
  const words = query.split(/\s+/);
  return words.every(word => text.includes(word));
}

// Pre-built common queries
export const suggestedQueries = [
  'vendor list',
  'campaign deck',
  'Mumbai lease',
  'expense report',
  'Meridian call',
  'board prep',
  'Neha deck',
  'Raghav',
  'Divya report',
  'Friday deadline',
];
