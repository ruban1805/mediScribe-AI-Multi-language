/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { AudioInputPanel } from './components/AudioInputPanel';
import { TranscriptView } from './components/TranscriptView';
import { ClinicalNotesView } from './components/ClinicalNotesView';
import { ExportModal } from './components/ExportModal';
import { AnatomyLocator } from './components/AnatomyLocator';
import { AcousticPlayer } from './components/AcousticPlayer';
import { DischargeLeaflet } from './components/DischargeLeaflet';
import { PhysicianScratchpad } from './components/PhysicianScratchpad';
import { TranscriptTurn, ClinicalNote } from './types/clinical';
import { SAMPLE_CONSULTATIONS } from './data/sampleConsultations';
import { parseConsultationDialogueToReport } from './utils/clinicalParser';
import {
  AlertCircle,
  X,
  Printer,
  FileText,
  Activity,
  UserCheck,
  LayoutGrid,
  CheckCircle2,
  ArrowRight,
  Headphones
} from 'lucide-react';
import { printClinicalNote } from './utils/exportHelpers';

export default function App() {
  const initialCase = SAMPLE_CONSULTATIONS[0];

  const [doctorLanguage, setDoctorLanguage] = useState<string>(initialCase.doctorLanguage);
  const [patientLanguage, setPatientLanguage] = useState<string>(initialCase.patientLanguage);
  const [specialty, setSpecialty] = useState<string>(initialCase.specialty);
  const [activeSampleId, setActiveSampleId] = useState<string | undefined>(initialCase.id);

  // View Mode: 'split' | 'report' | 'transcript' | 'leaflet'
  const [workspaceMode, setWorkspaceMode] = useState<'split' | 'report' | 'transcript' | 'leaflet'>('split');
  const [activePlayingTurnId, setActivePlayingTurnId] = useState<string | null>(null);

  const [transcript, setTranscript] = useState<TranscriptTurn[]>(initialCase.transcript);
  const [clinicalNote, setClinicalNote] = useState<ClinicalNote | null>(
    initialCase.pregeneratedClinicalNote
  );

  // Loading & Error states
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  const handleSelectSampleCase = (id: string) => {
    const selected = SAMPLE_CONSULTATIONS.find((c) => c.id === id);
    if (!selected) return;

    setActiveSampleId(selected.id);
    setDoctorLanguage(selected.doctorLanguage);
    setPatientLanguage(selected.patientLanguage);
    setSpecialty(selected.specialty);
    setTranscript(selected.transcript);
    setClinicalNote(selected.pregeneratedClinicalNote);
    setActivePlayingTurnId(null);
    setApiError(null);
  };

  const handleResetConsultation = () => {
    setActiveSampleId(undefined);
    setTranscript([]);
    setClinicalNote(null);
    setActivePlayingTurnId(null);
    setApiError(null);
  };

  const handleGenerateFallbackReport = () => {
    const turnsToUse = transcript.length > 0 ? transcript : initialCase.transcript;
    const report = parseConsultationDialogueToReport(
      turnsToUse,
      specialty,
      'Dr. Michael Vance, MD, FACC',
      'Sofia Hernandez'
    );
    setClinicalNote(report);
    if (transcript.length === 0) {
      setTranscript(turnsToUse);
    }
  };

  const handleRealizeQuickDialogue = async (rawText: string) => {
    setIsTranscribing(true);
    setApiError(null);

    try {
      const response = await fetch('/api/realize-and-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rawText,
          specialty,
          doctorLanguage,
          patientLanguage,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to process consultation.');
      }

      setTranscript(result.data.transcript);
      setClinicalNote(result.data.clinicalNote);
      setActiveSampleId(undefined);
      // Auto-switch to report view so user immediately sees the generated report!
      setWorkspaceMode('report');
    } catch (err: any) {
      console.error('Quick intake error:', err);
      setApiError(err.message || 'Error occurred while realizing dialogue.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const handleTranscribeAudio = async (audioBase64: string, mimeType: string, speechHint?: string) => {
    setIsTranscribing(true);
    setApiError(null);

    try {
      const response = await fetch('/api/transcribe-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioBase64,
          mimeType,
          doctorLanguage,
          patientLanguage,
          specialty,
          speechHint,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to transcribe audio.');
      }

      if (result.data && Array.isArray(result.data.turns)) {
        const newTurns = result.data.turns;
        setTranscript(newTurns);
        setActiveSampleId(undefined);
        await generateNotesFromTurns(newTurns);
      } else {
        throw new Error('Invalid transcription response structure.');
      }
    } catch (err: any) {
      console.error('Transcription error:', err);
      setApiError(err.message || 'Error occurred while transcribing audio.');
    } finally {
      setIsTranscribing(false);
    }
  };

  const generateNotesFromTurns = async (turns: TranscriptTurn[]) => {
    setIsGeneratingNotes(true);
    try {
      const activeCase = SAMPLE_CONSULTATIONS.find((c) => c.id === activeSampleId);
      const doctorName = activeCase?.pregeneratedClinicalNote.patientInfo.doctorName || 'Dr. Attending Physician, MD';
      const patientName = activeCase?.patientName || 'Patient';

      const response = await fetch('/api/generate-clinical-notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          transcript: turns,
          doctorLanguage,
          patientLanguage,
          specialty,
          doctorName,
          patientName,
        }),
      });

      const result = await response.json();
      if (result.success && result.data) {
        setClinicalNote(result.data);
      } else {
        handleGenerateFallbackReport();
      }
    } catch (err) {
      console.warn('Note generation fallback:', err);
      handleGenerateFallbackReport();
    } finally {
      setIsGeneratingNotes(false);
    }
  };

  const handleGenerateClinicalNotes = async () => {
    if (transcript.length === 0) return;
    await generateNotesFromTurns(transcript);
  };

  const handleTranslateInstructions = async (targetLanguage: string) => {
    if (!clinicalNote) return;
    setIsTranslating(true);
    setApiError(null);

    try {
      const sourceText = `${clinicalNote.patientInstructions.english.summary}\n\nActions:\n${clinicalNote.patientInstructions.english.keyActions.join('\n')}\n\nMedications:\n${clinicalNote.patientInstructions.english.medicationGuide.join('\n')}\n\nFollow-up: ${clinicalNote.patientInstructions.english.followUp}`;

      const response = await fetch('/api/translate-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: sourceText,
          targetLanguage,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Translation failed.');
      }

      setClinicalNote({
        ...clinicalNote,
        patientInstructions: {
          ...clinicalNote.patientInstructions,
          patientNativeLanguage: {
            language: targetLanguage,
            summary: result.translatedText.slice(0, 300),
            keyActions: clinicalNote.patientInstructions.english.keyActions,
            medicationGuide: clinicalNote.patientInstructions.english.medicationGuide,
            redFlagsWhenToSeekER: clinicalNote.patientInstructions.english.redFlagsWhenToSeekER,
            followUp: clinicalNote.patientInstructions.english.followUp,
          },
        },
      });
    } catch (err: any) {
      console.error('Translation error:', err);
      setApiError(err.message || 'Translation failed.');
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSynthesizeSpeech = async (text: string): Promise<string | null> => {
    setIsSynthesizing(true);
    setApiError(null);

    try {
      const response = await fetch('/api/synthesize-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voiceName: 'Kore',
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Speech synthesis failed.');
      }

      return result.audioBase64 || null;
    } catch (err: any) {
      console.error('TTS error:', err);
      setApiError(err.message || 'Speech synthesis failed.');
      return null;
    } finally {
      setIsSynthesizing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-teal-700 selection:text-white">
      {/* 3-Zone Top Navigation Bar */}
      <Navbar
        doctorLanguage={doctorLanguage}
        setDoctorLanguage={setDoctorLanguage}
        patientLanguage={patientLanguage}
        setPatientLanguage={setPatientLanguage}
        specialty={specialty}
        setSpecialty={setSpecialty}
        onSelectSampleCase={handleSelectSampleCase}
        onReset={handleResetConsultation}
        onOpenExport={() => setExportModalOpen(true)}
        onPrintReport={() => clinicalNote && printClinicalNote(clinicalNote)}
        onViewReport={() => setWorkspaceMode('report')}
        hasNote={Boolean(clinicalNote)}
        isProcessing={isTranscribing || isGeneratingNotes}
        activePatientName={clinicalNote?.patientInfo.name}
        activeMrn={clinicalNote?.patientInfo.mrn}
      />

      {/* Main Clinical Workstation Viewport */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-6 py-4 flex flex-col gap-4">
        {/* Error notification banner if any */}
        {apiError && (
          <div className="flex items-center justify-between gap-3 p-3 rounded border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-red-800 dark:text-red-200 text-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{apiError}</span>
            </div>
            <button
              onClick={() => setApiError(null)}
              className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900 text-red-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Clear 3-Step Guided Workflow Banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
              1
            </div>
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">
                Audio &amp; Speech Input
              </div>
              <div className="text-[11px] text-slate-500">
                Mic recording, audio file upload, or paste text
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-2 md:pt-0 md:pl-3">
            <div className="w-6 h-6 rounded-full bg-teal-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
              2
            </div>
            <div>
              <div className="font-semibold text-slate-900 dark:text-white">
                Bilingual Diarization
              </div>
              <div className="text-[11px] text-slate-500">
                Doctor ⇄ Patient speech separation &amp; translation
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 border-t md:border-t-0 md:border-l border-slate-200 dark:border-slate-800 pt-2 md:pt-0 md:pl-3">
            <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs shrink-0">
              3
            </div>
            <div>
              <div className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>Verified Clinical Report</span>
                {clinicalNote && <span className="text-emerald-600 font-bold text-[10px]">● READY</span>}
              </div>
              <div className="text-[11px] text-slate-500">
                SOAP progress note, ICD-10 &amp; patient handout
              </div>
            </div>
          </div>
        </div>

        {/* Clinical Viewport Switcher (Unmistakable Dedicated Views) */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-b border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-slate-200/60 dark:bg-slate-800 p-0.5 rounded font-medium text-xs">
              <button
                onClick={() => setWorkspaceMode('split')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
                  workspaceMode === 'split'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>Dual Workspace (Split View)</span>
              </button>

              <button
                onClick={() => setWorkspaceMode('report')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
                  workspaceMode === 'report'
                    ? 'bg-teal-700 text-white font-semibold shadow-xs'
                    : 'text-teal-700 dark:text-teal-400 font-medium hover:text-teal-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Medical Report (Full View)</span>
                {clinicalNote && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
              </button>

              <button
                onClick={() => setWorkspaceMode('transcript')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
                  workspaceMode === 'transcript'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Headphones className="w-3.5 h-3.5" />
                <span>Speech &amp; Dialogue</span>
              </button>

              <button
                onClick={() => setWorkspaceMode('leaflet')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded transition-colors ${
                  workspaceMode === 'leaflet'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white font-semibold shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Patient Take-Home Leaflet</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px] tabular-nums">
            {clinicalNote ? (
              <span className="text-teal-700 dark:text-teal-400 font-medium font-sans">
                ✓ Report Available: {clinicalNote.patientInfo.name} ({clinicalNote.assessment.icd10Code})
              </span>
            ) : (
              <button
                onClick={handleGenerateFallbackReport}
                className="underline text-teal-700 dark:text-teal-400 font-sans font-medium"
              >
                Load Sample Clinical Report &rarr;
              </button>
            )}
          </div>
        </div>

        {/* View Mode 1: Split View (Side-by-Side) */}
        {workspaceMode === 'split' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Column (5 Cols on LG): Audio, Scrubber, Anatomy, Transcript */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <AudioInputPanel
                onTranscribeAudio={handleTranscribeAudio}
                onLoadSample={handleSelectSampleCase}
                onRealizeQuickDialogue={handleRealizeQuickDialogue}
                isTranscribing={isTranscribing}
                activeSampleId={activeSampleId}
              />

              {/* Quick Jump to Report Banner for mobile / small screen users */}
              <button
                onClick={() => setWorkspaceMode('report')}
                className="lg:hidden flex items-center justify-between p-3 rounded bg-teal-700 text-white font-semibold text-xs shadow-xs"
              >
                <span>View Full Clinical Report Directly</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Dual-Channel Synchronized Acoustic Scrubber with Audible Voice */}
              <AcousticPlayer
                turns={transcript}
                activeTurnId={activePlayingTurnId}
                onActiveTurnChange={setActivePlayingTurnId}
                onSeekTurn={(turnId) => setActivePlayingTurnId(turnId)}
              />

              {/* Interactive Anatomical Radar */}
              <AnatomyLocator
                specialty={specialty}
                symptoms={
                  clinicalNote?.historyOfPresentIllness.associatedSymptoms || [
                    'Bilateral ankle swelling',
                    'Dizziness',
                  ]
                }
              />

              {/* Dialogue Transcript */}
              <TranscriptView
                transcript={transcript}
                activeTurnId={activePlayingTurnId}
                onUpdateTranscript={setTranscript}
                onGenerateNotes={handleGenerateClinicalNotes}
                isGeneratingNotes={isGeneratingNotes}
                hasGeneratedNotes={Boolean(clinicalNote)}
              />
            </div>

            {/* Right Column (7 Cols on LG): Hospital Clinical Progress Note & Physician Scratchpad */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <ClinicalNotesView
                note={clinicalNote}
                onUpdateNote={setClinicalNote}
                onTranslateInstructions={handleTranslateInstructions}
                onSynthesizeSpeech={handleSynthesizeSpeech}
                onGenerateReport={handleGenerateFallbackReport}
                isTranslating={isTranslating}
                isSynthesizing={isSynthesizing}
              />

              {/* Physician Quality Scratchpad & Memo */}
              {clinicalNote && (
                <PhysicianScratchpad
                  doctorName={clinicalNote.patientInfo.doctorName}
                />
              )}
            </div>
          </div>
        )}

        {/* View Mode 2: Full-Page Medical Report (Direct Front and Center) */}
        {workspaceMode === 'report' && (
          <div className="max-w-5xl mx-auto w-full flex flex-col gap-4">
            <div className="flex items-center justify-between p-3 bg-teal-50 dark:bg-teal-950/30 rounded border border-teal-200 dark:border-teal-900 text-xs">
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                Viewing Complete Clinical Progress Note &amp; SOAP Documentation
              </span>
              <button
                onClick={() => setWorkspaceMode('split')}
                className="text-teal-700 dark:text-teal-400 font-semibold hover:underline"
              >
                &larr; Return to Dual Workspace
              </button>
            </div>

            <ClinicalNotesView
              note={clinicalNote}
              onUpdateNote={setClinicalNote}
              onTranslateInstructions={handleTranslateInstructions}
              onSynthesizeSpeech={handleSynthesizeSpeech}
              onGenerateReport={handleGenerateFallbackReport}
              isTranslating={isTranslating}
              isSynthesizing={isSynthesizing}
            />

            {clinicalNote && (
              <PhysicianScratchpad
                doctorName={clinicalNote.patientInfo.doctorName}
              />
            )}
          </div>
        )}

        {/* View Mode 3: Dialogue & Speech Only */}
        {workspaceMode === 'transcript' && (
          <div className="max-w-3xl mx-auto w-full flex flex-col gap-4">
            <AcousticPlayer
              turns={transcript}
              activeTurnId={activePlayingTurnId}
              onActiveTurnChange={setActivePlayingTurnId}
              onSeekTurn={(turnId) => setActivePlayingTurnId(turnId)}
            />

            <TranscriptView
              transcript={transcript}
              activeTurnId={activePlayingTurnId}
              onUpdateTranscript={setTranscript}
              onGenerateNotes={handleGenerateClinicalNotes}
              isGeneratingNotes={isGeneratingNotes}
              hasGeneratedNotes={Boolean(clinicalNote)}
            />
          </div>
        )}

        {/* View Mode 4: Dedicated Patient Take-Home Handout & Daily Medicine Schedule */}
        {workspaceMode === 'leaflet' && (
          <div className="max-w-4xl mx-auto w-full py-2">
            {clinicalNote ? (
              <DischargeLeaflet
                note={clinicalNote}
                onSynthesizeSpeech={handleSynthesizeSpeech}
                isSynthesizing={isSynthesizing}
              />
            ) : (
              <div className="p-8 text-center text-slate-500 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-800">
                <p className="mb-3">No active clinical encounter report loaded yet.</p>
                <button
                  onClick={handleGenerateFallbackReport}
                  className="px-4 py-2 rounded bg-teal-700 text-white font-medium text-xs"
                >
                  Load Sample Report &rarr;
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Export / EHR Modal */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        note={clinicalNote}
      />
    </div>
  );
}
