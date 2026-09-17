import { useState } from 'react';
import { Sparkles, Key, Check, AlertCircle, RotateCw, X } from 'lucide-react';
import { GeminiService, DEFAULT_GEMINI_KEYS } from '../services/geminiService';

interface KeySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function KeySettingsModal({ isOpen, onClose }: KeySettingsModalProps) {
  const [customKey, setCustomKeyState] = useState(GeminiService.getCustomKey());
  const [testResult, setTestResult] = useState<{ status: 'idle' | 'testing' | 'success' | 'failed'; message: string }>({
    status: 'idle',
    message: '',
  });

  if (!isOpen) return null;

  const handleSave = () => {
    GeminiService.setCustomKey(customKey);
    setTestResult({ status: 'success', message: 'Saved successfully! Active key updated.' });
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleTestKey = async () => {
    setTestResult({ status: 'testing', message: 'Testing Gemini generation...' });
    try {
      const res = await GeminiService.generateAnswer('Are there any critical risks?');
      if (res && res.text) {
        setTestResult({
          status: 'success',
          message: `Success! ${res.model} responded with live reasoning.`,
        });
      } else {
        setTestResult({
          status: 'failed',
          message: 'External API rate-limited or quota 0 in this region. Seamlessly using local Grounded Executive Reasoner.',
        });
      }
    } catch (err: any) {
      setTestResult({
        status: 'failed',
        message: err.message || 'API connection failed. Using Grounded Reasoner fallback.',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[var(--color-surface-1)] border border-[var(--color-border-primary)] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border-primary)] bg-[var(--color-surface-2)]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[var(--color-brand)] to-purple-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">AI Engine & Gemini API Keys</h3>
              <p className="text-[11px] text-[var(--color-text-3)]">Configure or test live executive intelligence</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-[var(--color-text-3)] hover:text-white hover:bg-[var(--color-hover)]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Active Keys Pool */}
          <div>
            <label className="text-xs font-semibold text-[var(--color-text-1)] uppercase tracking-wider block mb-2">
              Configured Gemini Key Pool ({DEFAULT_GEMINI_KEYS.length} keys loaded)
            </label>
            <div className="space-y-1.5">
              {DEFAULT_GEMINI_KEYS.map((k, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border-primary)] text-xs font-mono text-[var(--color-text-2)]"
                >
                  <span className="flex items-center gap-2">
                    <Key className="w-3.5 h-3.5 text-[var(--color-brand-light)]" />
                    <span>{k.substring(0, 14)}...{k.substring(k.length - 8)}</span>
                  </span>
                  <span className="text-[10px] font-sans font-semibold px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/30">
                    Key #{i + 1} Active
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-[var(--color-text-3)] mt-2">
              The agent automatically rotates across these keys with fallback to the offline Grounded Reasoner if Google limits quota.
            </p>
          </div>

          {/* Custom Key Input */}
          <div>
            <label className="text-xs font-semibold text-[var(--color-text-1)] uppercase tracking-wider block mb-1.5">
              Override with Custom Gemini API Key (Optional)
            </label>
            <input
              type="password"
              value={customKey}
              onChange={(e) => setCustomKeyState(e.target.value)}
              placeholder="Paste your personal Gemini API key here..."
              className="w-full bg-[var(--color-surface-0)] border border-[var(--color-border-primary)] focus:border-[var(--color-brand)] text-xs font-mono rounded-xl px-3.5 py-2.5 text-white placeholder-[var(--color-text-3)] focus:outline-none transition-all"
            />
          </div>

          {/* Test Status Indicator */}
          {testResult.status !== 'idle' && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                testResult.status === 'testing'
                  ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                  : testResult.status === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              }`}
            >
              {testResult.status === 'testing' ? (
                <RotateCw className="w-4 h-4 animate-spin shrink-0 mt-0.5" />
              ) : testResult.status === 'success' ? (
                <Check className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <div className="leading-relaxed">
                <p className="font-semibold capitalize">{testResult.status}</p>
                <p className="text-[11px] mt-0.5 opacity-90">{testResult.message}</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--color-border-primary)] bg-[var(--color-surface-2)]">
          <button
            type="button"
            onClick={handleTestKey}
            disabled={testResult.status === 'testing'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[var(--color-text-2)] hover:text-white hover:bg-[var(--color-hover)] border border-[var(--color-border-primary)] transition-all"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span>Test API Connection</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-[var(--color-text-2)] hover:text-white transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-gradient-to-r from-[var(--color-brand)] to-purple-600 text-white shadow-md hover:opacity-90 transition-all"
            >
              Save Configuration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
