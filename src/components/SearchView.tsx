import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, FileText, Mail, Mic, Calendar, X, Hash, Zap } from 'lucide-react';
import { search, suggestedQueries, type SearchResult } from '../engine/search';

export default function SearchView() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const doSearch = (q: string) => {
    setQuery(q);
    setHasSearched(true);
    setResults(search(q));
  };

  const typeIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'action-item': return <Zap className="w-4 h-4 text-[var(--color-warning)]" />;
      case 'email': return <Mail className="w-4 h-4 text-[var(--color-info)]" />;
      case 'meeting': return <FileText className="w-4 h-4 text-blue-400" />;
      case 'voice-note': return <Mic className="w-4 h-4 text-purple-400" />;
      case 'calendar': return <Calendar className="w-4 h-4 text-[var(--color-success)]" />;
      case 'thread-summary': return <Hash className="w-4 h-4 text-[var(--color-accent)]" />;
    }
  };

  const typeLabel = (type: SearchResult['type']) => {
    const labels: Record<string, string> = {
      'action-item': 'Action Item',
      'email': 'Email',
      'meeting': 'Meeting',
      'voice-note': 'Voice Note',
      'calendar': 'Calendar',
      'thread-summary': 'Thread Summary',
    };
    return labels[type] || type;
  };

  return (
    <div className="space-y-5">
      {/* Search Input */}
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
        <input
          type="text"
          value={query}
          onChange={(e) => doSearch(e.target.value)}
          placeholder='Search across all data — try "vendor list", "Mumbai lease", "Neha deck"...'
          className="w-full pl-12 pr-10 py-3.5 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-all"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setResults([]); setHasSearched(false); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Suggested Queries */}
      {!hasSearched && (
        <div>
          <p className="text-xs text-[var(--color-text-muted)] mb-2">Suggested searches:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQueries.map(sq => (
              <button
                key={sq}
                onClick={() => doSearch(sq)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all"
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
          <p className="text-xs text-[var(--color-text-muted)] mb-3">
            {results.length} result{results.length !== 1 ? 's' : ''} for "{query}"
          </p>
          {results.length === 0 ? (
            <div className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl p-8 text-center">
              <SearchIcon className="w-8 h-8 text-[var(--color-text-muted)] mx-auto mb-2" />
              <p className="text-sm text-[var(--color-text-muted)]">No results found</p>
              <p className="text-xs text-[var(--color-text-muted)] mt-1">Try different keywords</p>
            </div>
          ) : (
            <div className="space-y-2">
              {results.map((result, i) => (
                <motion.div
                  key={`${result.type}-${i}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                  className="bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl p-4 hover:border-[var(--color-accent)]/30 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0">{typeIcon(result.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-medium text-[var(--color-text-primary)]">{result.title}</h3>
                        <span className="text-[10px] font-medium text-[var(--color-text-muted)] bg-[var(--color-surface-hover)] px-1.5 py-0.5 rounded">
                          {typeLabel(result.type)}
                        </span>
                      </div>
                      <p className="text-xs text-[var(--color-text-secondary)] mt-1 leading-relaxed line-clamp-2">
                        {result.snippet}
                      </p>
                      <p className="text-[10px] text-[var(--color-text-muted)] mt-1.5">{result.source}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
