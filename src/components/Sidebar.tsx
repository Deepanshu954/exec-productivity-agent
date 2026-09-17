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
      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-surface-1)]/90 backdrop-blur-xl border-t border-[var(--color-border-primary)]">
        <div className="flex items-center justify-around px-1 py-1.5">
          {navItems.slice(0, 6).map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-xl text-[10px] font-medium transition-all relative
                  ${isActive
                    ? 'text-[var(--color-brand-light)]'
                    : 'text-[var(--color-text-3)] active:text-[var(--color-text-1)]'
                  }`}
              >
                <Icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.2 : 1.8} />
                <span>{item.label}</span>
                {isActive && (
                  <motion.div layoutId="mobileTab" className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-5 h-[3px] rounded-full bg-[var(--color-brand)]" />
                )}
                {item.id === 'conflicts' && conflictCount > 0 && (
                  <span className="absolute -top-0.5 right-0 w-4 h-4 text-[9px] font-bold rounded-full bg-[var(--color-red)] text-white flex items-center justify-center">
                    {conflictCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? 68 : 244 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-40 bg-[var(--color-surface-1)] border-r border-[var(--color-border-primary)]"
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-[var(--color-border-primary)]">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--color-brand)] via-[#9b6dff] to-[var(--color-cyan)] flex items-center justify-center shrink-0 shadow-lg shadow-[var(--color-brand)]/20">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.15 }}
                className="overflow-hidden"
              >
                <p className="text-[13px] font-bold text-[var(--color-text-0)] leading-tight">Exec Agent</p>
                <p className="text-[10px] text-[var(--color-text-3)] leading-tight">Arjun Malhotra • VP Sales</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 px-2.5 space-y-0.5 overflow-y-auto">
          {!collapsed && (
            <p className="text-[10px] font-semibold text-[var(--color-text-3)] uppercase tracking-wider px-3 mb-2">Navigation</p>
          )}
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium transition-all relative group
                  ${isActive
                    ? 'bg-[var(--color-brand-glow)] text-[var(--color-brand-light)]'
                    : 'text-[var(--color-text-2)] hover:text-[var(--color-text-0)] hover:bg-[var(--color-hover)]'
                  }
                  ${collapsed ? 'justify-center px-0' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                {isActive && (
                  <motion.div
                    layoutId="sidebarActive"
                    className="absolute left-0 top-[6px] bottom-[6px] w-[3px] rounded-r-full bg-[var(--color-brand)]"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon className="w-[18px] h-[18px] shrink-0" strokeWidth={isActive ? 2.2 : 1.8} />
                <AnimatePresence>
                  {!collapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.1 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {item.id === 'conflicts' && conflictCount > 0 && (
                  <span className={`flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full bg-[var(--color-red)] text-white shadow-lg shadow-[var(--color-red)]/30 ${collapsed ? 'absolute -top-1 -right-1' : 'ml-auto'}`}>
                    {conflictCount}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Collapse */}
        <div className="px-2.5 py-3 border-t border-[var(--color-border-primary)]">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-[12px] text-[var(--color-text-3)] hover:text-[var(--color-text-1)] hover:bg-[var(--color-hover)] transition-all"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {!collapsed && <span>Collapse</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
}
