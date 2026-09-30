import { ClinicalNote } from '../types/clinical';

export type ClinicalFormatType =
  | 'soap'
  | 'brief'
  | 'referral-letter'
  | 'patient-friendly'
  | 'handoff';

export type NoteComplexity = 'standard' | 'detailed' | 'simplified';

/**
 * Transforms a ClinicalNote into a Formal Consultation / Referral Letter
 */
export function formatAsReferralLetter(note: ClinicalNote): string {
  const p = note.patientInfo;
  const hpi = note.historyOfPresentIllness;
  const asm = note.assessment;
  const plan = note.plan;

  return `CLINICAL CONSULTATION LETTER
Date: ${p.visitDate}
Re: ${p.name} (DOB / Age: ${p.age}yo ${p.gender})
MRN: ${p.mrn}

Dear Colleague,

Thank you for referring ${p.name} for specialist consultation in ${p.specialty}. I had the pleasure of evaluating this patient today.

HISTORY & CHIEF COMPLAINT:
The patient presented with ${note.chiefComplaint.toLowerCase()}. ${hpi.narrative}

CLINICAL EXAMINATION & OBSERVATIONS:
On examination today, ${obsSummary(note)}. Vital signs recorded: BP ${note.doctorObservations.vitals.bloodPressure || '120/80 mmHg'}, Pulse ${note.doctorObservations.vitals.heartRate || '72 bpm'}, SpO2 ${note.doctorObservations.vitals.oxygenSaturation || '99%'}.

DIAGNOSTIC ASSESSMENT:
1. ${asm.primaryDiagnosis} [ICD-10: ${asm.icd10Code}]
${asm.differentialDiagnoses.map((d) => `   - Differential: ${d.diagnosis} (${d.icd10})`).join('\n')}

Clinical Impression: ${asm.clinicalImpression}

RECOMMENDED MANAGEMENT PLAN:
1. Medications:
${plan.prescriptions.map((rx) => `   - ${rx.drugName} ${rx.dosage} (${rx.route}): ${rx.instructions} [${rx.isNewOrModified ? 'NEW' : 'CONTINUED'}]`).join('\n')}
2. Diagnostic Workup:
${plan.diagnosticTests.map((t) => `   - ${t}`).join('\n') || '   - None ordered at this visit'}
3. Lifestyle & Preventative Measures:
${plan.lifestyleAndDiet.map((l) => `   - ${l}`).join('\n')}

I have requested that ${p.name} follow up in our clinic in ${note.patientInstructions.english.followUp}. We will keep you apprised of their progress. Please feel free to reach out with any questions.

Sincerely,

${p.doctorName}
Department of ${p.specialty}
`;
}

/**
 * Transforms a ClinicalNote into a Brief High-Yield Progress Note
 */
export function formatAsBriefProgressNote(note: ClinicalNote): string {
  const p = note.patientInfo;
  const obs = note.doctorObservations;
  const asm = note.assessment;
  const plan = note.plan;

  return `BRIEF CLINICAL PROGRESS NOTE
Patient: ${p.name} | ${p.age}yo ${p.gender} | ${p.mrn} | Date: ${p.visitDate}
Specialty: ${p.specialty} | Attending: ${p.doctorName}

CC / S: ${note.chiefComplaint} - ${note.historyOfPresentIllness.duration} duration. ${note.historyOfPresentIllness.relievingAggravatingFactors}
O: Alert, no distress. BP: ${obs.vitals.bloodPressure || 'N/A'}, HR: ${obs.vitals.heartRate || 'N/A'}, SpO2: ${obs.vitals.oxygenSaturation || 'N/A'}. ${obs.physicalExam.map((e) => `${e.system}: ${e.findings}`).join('; ')}
A: ${asm.primaryDiagnosis} [${asm.icd10Code}].
P:
${plan.prescriptions.map((r) => `• Rx: ${r.drugName} ${r.dosage} - ${r.instructions}`).join('\n')}
${plan.diagnosticTests.map((t) => `• Lab: ${t}`).join('\n')}
• F/U: ${note.patientInstructions.english.followUp}
`;
}

/**
 * Transforms a ClinicalNote into a Patient-Friendly Layperson Explanation
 */
export function formatAsPatientFriendlySummary(note: ClinicalNote): string {
  const p = note.patientInfo;
  const asm = note.assessment;
  const plan = note.plan;

  return `YOUR VISIT SUMMARY (Plain Language Guide)
Patient: ${p.name} · Date: ${p.visitDate}
Doctor: ${p.doctorName}

WHY YOU CAME IN:
You visited our clinic today because of: ${note.chiefComplaint.toLowerCase()}.

WHAT THE DOCTOR FOUND:
Your doctor examined you and determined that your symptoms are related to: ${asm.primaryDiagnosis}.
In simple terms: ${note.patientInstructions.english.summary}

WHAT YOU NEED TO DO:
${note.patientInstructions.english.keyActions.map((action, i) => `${i + 1}. ${action}`).join('\n')}

YOUR MEDICATIONS:
${plan.prescriptions.map((rx) => `• ${rx.drugName} (${rx.dosage}): ${rx.instructions} - ${rx.isNewOrModified ? 'NEW MEDICINE' : 'KEEP TAKING'}`).join('\n')}

IMPORTANT WARNING SIGNS (Seek emergency medical help if you experience):
${note.patientInstructions.english.redFlagsWhenToSeekER.map((rf) => `⚠️ ${rf}`).join('\n')}

YOUR NEXT APPOINTMENT:
${note.patientInstructions.english.followUp}
`;
}

/**
 * Transforms a ClinicalNote into a Clinical Handoff / Shift Transition Note
 */
export function formatAsHandoffSummary(note: ClinicalNote): string {
  const p = note.patientInfo;
  const asm = note.assessment;
  const plan = note.plan;

  return `CLINICAL HANDOFF (I-PASS FORMAT)
PATIENT: ${p.name} (${p.age}yo ${p.gender}) | MRN: ${p.mrn} | Service: ${p.specialty}
ILLNESS SEVERITY: Stable Outpatient / Monitored

PATIENT SUMMARY:
Patient presented with ${note.chiefComplaint}. History of ${note.pastMedicalHistory.join(', ')}.
Primary problem: ${asm.primaryDiagnosis} (${asm.icd10Code}).

ACTION LIST / PENDING:
${plan.diagnosticTests.map((t) => `[ ] Pending: ${t}`).join('\n') || '[x] No acute pending labs'}
[ ] Medication reconciliation complete: ${plan.prescriptions.length} active prescriptions.
[ ] Follow-up scheduled: ${note.patientInstructions.english.followUp}

SITUATIONAL AWARENESS & CONTINGENCY:
If patient experiences ${note.safetyAlerts.redFlags.join(', ')} -> instruct immediate emergency presentation.
Code Status: Full Code.
Allergies: ${note.allergies.join(', ') || 'NKDA'}.
`;
}

function obsSummary(note: ClinicalNote): string {
  const exam = note.doctorObservations.physicalExam;
  if (!exam.length) return 'physical examination was non-contributory';
  return exam.map((e) => `${e.system.toLowerCase()} examination revealed ${e.findings.toLowerCase()}`).join(', ');
}
