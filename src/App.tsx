import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, CheckSquare, Calendar, Database, ShieldCheck } from 'lucide-react';
import DailyBriefingChat from './components/DailyBriefingChat';
import CleanCommitments from './components/CleanCommitments';
import CleanSchedule from './components/CleanSchedule';
import SourceVaultModal from './components/SourceVaultModal';

export type MainTab = 'briefing' | 'commitments' | 'schedule';

function App() {
  const [activeTab, setActiveTab] = useState<MainTab>('briefing');
  const [sourceVaultOpen, setSourceVaultOpen] = useState(false);
  const [initialChatPrompt, setInitialChatPrompt] = useState<string | undefined>(undefined);

  const handleAskAi = (prompt: string) => {
    setInitialChatPrompt(prompt);
    setActiveTab('briefing');
  };

  return (
    <div className="min-h-screen w-full bg-[var(--color-surface-0)] text-[var(--color-text-0)] flex flex-col font-sans">
      {/* 1. Sleek Executive Top Navigation */}
      <header className="sticky top-0 z-30 w-full border-b border-[var(--color-border-primary)] bg-[var(--color-surface-1)]/90 backdrop-blur-md">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
          {/* Left: Brand & Executive Identity */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--color-brand)] via-purple-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-[var(--color-brand)]/20 shrink-0">
              <Sparkles className="w-4.5 h-4.5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-tight">Veridian Agent</span>
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-3 h-3" /> Grounded
                </span>
              </div>
              <p className="text-[11px] text-[var(--color-text-3)] leading-none mt-0.5">
                Arjun Malhotra • VP Sales
              </p>
            </div>
          </div>

          {/* Center: 3 Primary Workspaces (Clean Segmented Control) */}
          <div className="hidden md:flex items-center p-1 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border-primary)]">
            <button
              onClick={() => setActiveTab('briefing')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'briefing'
                  ? 'bg-[var(--color-brand)] text-white shadow-sm'
                  : 'text-[var(--color-text-2)] hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Daily Briefing & AI</span>
            </button>

            <button
              onClick={() => setActiveTab('commitments')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'commitments'
                  ? 'bg-[var(--color-brand)] text-white shadow-sm'
                  : 'text-[var(--color-text-2)] hover:text-white'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Commitments</span>
            </button>

            <button
              onClick={() => setActiveTab('schedule')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'schedule'
                  ? 'bg-[var(--color-brand)] text-white shadow-sm'
                  : 'text-[var(--color-text-2)] hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Schedule & Radar</span>
            </button>
          </div>

          {/* Right: Source Vault & Status */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSourceVaultOpen(true)}
              title="Inspect raw email trails, voice notes & sync transcripts"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[var(--color-surface-2)] text-[var(--color-text-1)] hover:text-white hover:border-[var(--color-border-active)] border border-[var(--color-border-primary)] text-xs font-semibold transition-all shadow-sm"
            >
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>Source Vault</span>
            </button>

            <span className="text-[11px] font-semibold px-3 py-1 rounded-full bg-[var(--color-surface-2)] text-[var(--color-text-3)] border border-[var(--color-border-primary)] hidden lg:inline-block">
              Week 39 • Sep 2026
            </span>
          </div>
        </div>
      </header>

      {/* Mobile Tab Strip (< md) */}
      <div className="md:hidden flex items-center justify-around bg-[var(--color-surface-1)] border-b border-[var(--color-border-primary)] px-2 py-2">
        <button
          onClick={() => setActiveTab('briefing')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
            activeTab === 'briefing' ? 'bg-[var(--color-brand)] text-white' : 'text-[var(--color-text-3)]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Briefing & AI</span>
        </button>
        <button
          onClick={() => setActiveTab('commitments')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
            activeTab === 'commitments' ? 'bg-[var(--color-brand)] text-white' : 'text-[var(--color-text-3)]'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span>Commitments</span>
        </button>
        <button
          onClick={() => setActiveTab('schedule')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${
            activeTab === 'schedule' ? 'bg-[var(--color-brand)] text-white' : 'text-[var(--color-text-3)]'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Schedule</span>
        </button>
      </div>

      {/* 2. Main Executive Workspace */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            {activeTab === 'briefing' && (
              <DailyBriefingChat initialQuery={initialChatPrompt} />
            )}
            {activeTab === 'commitments' && (
              <CleanCommitments onAskAi={handleAskAi} />
            )}
            {activeTab === 'schedule' && (
              <CleanSchedule onAskAi={handleAskAi} />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. Source Vault Modal */}
      <SourceVaultModal
        isOpen={sourceVaultOpen}
        onClose={() => setSourceVaultOpen(false)}
      />
    </div>
  );
}

export default App;
