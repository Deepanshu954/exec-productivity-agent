import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar, { type View } from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ActionItems from './components/ActionItems';
import CalendarView from './components/CalendarView';
import EmailThreads from './components/EmailThreads';
import ConflictAlerts from './components/ConflictAlerts';
import VoiceNotes from './components/VoiceNotes';
import SchedulerView from './components/SchedulerView';
import AiAssistant from './components/AiAssistant';
import { api } from './services/api';

const viewMeta: Record<View, { title: string; description: string }> = {
  dashboard: {
    title: 'Executive Command Center',
    description: "Real-time executive briefing, urgent priorities, and AI assistant for Arjun Malhotra (VP Sales).",
  },
  assistant: {
    title: 'AI Executive Agent',
    description: 'Natural language reasoning engine strictly grounded in assignment data with evidence citations.',
  },
  actions: {
    title: 'Commitments & Deliverables',
    description: "Track Arjun's commitments vs team deliverables, delay counts, evidence quotes, and resolutions.",
  },
  calendar: {
    title: 'Executive Calendar',
    description: 'Week of 21–25 Sep 2026 — Multi-calendar view for Arjun, Neha, Raghav, and Divya with conflict detection.',
  },
  emails: {
    title: 'Email Intelligence',
    description: 'Complete 25-message email trails across all 5 threads, latest statuses, and blocking dependencies.',
  },
  conflicts: {
    title: 'Alerts & Risk Matrix',
    description: 'Surfacing double-bookings, overdue deliverables, and critical unassigned ownership items.',
  },
  voicenotes: {
    title: 'Voice Notes & Sync Transcript',
    description: "Arjun's personal dictated reminders and the verbatim Monday Leadership Sync transcript.",
  },
  scheduler: {
    title: 'Smart Team Scheduler',
    description: "Identify common free slots across team calendars (Arjun, Neha, Raghav, Divya).",
  },
};

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [conflictCount, setConflictCount] = useState(2);

  useEffect(() => {
    api.getConflicts().then((conflicts) => {
      setConflictCount(conflicts.filter((c) => c.severity === 'CRITICAL').length);
    });
  }, []);

  const meta = viewMeta[currentView];

  return (
    <div className="min-h-screen bg-[var(--color-surface-0)] text-[var(--color-text-0)] overflow-x-hidden">
      {/* Sidebar */}
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        conflictCount={conflictCount}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
      />

      {/* Main Content Area */}
      <main
        className={`transition-all duration-200 ease-in-out pb-24 md:pb-12 ${
          collapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Header Title & Subtitle */}
          <div className="mb-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {meta.title}
                    </h1>
                    <p className="text-xs sm:text-sm text-[var(--color-text-2)] mt-1 max-w-3xl">
                      {meta.description}
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center gap-2">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[var(--color-surface-2)] text-[var(--color-text-2)] border border-[var(--color-border-primary)]">
                      Week 39 • 2026
                    </span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Active View Renderer */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {currentView === 'dashboard' && (
                <Dashboard onNavigate={(v) => setCurrentView(v as View)} />
              )}
              {currentView === 'assistant' && (
                <div className="max-w-4xl mx-auto">
                  <AiAssistant />
                </div>
              )}
              {currentView === 'actions' && <ActionItems />}
              {currentView === 'calendar' && <CalendarView />}
              {currentView === 'emails' && <EmailThreads />}
              {currentView === 'conflicts' && <ConflictAlerts />}
              {currentView === 'voicenotes' && <VoiceNotes />}
              {currentView === 'scheduler' && <SchedulerView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default App;
