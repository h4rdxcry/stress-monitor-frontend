import React, { useEffect, useRef } from 'react';
import { WaveformData } from '../types';

interface WaveformCanvasProps {
  data?: WaveformData | null;
  type: 'eeg' | 'gsr';
  height?: number;
  animate?: boolean;
  emptyPlaceholderText?: string;
  showGrid?: boolean;
}

export const WaveformCanvas: React.FC<WaveformCanvasProps> = ({
  data,
  type,
  height = 110,
  animate = true,
  emptyPlaceholderText,
  showGrid = true,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameIdRef = useRef<number | null>(null);
  const phaseRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let isRunning = true;

    const render = () => {
      if (!canvas || !ctx) return;

      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const width = rect.width;
      const h = height;

      if (canvas.width !== width * dpr || canvas.height !== h * dpr) {
        canvas.width = width * dpr;
        canvas.height = h * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, h);

      // Clinical dark graph canvas for maximum biometric contrast
      const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
      bgGrad.addColorStop(0, '#090d16');
      bgGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, h);

      // Grid Lines
      if (showGrid) {
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
        
        // Vertical grid lines
        const vStep = 28;
        for (let x = 0; x < width; x += vStep) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }

        // Horizontal grid lines
        const hStep = 20;
        for (let y = 0; y < h; y += hStep) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(width, y);
          ctx.stroke();
        }

        // Baseline center line with distinct type coloring
        ctx.strokeStyle = type === 'eeg' ? 'rgba(56, 189, 248, 0.25)' : 'rgba(232, 121, 249, 0.25)';
        ctx.beginPath();
        ctx.setLineDash([3, 3]);
        ctx.moveTo(0, h / 2);
        ctx.lineTo(width, h / 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      if (!data || !data.points || data.points.length === 0) {
        // Empty state
        ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
        ctx.font = '12px "Plus Jakarta Sans", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emptyPlaceholderText || 'No signal loaded', width / 2, h / 2);
        ctx.restore();
        return;
      }

      // Draw Signal Trace
      const pts = data.points;
      const ptsLen = pts.length;
      const step = width / (ptsLen - 1);

      let min = Math.min(...pts);
      let max = Math.max(...pts);
      if (min === max) {
        min -= 1;
        max += 1;
      }
      const padding = 16;
      const usableH = h - padding * 2;

      // Contrast color scheme based on biomarker type
      const isEeg = type === 'eeg';
      const mainColor = isEeg ? '#38bdf8' : '#e879f9';
      const glowColor = isEeg ? 'rgba(56, 189, 248, 0.65)' : 'rgba(232, 121, 249, 0.65)';

      // Glow pass
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 8;
      ctx.lineWidth = 2;
      ctx.strokeStyle = mainColor;
      ctx.beginPath();

      const phaseShift = animate ? (phaseRef.current % ptsLen) : 0;

      for (let i = 0; i < ptsLen; i++) {
        const idx = (i + Math.floor(phaseShift)) % ptsLen;
        const val = pts[idx];
        const normY = 1 - (val - min) / (max - min);
        const y = padding + normY * usableH;
        const x = i * step;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      // Sharp core line
      ctx.shadowBlur = 0;
      ctx.lineWidth = 1.2;
      ctx.strokeStyle = isEeg ? '#e0f2fe' : '#fdf4ff';
      ctx.stroke();

      // Lead calibration watermark
      ctx.font = '9px "JetBrains Mono", monospace';
      ctx.fillStyle = isEeg ? 'rgba(56, 189, 248, 0.85)' : 'rgba(232, 121, 249, 0.85)';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(isEeg ? 'CH: Fp1-F3 (10 μV/mm)' : 'EDA: TONIC/PHASIC (0.5 μS/div)', 8, 8);

      // Right-side badge
      ctx.textAlign = 'right';
      ctx.fillText(`${data.samplingRate} • ${data.duration}`, width - 8, 8);

      // Lead sweep indicator
      if (animate) {
        const sweepX = (phaseRef.current * 1.5) % width;
        const sweepGrad = ctx.createLinearGradient(sweepX - 25, 0, sweepX, 0);
        sweepGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        sweepGrad.addColorStop(1, isEeg ? 'rgba(56, 189, 248, 0.25)' : 'rgba(232, 121, 249, 0.25)');
        ctx.fillStyle = sweepGrad;
        ctx.fillRect(Math.max(0, sweepX - 25), 0, 25, h);

        ctx.strokeStyle = isEeg ? 'rgba(224, 242, 254, 0.7)' : 'rgba(253, 244, 255, 0.7)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(sweepX, 0);
        ctx.lineTo(sweepX, h);
        ctx.stroke();
      }

      ctx.restore();

      if (animate && isRunning) {
        phaseRef.current += 0.25;
        animFrameIdRef.current = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      isRunning = false;
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [data, type, height, animate, emptyPlaceholderText, showGrid]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-purple-200/80 dark:border-purple-900/60 shadow-inner bg-[#090d16]">
      <canvas
        ref={canvasRef}
        className="w-full block"
        style={{ height: `${height}px` }}
      />
    </div>
  );
};
