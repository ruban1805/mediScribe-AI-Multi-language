export type SpeakerType = 'Doctor' | 'Patient' | 'Caregiver' | 'Other';

export interface MedicalEntity {
  text: string;
  category: 'symptom' | 'medication' | 'vital' | 'anatomy' | 'diagnosis';
}

export interface TranscriptTurn {
  id: string;
  speaker: SpeakerType;
  speakerName?: string;
  originalText: string;
  language: string; // e.g., 'es', 'en', 'hi', 'fr'
  languageLabel: string; // e.g., 'Spanish', 'English'
  englishTranslation?: string;
  timestamp: string;
  entities?: MedicalEntity[];
}

export interface PatientDetails {
  name: string;
  age: string;
  gender: string;
  mrn: string;
  visitDate: string;
  visitType: string;
  primaryLanguage: string;
  doctorName: string;
  specialty: string;
}

export interface Prescription {
  drugName: string;
  dosage: string;
  route: string;
  frequency: string;
  duration: string;
  instructions: string;
  isNewOrModified: boolean;
  warnings?: string;
}

export interface ClinicalNote {
  patientInfo: PatientDetails;
  chiefComplaint: string;
  historyOfPresentIllness: {
    narrative: string;
    onset: string;
    duration: string;
    severity: string;
    associatedSymptoms: string[];
    relievingAggravatingFactors: string;
  };
  pastMedicalHistory: string[];
  currentMedications: string[];
  allergies: string[];
  doctorObservations: {
    generalAppearance: string;
    vitals: {
      bloodPressure: string;
      heartRate: string;
      temperature: string;
      respiratoryRate: string;
      oxygenSaturation: string;
      bmi: string;
    };
    physicalExam: { system: string; findings: string }[];
  };
  assessment: {
    primaryDiagnosis: string;
    icd10Code: string;
    differentialDiagnoses: { diagnosis: string; icd10: string; likelihood: string }[];
    clinicalImpression: string;
  };
  plan: {
    prescriptions: Prescription[];
    diagnosticTests: string[];
    lifestyleAndDiet: string[];
    referrals: string[];
  };
  safetyAlerts: {
    allergyAlerts: string[];
    drugInteractions: string[];
    redFlags: string[];
  };
  patientInstructions: {
    english: {
      summary: string;
      keyActions: string[];
      medicationGuide: string[];
      redFlagsWhenToSeekER: string[];
      followUp: string;
    };
    patientNativeLanguage: {
      language: string;
      summary: string;
      keyActions: string[];
      medicationGuide: string[];
      redFlagsWhenToSeekER: string[];
      followUp: string;
    };
  };
}

export interface ConsultationDemo {
  id: string;
  title: string;
  specialty: string;
  doctorLanguage: string;
  patientLanguage: string;
  patientName: string;
  patientAge: string;
  summary: string;
  transcript: TranscriptTurn[];
  pregeneratedClinicalNote: ClinicalNote;
}

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}
