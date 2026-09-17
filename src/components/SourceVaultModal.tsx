import { useState, useEffect } from 'react';
import { Mic, FileText, X } from 'lucide-react';
import { api, type EmailThreadDto } from '../services/api';

interface SourceVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SourceVaultModal({ isOpen, onClose }: SourceVaultModalProps) {
  const [activeTab, setActiveTab] = useState<'emails' | 'voicenotes' | 'sync'>('emails');
  const [emailThreads, setEmailThreads] = useState<EmailThreadDto[]>([]);
  const [selectedThreadId, setSelectedThreadId] = useState<number>(1);
  const [voiceNotes, setVoiceNotes] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      api.getEmailThreads().then(setEmailThreads).catch(console.error);
      api.getVoiceNotes().then(setVoiceNotes).catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentThread = emailThreads.find((t) => t.id === selectedThreadId) || emailThreads[0];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-[var(--color-surface-1)] border border-[var(--color-border-primary)] rounded-2xl w-full max-w-5xl h-[85vh] shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border-primary)] bg-[var(--color-surface-2)] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-brand)]/20 text-[var(--color-brand-light)] flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Source Intelligence Vault</h3>
              <p className="text-xs text-[var(--color-text-3)]">
                Direct access to ground-truth emails, voice notes, and meeting transcripts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Tabs */}
            <div className="flex items-center bg-[var(--color-surface-3)] p-1 rounded-xl border border-[var(--color-border-primary)]">
              <button
                onClick={() => setActiveTab('emails')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'emails' ? 'bg-[var(--color-brand)] text-white shadow-sm' : 'text-[var(--color-text-2)] hover:text-white'
                }`}
              >
                Emails (5)
              </button>
              <button
                onClick={() => setActiveTab('voicenotes')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'voicenotes' ? 'bg-[var(--color-brand)] text-white shadow-sm' : 'text-[var(--color-text-2)] hover:text-white'
                }`}
              >
                Voice Notes (2)
              </button>
              <button
                onClick={() => setActiveTab('sync')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'sync' ? 'bg-[var(--color-brand)] text-white shadow-sm' : 'text-[var(--color-text-2)] hover:text-white'
                }`}
              >
                Leadership Sync
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-[var(--color-text-3)] hover:text-white hover:bg-[var(--color-hover)] ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {/* TAB 1: EMAILS */}
          {activeTab === 'emails' && (
            <div className="grid grid-cols-1 md:grid-cols-12 h-full">
              {/* Left Column: Thread List */}
              <div className="md:col-span-4 border-r border-[var(--color-border-primary)] overflow-y-auto p-3 space-y-2 bg-[var(--color-surface-0)]/50">
                {emailThreads.map((th) => (
                  <button
                    key={th.id}
                    onClick={() => setSelectedThreadId(th.id)}
                    className={`w-full p-3 rounded-xl border text-left transition-all ${
                      th.id === currentThread?.id
                        ? 'bg-[var(--color-brand)]/15 border-[var(--color-brand)]/40 text-white'
                        : 'bg-[var(--color-surface-2)]/60 border-[var(--color-border-primary)] text-[var(--color-text-2)] hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-bold">
                      <span className="truncate">{th.subject}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--color-surface-3)]">
                        {th.messages?.length || 5}
                      </span>
                    </div>
                    <p className="text-[11px] text-[var(--color-text-3)] mt-1 line-clamp-2">
                      {th.statusSummary}
                    </p>
                  </button>
                ))}
              </div>

              {/* Right Column: Messages Stream */}
              <div className="md:col-span-8 overflow-y-auto p-5 space-y-4">
                {currentThread ? (
                  <>
                    <div className="border-b border-[var(--color-border-primary)] pb-3">
                      <h4 className="text-base font-bold text-white">{currentThread.subject}</h4>
                      <p className="text-xs text-[var(--color-text-2)] mt-0.5">{currentThread.statusSummary}</p>
                    </div>

                    <div className="space-y-3">
                      {currentThread.messages?.map((msg) => (
                        <div
                          key={msg.id}
                          className="p-4 rounded-xl bg-[var(--color-surface-2)] border border-[var(--color-border-primary)] text-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-white">{msg.senderRaw || msg.sender?.name}</span>
                            <span className="text-[var(--color-text-3)]">{msg.timestamp}</span>
                          </div>
                          <p className="text-[var(--color-text-1)] leading-relaxed">{msg.body}</p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-[var(--color-text-3)]">Select a thread</p>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: VOICE NOTES */}
          {activeTab === 'voicenotes' && (
            <div className="p-6 overflow-y-auto h-full space-y-4">
              {voiceNotes.map((vn) => (
                <div
                  key={vn.id}
                  className="p-5 rounded-2xl bg-[var(--color-surface-2)] border border-[var(--color-border-primary)] space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mic className="w-4 h-4 text-amber-400" />
                      <span className="text-sm font-bold text-white">Voice Note #{vn.noteNumber}</span>
                      <span className="text-xs text-[var(--color-text-3)]">({vn.context})</span>
                    </div>
                    <span className="text-xs text-[var(--color-text-3)]">{vn.timestamp}</span>
                  </div>

                  <div className="p-4 rounded-xl bg-[var(--color-surface-0)] border border-[var(--color-border-primary)] text-xs text-[var(--color-text-1)] italic leading-relaxed">
                    "{vn.transcript}"
                  </div>

                  <div className="text-xs text-[var(--color-text-2)]">
                    <span className="font-bold text-white">Extracted Action Items: </span>
                    {vn.extractedCommitments}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: LEADERSHIP SYNC */}
          {activeTab === 'sync' && (
            <div className="p-6 overflow-y-auto h-full space-y-4">
              <div className="border-b border-[var(--color-border-primary)] pb-3">
                <h4 className="text-base font-bold text-white">Monday Leadership Sync (Verbatim Transcript)</h4>
                <p className="text-xs text-[var(--color-text-3)]">Monday 21 September 2026, 9:00–9:35 AM • Attendees: Arjun, Neha, Raghav, Divya</p>
              </div>

              <div className="p-4 rounded-xl bg-[var(--color-surface-0)] border border-[var(--color-border-primary)] text-xs space-y-3 font-mono text-[var(--color-text-1)] leading-relaxed">
                <p><strong className="text-white">Arjun:</strong> Morning everyone. Let’s do a quick pass on key deliverables for the week. Neha, where are we on the Q3 campaign deck?</p>
                <p><strong className="text-cyan-300">Neha:</strong> Almost done with the preliminary slides. I should have a draft ready for you to review by Wednesday afternoon.</p>
                <p><strong className="text-white">Arjun:</strong> Wednesday afternoon works. Make sure the partner channel projections are broken out separately — that’s the main thing leadership will probe on.</p>
                <p><strong className="text-cyan-300">Neha:</strong> Will do. If the data team takes longer with the pull, realistically Thursday morning is safer. But I’ll aim for Wednesday.</p>
                <p><strong className="text-white">Arjun:</strong> Noted. Keep me posted.</p>
                <p><strong className="text-emerald-300">Raghav:</strong> On my end, I need the updated vendor list for the logistics RFP. Arjun, you mentioned you’d have that over to me by end of day yesterday?</p>
                <p><strong className="text-white">Arjun:</strong> Got tied up with the Meridian escalation. I told Raghav I’d send him the updated vendor list. I’ll get that to him by end of day tomorrow.</p>
                <p><strong className="text-emerald-300">Raghav:</strong> Sounds good, that still gives me enough buffer before the RFP deadline next week. Also, quick flag: the Mumbai office lease renewal paperwork came through. Someone needs to review and sign off by end of this week, Friday 25th.</p>
                <p><strong className="text-purple-300">Divya:</strong> Does that fall under Facilities or does someone from leadership need to countersign?</p>
                <p><strong className="text-emerald-300">Raghav:</strong> Usually Facilities handles it, but there’s a commercial clause this time because we expanded the floor space. Someone with signature authority has to sign off.</p>
                <p><strong className="text-white">Arjun:</strong> Okay, flag it, don’t assume. Let’s confirm who owns that before Friday. Divya, finance updates?</p>
                <p><strong className="text-purple-300">Divya:</strong> July variance numbers are mostly reconciled. I’m putting together the summary sheet. I have us scheduled for board prep Thursday morning at 9, so I’ll have everything in your hands before then.</p>
                <p><strong className="text-white">Arjun:</strong> Great. Send it through as soon as it’s ready so I can review before we sit down.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
