import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, UserCheck, Stethoscope, Activity, Cpu, RotateCcw } from 'lucide-react';
import { Language, UserRole } from '../types';
import { translations } from '../localization/translations';

interface ScreenPortalSelectionProps {
  language: Language;
  onSelectRole: (role: UserRole) => void;
  onReplayIntro: () => void;
}

export const ScreenPortalSelection: React.FC<ScreenPortalSelectionProps> = ({
  language,
  onSelectRole,
  onReplayIntro,
}) => {
  const t = translations[language];

  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-6 max-w-lg mx-auto w-full space-y-5 animate-fadeIn">
      {/* 2. App Hero / Identification Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl glass-card p-6 sm:p-7 border border-purple-200/80 dark:border-purple-800/60 shadow-[0_12px_36px_rgba(147,51,234,0.08)] bg-gradient-to-br from-white via-purple-50/60 to-indigo-50/50 dark:from-[#111625] dark:via-[#16122d]/80 dark:to-[#101426]/90"
      >
        {/* Subtle Biometric Waveform Ambience in Purple/Indigo */}
        <div className="absolute inset-0 opacity-20 dark:opacity-30 pointer-events-none overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
            <path
              d="M0,100 Q40,60 80,100 T160,100 T240,40 T320,130 T400,100"
              fill="none"
              stroke="#7c3aed"
              strokeWidth="2.5"
              className="animate-pulse"
            />
            <path
              d="M0,120 Q50,140 100,120 T200,90 T300,140 T400,110"
              fill="none"
              stroke="#c026d3"
              strokeWidth="2"
              opacity="0.8"
            />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-t from-white/90 dark:from-[#111625]/90 via-transparent to-transparent" />
        </div>

        {/* Atmospheric Purple Glow Aura */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-purple-400/25 via-violet-400/20 to-indigo-400/20 dark:from-purple-600/25 dark:via-violet-600/20 dark:to-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3.5">
          {/* Multimodal Biomarker Tag - Unique Royal Purple Section */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase text-purple-900 dark:text-purple-200 bg-purple-100/90 dark:bg-purple-950/70 border border-purple-300 dark:border-purple-800 shadow-sm">
            <Activity className="w-3.5 h-3.5 text-purple-700 dark:text-purple-400" />
            <span>{t.biomarkerTag}</span>
          </div>

          {/* 3D App Title with Deep Purple Gradient */}
          <h1 className="text-2xl sm:text-[26px] font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-950 via-indigo-950 to-purple-900 dark:from-purple-100 dark:via-indigo-200 dark:to-purple-200 text-3d-title leading-snug">
            {t.appTitle}
          </h1>

          {/* Subtitle */}
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
            {t.appSubtitle}
          </p>

          {/* Status Metadata Strip */}
          <div className="pt-2 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400 font-mono border-t border-purple-200/60 dark:border-purple-800/50">
            <span className="flex items-center gap-1.5 font-semibold text-indigo-700 dark:text-indigo-400">
              <Cpu className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              DSP Pipeline v4.2
            </span>
            <button
              onClick={onReplayIntro}
              className="inline-flex items-center gap-1 font-semibold text-purple-700 dark:text-purple-400 hover:text-purple-950 dark:hover:text-purple-200 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              {t.replayIntro}
            </button>
          </div>
        </div>
      </motion.div>

      {/* 3. Assessment Role Cards */}
      <div className="space-y-3.5 flex-1 flex flex-col justify-center">
        {/* Patient Dashboard Card - Unique Teal-Emerald Clinical Accent */}
        <motion.button
          whileHover={{ scale: 1.015, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectRole('patient')}
          className="group relative text-left w-full rounded-2xl p-5 glass-interactive border border-teal-200/70 dark:border-teal-900/60 hover:border-teal-400/90 dark:hover:border-teal-500/70 shadow-sm hover:shadow-md transition-all overflow-hidden bg-white/95 dark:bg-[#121828]/90"
        >
          {/* Subtle Hover Glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-r from-teal-50/50 dark:from-teal-950/30 via-transparent to-purple-50/40 dark:to-purple-950/30" />

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/60 border border-teal-200 dark:border-teal-800/70 text-teal-700 dark:text-teal-300 shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
              <UserCheck className="w-6 h-6" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-teal-900 dark:group-hover:text-teal-300 transition-colors">
                  {t.rolePatientTitle}
                </h3>
                <span className="text-xs text-teal-700 dark:text-teal-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  Enter →
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                {t.rolePatientDesc}
              </p>
            </div>
          </div>
        </motion.button>

        {/* Doctor Diagnostic Portal Card - Unique Royal Violet-Indigo Clinical Accent */}
        <motion.button
          whileHover={{ scale: 1.015, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectRole('doctor')}
          className="group relative text-left w-full rounded-2xl p-5 glass-interactive border border-purple-200/80 dark:border-purple-800/60 hover:border-purple-400 dark:hover:border-purple-500/70 shadow-sm hover:shadow-md transition-all overflow-hidden bg-white/95 dark:bg-[#15132a]/90"
        >
          {/* Subtle Hover Glow */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-r from-purple-50/50 dark:from-purple-950/30 via-transparent to-indigo-50/40 dark:to-indigo-950/30" />

          <div className="flex items-start gap-4">
            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/70 text-purple-700 dark:text-purple-300 shadow-sm group-hover:scale-105 transition-transform flex-shrink-0">
              <Stethoscope className="w-6 h-6" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-purple-950 dark:group-hover:text-purple-200 transition-colors">
                    {t.roleDoctorTitle}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 dark:bg-purple-950/80 text-purple-900 dark:text-purple-200 border border-purple-200 dark:border-purple-800">
                    Clinical
                  </span>
                </div>
                <span className="text-xs text-purple-700 dark:text-purple-300 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  Enter →
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                {t.roleDoctorDesc}
              </p>
            </div>
          </div>
        </motion.button>
      </div>

      {/* 4. Privacy & On-Device Security Badge - Unique Medical Sage-Emerald Accent */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="rounded-2xl px-4 py-3 bg-emerald-50/90 dark:bg-emerald-950/40 border border-emerald-200/90 dark:border-emerald-800/60 shadow-sm flex items-center gap-3"
      >
        <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex-shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <p className="text-[11px] text-emerald-950 dark:text-emerald-300 font-medium leading-tight">
          {t.privacyBadge}
        </p>
      </motion.div>
    </div>
  );
};
