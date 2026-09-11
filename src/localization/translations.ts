import { Language } from '../types';

export interface TranslationSchema {
  // Screen 1: Portal & Gateway
  appTitle: string;
  appSubtitle: string;
  biomarkerTag: string;
  bleSynced: string;
  bleSearching: string;
  rolePatientTitle: string;
  rolePatientDesc: string;
  roleDoctorTitle: string;
  roleDoctorDesc: string;
  privacyBadge: string;
  replayIntro: string;
  skipIntro: string;
  enterDiagnosticHub: string;
  bootInitializing: string;
  bootCalibratingEeg: string;
  bootCalibratingGsr: string;
  bootAligningVectors: string;
  bootSystemReady: string;
  replayBoot: string;

  // Screen 2: Test your Stress Section
  hubTitle: string;
  testStressTitle: string;
  testStressSubtitle: string;
  allowedFormatsNotice: string;
  eegCardTitle: string;
  gsrCardTitle: string;
  eegCardDesc: string;
  gsrCardDesc: string;
  takePhotoButton: string;
  uploadFileButton: string;
  statusAwaiting: string;
  statusReady: string;
  assessCta: string;
  assessDisabledHint: string;
  clearRemove: string;
  loadSampleHint: string;
  loadNormalSample: string;
  loadStressSample: string;

  // Diagnostic Results Card
  diagnosticCardTitle: string;
  verdictNormal: string;
  verdictStress: string;
  physioCaptionNormal: string;
  physioCaptionStress: string;
  tierScaleTitle: string;
  tierLow: string;
  tierModerate: string;
  tierHigh: string;
  confidenceGaugeLabel: string;
  confidenceMetText: string;
  telemetryTagsTitle: string;
  betaAlphaTag: string;
  gsrConductanceTag: string;
  testAnother: string;

  // Screen 3: Inference Modal
  evaluatingTitle: string;
  step1: string;
  step2: string;
  step3: string;
  stepDone: string;
  targetBenchmark: string;
  inferenceNote: string;

  // Screen 4: Diagnostic Assessment Report
  reportTitle: string;
  exportAction: string;
  confidenceLabel: string;
  benchmarkTargetLabel: string;
  benchmarkMetBadge: string;
  tierLabel: string;
  analyzedStripsTitle: string;
  eegReviewLabel: string;
  gsrReviewLabel: string;
  telemetryTitle: string;
  eegPowerRatioLabel: string;
  betaAlphaLabel: string;
  dominantFreqLabel: string;
  gsrEdaLabel: string;
  tonicConductanceLabel: string;
  phasicScrLabel: string;
  calibrationStatusLabel: string;
  deltaFLabel: string;
  clinicalActionTitle: string;
  recommendationNormal: string;
  recommendationStress: string;
  performNewAssessment: string;
  exportModalTitle: string;
  exportModalDesc: string;
  downloadPdf: string;
  downloadCsv: string;
  close: string;

  // Text to Speech
  readReportTts: string;
  readingReportTts: string;
  stopReportTts: string;
  pauseReportTts: string;
  resumeReportTts: string;
  ttsNotSupported: string;
  ttsVoiceActive: string;

  // Settings
  settingsTitle: string;
  sensorSamplingRate: string;
  butterworthCutoff: string;
  calibThreshold: string;
  saveSettings: string;

  // Guided Breathing Biofeedback
  guidedBreathingTitle: string;
  guidedBreathingSubtitle: string;
  highStressAlertBadge: string;
  breathingInhale: string;
  breathingHold: string;
  breathingExhale: string;
  breathingRest: string;
  startBreathing: string;
  pauseBreathing: string;
  resumeBreathing: string;
  resetBreathing: string;
  cyclesCompleted: string;
  targetBreaths: string;
  biofeedbackPacing: string;
  parasympatheticGain: string;
  vagalToneActive: string;
  tactileHapticsLabel: string;
  viewFullReport: string;

  // Theme Mode
  darkMode: string;
  lightMode: string;
  themeLabel: string;
}

