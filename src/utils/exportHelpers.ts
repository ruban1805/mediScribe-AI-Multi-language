import { ClinicalNote } from '../types/clinical';

export function formatEhrNote(note: ClinicalNote): string {
  const p = note.patientInfo;
  const hpi = note.historyOfPresentIllness;
  const obs = note.doctorObservations;
  const asm = note.assessment;
  const plan = note.plan;

  let text = `=====================================================
CLINICAL ENCOUNTER NOTE - ${p.specialty.toUpperCase()}
=====================================================
PATIENT NAME:    ${p.name}
AGE / GENDER:    ${p.age} / ${p.gender}
MRN:             ${p.mrn}
DATE OF SERVICE: ${p.visitDate}
ENCOUNTER TYPE:  ${p.visitType}
ATTENDING:       ${p.doctorName}
PRIMARY LANG:    ${p.primaryLanguage}

-----------------------------------------------------
1. SUBJECTIVE
-----------------------------------------------------
CHIEF COMPLAINT:
${note.chiefComplaint}

HISTORY OF PRESENT ILLNESS:
${hpi.narrative}

- Onset:    ${hpi.onset}
- Duration: ${hpi.duration}
- Severity: ${hpi.severity}
- Modifying Factors: ${hpi.relievingAggravatingFactors}
- Associated Symptoms: ${hpi.associatedSymptoms.join(', ') || 'None noted'}

PAST MEDICAL HISTORY:
${note.pastMedicalHistory.map((m) => `• ${m}`).join('\n')}

CURRENT MEDICATIONS:
${note.currentMedications.map((m) => `• ${m}`).join('\n')}

ALLERGIES:
${note.allergies.map((a) => `• ${a}`).join('\n') || 'No Known Drug Allergies'}

-----------------------------------------------------
2. OBJECTIVE
-----------------------------------------------------
GENERAL APPEARANCE:
${obs.generalAppearance}

VITAL SIGNS:
- Blood Pressure: ${obs.vitals.bloodPressure || 'N/A'}
- Heart Rate:     ${obs.vitals.heartRate || 'N/A'}
- Temperature:    ${obs.vitals.temperature || 'N/A'}
- Resp Rate:      ${obs.vitals.respiratoryRate || 'N/A'}
- SpO2:           ${obs.vitals.oxygenSaturation || 'N/A'}
- BMI:            ${obs.vitals.bmi || 'N/A'}

PHYSICAL EXAMINATION:
${obs.physicalExam.map((pe) => `• ${pe.system}: ${pe.findings}`).join('\n')}

-----------------------------------------------------
3. ASSESSMENT
-----------------------------------------------------
PRIMARY DIAGNOSIS:
${asm.primaryDiagnosis} [ICD-10: ${asm.icd10Code}]

DIFFERENTIAL DIAGNOSES:
${asm.differentialDiagnoses.map((d) => `• ${d.diagnosis} (${d.icd10}) - Likelihood: ${d.likelihood}`).join('\n')}

CLINICAL IMPRESSION:
${asm.clinicalImpression}

-----------------------------------------------------
4. PLAN & PRESCRIPTIONS
-----------------------------------------------------
PRESCRIPTIONS:
${plan.prescriptions
  .map(
    (rx) =>
      `• ${rx.drugName} ${rx.dosage} (${rx.route})
  Sig: ${rx.instructions} [Freq: ${rx.frequency}]
  Duration: ${rx.duration} | Status: ${rx.isNewOrModified ? 'NEW / MODIFIED' : 'CONTINUED'}${rx.warnings ? `\n  Caution: ${rx.warnings}` : ''}`
  )
  .join('\n\n')}

DIAGNOSTIC ORDERS:
${plan.diagnosticTests.map((t) => `• ${t}`).join('\n') || 'None ordered today'}

LIFESTYLE & EDUCATION:
${plan.lifestyleAndDiet.map((l) => `• ${l}`).join('\n')}

REFERRALS:
${plan.referrals.map((r) => `• ${r}`).join('\n') || 'None required'}

-----------------------------------------------------
5. SAFETY ALERTS & PRECAUTIONS
-----------------------------------------------------
${note.safetyAlerts.allergyAlerts.length ? `ALLERGY FLAGS:\n${note.safetyAlerts.allergyAlerts.map((a) => `[!] ${a}`).join('\n')}\n` : ''}${note.safetyAlerts.drugInteractions.length ? `DRUG INTERACTIONS:\n${note.safetyAlerts.drugInteractions.map((d) => `[!] ${d}`).join('\n')}\n` : ''}${note.safetyAlerts.redFlags.length ? `RED FLAGS:\n${note.safetyAlerts.redFlags.map((r) => `[!] ${r}`).join('\n')}` : ''}

-----------------------------------------------------
6. PATIENT DISCHARGE INSTRUCTIONS
-----------------------------------------------------
[ENGLISH]
Summary: ${note.patientInstructions.english.summary}
Actions:
${note.patientInstructions.english.keyActions.map((a) => `• ${a}`).join('\n')}
Medication Guide:
${note.patientInstructions.english.medicationGuide.map((m) => `• ${m}`).join('\n')}
Emergency Warning Signs:
${note.patientInstructions.english.redFlagsWhenToSeekER.map((w) => `• ${w}`).join('\n')}
Follow-up: ${note.patientInstructions.english.followUp}

[${note.patientInstructions.patientNativeLanguage.language.toUpperCase()}]
Summary: ${note.patientInstructions.patientNativeLanguage.summary}
Actions:
${note.patientInstructions.patientNativeLanguage.keyActions.map((a) => `• ${a}`).join('\n')}
Medication Guide:
${note.patientInstructions.patientNativeLanguage.medicationGuide.map((m) => `• ${m}`).join('\n')}
Emergency Warning Signs:
${note.patientInstructions.patientNativeLanguage.redFlagsWhenToSeekER.map((w) => `• ${w}`).join('\n')}
Follow-up: ${note.patientInstructions.patientNativeLanguage.followUp}

=====================================================
Electronically Signed by: ${p.doctorName}
Timestamp: ${new Date().toISOString()}
Generated via MediScribe AI Multilingual Medical Transcription
`;

  return text;
}

