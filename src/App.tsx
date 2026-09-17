import { useState } from 'react';
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

const viewTitles: Record<View, string> = {
  dashboard: 'Daily Briefing',
  actions: 'Action Items',
  calendar: 'Calendar — Week of 21–25 Sep 2026',
  emails: 'Email Thread Intelligence',
  conflicts: 'Alerts & Risks',
  voicenotes: 'Voice Notes & Transcript',
  search: 'Search',
  scheduler: 'Smart Scheduler',
};

const viewDescriptions: Record<View, string> = {
  dashboard: "Arjun's daily executive briefing — agenda, pending items, and key insights.",
  actions: 'All action items extracted from meetings, emails, and voice notes — with owner, status, and source.',
  calendar: 'Week-at-a-glance for Arjun, Neha, Raghav, and Divya — with conflict highlighting.',
  emails: 'Thread-by-thread intelligence — latest status, who is waiting on whom, and full email trail.',
  conflicts: 'Calendar overlaps, deadline risks, unowned tasks, and missed commitments.',
  voicenotes: "Arjun's personal voice memos and the Leadership Sync meeting transcript.",
  search: 'Search across all data sources — meetings, emails, voice notes, calendar, and action items.',
  scheduler: 'Find common free meeting slots across team members\' calendars.',
};

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard': return <Dashboard />;
      case 'actions': return <ActionItems />;
      case 'calendar': return <CalendarView />;
      case 'emails': return <EmailThreads />;
      case 'conflicts': return <ConflictAlerts />;
      case 'voicenotes': return <VoiceNotes />;
      case 'search': return <SearchView />;
      case 'scheduler': return <SchedulerView />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        conflictCount={conflicts.filter(c => c.severity === 'critical').length}
      />

      {/* Main content */}
      <main className="md:ml-60 pt-14 md:pt-0">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-[var(--color-text-primary)]">
              {viewTitles[currentView]}
            </h1>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">
              {viewDescriptions[currentView]}
            </p>
          </div>

          {renderView()}
        </div>
      </main>
    </div>
  );
}

export default App;