export const translations: Record<Language, TranslationSchema> = {
  en: {
    // Screen 1
    appTitle: "Multimodal Stress Monitoring System",
    appSubtitle: "Using EEG and GSR Biomarkers: Signal Processing and AI-Based Approaches",
    biomarkerTag: "32-Channel EEG + Galvanic Skin Response",
    bleSynced: "BLE Sensor Synced",
    bleSearching: "BLE Searching...",
    rolePatientTitle: "Patient Dashboard",
    rolePatientDesc: "Self-monitoring, personal stress score, wellness guidance.",
    roleDoctorTitle: "Doctor Diagnostic Portal",
    roleDoctorDesc: "In-depth waveform ingestion, telemetry, baseline calibration, and >=95% accuracy metrics.",
    privacyBadge: "100% on-device offline TensorFlow Lite inference — zero cloud data leakage.",
    replayIntro: "Replay Sequence",
    skipIntro: "Skip Intro",
    enterDiagnosticHub: "Enter Diagnostic Portal",
    bootInitializing: "Initializing Biometric Subsystems (BLE 5.3)...",
    bootCalibratingEeg: "Calibrating 10-20 EEG Multi-Channel Array (256 Hz)...",
    bootCalibratingGsr: "Acquiring Electrodermal Skin Conductance Baseline...",
    bootAligningVectors: "Aligning Dual-Stream Multimodal Feature Vectors...",
    bootSystemReady: "Biometric Telemetry Synchronized • Accuracy > 95%",
    replayBoot: "Replay Startup Animation",

    // Screen 2: Test your Stress
    hubTitle: "Test your Stress",
    testStressTitle: "Test your Stress",
    testStressSubtitle: "Optical Waveform Upload & Multimodal AI Diagnostic Evaluation",
    allowedFormatsNotice: "Allowed formats: PNG, JPG, JPEG, WEBP, BMP (Max 15MB)",
    eegCardTitle: "EEG Waveform Strip",
    gsrCardTitle: "GSR Skin Conductance Graph",
    eegCardDesc: "Fp1-F3 rhythm trace strip / brainwave capture",
    gsrCardDesc: "Electrodermal skin response (EDA) curve",
    takePhotoButton: "Take Photo (Camera)",
    uploadFileButton: "Upload File (Gallery)",
    statusAwaiting: "Awaiting Image",
    statusReady: "Loaded & Validated",
    assessCta: "Assess Waveforms (Run AI)",
    assessDisabledHint: "Upload both EEG and GSR waveforms to run AI evaluation",
    clearRemove: "Remove",
    loadSampleHint: "Test immediately with sample clinical waveforms:",
    loadNormalSample: "Sample Normal Pair",
    loadStressSample: "Sample High Stress Pair",

    // Diagnostic Results Card
    diagnosticCardTitle: "Diagnostic Results Card",
    verdictNormal: "NORMAL",
    verdictStress: "HIGH STRESS",
    physioCaptionNormal: "Synchronized Alpha Dominance & Basal Homeostasis",
    physioCaptionStress: "Elevated Beta Power & Sympathetic Tone",
    tierScaleTitle: "3-Tier Severity Scale",
    tierLow: "Low",
    tierModerate: "Moderate",
    tierHigh: "High",
    confidenceGaugeLabel: "Clinical Confidence Gauge",
    confidenceMetText: "≥ 95% Confidence",
    telemetryTagsTitle: "Biomarker Telemetry Tags",
    betaAlphaTag: "Beta/Alpha Ratio",
    gsrConductanceTag: "GSR Conductance (μS)",
    testAnother: "Test New Waveforms",

    // Screen 3
    evaluatingTitle: "Neural Inference Pipeline Active",
    step1: "Step 1: Optical Fourier Noise Filter...",
    step2: "Step 2: Differential Baseline Calibration (ΔF)...",
    step3: "Step 3: Multimodal Deep Learning Evaluation...",
    stepDone: "Complete",
    targetBenchmark: "Target Benchmark: >= 95.0%",
    inferenceNote: "Extracting spectral bands and electrodermal curves via on-device DSP",

    // Screen 4
    reportTitle: "Diagnostic Assessment Report",
    exportAction: "Export PDF/CSV",
    confidenceLabel: "Prediction Confidence",
    benchmarkTargetLabel: "Research Accuracy Target",
    benchmarkMetBadge: ">= 95.0% Benchmark Met",
    tierLabel: "3-Tier Classification Level",
    analyzedStripsTitle: "Uploaded Waveform Inspection",
    eegReviewLabel: "Analyzed EEG Strip (Ch Fp1-F3)",
    gsrReviewLabel: "Analyzed GSR/EDA Graph (Skin Conductance)",
    telemetryTitle: "Biomarker Telemetry Data",
    eegPowerRatioLabel: "EEG Power Ratio",
    betaAlphaLabel: "Beta/Alpha power ratio",
    dominantFreqLabel: "Dominant frequency (Hz)",
    gsrEdaLabel: "GSR Electrodermal Activity",
    tonicConductanceLabel: "Tonic baseline conductance (μS)",
    phasicScrLabel: "Phasic SCR spike count",
    calibrationStatusLabel: "Calibration Status",
    deltaFLabel: "Differential compensation offset (ΔF)",
    clinicalActionTitle: "Clinical Action & Wellness Recommendation",
    recommendationNormal: "Biomarkers indicate normative homeostatic parasympathetic equilibrium. Continue standard periodic telemetry monitoring.",
    recommendationStress: "Sympathetic hyperactivity detected. Recommend diaphragmatic biofeedback protocol and clinical stress management consultation.",
    performNewAssessment: "Perform New Assessment",
    exportModalTitle: "Export Clinical Diagnostic Record",
    exportModalDesc: "Generated cryptographic medical diagnostic summary ready for PACS / Electronic Health Record integration.",
    downloadPdf: "Download Diagnostic PDF Report",
    downloadCsv: "Export Raw Telemetry CSV",
    close: "Dismiss",

    // Text to Speech
    readReportTts: "Listen to Summary & Recommendations",
    readingReportTts: "Reading Report Summary...",
    stopReportTts: "Stop Audio",
    pauseReportTts: "Pause Audio",
    resumeReportTts: "Resume Audio",
    ttsNotSupported: "Speech synthesis not supported on this device/browser",
    ttsVoiceActive: "Speech Synthesis Engine Active",

    // Settings
    settingsTitle: "Biometric Hardware & DSP Config",
    sensorSamplingRate: "Sensor Sampling Frequency (Hz)",
    butterworthCutoff: "Butterworth Bandpass Filter (0.5 - 45 Hz)",
    calibThreshold: "Differential Baseline Threshold (ΔF)",
    saveSettings: "Apply Configuration",

    // Guided Breathing Biofeedback
    guidedBreathingTitle: "Biofeedback Guided Breathing",
    guidedBreathingSubtitle: "Vagal Nerve Stimulation & Sympathetic Tone Reduction",
    highStressAlertBadge: "High Stress Detected • Protocol Recommended",
    breathingInhale: "Breathe In (Inhale)",
    breathingHold: "Hold Breath",
    breathingExhale: "Slowly Release (Exhale)",
    breathingRest: "Gentle Rest",
    startBreathing: "Start Biofeedback",
    pauseBreathing: "Pause Session",
    resumeBreathing: "Resume",
    resetBreathing: "Reset",
    cyclesCompleted: "Cycles Completed",
    targetBreaths: "Target: 6 Breaths/min (0.1 Hz Resonant Frequency)",
    biofeedbackPacing: "Adaptive Resonant Pacing",
    parasympatheticGain: "Parasympathetic Tone",
    vagalToneActive: "Vagus Nerve Biofeedback Active",
    tactileHapticsLabel: "Tactile Haptics",
    viewFullReport: "View Full Diagnostic Report",

    // Theme Mode
    darkMode: "Dark Mode",
    lightMode: "Light Mode",
    themeLabel: "Theme Appearance"
  },
  ta: {
    // Screen 1
    appTitle: "பல்முறைமை மனஅழுத்த கண்காணிப்பு அமைப்பு",
    appSubtitle: "EEG மற்றும் GSR பயோமார்க் வழிமுறை: சமிக்ஞை செயலாக்கம் மற்றும் AI அணுகுமுறைகள்",
    biomarkerTag: "32-சேனல் EEG + தோல் மின்கடத்துத்திறன் (GSR)",
    bleSynced: "BLE உணரி இணைக்கப்பட்டது",
    bleSearching: "BLE தேடுகிறது...",
    rolePatientTitle: "நோயாளி கட்டுப்பாட்டு தளம்",
    rolePatientDesc: "சுய கண்காணிப்பு, தனிநபர் அழுத்த மதிப்பீடு, நல்வாழ்வு வழிகாட்டல்.",
    roleDoctorTitle: "மருத்துவ பரிசோதனை போர்ட்டல்",
    roleDoctorDesc: "ஆழமான அலைவடிவ பகுப்பாய்வு, டெலிமெட்ரி, ஆரம்ப அளவுத்திருத்தம் மற்றும் >=95% துல்லிய அளவீடுகள்.",
    privacyBadge: "100% சாதனத்தில் உள்ள ஆஃப்லைன் TensorFlow Lite மதிப்பீடு — கிளவுட் தரவு கசிவு இல்லை.",
    replayIntro: "மீண்டும் இயக்கு",
    skipIntro: "தவிர் (Skip)",
    enterDiagnosticHub: "கண்டறிதல் தளத்திற்குள் செல்க",
    bootInitializing: "பயோமெட்ரிக் அமைப்புகள் துவக்கப்படுகின்றன (BLE 5.3)...",
    bootCalibratingEeg: "10-20 EEG மூளை அலைவடிவ வரிசை அளவுத்திருத்தம் (256 Hz)...",
    bootCalibratingGsr: "GSR தோல் மின்கடத்துத்திறன் அடித்தள அளவீடு...",
    bootAligningVectors: "இரட்டை சமிக்ஞை நரம்பியல் அம்சங்கள் ஒத்திசைவு...",
    bootSystemReady: "டெலிமெட்ரி ஒத்திசைக்கப்பட்டது • துல்லியம் > 95%",
    replayBoot: "துவக்க அனிமேஷனை மீண்டும் இயக்கு",

    // Screen 2: Test your Stress
    hubTitle: "மனஅழுத்தப் பரிசோதனை",
    testStressTitle: "மனஅழுத்தப் பரிசோதனை (Test your Stress)",
    testStressSubtitle: "EEG மற்றும் GSR அலைவடிவ AI மதிப்பீடு",
    allowedFormatsNotice: "அனுமதிக்கப்பட்ட வடிவங்கள்: PNG, JPG, JPEG, WEBP, BMP (அதிகபட்சம் 15MB)",
    eegCardTitle: "EEG அலைவடிவப் பட்டை (EEG Waveform Strip)",
    gsrCardTitle: "GSR தோல் கடத்துத்திறன் வரைபடம் (GSR Skin Conductance)",
    eegCardDesc: "Fp1-F3 மூளை அலைவடிவப் பதிவு",
    gsrCardDesc: "தோல் மின்கடத்துத்திறன் (EDA) வரைபடம்",
    takePhotoButton: "படம் எடு (கேமரா)",
    uploadFileButton: "கோப்பை ஏற்று (கேலரி)",
    statusAwaiting: "படத்திற்காக காத்திருக்கிறது",
    statusReady: "ஏற்றப்பட்டு சரிபார்க்கப்பட்டது",
    assessCta: "அலைவடிவங்களை மதிப்பிடுக (Run AI)",
    assessDisabledHint: "AI மதிப்பீட்டை இயக்க EEG மற்றும் GSR இரண்டையும் பதிவேற்றவும்",
    clearRemove: "அகற்று",
    loadSampleHint: "மாதிரி மருத்துவ அலைவடிவங்களை உடனடியாகச் சோதிக்கவும்:",
    loadNormalSample: "இயல்பான மாதிரி ஜோடி",
    loadStressSample: "அழுத்த மாதிரி ஜோடி",

    // Diagnostic Results Card
    diagnosticCardTitle: "கண்டறிதல் முடிவுகள் அட்டை",
    verdictNormal: "NORMAL (இயல்பானது)",
    verdictStress: "HIGH STRESS (அதிக அழுத்தம்)",
    physioCaptionNormal: "ஒத்திசைக்கப்பட்ட ஆல்ஃபா நிலை & அடிப்படை சமநிலை",
    physioCaptionStress: "உயர்ந்த பீட்டா சக்தி & சிம்பதெடிக் தூண்டுதல்",
    tierScaleTitle: "3-நிலை தீவிர அளவு (3-Tier Scale)",
    tierLow: "குறைவு (Low)",
    tierModerate: "மிதம் (Moderate)",
    tierHigh: "அதிதீவிரம் (High)",
    confidenceGaugeLabel: "மருத்துவ நம்பிக்கை அளவு",
    confidenceMetText: "≥ 95% Confidence",
    telemetryTagsTitle: "பயோமார்க்கர் டெலிமெட்ரி குறிச்சொற்கள்",
    betaAlphaTag: "பீட்டா/ஆல்ஃபா விகிதம்",
    gsrConductanceTag: "GSR கடத்துத்திறன் (μS)",
    testAnother: "புதிய அலைவடிவங்களை சோதிக்கவும்",

    // Screen 3
    evaluatingTitle: "AI நியூரல் செயலாக்கக் குழாய் இயங்குகிறது",
    step1: "படி 1: அலைவடிவ சத்தம் வடிகட்டுதல்...",
    step2: "படி 2: வேறுபட்ட அடிப்படை அளவுத்திருத்தம் (ΔF)...",
    step3: "படி 3: நியூரல் நெட்வொர்க் பல்முறைமை வகைப்பாடு...",
    stepDone: "முடிந்தது",
    targetBenchmark: "இலக்கு துல்லியம்: >= 95.0%",
    inferenceNote: "சாதனத்தின் டிஜிட்டல் சிக்னல் செயலியில் 32-சேனல் அலைக்கற்றைகள் பகுப்பாய்வு செய்யப்படுகின்றன",

    // Screen 4
    reportTitle: "மருத்துவ மதிப்பீட்டு அறிக்கை",
    exportAction: "PDF/CSV ஏற்றுமதி",
    confidenceLabel: "கணிப்பு நம்பிக்கை",
    benchmarkTargetLabel: "ஆராய்ச்சி துல்லிய இலக்கு",
    benchmarkMetBadge: ">= 95.0% இலக்கு எட்டப்பட்டது",
    tierLabel: "3-நிலை வகைப்பாடு",
    analyzedStripsTitle: "ஆய்வு செய்யப்பட்ட அலைவடிவங்கள்",
    eegReviewLabel: "பகுப்பாய்வு செய்யப்பட்ட EEG பட்டை",
    gsrReviewLabel: "பகுப்பாய்வு செய்யப்பட்ட GSR வரைபடம்",
    telemetryTitle: "பயோமார்க்கர் டெலிமெட்ரி தரவு",
    eegPowerRatioLabel: "EEG சக்தி விகிதம்",
    betaAlphaLabel: "பீட்டா/ஆல்ஃபா சக்தி விகிதம்",
    dominantFreqLabel: "முக்கிய அதிர்வெண் (Hz)",
    gsrEdaLabel: "GSR தோல் மின்கடத்துத்திறன்",
    tonicConductanceLabel: "அடிப்படை கடத்துத்திறன் (μS)",
    phasicScrLabel: "SCR தூண்டுதல் எண்ணிக்கை",
    calibrationStatusLabel: "அளவுத்திருத்த நிலை",
    deltaFLabel: "வேறுபாட்டு ஈடுசெய்தல் மதிப்பு (ΔF)",
    clinicalActionTitle: "மருத்துவ நடவடிக்கை & நல்வாழ்வு பரிந்துரை",
    recommendationNormal: "பயோமார்க் இயல்பான பாராசிம்பதெடிக் சமநிலையைக் காட்டுகின்றன. வழக்கமான கண்காணிப்பைத் தொடரவும்.",
    recommendationStress: "சிம்பதெடிக் மிகைத்தூண்டுதல் கண்டறியப்பட்டது. உதரவிதான சுவாசப் பயிற்சி மற்றும் மருத்துவ ஆலோசனையைப் பரிந்துரைக்கவும்.",
    performNewAssessment: "புதிய மதிப்பீடு செய்க",
    exportModalTitle: "மருத்துவ கண்டறிதல் ஆவணத்தை ஏற்றுமதி செய்",
    exportModalDesc: "மின்னணு சுகாதார ஆவணக் கட்டமைப்புடன் (EHR) ஒருங்கிணைக்கத் தயாராக உள்ளது.",
    downloadPdf: "PDF மருத்துவ அறிக்கையைப் பதிவிறக்கு",
    downloadCsv: "டெலிமெட்ரி CSV கோப்பைப் பதிவிறக்கு",
    close: "மூடு",

    // Text to Speech
    readReportTts: "அறிக்கையைக் கேளுங்கள் (Audio)",
    readingReportTts: "அறிக்கை வாசிக்கப்படுகிறது...",
    stopReportTts: "வாசிப்பை நிறுத்து",
    pauseReportTts: "இடைநிறுத்து",
    resumeReportTts: "தொடரவும்",
    ttsNotSupported: "உங்கள் உலாவியில் குரல் வாசிப்பு ஆதரிக்கப்படவில்லை",
    ttsVoiceActive: "குரல் வாசிப்பு இயந்திரம் செயலில் உள்ளது",

    // Settings
    settingsTitle: "உணரி மற்றும் DSP கட்டமைப்பு",
    sensorSamplingRate: "சென்சார் மாதிரி அதிர்வெண் (Hz)",
    butterworthCutoff: "பட்டர்வொர்த் வடிகட்டி (0.5 - 45 Hz)",
    calibThreshold: "அடிப்படை அளவுத்திருத்த வாசல் (ΔF)",
    saveSettings: "அமைப்புகளைப் பயன்படுத்து",

    // Guided Breathing Biofeedback
    guidedBreathingTitle: "உயிரியல் பின்னூட்ட வழிகாட்டப்பட்ட சுவாசம்",
    guidedBreathingSubtitle: "வாகஸ் நரம்பு தூண்டுதல் மற்றும் மனஅழுத்தக் குறைப்பு",
    highStressAlertBadge: "அதிக அழுத்தம் கண்டறியப்பட்டது • சுவாசப் பயிற்சி பரிந்துரைக்கப்படுகிறது",
    breathingInhale: "மூச்சை உள்ளே இழுக்கவும் (Inhale)",
    breathingHold: "மூச்சை அடக்கவும் (Hold)",
    breathingExhale: "மெதுவாக மூச்சை வெளியிடவும் (Exhale)",
    breathingRest: "இயல்பான ஓய்வு (Rest)",
    startBreathing: "சுவாசப் பயிற்சியைத் தொடங்குக",
    pauseBreathing: "இடைநிறுத்து",
    resumeBreathing: "தொடரவும்",
    resetBreathing: "மீட்டமை",
    cyclesCompleted: "முடிந்த சுழற்சிகள்",
    targetBreaths: "இலக்கு: நிமிடத்திற்கு 6 சுவாசங்கள் (0.1 Hz)",
    biofeedbackPacing: "தகவமைப்பு ஒத்ததிர்வு வேகம்",
    parasympatheticGain: "பாராசிம்பதெடிக் அதிகரிப்பு",
    vagalToneActive: "வாகஸ் நரம்பு பின்னூட்டம் செயலில் உள்ளது",
    tactileHapticsLabel: "தொடு உணர்வு பின்னூட்டம் (Haptics)",
    viewFullReport: "முழு கண்டறிதல் அறிக்கையைக் காண்க",

    // Theme Mode
    darkMode: "இருண்ட பயன்முறை (Dark Mode)",
    lightMode: "வெளிச்சப் பயன்முறை (Light Mode)",
    themeLabel: "தீம் தோற்றம்"
  }
};
