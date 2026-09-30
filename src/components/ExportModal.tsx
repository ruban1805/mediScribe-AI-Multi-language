import React, { useState } from 'react';
import {
  X,
  Copy,
  Printer,
  Download,
  Check,
  FileText
} from 'lucide-react';
import { ClinicalNote } from '../types/clinical';
import { formatEhrNote, printClinicalNote, downloadJson } from '../utils/exportHelpers';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  note: ClinicalNote | null;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  note,
}) => {
  const [copied, setCopied] = useState(false);
  const [format, setFormat] = useState<'ehr' | 'json'>('ehr');

  if (!isOpen || !note) return null;

  const ehrText = formatEhrNote(note);

  const handleCopy = () => {
    let contentToCopy = ehrText;
    if (format === 'json') {
      contentToCopy = JSON.stringify(note, null, 2);
    }
    navigator.clipboard.writeText(contentToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const blob = new Blob([ehrText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clinical_record_${note.patientInfo.mrn}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-slate-700 dark:text-slate-300" />
            <div>
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                Export Clinical Record
              </h3>
              <p className="text-xs text-slate-500 font-mono">
                {note.patientInfo.name} · {note.patientInfo.mrn} · {note.patientInfo.visitDate}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Format Selector Bar */}
        <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs bg-slate-50 dark:bg-slate-850">
          <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-slate-800 p-0.5 rounded text-xs">
            <button
              onClick={() => setFormat('ehr')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                format === 'ehr'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Standard EHR Note (SOAP)
            </button>
            <button
              onClick={() => setFormat('json')}
              className={`px-3 py-1 rounded font-medium transition-colors ${
                format === 'json'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Structured JSON (FHIR)
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              onClick={() => printClinicalNote(note)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>

            <button
              onClick={
                format === 'json'
                  ? () => downloadJson(note, `clinical_note_${note.patientInfo.mrn}.json`)
                  : handleDownloadTxt
              }
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>
          </div>
        </div>

        {/* Note Preview Box (Monospace Tabular EHR Terminal) */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-950 font-mono text-xs leading-relaxed text-slate-200">
          <pre className="whitespace-pre-wrap">
            {format === 'json' ? JSON.stringify(note, null, 2) : ehrText}
          </pre>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Formatted for direct import into Epic, Cerner, and AthenaHealth</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