export function downloadJson(data: any, filename = 'clinical_encounter.json'): void {
  const jsonStr = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function printClinicalNote(note: ClinicalNote): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to print the clinical report.');
    return;
  }

  const p = note.patientInfo;
  const hpi = note.historyOfPresentIllness;
  const obs = note.doctorObservations;
  const asm = note.assessment;
  const plan = note.plan;

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Clinical Encounter - ${p.name} (${p.mrn})</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #1e293b; padding: 28px; line-height: 1.5; font-size: 13px; }
    .header { border-bottom: 2px solid #0f766e; padding-bottom: 14px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
    .header h1 { margin: 0 0 4px 0; font-size: 20px; color: #0f766e; }
    .meta-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; background: #f8fafc; padding: 12px; border-radius: 6px; margin-bottom: 18px; border: 1px solid #e2e8f0; }
    .meta-item { font-size: 11px; }
    .meta-label { color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 10px; }
    .meta-val { font-size: 12px; font-weight: 600; color: #0f172a; }
    h2 { font-size: 14px; color: #0f766e; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-top: 18px; text-transform: uppercase; letter-spacing: 0.5px; }
    h3 { font-size: 12px; margin: 8px 0 4px; color: #334155; }
    table { width: 100%; border-collapse: collapse; margin-top: 8px; font-size: 12px; }
    th, td { border: 1px solid #e2e8f0; padding: 6px 8px; text-align: left; }
    th { background: #f1f5f9; font-weight: 600; color: #475569; }
    .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 600; background: #e0f2fe; color: #0369a1; }
    .badge-alert { background: #fee2e2; color: #b91c1c; }
    .bilingual-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 8px; }
    .bilingual-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 10px; }
    ul { margin: 4px 0 10px 18px; padding: 0; }
    li { margin-bottom: 3px; }
    .footer { margin-top: 28px; border-top: 1px dashed #cbd5e1; padding-top: 14px; font-size: 11px; color: #64748b; display: flex; justify-content: space-between; }
    @media print {
      body { padding: 0; }
      @page { margin: 1.5cm; }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1>Clinical Encounter Documentation</h1>
      <div style="font-weight: 600; color: #334155;">Department of ${p.specialty}</div>
    </div>
    <div style="text-align: right; font-size: 11px; color: #64748b;">
      <div>Verified Scribe Record</div>
      <div>Encounter Date: <strong>${p.visitDate}</strong></div>
    </div>
  </div>

  <div class="meta-grid">
    <div class="meta-item"><div class="meta-label">Patient Name</div><div class="meta-val">${p.name}</div></div>
    <div class="meta-item"><div class="meta-label">MRN</div><div class="meta-val">${p.mrn}</div></div>
    <div class="meta-item"><div class="meta-label">Age / Gender</div><div class="meta-val">${p.age} / ${p.gender}</div></div>
    <div class="meta-item"><div class="meta-label">Attending Doctor</div><div class="meta-val">${p.doctorName}</div></div>
    <div class="meta-item"><div class="meta-label">Encounter Type</div><div class="meta-val">${p.visitType}</div></div>
    <div class="meta-item"><div class="meta-label">Primary Language</div><div class="meta-val">${p.primaryLanguage}</div></div>
    <div class="meta-item"><div class="meta-label">Blood Pressure</div><div class="meta-val">${obs.vitals.bloodPressure || 'N/A'}</div></div>
    <div class="meta-item"><div class="meta-label">Heart Rate / SpO2</div><div class="meta-val">${obs.vitals.heartRate || 'N/A'} / ${obs.vitals.oxygenSaturation || 'N/A'}</div></div>
  </div>

  <h2>1. Chief Complaint & History of Present Illness (HPI)</h2>
  <p><strong>Chief Complaint:</strong> ${note.chiefComplaint}</p>
  <p>${hpi.narrative}</p>

  <h2>2. Objective Findings & Physical Examination</h2>
  <p><strong>General Appearance:</strong> ${obs.generalAppearance}</p>
  <table>
    <thead><tr><th style="width: 25%;">System</th><th>Clinical Examination Findings</th></tr></thead>
    <tbody>
      ${obs.physicalExam.map((pe) => `<tr><td><strong>${pe.system}</strong></td><td>${pe.findings}</td></tr>`).join('')}
    </tbody>
  </table>

  <h2>3. Clinical Assessment & Diagnoses</h2>
  <p><strong>Primary Diagnosis:</strong> ${asm.primaryDiagnosis} <span class="badge">ICD-10: ${asm.icd10Code}</span></p>
  <p><strong>Clinical Impression:</strong> ${asm.clinicalImpression}</p>

  <h2>4. Treatment Plan & Medications</h2>
  <table>
    <thead>
      <tr>
        <th>Medication</th>
        <th>Dosage & Route</th>
        <th>Frequency & Sig</th>
        <th>Duration</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${plan.prescriptions
        .map(
          (rx) => `
        <tr>
          <td><strong>${rx.drugName}</strong>${rx.warnings ? `<br><small style="color: #b91c1c;">Caution: ${rx.warnings}</small>` : ''}</td>
          <td>${rx.dosage} (${rx.route})</td>
          <td>${rx.instructions}</td>
          <td>${rx.duration}</td>
          <td><span class="badge ${rx.isNewOrModified ? 'badge-alert' : ''}">${rx.isNewOrModified ? 'New / Changed' : 'Continued'}</span></td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <h2>5. Bilingual Patient Discharge Instructions</h2>
  <div class="bilingual-grid">
    <div class="bilingual-box">
      <h3 style="color: #0f766e;">English</h3>
      <p style="font-size: 11px;">${note.patientInstructions.english.summary}</p>
      <ul>
        ${note.patientInstructions.english.keyActions.map((a) => `<li>${a}</li>`).join('')}
      </ul>
      <p style="font-size: 10px; color: #475569;"><strong>Follow-up:</strong> ${note.patientInstructions.english.followUp}</p>
    </div>
    <div class="bilingual-box">
      <h3 style="color: #0f766e;">${note.patientInstructions.patientNativeLanguage.language}</h3>
      <p style="font-size: 11px;">${note.patientInstructions.patientNativeLanguage.summary}</p>
      <ul>
        ${note.patientInstructions.patientNativeLanguage.keyActions.map((a) => `<li>${a}</li>`).join('')}
      </ul>
      <p style="font-size: 10px; color: #475569;"><strong>Seguimiento / Follow-up:</strong> ${note.patientInstructions.patientNativeLanguage.followUp}</p>
    </div>
  </div>

  <div class="footer">
    <div>Electronically verified & signed: <strong>${p.doctorName}</strong></div>
    <div>Report generated via MediScribe AI • Confidential Medical Record</div>
  </div>

  <script>
    window.onload = function() { window.print(); }
  </script>
</body>
</html>`;

  printWindow.document.write(html);
  printWindow.document.close();
}
