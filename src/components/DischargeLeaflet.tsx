import React, { useState } from 'react';
import {
  Volume2,
  Printer,
  Calendar,
  Clock,
  AlertOctagon,
  CheckSquare,
  Languages,
  Pill,
  Sun,
  Sunset,
  Moon
} from 'lucide-react';
import { ClinicalNote, Prescription } from '../types/clinical';

interface DischargeLeafletProps {
  note: ClinicalNote;
  onSynthesizeSpeech: (text: string) => Promise<string | null>;
  isSynthesizing: boolean;
}

export const DischargeLeaflet: React.FC<DischargeLeafletProps> = ({
  note,
  onSynthesizeSpeech,
  isSynthesizing,
}) => {
  const [viewLanguage, setViewLanguage] = useState<'bilingual' | 'native' | 'english'>('bilingual');
  const [isPlayingTts, setIsPlayingTts] = useState(false);

  const p = note.patientInfo;
  const eng = note.patientInstructions.english;
  const nat = note.patientInstructions.patientNativeLanguage;

  const handleSpeak = async (languageType: 'native' | 'english') => {
    const target = languageType === 'native' ? nat : eng;
    const textToSpeak = `${target.summary}. ${target.keyActions.join('. ')}. ${target.followUp}`;
    const base64Audio = await onSynthesizeSpeech(textToSpeak);
    if (base64Audio) {
      const audio = new Audio(`data:audio/wav;base64,${base64Audio}`);
      setIsPlayingTts(true);
      audio.onended = () => setIsPlayingTts(false);
      audio.play().catch((e) => console.warn('Audio play error', e));
    }
  };

  // Helper to categorize medications into time slots
  const morningMeds = note.plan.prescriptions.filter(
    (rx) => rx.frequency.toLowerCase().includes('morning') || rx.frequency.toLowerCase().includes('daily') || rx.frequency.toLowerCase().includes('twice')
  );
  const nightMeds = note.plan.prescriptions.filter(
    (rx) => rx.frequency.toLowerCase().includes('bedtime') || rx.frequency.toLowerCase().includes('night') || rx.frequency.toLowerCase().includes('twice')
  );
  const prnMeds = note.plan.prescriptions.filter(
    (rx) => rx.frequency.toLowerCase().includes('needed') || rx.frequency.toLowerCase().includes('prn') || rx.frequency.toLowerCase().includes('hours')
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-5 flex flex-col gap-5 text-slate-800 dark:text-slate-200">
      {/* Hospital Leaflet Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
            Patient Take-Home Discharge Summary
          </div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
            {p.name} · Discharge Instructions
          </h2>
          <div className="text-xs text-slate-500 mt-0.5">
            <span>Encounter Date: {p.visitDate}</span>
            <span className="mx-1.5 text-slate-300">·</span>
            <span>Attending: {p.doctorName}</span>
            <span className="mx-1.5 text-slate-300">·</span>
            <span>Primary Language: {nat.language}</span>
          </div>
        </div>

        {/* View Switcher & Audio Readout */}
        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded font-medium">
            <button
              onClick={() => setViewLanguage('bilingual')}
              className={`px-2.5 py-1 rounded transition-colors ${
                viewLanguage === 'bilingual' ? 'bg-white dark:bg-slate-700 font-semibold shadow-xs' : 'text-slate-500'
              }`}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setViewLanguage('native')}
              className={`px-2.5 py-1 rounded transition-colors ${
                viewLanguage === 'native' ? 'bg-white dark:bg-slate-700 font-semibold shadow-xs' : 'text-slate-500'
              }`}
            >
              {nat.language}
            </button>
            <button
              onClick={() => setViewLanguage('english')}
              className={`px-2.5 py-1 rounded transition-colors ${
                viewLanguage === 'english' ? 'bg-white dark:bg-slate-700 font-semibold shadow-xs' : 'text-slate-500'
              }`}
            >
              English
            </button>
          </div>

          <button
            onClick={() => handleSpeak('native')}
            disabled={isSynthesizing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-teal-700 hover:bg-teal-800 text-white font-medium transition-colors"
            title="Read instructions aloud in patient's native language"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>{isSynthesizing ? 'Synthesizing...' : `Listen (${nat.language})`}</span>
          </button>
        </div>
      </div>

      {/* Daily Medication Schedule Organizer */}
      <div className="flex flex-col gap-2">
        <span className="text-xs uppercase font-semibold text-slate-500 tracking-wider flex items-center gap-1.5">
          <Pill className="w-3.5 h-3.5 text-teal-600" />
          <span>Daily Medication Organizer</span>
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {/* Morning Slot */}
          <div className="p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-750 pb-1">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>Morning (Breakfast)</span>
            </div>
            {morningMeds.length ? (
              morningMeds.map((rx, i) => (
                <div key={i} className="text-[11px]">
                  <strong className="text-slate-900 dark:text-white">{rx.drugName}</strong> {rx.dosage}
                  <div className="text-slate-500 text-[10px]">{rx.instructions}</div>
                </div>
              ))
            ) : (
              <span className="text-slate-400 text-[11px]">No morning medicines</span>
            )}
          </div>

          {/* Night / Bedtime Slot */}
          <div className="p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-750 pb-1">
              <Moon className="w-3.5 h-3.5 text-indigo-400" />
              <span>Bedtime (Night)</span>
            </div>
            {nightMeds.length ? (
              nightMeds.map((rx, i) => (
                <div key={i} className="text-[11px]">
                  <strong className="text-slate-900 dark:text-white">{rx.drugName}</strong> {rx.dosage}
                  <div className="text-slate-500 text-[10px]">{rx.instructions}</div>
                </div>
              ))
            ) : (
              <span className="text-slate-400 text-[11px]">No bedtime medicines</span>
            )}
          </div>

          {/* As Needed Slot */}
          <div className="p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850 flex flex-col gap-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-750 pb-1">
              <Clock className="w-3.5 h-3.5 text-teal-500" />
              <span>As Needed (PRN)</span>
            </div>
            {prnMeds.length ? (
              prnMeds.map((rx, i) => (
                <div key={i} className="text-[11px]">
                  <strong className="text-slate-900 dark:text-white">{rx.drugName}</strong> {rx.dosage}
                  <div className="text-slate-500 text-[10px]">{rx.instructions}</div>
                </div>
              ))
            ) : (
              <span className="text-slate-400 text-[11px]">No rescue / PRN medicines</span>
            )}
          </div>
        </div>
      </div>

      {/* Bilingual Instruction Cards */}
      <div className={`grid gap-4 ${viewLanguage === 'bilingual' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'}`}>
        {/* Native Language Card */}
        {(viewLanguage === 'bilingual' || viewLanguage === 'native') && (
          <div className="p-4 rounded border border-teal-200 dark:border-teal-900 bg-teal-50/20 dark:bg-teal-950/10 flex flex-col gap-3 text-xs">
            <div className="flex items-center justify-between border-b border-teal-200/60 dark:border-teal-900/60 pb-1.5">
              <span className="font-semibold text-teal-900 dark:text-teal-200">
                {nat.language} — Copia para el Paciente
              </span>
              <span className="text-[10px] text-teal-700 dark:text-teal-400 font-mono">
                Official Translation
              </span>
            </div>

            <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {nat.summary}
            </p>

            <div>
              <span className="font-semibold text-teal-800 dark:text-teal-300 uppercase text-[10px] block mb-1">
                Pasos a Seguir / Key Actions:
              </span>
              <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                {nat.keyActions.map((action, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-teal-600 font-bold">•</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-2.5 rounded bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-900 dark:text-red-200 text-[11px]">
              <strong className="block text-red-700 dark:text-red-300 font-semibold mb-0.5">
                Cuándo Acudir a Urgencias (Red Flags):
              </strong>
              <span>{nat.redFlagsWhenToSeekER.join(' ')}</span>
            </div>

            <div className="text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-teal-200/40">
              <strong>Seguimiento: </strong>{nat.followUp}
            </div>
          </div>
        )}

        {/* English Card */}
        {(viewLanguage === 'bilingual' || viewLanguage === 'english') && (
          <div className="p-4 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col gap-3 text-xs">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-1.5">
              <span className="font-semibold text-slate-900 dark:text-white">
                English Instructions
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Medical Record Copy
              </span>
            </div>

            <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {eng.summary}
            </p>

            <div>
              <span className="font-semibold text-slate-600 dark:text-slate-400 uppercase text-[10px] block mb-1">
                Action Checklist:
              </span>
              <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                {eng.keyActions.map((action, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="text-slate-400 font-bold">•</span>
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-2.5 rounded bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-900 dark:text-red-200 text-[11px]">
              <strong className="block text-red-700 dark:text-red-300 font-semibold mb-0.5">
                When to Seek Emergency Care:
              </strong>
              <span>{eng.redFlagsWhenToSeekER.join(' ')}</span>
            </div>

            <div className="text-[11px] text-slate-600 dark:text-slate-400 pt-1 border-t border-slate-100">
              <strong>Follow-up: </strong>{eng.followUp}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
