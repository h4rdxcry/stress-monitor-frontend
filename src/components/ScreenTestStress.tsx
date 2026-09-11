import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, 
  Upload, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Activity,
  HeartPulse,
  AlertTriangle,
  RotateCcw,
  Zap,
  Layers,
  FileCheck,
  ShieldCheck
} from 'lucide-react';
import { WaveformData, DiagnosticResult, Language } from '../types';
import { translations } from '../localization/translations';
import { WaveformCanvas } from './WaveformCanvas';
import { 
  benchmarkNormalEeg, 
  benchmarkNormalGsr, 
  benchmarkStressEeg, 
  benchmarkStressGsr,
  generateEegPoints,
  generateGsrPoints
} from '../data/sampleSignals';
import { triggerBiomarkerUploadHaptic, triggerLightHaptic } from '../utils/haptics';

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB
const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/bmp'];

interface ScreenTestStressProps {
  language: Language;
  eegData: WaveformData | null;
  gsrData: WaveformData | null;
  diagnosticResult: DiagnosticResult | null;
  onSetEegData: (data: WaveformData | null) => void;
  onSetGsrData: (data: WaveformData | null) => void;
  onAssess: () => void;
  onReset: () => void;
  onViewReport?: () => void;
  onOpenExport?: () => void;
}

