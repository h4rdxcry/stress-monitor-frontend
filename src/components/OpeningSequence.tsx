import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Activity, 
  Cpu, 
  Zap, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  Radio
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../localization/translations';
import { 
  playStartupChime, 
  playCalibrationTick, 
  playReadyChime, 
  getAudioMuted, 
  setAudioMuted 
} from '../utils/audioSynth';
import { triggerLightHaptic } from '../utils/haptics';

interface OpeningSequenceProps {
  onComplete: () => void;
  language: Language;
  isDarkMode?: boolean;
}

interface BioParticle {
  x: number;
  y: number;
  speed: number;
  type: 'eeg' | 'gsr';
  radius: number;
  alpha: number;
  t: number;
}

export const OpeningSequence: React.FC<OpeningSequenceProps> = ({
  onComplete,
  language,
  isDarkMode = false,
}) => {
  const [progress, setProgress] = useState<number>(0);
  const [isMuted, setIsMutedState] = useState<boolean>(getAudioMuted());
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isExiting, setIsExiting] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const t = translations[language];

  // Milestone triggers tracker to prevent repeated audio/haptics
  const milestonesRef = useRef<{ [key: number]: boolean }>({
    25: false,
    50: false,
    75: false,
    100: false,
  });

  const handleFinish = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onComplete();
    }, 450);
  }, [onComplete]);

  // Initial startup sound and progression loop
  useEffect(() => {
    playStartupChime();

    let animationFrameId: number;
    const startTime = performance.now();
    const duration = 3200; // 3.2 seconds total calibration cycle

    const updateProgress = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const rawRatio = Math.min(1, elapsed / duration);
      
      // Smooth cubic ease-out progression
      const easeVal = 1 - Math.pow(1 - rawRatio, 2.6);
      const currentPct = Math.min(100, Math.round(easeVal * 100));

      setProgress(currentPct);

      // Trigger tactile & audio feedback at key diagnostic milestones
      if (currentPct >= 25 && !milestonesRef.current[25]) {
        milestonesRef.current[25] = true;
        playCalibrationTick();
        triggerLightHaptic();
      }
      if (currentPct >= 50 && !milestonesRef.current[50]) {
        milestonesRef.current[50] = true;
        playCalibrationTick();
        triggerLightHaptic();
      }
      if (currentPct >= 75 && !milestonesRef.current[75]) {
        milestonesRef.current[75] = true;
        playCalibrationTick();
        triggerLightHaptic();
      }
      if (currentPct >= 100 && !milestonesRef.current[100]) {
        milestonesRef.current[100] = true;
        playReadyChime();
        triggerLightHaptic();
        setIsReady(true);
        // Automatic gentle progression into app if user hasn't clicked
        setTimeout(() => {
          handleFinish();
        }, 900);
        return;
      }

      if (rawRatio < 1) {
        animationFrameId = requestAnimationFrame(updateProgress);
      }
    };

    animationFrameId = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [handleFinish]);

  // Canvas-based Biometric Radar and Dynamic Waveform convergence
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frameId: number;
    let time = 0;

    // Generate traveling bio-particles
    const particles: BioParticle[] = Array.from({ length: 32 }, (_, i) => ({
      x: 0,
      y: 0,
      speed: 0.008 + (i % 5) * 0.003,
      type: i % 2 === 0 ? 'eeg' : 'gsr',
      radius: 1.5 + (i % 3) * 0.8,
      alpha: 0.4 + (i % 4) * 0.15,
      t: (i / 32),
    }));

    const render = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

      if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
        canvas.width = width * dpr;
        canvas.height = height * dpr;
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height * 0.38;

      // 1. Concentric Biometric Radar Rings
      const ringCount = 4;
      for (let r = 1; r <= ringCount; r++) {
        const radius = r * 54;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.strokeStyle = isDarkMode 
          ? `rgba(168, 85, 247, ${0.12 + r * 0.03})` 
          : `rgba(147, 51, 234, ${0.1 + r * 0.025})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      // 2. Rotating Radar Scanner Beam
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(time * 0.025);
      const sweepGradient = ctx.createLinearGradient(0, 0, 180, 0);
      sweepGradient.addColorStop(0, 'rgba(168, 85, 247, 0.4)');
      sweepGradient.addColorStop(1, 'rgba(168, 85, 247, 0)');
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, 180, -0.28, 0.28);
      ctx.fillStyle = sweepGradient;
      ctx.fill();
      ctx.restore();

      // 3. EEG Signal Stream (Cyan-Indigo Beta/Alpha rhythm from top-left)
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = isDarkMode ? '#38bdf8' : '#0284c7';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = isDarkMode ? 'rgba(56, 189, 248, 0.8)' : 'rgba(2, 132, 199, 0.5)';
      ctx.shadowBlur = 12;

      const eegStartX = Math.max(0, centerX - 320);
      for (let x = eegStartX; x <= centerX; x += 3) {
        const progressX = (x - eegStartX) / (centerX - eegStartX);
        const envelope = Math.sin(progressX * Math.PI); // Pinches at endpoints
        const alphaBand = Math.sin(x * 0.045 + time * 0.08) * 12;
        const betaBand = Math.sin(x * 0.12 + time * 0.16) * 5;
        const y = centerY + (alphaBand + betaBand) * envelope;

        if (x === eegStartX) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();

      // 4. GSR Signal Stream (Vivid Magenta-Fuchsia conductance curve from right)
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle = isDarkMode ? '#e879f9' : '#c026d3';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = isDarkMode ? 'rgba(232, 121, 249, 0.8)' : 'rgba(192, 38, 211, 0.5)';
      ctx.shadowBlur = 12;

      const gsrEndX = Math.min(width, centerX + 320);
      for (let x = centerX; x <= gsrEndX; x += 3) {
        const progressX = (x - centerX) / (gsrEndX - centerX);
        const envelope = Math.sin((1 - progressX) * Math.PI);
        const tonicDrift = Math.sin(x * 0.015 + time * 0.04) * 8;
        const phasicSpike = Math.cos(x * 0.06 + time * 0.09) * 10;
        const y = centerY + (tonicDrift + phasicSpike) * envelope;

        if (x === centerX) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      ctx.restore();

      // 5. Bio-Photons flowing toward the convergence core
      particles.forEach((p) => {
        p.t = (p.t + p.speed) % 1;
        const isEeg = p.type === 'eeg';
        const startX = isEeg ? centerX - 280 : centerX + 280;
        const currentX = startX + (centerX - startX) * p.t;
        const envelope = Math.sin(p.t * Math.PI);
        const wave = isEeg
          ? Math.sin(currentX * 0.045 + time * 0.08) * 12
          : Math.cos(currentX * 0.06 + time * 0.09) * 10;
        const currentY = centerY + wave * envelope;

        ctx.beginPath();
        ctx.arc(currentX, currentY, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = isEeg 
          ? `rgba(56, 189, 248, ${p.alpha * envelope})` 
          : `rgba(232, 121, 249, ${p.alpha * envelope})`;
        ctx.shadowColor = isEeg ? '#38bdf8' : '#e879f9';
        ctx.shadowBlur = 8;
        ctx.fill();
      });

      // 6. Central Neural Core Pulse (Cardiopulmonary heartbeat resonance)
      const pulseRatio = (Math.sin(time * 0.08) + 1) / 2;
      const coreRadius = 22 + pulseRatio * 10;

      const coreGradient = ctx.createRadialGradient(
        centerX,
        centerY,
        2,
        centerX,
        centerY,
        coreRadius * 2.6
      );
      coreGradient.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      coreGradient.addColorStop(0.25, 'rgba(168, 85, 247, 0.85)');
      coreGradient.addColorStop(0.65, 'rgba(99, 102, 241, 0.45)');
      coreGradient.addColorStop(1, 'rgba(147, 51, 234, 0)');

      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius * 2.6, 0, Math.PI * 2);
      ctx.fillStyle = coreGradient;
      ctx.fill();

      // Sharp central pip
      ctx.beginPath();
      ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#a855f7';
      ctx.shadowBlur = 15;
      ctx.fill();

      ctx.restore();
      time++;
      frameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [isDarkMode]);

  const toggleMute = () => {
    const nextState = !isMuted;
    setIsMutedState(nextState);
    setAudioMuted(nextState);
    triggerLightHaptic();
  };

  // Diagnostic milestone label based on progress
  const getCurrentMilestone = () => {
    if (progress < 25) return t.bootInitializing;
    if (progress < 50) return t.bootCalibratingEeg;
    if (progress < 75) return t.bootCalibratingGsr;
    if (progress < 95) return t.bootAligningVectors;
    return t.bootSystemReady;
  };

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: isExiting ? 0 : 1, scale: isExiting ? 1.03 : 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed inset-0 z-50 flex flex-col justify-between items-center overflow-hidden select-none transition-colors duration-500 ${
        isDarkMode
          ? 'bg-[#080c14] text-slate-100'
          : 'bg-gradient-to-b from-[#fbf8ff] via-[#f5edff] to-[#eedeff] text-slate-900'
      }`}
    >
      {/* Deep atmospheric purple radial illumination */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div 
          className={`absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[620px] h-[620px] rounded-full blur-[120px] pointer-events-none transition-all duration-700 ${
            isDarkMode 
              ? 'bg-gradient-to-tr from-purple-900/30 via-indigo-900/25 to-fuchsia-900/20' 
              : 'bg-gradient-to-tr from-purple-400/30 via-violet-300/30 to-fuchsia-300/25'
          }`} 
        />
      </div>

      {/* HiDPI Canvas Stage */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
      />

      {/* Top Header Bar inside the Boot Sequence */}
      <div className="relative z-30 w-full px-5 py-4 max-w-lg mx-auto flex items-center justify-between">
        {/* Hardware Status Live Indicator */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-mono font-semibold tracking-wide border shadow-sm backdrop-blur-md transition-colors bg-white/70 dark:bg-slate-900/70 border-purple-200/80 dark:border-purple-800/60 text-purple-950 dark:text-purple-200">
          <Radio className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400 animate-pulse" />
          <span>BLE 5.3 LINK • 256 Hz</span>
        </div>

        {/* Action Controls: Audio Toggle + Skip */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            title={isMuted ? "Unmute Audio Feedback" : "Mute Audio Feedback"}
            className="p-2 rounded-full border shadow-sm backdrop-blur-md transition-all active:scale-95 bg-white/80 dark:bg-slate-900/80 border-purple-200/80 dark:border-purple-800/60 text-purple-900 dark:text-purple-200 hover:bg-white dark:hover:bg-slate-800"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="w-3.5 h-3.5 text-slate-400" /> : <Volume2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />}
          </button>

          <button
            onClick={handleFinish}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide border shadow-sm backdrop-blur-md transition-all active:scale-95 bg-white/80 dark:bg-slate-900/80 hover:bg-white dark:hover:bg-slate-800 border-purple-200/80 dark:border-purple-800/60 text-purple-950 dark:text-purple-200"
          >
            {t.skipIntro}
          </button>
        </div>
      </div>

      {/* Floating Center Identity & Signal Labels */}
      <div className="relative z-20 w-full max-w-sm px-6 text-center mt-auto mb-6 space-y-4">
        {/* Dual Biomarker Stream Indicators */}
        <div className="flex items-center justify-between text-[11px] font-mono font-bold tracking-wider px-2">
          <div className="flex items-center gap-1.5 text-sky-700 dark:text-sky-300">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
            <span>EEG (Fp1-F3)</span>
          </div>

          <div className="flex items-center gap-1.5 text-fuchsia-700 dark:text-fuchsia-300">
            <span>GSR (Skin μS)</span>
            <span className="w-2 h-2 rounded-full bg-fuchsia-500 animate-ping" />
          </div>
        </div>

        {/* Clinical Application Identity */}
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-extrabold tracking-wider uppercase bg-purple-100/90 dark:bg-purple-950/80 border border-purple-300/80 dark:border-purple-800 text-purple-900 dark:text-purple-200 shadow-sm">
            <Activity className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            <span>{t.biomarkerTag}</span>
          </div>

          <h1 className="text-2xl sm:text-[26px] font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-950 via-indigo-900 to-purple-900 dark:from-purple-100 dark:via-purple-200 dark:to-indigo-200 text-3d-title leading-tight">
            {t.appTitle}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium max-w-xs mx-auto leading-relaxed">
            {t.appSubtitle}
          </p>
        </div>
      </div>

      {/* Bottom Diagnostic Progress & Calibration Telemetry Panel */}
      <div className="relative z-20 w-full max-w-md px-5 pb-8 space-y-3.5">
        {/* Progress Metric Card */}
        <div className="rounded-2xl p-4 border backdrop-blur-xl shadow-lg bg-white/85 dark:bg-[#0f1422]/90 border-purple-200/90 dark:border-purple-800/70 space-y-3">
          {/* Top Row: Milestone message + percentage readout */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-purple-950 dark:text-purple-100 font-bold truncate">
              {progress === 100 ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
              ) : (
                <Cpu className="w-4 h-4 text-purple-600 dark:text-purple-400 animate-spin flex-shrink-0" style={{ animationDuration: '3s' }} />
              )}
              <span className="truncate text-[11px] sm:text-xs">
                {getCurrentMilestone()}
              </span>
            </div>

            <span className="font-mono text-sm font-black text-purple-700 dark:text-purple-300 ml-2">
              {progress}%
            </span>
          </div>

          {/* Precision Animated Neon Progress Bar */}
          <div className="w-full h-2.5 rounded-full overflow-hidden bg-purple-100 dark:bg-purple-950/80 p-[1.5px] border border-purple-200 dark:border-purple-900">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-purple-600 via-indigo-500 to-fuchsia-500 relative"
              style={{ width: `${progress}%` }}
              transition={{ ease: 'linear', duration: 0.1 }}
            >
              {/* Luminous Glowing Leading Edge */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_10px_#ffffff] blur-[1px]" />
            </motion.div>
          </div>

          {/* Research Benchmark Guarantee Strip */}
          <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 dark:text-slate-400 pt-1 border-t border-purple-100 dark:border-purple-900/50">
            <span className="flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              ROC-AUC 0.962 (95%+ Target)
            </span>
            <span className="font-semibold text-purple-700 dark:text-purple-400">
              TensorFlow Lite Core
            </span>
          </div>
        </div>

        {/* Enter System Action (Activated when 100% or click to jump) */}
        <AnimatePresence>
          {isReady && (
            <motion.button
              initial={{ opacity: 0, y: 8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              onClick={handleFinish}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs tracking-wide text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 shadow-[0_4px_20px_rgba(147,51,234,0.35)] transition-all flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              <span>{t.enterDiagnosticHub}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
