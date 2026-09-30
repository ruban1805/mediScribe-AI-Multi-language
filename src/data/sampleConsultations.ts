import { ConsultationDemo } from '../types/clinical';

export const SAMPLE_CONSULTATIONS: ConsultationDemo[] = [
  {
    id: 'cardiology-es-en',
    title: 'Hypertension & Dyslipidemia (English & Spanish)',
    specialty: 'Cardiology',
    doctorLanguage: 'en',
    patientLanguage: 'es',
    patientName: 'Sofia Hernandez',
    patientAge: '62',
    summary: 'Follow-up for uncontrolled hypertension, ankle edema from amlodipine, and lipid management.',
    transcript: [
      {
        id: 't-1',
        speaker: 'Doctor',
        speakerName: 'Dr. Michael Vance',
        originalText: 'Good morning, Mrs. Hernandez. How have you been feeling since our last visit three weeks ago?',
        language: 'en',
        languageLabel: 'English',
        englishTranslation: 'Good morning, Mrs. Hernandez. How have you been feeling since our last visit three weeks ago?',
        timestamp: '00:03',
        entities: []
      },
      {
        id: 't-2',
        speaker: 'Patient',
        speakerName: 'Sofia Hernandez',
        originalText: 'Buenos días, doctor. He estado sintiendo bastante hinchazón en los tobillos por las tardes y ligeros mareos al levantarme.',
        language: 'es',
        languageLabel: 'Spanish',
        englishTranslation: 'Good morning, doctor. I have been feeling quite a bit of swelling in my ankles in the afternoons and slight dizziness when standing up.',
        timestamp: '00:12',
        entities: [
          { text: 'hinchazón en los tobillos', category: 'symptom' },
          { text: 'mareos', category: 'symptom' },
          { text: 'tobillos', category: 'anatomy' }
        ]
      },
      {
        id: 't-3',
        speaker: 'Doctor',
        speakerName: 'Dr. Michael Vance',
        originalText: 'I see. Did the ankle swelling start shortly after we increased your Amlodipine to 10 mg daily?',
        language: 'en',
        languageLabel: 'English',
        englishTranslation: 'I see. Did the ankle swelling start shortly after we increased your Amlodipine to 10 mg daily?',
        timestamp: '00:22',
        entities: [
          { text: 'Amlodipine 10 mg', category: 'medication' },
          { text: 'ankle swelling', category: 'symptom' }
        ]
      },
      {
        id: 't-4',
        speaker: 'Patient',
        speakerName: 'Sofia Hernandez',
        originalText: 'Sí, exactamente una semana después de empezar la pastilla nueva. Además me tomé la presión en la farmacia ayer y estaba en 148 sobre 92.',
        language: 'es',
        languageLabel: 'Spanish',
        englishTranslation: 'Yes, exactly one week after starting the new pill. Also I checked my blood pressure at the pharmacy yesterday and it was 148 over 92.',
        timestamp: '00:34',
        entities: [
          { text: '148 sobre 92', category: 'vital' }
        ]
      },
      {
        id: 't-5',
        speaker: 'Doctor',
        speakerName: 'Dr. Michael Vance',
        originalText: 'Thank you for tracking that. Let me examine your ankles. Yes, you have 2+ bilateral pitting pretibial edema. Your blood pressure right now in the clinic is 146/90 mmHg, pulse is 72 regular.',
        language: 'en',
        languageLabel: 'English',
        englishTranslation: 'Thank you for tracking that. Let me examine your ankles. Yes, you have 2+ bilateral pitting pretibial edema. Your blood pressure right now in the clinic is 146/90 mmHg, pulse is 72 regular.',
        timestamp: '00:48',
        entities: [
          { text: 'bilateral pitting pretibial edema', category: 'symptom' },
          { text: '146/90 mmHg', category: 'vital' },
          { text: 'pulse 72', category: 'vital' }
        ]
      },
      {
        id: 't-6',
        speaker: 'Patient',
        speakerName: 'Sofia Hernandez',
        originalText: '¿Es peligroso, doctor? ¿Debo suspender la medicina o cambiar la dieta?',
        language: 'es',
        languageLabel: 'Spanish',
        englishTranslation: 'Is it dangerous, doctor? Should I stop the medicine or change my diet?',
        timestamp: '01:04',
        entities: []
      },
      {
        id: 't-7',
        speaker: 'Doctor',
        speakerName: 'Dr. Michael Vance',
        originalText: "The ankle swelling is a known side effect of Amlodipine due to vasodilatation. We are going to stop Amlodipine today and switch you to Losartan 50 mg once daily. We will keep your Atorvastatin 20 mg at bedtime for cholesterol.",
        language: 'en',
        languageLabel: 'English',
        englishTranslation: "The ankle swelling is a known side effect of Amlodipine due to vasodilatation. We are going to stop Amlodipine today and switch you to Losartan 50 mg once daily. We will keep your Atorvastatin 20 mg at bedtime for cholesterol.",
        timestamp: '01:18',
        entities: [
          { text: 'Amlodipine', category: 'medication' },
          { text: 'Losartan 50 mg', category: 'medication' },
          { text: 'Atorvastatin 20 mg', category: 'medication' },
          { text: 'cholesterol', category: 'diagnosis' }
        ]
      },
      {
        id: 't-8',
        speaker: 'Patient',
        speakerName: 'Sofia Hernandez',
        originalText: 'Entendido. ¿Cuándo debo volver a revisarme y qué debo vigilar con el Losartan?',
        language: 'es',
        languageLabel: 'Spanish',
        englishTranslation: 'Understood. When should I return for a checkup and what should I monitor with Losartan?',
        timestamp: '01:36',
        entities: [
          { text: 'Losartan', category: 'medication' }
        ]
      },
      {
        id: 't-9',
        speaker: 'Doctor',
        speakerName: 'Dr. Michael Vance',
        originalText: 'Please keep a blood pressure log morning and night. Also order basic metabolic panel to check your kidney function and potassium in 4 weeks, and come back to see me in 6 weeks.',
        language: 'en',
        languageLabel: 'English',
        englishTranslation: 'Please keep a blood pressure log morning and night. Also order basic metabolic panel to check your kidney function and potassium in 4 weeks, and come back to see me in 6 weeks.',
        timestamp: '01:49',
        entities: [
          { text: 'basic metabolic panel', category: 'diagnosis' },
          { text: 'potassium', category: 'vital' }
        ]
      },
      {
        id: 't-10',
        speaker: 'Patient',
        speakerName: 'Sofia Hernandez',
        originalText: 'Muchas gracias, doctor. Anotaré todo cuidadosamente.',
        language: 'es',
        languageLabel: 'Spanish',
        englishTranslation: 'Thank you very much, doctor. I will note everything down carefully.',
        timestamp: '02:02',
        entities: []
      }
    ],
    pregeneratedClinicalNote: {
      patientInfo: {
        name: 'Sofia Hernandez',
        age: '62',
        gender: 'Female',
        mrn: 'MRN-784192',
        visitDate: '2026-09-30',
        visitType: 'Outpatient Cardiology Follow-Up',
        primaryLanguage: 'Spanish (ES)',
        doctorName: 'Dr. Michael Vance, MD, FACC',
        specialty: 'Cardiovascular Disease'
      },
      chiefComplaint: 'Bilateral ankle edema and sub-optimally controlled hypertension.',
      historyOfPresentIllness: {
        narrative: 'Patient is a 62-year-old female with essential hypertension and dyslipidemia presenting for 3-week follow-up. Reports onset of bilateral ankle swelling one week after dose titration of Amlodipine to 10 mg daily. Associated with mild orthostatic lightheadedness. Pharmacy home blood pressure reading 148/92 mmHg yesterday. Denies chest pain, shortness of breath, orthopnea, or paroxysmal nocturnal dyspnea.',
        onset: '1 week post Amlodipine increase',
        duration: '2 weeks continuous, worse in evening',
        severity: 'Moderate bilateral swelling, mild dizziness',
        associatedSymptoms: ['Bilateral ankle swelling', 'Postural dizziness'],
        relievingAggravatingFactors: 'Aggravated by standing and evening hours; relieved by leg elevation.'
      },
      pastMedicalHistory: [
        'Essential Primary Hypertension (10 years)',
        'Mixed Hyperlipidemia (5 years)',
        'No prior myocardial infarction or stroke'
      ],
      currentMedications: [
        'Amlodipine 10 mg PO daily (Discontinued today)',
        'Atorvastatin 20 mg PO at bedtime (Continued)'
      ],
      allergies: [
        'No Known Drug Allergies (NKDA)'
      ],
      doctorObservations: {
        generalAppearance: 'Well-nourished, alert female in no acute respiratory distress.',
        vitals: {
          bloodPressure: '146/90 mmHg',
          heartRate: '72 bpm (regular)',
          temperature: '36.7 °C (98.1 °F)',
          respiratoryRate: '16 breaths/min',
          oxygenSaturation: '98% on room air',
          bmi: '27.4 kg/m²'
        },
        physicalExam: [
          { system: 'Cardiovascular', findings: 'Regular rate and rhythm, normal S1/S2, no murmurs, rubs, or gallops.' },
          { system: 'Extremities', findings: '2+ bilateral pitting edema over pretibial area and ankles; distal pulses intact; no calf tenderness.' },
          { system: 'Respiratory', findings: 'Lungs clear to auscultation bilaterally; no wheezes, rales, or rhonchi.' }
        ]
      },
      assessment: {
        primaryDiagnosis: 'Amlodipine-induced peripheral edema secondary to dihydropyridine calcium channel blocker vasodilatation.',
        icd10Code: 'R60.0 (Localized edema) / I10 (Essential hypertension)',
        differentialDiagnoses: [
          { diagnosis: 'Essential Hypertension, poorly controlled', icd10: 'I10', likelihood: 'Primary' },
          { diagnosis: 'Drug-induced peripheral edema (CCB adverse effect)', icd10: 'T46.1X5A', likelihood: 'High' },
          { diagnosis: 'Venous insufficiency', icd10: 'I87.2', likelihood: 'Low-to-moderate' }
        ],
        clinicalImpression: 'Ankle edema is secondary to Amlodipine 10 mg. Blood pressure remains above goal (<130/80 mmHg). Switching mechanism of action to Angiotensin Receptor Blocker (ARB) is indicated.'
      },
      plan: {
        prescriptions: [
          {
            drugName: 'Losartan Potassium',
            dosage: '50 mg',
            route: 'Oral (Tablet)',
            frequency: 'Once daily in the morning',
            duration: '90 days with 3 refills',
            instructions: 'Take 1 tablet daily with or without food. Monitor blood pressure and report dizziness.',
            isNewOrModified: true,
            warnings: 'Monitor serum potassium and renal function. Avoid salt substitutes containing potassium.'
          },
          {
            drugName: 'Atorvastatin Calcium',
            dosage: '20 mg',
            route: 'Oral (Tablet)',
            frequency: 'Once daily at bedtime',
            duration: '90 days with 3 refills',
            instructions: 'Continue current dosage at bedtime for lipid reduction.',
            isNewOrModified: false
          }
        ],
        diagnosticTests: [
          'Basic Metabolic Panel (BMP) to assess serum creatinine, eGFR, and potassium in 4 weeks',
          'Fast lipid panel at next 3-month cycle'
        ],
        lifestyleAndDiet: [
          'DASH diet: low sodium (<2,000 mg/day), increase fresh vegetables and potassium-balanced foods',
          'Elevate legs 15-20 minutes in the evening to accelerate edema resolution'
        ],
        referrals: []
      },
      safetyAlerts: {
        allergyAlerts: [],
        drugInteractions: ['Advised patient to avoid NSAIDs (e.g. Ibuprofen/Naproxen) which blunts Losartan efficacy.'],
        redFlags: ['Sudden shortness of breath, chest pressure, severe dizziness, or swelling extending above calves.']
      },
      patientInstructions: {
        english: {
          summary: 'We stopped your Amlodipine pill because it caused the fluid buildup in your ankles. You are starting Losartan 50 mg daily for blood pressure.',
          keyActions: [
            'Stop taking Amlodipine starting today.',
            'Begin taking Losartan 50 mg once every morning.',
            'Record your blood pressure twice daily (morning and evening).',
            'Get routine blood work done in 4 weeks to check kidney electrolytes.'
          ],
          medicationGuide: [
            'Losartan 50 mg: 1 tablet every morning',
            'Atorvastatin 20 mg: 1 tablet every night'
          ],
          redFlagsWhenToSeekER: [
            'Chest pain or tightening, severe shortness of breath, sudden facial or lip swelling, or fainting.'
          ],
          followUp: 'Return to clinic in 6 weeks with your blood pressure log.'
        },
        patientNativeLanguage: {
          language: 'Spanish (Español)',
          summary: 'Suspendimos la pastilla de Amlodipino porque estaba causando la hinchazón en sus tobillos. Comenzará a tomar Losartán 50 mg al día para controlar su presión arterial.',
          keyActions: [
            'Deje de tomar el Amlodipino a partir de hoy.',
            'Comience a tomar Losartán 50 mg una vez cada mañana.',
            'Anote su presión arterial dos veces al día (mañana y noche).',
            'Hágase el análisis de sangre rutinario en 4 semanas para revisar los riñones y el potasio.'
          ],
          medicationGuide: [
            'Losartán 50 mg: 1 tableta cada mañana con agua',
            'Atorvastatina 20 mg: 1 tableta cada noche al acostarse'
          ],
          redFlagsWhenToSeekER: [
            'Dolor u opresión en el pecho, falta de aire repentina, mareo severo con desmayo, o hinchazón en labios/cara.'
          ],
          followUp: 'Regrese a la clínica en 6 semanas trayendo su registro de presión arterial.'
        }
      }
    }
  },
  {
    id: 'endocrinology-hi-en',
    title: 'Type 2 Diabetes & Neuropathy (English & Hindi)',
    specialty: 'Endocrinology & Diabetology',
    doctorLanguage: 'en',
    patientLanguage: 'hi',
    patientName: 'Rajesh Sharma',
    patientAge: '54',
    summary: 'Elevated fasting blood glucose, burning sensation in soles of feet (diabetic neuropathy), Metformin dose optimization.',
    transcript: [
      {
        id: 'hi-1',
        speaker: 'Doctor',
        speakerName: 'Dr. Sarah Jenkins',
        originalText: 'Namaste, Mr. Sharma. Good to see you. How have your morning blood sugar numbers been over the past month?',
        language: 'en',
        languageLabel: 'English',
        englishTranslation: 'Namaste, Mr. Sharma. Good to see you. How have your morning blood sugar numbers been over the past month?',
        timestamp: '00:03',
        entities: [
          { text: 'blood sugar', category: 'vital' }
        ]
      },
      {
        id: 'hi-2',
        speaker: 'Patient',
        speakerName: 'Rajesh Sharma',
        originalText: 'नमस्ते डॉक्टर साहब। सुबह का शुगर 160 से 180 के बीच आ रहा है। और रात को दोनों पैरों के तलवों में बहुत जलन और सुई चुभने जैसा दर्द होता है।',
        language: 'hi',
        languageLabel: 'Hindi',
        englishTranslation: 'Namaste doctor. Morning sugar is coming between 160 and 180. And at night there is intense burning and pins-and-needles sensation in the soles of both feet.',
        timestamp: '00:15',
        entities: [
          { text: 'शुगर 160 से 180', category: 'vital' },
          { text: 'पैरों के तलवों में जलन', category: 'symptom' },
          { text: 'सुई चुभने जैसा दर्द', category: 'symptom' },
          { text: 'पैरों के तलवों', category: 'anatomy' }
        ]
      },
      {
        id: 'hi-3',
        speaker: 'Doctor',
        speakerName: 'Dr. Sarah Jenkins',
        originalText: 'That burning sensation and pins-and-needles in both soles sounds very much like early diabetic peripheral neuropathy. Are you currently taking Metformin 500 mg twice daily?',
        language: 'en',
        languageLabel: 'English',
        englishTranslation: 'That burning sensation and pins-and-needles in both soles sounds very much like early diabetic peripheral neuropathy. Are you currently taking Metformin 500 mg twice daily?',
        timestamp: '00:30',
        entities: [
          { text: 'diabetic peripheral neuropathy', category: 'diagnosis' },
          { text: 'Metformin 500 mg', category: 'medication' }
        ]
      },
      {
        id: 'hi-4',
        speaker: 'Patient',
        speakerName: 'Rajesh Sharma',
        originalText: 'हाँ, मेटफॉर्मिन 500 एमजी सुबह-शाम खाने के साथ ले रहा हूँ। लेकिन मीठा बहुत कम कर दिया है, फिर भी शुगर कम नहीं हो रहा।',
        language: 'hi',
        languageLabel: 'Hindi',
        englishTranslation: 'Yes, taking Metformin 500 mg morning and evening with meals. But I reduced sweets a lot, still the sugar is not dropping.',
        timestamp: '00:46',
        entities: [
          { text: 'मेटफॉर्मिन 500 एमजी', category: 'medication' }
        ]
      },
      {
        id: 'hi-5',
        speaker: 'Doctor',
        speakerName: 'Dr. Sarah Jenkins',
        originalText: 'Your recent HbA1c is 8.4%, which confirms your glycemic control needs tightening. On monofilament examination today, you have reduced sensation at the great toes and first metatarsal heads bilaterally.',
        language: 'en',
        languageLabel: 'English',
        englishTranslation: 'Your recent HbA1c is 8.4%, which confirms your glycemic control needs tightening. On monofilament examination today, you have reduced sensation at the great toes and first metatarsal heads bilaterally.',
        timestamp: '01:02',
        entities: [
          { text: 'HbA1c 8.4%', category: 'vital' },
          { text: 'reduced sensation', category: 'symptom' }
        ]
      },
      {
        id: 'hi-6',
        speaker: 'Patient',
        speakerName: 'Rajesh Sharma',
        originalText: 'क्या पैरों का दर्द ठीक हो सकता है? रात को सोने में बहुत परेशानी होती है।',
        language: 'hi',
        languageLabel: 'Hindi',
        englishTranslation: 'Can the foot pain be cured? It causes a lot of trouble falling asleep at night.',
        timestamp: '01:21',
        entities: [
          { text: 'पैरों का दर्द', category: 'symptom' }
        ]
      },
      {
        id: 'hi-7',
        speaker: 'Doctor',
        speakerName: 'Dr. Sarah Jenkins',
        originalText: 'Yes, we will treat this on two fronts. First, we increase Metformin to 1,000 mg twice daily to get your HbA1c under 7%. Second, for the nighttime burning nerve pain, I will start you on Gabapentin 100 mg at bedtime, which we can adjust as needed.',
        language: 'en',
        languageLabel: 'English',
        englishTranslation: 'Yes, we will treat this on two fronts. First, we increase Metformin to 1,000 mg twice daily to get your HbA1c under 7%. Second, for the nighttime burning nerve pain, I will start you on Gabapentin 100 mg at bedtime, which we can adjust as needed.',
        timestamp: '01:34',
        entities: [
          { text: 'Metformin 1,000 mg', category: 'medication' },
          { text: 'Gabapentin 100 mg', category: 'medication' },
          { text: 'nerve pain', category: 'symptom' }
        ]
      },
      {
        id: 'hi-8',
        speaker: 'Patient',
        speakerName: 'Rajesh Sharma',
        originalText: 'धन्यवाद डॉक्टर साहिबा। गबापेंटिन से कोई चक्कर या नींद तो नहीं आएगी?',
        language: 'hi',
        languageLabel: 'Hindi',
        englishTranslation: 'Thank you doctor. Will Gabapentin cause any dizziness or sleepiness?',
        timestamp: '01:54',
        entities: [
          { text: 'गबापेंटिन', category: 'medication' },
          { text: 'चक्कर या नींद', category: 'symptom' }
        ]
      },
      {
        id: 'hi-9',
        speaker: 'Doctor',
        speakerName: 'Dr. Sarah Jenkins',
        originalText: 'It can cause slight drowsiness, which is why you take it right before sleeping. Inspect your feet every single day for cuts or blisters, and wear comfortable diabetic footwear. We will repeat your HbA1c in 3 months.',
        language: 'en',
        languageLabel: 'English',
        englishTranslation: 'It can cause slight drowsiness, which is why you take it right before sleeping. Inspect your feet every single day for cuts or blisters, and wear comfortable diabetic footwear. We will repeat your HbA1c in 3 months.',
        timestamp: '02:08',
        entities: []
      }
    ],
    pregeneratedClinicalNote: {
      patientInfo: {
        name: 'Rajesh Sharma',
        age: '54',
        gender: 'Male',
        mrn: 'MRN-430911',
        visitDate: '2026-09-30',
        visitType: 'Endocrinology Chronic Disease Management',
        primaryLanguage: 'Hindi (HI)',
        doctorName: 'Dr. Sarah Jenkins, MD, FACE',
        specialty: 'Endocrinology, Diabetes & Metabolism'
      },
      chiefComplaint: 'Sub-optimally controlled type 2 diabetes and bilateral burning dysesthesias of both soles.',
      historyOfPresentIllness: {
        narrative: '54-year-old male with a 6-year history of Type 2 Diabetes Mellitus presenting with persistently elevated home fasting blood sugars (160-180 mg/dL). Complains of distressing nocturnal bilateral burning sensations, tingling, and paresthesias in the plantar surface of both feet, interfering with sleep for 6 weeks. Diet compliant, taking Metformin 500 mg BID.',
        onset: '6 weeks of worsening nocturnal burning',
        duration: 'Persistent, aggravated at rest and nocturnal',
        severity: 'Moderate-to-severe neuropathic discomfort',
        associatedSymptoms: ['Plantar dysesthesia', 'Paresthesias (pins and needles)', 'Sleep disruption'],
        relievingAggravatingFactors: 'Worse at bedtime without sensory distractions.'
      },
      pastMedicalHistory: [
        'Type 2 Diabetes Mellitus (diagnosed 2020)',
        'Dyslipidemia'
      ],
      currentMedications: [
        'Metformin 500 mg PO BID (titrating today)',
        'Rosuvastatin 10 mg PO daily'
      ],
      allergies: [
        'NKDA (No Known Drug Allergies)'
      ],
      doctorObservations: {
        generalAppearance: 'Alert, cooperative, overweight male.',
        vitals: {
          bloodPressure: '132/84 mmHg',
          heartRate: '76 bpm',
          temperature: '36.8 °C',
          respiratoryRate: '15 breaths/min',
          oxygenSaturation: '99%',
          bmi: '28.9 kg/m²'
        },
        physicalExam: [
          { system: 'Endocrine/Metabolic', findings: 'Recent lab HbA1c 8.4%. Random clinic glucose 172 mg/dL.' },
          { system: 'Neurological / Feet', findings: '10g Semmes-Weinstein monofilament testing demonstrates loss of protective sensation at 1st and 5th metatarsal heads bilaterally. Achilles deep tendon reflexes 1+ bilaterally. Vibratory sensation reduced at hallux.' },
          { system: 'Skin / Extremities', findings: 'No active plantar ulcers, calluses, or erythema. Dorsalis pedis and posterior tibial pulses 2+ bilaterally.' }
        ]
      },
      assessment: {
        primaryDiagnosis: 'Type 2 Diabetes Mellitus with Diabetic Peripheral Neuropathy, uncontrolled.',
        icd10Code: 'E11.42 (Type 2 diabetes mellitus with diabetic polyneuropathy)',
        differentialDiagnoses: [
          { diagnosis: 'Diabetic Polyneuropathy, sensory predominant', icd10: 'E11.42', likelihood: 'Confirmed' },
          { diagnosis: 'Vitamin B12 deficiency (Metformin-associated)', icd10: 'E53.8', likelihood: 'Possible' },
          { diagnosis: 'Lumbar radiculopathy', icd10: 'M54.16', likelihood: 'Unlikely' }
        ],
        clinicalImpression: 'Uncontrolled hyperglycemia (HbA1c 8.4%) with early symptomatic symmetrical distal sensory polyneuropathy. Requires intensification of oral antihyperglycemic therapy and targeted neuropathic pain relief.'
      },
      plan: {
        prescriptions: [
          {
            drugName: 'Metformin Extended Release (Glucophage XR)',
            dosage: '1,000 mg',
            route: 'Oral (Tablet)',
            frequency: 'Twice daily with meals (morning and evening)',
            duration: '90 days with 3 refills',
            instructions: 'Take with substantial meals to reduce GI upset.',
            isNewOrModified: true,
            warnings: 'Discontinue if experiencing acute vomiting/diarrhea or before iodinated contrast procedures.'
          },
          {
            drugName: 'Gabapentin',
            dosage: '100 mg',
            route: 'Oral (Capsule)',
            frequency: 'Once daily at bedtime',
            duration: '30 days with titration review',
            instructions: 'Take 1 capsule 30 minutes before sleep. May titrate to 300 mg at bedtime after 7 days if tolerated.',
            isNewOrModified: true,
            warnings: 'May cause drowsiness or dizziness. Avoid alcohol.'
          }
        ],
        diagnosticTests: [
          'Serum Vitamin B12 and Vitamin D levels',
          'Comprehensive Metabolic Panel (CMP) & microalbumin/creatinine ratio in 3 months'
        ],
        lifestyleAndDiet: [
          'Daily visual foot inspection using hand mirror for cuts, blisters, redness',
          'Never walk barefoot, even indoors',
          'Carbohydrate counting and 30-minute post-meal brisk walking'
        ],
        referrals: [
          'Podiatry diabetic foot evaluation and custom orthotic footwear',
          'Certified Diabetes Care & Education Specialist (CDCES)'
        ]
      },
      safetyAlerts: {
        allergyAlerts: [],
        drugInteractions: [],
        redFlags: ['Development of any non-healing foot sore, black discoloration of toes, or fever.']
      },
      patientInstructions: {
        english: {
          summary: 'Your diabetes medication is increased to lower your morning blood sugar, and a new bedtime medication is started to relieve foot burning.',
          keyActions: [
            'Take Metformin 1,000 mg twice daily with food.',
            'Take Gabapentin 100 mg at bedtime to calm nerve burning.',
            'Inspect your feet daily for any scratches or redness.',
            'Schedule follow-up HbA1c in 3 months.'
          ],
          medicationGuide: [
            'Metformin 1,000 mg: 1 tablet morning and 1 tablet night with meals',
            'Gabapentin 100 mg: 1 capsule at bedtime'
          ],
          redFlagsWhenToSeekER: [
            'Deep blister or cut on the foot with redness or foul odor, sudden extreme weakness, or vomiting.'
          ],
          followUp: 'Check-in call in 2 weeks for Gabapentin titration; in-person visit in 3 months.'
        },
        patientNativeLanguage: {
          language: 'Hindi (हिन्दी)',
          summary: 'आपके सुबह के शुगर को नियंत्रित करने के लिए मेटफॉर्मिन की खुराक बढ़ाई गई है, और पैरों की जलन दूर करने के लिए रात की नई दवा शुरू की गई है।',
          keyActions: [
            'मेटफॉर्मिन 1,000 एमजी दिन में दो बार भोजन के साथ लें।',
            'गबापेंटिन 100 एमजी रात को सोने से पहले लें, इससे नसों की जलन कम होगी।',
            'प्रतिदिन अपने पैरों और तलवों की जांच करें कि कोई छाला या घाव तो नहीं है।',
            'घर के अंदर भी नंगे पैर न चलें, हमेशा आरामदायक चप्पल पहनें।'
          ],
          medicationGuide: [
            'मेटफॉर्मिन 1,000 एमजी: 1 गोली सुबह और 1 गोली रात (खाने के साथ)',
            'गबापेंटिन 100 एमजी: 1 कैप्सूल रात को सोने से पहले'
          ],
          redFlagsWhenToSeekER: [
            'पैर में कोई घाव या कट जो ठीक न हो रहा हो, लालिमा, पस, या तेज़ बुखार।'
          ],
          followUp: '2 हफ्ते बाद फोन पर समीक्षा, और 3 महीने बाद दोबारा क्लिनिक में HbA1c टेस्ट।'
        }
      }
    }
  },
  {
    id: 'pediatrics-fr-en',
    title: 'Pediatric Asthma Exacerbation (English & French)',
    specialty: 'Pediatrics',
    doctorLanguage: 'en',
    patientLanguage: 'fr',
    patientName: 'Lucas Dubois (Mother: Marie)',
    patientAge: '7',
    summary: 'Nocturnal cough, mild expiratory wheeze, spacer technique review, initiation of inhaled corticosteroid.',
    transcript: [
      {
        id: 'fr-1',
        speaker: 'Doctor',
        speakerName: 'Dr. Emily Thornton',
        originalText: 'Bonjour Mme Dubois. How is Lucas doing with his breathing and coughing lately?',
        language: 'en',
        languageLabel: 'English',
        englishTranslation: 'Bonjour Mrs. Dubois. How is Lucas doing with his breathing and coughing lately?',
        timestamp: '00:03',
        entities: [
          { text: 'coughing', category: 'symptom' }
        ]
      },
      {
        id: 'fr-2',
        speaker: 'Caregiver',
        speakerName: 'Marie Dubois',
        originalText: "Bonjour docteur. Lucas tousse beaucoup la nuit, surtout vers 3 heures du matin. Il s'essouffle aussi très vite quand il court dans la cour d'école.",
        language: 'fr',
        languageLabel: 'French',
        englishTranslation: 'Hello doctor. Lucas coughs a lot at night, especially around 3 in the morning. He also gets out of breath very quickly when running in the school yard.',
        timestamp: '00:14',
        entities: [
          { text: 'tousse la nuit', category: 'symptom' },
          { text: "s'essouffle", category: 'symptom' }
        ]
      },
      {
        id: 'fr-3',
        speaker: 'Doctor',
        speakerName: 'Dr. Emily Thornton',
        originalText: 'How many times a week are you having to give him the blue Albuterol rescue inhaler?',
        language: 'en',
        languageLabel: 'English',
        englishTranslation: 'How many times a week are you having to give him the blue Albuterol rescue inhaler?',
        timestamp: '00:26',
        entities: [
          { text: 'Albuterol rescue inhaler', category: 'medication' }
        ]
      },
      {
        id: 'fr-4',
        speaker: 'Caregiver',
        speakerName: 'Marie Dubois',
        originalText: "Au moins 4 ou 5 fois par semaine ces deux dernières semaines. Et parfois nous n'utilisons pas la chambre d'inhalation parce qu'il est pressé.",
        language: 'fr',
        languageLabel: 'French',
        englishTranslation: "At least 4 or 5 times a week these past two weeks. And sometimes we don't use the spacer chamber because he is in a hurry.",
        timestamp: '00:38',
        entities: [
          { text: "chambre d'inhalation", category: 'medication' }
        ]
      },
      {
        id: 'fr-5',
        speaker: 'Doctor',
        speakerName: 'Dr. Emily Thornton',
        originalText: "That is an important clue. Using Albuterol more than twice a week means his asthma is not adequately controlled. On auscultation, I hear bilateral end-expiratory polyphonic wheezing.",
        language: 'en',
        languageLabel: 'English',
        englishTranslation: "That is an important clue. Using Albuterol more than twice a week means his asthma is not adequately controlled. On auscultation, I hear bilateral end-expiratory polyphonic wheezing.",
        timestamp: '00:52',
        entities: [
          { text: 'polyphonic wheezing', category: 'symptom' }
        ]
      },
      {
        id: 'fr-6',
        speaker: 'Doctor',
        speakerName: 'Dr. Emily Thornton',
        originalText: 'We will step up his therapy today. We will add Fluticasone 44 mcg, 2 puffs twice daily with the spacer chamber, and keep Albuterol for sudden flare-ups or 15 minutes before gym class.',
        language: 'en',
        languageLabel: 'English',
        englishTranslation: 'We will step up his therapy today. We will add Fluticasone 44 mcg, 2 puffs twice daily with the spacer chamber, and keep Albuterol for sudden flare-ups or 15 minutes before gym class.',
        timestamp: '01:09',
        entities: [
          { text: 'Fluticasone 44 mcg', category: 'medication' },
          { text: 'Albuterol', category: 'medication' }
        ]
      },
      {
        id: 'fr-7',
        speaker: 'Caregiver',
        speakerName: 'Marie Dubois',
        originalText: "Très bien docteur. Est-ce qu'il doit se rincer la bouche après la fluticasone ?",
        language: 'fr',
        languageLabel: 'French',
        englishTranslation: 'Very good doctor. Does he need to rinse his mouth after the fluticasone?',
        timestamp: '01:28',
        entities: [
          { text: 'fluticasone', category: 'medication' }
        ]
      },
      {
        id: 'fr-8',
        speaker: 'Doctor',
        speakerName: 'Dr. Emily Thornton',
        originalText: 'Yes, exactly! Always rinse mouth and spit with water after Fluticasone to prevent oral thrush. We will review his Asthma Action Plan in 4 weeks.',
        language: 'en',
        languageLabel: 'English',
        englishTranslation: 'Yes, exactly! Always rinse mouth and spit with water after Fluticasone to prevent oral thrush. We will review his Asthma Action Plan in 4 weeks.',
        timestamp: '01:39',
        entities: [
          { text: 'oral thrush', category: 'diagnosis' }
        ]
      }
    ],
    pregeneratedClinicalNote: {
      patientInfo: {
        name: 'Lucas Dubois',
        age: '7',
        gender: 'Male',
        mrn: 'MRN-912448',
        visitDate: '2026-09-30',
        visitType: 'Pediatric Pulmonology & Allergy Visit',
        primaryLanguage: 'French (FR)',
        doctorName: 'Dr. Emily Thornton, MD, FAAP',
        specialty: 'Pediatrics'
      },
      chiefComplaint: 'Frequent nocturnal coughing and exercise-induced wheezing.',
      historyOfPresentIllness: {
        narrative: '7-year-old male with persistent cough and dyspnea, accompanied by mother Marie Dubois. Over the past 14 days, experiencing nocturnal coughing awakening him 3-4 nights per week around 03:00. Requiring rescue Albuterol 4-5 times weekly. Occasional omission of valved holding chamber (spacer). Denies fever, chest pain, or current respiratory infection.',
        onset: '2 weeks acute worsening of chronic symptoms',
        duration: 'Nightly awakenings 3-4x/week',
        severity: 'Moderate, persistent, limiting playground activity',
        associatedSymptoms: ['Nocturnal cough', 'Exertional dyspnea', 'Expiratory wheeze'],
        relievingAggravatingFactors: 'Aggravated by cold air and exertion; temporarily relieved by Albuterol.'
      },
      pastMedicalHistory: [
        'Mild Intermittent Asthma (diagnosed at age 5)',
        'Atopic Dermatitis (eczema)',
        'Seasonal allergic rhinitis'
      ],
      currentMedications: [
        'Albuterol HFA 90 mcg inhaler as needed'
      ],
      allergies: [
        'Tree nuts (causes urticaria)',
        'Environmental dust mites and cat dander'
      ],
      doctorObservations: {
        generalAppearance: 'Well-developed 7-year-old boy in no distress at rest; speaking in full unlabored sentences.',
        vitals: {
          bloodPressure: '102/66 mmHg',
          heartRate: '92 bpm',
          temperature: '36.9 °C',
          respiratoryRate: '20 breaths/min',
          oxygenSaturation: '99% on room air',
          bmi: '16.1 kg/m²'
        },
        physicalExam: [
          { system: 'Respiratory', findings: 'Mild bilateral end-expiratory high-pitched polyphonic wheezing throughout lower lung fields. No intercostal retractions, suprasternal indrawing, or nasal flaring.' },
          { system: 'HEENT', findings: 'Tympanic membranes clear. Oropharynx non-erythematous, no tonsillar hypertrophy or oral candidiasis.' }
        ]
      },
      assessment: {
        primaryDiagnosis: 'Uncontrolled Moderate Persistent Pediatric Asthma with Exercise-Induced Component.',
        icd10Code: 'J45.40 (Moderate persistent asthma, uncomplicated)',
        differentialDiagnoses: [
          { diagnosis: 'Pediatric Asthma, Moderate Persistent', icd10: 'J45.40', likelihood: 'Primary' },
          { diagnosis: 'Allergic Rhinitis with post-nasal drip', icd10: 'J30.9', likelihood: 'Contributing' },
          { diagnosis: 'Viral bronchiolitis', icd10: 'J21.9', likelihood: 'Unlikely' }
        ],
        clinicalImpression: 'Frequent rescue inhaler reliance (>2 days/week) and nocturnal awakening indicates persistent airway inflammation requiring daily inhaled anti-inflammatory controller therapy.'
      },
      plan: {
        prescriptions: [
          {
            drugName: 'Fluticasone Propionate HFA Inhaler',
            dosage: '44 mcg/actuation',
            route: 'Inhalation via Valved Holding Chamber (Spacer)',
            frequency: '2 puffs twice daily (morning and evening)',
            duration: '30 days with 5 refills',
            instructions: 'Must use spacer device. Breathe in slowly for 5-6 breaths per puff. Rinse mouth with water and spit immediately after each use.',
            isNewOrModified: true,
            warnings: 'Rinse mouth thoroughly to avoid oral thrush. Do not discontinue abruptly.'
          },
          {
            drugName: 'Albuterol Sulfate HFA Inhaler',
            dosage: '90 mcg/actuation',
            route: 'Inhalation via Spacer',
            frequency: '2 puffs every 4-6 hours as needed for sudden wheeze/cough, or 15 min prior to sports',
            duration: 'As needed rescue',
            instructions: 'Rescue inhaler only. Keep available at school nurse office.',
            isNewOrModified: false
          }
        ],
        diagnosticTests: [
          'Peak expiratory flow monitoring diary',
          'Spirometry with bronchodilator reversibility test at follow-up'
        ],
        lifestyleAndDiet: [
          'Allergen mitigation in bedroom: hypoallergenic mattress encasings, wash bedding in 60°C water weekly',
          'Avoid exposure to wood smoke or tobacco smoke'
        ],
        referrals: [
          'Asthma Educator for spacer technique re-demonstration'
        ]
      },
      safetyAlerts: {
        allergyAlerts: ['Confirmed Tree Nut allergy documented in clinic record.'],
        drugInteractions: [],
        redFlags: ['Substernal retractions, inability to speak full sentences, cyanosis, or no relief 15 minutes after Albuterol.']
      },
      patientInstructions: {
        english: {
          summary: "Lucas's asthma is acting up at night. We are starting a daily preventive orange inhaler (Fluticasone) with his spacer, while keeping the blue inhaler for emergencies.",
          keyActions: [
            'Give Fluticasone 44 mcg (2 puffs) twice daily (morning and night) using the spacer.',
            'Have Lucas rinse his mouth and spit water after taking Fluticasone.',
            'Give Albuterol 2 puffs 15 minutes before running in gym or if wheezing starts.',
            'Bring the completed Asthma Action Plan to school.'
          ],
          medicationGuide: [
            'Fluticasone 44 mcg: 2 puffs AM and PM with spacer (rinse and spit)',
            'Albuterol 90 mcg: 2 puffs as needed for sudden cough or exercise'
          ],
          redFlagsWhenToSeekER: [
            'Ribs sucking in with each breath, struggling to talk, blue tint to lips or nails, or blue inhaler not helping.'
          ],
          followUp: 'Return to pediatric clinic in 4 weeks for lung check.'
        },
        patientNativeLanguage: {
          language: 'French (Français)',
          summary: "L'asthme de Lucas se manifeste trop la nuit. Nous ajoutons un inhalateur préventif quotidien (Fluticasone) avec la chambre d'inhalation, tout en gardant l'inhalateur bleu en cas de besoin.",
          keyActions: [
            "Donner la Fluticasone 44 mcg (2 bouffées) matin et soir avec la chambre d'inhalation.",
            "Faire rincer la bouche de Lucas avec de l'eau et cracher après chaque prise.",
            'Utiliser la ventoline (Albuterol) 2 bouffées 15 minutes avant le sport ou en cas de crise.',
            "Transmettre le plan d'action d'asthme à l'infirmerie de l'école."
          ],
          medicationGuide: [
            "Fluticasone 44 mcg : 2 bouffées matin et soir avec chambre d'inhalation (rincer la bouche)",
            'Albutérol 90 mcg : 2 bouffées si besoin en cas de sifflement ou toux subite'
          ],
          redFlagsWhenToSeekER: [
            "Tirage respiratoire (la peau se creuse sous les côtes), difficulté à parler, lèvres bleutées ou absence de soulagement après l'Albutérol."
          ],
          followUp: 'Rendez-vous de contrôle dans 4 semaines au cabinet pédiatrique.'
        }
      }
    }
  },
  {
    id: 'orthopedics-zh-en',
    title: 'Knee Osteoarthritis & Mobility (English & Mandarin)',
    specialty: 'Orthopedics & Sports Medicine',
    doctorLanguage: 'en',
    patientLanguage: 'zh',
    patientName: 'Wei Zhang',
    patientAge: '68',
    summary: 'Chronic bilateral knee pain, difficulty with stair climbing, history of peptic ulcer restricting NSAIDs, topical therapy & physical therapy.',
    transcript: [
      {
        id: 'zh-1',
        speaker: 'Doctor',
        speakerName: 'Dr. Robert Ross',
        originalText: 'Hello Mr. Zhang. Welcome back. How have your knees been holding up with your daily walks?',
        language: 'en',
        languageLabel: 'English',
        englishTranslation: 'Hello Mr. Zhang. Welcome back. How have your knees been holding up with your daily walks?',
        timestamp: '00:03',
        entities: [
          { text: 'knees', category: 'anatomy' }
        ]
      },
      {
        id: 'zh-2',
        speaker: 'Patient',
        speakerName: 'Wei Zhang',
        originalText: '你好医生。最近右膝盖疼得厉害，上下楼梯时咯吱咯吱响，膝盖内侧像针扎一样。早上起床时特别僵硬，得活动半小时才能走路。',
        language: 'zh',
        languageLabel: 'Mandarin Chinese',
        englishTranslation: 'Hello doctor. Lately my right knee hurts severely, crackles when going up and down stairs, and feels like needle pricks on the inner side. Morning stiffness is very bad, taking half an hour of movement before I can walk.',
        timestamp: '00:16',
        entities: [
          { text: '右膝盖疼', category: 'symptom' },
          { text: '咯吱咯吱响 (crepitus)', category: 'symptom' },
          { text: '膝盖内侧 (medial knee)', category: 'anatomy' },
          { text: '早晨僵硬 (morning stiffness)', category: 'symptom' }
        ]
      },
      {
        id: 'zh-3',
        speaker: 'Doctor',
        speakerName: 'Dr. Robert Ross',
        originalText: 'I understand. Have you taken any oral pain pills like Ibuprofen or Naproxen for the inflammation?',
        language: 'en',
        languageLabel: 'English',
        englishTranslation: 'I understand. Have you taken any oral pain pills like Ibuprofen or Naproxen for the inflammation?',
        timestamp: '00:32',
        entities: [
          { text: 'Ibuprofen', category: 'medication' },
          { text: 'Naproxen', category: 'medication' }
        ]
      },
      {
        id: 'zh-4',
        speaker: 'Patient',
        speakerName: 'Wei Zhang',
        originalText: '不敢吃布洛芬，因为我有胃溃疡病史，以前吃止痛药胃出血住过院。现在只敢吃点泰诺，但止痛效果不太好。',
        language: 'zh',
        languageLabel: 'Mandarin Chinese',
        englishTranslation: "I dare not take ibuprofen, because I have a history of peptic ulcers and was previously hospitalized for stomach bleeding from painkillers. Now I only dare take Tylenol, but the pain relief is not very good.",
        timestamp: '00:46',
        entities: [
          { text: '胃溃疡病史 (peptic ulcer history)', category: 'diagnosis' },
          { text: '胃出血 (GI bleed)', category: 'symptom' },
          { text: '泰诺 (Tylenol)', category: 'medication' }
        ]
      },
      {
        id: 'zh-5',
        speaker: 'Doctor',
        speakerName: 'Dr. Robert Ross',
        originalText: 'You are completely right to avoid oral NSAIDs given your history of GI bleeding. On physical exam today, you have moderate medial joint line tenderness and palpable coarse crepitus in the right knee, without joint effusion.',
        language: 'en',
        languageLabel: 'English',
        englishTranslation: 'You are completely right to avoid oral NSAIDs given your history of GI bleeding. On physical exam today, you have moderate medial joint line tenderness and palpable coarse crepitus in the right knee, without joint effusion.',
        timestamp: '01:05',
        entities: [
          { text: 'joint line tenderness', category: 'symptom' },
          { text: 'coarse crepitus', category: 'symptom' }
        ]
      },
      {
        id: 'zh-6',
        speaker: 'Doctor',
        speakerName: 'Dr. Robert Ross',
        originalText: 'Instead of oral pills, we will prescribe topical Diclofenac 1% gel (Voltaren gel), which penetrates directly into the knee joint with minimal systemic absorption. We will also arrange structured physical therapy for quadriceps strengthening.',
        language: 'en',
        languageLabel: 'English',
        englishTranslation: 'Instead of oral pills, we will prescribe topical Diclofenac 1% gel (Voltaren gel), which penetrates directly into the knee joint with minimal systemic absorption. We will also arrange structured physical therapy for quadriceps strengthening.',
        timestamp: '01:24',
        entities: [
          { text: 'Diclofenac 1% gel', category: 'medication' },
          { text: 'physical therapy', category: 'diagnosis' }
        ]
      },
      {
        id: 'zh-7',
        speaker: 'Patient',
        speakerName: 'Wei Zhang',
        originalText: '外用凝胶安全多了！请问每天涂几次？需要打针或者换关节吗？',
        language: 'zh',
        languageLabel: 'Mandarin Chinese',
        englishTranslation: 'Topical gel is much safer! How many times a day should I apply it? Do I need injections or joint replacement?',
        timestamp: '01:46',
        entities: []
      },
      {
        id: 'zh-8',
        speaker: 'Doctor',
        speakerName: 'Dr. Robert Ross',
        originalText: 'Apply 4 grams of the gel 4 times a day using the provided dosing card. Joint replacement is not indicated yet; let us try topical therapy and physical therapy for 8 weeks first. If pain persists, we can consider ultrasound-guided hyaluronic acid or corticosteroid injection.',
        language: 'en',
        languageLabel: 'English',
        englishTranslation: 'Apply 4 grams of the gel 4 times a day using the provided dosing card. Joint replacement is not indicated yet; let us try topical therapy and physical therapy for 8 weeks first. If pain persists, we can consider ultrasound-guided hyaluronic acid or corticosteroid injection.',
        timestamp: '02:00',
        entities: [
          { text: 'hyaluronic acid', category: 'medication' }
        ]
      }
    ],
    pregeneratedClinicalNote: {
      patientInfo: {
        name: 'Wei Zhang',
        age: '68',
        gender: 'Male',
        mrn: 'MRN-558231',
        visitDate: '2026-09-30',
        visitType: 'Orthopedic Consultation',
        primaryLanguage: 'Mandarin Chinese (ZH)',
        doctorName: 'Dr. Robert Ross, MD, FAAOS',
        specialty: 'Orthopedic Surgery & Sports Medicine'
      },
      chiefComplaint: 'Right knee medial joint line pain, mechanical crepitus, and morning stiffness.',
      historyOfPresentIllness: {
        narrative: '68-year-old male with progressive bilateral knee pain, markedly worse on the right side over the past 4 months. Reports pain with ambulation and climbing stairs. Morning joint stiffness lasting 30 minutes. Prior history of peptic ulcer disease with upper GI hemorrhage, strictly contraindicating systemic oral NSAIDs. Acetaminophen provides inadequate analgesia.',
        onset: '4 months worsening mechanical knee pain',
        duration: 'Chronic progressive',
        severity: 'Moderate-severe (6/10 on weight-bearing)',
        associatedSymptoms: ['Joint crepitus', 'Morning stiffness 30 min', 'Stair climbing limitation'],
        relievingAggravatingFactors: 'Aggravated by stairs and walking; relieved by rest and knee offloading.'
      },
      pastMedicalHistory: [
        'Bilateral Knee Primary Osteoarthritis (Kellgren-Lawrence Grade 2-3)',
        'Peptic Ulcer Disease complicated by GI bleeding (2022)',
        'Hypertension'
      ],
      currentMedications: [
        'Acetaminophen 500 mg PO PRN',
        'Pantoprazole 40 mg PO daily',
        'Amlodipine 5 mg PO daily'
      ],
      allergies: [
        'Oral NSAIDs (severe GI bleed history)'
      ],
      doctorObservations: {
        generalAppearance: 'Pleasant, ambulatory with antalgic gait favoring right lower extremity.',
        vitals: {
          bloodPressure: '128/78 mmHg',
          heartRate: '68 bpm',
          temperature: '36.6 °C',
          respiratoryRate: '14 breaths/min',
          oxygenSaturation: '99%',
          bmi: '26.2 kg/m²'
        },
        physicalExam: [
          { system: 'Right Knee Musculoskeletal', findings: 'Moderate tenderness along medial joint line. No significant erythema, warmth, or large effusion. Coarse patellofemoral and tibiofemoral crepitus on active and passive range of motion. ROM 0-115 degrees with end-range discomfort. Anterior/posterior drawer and Lachman negative. Varus/valgus stable.' },
          { system: 'Left Knee Musculoskeletal', findings: 'Mild medial joint line tenderness, mild crepitus, ROM 0-125 degrees.' }
        ]
      },
      assessment: {
        primaryDiagnosis: 'Bilateral Primary Osteoarthritis of Knee, Right worse than Left.',
        icd10Code: 'M17.11 (Unilateral primary osteoarthritis, right knee)',
        differentialDiagnoses: [
          { diagnosis: 'Primary Osteoarthritis of Right Knee', icd10: 'M17.11', likelihood: 'Primary' },
          { diagnosis: 'Medial Meniscus Degenerative Tear', icd10: 'M23.22', likelihood: 'Possible concomitant' },
          { diagnosis: 'Pes anserine bursitis', icd10: 'M70.51', likelihood: 'Excluded on exam' }
        ],
        clinicalImpression: 'Advanced Kellgren-Lawrence Grade 2-3 osteoarthritis. Patient has absolute contraindication to systemic oral NSAIDs due to prior life-threatening upper GI bleed. Topical NSAID provides localized chondroprotective anti-inflammatory relief with <5% systemic bioavailability.'
      },
      plan: {
        prescriptions: [
          {
            drugName: 'Diclofenac Sodium Topical Gel 1%',
            dosage: '4 grams',
            route: 'Topical cutaneous application',
            frequency: 'Apply to right knee 4 times daily',
            duration: '60 days with 2 refills',
            instructions: 'Use the clear dosing card to measure 4 grams. Gently rub into the front, back, and sides of the right knee until absorbed. Wash hands after application.',
            isNewOrModified: true,
            warnings: 'Do not apply to broken or cut skin. Do not combine with oral NSAIDs.'
          },
          {
            drugName: 'Acetaminophen (Tylenol 8-Hour Arthritis)',
            dosage: '650 mg',
            route: 'Oral (Caplet)',
            frequency: '1 caplet every 8 hours as needed (do not exceed 2,000 mg/day)',
            duration: 'As needed for breakthrough pain',
            instructions: 'Take for breakthrough pain; do not exceed 3 caplets within 24 hours.',
            isNewOrModified: false
          }
        ],
        diagnosticTests: [
          'Weight-bearing bilateral knee radiographs (AP, lateral, and Merchant sunrise views) if not obtained in past 12 months'
        ],
        lifestyleAndDiet: [
          'Low-impact cardiovascular conditioning: stationary cycling or swimming 3x weekly',
          'Avoid repetitive deep squatting or kneeling'
        ],
        referrals: [
          'Physical Therapy: 8-week structured program for quadriceps and hamstring strengthening and patellar tracking'
        ]
      },
      safetyAlerts: {
        allergyAlerts: ['ALERT: History of severe upper GI hemorrhage secondary to oral NSAIDs. Oral NSAIDs strictly blocked.'],
        drugInteractions: ['Topical diclofenac has minimal systemic absorption, safe with pantoprazole.'],
        redFlags: ['Sudden knee joint locking, inability to bear any weight, or hot swollen red knee.']
      },
      patientInstructions: {
        english: {
          summary: 'Your knee pain is from joint wear-and-tear (osteoarthritis). Because of your past stomach ulcer, oral pain pills are unsafe. We are giving you a localized anti-inflammatory gel and physical therapy.',
          keyActions: [
            'Apply Diclofenac gel 4 grams to the right knee 4 times a day.',
            'Do not take oral ibuprofen, Advil, Aleve, or aspirin.',
            'Attend physical therapy twice a week to strengthen knee support muscles.',
            'Use ice for 15 minutes after walking if sore.'
          ],
          medicationGuide: [
            'Diclofenac 1% gel: 4g rubbed into right knee 4 times daily',
            'Tylenol 650 mg: 1 caplet as needed (maximum 3 per day)'
          ],
          redFlagsWhenToSeekER: [
            'Black tarry stools, vomiting blood, sudden hot red swollen knee, or inability to walk.'
          ],
          followUp: 'Follow-up in orthopedics clinic in 8 weeks after physical therapy course.'
        },
        patientNativeLanguage: {
          language: 'Mandarin Chinese (中文)',
          summary: '您的膝盖疼痛是由骨关节炎退化引起的。鉴于您过去有严重的胃溃疡和出血病史，口服消炎止痛药很不安全。我们为您开具局部外用抗炎凝胶并安排物理治疗。',
          keyActions: [
            '每日4次将双氯芬酸钠凝胶（4克）涂抹于右膝四周并轻轻揉擦吸收。',
            '切勿自行服用布洛芬（Ibuprofen）、芬必得、阿司匹林等口服止痛药，以免诱发胃出血。',
            '按时参加物理康复治疗，增强大腿股四头肌力量以减轻膝盖压力。',
            '行走后如有酸痛可冰敷15分钟。'
          ],
          medicationGuide: [
            '双氯芬酸钠1%凝胶：每次4克，每日4次均匀涂抹于右膝',
            '对乙酰氨基酚（泰诺）650mg：必要时服用1片（24小时内严禁超过3片）'
          ],
          redFlagsWhenToSeekER: [
            '出现黑便、柏油样大便、呕血，或膝关节突然红肿发热、完全无法负重站立。'
          ],
          followUp: '完成8周物理康复后回骨科门诊复查。'
        }
      }
    }
  }
];