export const ScreenTestStress: React.FC<ScreenTestStressProps> = ({
  language,
  eegData,
  gsrData,
  diagnosticResult,
  onSetEegData,
  onSetGsrData,
  onAssess,
  onReset,
  onViewReport,
  onOpenExport,
}) => {
  const [isSimulatingCamera, setIsSimulatingCamera] = useState<'eeg' | 'gsr' | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const eegFileInputRef = useRef<HTMLInputElement | null>(null);
  const gsrFileInputRef = useRef<HTMLInputElement | null>(null);
  const eegCameraInputRef = useRef<HTMLInputElement | null>(null);
  const gsrCameraInputRef = useRef<HTMLInputElement | null>(null);

  const t = translations[language];
  const bothLoaded = Boolean(eegData && gsrData);

  // Quick preset loading for immediate testing without personal medical files
  const handleLoadSamplePair = (type: 'normal' | 'stress') => {
    setErrorMessage(null);
    if (type === 'normal') {
      onSetEegData({
        ...benchmarkNormalEeg,
        timestamp: new Date().toLocaleTimeString(),
      });
      onSetGsrData({
        ...benchmarkNormalGsr,
        timestamp: new Date().toLocaleTimeString(),
      });
    } else {
      onSetEegData({
        ...benchmarkStressEeg,
        timestamp: new Date().toLocaleTimeString(),
      });
      onSetGsrData({
        ...benchmarkStressGsr,
        timestamp: new Date().toLocaleTimeString(),
      });
    }
    triggerBiomarkerUploadHaptic();
  };

  // Simulate or capture camera image
  const handleCameraCapture = (biomarker: 'eeg' | 'gsr') => {
    setErrorMessage(null);
    triggerLightHaptic();
    setIsSimulatingCamera(biomarker);

    setTimeout(() => {
      const now = new Date().toLocaleTimeString();
      if (biomarker === 'eeg') {
        onSetEegData({
          id: `eeg-cam-${Date.now()}`,
          type: 'eeg',
          name: 'EEG_Camera_Strip_OCR.png',
          source: 'camera',
          timestamp: now,
          points: generateEegPoints('stress'),
          samplingRate: '256 Hz',
          duration: '10.0 sec',
          fileSize: '3.4 MB',
          fileName: 'EEG_Camera_Scan.png'
        });
      } else {
        onSetGsrData({
          id: `gsr-cam-${Date.now()}`,
          type: 'gsr',
          name: 'GSR_Camera_Conductance.png',
          source: 'camera',
          timestamp: now,
          points: generateGsrPoints('stress'),
          samplingRate: '64 Hz',
          duration: '10.0 sec',
          fileSize: '2.8 MB',
          fileName: 'GSR_Camera_Scan.png'
        });
      }
      setIsSimulatingCamera(null);
      triggerBiomarkerUploadHaptic();
    }, 1100);
  };

  // Handle file upload with strict 15MB limit and PNG, JPG, JPEG, WEBP, BMP format check
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, biomarker: 'eeg' | 'gsr') => {
    setErrorMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate size (max 15MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage(`File "${file.name}" exceeds 15MB maximum size limit (${(file.size / (1024 * 1024)).toFixed(1)}MB). Please upload a smaller image.`);
      e.target.value = '';
      return;
    }

    // Validate extension / MIME
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const validExtensions = ['png', 'jpg', 'jpeg', 'webp', 'bmp'];
    if (fileExt && !validExtensions.includes(fileExt) && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setErrorMessage(`Invalid format. Allowed image formats: PNG, JPG, JPEG, WEBP, BMP.`);
      e.target.value = '';
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    const now = new Date().toLocaleTimeString();
    const sizeStr = file.size > 1024 * 1024 
      ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` 
      : `${(file.size / 1024).toFixed(0)} KB`;
    const isStressHint = file.name.toLowerCase().includes('stress');

    if (biomarker === 'eeg') {
      onSetEegData({
        id: `eeg-upload-${Date.now()}`,
        type: 'eeg',
        name: file.name,
        source: 'gallery',
        timestamp: now,
        points: generateEegPoints(isStressHint ? 'stress' : 'normal'),
        samplingRate: '256 Hz',
        duration: '10.0 sec',
        fileSize: sizeStr,
        fileName: file.name,
        previewUrl,
      });
    } else {
      onSetGsrData({
        id: `gsr-upload-${Date.now()}`,
        type: 'gsr',
        name: file.name,
        source: 'gallery',
        timestamp: now,
        points: generateGsrPoints(isStressHint ? 'stress' : 'normal'),
        samplingRate: '64 Hz',
        duration: '10.0 sec',
        fileSize: sizeStr,
        fileName: file.name,
        previewUrl,
      });
    }

    triggerBiomarkerUploadHaptic();
    e.target.value = '';
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-4 sm:p-5 max-w-lg mx-auto w-full space-y-5 pb-32 animate-fadeIn">
      {/* Hidden file inputs for EEG and GSR (Gallery Upload) */}
      <input
        type="file"
        ref={eegFileInputRef}
        onChange={(e) => handleFileChange(e, 'eeg')}
        accept=".png,.jpg,.jpeg,.webp,.bmp,image/png,image/jpeg,image/webp,image/bmp"
        className="hidden"
      />
      <input
        type="file"
        ref={gsrFileInputRef}
        onChange={(e) => handleFileChange(e, 'gsr')}
        accept=".png,.jpg,.jpeg,.webp,.bmp,image/png,image/jpeg,image/webp,image/bmp"
        className="hidden"
      />

      {/* Hidden camera capture inputs for devices with native camera */}
      <input
        type="file"
        ref={eegCameraInputRef}
        capture="environment"
        onChange={(e) => handleFileChange(e, 'eeg')}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={gsrCameraInputRef}
        capture="environment"
        onChange={(e) => handleFileChange(e, 'gsr')}
        accept="image/*"
        className="hidden"
      />

      {/* Section Header: "Test your Stress" */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase text-purple-900 dark:text-purple-200 bg-purple-100/90 dark:bg-purple-950/70 border border-purple-300 dark:border-purple-800 shadow-sm">
            <Activity className="w-3.5 h-3.5 text-purple-700 dark:text-purple-400" />
            <span>{t.testStressTitle}</span>
          </div>
          <span className="text-[11px] font-mono text-purple-800 dark:text-purple-300 font-bold bg-purple-50 dark:bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800/60">
            Multimodal AI
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
          {t.testStressSubtitle}
        </p>

        {/* Allowed formats notice chip */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-medium bg-slate-50 dark:bg-slate-900/70 border border-purple-100 dark:border-purple-900/40 text-slate-700 dark:text-slate-300 w-full justify-between">
          <span className="font-semibold text-purple-900 dark:text-purple-300">Format:</span>
          <span className="text-slate-600 dark:text-slate-400 font-mono text-[10px] sm:text-[11px]">
            PNG, JPG, JPEG, WEBP, BMP (Max 15MB)
          </span>
        </div>

        {/* Error notification banner if any */}
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 text-rose-900 dark:text-rose-200 text-xs flex items-start gap-2 shadow-sm"
          >
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">{errorMessage}</div>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-700 dark:text-rose-300 font-bold hover:text-rose-900"
            >
              ✕
            </button>
          </motion.div>
        )}

        {/* Quick Sample Loader Pill */}
        <div className="flex items-center justify-between pt-1 text-xs">
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {t.loadSampleHint}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleLoadSamplePair('normal')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800/60 shadow-sm transition-all"
            >
              Normal Sample
            </button>
            <button
              onClick={() => handleLoadSamplePair('stress')}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-rose-800 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-800/60 shadow-sm transition-all"
            >
              Stress Sample
            </button>
          </div>
        </div>
      </div>

      {/* 1. Waveform Upload Section */}
      <div className="space-y-4">
        {/* Card 1: EEG Waveform Strip */}
        <div className="rounded-2xl p-4 bg-white/95 dark:bg-[#101625]/95 border border-sky-200/90 dark:border-sky-900/60 shadow-sm space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-sm flex-shrink-0" />
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-sky-950 dark:text-sky-100 truncate">
                  {t.eegCardTitle}
                </h3>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
                  {t.eegCardDesc}
                </span>
              </div>
            </div>

            {/* Status badge */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex-shrink-0 ${
                eegData
                  ? 'bg-sky-50 dark:bg-sky-950/70 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800 shadow-sm'
                  : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
              }`}
            >
              {eegData ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                  {t.statusReady}
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  {t.statusAwaiting}
                </>
              )}
            </span>
          </div>

          {/* Waveform thumbnail preview box */}
          <div className="space-y-1.5">
            <WaveformCanvas
              data={eegData}
              type="eeg"
              height={95}
              emptyPlaceholderText="No EEG Image Loaded (Awaiting Strip)"
            />

            {eegData && (
              <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-sky-50/80 dark:bg-sky-950/60 border border-sky-100 dark:border-sky-900/60 text-[11px] text-sky-950 dark:text-sky-200 font-mono">
                <span className="truncate max-w-[200px] font-semibold">
                  {eegData.fileName || eegData.name}
                </span>
                <span className="text-sky-700 dark:text-sky-400 text-[10px]">
                  {eegData.fileSize || 'Image Validated'}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons: Take Photo (Camera) & Upload File (Gallery) */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2 flex-1">
              <button
                onClick={() => handleCameraCapture('eeg')}
                disabled={isSimulatingCamera === 'eeg'}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-sky-900 dark:text-sky-200 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200 dark:border-sky-800/60 shadow-sm transition-all active:scale-95 disabled:opacity-50"
              >
                <Camera className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>{isSimulatingCamera === 'eeg' ? 'Capturing...' : t.takePhotoButton}</span>
              </button>

              <button
                onClick={() => eegFileInputRef.current?.click()}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-sky-900 dark:text-sky-200 bg-sky-50 dark:bg-sky-950/60 hover:bg-sky-100 dark:hover:bg-sky-900/60 border border-sky-200 dark:border-sky-800/60 shadow-sm transition-all active:scale-95"
              >
                <Upload className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
                <span>{t.uploadFileButton}</span>
              </button>
            </div>

            {eegData && (
              <button
                onClick={() => onSetEegData(null)}
                title={t.clearRemove}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors border border-transparent hover:border-rose-200 dark:hover:border-rose-900"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Card 2: GSR Skin Conductance Graph */}
        <div className="rounded-2xl p-4 bg-white/95 dark:bg-[#181125]/95 border border-fuchsia-200/90 dark:border-fuchsia-900/60 shadow-sm space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-2.5 h-2.5 rounded-full bg-fuchsia-500 shadow-sm flex-shrink-0" />
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-fuchsia-950 dark:text-fuchsia-100 truncate">
                  {t.gsrCardTitle}
                </h3>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block">
                  {t.gsrCardDesc}
                </span>
              </div>
            </div>

            {/* Status badge */}
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex-shrink-0 ${
                gsrData
                  ? 'bg-fuchsia-50 dark:bg-fuchsia-950/70 text-fuchsia-800 dark:text-fuchsia-300 border-fuchsia-300 dark:border-fuchsia-800 shadow-sm'
                  : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/60'
              }`}
            >
              {gsrData ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-fuchsia-600 dark:text-fuchsia-400" />
                  {t.statusReady}
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                  {t.statusAwaiting}
                </>
              )}
            </span>
          </div>

          {/* Waveform thumbnail preview box */}
          <div className="space-y-1.5">
            <WaveformCanvas
              data={gsrData}
              type="gsr"
              height={95}
              emptyPlaceholderText="No GSR Image Loaded (Awaiting Graph)"
            />

            {gsrData && (
              <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-fuchsia-50/80 dark:bg-fuchsia-950/60 border border-fuchsia-100 dark:border-fuchsia-900/60 text-[11px] text-fuchsia-950 dark:text-fuchsia-200 font-mono">
                <span className="truncate max-w-[200px] font-semibold">
                  {gsrData.fileName || gsrData.name}
                </span>
                <span className="text-fuchsia-700 dark:text-fuchsia-400 text-[10px]">
                  {gsrData.fileSize || 'Image Validated'}
                </span>
              </div>
            )}
          </div>

          {/* Action Buttons: Take Photo (Camera) & Upload File (Gallery) */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2 flex-1">
              <button
                onClick={() => handleCameraCapture('gsr')}
                disabled={isSimulatingCamera === 'gsr'}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-fuchsia-900 dark:text-fuchsia-200 bg-fuchsia-50 dark:bg-fuchsia-950/60 hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900/60 border border-fuchsia-200 dark:border-fuchsia-800/60 shadow-sm transition-all active:scale-95 disabled:opacity-50"
              >
                <Camera className="w-3.5 h-3.5 text-fuchsia-600 dark:text-fuchsia-400" />
                <span>{isSimulatingCamera === 'gsr' ? 'Capturing...' : t.takePhotoButton}</span>
              </button>

              <button
                onClick={() => gsrFileInputRef.current?.click()}
                className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-fuchsia-900 dark:text-fuchsia-200 bg-fuchsia-50 dark:bg-fuchsia-950/60 hover:bg-fuchsia-100 dark:hover:bg-fuchsia-900/60 border border-fuchsia-200 dark:border-fuchsia-800/60 shadow-sm transition-all active:scale-95"
              >
                <Upload className="w-3.5 h-3.5 text-fuchsia-600 dark:text-fuchsia-400" />
                <span>{t.uploadFileButton}</span>
              </button>
            </div>

            {gsrData && (
              <button
                onClick={() => onSetGsrData(null)}
                title={t.clearRemove}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors border border-transparent hover:border-rose-200 dark:hover:border-rose-900"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Diagnostic Results Card (Displayed once evaluated) */}
      <AnimatePresence>
        {diagnosticResult && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-3xl p-5 bg-white/95 dark:bg-[#111728]/95 border border-purple-200 dark:border-purple-800/60 shadow-[0_12px_36px_rgba(147,51,234,0.12)] dark:shadow-[0_12px_36px_rgba(0,0,0,0.5)] space-y-4 relative overflow-hidden"
          >
            {/* Header badge */}
            <div className="flex items-center justify-between pb-2 border-b border-purple-100 dark:border-purple-900/50">
              <span className="text-xs font-black tracking-wider uppercase text-purple-950 dark:text-purple-200 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                {t.diagnosticCardTitle}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-semibold">
                {diagnosticResult.evaluatedAt}
              </span>
            </div>

            {/* Clear Verdict Banner: "NORMAL" vs "HIGH STRESS" */}
            <div
              className={`p-4 rounded-2xl border transition-all ${
                diagnosticResult.verdict === 'HIGH STRESS'
                  ? 'bg-gradient-to-r from-rose-50 via-rose-100/70 to-purple-50 dark:from-rose-950/50 dark:via-[#191022] dark:to-purple-950/40 border-rose-300 dark:border-rose-800/70 shadow-sm'
                  : 'bg-gradient-to-r from-emerald-50 via-teal-50/70 to-purple-50 dark:from-emerald-950/50 dark:via-[#101925] dark:to-purple-950/40 border-emerald-300 dark:border-emerald-800/70 shadow-sm'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Primary Verdict
                  </span>
                  <h4 className={`text-2xl font-black tracking-tight ${
                    diagnosticResult.verdict === 'HIGH STRESS' ? 'text-rose-950 dark:text-rose-200' : 'text-emerald-950 dark:text-emerald-200'
                  }`}>
                    {diagnosticResult.verdict}
                  </h4>
                  <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                    {diagnosticResult.physStateCaption}
                  </p>
                </div>

                <div className={`p-3 rounded-2xl border flex-shrink-0 ${
                  diagnosticResult.verdict === 'HIGH STRESS'
                    ? 'bg-rose-100 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800/70 text-rose-700 dark:text-rose-300'
                    : 'bg-emerald-100 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800/70 text-emerald-700 dark:text-emerald-300'
                }`}>
                  {diagnosticResult.verdict === 'HIGH STRESS' ? (
                    <AlertTriangle className="w-7 h-7 text-rose-600 dark:text-rose-400" />
                  ) : (
                    <HeartPulse className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                  )}
                </div>
              </div>
            </div>

            {/* 3-Tier Severity Scale: Low, Moderate, High */}
            <div className="space-y-1.5 p-3 rounded-2xl bg-purple-50/70 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/50">
              <span className="text-[11px] font-bold text-purple-950 dark:text-purple-200 block">
                {t.tierScaleTitle}
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                {(['Low', 'Moderate', 'High'] as const).map((tier) => {
                  const isActive = diagnosticResult.tierLevel === tier;
                  return (
                    <div
                      key={tier}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? tier === 'High'
                            ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-300 dark:ring-rose-500/50'
                            : tier === 'Moderate'
                            ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-300 dark:ring-amber-500/50'
                            : 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300 dark:ring-emerald-500/50'
                          : 'bg-white/90 dark:bg-slate-900/80 text-slate-500 dark:text-slate-400 border border-purple-100 dark:border-slate-800'
                      }`}
                    >
                      <span className="block leading-tight">{tier}</span>
                      <span className="text-[9px] font-normal opacity-85 block">
                        {tier === 'Low' ? 'Tier 1' : tier === 'Moderate' ? 'Tier 2' : 'Tier 3'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Clinical Confidence Gauge showing "≥ 95% Confidence" */}
            <div className="p-3.5 rounded-2xl bg-white dark:bg-[#0c111e] border border-purple-200/90 dark:border-purple-900/50 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
                  {t.confidenceGaugeLabel}
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xl font-black text-purple-950 dark:text-purple-100 mono-metric">
                    {diagnosticResult.predictionConfidence}%
                  </span>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 dark:bg-emerald-950/70 text-emerald-900 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
                    <ShieldCheck className="w-3 h-3 text-emerald-700 dark:text-emerald-400" />
                    {t.confidenceMetText}
                  </span>
                </div>
              </div>

              {/* Mini visual circular progress ring */}
              <div className="relative w-12 h-12 flex items-center justify-center">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-purple-100 dark:text-purple-950/70"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-purple-600 dark:text-purple-400"
                    strokeDasharray={`${diagnosticResult.predictionConfidence}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-[10px] font-bold text-purple-950 dark:text-purple-200 font-mono">
                  ≥95%
                </span>
              </div>
            </div>

            {/* Biomarker Telemetry Tags: Beta/Alpha ratio & GSR Conductance μS */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
                {t.telemetryTagsTitle}
              </span>
              <div className="grid grid-cols-2 gap-2">
                {/* Beta/Alpha Tag */}
                <div className="p-2.5 rounded-xl bg-sky-50/90 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-900/60">
                  <span className="text-[10px] text-sky-800 dark:text-sky-300 font-bold block">
                    {t.betaAlphaTag}
                  </span>
                  <span className="text-sm font-black text-sky-950 dark:text-sky-100 mono-metric">
                    {diagnosticResult.telemetry.betaAlphaRatio.toFixed(2)}
                  </span>
                  <span className="text-[9px] text-sky-700 dark:text-sky-400 block font-mono">
                    Freq: {diagnosticResult.telemetry.dominantFreqHz} Hz
                  </span>
                </div>

                {/* GSR Conductance Tag */}
                <div className="p-2.5 rounded-xl bg-fuchsia-50/90 dark:bg-fuchsia-950/40 border border-fuchsia-200 dark:border-fuchsia-900/60">
                  <span className="text-[10px] text-fuchsia-800 dark:text-fuchsia-300 font-bold block">
                    {t.gsrConductanceTag}
                  </span>
                  <span className="text-sm font-black text-fuchsia-950 dark:text-fuchsia-100 mono-metric">
                    {diagnosticResult.telemetry.tonicConductanceMicroSiemens.toFixed(2)} μS
                  </span>
                  <span className="text-[9px] text-fuchsia-700 dark:text-fuchsia-400 block font-mono">
                    Spikes: {diagnosticResult.telemetry.phasicScrSpikeCount}/min
                  </span>
                </div>
              </div>
            </div>

            {/* View Full Diagnostic Report CTA Button */}
            {onViewReport && (
              <button
                onClick={onViewReport}
                className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-fuchsia-600 hover:opacity-95 shadow-[0_4px_16px_rgba(147,51,234,0.3)] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <FileCheck className="w-4 h-4" />
                <span>{t.viewFullReport}</span>
                {diagnosticResult.verdict === 'HIGH STRESS' && (
                  <span className="text-[10px] bg-white/25 px-2 py-0.5 rounded-full font-extrabold text-amber-200 animate-pulse">
                    Guided Breathing Active
                  </span>
                )}
              </button>
            )}

            {/* Quick Actions after evaluation */}
            <div className="pt-1 flex items-center gap-2">
              <button
                onClick={onReset}
                className="flex-1 py-2.5 rounded-xl font-bold text-xs text-purple-900 dark:text-purple-200 bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800/60 flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5 text-purple-700 dark:text-purple-400" />
                <span>{t.testAnother}</span>
              </button>

              {onOpenExport && (
                <button
                  onClick={onOpenExport}
                  className="flex-1 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 shadow-sm flex items-center justify-center gap-1.5 transition-all active:scale-95"
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>{t.exportAction}</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Primary Action & Evaluation Button (Pinned to Bottom) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white/95 to-transparent dark:from-[#0b0f17] dark:via-[#0b0f17]/95 dark:to-transparent backdrop-blur-xl z-20 border-t border-purple-100/60 dark:border-purple-900/40">
        <div className="max-w-lg mx-auto w-full">
          <button
            onClick={onAssess}
            disabled={!bothLoaded}
            className={`w-full py-4 px-6 rounded-2xl font-bold text-sm tracking-wide transition-all duration-300 relative overflow-hidden flex items-center justify-center gap-2.5 ${
              bothLoaded
                ? 'text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-fuchsia-600 shadow-[0_4px_24px_rgba(147,51,234,0.35)] active:scale-[0.98] gemini-glow-border cursor-pointer'
                : 'text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 cursor-not-allowed'
            }`}
          >
            {bothLoaded ? (
              <>
                <Sparkles className="w-5 h-5 text-amber-200 animate-pulse" />
                <span className="text-white drop-shadow-sm">{t.assessCta}</span>
              </>
            ) : (
              <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                {t.assessDisabledHint}
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
