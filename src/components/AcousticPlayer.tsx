import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  FastForward,
  Headphones
} from 'lucide-react';
import { TranscriptTurn } from '../types/clinical';

interface AcousticPlayerProps {
  turns: TranscriptTurn[];
  activeTurnId?: string | null;
  onActiveTurnChange?: (turnId: string | null) => void;
  onSeekTurn?: (turnId: string) => void;
}

export const AcousticPlayer: React.FC<AcousticPlayerProps> = ({
  turns,
  activeTurnId,
  onActiveTurnChange,
  onSeekTurn,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isAudioAvailable, setIsAudioAvailable] = useState(true);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    } else {
      setIsAudioAvailable(false);
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Speak a turn using browser speech synthesis
  const speakTurn = (index: number) => {
    if (!synthRef.current || !turns || turns.length === 0 || index >= turns.length) {
      setIsPlaying(false);
      if (onActiveTurnChange) onActiveTurnChange(null);
      return;
    }

    synthRef.current.cancel(); // Stop any pending utterance

    const turn = turns[index];
    if (onActiveTurnChange) onActiveTurnChange(turn.id);
    setCurrentTurnIndex(index);

    const utterance = new SpeechSynthesisUtterance(turn.originalText);
    utteranceRef.current = utterance;
    utterance.rate = playbackSpeed;

    // Pick appropriate language voice
    if (turn.language === 'es') utterance.lang = 'es-ES';
    else if (turn.language === 'hi') utterance.lang = 'hi-IN';
    else if (turn.language === 'fr') utterance.lang = 'fr-FR';
    else if (turn.language === 'zh') utterance.lang = 'zh-CN';
    else if (turn.language === 'ar') utterance.lang = 'ar-SA';
    else utterance.lang = 'en-US';

    // Different pitch for Doctor vs Patient
    if (turn.speaker === 'Doctor') {
      utterance.pitch = 0.95;
    } else if (turn.speaker === 'Patient') {
      utterance.pitch = 1.15;
    }

    utterance.onend = () => {
      if (index + 1 < turns.length) {
        // Short pause between speakers
        setTimeout(() => {
          speakTurn(index + 1);
        }, 350);
      } else {
        setIsPlaying(false);
        if (onActiveTurnChange) onActiveTurnChange(null);
      }
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      setIsPlaying(false);
      if (onActiveTurnChange) onActiveTurnChange(null);
    };

    synthRef.current.speak(utterance);
  };

  const handleTogglePlay = () => {
    if (!synthRef.current) return;

    if (isPlaying) {
      synthRef.current.cancel();
      setIsPlaying(false);
      if (onActiveTurnChange) onActiveTurnChange(null);
    } else {
      setIsPlaying(true);
      const startIdx = currentTurnIndex < turns.length ? currentTurnIndex : 0;
      speakTurn(startIdx);
    }
  };

  const handleRestart = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    setCurrentTurnIndex(0);
    if (isPlaying) {
      speakTurn(0);
    } else {
      if (onActiveTurnChange) onActiveTurnChange(null);
    }
  };

  const handleSeek = (index: number) => {
    if (index >= 0 && index < turns.length) {
      setCurrentTurnIndex(index);
      const turn = turns[index];
      if (onSeekTurn) onSeekTurn(turn.id);
      if (isPlaying) {
        speakTurn(index);
      } else {
        if (onActiveTurnChange) onActiveTurnChange(turn.id);
      }
    }
  };

  const currentTurn = turns[currentTurnIndex] || turns[0];
  const progressPercent = turns.length > 0 ? ((currentTurnIndex + 1) / turns.length) * 100 : 0;

  return (
    <div className="bg-slate-950 text-white rounded-lg p-3 border border-slate-800 flex flex-col gap-2.5 font-mono text-xs shadow-xs">
      {/* Top Header */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800/80 pb-1.5">
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${isPlaying ? 'bg-teal-400 animate-ping' : 'bg-slate-600'}`} />
          <span className="font-semibold text-slate-200">
            {isPlaying ? 'Audible Voice Playback Active' : 'Dual-Speaker Acoustic Player'}
          </span>
        </div>

        <div className="flex items-center gap-3 tabular-nums">
          <span className={currentTurn?.speaker === 'Doctor' && isPlaying ? 'text-teal-300 font-bold' : 'text-slate-500'}>
            Physician (EN)
          </span>
          <span>·</span>
          <span className={currentTurn?.speaker === 'Patient' && isPlaying ? 'text-cyan-300 font-bold' : 'text-slate-500'}>
            Patient ({currentTurn?.languageLabel || 'Native'})
          </span>
        </div>
      </div>

      {/* Interactive Waveform Track */}
      <div className="relative h-11 bg-slate-900 rounded border border-slate-800 flex items-center px-1 overflow-hidden select-none">
        {/* Acoustic energy pulses */}
        <div className="absolute inset-0 flex items-center justify-between px-2 opacity-50">
          {Array.from({ length: 44 }).map((_, i) => {
            const isDoctor = i % 2 === 0;
            const h = Math.max(6, Math.sin(i * 0.4) * 26 + (i === currentTurnIndex * 4 && isPlaying ? 16 : 4));
            return (
              <div
                key={i}
                style={{ height: `${h}px` }}
                className={`w-1 rounded-xs transition-all ${
                  isPlaying && i <= (currentTurnIndex / turns.length) * 44
                    ? 'bg-teal-400'
                    : isDoctor
                    ? 'bg-slate-500'
                    : 'bg-teal-700'
                }`}
              />
            );
          })}
        </div>

        {/* Progress Fill */}
        <div
          style={{ width: `${progressPercent}%` }}
          className="absolute left-0 top-0 bottom-0 bg-teal-500/15 border-r-2 border-teal-400 transition-all pointer-events-none"
        />

        {/* Clickable Turn Nodes */}
        {turns.map((t, idx) => {
          const posPct = turns.length > 1 ? (idx / (turns.length - 1)) * 96 + 2 : 50;
          const isSelected = idx === currentTurnIndex;
          return (
            <button
              key={t.id || idx}
              onClick={() => handleSeek(idx)}
              style={{ left: `${posPct}%` }}
              title={`[${t.timestamp}] ${t.speaker}: ${t.originalText.slice(0, 45)}...`}
              className="absolute -top-1 bottom-0 w-2 flex items-center justify-center cursor-pointer group"
            >
              <span
                className={`w-2 h-2 rounded-full transition-transform ${
                  isSelected
                    ? 'bg-teal-400 scale-150 ring-2 ring-teal-400/40'
                    : 'bg-slate-400 group-hover:bg-white group-hover:scale-125'
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Active Utterance Preview Subtitle */}
      {currentTurn && (
        <div className="px-2 py-1 rounded bg-slate-900/80 border border-slate-800 text-[11px] truncate flex items-center gap-2">
          <span className="font-bold text-teal-400 shrink-0">
            {currentTurn.speaker} ({currentTurn.languageLabel}):
          </span>
          <span className="text-slate-300 truncate">
            &ldquo;{currentTurn.originalText}&rdquo;
          </span>
        </div>
      )}

      {/* Control Buttons */}
      <div className="flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={handleTogglePlay}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-teal-600 hover:bg-teal-500 text-white font-medium transition-colors"
            title={isPlaying ? 'Pause conversation voice' : 'Play conversation aloud'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5 fill-white" /> : <Play className="w-3.5 h-3.5 fill-white" />}
            <span>{isPlaying ? 'Pause Voice' : 'Play Voice Aloud'}</span>
          </button>

          <button
            onClick={handleRestart}
            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Restart from beginning"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <div className="tabular-nums text-slate-300 ml-1 text-[11px]">
            <span>Utterance {currentTurnIndex + 1}</span>
            <span className="text-slate-600 mx-1">/</span>
            <span className="text-slate-500">{turns.length}</span>
          </div>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="text-slate-500">Speed:</span>
          {[0.8, 1.0, 1.25].map((spd) => (
            <button
              key={spd}
              onClick={() => setPlaybackSpeed(spd)}
              className={`px-1.5 py-0.5 rounded transition-colors ${
                playbackSpeed === spd
                  ? 'bg-slate-800 text-teal-300 font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {spd}x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
