import React from 'react';
import { ArrowLeft, Sliders, Download, Globe, Bluetooth, Sun, Moon } from 'lucide-react';
import { ScreenId, Language, BleStatus } from '../types';
import { translations } from '../localization/translations';

interface HeaderBarProps {
  currentScreen: ScreenId;
  language: Language;
  bleStatus: BleStatus;
  isDarkMode?: boolean;
  onLanguageToggle: () => void;
  onBleToggle: () => void;
  onToggleTheme?: () => void;
  onBack?: () => void;
  onOpenSettings?: () => void;
  onOpenExport?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  currentScreen,
  language,
  bleStatus,
  isDarkMode = false,
  onLanguageToggle,
  onBleToggle,
  onToggleTheme,
  onBack,
  onOpenSettings,
  onOpenExport,
}) => {
  const t = translations[language];

  if (currentScreen === 'gateway') {
    // Screen 1: Portal Selection Header Bar
    return (
      <header className="sticky top-0 z-30 w-full px-4 py-3 glass-nav transition-all">
        <div className="flex items-center justify-between gap-2 max-w-lg mx-auto">
          {/* Live hardware status indicator badge with unique emerald/amber styling */}
          <button
            onClick={onBleToggle}
            title="Toggle Bluetooth Hardware Status"
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-tight border transition-all duration-200 active:scale-95 ${
              bleStatus === 'synced'
                ? 'bg-emerald-50/90 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 shadow-sm'
                : 'bg-amber-50/90 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-300 shadow-sm'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  bleStatus === 'synced' ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2 w-2 ${
                  bleStatus === 'synced' ? 'bg-emerald-600 dark:bg-emerald-400' : 'bg-amber-600 dark:bg-amber-400'
                }`}
              />
            </span>
            <Bluetooth className="w-3.5 h-3.5 ml-0.5 text-emerald-700 dark:text-emerald-400" />
            <span className="truncate">
              {bleStatus === 'synced' ? t.bleSynced : t.bleSearching}
            </span>
          </button>

          {/* Right Action Icons: Language selector + Dark Mode toggle */}
          <div className="flex items-center gap-2">
            {/* User-Toggleable Dark / Light Mode Button */}
            <button
              onClick={onToggleTheme}
              title={isDarkMode ? t.lightMode : t.darkMode}
              className="p-1.5 rounded-full text-purple-900 dark:text-purple-200 bg-purple-50/90 dark:bg-purple-950/70 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800/60 shadow-sm transition-all active:scale-95"
              aria-label={isDarkMode ? t.lightMode : t.darkMode}
            >
              {isDarkMode ? (
                <Sun className="w-3.5 h-3.5 text-amber-300 transition-transform duration-300 rotate-0 hover:rotate-45" />
              ) : (
                <Moon className="w-3.5 h-3.5 text-purple-600 transition-transform duration-300" />
              )}
            </button>

            {/* Language selector button with purple-lavender styling */}
            <button
              onClick={onLanguageToggle}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide text-purple-900 dark:text-purple-200 bg-purple-50/90 dark:bg-purple-950/70 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800/60 shadow-sm transition-all active:scale-95"
            >
              <Globe className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
              <span>{language === 'en' ? 'தமிழ்' : 'English'}</span>
            </button>
          </div>
        </div>
      </header>
    );
  }

  if (currentScreen === 'test-stress') {
    // Screen 2: Test your Stress Header Bar
    return (
      <header className="sticky top-0 z-30 w-full px-4 py-3 glass-nav transition-all">
        <div className="flex items-center justify-between gap-2 max-w-lg mx-auto">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="p-2 -ml-1 rounded-full text-slate-700 dark:text-slate-300 hover:text-purple-950 dark:hover:text-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950/60 transition-all active:scale-95"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Screen Title */}
          <h1 className="text-base font-bold tracking-tight text-purple-950 dark:text-purple-100 truncate text-center flex-1">
            {t.hubTitle}
          </h1>

          {/* Contextual Action Icons: Theme toggle + Language switch + Settings */}
          <div className="flex items-center gap-1">
            <button
              onClick={onToggleTheme}
              title={isDarkMode ? t.lightMode : t.darkMode}
              className="p-2 rounded-full text-purple-700 dark:text-purple-300 hover:text-purple-950 dark:hover:text-purple-100 hover:bg-purple-50 dark:hover:bg-purple-950/60 transition-all active:scale-95"
              aria-label={isDarkMode ? t.lightMode : t.darkMode}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-300 transition-transform duration-300 hover:rotate-45" />
              ) : (
                <Moon className="w-4 h-4 text-purple-600 transition-transform duration-300" />
              )}
            </button>
            <button
              onClick={onLanguageToggle}
              title="Switch Language"
              className="px-2 py-1 rounded-full text-purple-900 dark:text-purple-300 font-bold hover:bg-purple-50 dark:hover:bg-purple-950/60 transition-all text-xs"
            >
              {language === 'en' ? 'தமிழ்' : 'EN'}
            </button>
            <button
              onClick={onOpenSettings}
              className="p-2 -mr-1 rounded-full text-purple-700 dark:text-purple-300 hover:text-purple-950 dark:hover:text-purple-100 hover:bg-purple-50 dark:hover:bg-purple-950/60 transition-all active:scale-95"
              aria-label="DSP Settings"
            >
              <Sliders className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </button>
          </div>
        </div>
      </header>
    );
  }

  // Screen 4: Diagnostic Assessment Report Header Bar
  return (
    <header className="sticky top-0 z-30 w-full px-4 py-3 glass-nav transition-all">
      <div className="flex items-center justify-between gap-2 max-w-lg mx-auto">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="p-2 -ml-1 rounded-full text-slate-700 dark:text-slate-300 hover:text-purple-950 dark:hover:text-purple-200 hover:bg-purple-50 dark:hover:bg-purple-950/60 transition-all active:scale-95"
          aria-label="Go Back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Screen Title */}
        <h1 className="text-base font-bold tracking-tight text-purple-950 dark:text-purple-100 truncate text-center flex-1">
          {t.reportTitle}
        </h1>

        {/* Export PDF/CSV Action Icon + Theme Toggle */}
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleTheme}
            title={isDarkMode ? t.lightMode : t.darkMode}
            className="p-2 rounded-full text-purple-700 dark:text-purple-300 hover:text-purple-950 dark:hover:text-purple-100 hover:bg-purple-50 dark:hover:bg-purple-950/60 transition-all active:scale-95"
            aria-label={isDarkMode ? t.lightMode : t.darkMode}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-300 transition-transform duration-300 hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-purple-600 transition-transform duration-300" />
            )}
          </button>
          <button
            onClick={onLanguageToggle}
            title="Switch Language"
            className="px-2 py-1 rounded-full text-purple-900 dark:text-purple-300 font-bold hover:bg-purple-50 dark:hover:bg-purple-950/60 transition-all text-xs"
          >
            {language === 'en' ? 'தமிழ்' : 'EN'}
          </button>
          <button
            onClick={onOpenExport}
            className="p-2 -mr-1 rounded-full text-purple-700 dark:text-purple-300 hover:text-purple-950 dark:hover:text-purple-100 hover:bg-purple-50 dark:hover:bg-purple-950/60 transition-all active:scale-95"
            aria-label="Export PDF/CSV"
            title={t.exportAction}
          >
            <Download className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </button>
        </div>
      </div>
    </header>
  );
};
