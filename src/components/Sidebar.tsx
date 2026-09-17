import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  Mail,
  AlertTriangle,
  Mic,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

export type View = 'dashboard' | 'assistant' | 'actions' | 'calendar' | 'emails' | 'conflicts' | 'voicenotes' | 'scheduler';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  conflictCount: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const navItems: { id: View; label: string; icon: typeof LayoutDashboard; badge?: string }[] = [
  { id: 'dashboard', label: 'Executive Briefing', icon: LayoutDashboard },
  { id: 'assistant', label: 'AI Executive Agent', icon: Sparkles, badge: 'AI' },
  { id: 'actions', label: 'Commitments', icon: CheckSquare },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'emails', label: 'Email Intelligence', icon: Mail },
  { id: 'conflicts', label: 'Alerts & Risks', icon: AlertTriangle },
  { id: 'voicenotes', label: 'Voice Notes & Sync', icon: Mic },
  { id: 'scheduler', label: 'Smart Scheduler', icon: Clock },
];

export default function Sidebar({
  currentView,
  onViewChange,
  conflictCount,
  collapsed,
  onToggleCollapse,
}: SidebarProps) {
  return (
    <>
      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-surface-1)]/95 backdrop-blur-xl border-t border-[var(--color-border-primary)] shadow-2xl">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                className={`flex flex-col items-center gap-1 px-2.5 py-1.5 rounded-xl text-[10px] font-semibold transition-all relative ${
                  isActive
                    ? 'text-[var(--color-brand-light)]'
                    : 'text-[var(--color-text-3)] hover:text-[var(--color-text-1)]'
                }`}
              >
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.3 : 1.8} />
                <span>{item.label.split(' ')[0]}</span>
                {item.id === 'conflicts' && conflictCount > 0 && (
                  <span className="absolute top-0 right-1 w-4 h-4 text-[9px] font-bold rounded-full bg-red-500 text-white flex items-center justify-center">
                    {conflictCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden md:flex flex-col fixed left-0 top-0 bottom-0 z-40 bg-[var(--color-surface-1)] border-r border-[var(--color-border-primary)] transition-all duration-200 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-[var(--color-border-primary)]">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--color-brand)] via-purple-600 to-cyan-400 flex items-center justify-center shrink-0 shadow-lg shadow-[var(--color-brand)]/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            {!collapsed && (
              <div className="truncate">
                <p className="text-sm font-bold text-white tracking-tight leading-none">
                  Veridian Agent
                </p>
                <p className="text-[11px] text-[var(--color-text-3)] mt-1 truncate">
                  Executive Cockpit
                </p>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="p-1.5 rounded-lg text-[var(--color-text-3)] hover:text-white hover:bg-[var(--color-hover)] transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onViewChange(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                  isActive
                    ? 'bg-[var(--color-brand)]/15 text-[var(--color-brand-light)] border border-[var(--color-brand)]/30 shadow-sm'
                    : 'text-[var(--color-text-2)] hover:text-white hover:bg-[var(--color-hover)]'
                } ${collapsed ? 'justify-center' : ''}`}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-colors ${
                    isActive ? 'text-[var(--color-brand-light)]' : 'group-hover:text-white'
                  }`}
                  strokeWidth={isActive ? 2.2 : 1.8}
                />

                {!collapsed && (
                  <>
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <span className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-gradient-to-r from-[var(--color-brand)] to-purple-500 text-white">
                        {item.badge}
                      </span>
                    )}
                    {item.id === 'conflicts' && conflictCount > 0 && (
                      <span className="ml-auto px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
                        {conflictCount}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </div>

        {/* User Profile Card */}
        <div className="p-3 border-t border-[var(--color-border-primary)] bg-[var(--color-surface-2)]/40">
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
              AM
            </div>
            {!collapsed && (
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-white truncate">Arjun Malhotra</p>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                </div>
                <p className="text-[10px] text-[var(--color-text-3)] truncate">
                  VP Sales • Veridian Corp
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
