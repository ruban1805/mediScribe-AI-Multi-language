import React, { useState } from 'react';
import {
  FileText,
  Volume2,
  Copy,
  Printer,
  Download,
  Edit3,
  Check,
  AlertTriangle,
  Loader2,
  ShieldCheck,
  Languages
} from 'lucide-react';
import { ClinicalNote } from '../types/clinical';
import { TextOptionsBar } from './TextOptionsBar';
import {
  ClinicalFormatType,
  formatAsReferralLetter,
  formatAsBriefProgressNote,
  formatAsPatientFriendlySummary,
  formatAsHandoffSummary
} from '../utils/textFormatters';
import { formatEhrNote, printClinicalNote, downloadJson } from '../utils/exportHelpers';

interface ClinicalNotesViewProps {
  note: ClinicalNote | null;
  onUpdateNote: (updatedNote: ClinicalNote) => void;
  onTranslateInstructions: (targetLanguage: string) => Promise<void>;
  onSynthesizeSpeech: (text: string) => Promise<string | null>;
  onGenerateReport?: () => void;
  isTranslating: boolean;
  isSynthesizing: boolean;
}

export const ClinicalNotesView: React.FC<ClinicalNotesViewProps> = ({
  note,
  onUpdateNote,
  onTranslateInstructions,
  onSynthesizeSpeech,
  onGenerateReport,
  isTranslating,
  isSynthesizing,
}) => {
  const [activeTab, setActiveTab] = useState<'soap' | 'subjective' | 'objective' | 'assessment' | 'plan' | 'discharge'>('soap');
  const [currentFormat, setCurrentFormat] = useState<ClinicalFormatType>('soap');
  const [fontScale, setFontScale] = useState<'compact' | 'standard' | 'large'>('standard');
  const [isEditing, setIsEditing] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [copiedEhr, setCopiedEhr] = useState(false);
  const [targetTranslateLang, setTargetTranslateLang] = useState('Spanish');

  if (!note) {
    return (
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-8 flex flex-col items-center justify-center min-h-[480px] text-center">
        <FileText className="w-10 h-10 text-teal-600 mb-2" />
        <h3 className="font-semibold text-base text-slate-800 dark:text-slate-200">
          Clinical Encounter Report Awaiting Generation
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1 mb-3">
          The clinical notes and SOAP documentation have not been compiled yet. Click below to generate the full clinical report from the current consultation.
        </p>
        {onGenerateReport && (
          <button
            onClick={onGenerateReport}
            className="flex items-center gap-2 px-5 py-2.5 rounded bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs shadow-sm transition-all"
          >
            <span>Generate Clinical Report Now</span>
          </button>
        )}
      </div>
    );
  }

  // Get active formatted text based on selected option
  const getFormattedContent = (): string => {
    switch (currentFormat) {
      case 'referral-letter':
        return formatAsReferralLetter(note);
      case 'brief':
        return formatAsBriefProgressNote(note);
      case 'patient-friendly':
        return formatAsPatientFriendlySummary(note);
      case 'handoff':
        return formatAsHandoffSummary(note);
      default:
        return formatEhrNote(note);
    }
  };

  const handleCopyFormattedText = () => {
    const text = getFormattedContent();
    navigator.clipboard.writeText(text);
    setCopiedEhr(true);
    setTimeout(() => setCopiedEhr(false), 2000);
  };

  const handleInsertMacro = (macroText: string) => {
    onUpdateNote({
      ...note,
      historyOfPresentIllness: {
        ...note.historyOfPresentIllness,
        narrative: `${note.historyOfPresentIllness.narrative}\n${macroText}`,
      },
    });
  };

  const handleSpeakInstructions = async () => {
    const nativeInst = note.patientInstructions.patientNativeLanguage;
    const textToSpeak = `${nativeInst.summary}. ${nativeInst.keyActions.join('. ')}. ${nativeInst.followUp}`;
    const base64Audio = await onSynthesizeSpeech(textToSpeak);
    if (base64Audio) {
      const audio = new Audio(`data:audio/wav;base64,${base64Audio}`);
      audio.play().catch((e) => console.warn('Audio playback error', e));
    }
  };

  const fontSizeClass = {
    compact: 'text-[11px]',
    standard: 'text-xs',
    large: 'text-sm',
  }[fontScale];

  const p = note.patientInfo;
  const hpi = note.historyOfPresentIllness;
  const obs = note.doctorObservations;
  const asm = note.assessment;
  const plan = note.plan;

  return (
    <div className={`bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-col h-full min-h-[480px] ${fontSizeClass}`}>
      {/* Official Clinical Encounter Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-850">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">
              Clinical Encounter Documentation
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                {p.name}
              </h3>
              <span className="text-slate-400">·</span>
              <span className="font-mono text-xs text-slate-500 tabular-nums">{p.mrn}</span>
              <span className="text-slate-400">·</span>
              <span className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                {p.primaryLanguage}
              </span>
            </div>
            <div className="text-xs text-slate-500 mt-0.5">
              <span>{p.age}yo</span>
              <span className="mx-1.5 text-slate-300">·</span>
              <span>{p.gender}</span>
              <span className="mx-1.5 text-slate-300">·</span>
              <span>{p.visitType}</span>
              <span className="mx-1.5 text-slate-300">·</span>
              <span>{p.doctorName}</span>
            </div>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded border text-xs font-medium transition-colors ${
                isEditing
                  ? 'border-teal-600 bg-teal-50 text-teal-800 dark:bg-teal-950 dark:text-teal-300'
                  : 'border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300'
              }`}
            >
              {isEditing ? <Check className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
              <span>{isEditing ? 'Save Changes' : 'Edit Note'}</span>
            </button>

            <button
              onClick={handleCopyFormattedText}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
              title="Copy active format to clipboard"
            >
              <Copy className="w-3.5 h-3.5 text-slate-500" />
              <span>{copiedEhr ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={() => printClinicalNote(note)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
              title="Print Encounter Sheet"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={() => downloadJson(note, `clinical_note_${p.mrn}.json`)}
              className="p-1.5 rounded border border-slate-300 dark:border-slate-700 text-slate-500 hover:text-slate-800 transition-colors"
              title="Download FHIR / JSON"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Text Multiple Options Toolbar */}
        <div className="mt-3">
          <TextOptionsBar
            currentFormat={currentFormat}
            onChangeFormat={setCurrentFormat}
            fontScale={fontScale}
            onChangeFontScale={setFontScale}
            onInsertMacro={handleInsertMacro}
            onCopyFormattedText={handleCopyFormattedText}
            isCopied={copiedEhr}
          />
        </div>

        {/* Section Navigation Tabs (When in SOAP mode) */}
        {currentFormat === 'soap' && (
          <div className="flex items-center gap-1 mt-3 pt-2 border-t border-slate-200 dark:border-slate-800 text-xs font-medium overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('soap')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                activeTab === 'soap'
                  ? 'bg-slate-900 text-white dark:bg-slate-700 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              All Sections
            </button>
            <button
              onClick={() => setActiveTab('subjective')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                activeTab === 'subjective'
                  ? 'bg-slate-900 text-white dark:bg-slate-700 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              1. Subjective (HPI)
            </button>
            <button
              onClick={() => setActiveTab('objective')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                activeTab === 'objective'
                  ? 'bg-slate-900 text-white dark:bg-slate-700 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              2. Objective &amp; Vitals
            </button>
            <button
              onClick={() => setActiveTab('assessment')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                activeTab === 'assessment'
                  ? 'bg-slate-900 text-white dark:bg-slate-700 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              3. Assessment &amp; ICD-10
            </button>
            <button
              onClick={() => setActiveTab('plan')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap ${
                activeTab === 'plan'
                  ? 'bg-slate-900 text-white dark:bg-slate-700 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              4. Treatment Plan
            </button>
            <button
              onClick={() => setActiveTab('discharge')}
              className={`px-3 py-1.5 rounded transition-colors whitespace-nowrap flex items-center gap-1 ${
                activeTab === 'discharge'
                  ? 'bg-teal-700 text-white font-semibold'
                  : 'text-teal-700 dark:text-teal-400 hover:text-teal-900'
              }`}
            >
              <Languages className="w-3.5 h-3.5" />
              <span>Bilingual Leaflet</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Clinical Content Body */}
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5 max-h-[560px]">
        {/* If user selected an alternative format (Referral Letter, Brief Note, Patient Friendly, Handoff) */}
        {currentFormat !== 'soap' ? (
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="font-semibold uppercase tracking-wider text-[10px]">
                {currentFormat === 'referral-letter' && 'Specialist Referral & Consultation Letter'}
                {currentFormat === 'brief' && 'High-Yield Clinical Progress Note'}
                {currentFormat === 'patient-friendly' && 'Plain Language Patient & Family Visit Guide'}
                {currentFormat === 'handoff' && 'Shift Transition & Handoff Summary (I-PASS)'}
              </span>
              <button
                onClick={handleCopyFormattedText}
                className="text-teal-700 dark:text-teal-400 hover:underline font-medium"
              >
                Copy this formatted document &rarr;
              </button>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-200 whitespace-pre-wrap">
              {getFormattedContent()}
            </div>
          </div>
        ) : (
          /* Standard Structured Interactive SOAP Sections */
          <>
            {/* Safety Alerts */}
            {(note.safetyAlerts.allergyAlerts.length > 0 ||
              note.safetyAlerts.drugInteractions.length > 0 ||
              note.safetyAlerts.redFlags.length > 0) && (
              <div className="p-3 rounded border border-amber-300 dark:border-amber-800 bg-amber-50/50 dark:bg-amber-950/20 text-xs text-amber-900 dark:text-amber-200 flex flex-col gap-1">
                <span className="font-semibold text-amber-900 dark:text-amber-100 uppercase text-[10px] tracking-wider">
                  Clinical Safety Precautions
                </span>
                {note.safetyAlerts.allergyAlerts.map((a, i) => (
                  <div key={i} className="text-red-700 dark:text-red-400 font-medium">
                    • Allergy Flag: {a}
                  </div>
                ))}
                {note.safetyAlerts.drugInteractions.map((d, i) => (
                  <div key={i}>• Interaction Note: {d}</div>
                ))}
                {note.safetyAlerts.redFlags.map((r, i) => (
                  <div key={i}>• Red Flag: {r}</div>
                ))}
              </div>
            )}

            {/* Section 1: Subjective */}
            {(activeTab === 'soap' || activeTab === 'subjective') && (
              <div className="flex flex-col gap-3">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-1.5">
                  <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-500">
                    1. Subjective (History of Present Illness)
                  </h4>
                </div>

                <div>
                  <span className="font-semibold text-slate-500 uppercase text-[10px] block mb-0.5">
                    Chief Complaint
                  </span>
                  {isEditing ? (
                    <input
                      type="text"
                      value={note.chiefComplaint}
                      onChange={(e) =>
                        onUpdateNote({ ...note, chiefComplaint: e.target.value })
                      }
                      className="w-full p-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  ) : (
                    <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">
                      {note.chiefComplaint}
                    </p>
                  )}
                </div>

                <div>
                  <span className="font-semibold text-slate-500 uppercase text-[10px] block mb-0.5">
                    HPI Narrative
                  </span>
                  {isEditing ? (
                    <textarea
                      rows={4}
                      value={hpi.narrative}
                      onChange={(e) =>
                        onUpdateNote({
                          ...note,
                          historyOfPresentIllness: { ...hpi, narrative: e.target.value },
                        })
                      }
                      className="w-full p-2 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 leading-relaxed font-mono"
                    />
                  ) : (
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                      {hpi.narrative}
                    </p>
                  )}
                </div>

                {/* HPI Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2.5 rounded bg-slate-50 dark:bg-slate-800/40 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Onset</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{hpi.onset}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Duration</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{hpi.duration}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Severity</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{hpi.severity}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Modifying Factors</span>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{hpi.relievingAggravatingFactors}</span>
                  </div>
                </div>

                {/* Past Medical History & Allergies */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <span className="font-semibold text-slate-500 uppercase text-[10px] block mb-1">
                      Past Medical History
                    </span>
                    <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                      {note.pastMedicalHistory.map((pmh, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-slate-400">•</span>
                          <span>{pmh}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-500 uppercase text-[10px] block mb-1">
                      Documented Allergies
                    </span>
                    <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                      {note.allergies.length ? (
                        note.allergies.map((alg, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-red-700 dark:text-red-400 font-medium">
                            <span className="text-red-500">•</span>
                            <span>{alg}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-slate-500">No Known Drug Allergies (NKDA)</li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Section 2: Objective & Vitals */}
            {(activeTab === 'soap' || activeTab === 'objective') && (
              <div className="flex flex-col gap-3">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-1.5">
                  <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-500">
                    2. Objective (Observations &amp; Physical Exam)
                  </h4>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 font-mono tabular-nums text-center">
                  <div className="p-2 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-[10px] text-slate-400 font-sans uppercase block">Blood Pressure</span>
                    <span className="font-semibold text-slate-900 dark:text-white text-xs">
                      {obs.vitals.bloodPressure || '120/80'}
                    </span>
                  </div>
                  <div className="p-2 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-[10px] text-slate-400 font-sans uppercase block">Pulse</span>
                    <span className="font-semibold text-slate-900 dark:text-white text-xs">
                      {obs.vitals.heartRate || '72 bpm'}
                    </span>
                  </div>
                  <div className="p-2 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-[10px] text-slate-400 font-sans uppercase block">Temp</span>
                    <span className="font-semibold text-slate-900 dark:text-white text-xs">
                      {obs.vitals.temperature || '36.8 °C'}
                    </span>
                  </div>
                  <div className="p-2 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-[10px] text-slate-400 font-sans uppercase block">Resp Rate</span>
                    <span className="font-semibold text-slate-900 dark:text-white text-xs">
                      {obs.vitals.respiratoryRate || '16 /min'}
                    </span>
                  </div>
                  <div className="p-2 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-[10px] text-slate-400 font-sans uppercase block">SpO2</span>
                    <span className="font-semibold text-slate-900 dark:text-white text-xs">
                      {obs.vitals.oxygenSaturation || '99%'}
                    </span>
                  </div>
                  <div className="p-2 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                    <span className="text-[10px] text-slate-400 font-sans uppercase block">BMI</span>
                    <span className="font-semibold text-slate-900 dark:text-white text-xs">
                      {obs.vitals.bmi || '24.2'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-slate-500 uppercase text-[10px] block mb-0.5">
                    General Appearance
                  </span>
                  <p className="text-slate-700 dark:text-slate-300">
                    {obs.generalAppearance}
                  </p>
                </div>

                <div className="border border-slate-200 dark:border-slate-800 rounded overflow-hidden mt-1">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                        <th className="p-2.5 w-1/4">System</th>
                        <th className="p-2.5">Clinical Examination Findings</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {obs.physicalExam.map((pe, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="p-2.5 font-semibold text-slate-900 dark:text-slate-100">
                            {pe.system}
                          </td>
                          <td className="p-2.5 text-slate-700 dark:text-slate-300">
                            {pe.findings}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Section 3: Assessment & Diagnoses */}
            {(activeTab === 'soap' || activeTab === 'assessment') && (
              <div className="flex flex-col gap-3">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-1.5">
                  <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-500">
                    3. Assessment &amp; Diagnoses
                  </h4>
                </div>

                <div className="p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">
                      Primary Clinical Diagnosis
                    </span>
                    <span className="font-semibold text-slate-900 dark:text-white text-sm">
                      {asm.primaryDiagnosis}
                    </span>
                  </div>
                  <div className="font-mono text-xs font-semibold text-teal-800 dark:text-teal-300 tabular-nums">
                    ICD-10: {asm.icd10Code}
                  </div>
                </div>

                <div>
                  <span className="font-semibold text-slate-500 uppercase text-[10px] block mb-0.5">
                    Clinical Impression &amp; Reasoning
                  </span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {asm.clinicalImpression}
                  </p>
                </div>

                {asm.differentialDiagnoses.length > 0 && (
                  <div className="pt-1">
                    <span className="font-semibold text-slate-500 uppercase text-[10px] block mb-1">
                      Differential Considerations
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {asm.differentialDiagnoses.map((diff, i) => (
                        <div
                          key={i}
                          className="p-2 rounded border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs"
                        >
                          <span className="font-medium text-slate-800 dark:text-slate-200">
                            {diff.diagnosis}
                          </span>
                          <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
                            <span>{diff.icd10}</span>
                            <span>·</span>
                            <span>{diff.likelihood}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Section 4: Treatment Plan & Prescriptions */}
            {(activeTab === 'soap' || activeTab === 'plan') && (
              <div className="flex flex-col gap-3">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-1.5">
                  <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-500">
                    4. Treatment Plan &amp; Prescriptions
                  </h4>
                </div>

                <div className="border border-slate-200 dark:border-slate-800 rounded overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100/70 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                        <th className="p-2.5">Medication &amp; Dosage</th>
                        <th className="p-2.5">Instructions (Sig)</th>
                        <th className="p-2.5">Duration</th>
                        <th className="p-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {plan.prescriptions.map((rx, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="p-2.5">
                            <div className="font-semibold text-slate-900 dark:text-white">
                              {rx.drugName}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {rx.dosage} · {rx.route}
                            </div>
                            {rx.warnings && (
                              <div className="text-[11px] text-amber-700 dark:text-amber-400 mt-0.5">
                                Note: {rx.warnings}
                              </div>
                            )}
                          </td>
                          <td className="p-2.5 text-slate-700 dark:text-slate-300">
                            <div>{rx.instructions}</div>
                            <div className="text-[11px] text-slate-500">
                              Frequency: {rx.frequency}
                            </div>
                          </td>
                          <td className="p-2.5 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                            {rx.duration}
                          </td>
                          <td className="p-2.5 whitespace-nowrap">
                            <span className="font-medium text-slate-600 dark:text-slate-300">
                              {rx.isNewOrModified ? 'New / Titrated' : 'Continued'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div>
                    <span className="font-semibold text-slate-500 uppercase text-[10px] block mb-1">
                      Diagnostic Orders
                    </span>
                    <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                      {plan.diagnosticTests.length ? (
                        plan.diagnosticTests.map((t, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-slate-400">•</span>
                            <span>{t}</span>
                          </li>
                        ))
                      ) : (
                        <li className="text-slate-500">No diagnostic labs ordered</li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-500 uppercase text-[10px] block mb-1">
                      Lifestyle &amp; Referrals
                    </span>
                    <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                      {plan.lifestyleAndDiet.map((diet, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-slate-400">•</span>
                          <span>{diet}</span>
                        </li>
                      ))}
                      {plan.referrals.map((r, i) => (
                        <li key={`ref-${i}`} className="font-medium text-teal-700 dark:text-teal-400">
                          Referral: {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* Section 5: Bilingual Discharge Summary */}
            {(activeTab === 'soap' || activeTab === 'discharge') && (
              <div className="flex flex-col gap-3 pt-2">
                <div className="border-b border-slate-200 dark:border-slate-800 pb-1.5 flex items-center justify-between">
                  <h4 className="font-semibold text-xs uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                    <Languages className="w-3.5 h-3.5" />
                    <span>5. Bilingual Patient Discharge Paperwork</span>
                  </h4>

                  <button
                    onClick={handleSpeakInstructions}
                    disabled={isSynthesizing}
                    className="flex items-center gap-1.5 px-3 py-1 rounded bg-teal-700 hover:bg-teal-800 text-white font-medium text-xs transition-colors"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{isSynthesizing ? 'Synthesizing...' : "Listen in Patient's Language"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col gap-2">
                    <div className="font-semibold text-slate-900 dark:text-white text-xs border-b border-slate-100 dark:border-slate-800 pb-1">
                      English Copy
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 font-medium">
                      {note.patientInstructions.english.summary}
                    </p>
                    <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                      {note.patientInstructions.english.keyActions.map((act, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-slate-400">•</span>
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col gap-2">
                    <div className="font-semibold text-slate-900 dark:text-white text-xs border-b border-slate-100 dark:border-slate-800 pb-1">
                      {note.patientInstructions.patientNativeLanguage.language} Copy
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 font-medium">
                      {note.patientInstructions.patientNativeLanguage.summary}
                    </p>
                    <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                      {note.patientInstructions.patientNativeLanguage.keyActions.map((act, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-slate-400">•</span>
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Physician Verification Block */}
        <div className="p-3 rounded border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex flex-wrap items-center justify-between gap-3 text-xs">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isVerified}
              onChange={(e) => setIsVerified(e.target.checked)}
              className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900 border-slate-300"
            />
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              Verified &amp; Authenticated by Attending Physician
            </span>
          </label>

          <div className="text-[11px] text-slate-400 font-mono">
            {p.doctorName} · {p.visitDate}
          </div>
        </div>
      </div>
    </div>
  );
};
