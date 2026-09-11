import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Wind, 
  Play, 
  Pause, 
  RotateCcw, 
  Heart, 
  Sparkles, 
  Vibrate, 
  VibrateOff, 
  CheckCircle,
  Activity,
  ShieldAlert
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../localization/translations';
import { triggerBreathingHaptic, triggerLightHaptic } from '../utils/haptics';

export type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'rest';

interface GuidedBreathingProps {
  language: Language;
  autoStart?: boolean;
  baselineBetaAlpha?: number;
  baselineGsr?: number;
}

const PHASE_DURATIONS: Record<BreathingPhase, number> = {
  inhale: 4, // 4 seconds
  hold: 3,   // 3 seconds
  exhale: 5, // 5 seconds
  rest: 2,   // 2 seconds
};

export const GuidedBreathing: React.FC<GuidedBreathingProps> = ({
  language,
  autoStart = true,
  baselineBetaAlpha = 1.84,
  baselineGsr = 7.42,
}) => {
  const t = translations[language];

  const [isActive, setIsActive] = useState<boolean>(autoStart);
  const [phase, setPhase] = useState<BreathingPhase>('inhale');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(PHASE_DURATIONS.inhale);
  const [cycleCount, setCycleCount] = useState<number>(1);
  const [totalCompletedCycles, setTotalCompletedCycles] = useState<number>(0);
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(true);

  // Interval reference
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Phase transition logic
  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          // Advance phase
          setPhase((currentPhase) => {
            let nextPhase: BreathingPhase = 'inhale';
            if (currentPhase === 'inhale') nextPhase = 'hold';
            else if (currentPhase === 'hold') nextPhase = 'exhale';
            else if (currentPhase === 'exhale') nextPhase = 'rest';
            else if (currentPhase === 'rest') {
              nextPhase = 'inhale';
              setCycleCount((c) => c + 1);
              setTotalCompletedCycles((c) => c + 1);
            }

            if (hapticsEnabled) {
              if (nextPhase === 'inhale' || nextPhase === 'hold' || nextPhase === 'exhale') {
                triggerBreathingHaptic(nextPhase);
              }
            }

            return nextPhase;
          });

          return PHASE_DURATIONS[
            phase === 'inhale' ? 'hold' : phase === 'hold' ? 'exhale' : phase === 'exhale' ? 'rest' : 'inhale'
          ];
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, phase, hapticsEnabled]);

  // Initial phase trigger on mount
  useEffect(() => {
    if (autoStart && hapticsEnabled) {
      triggerBreathingHaptic('inhale');
    }
  }, [autoStart, hapticsEnabled]);

  // Simulated real-time biofeedback recovery calculation
  const recoveryPercent = Math.min(100, Math.round(totalCompletedCycles * 16.5 + (isActive ? 8 : 0)));
  const currentBetaAlpha = Math.max(0.65, +(baselineBetaAlpha - totalCompletedCycles * 0.22).toFixed(2));
  const currentGsr = Math.max(2.4, +(baselineGsr - totalCompletedCycles * 0.95).toFixed(2));

  const handleToggleActive = () => {
    triggerLightHaptic();
    setIsActive((prev) => !prev);
  };

  const handleReset = () => {
    triggerLightHaptic();
    setIsActive(false);
    setPhase('inhale');
    setSecondsRemaining(PHASE_DURATIONS.inhale);
    setCycleCount(1);
    setTotalCompletedCycles(0);
  };

  const currentDuration = PHASE_DURATIONS[phase];
  const phaseProgress = ((currentDuration - secondsRemaining + 1) / currentDuration) * 100;

  // Phase styling & labels
  const getPhaseColor = () => {
    switch (phase) {
      case 'inhale':
        return {
          text: 'text-purple-700 dark:text-purple-300',
          bg: 'from-purple-500 to-indigo-600',
          glow: 'bg-purple-400/25',
          border: 'border-purple-300 dark:border-purple-800',
          label: t.breathingInhale,
          caption: 'Expand diaphragm smoothly through nose',
        };
      case 'hold':
        return {
          text: 'text-sky-700 dark:text-sky-300',
          bg: 'from-sky-500 to-indigo-600',
          glow: 'bg-sky-400/25',
          border: 'border-sky-300 dark:border-sky-800',
          label: t.breathingHold,
          caption: 'Maintain steady chest without straining',
        };
      case 'exhale':
        return {
          text: 'text-fuchsia-700 dark:text-fuchsia-300',
          bg: 'from-fuchsia-500 to-purple-600',
          glow: 'bg-fuchsia-400/25',
          border: 'border-fuchsia-300 dark:border-fuchsia-800',
          label: t.breathingExhale,
          caption: 'Slow, steady release through slightly parted lips',
        };
      case 'rest':
        return {
          text: 'text-emerald-700 dark:text-emerald-300',
          bg: 'from-emerald-500 to-teal-600',
          glow: 'bg-emerald-400/25',
          border: 'border-emerald-300 dark:border-emerald-800',
          label: t.breathingRest,
          caption: 'Natural parasympathetic baseline equilibrium',
        };
    }
  };

  const phaseConfig = getPhaseColor();

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="rounded-3xl p-5 bg-gradient-to-b from-white via-purple-50/40 to-white dark:from-[#111728] dark:via-[#161329] dark:to-[#111728] border border-purple-200/90 dark:border-purple-800/60 shadow-[0_16px_40px_rgba(147,51,234,0.14)] dark:shadow-[0_16px_40px_rgba(0,0,0,0.5)] space-y-4 relative overflow-hidden"
    >
      {/* Background ambient light pulse */}
      <div 
        className={`absolute -top-12 -right-12 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-colors duration-1000 ${phaseConfig.glow}`}
      />

      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-purple-100 dark:border-purple-900/50">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/70 shadow-sm">
            <Wind className="w-4 h-4 text-purple-700 dark:text-purple-400" />
          </div>
          <div>
            <h3 className="text-xs sm:text-sm font-black text-purple-950 dark:text-purple-100 flex items-center gap-1.5">
              {t.guidedBreathingTitle}
            </h3>
            <span className="text-[10px] text-purple-800 dark:text-purple-300 font-medium block">
              {t.guidedBreathingSubtitle}
            </span>
          </div>
        </div>

        {/* Haptics toggle button */}
        <button
          onClick={() => setHapticsEnabled(!hapticsEnabled)}
          title={t.tactileHapticsLabel}
          className={`p-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
            hapticsEnabled
              ? 'bg-purple-100 dark:bg-purple-950/70 text-purple-900 dark:text-purple-200 border-purple-300 dark:border-purple-800'
              : 'bg-slate-100 dark:bg-slate-900/80 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800'
          }`}
        >
          {hapticsEnabled ? <Vibrate className="w-3.5 h-3.5 text-purple-700 dark:text-purple-400" /> : <VibrateOff className="w-3.5 h-3.5" />}
          <span className="text-[10px] font-mono hidden sm:inline">Haptics</span>
        </button>
      </div>

      {/* High stress alert prompt badge */}
      <div className="flex items-center justify-between px-3 py-2 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/80 dark:border-rose-900/60 text-rose-900 dark:text-rose-200 text-[11px] font-bold">
        <span className="flex items-center gap-1.5">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400 flex-shrink-0" />
          {t.highStressAlertBadge}
        </span>
        <span className="font-mono text-[10px] text-rose-700 dark:text-rose-300 bg-rose-100 dark:bg-rose-950/70 px-2 py-0.5 rounded-full border border-rose-300 dark:border-rose-800">
          0.1 Hz Pacing
        </span>
      </div>

      {/* Interactive Biofeedback Breathing Sphere */}
      <div className="relative flex flex-col items-center justify-center py-6">
        {/* Outer Pulsing Rings */}
        <motion.div
          animate={{
            scale: phase === 'inhale' ? [1, 1.25] : phase === 'hold' ? 1.25 : phase === 'exhale' ? [1.25, 0.9] : 0.9,
            opacity: phase === 'inhale' ? [0.35, 0.7] : phase === 'hold' ? 0.7 : phase === 'exhale' ? [0.7, 0.35] : 0.2,
          }}
          transition={{
            duration: currentDuration,
            ease: phase === 'inhale' ? 'easeInOut' : phase === 'exhale' ? 'easeInOut' : 'linear',
          }}
          className={`absolute w-56 h-56 rounded-full blur-xl transition-all duration-700 ${phaseConfig.glow}`}
        />

        {/* Circular Progress Ring Container */}
        <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background Track */}
            <circle
              cx="50"
              cy="50"
              r="44"
              className="text-purple-100/90 dark:text-purple-950/70"
              strokeWidth="4"
              stroke="currentColor"
              fill="transparent"
            />
            {/* Dynamic Progress Stroke */}
            <motion.circle
              cx="50"
              cy="50"
              r="44"
              className={`transition-colors duration-500 ${
                phase === 'inhale'
                  ? 'text-purple-600 dark:text-purple-400'
                  : phase === 'hold'
                  ? 'text-sky-600 dark:text-sky-400'
                  : phase === 'exhale'
                  ? 'text-fuchsia-600 dark:text-fuchsia-400'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}
              strokeWidth="4.5"
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              strokeDasharray={276.46}
              animate={{
                strokeDashoffset: 276.46 - (276.46 * phaseProgress) / 100,
              }}
              transition={{ duration: 0.3, ease: 'linear' }}
            />
          </svg>

          {/* Central Breathing Orb */}
          <motion.div
            animate={{
              scale: phase === 'inhale' ? [0.85, 1.15] : phase === 'hold' ? 1.15 : phase === 'exhale' ? [1.15, 0.85] : 0.85,
            }}
            transition={{
              duration: currentDuration,
              ease: phase === 'inhale' ? 'easeInOut' : phase === 'exhale' ? 'easeInOut' : 'linear',
            }}
            className={`absolute w-36 h-36 rounded-full flex flex-col items-center justify-center p-3 text-center text-white bg-gradient-to-br ${phaseConfig.bg} shadow-[0_8px_30px_rgba(126,34,206,0.3)] border-2 border-white/40`}
          >
            <span className="text-[10px] uppercase font-black tracking-widest text-white/90">
              {phase === 'inhale' ? 'Breathe In' : phase === 'hold' ? 'Hold' : phase === 'exhale' ? 'Breathe Out' : 'Rest'}
            </span>

            <span className="text-3xl font-black font-mono tracking-tight my-0.5 drop-shadow-sm">
              {secondsRemaining}s
            </span>

            <span className="text-[9px] font-semibold text-purple-100 flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-amber-200" />
              Cycle {cycleCount}
            </span>
          </motion.div>
        </div>

        {/* Phase instruction label */}
        <div className="mt-4 text-center space-y-0.5">
          <h4 className={`text-base font-black ${phaseConfig.text} transition-colors duration-500`}>
            {phaseConfig.label}
          </h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium max-w-xs mx-auto">
            {phaseConfig.caption}
          </p>
        </div>
      </div>

      {/* Real-time Biofeedback Response Telemetry Panel */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0c111e] border border-purple-200/90 dark:border-purple-900/50 shadow-sm space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-purple-950 dark:text-purple-200 flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            {t.vagalToneActive}
          </span>
          <span className="font-mono text-purple-700 dark:text-purple-300 font-bold text-[11px]">
            {t.targetBreaths}
          </span>
        </div>

        {/* Parasympathetic recovery gauge */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-600 dark:text-slate-400 font-semibold">{t.parasympatheticGain}</span>
            <span className="font-mono font-black text-emerald-700 dark:text-emerald-400">+{recoveryPercent}%</span>
          </div>
          <div className="w-full bg-purple-100 dark:bg-purple-950/70 rounded-full h-2 overflow-hidden">
            <motion.div
              className="bg-gradient-to-r from-purple-600 via-indigo-600 to-emerald-500 h-full rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${recoveryPercent}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </div>

        {/* Simulated Biomarker Drops (EEG Beta/Alpha & GSR Conductance) */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="p-2 rounded-xl bg-sky-50/90 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60 text-center">
            <span className="text-[10px] text-sky-800 dark:text-sky-300 font-bold block">EEG Beta/Alpha</span>
            <div className="flex items-center justify-center gap-1">
              <span className="text-xs line-through text-slate-400 dark:text-slate-500 font-mono">
                {baselineBetaAlpha.toFixed(2)}
              </span>
              <span className="text-xs font-black text-sky-950 dark:text-sky-100 font-mono">
                → {currentBetaAlpha.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-fuchsia-50/90 dark:bg-fuchsia-950/40 border border-fuchsia-200 dark:border-fuchsia-900/60 text-center">
            <span className="text-[10px] text-fuchsia-800 dark:text-fuchsia-300 font-bold block">GSR Conductance</span>
            <div className="flex items-center justify-center gap-1">
              <span className="text-xs line-through text-slate-400 dark:text-slate-500 font-mono">
                {baselineGsr.toFixed(2)}
              </span>
              <span className="text-xs font-black text-fuchsia-950 dark:text-fuchsia-100 font-mono">
                → {currentGsr.toFixed(2)} μS
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Controls: Start / Pause, Reset */}
      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={handleToggleActive}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-sm ${
            isActive
              ? 'bg-amber-500 hover:bg-amber-600 text-white'
              : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:opacity-95 text-white shadow-purple-200'
          }`}
        >
          {isActive ? (
            <>
              <Pause className="w-4 h-4" />
              <span>{t.pauseBreathing}</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4" />
              <span>{totalCompletedCycles > 0 ? t.resumeBreathing : t.startBreathing}</span>
            </>
          )}
        </button>

        <button
          onClick={handleReset}
          className="py-3 px-4 rounded-xl font-bold text-xs text-purple-900 dark:text-purple-200 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800/60 flex items-center justify-center gap-1.5 transition-all active:scale-95"
          title={t.resetBreathing}
        >
          <RotateCcw className="w-4 h-4 text-purple-700 dark:text-purple-400" />
          <span>{t.resetBreathing}</span>
        </button>
      </div>

      {/* Completed counter pill */}
      <div className="text-center pt-1">
        <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-500 dark:text-slate-400 font-semibold">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          {t.cyclesCompleted}: <span className="font-mono text-purple-950 dark:text-purple-200 font-bold">{totalCompletedCycles}</span>
        </span>
      </div>
    </motion.div>
  );
};
