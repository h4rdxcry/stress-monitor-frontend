import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ScreenId, Language, BleStatus, UserRole, WaveformData, DiagnosticResult } from './types';
import { OpeningSequence } from './components/OpeningSequence';
import { MobileFrame } from './components/MobileFrame';
import { HeaderBar } from './components/HeaderBar';
import { ScreenPortalSelection } from './components/ScreenPortalSelection';
import { ScreenTestStress } from './components/ScreenTestStress';
import { InferenceModal } from './components/InferenceModal';
import { ScreenDiagnosticReport } from './components/ScreenDiagnosticReport';
import { SettingsModal } from './components/SettingsModal';
import { ExportModal } from './components/ExportModal';
import { 
  benchmarkStressEeg, 
  benchmarkStressGsr,
  evaluateMultimodalBiomarkers 
} from './data/sampleSignals';
import { triggerReportGeneratedHaptic } from './utils/haptics';

export default function App() {
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('gateway');
  const [language, setLanguage] = useState<Language>('en');
  const [bleStatus, setBleStatus] = useState<BleStatus>('synced');
  const [, setUserRole] = useState<UserRole>('doctor');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleToggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  // Biomarker slots
  const [eegData, setEegData] = useState<WaveformData | null>(benchmarkStressEeg);
  const [gsrData, setGsrData] = useState<WaveformData | null>(benchmarkStressGsr);

  // In-flight inference modal
  const [isInferenceActive, setIsInferenceActive] = useState<boolean>(false);

  // Diagnostic result
  const [diagnosticResult, setDiagnosticResult] = useState<DiagnosticResult | null>(() =>
    evaluateMultimodalBiomarkers(benchmarkStressEeg, benchmarkStressGsr)
  );

  // Contextual modals
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);

  // Language toggle handler
  const handleToggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ta' : 'en'));
  };

  // BLE status toggle
  const handleToggleBle = () => {
    setBleStatus((prev) => (prev === 'synced' ? 'searching' : 'synced'));
  };

  // Role select from Gateway Screen
  const handleSelectRole = (role: UserRole) => {
    setUserRole(role);
    setCurrentScreen('test-stress');
  };

  // Start AI Assessment -> Trigger Inference Modal
  const handleStartAssessment = () => {
    if (!eegData || !gsrData) return;
    setIsInferenceActive(true);
  };

  // Inference finished -> Calculate result & update Diagnostic Results Card
  const handleInferenceComplete = () => {
    setIsInferenceActive(false);
    if (eegData && gsrData) {
      const res = evaluateMultimodalBiomarkers(eegData, gsrData);
      setDiagnosticResult(res);
      triggerReportGeneratedHaptic();
      setCurrentScreen('report');
    }
  };

  // Reset assessment to test new waveforms
  const handleResetAssessment = () => {
    setEegData(null);
    setGsrData(null);
    setDiagnosticResult(null);
    setCurrentScreen('test-stress');
  };

  return (
    <>
      {/* Opening Cinematic App Animation */}
      <AnimatePresence>
        {showIntro && (
          <OpeningSequence
            onComplete={() => setShowIntro(false)}
            language={language}
            isDarkMode={isDarkMode}
          />
        )}
      </AnimatePresence>

      <MobileFrame isDarkMode={isDarkMode} onToggleTheme={handleToggleTheme}>
        {/* Top Navigation / Header Bar */}
        <HeaderBar
          currentScreen={currentScreen}
          language={language}
          bleStatus={bleStatus}
          isDarkMode={isDarkMode}
          onLanguageToggle={handleToggleLanguage}
          onBleToggle={handleToggleBle}
          onToggleTheme={handleToggleTheme}
          onBack={() => {
            if (currentScreen === 'report') {
              setCurrentScreen('test-stress');
            } else if (currentScreen === 'test-stress') {
              setCurrentScreen('gateway');
            }
          }}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenExport={() => setIsExportOpen(true)}
        />

        {/* Screen Transitions */}
        <div className="flex-1 flex flex-col relative overflow-x-hidden">
          <AnimatePresence mode="wait">
            {currentScreen === 'gateway' && (
              <motion.div
                key="gateway"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 flex flex-col"
              >
                <ScreenPortalSelection
                  language={language}
                  onSelectRole={handleSelectRole}
                  onReplayIntro={() => setShowIntro(true)}
                />
              </motion.div>
            )}

            {currentScreen === 'test-stress' && (
              <motion.div
                key="test-stress"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 16 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 flex flex-col"
              >
                <ScreenTestStress
                  language={language}
                  eegData={eegData}
                  gsrData={gsrData}
                  diagnosticResult={diagnosticResult}
                  onSetEegData={setEegData}
                  onSetGsrData={setGsrData}
                  onAssess={handleStartAssessment}
                  onReset={handleResetAssessment}
                  onViewReport={() => setCurrentScreen('report')}
                  onOpenExport={() => setIsExportOpen(true)}
                />
              </motion.div>
            )}

            {currentScreen === 'report' && diagnosticResult && (
              <motion.div
                key="report"
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="flex-1 flex flex-col"
              >
                <ScreenDiagnosticReport
                  language={language}
                  result={diagnosticResult}
                  onNewAssessment={handleResetAssessment}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Screen 3: In-Flight Inference Modal */}
        <AnimatePresence>
          {isInferenceActive && (
            <InferenceModal
              language={language}
              onComplete={handleInferenceComplete}
            />
          )}
        </AnimatePresence>

        {/* Contextual Settings Sheet */}
        <AnimatePresence>
          {isSettingsOpen && (
            <SettingsModal
              language={language}
              isDarkMode={isDarkMode}
              onToggleTheme={handleToggleTheme}
              onReplayIntro={() => setShowIntro(true)}
              onClose={() => setIsSettingsOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Export Record Modal */}
        <AnimatePresence>
          {isExportOpen && diagnosticResult && (
            <ExportModal
              language={language}
              result={diagnosticResult}
              onClose={() => setIsExportOpen(false)}
            />
          )}
        </AnimatePresence>
      </MobileFrame>
    </>
  );
}
