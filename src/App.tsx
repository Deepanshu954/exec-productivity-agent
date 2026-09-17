import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar, { type View } from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ActionItems from './components/ActionItems';
import CalendarView from './components/CalendarView';
import EmailThreads from './components/EmailThreads';
import ConflictAlerts from './components/ConflictAlerts';
import VoiceNotes from './components/VoiceNotes';
import SearchView from './components/SearchView';
import SchedulerView from './components/SchedulerView';
import { conflicts } from './engine/conflicts';

const viewMeta: Record<View, { title: string; description: string }> = {
  dashboard: {
    title: 'Daily Briefing',
    description: "Arjun's executive briefing — agenda, pending items, and key insights for the day.",
  },
  actions: {
    title: 'Action Items',
    description: 'All action items extracted from meetings, emails, and voice notes.',
  },
  calendar: {
    title: 'Calendar',
    description: 'Week of 21–25 Sep 2026 — Arjun, Neha, Raghav, and Divya.',
  },
  emails: {
    title: 'Email Intelligence',
    description: 'Thread summaries — status, who is blocking whom, and full email trail.',
  },
  conflicts: {
    title: 'Alerts & Risks',
    description: 'Calendar overlaps, deadline risks, unowned tasks, and missed commitments.',
  },
  voicenotes: {
    title: 'Voice Notes & Transcript',
    description: "Arjun's personal voice memos and the Leadership Sync transcript.",
  },
  search: {
    title: 'Search',
    description: 'Search across meetings, emails, voice notes, calendar, and action items.',
  },
  scheduler: {
    title: 'Smart Scheduler',
    description: "Find common free slots across team members' calendars.",
  },
};

const views: Record<View, () => React.ReactNode> = {
  dashboard: Dashboard,
  actions: ActionItems,
  calendar: CalendarView,
  emails: EmailThreads,
  conflicts: ConflictAlerts,
  voicenotes: VoiceNotes,
  search: SearchView,
  scheduler: SchedulerView,
};

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const meta = viewMeta[currentView];
  const ViewComponent = views[currentView];

  return (
    <div className="min-h-screen bg-[var(--color-surface-0)]">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        conflictCount={conflicts.filter(c => c.severity === 'critical').length}
      />

      <main className="md:ml-[244px] pb-20 md:pb-0">
        <div className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Page header */}
          <div className="mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.2 }}
              >
                <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--color-text-0)] tracking-tight">
                  {meta.title}
                </h1>
                <p className="text-[13px] sm:text-[14px] text-[var(--color-text-2)] mt-1.5 max-w-xl">
                  {meta.description}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* View content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <ViewComponent />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default App;
