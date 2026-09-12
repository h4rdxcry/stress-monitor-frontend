import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Check, Cpu, Sparkles, ShieldCheck } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../localization/translations';

interface InferenceModalProps {
  language: Language;
  onComplete: () => void;
}

export const InferenceModal: React.FC<InferenceModalProps> = ({ language, onComplete }) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const t = translations[language];

  useEffect(() => {
    const timer1 = setTimeout(() => setActiveStep(2), 850);
    const timer2 = setTimeout(() => setActiveStep(3), 1750);
    const timer3 = setTimeout(() => setActiveStep(4), 2650);
    const timerDone = setTimeout(() => onComplete(), 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timerDone);
    };
  }, [onComplete]);

  const steps = [
    { num: 1, label: t.step1 },
    { num: 2, label: t.step2 },
    { num: 3, label: t.step3 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-sm rounded-3xl bg-white/95 dark:bg-[#111728]/95 p-6 border border-purple-300/80 dark:border-purple-800/80 shadow-[0_24px_64px_rgba(124,58,237,0.2)] dark:shadow-[0_24px_64px_rgba(0,0,0,0.7)] relative overflow-hidden"
      >
        {/* Luminous atmospheric purple core glow */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-44 h-44 bg-gradient-to-r from-purple-300/30 via-indigo-300/25 to-fuchsia-300/25 rounded-full blur-2xl pointer-events-none" />

        {/* 1. Animated Progress Indicator: Two Waveforms Feeding into AI Core */}
        <div className="relative flex flex-col items-center justify-center my-2">
          <div className="relative w-28 h-28 flex items-center justify-center">
            {/* Outer spinning purple spectral aura */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
              className="absolute inset-0 rounded-full p-[2px] bg-gradient-to-tr from-purple-500 via-indigo-500 to-fuchsia-500 opacity-90 shadow-md"
            >
              <div className="w-full h-full rounded-full bg-white/90 dark:bg-[#111728]/90" />
            </motion.div>

            {/* Cyan EEG input wave stream simulation (Left) */}
            <div className="absolute -left-7 top-1/2 -translate-y-1/2 flex items-center">
              <span className="text-[10px] font-mono text-sky-700 dark:text-sky-300 font-bold mr-1">EEG</span>
              <div className="w-6 h-[2.5px] bg-gradient-to-r from-transparent to-sky-500 animate-pulse" />
            </div>

            {/* Fuchsia GSR input wave stream simulation (Right) */}
            <div className="absolute -right-7 top-1/2 -translate-y-1/2 flex items-center">
              <div className="w-6 h-[2.5px] bg-gradient-to-l from-transparent to-fuchsia-500 animate-pulse" />
              <span className="text-[10px] font-mono text-fuchsia-700 dark:text-fuchsia-300 font-bold ml-1">GSR</span>
            </div>

            {/* Central Luminous AI Processing Core */}
            <motion.div
              animate={{
                scale: [1, 1.08, 1],
                boxShadow: [
                  '0 0 15px rgba(168,85,247,0.4)',
                  '0 0 30px rgba(126,34,206,0.6)',
                  '0 0 15px rgba(168,85,247,0.4)',
                ],
              }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-900 via-indigo-950 to-purple-950 border border-purple-300/40 dark:border-purple-600/40 flex items-center justify-center text-white"
            >
              <Cpu className="w-8 h-8 text-purple-200" />
            </motion.div>
          </div>

          <h3 className="mt-4 text-sm font-bold tracking-tight text-purple-950 dark:text-purple-100 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400 animate-pulse" />
            {t.evaluatingTitle}
          </h3>
          <p className="text-[11px] text-slate-600 dark:text-slate-400 text-center mt-1 max-w-[240px] font-medium">
            {t.inferenceNote}
          </p>
        </div>

        {/* 2. Diagnostic Pipeline Progress Ticker with high contrast colors */}
        <div className="mt-6 space-y-2.5">
          {steps.map((step) => {
            const isDone = activeStep > step.num;
            const isCurrent = activeStep === step.num;

            return (
              <div
                key={step.num}
                className={`flex items-center gap-3 p-2.5 rounded-xl transition-all duration-300 ${
                  isCurrent
                    ? 'bg-purple-50 dark:bg-purple-950/70 border border-purple-300 dark:border-purple-800 text-purple-950 dark:text-purple-100 font-bold shadow-sm'
                    : isDone
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 font-semibold'
                    : 'bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
                    isDone
                      ? 'bg-emerald-600 text-white'
                      : isCurrent
                      ? 'bg-purple-600 text-white animate-pulse'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}
                >
                  {isDone ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : step.num}
                </div>

                <span className="text-xs leading-tight truncate flex-1">
                  {step.label}
                </span>

                {isCurrent && (
                  <span className="w-2 h-2 rounded-full bg-purple-600 animate-ping mr-1" />
                )}
              </div>
            );
          })}
        </div>

        {/* 3. Accuracy Badge */}
        <div className="mt-6 pt-4 border-t border-purple-100 dark:border-purple-900/50 flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-purple-900 dark:text-purple-200 bg-purple-100 dark:bg-purple-950/70 border border-purple-300 dark:border-purple-800 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-700 dark:text-purple-400" />
            <span>{t.targetBenchmark}</span>
          </div>

          <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-semibold">
            Research Protocol
          </span>
        </div>
      </motion.div>
    </motion.div>
  );
};
