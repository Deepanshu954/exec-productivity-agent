import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, FileText, Mail, Mic, Calendar, X, Hash, Zap } from 'lucide-react';
import { search, suggestedQueries, type SearchResult } from '../engine/search';

const fadeUp = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };

export default function SearchView() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const doSearch = (q: string) => {
    setQuery(q);
    setHasSearched(true);
    setResults(search(q));
  };

  const typeConfig: Record<string, { icon: typeof Zap; color: string; bg: string; label: string }> = {
    'action-item': { icon: Zap, color: 'text-[var(--color-amber)]', bg: 'bg-[var(--color-amber-glow)]', label: 'Action Item' },
    'email': { icon: Mail, color: 'text-[var(--color-blue)]', bg: 'bg-[var(--color-blue-glow)]', label: 'Email' },
    'meeting': { icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Meeting' },
    'voice-note': { icon: Mic, color: 'text-purple-400', bg: 'bg-purple-500/10', label: 'Voice Note' },
    'calendar': { icon: Calendar, color: 'text-[var(--color-green)]', bg: 'bg-[var(--color-green-glow)]', label: 'Calendar' },
    'thread-summary': { icon: Hash, color: 'text-[var(--color-brand-light)]', bg: 'bg-[var(--color-brand-glow)]', label: 'Thread Summary' },
  };

  return (
    <div className="space-y-6">
      {/* Search input */}
      <div className="relative">
        <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-3)]" />
        <input
          type="text"
          value={query}
          onChange={(e) => doSearch(e.target.value)}
          placeholder='Search all data — "vendor list", "Mumbai lease", "Neha deck"...'
          className="w-full pl-14 pr-12 py-4 bg-[var(--color-surface-2)] border border-[var(--color-border-primary)] rounded-2xl text-[14px] text-[var(--color-text-0)] placeholder:text-[var(--color-text-3)] focus:outline-none focus:border-[var(--color-brand)]/50 focus:shadow-lg focus:shadow-[var(--color-brand)]/5 transition-all"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]); setHasSearched(false); }}
            className="absolute right-5 top-1/2 -translate-y-1/2 text-[var(--color-text-3)] hover:text-[var(--color-text-1)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Suggested */}
      {!hasSearched && (
        <div>
          <p className="text-[11px] font-bold text-[var(--color-text-3)] uppercase tracking-widest mb-3">Suggested Searches</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQueries.map(sq => (
              <button
                key={sq}
                onClick={() => doSearch(sq)}
                className="px-4 py-2 rounded-xl text-[12px] font-semibold bg-[var(--color-surface-2)] border border-[var(--color-border-primary)] text-[var(--color-text-2)] hover:border-[var(--color-brand)]/40 hover:text-[var(--color-brand-light)] hover:bg-[var(--color-brand-glow)] transition-all"
              >
                {sq}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {hasSearched && (
        <div>
          <p className="text-[12px] text-[var(--color-text-3)] mb-4 font-medium">
            {results.length} result{results.length !== 1 ? 's' : ''} for "<span className="text-[var(--color-brand-light)]">{query}</span>"
          </p>
          {results.length === 0 ? (
            <div className="card p-12 text-center">
              <SearchIcon className="w-10 h-10 text-[var(--color-text-3)] mx-auto mb-3 opacity-30" />
              <p className="text-[14px] text-[var(--color-text-2)]">No results found</p>
              <p className="text-[12px] text-[var(--color-text-3)] mt-1">Try different keywords</p>
            </div>
          ) : (
            <div className="space-y-2">
              {results.map((result, i) => {
                const tc = typeConfig[result.type] || typeConfig['email'];
                const Icon = tc.icon;
                return (
                  <motion.div
                    key={`${result.type}-${i}`}
                    variants={fadeUp}
                    initial="hidden"
                    animate="show"
                    transition={{ delay: i * 0.03 }}
                    className="card card-glow p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${tc.bg} shrink-0`}>
                        <Icon className={`w-4 h-4 ${tc.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-[13px] font-semibold text-[var(--color-text-0)]">{result.title}</h3>
                          <span className={`pill ${tc.bg} ${tc.color}`}>{tc.label}</span>
                        </div>
                        <p className="text-[12px] text-[var(--color-text-2)] mt-1.5 leading-relaxed line-clamp-2">
                          {result.snippet}
                        </p>
                        <p className="text-[10px] text-[var(--color-text-3)] mt-2 font-medium">{result.source}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
