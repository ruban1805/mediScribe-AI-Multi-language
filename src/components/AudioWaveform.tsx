import React, { useEffect, useRef } from 'react';

interface AudioWaveformProps {
  isRecording: boolean;
  isPlaying?: boolean;
  analyser?: AnalyserNode | null;
}

export const AudioWaveform: React.FC<AudioWaveformProps> = ({
  isRecording,
  isPlaying,
  analyser,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Draw faint oscilloscope background grid
      ctx.strokeStyle = 'rgba(148, 163, 184, 0.08)';
      ctx.lineWidth = 1;

      // Horizontal center line
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Vertical grid ticks
      for (let x = 40; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      const isActive = isRecording || isPlaying;

      if (!isActive) {
        // Idle baseline with slight digital noise tick
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, height / 2);
        for (let x = 0; x < width; x += 4) {
          const y = height / 2 + (Math.sin(x * 0.05) * 0.5);
          ctx.lineTo(x, y);
        }
        ctx.stroke();
        return;
      }

      if (analyser) {
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);

        ctx.lineWidth = 2;
        ctx.strokeStyle = isRecording ? '#0d9488' : '#0284c7';
        ctx.beginPath();

        const sliceWidth = width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
          x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.stroke();
      } else {
        // High-precision synthesized acoustic waveform
        phase += 0.08;
        ctx.lineWidth = 2;
        ctx.strokeStyle = isRecording ? '#14b8a6' : '#38bdf8';
        ctx.beginPath();

        for (let x = 0; x < width; x += 2) {
          const normX = x / width;
          const envelope = Math.sin(normX * Math.PI); // taper edges
          const w1 = Math.sin(x * 0.04 + phase * 2);
          const w2 = Math.cos(x * 0.09 - phase * 1.2) * 0.5;
          const w3 = Math.sin(x * 0.15 + phase * 3) * 0.25;
          const amp = (w1 + w2 + w3) * envelope * (height * 0.35);

          const y = height / 2 + amp;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      animFrameIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isRecording, isPlaying, analyser]);

  return (
    <div className="relative w-full bg-slate-950 rounded-lg p-2.5 border border-slate-800 overflow-hidden font-mono text-[10px]">
      {/* Top Monitor Status Line */}
      <div className="flex items-center justify-between text-slate-400 mb-1.5 px-1 tabular-nums">
        <div className="flex items-center gap-2">
          <span className={`inline-block w-1.5 h-1.5 rounded-full ${isRecording ? 'bg-teal-400 animate-pulse' : 'bg-slate-600'}`} />
          <span className="text-slate-300 font-semibold tracking-wider uppercase">
            {isRecording ? 'Acoustic Stream Active' : 'Acoustic Monitor Ready'}
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <span>CH 1: Lead (Physician)</span>
          <span>·</span>
          <span>CH 2: Ambient (Patient)</span>
          <span>·</span>
          <span>16kHz Mono</span>
        </div>
      </div>

      {/* Canvas Oscilloscope */}
      <canvas
        ref={canvasRef}
        width={480}
        height={56}
        className="w-full h-14 block"
      />
    </div>
  );
};
