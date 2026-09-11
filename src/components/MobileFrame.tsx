import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Maximize2, Minimize2, Vibrate, Sun, Moon } from 'lucide-react';
import { HAPTIC_FEEDBACK_EVENT, HapticEventDetail } from '../utils/haptics';

interface MobileFrameProps {
  children: React.ReactNode;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
}

export const MobileFrame: React.FC<MobileFrameProps> = ({
  children,
  isDarkMode = false,
  onToggleTheme,
}) => {
  const [time, setTime] = useState<string>('09:41');
  const [isFullWindow, setIsFullWindow] = useState<boolean>(false);
  const [activeHaptic, setActiveHaptic] = useState<HapticEventDetail | null>(null);

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      setTime(
        d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleHaptic = (e: Event) => {
      const customEvent = e as CustomEvent<HapticEventDetail>;
      if (customEvent.detail) {
        setActiveHaptic(customEvent.detail);
        const timer = setTimeout(() => {
          setActiveHaptic(null);
        }, 1800);
        return () => clearTimeout(timer);
      }
    };

    window.addEventListener(HAPTIC_FEEDBACK_EVENT, handleHaptic);
    return () => window.removeEventListener(HAPTIC_FEEDBACK_EVENT, handleHaptic);
  }, []);

  return (
    <div className={`min-h-screen w-full bg-gradient-to-br from-[#faf8ff] via-[#f5edff] to-[#f0e4ff] dark:from-[#0b0f17] dark:via-[#0e1320] dark:to-[#111728] text-slate-900 dark:text-slate-100 flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 select-none overflow-x-hidden relative transition-colors duration-300 ${isDarkMode ? 'dark' : ''}`}>
      {/* Background ambient atmospheric purple gradient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[700px] h-[600px] bg-gradient-to-b from-purple-300/30 via-violet-300/20 to-transparent dark:from-purple-900/25 dark:via-violet-900/15 dark:to-transparent rounded-full blur-[140px] transition-colors duration-500" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-fuchsia-300/20 dark:bg-fuchsia-900/15 rounded-full blur-[120px] transition-colors duration-500" />
        <div className="absolute top-1/2 right-10 w-80 h-80 bg-indigo-300/20 dark:bg-indigo-900/15 rounded-full blur-[120px] transition-colors duration-500" />
      </div>

      {/* Frame / Window toggle & Theme toggle for presentation convenience */}
      <div className="hidden sm:flex fixed top-3 right-4 z-50 items-center gap-2">
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-purple-950 dark:text-purple-200 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 border border-purple-200/80 dark:border-purple-800/80 backdrop-blur-md transition-all shadow-sm hover:shadow-md active:scale-95"
          >
            {isDarkMode ? (
              <>
                <Sun className="w-3.5 h-3.5 text-amber-400" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-purple-600" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
        )}

        <button
          onClick={() => setIsFullWindow(!isFullWindow)}
          title={isFullWindow ? 'Fit Mobile Frame' : 'Expand View'}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold text-purple-950 dark:text-purple-200 bg-white/90 dark:bg-slate-900/90 hover:bg-white dark:hover:bg-slate-800 border border-purple-200/80 dark:border-purple-800/80 backdrop-blur-md transition-all shadow-sm hover:shadow-md active:scale-95"
        >
          {isFullWindow ? (
            <>
              <Minimize2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Device Bezel</span>
            </>
          ) : (
            <>
              <Maximize2 className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>Full Canvas</span>
            </>
          )}
        </button>
      </div>

      {/* Mobile Device Chassis */}
      <div
        className={`w-full transition-all duration-300 relative ${
          isFullWindow
            ? 'max-w-xl min-h-screen bg-white/95 dark:bg-[#0d121d] shadow-2xl flex flex-col border-x border-purple-100 dark:border-purple-900/40'
            : 'max-w-[420px] min-h-[880px] sm:my-4 rounded-[48px] bg-white dark:bg-[#0d121d] border-[8px] sm:border-[10px] border-slate-200/90 dark:border-slate-800/90 shadow-[0_24px_64px_rgba(124,58,237,0.12),0_4px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_24px_64px_rgba(0,0,0,0.7),0_0_30px_rgba(147,51,234,0.15)] flex flex-col overflow-hidden ring-1 ring-purple-300/40 dark:ring-purple-500/30'
        }`}
      >
        {/* Realistic Status Bar with Dynamic Island */}
        <div className="sticky top-0 z-40 w-full pt-2.5 px-6 flex items-center justify-between text-xs font-medium text-slate-800 dark:text-slate-300 pointer-events-none bg-white/80 dark:bg-[#0d121d]/85 backdrop-blur-sm">
          {/* Status Time */}
          <span className="font-bold tracking-tight text-[13px] text-slate-900 dark:text-slate-100">{time}</span>

          {/* Dynamic Island Capsule */}
          <div
            className={`h-7 rounded-full bg-slate-950 dark:bg-[#06080e] border border-slate-800 dark:border-slate-700/60 flex items-center justify-center transition-all duration-300 shadow-sm px-2.5 ${
              activeHaptic
                ? 'w-48 bg-purple-950 border-purple-400/50 shadow-[0_0_15px_rgba(168,85,247,0.4)]'
                : 'w-24'
            }`}
          >
            {activeHaptic ? (
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-purple-200 animate-pulse truncate">
                <Vibrate className="w-3.5 h-3.5 text-purple-300 flex-shrink-0 animate-bounce" />
                <span className="truncate">{activeHaptic.label}</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-500/90 shadow-[0_0_6px_rgba(168,85,247,0.8)]" />
                <span className="w-2 h-2 rounded-full bg-slate-700 dark:bg-slate-600" />
              </div>
            )}
          </div>

          {/* Status Icons */}
          <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-300 font-semibold">
            <span className="text-[10px] font-bold text-slate-900 dark:text-slate-100">5G</span>
            <Wifi className="w-3.5 h-3.5 text-slate-800 dark:text-slate-300" />
            <Battery className="w-4 h-4 text-slate-800 dark:text-slate-300" />
          </div>
        </div>

        {/* Content Viewport */}
        <div className="flex-1 flex flex-col relative overflow-y-auto overflow-x-hidden bg-gradient-to-b from-white via-[#fcfaff] to-[#f9f5ff] dark:from-[#0d121d] dark:via-[#0f1422] dark:to-[#111625]">
          {children}
        </div>

        {/* Home Indicator Bar */}
        <div className="sticky bottom-0 z-40 w-full py-2 flex items-center justify-center pointer-events-none bg-white/70 dark:bg-[#0d121d]/80 backdrop-blur-sm">
          <div className="w-32 h-1 rounded-full bg-slate-400/50 dark:bg-slate-600/50 shadow-sm" />
        </div>
      </div>
    </div>
  );
};
