import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Mail,
  AlertTriangle,
  Mic,
  Search,
  Clock,
  ChevronLeft,
  ChevronRight,
  Zap,
} from 'lucide-react';

export type View = 'dashboard' | 'actions' | 'calendar' | 'emails' | 'conflicts' | 'voicenotes' | 'search' | 'scheduler';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  conflictCount: number;
}

const navItems: { id: View; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Briefing', icon: LayoutDashboard },
  { id: 'actions', label: 'Action Items', icon: CheckSquare },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'emails', label: 'Email Threads', icon: Mail },
  { id: 'conflicts', label: 'Alerts & Risks', icon: AlertTriangle },
  { id: 'voicenotes', label: 'Voice Notes', icon: Mic },
  { id: 'scheduler', label: 'Scheduler', icon: Clock },
  { id: 'search', label: 'Search', icon: Search },
];

export default function Sidebar({ currentView, onViewChange, conflictCount }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[var(--color-surface-elevated)] border-b border-[var(--color-border)] px-3 py-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <div className="flex items-center gap-1.5 mr-2 shrink-0">
            <Zap className="w-4 h-4 text-[var(--color-accent)]" />
            <span className="text-xs font-semibold text-[var(--color-accent)]">EPA</span>
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all
                  ${isActive
                    ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)]'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]'
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {item.label}
                {item.id === 'conflicts' && conflictCount > 0 && (
                  <span className="ml-0.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[var(--color-error)] text-white">
                    {conflictCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Desktop sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 64 : 240 }}
        className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 bg-[var(--color-surface-elevated)] border-r border-[var(--color-border)] z-40"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-[var(--color-border-subtle)]">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-purple-500 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="overflow-hidden whitespace-nowrap"
              >
                <h1 className="text-sm font-bold text-[var(--color-text-primary)]">Executive Agent</h1>
                <p className="text-[10px] text-[var(--color-text-muted)]">Arjun Malhotra</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative
                  ${isActive
                    ? 'bg-[var(--color-accent-subtle)] text-[var(--color-accent)]'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface-hover)]'
                  }
                  ${collapsed ? 'justify-center' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon className="w-[18px] h-[18px] shrink-0" />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="overflow-hidden whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {item.id === 'conflicts' && conflictCount > 0 && (
                  <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[var(--color-error)] text-white ${collapsed ? 'absolute -top-0.5 -right-0.5' : 'ml-auto'}`}>
                    {conflictCount}
                  </span>
                )}
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-[var(--color-accent)]"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Collapse button */}
        <div className="px-2 py-3 border-t border-[var(--color-border-subtle)]">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] transition-all"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
}
