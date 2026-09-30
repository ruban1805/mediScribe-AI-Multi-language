import React, { useState } from 'react';
import {
  FileText,
  RotateCcw,
  Printer,
  ChevronDown,
  Activity,
  Languages
} from 'lucide-react';
import { SUPPORTED_LANGUAGES, MEDICAL_SPECIALTIES } from '../data/languages';
import { SAMPLE_CONSULTATIONS } from '../data/sampleConsultations';

interface NavbarProps {
  doctorLanguage: string;
  setDoctorLanguage: (lang: string) => void;
  patientLanguage: string;
  setPatientLanguage: (lang: string) => void;
  specialty: string;
  setSpecialty: (spec: string) => void;
  onSelectSampleCase: (id: string) => void;
  onReset: () => void;
  onOpenExport: () => void;
  onPrintReport: () => void;
  onViewReport?: () => void;
  hasNote: boolean;
  isProcessing: boolean;
  activePatientName?: string;
  activeMrn?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  doctorLanguage,
  setDoctorLanguage,
  patientLanguage,
  setPatientLanguage,
  specialty,
  setSpecialty,
  onSelectSampleCase,
  onReset,
  onOpenExport,
  onPrintReport,
  onViewReport,
  hasNote,
  isProcessing,
  activePatientName,
  activeMrn,
}) => {
  const [demosOpen, setDemosOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
      <div className="max-w-[1440px] mx-auto px-6 h-14 flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark (Single Text Element) */}
        <div className="flex items-center gap-4 shrink-0">
          <a
            href="/"
            className="text-base font-bold tracking-tight text-slate-900 dark:text-white hover:text-teal-700 transition-colors whitespace-nowrap"
          >
            MediScribe <span className="font-normal text-slate-400">Clinical Workstation</span>
          </a>

          {/* Active Context Breadcrumb (Unboxed clean metadata with · separator) */}
          {activePatientName && (
            <div className="hidden xl:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pl-4 border-l border-slate-200 dark:border-slate-800">
              <span className="font-semibold text-slate-900 dark:text-slate-200">{activePatientName}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono">{activeMrn || 'MRN-784192'}</span>
              <span aria-hidden="true">·</span>
              <span>{specialty}</span>
            </div>
          )}
        </div>

        {/* Zone 2: Navigation Links & Language Controls (Text Links / Clean Affordances) */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-600 dark:text-slate-300">
          {/* Direct Medical Report Link */}
          {onViewReport && (
            <button
              onClick={onViewReport}
              className="flex items-center gap-1.5 font-semibold text-slate-900 dark:text-white hover:text-teal-700 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-teal-600" />
              <span>Medical Report (SOAP)</span>
              {hasNote && (
                <span className="w-2 h-2 rounded-full bg-emerald-500" title="Report compiled and ready" />
              )}
            </button>
          )}

          {/* Quick Case Demos Selector */}
          <div className="relative">
            <button
              onClick={() => setDemosOpen(!demosOpen)}
              onBlur={() => setTimeout(() => setDemosOpen(false), 200)}
              className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <span>Consultation Demos</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {demosOpen && (
              <div className="absolute left-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 py-1.5 z-50">
                <div className="px-3 py-1 text-[10px] uppercase font-semibold tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-800">
                  Select Bilingual Case
                </div>
                {SAMPLE_CONSULTATIONS.map((demo) => (
                  <button
                    key={demo.id}
                    onMouseDown={() => {
                      onSelectSampleCase(demo.id);
                      setDemosOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/80 flex flex-col gap-0.5 border-b border-slate-100 dark:border-slate-800/50 last:border-0"
                  >
                    <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center justify-between">
                      <span>{demo.patientName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{demo.patientAge}yo</span>
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                      {demo.title}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Specialty & Language Pairing Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              onBlur={() => setTimeout(() => setSettingsOpen(false), 200)}
              className="flex items-center gap-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <span>Languages &amp; Specialty</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {settingsOpen && (
              <div className="absolute left-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-800 p-3 z-50 flex flex-col gap-3">
                <div>
                  <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                    Clinical Specialty
                  </label>
                  <select
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="w-full p-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    {MEDICAL_SPECIALTIES.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                      Physician Spoken
                    </label>
                    <select
                      value={doctorLanguage}
                      onChange={(e) => setDoctorLanguage(e.target.value)}
                      className="w-full p-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      {SUPPORTED_LANGUAGES.filter((l) => l.code !== 'auto').map((lang) => (
                        <option key={`doc-${lang.code}`} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
                      Patient Spoken
                    </label>
                    <select
                      value={patientLanguage}
                      onChange={(e) => setPatientLanguage(e.target.value)}
                      className="w-full p-1.5 text-xs rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      {SUPPORTED_LANGUAGES.map((lang) => (
                        <option key={`pat-${lang.code}`} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Active pairing indicator */}
          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <span>Doc: {doctorLanguage.toUpperCase()}</span>
            <span>/</span>
            <span>Pt: {patientLanguage.toUpperCase()}</span>
          </div>
        </nav>

        {/* Zone 3: Primary Actions (1-2 clean buttons with 2:1 spatial ratio) */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onReset}
            disabled={isProcessing}
            title="Start New Encounter"
            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            New Consultation
          </button>

          <button
            onClick={onPrintReport}
            disabled={!hasNote}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
              hasNote
                ? 'border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                : 'border-slate-200 dark:border-slate-800 text-slate-300 dark:text-slate-700 cursor-not-allowed'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Chart</span>
          </button>

          <button
            onClick={onOpenExport}
            disabled={!hasNote}
            className={`px-4 py-1.5 text-xs font-semibold rounded transition-colors whitespace-nowrap ${
              hasNote
                ? 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-teal-600 dark:hover:bg-teal-500 shadow-xs'
                : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
            }`}
          >
            Export Encounter
          </button>
        </div>
      </div>
    </header>
  );
};
