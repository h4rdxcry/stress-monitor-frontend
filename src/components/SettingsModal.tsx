import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Sliders, Check, Sun, Moon, RotateCcw } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../localization/translations';

interface SettingsModalProps {
  language: Language;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  onReplayIntro?: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  language,
  isDarkMode = false,
  onToggleTheme,
  onReplayIntro,
  onClose,
}) => {
  const [sampleRate, setSampleRate] = useState<string>('256 Hz');
  const [cutoff, setCutoff] = useState<string>('0.5 - 45 Hz');
  const [threshold, setThreshold] = useState<number>(0.15);
  const [saved, setSaved] = useState<boolean>(false);

  const t = translations[language];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-slate-950/70 backdrop-blur-md"
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        className="w-full max-w-sm rounded-3xl bg-white/95 dark:bg-[#0f1422] p-6 border border-purple-200/90 dark:border-purple-800/70 shadow-[0_20px_50px_rgba(126,34,206,0.18)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.6)] relative text-slate-900 dark:text-slate-100"
      >
        <div className="flex items-center justify-between pb-3 border-b border-purple-100 dark:border-purple-900/50">
          <div className="flex items-center gap-2">
            <Sliders className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-sm font-bold text-purple-950 dark:text-purple-100">
              {t.settingsTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-purple-950 dark:hover:text-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950/60 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-4 text-xs">
          {/* Theme Appearance Mode Toggle */}
          <div className="space-y-1.5 p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-200/70 dark:border-purple-800/50">
            <div className="flex items-center justify-between">
              <label className="text-purple-950 dark:text-purple-200 font-bold block">
                {t.themeLabel}
              </label>
              <span className="text-[10px] font-mono font-semibold text-purple-700 dark:text-purple-300">
                {isDarkMode ? t.darkMode : t.lightMode}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  if (isDarkMode && onToggleTheme) onToggleTheme();
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  !isDarkMode
                    ? 'bg-white text-purple-950 shadow-md border border-purple-300 ring-2 ring-purple-200'
                    : 'bg-transparent text-slate-400 hover:text-slate-200 border border-slate-700/60'
                }`}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                <span>{t.lightMode}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (!isDarkMode && onToggleTheme) onToggleTheme();
                }}
                className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  isDarkMode
                    ? 'bg-purple-900/90 text-purple-100 shadow-md border border-purple-500 ring-2 ring-purple-500/40'
                    : 'bg-transparent text-slate-500 hover:text-slate-700 border border-purple-200'
                }`}
              >
                <Moon className="w-4 h-4 text-purple-300" />
                <span>{t.darkMode}</span>
              </button>
            </div>
          </div>

          {/* Sampling Rate */}
          <div className="space-y-1.5">
            <label className="text-slate-700 dark:text-slate-300 font-bold block">
              {t.sensorSamplingRate}
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {['128 Hz', '256 Hz', '512 Hz'].map((rate) => (
                <button
                  key={rate}
                  onClick={() => setSampleRate(rate)}
                  className={`py-1.5 rounded-xl font-mono text-[11px] border font-bold transition-all ${
                    sampleRate === rate
                      ? 'bg-purple-600 border-purple-600 text-white shadow-sm'
                      : 'bg-purple-50/80 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800/60 text-purple-900 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60'
                  }`}
                >
                  {rate}
                </button>
              ))}
            </div>
          </div>

          {/* Butterworth Filter */}
          <div className="space-y-1.5">
            <label className="text-slate-700 dark:text-slate-300 font-bold block">
              {t.butterworthCutoff}
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {['0.5 - 45 Hz', '1.0 - 50 Hz'].map((band) => (
                <button
                  key={band}
                  onClick={() => setCutoff(band)}
                  className={`py-1.5 rounded-xl font-mono text-[11px] border font-bold transition-all ${
                    cutoff === band
                      ? 'bg-purple-600 border-purple-600 text-white shadow-sm'
                      : 'bg-purple-50/80 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800/60 text-purple-900 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60'
                  }`}
                >
                  {band}
                </button>
              ))}
            </div>
          </div>

          {/* Differential Threshold */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-slate-700 dark:text-slate-300">
              <label className="font-bold">{t.calibThreshold}</label>
              <span className="font-mono text-purple-700 dark:text-purple-300 font-bold">{threshold.toFixed(2)} μS</span>
            </div>
            <input
              type="range"
              min="0.05"
              max="0.50"
              step="0.01"
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="w-full accent-purple-600 bg-purple-100 dark:bg-purple-950/80 rounded-lg cursor-pointer"
            />
          </div>
          {/* Replay Startup & Loading Animation */}
          {onReplayIntro && (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onReplayIntro();
                }}
                className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-purple-900 dark:text-purple-200 bg-purple-50/80 dark:bg-purple-950/50 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800/60 transition-all flex items-center justify-center gap-2 active:scale-98"
              >
                <RotateCcw className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                <span>{t.replayBoot}</span>
              </button>
            </div>
          )}
        </div>

        <button
          onClick={handleSave}
          className="w-full mt-2 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:opacity-95 transition-all flex items-center justify-center gap-1.5 shadow-md"
        >
          {saved ? <Check className="w-4 h-4" /> : null}
          <span>{saved ? 'Applied' : t.saveSettings}</span>
        </button>
      </motion.div>
    </motion.div>
  );
};
