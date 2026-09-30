import React, { useState } from 'react';
import {
  FileText,
  Mail,
  ListFilter,
  UserCheck,
  Share2,
  Copy,
  Check,
  Type,
  PlusCircle,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { ClinicalFormatType } from '../utils/textFormatters';

interface TextOptionsBarProps {
  currentFormat: ClinicalFormatType;
  onChangeFormat: (format: ClinicalFormatType) => void;
  fontScale: 'compact' | 'standard' | 'large';
  onChangeFontScale: (scale: 'compact' | 'standard' | 'large') => void;
  onInsertMacro: (macroText: string) => void;
  onCopyFormattedText: () => void;
  isCopied: boolean;
}

export const TextOptionsBar: React.FC<TextOptionsBarProps> = ({
  currentFormat,
  onChangeFormat,
  fontScale,
  onChangeFontScale,
  onInsertMacro,
  onCopyFormattedText,
  isCopied,
}) => {
  const [macrosOpen, setMacrosOpen] = useState(false);

  const formatOptions: { id: ClinicalFormatType; label: string; icon: any }[] = [
    { id: 'soap', label: 'SOAP Note', icon: FileText },
    { id: 'brief', label: 'Brief Progress', icon: ListFilter },
    { id: 'referral-letter', label: 'Consult Letter', icon: Mail },
    { id: 'patient-friendly', label: 'Patient Friendly', icon: UserCheck },
    { id: 'handoff', label: 'Handoff (I-PASS)', icon: Share2 },
  ];

  const macros = [
    {
      code: '.ros_negative',
      label: 'Review of Systems (All Negative)',
      text: '\nREVIEW OF SYSTEMS:\nConstitutional: No fevers, chills, or unexplained weight changes.\nCardiovascular: No chest pain, palpitations, or orthopnea.\nRespiratory: No acute shortness of breath or hemoptysis.\nGI/GU: No nausea, vomiting, or dysuria.\nNeurological: No focal weakness or syncope.',
    },
    {
      code: '.dash_diet',
      label: 'DASH Diet & Sodium Guidelines',
      text: '\nLIFESTYLE COUNSELING:\nInstructed patient on Dietary Approaches to Stop Hypertension (DASH diet). Restrict dietary sodium to <2,000 mg daily. Increase dietary potassium from fresh vegetables unless contraindicated by renal impairment.',
    },
    {
      code: '.nsaid_warning',
      label: 'NSAID Contraindication Warning',
      text: '\nMEDICATION SAFETY WARNING:\nPatient cautioned strictly against over-the-counter NSAIDs (Ibuprofen, Naproxen, Advil, Aleve) due to potential nephrotoxicity and blunting of antihypertensive therapy.',
    },
    {
      code: '.foot_care',
      label: 'Diabetic Foot Inspection Directives',
      text: '\nPREVENTATIVE FOOT CARE:\nInstructed daily self-inspection of plantar surfaces using a hand mirror for redness, blistering, or calluses. Advised never to walk barefoot and to wear seam-free diabetic footwear.',
    },
  ];

  return (
    <div className="bg-slate-100/70 dark:bg-slate-800/60 p-2 rounded-lg border border-slate-200 dark:border-slate-750 flex flex-wrap items-center justify-between gap-2.5 text-xs">
      {/* Format Selector */}
      <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-0.5 rounded border border-slate-200 dark:border-slate-800 overflow-x-auto">
        {formatOptions.map((opt) => {
          const Icon = opt.icon;
          const isActive = currentFormat === opt.id;
          return (
            <button
              key={opt.id}
              onClick={() => onChangeFormat(opt.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium transition-colors whitespace-nowrap ${
                isActive
                  ? 'bg-slate-900 text-white dark:bg-teal-700 shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Icon className="w-3 h-3" />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>

      {/* Right Controls: Font Scale, Smart Macros & Copy */}
      <div className="flex items-center gap-2">
        {/* Font Scale Options */}
        <div className="flex items-center gap-1 text-[11px] text-slate-500 bg-white dark:bg-slate-900 p-0.5 rounded border border-slate-200 dark:border-slate-800">
          <Type className="w-3 h-3 text-slate-400 ml-1" />
          <button
            onClick={() => onChangeFontScale('compact')}
            className={`px-1.5 py-0.5 rounded ${
              fontScale === 'compact' ? 'bg-slate-200 dark:bg-slate-750 text-slate-900 font-bold' : ''
            }`}
            title="Compact text (11px)"
          >
            A-
          </button>
          <button
            onClick={() => onChangeFontScale('standard')}
            className={`px-1.5 py-0.5 rounded ${
              fontScale === 'standard' ? 'bg-slate-200 dark:bg-slate-750 text-slate-900 font-bold' : ''
            }`}
            title="Standard text (13px)"
          >
            A
          </button>
          <button
            onClick={() => onChangeFontScale('large')}
            className={`px-1.5 py-0.5 rounded ${
              fontScale === 'large' ? 'bg-slate-200 dark:bg-slate-750 text-slate-900 font-bold' : ''
            }`}
            title="Large accessible text (15px)"
          >
            A+
          </button>
        </div>

        {/* Smart Macros (Dot Phrases) Dropdown */}
        <div className="relative">
          <button
            onClick={() => setMacrosOpen(!macrosOpen)}
            onBlur={() => setTimeout(() => setMacrosOpen(false), 200)}
            className="flex items-center gap-1 px-2 py-1 rounded border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-[11px] text-slate-700 dark:text-slate-300 hover:bg-slate-50"
          >
            <PlusCircle className="w-3 h-3 text-teal-600" />
            <span>Insert Phrase</span>
            <ChevronDown className="w-2.5 h-2.5 text-slate-400" />
          </button>

          {macrosOpen && (
            <div className="absolute right-0 mt-1 w-64 bg-white dark:bg-slate-900 rounded-lg shadow-xl border border-slate-200 dark:border-slate-800 py-1 z-50 text-xs">
              <div className="px-2.5 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                Medical Smart Phrases (Dot-Phrases)
              </div>
              {macros.map((m) => (
                <button
                  key={m.code}
                  onMouseDown={() => {
                    onInsertMacro(m.text);
                    setMacrosOpen(false);
                  }}
                  className="w-full text-left px-2.5 py-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 flex flex-col text-[11px]"
                >
                  <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono text-[10px] text-teal-700 dark:text-teal-400">
                    {m.code}
                  </span>
                  <span className="text-slate-500 line-clamp-1">{m.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Copy current formatted text */}
        <button
          onClick={onCopyFormattedText}
          className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-700 dark:hover:bg-slate-600 font-medium text-[11px] transition-colors"
        >
          {isCopied ? <Check className="w-3 h-3 text-teal-400" /> : <Copy className="w-3 h-3" />}
          <span>{isCopied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>
    </div>
  );
};
