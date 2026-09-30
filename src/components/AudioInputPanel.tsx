import React, { useState, useRef, useEffect } from 'react';
import {
  Mic,
  Square,
  Pause,
  Play,
  Upload,
  Radio,
  FileAudio,
  Sparkles,
  Loader2,
  AlertCircle,
  Volume2,
  CheckCircle,
  Zap,
  ArrowRight,
  ClipboardPaste,
  HelpCircle
} from 'lucide-react';
import { AudioWaveform } from './AudioWaveform';
import { formatTime, blobToBase64 } from '../utils/audioHelpers';
import { SAMPLE_CONSULTATIONS } from '../data/sampleConsultations';

interface AudioInputPanelProps {
  onTranscribeAudio: (audioBase64: string, mimeType: string, speechHint?: string) => Promise<void>;
  onLoadSample: (id: string) => void;
  onRealizeQuickDialogue: (rawText: string) => Promise<void>;
  isTranscribing: boolean;
  activeSampleId?: string;
}

export const AudioInputPanel: React.FC<AudioInputPanelProps> = ({
  onTranscribeAudio,
  onLoadSample,
  onRealizeQuickDialogue,
  isTranscribing,
  activeSampleId,
}) => {
  const [activeTab, setActiveTab] = useState<'record' | 'paste' | 'upload' | 'samples'>('record');
  const [autoGenerateReport, setAutoGenerateReport] = useState(true);

  // Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);
  const [livePreviewText, setLivePreviewText] = useState<string>('');
  const [micError, setMicError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState<number>(0);

  // Quick Paste Conversation State
  const [pasteText, setPasteText] = useState<string>(
    `Doctor: Good morning Mrs. Hernandez. How has your blood pressure been this week?
Patient: Buenos días doctor. He sentido bastante hinchazón en los tobillos por las tardes y mareos al levantarme.
Doctor: I see. We increased your Amlodipine to 10 mg. We will stop Amlodipine today and switch you to Losartan 50 mg daily. Your blood pressure here is 146/90 mmHg.
Patient: Gracias doctor. ¿Cuándo debo volver a revisarme?
Doctor: Keep a daily blood pressure log and come back to see me in 6 weeks.`
  );

  // Audio Upload states
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedAudioUrl, setUploadedAudioUrl] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlayingRecorded, setIsPlayingRecorded] = useState(false);

  // Refs for recording
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const levelIntervalRef = useRef<any>(null);
  const recognitionRef = useRef<any>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);

  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (levelIntervalRef.current) clearInterval(levelIntervalRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, []);

  const startLiveSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          interim += event.results[i][0].transcript;
        }
        setLivePreviewText(interim);
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition warning:', e.error);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('SpeechRecognition init error:', err);
    }
  };

  const stopLiveSpeechRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
      recognitionRef.current = null;
    }
  };

  const startRecording = async () => {
    setMicError(null);
    setRecordedBlob(null);
    setRecordedAudioUrl(null);
    setLivePreviewText('');
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 64;
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);
        audioContextRef.current = audioCtx;
        analyserRef.current = analyser;
        sourceNodeRef.current = source;

        // Monitor volume level
        levelIntervalRef.current = setInterval(() => {
          if (analyser) {
            const data = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(data);
            const avg = data.reduce((a, b) => a + b, 0) / data.length;
            setAudioLevel(Math.min(100, Math.round(avg * 1.5)));
          }
        }, 100);
      } catch (e) {
        console.warn('Analyser setup fallback', e);
      }

      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      } else if (MediaRecorder.isTypeSupported('audio/ogg')) {
        mimeType = 'audio/ogg';
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        setRecordedBlob(audioBlob);
        const url = URL.createObjectURL(audioBlob);
        setRecordedAudioUrl(url);

        stream.getTracks().forEach((track) => track.stop());
        if (levelIntervalRef.current) clearInterval(levelIntervalRef.current);
        setAudioLevel(0);

        if (autoGenerateReport) {
          const base64Data = await blobToBase64(audioBlob);
          await onTranscribeAudio(base64Data, audioBlob.type || 'audio/webm', livePreviewText);
        }
      };

      mediaRecorder.start(250);
      setIsRecording(true);
      setIsPaused(false);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      startLiveSpeechRecognition();
    } catch (err: any) {
      console.error('Error accessing microphone:', err);
      setMicError(
        'Microphone permission blocked or inactive. You can use "Paste Dialogue" or click "1-Click Interactive Demo" below to see the complete live system working!'
      );
    }
  };

  const togglePauseRecording = () => {
    if (!mediaRecorderRef.current) return;
    if (isPaused) {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      stopLiveSpeechRecognition();
    }
  };

  const handleProcessRecordedAudio = async () => {
    if (!recordedBlob) return;
    const base64Data = await blobToBase64(recordedBlob);
    await onTranscribeAudio(base64Data, recordedBlob.type || 'audio/webm', livePreviewText);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const processSelectedFile = (file: File) => {
    setUploadedFile(file);
    const url = URL.createObjectURL(file);
    setUploadedAudioUrl(url);
  };

  const handleProcessUploadedAudio = async () => {
    if (!uploadedFile) return;
    const base64Data = await blobToBase64(uploadedFile);
    await onTranscribeAudio(base64Data, uploadedFile.type || 'audio/mp3');
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 flex flex-col gap-3.5">
      {/* 1-Click Instant Demo Helper Bar */}
      <div className="flex items-center justify-between p-2.5 rounded bg-teal-50/70 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-900 text-xs">
        <div className="flex items-center gap-2">
          <Zap className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span className="font-semibold text-slate-900 dark:text-slate-100">
            Instant Test Mode:
          </span>
          <span className="text-slate-600 dark:text-slate-400 hidden sm:inline">
            Load sample dialogue &amp; generate report with 1 click
          </span>
        </div>

        <button
          onClick={() => onLoadSample('cardiology-es-en')}
          className="flex items-center gap-1.5 px-3 py-1 rounded bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs transition-colors whitespace-nowrap"
        >
          <span>Run Interactive Case</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      {/* Functional Segmented Input Switcher */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2.5 gap-2">
        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-md text-xs font-medium">
          <button
            onClick={() => setActiveTab('record')}
            className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
              activeTab === 'record'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Live Dictation
          </button>
          <button
            onClick={() => setActiveTab('paste')}
            className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
              activeTab === 'paste'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Paste Dialogue
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
              activeTab === 'upload'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Audio File
          </button>
          <button
            onClick={() => setActiveTab('samples')}
            className={`px-3 py-1 rounded transition-colors whitespace-nowrap ${
              activeTab === 'samples'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Sample Cases
          </button>
        </div>

        {/* Auto-Pilot Toggle */}
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <label className="flex items-center gap-1.5 cursor-pointer text-xs">
            <input
              type="checkbox"
              checked={autoGenerateReport}
              onChange={(e) => setAutoGenerateReport(e.target.checked)}
              className="rounded text-teal-600 focus:ring-teal-500 w-3.5 h-3.5"
            />
            <span className="text-[11px] font-medium">Auto-Build Chart</span>
          </label>
        </div>
      </div>

      {/* Mode 1: Live Dictation */}
      {activeTab === 'record' && (
        <div className="flex flex-col gap-3">
          {micError && (
            <div className="p-3 rounded border border-amber-200 dark:border-amber-900 bg-amber-50/60 dark:bg-amber-950/20 text-xs text-amber-900 dark:text-amber-200">
              <span className="font-semibold block mb-0.5">Microphone Input Status:</span>
              <span>{micError}</span>
              <button
                onClick={() => setActiveTab('paste')}
                className="mt-1 font-semibold underline text-teal-700 dark:text-teal-400 block"
              >
                Use Paste Dialogue mode instead &rarr;
              </button>
            </div>
          )}

          {/* Oscilloscope Monitor */}
          <AudioWaveform
            isRecording={isRecording && !isPaused}
            isPlaying={isPlayingRecorded}
            analyser={analyserRef.current}
          />

          {/* Live Mic Activity Signal Meter */}
          {isRecording && (
            <div className="flex items-center justify-between text-[11px] font-mono p-2 rounded bg-slate-100 dark:bg-slate-800">
              <span className="text-slate-500">Input Sound Level:</span>
              <div className="flex items-center gap-1">
                {Array.from({ length: 12 }).map((_, i) => (
                  <span
                    key={i}
                    className={`w-1.5 h-3 rounded-xs ${
                      i < Math.round(audioLevel / 8)
                        ? i > 9
                          ? 'bg-red-500'
                          : i > 6
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                        : 'bg-slate-300 dark:bg-slate-700'
                    }`}
                  />
                ))}
                <span className="ml-2 text-slate-700 dark:text-slate-300 font-bold">
                  {audioLevel > 10 ? 'Detecting Speech' : 'Listening for Voice...'}
                </span>
              </div>
            </div>
          )}

          {/* Control Bar */}
          <div className="flex items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  disabled={isTranscribing}
                  className="flex items-center gap-2 px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-medium text-xs transition-colors whitespace-nowrap shadow-xs"
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span>Start Microphone Recording</span>
                </button>
              ) : (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={stopRecording}
                    className="flex items-center gap-1.5 px-4 py-2 rounded bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors"
                  >
                    <Square className="w-3.5 h-3.5 fill-white" />
                    <span>Stop Recording</span>
                  </button>

                  <button
                    onClick={togglePauseRecording}
                    className="p-2 rounded border border-slate-300 dark:border-slate-700 hover:bg-slate-100 text-slate-700 dark:text-slate-300"
                    title={isPaused ? 'Resume' : 'Pause'}
                  >
                    {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                  </button>
                </div>
              )}

              {/* Timer */}
              <div className="font-mono text-xs font-medium text-slate-700 dark:text-slate-300 tabular-nums px-2 py-1 rounded bg-slate-100 dark:bg-slate-800">
                {formatTime(recordingSeconds)}
              </div>
            </div>

            {/* Manual transcribe button if auto-pilot disabled */}
            {recordedBlob && !isRecording && (
              <button
                onClick={handleProcessRecordedAudio}
                disabled={isTranscribing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-teal-700 hover:bg-teal-800 text-white font-medium text-xs transition-colors"
              >
                {isTranscribing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                <span>Transcribe Recorded Speech</span>
              </button>
            )}
          </div>

          {/* Live speech preview line */}
          {isRecording && livePreviewText && (
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-200 dark:border-slate-800 text-xs">
              <span className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                Live Speech Stream
              </span>
              <p className="text-slate-700 dark:text-slate-300 italic">
                &ldquo;{livePreviewText}&rdquo;
              </p>
            </div>
          )}
        </div>
      )}

      {/* Mode 2: Paste Dialogue */}
      {activeTab === 'paste' && (
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Input or edit dialogue:</span>
            <div className="flex items-center gap-2 text-[11px]">
              <button
                onClick={() =>
                  setPasteText(
                    `Doctor: Good morning Mrs. Hernandez. How has your blood pressure been this week?
Patient: Buenos días doctor. He sentido bastante hinchazón en los tobillos por las tardes y mareos al levantarme.
Doctor: I see. We will stop Amlodipine today and switch you to Losartan 50 mg daily. Your blood pressure here is 146/90 mmHg.
Patient: Gracias doctor. ¿Cuándo debo volver a revisarme?
Doctor: Keep a daily blood pressure log and come back to see me in 6 weeks.`
                  )
                }
                className="hover:underline text-teal-700 dark:text-teal-400"
              >
                Cardio (ES/EN)
              </button>
              <span aria-hidden="true">·</span>
              <button
                onClick={() =>
                  setPasteText(
                    `Doctor: Namaste Mr. Sharma. How have your morning fasting sugars been?
Patient: नमस्ते डॉक्टर साहब। सुबह का शुगर 170 आ रहा है और रात को दोनों पैरों के तलवों में बहुत जलन और सुई चुभने जैसा दर्द होता है।
Doctor: Your HbA1c is 8.4%. We will increase Metformin to 1,000 mg twice daily and add Gabapentin 100 mg at bedtime for nerve burning pain.
Patient: धन्यवाद डॉक्टर साहिबा।
Doctor: Inspect your feet daily and we will repeat blood tests in 3 months.`
                  )
                }
                className="hover:underline text-teal-700 dark:text-teal-400"
              >
                Diabetes (HI/EN)
              </button>
            </div>
          </div>

          <textarea
            rows={5}
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            className="w-full p-2.5 text-xs font-mono rounded border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 outline-none leading-relaxed"
          />

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400">
              Parses speakers, languages, &amp; builds SOAP note automatically
            </span>

            <button
              onClick={() => onRealizeQuickDialogue(pasteText)}
              disabled={isTranscribing || pasteText.trim().length === 0}
              className="flex items-center gap-1.5 px-4 py-2 rounded bg-teal-700 hover:bg-teal-800 text-white font-medium text-xs transition-colors whitespace-nowrap"
            >
              {isTranscribing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
              <span>Process Dialogue &amp; Generate Chart</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Mode 3: Audio File Upload */}
      {activeTab === 'upload' && (
        <div className="flex flex-col gap-3">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file && file.type.startsWith('audio/')) processSelectedFile(file);
            }}
            className={`border border-dashed rounded-lg p-5 text-center transition-colors cursor-pointer ${
              isDragging
                ? 'border-teal-600 bg-teal-50/40 dark:bg-teal-950/20'
                : 'border-slate-300 dark:border-slate-700 hover:border-slate-400 bg-slate-50/50 dark:bg-slate-800/20'
            }`}
          >
            <input
              type="file"
              id="file-input"
              accept="audio/*,.mp3,.wav,.m4a,.webm,.ogg,.flac"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="file-input" className="cursor-pointer flex flex-col items-center gap-1.5">
              <FileAudio className="w-6 h-6 text-slate-400" />
              <div className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                {uploadedFile ? uploadedFile.name : 'Select or drop medical audio file'}
              </div>
              <p className="text-[11px] text-slate-500">
                MP3, WAV, M4A, WEBM, OGG (multilingual audio)
              </p>
            </label>
          </div>

          {uploadedFile && (
            <div className="flex items-center justify-between gap-3 p-2 rounded border border-slate-200 dark:border-slate-800 text-xs">
              <span className="truncate max-w-[200px] text-slate-700 dark:text-slate-300 font-medium">
                {uploadedFile.name}
              </span>
              <button
                onClick={handleProcessUploadedAudio}
                disabled={isTranscribing}
                className="px-3 py-1.5 rounded bg-teal-700 hover:bg-teal-800 text-white font-medium text-xs transition-colors"
              >
                {isTranscribing ? 'Processing...' : 'Transcribe'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Mode 4: Sample Consultations */}
      {activeTab === 'samples' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {SAMPLE_CONSULTATIONS.map((demo) => {
            const isSelected = activeSampleId === demo.id;
            return (
              <button
                key={demo.id}
                onClick={() => onLoadSample(demo.id)}
                className={`text-left p-2.5 rounded border transition-colors flex flex-col gap-1 ${
                  isSelected
                    ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-950/20 text-slate-900 dark:text-white'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between font-semibold">
                  <span>{demo.patientName}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{demo.specialty}</span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                  {demo.title}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
