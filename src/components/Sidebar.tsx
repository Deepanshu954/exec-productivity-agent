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
  ShieldCheck,
  X
} from 'lucide-react';

export type View = 'dashboard' | 'assistant' | 'actions' | 'calendar' | 'emails' | 'conflicts' | 'voicenotes' | 'scheduler';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  conflictCount: number;
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export const navItems: { id: View; label: string; icon: typeof LayoutDashboard; badge?: string }[] = [
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
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const handleNavClick = (view: View) => {
    onViewChange(view);
    if (onMobileClose) {
      onMobileClose();
    }
  };

  const navContent = (isCollapsed: boolean, isMobileView: boolean = false) => (
    <div className="flex flex-col h-full select-none">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-[var(--color-border-primary)] shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--color-brand)] via-purple-600 to-cyan-400 flex items-center justify-center shrink-0 shadow-lg shadow-[var(--color-brand)]/20">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          {(!isCollapsed || isMobileView) && (
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

        {isMobileView ? (
          <button
            onClick={onMobileClose}
            aria-label="Close menu"
            className="p-1.5 rounded-lg text-[var(--color-text-3)] hover:text-white hover:bg-[var(--color-hover)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="p-1.5 rounded-lg text-[var(--color-text-3)] hover:text-white hover:bg-[var(--color-hover)] transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Navigation List */}
      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              title={isCollapsed && !isMobileView ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                isActive
                  ? 'bg-[var(--color-brand)]/15 text-[var(--color-brand-light)] border border-[var(--color-brand)]/30 shadow-sm font-semibold'
                  : 'text-[var(--color-text-2)] hover:text-white hover:bg-[var(--color-hover)]'
              } ${isCollapsed && !isMobileView ? 'justify-center' : ''}`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-colors ${
                  isActive ? 'text-[var(--color-brand-light)]' : 'group-hover:text-white'
                }`}
                strokeWidth={isActive ? 2.2 : 1.8}
              />

              {(!isCollapsed || isMobileView) && (
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
      <div className="p-3 border-t border-[var(--color-border-primary)] bg-[var(--color-surface-2)]/40 shrink-0">
        <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
            AM
          </div>
          {(!isCollapsed || isMobileView) && (
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
    </div>
  );

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          onClick={onMobileClose}
          className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity animate-in fade-in"
        />
      )}

      {/* Mobile Slide-in Drawer */}
      <div
        className={`md:hidden fixed top-0 bottom-0 left-0 w-72 max-w-[85vw] bg-[var(--color-surface-1)] z-50 shadow-2xl border-r border-[var(--color-border-primary)] transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {navContent(false, true)}
      </div>

      {/* Desktop In-Flow Persistent Sidebar (NEVER OVERLAPS MAIN CONTENT) */}
      <aside
        className={`hidden md:flex flex-col shrink-0 sticky top-0 h-screen z-30 bg-[var(--color-surface-1)] border-r border-[var(--color-border-primary)] transition-all duration-200 ease-in-out ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {navContent(collapsed, false)}
      </aside>
    </>
  );
}
