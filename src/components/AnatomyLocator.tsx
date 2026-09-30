import React from 'react';
import { Activity, ShieldAlert, Heart, Eye } from 'lucide-react';

interface AnatomyLocatorProps {
  specialty: string;
  symptoms: string[];
  activeSystem?: string;
  onSelectSystem?: (system: string) => void;
}

export const AnatomyLocator: React.FC<AnatomyLocatorProps> = ({
  specialty,
  symptoms,
  activeSystem,
  onSelectSystem,
}) => {
  const lowerSymptoms = symptoms.join(' ').toLowerCase();

  // Inferred affected regions
  const isCardio = specialty.toLowerCase().includes('cardio') || lowerSymptoms.includes('pressure') || lowerSymptoms.includes('chest');
  const isLowerExtremity = lowerSymptoms.includes('ankle') || lowerSymptoms.includes('foot') || lowerSymptoms.includes('feet') || lowerSymptoms.includes('tobillo') || lowerSymptoms.includes('plantar');
  const isKnee = lowerSymptoms.includes('knee') || lowerSymptoms.includes('rodilla') || lowerSymptoms.includes('膝盖') || lowerSymptoms.includes('joint');
  const isRespiratory = lowerSymptoms.includes('cough') || lowerSymptoms.includes('lung') || lowerSymptoms.includes('wheez') || lowerSymptoms.includes('asthma') || lowerSymptoms.includes('breath');
  const isNeurological = lowerSymptoms.includes('dizz') || lowerSymptoms.includes('burning') || lowerSymptoms.includes('nerve') || lowerSymptoms.includes('mareo');

  const systems = [
    {
      id: 'cardiovascular',
      name: 'Cardiovascular',
      active: isCardio,
      metric: isCardio ? 'BP 146/90 · HR 72' : 'Nominal',
      location: 'Thoracic / Central',
    },
    {
      id: 'respiratory',
      name: 'Pulmonary / Lungs',
      active: isRespiratory,
      metric: isRespiratory ? 'Bilateral Wheezes' : 'Clear to Auscultation',
      location: 'Thoracic Bilateral',
    },
    {
      id: 'extremities',
      name: 'Peripheral / Ankles',
      active: isLowerExtremity,
      metric: isLowerExtremity ? '2+ Pitting Edema' : 'Distal Pulses Intact',
      location: 'Bilateral Pretibial',
    },
    {
      id: 'musculoskeletal',
      name: 'Joints / Knees',
      active: isKnee,
      metric: isKnee ? 'Medial Crepitus' : 'Normal ROM',
      location: 'Patellofemoral',
    },
    {
      id: 'neurological',
      name: 'Neurological / Sensation',
      active: isNeurological,
      metric: isNeurological ? 'Distal Dysesthesia' : 'Sensory Intact',
      location: 'Plantar / S1 Dermatome',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-3.5 flex flex-col gap-3">
      <div className="flex items-center justify-between text-xs border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span className="font-semibold text-slate-900 dark:text-white">
            Anatomical &amp; Systemic Radar
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">
          Correlated Findings
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
        {/* Vector Anatomical Silhouette (Precision Line Graphic) */}
        <div className="sm:col-span-4 flex items-center justify-center p-2 bg-slate-50 dark:bg-slate-950 rounded border border-slate-100 dark:border-slate-800/80">
          <svg
            viewBox="0 0 100 160"
            className="w-24 h-36 stroke-slate-300 dark:stroke-slate-700 fill-none"
            strokeWidth="1.5"
          >
            {/* Head */}
            <circle cx="50" cy="16" r="10" />
            {/* Neck */}
            <line x1="50" y1="26" x2="50" y2="32" />
            {/* Shoulders & Torso */}
            <path d="M 28 36 L 50 32 L 72 36 L 68 76 L 32 76 Z" />
            {/* Arms */}
            <path d="M 28 36 L 18 64 L 14 90" />
            <path d="M 72 36 L 82 64 L 86 90" />
            {/* Legs */}
            <path d="M 38 76 L 36 114 L 34 148 L 40 152" />
            <path d="M 62 76 L 64 114 L 66 148 L 60 152" />

            {/* Targeted System Highlighters */}
            {isCardio && (
              <circle
                cx="46"
                cy="46"
                r="4.5"
                className="fill-red-500/80 stroke-red-600 animate-pulse"
                strokeWidth="1"
              />
            )}
            {isRespiratory && (
              <>
                <circle cx="42" cy="48" r="3.5" className="fill-cyan-500/80 stroke-cyan-600 animate-pulse" strokeWidth="1" />
                <circle cx="58" cy="48" r="3.5" className="fill-cyan-500/80 stroke-cyan-600 animate-pulse" strokeWidth="1" />
              </>
            )}
            {isKnee && (
              <>
                <circle cx="36" cy="114" r="4" className="fill-amber-500/80 stroke-amber-600 animate-pulse" strokeWidth="1" />
                <circle cx="64" cy="114" r="4" className="fill-amber-500/80 stroke-amber-600 animate-pulse" strokeWidth="1" />
              </>
            )}
            {isLowerExtremity && (
              <>
                <circle cx="34" cy="146" r="3.5" className="fill-teal-500/80 stroke-teal-600 animate-pulse" strokeWidth="1" />
                <circle cx="66" cy="146" r="3.5" className="fill-teal-500/80 stroke-teal-600 animate-pulse" strokeWidth="1" />
              </>
            )}
          </svg>
        </div>

        {/* Systems Metric List */}
        <div className="sm:col-span-8 flex flex-col gap-1.5 text-xs">
          {systems.map((sys) => (
            <div
              key={sys.id}
              onClick={() => onSelectSystem && onSelectSystem(sys.id)}
              className={`p-1.5 px-2.5 rounded border transition-colors flex items-center justify-between cursor-pointer ${
                sys.active
                  ? 'border-teal-500/60 bg-teal-50/40 dark:bg-teal-950/20 text-slate-900 dark:text-white'
                  : 'border-slate-100 dark:border-slate-800 text-slate-500 hover:border-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-1.5 h-1.5 rounded-full ${sys.active ? 'bg-teal-500 animate-ping' : 'bg-slate-300 dark:bg-slate-700'}`} />
                <span className="font-medium text-[11px]">{sys.name}</span>
              </div>

              <div className="flex items-center gap-2 text-[11px]">
                <span className={sys.active ? 'font-semibold text-teal-800 dark:text-teal-300' : 'text-slate-400'}>
                  {sys.metric}
                </span>
                <span className="text-slate-400 font-mono text-[10px]">({sys.location})</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
