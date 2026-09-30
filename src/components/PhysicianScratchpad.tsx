import React, { useState } from 'react';
import { CheckSquare, Square, StickyNote, ShieldCheck, Plus, Trash2 } from 'lucide-react';

interface PhysicianScratchpadProps {
  doctorName: string;
}

export const PhysicianScratchpad: React.FC<PhysicianScratchpadProps> = ({
  doctorName,
}) => {
  const [notes, setNotes] = useState<string>(
    '• Ordered Basic Metabolic Panel (BMP) for 4 weeks post-Losartan initiation.\n• Instructed patient on twice-daily home blood pressure logging.\n• Scheduled 6-week outpatient clinical cardiology review.'
  );

  const [checklist, setChecklist] = useState([
    { id: 'c1', label: 'Bilingual translation accuracy verified', checked: true },
    { id: 'c2', label: 'Drug-drug contraindication reviewed (No NSAIDs)', checked: true },
    { id: 'c3', label: 'ICD-10 diagnostic coding substantiated', checked: true },
    { id: 'c4', label: 'Patient take-home leaflet generated in native language', checked: true },
  ]);

  const toggleCheck = (id: string) => {
    setChecklist(
      checklist.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-3.5 flex flex-col gap-3 text-xs">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <StickyNote className="w-3.5 h-3.5 text-slate-500" />
          <span className="font-semibold text-slate-900 dark:text-white">
            Physician Clinical Scratchpad &amp; Verification
          </span>
        </div>
        <span className="text-[10px] text-slate-400 font-mono">
          Private Attending Memo
        </span>
      </div>

      {/* Verification Checklist */}
      <div className="flex flex-col gap-1.5 bg-slate-50 dark:bg-slate-850 p-2.5 rounded border border-slate-100 dark:border-slate-800">
        <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider mb-0.5">
          Encounter Quality Checklist
        </span>
        {checklist.map((item) => (
          <label
            key={item.id}
            onClick={() => toggleCheck(item.id)}
            className="flex items-center gap-2 text-[11px] cursor-pointer text-slate-700 dark:text-slate-300 select-none hover:text-slate-900"
          >
            {item.checked ? (
              <CheckSquare className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            ) : (
              <Square className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
            <span className={item.checked ? 'text-slate-900 dark:text-white font-medium' : ''}>
              {item.label}
            </span>
          </label>
        ))}
      </div>

      {/* Scratchpad Textarea */}
      <div>
        <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-1">
          Follow-up Directives &amp; Clinical Notes
        </label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Type private physician directives..."
          className="w-full p-2 text-xs font-mono rounded border border-slate-200 dark:border-slate-750 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 outline-none leading-relaxed"
        />
      </div>
    </div>
  );
};
