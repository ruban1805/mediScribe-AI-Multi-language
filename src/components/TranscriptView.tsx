import React, { useState } from 'react';
import {
  Search,
  Edit2,
  Check,
  Plus,
  Trash2,
  Loader2,
  FileCheck2,
  ArrowRight,
  Volume2
} from 'lucide-react';
import { TranscriptTurn, MedicalEntity } from '../types/clinical';

interface TranscriptViewProps {
  transcript: TranscriptTurn[];
  activeTurnId?: string | null;
  onUpdateTranscript: (newTranscript: TranscriptTurn[]) => void;
  onGenerateNotes: () => void;
  isGeneratingNotes: boolean;
  hasGeneratedNotes: boolean;
}

export const TranscriptView: React.FC<TranscriptViewProps> = ({
  transcript,
  activeTurnId,
  onUpdateTranscript,
  onGenerateNotes,
  isGeneratingNotes,
  hasGeneratedNotes,
}) => {
  const [showTranslations, setShowTranslations] = useState(true);
  const [highlightEntities, setHighlightEntities] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [speakerFilter, setSpeakerFilter] = useState<'All' | 'Doctor' | 'Patient'>('All');
  const [editingTurnId, setEditingTurnId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const filteredTranscript = transcript.filter((turn) => {
    const matchesSpeaker = speakerFilter === 'All' || turn.speaker === speakerFilter;
    const matchesQuery =
      searchQuery === '' ||
      turn.originalText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (turn.englishTranslation &&
        turn.englishTranslation.toLowerCase().includes(searchQuery.toLowerCase())) ||
      turn.languageLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpeaker && matchesQuery;
  });

  const handleStartEdit = (turn: TranscriptTurn) => {
    setEditingTurnId(turn.id);
    setEditingText(turn.originalText);
  };

  const handleSaveEdit = (turnId: string) => {
    const updated = transcript.map((t) =>
      t.id === turnId ? { ...t, originalText: editingText } : t
    );
    onUpdateTranscript(updated);
    setEditingTurnId(null);
  };

  const handleDeleteTurn = (turnId: string) => {
    const updated = transcript.filter((t) => t.id !== turnId);
    onUpdateTranscript(updated);
  };

  const handleAddTurn = () => {
    const newTurn: TranscriptTurn = {
      id: `turn-${Date.now()}`,
      speaker: 'Doctor',
      speakerName: 'Doctor',
      originalText: 'Clinical observation or instruction...',
      language: 'en',
      languageLabel: 'English',
      englishTranslation: 'Clinical observation or instruction...',
      timestamp: '00:00',
    };
    onUpdateTranscript([...transcript, newTurn]);
    setEditingTurnId(newTurn.id);
    setEditingText(newTurn.originalText);
  };

  // Speak single utterance aloud using browser speech synthesis
  const handleSpeakTurn = (turn: TranscriptTurn) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(turn.originalText);
      if (turn.language === 'es') utterance.lang = 'es-ES';
      else if (turn.language === 'hi') utterance.lang = 'hi-IN';
      else if (turn.language === 'fr') utterance.lang = 'fr-FR';
      else if (turn.language === 'zh') utterance.lang = 'zh-CN';
      else if (turn.language === 'ar') utterance.lang = 'ar-SA';
      else utterance.lang = 'en-US';

      if (turn.speaker === 'Doctor') utterance.pitch = 0.95;
      else utterance.pitch = 1.15;

      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col h-full min-h-[480px]">
      {/* Header & Controls */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-2">
          {/* Unboxed Title & Metadata */}
          <div className="flex items-center gap-2 text-xs">
            <h2 className="font-semibold text-sm text-slate-900 dark:text-white">
              Consultation Dialogue
            </h2>
            <span aria-hidden="true" className="text-slate-400">·</span>
            <span className="text-slate-500 font-mono tabular-nums">{transcript.length} utterances</span>
          </div>

          {/* Toggle Controls */}
          <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
            <button
              onClick={() => setShowTranslations(!showTranslations)}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors ${
                showTranslations ? 'font-semibold text-teal-700 dark:text-teal-400' : ''
              }`}
            >
              Translation: {showTranslations ? 'On' : 'Off'}
            </button>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <button
              onClick={() => setHighlightEntities(!highlightEntities)}
              className={`hover:text-slate-900 dark:hover:text-white transition-colors ${
                highlightEntities ? 'font-semibold text-teal-700 dark:text-teal-400' : ''
              }`}
            >
              Clinical Tags: {highlightEntities ? 'On' : 'Off'}
            </button>
          </div>
        </div>

        {/* Search & Speaker Filter */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by symptom, medicine, or phrase..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 outline-none"
            />
          </div>

          <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded p-0.5 text-xs font-medium">
            {(['All', 'Doctor', 'Patient'] as const).map((spk) => (
              <button
                key={spk}
                onClick={() => setSpeakerFilter(spk)}
                className={`px-2 py-1 rounded text-[11px] transition-colors ${
                  speakerFilter === spk
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {spk}
              </button>
            ))}
          </div>

          <button
            onClick={handleAddTurn}
            title="Add utterance manually"
            className="p-1.5 rounded border border-slate-300 dark:border-slate-700 text-slate-600 hover:bg-slate-100 text-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Utterance Stream */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 max-h-[520px]">
        {filteredTranscript.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center text-slate-400 my-auto">
            <p className="font-medium text-xs text-slate-600 dark:text-slate-400">
              No consultation speech recorded
            </p>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">
              Record microphone speech, upload audio, or paste dialogue above to populate the clinical encounter transcript.
            </p>
          </div>
        ) : (
          filteredTranscript.map((turn) => {
            const isDoctor = turn.speaker === 'Doctor';
            const isEditing = editingTurnId === turn.id;
            const isCurrentPlaying = activeTurnId === turn.id;

            return (
              <div
                key={turn.id}
                className={`p-3 rounded border text-xs flex flex-col gap-1.5 transition-all ${
                  isCurrentPlaying
                    ? 'border-teal-500 ring-2 ring-teal-500/20 bg-teal-50/50 dark:bg-teal-950/30'
                    : isDoctor
                    ? 'border-l-3 border-l-slate-700 bg-slate-50/60 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800'
                    : 'border-l-3 border-l-teal-600 bg-teal-50/30 dark:bg-teal-950/15 border-slate-200 dark:border-slate-800'
                }`}
              >
                {/* Speaker & Metadata */}
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {turn.speakerName || turn.speaker}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-slate-500">{turn.languageLabel}</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="font-mono text-slate-400 tabular-nums">{turn.timestamp}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Speak turn button */}
                    <button
                      onClick={() => handleSpeakTurn(turn)}
                      className="p-1 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                      title="Listen to this utterance"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>

                    {isEditing ? (
                      <button
                        onClick={() => handleSaveEdit(turn.id)}
                        className="p-1 text-teal-700 hover:bg-teal-50 rounded"
                      >
                        <Check className="w-3 h-3" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStartEdit(turn)}
                        className="p-1 text-slate-400 hover:text-slate-600 rounded"
                        title="Edit text"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteTurn(turn.id)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Turn Text */}
                {isEditing ? (
                  <textarea
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    rows={2}
                    className="w-full p-2 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none"
                  />
                ) : (
                  <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-normal">
                    {turn.originalText}
                  </p>
                )}

                {/* Parallel English Translation */}
                {showTranslations &&
                  turn.englishTranslation &&
                  turn.englishTranslation !== turn.originalText && (
                    <div className="pt-1 border-t border-slate-200/60 dark:border-slate-800/60 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-1.5">
                      <span className="font-semibold text-slate-500 uppercase text-[9px] shrink-0 tracking-wider">
                        EN:
                      </span>
                      <span>{turn.englishTranslation}</span>
                    </div>
                  )}

                {/* Clinical Entity Highlights */}
                {highlightEntities && turn.entities && turn.entities.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px] text-slate-500">
                    <span className="font-semibold text-slate-400">Clinical Entities:</span>
                    {turn.entities.map((ent, idx) => (
                      <span
                        key={idx}
                        className="border-b border-teal-600/60 text-slate-700 dark:text-slate-300"
                        title={ent.category}
                      >
                        {ent.text}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex items-center justify-between gap-3 text-xs">
        <span className="text-slate-500 text-[11px]">
          Ready to extract diagnostic codes &amp; prescriptions
        </span>

        <button
          onClick={onGenerateNotes}
          disabled={transcript.length === 0 || isGeneratingNotes}
          className={`flex items-center gap-1.5 px-4 py-2 rounded text-xs font-semibold transition-colors whitespace-nowrap ${
            transcript.length === 0
              ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              : 'bg-slate-900 hover:bg-slate-800 text-white dark:bg-teal-600 dark:hover:bg-teal-500 shadow-xs'
          }`}
        >
          {isGeneratingNotes ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing Encounter...</span>
            </>
          ) : hasGeneratedNotes ? (
            <>
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Update Clinical Chart</span>
            </>
          ) : (
            <>
              <span>Generate Clinical Chart</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
