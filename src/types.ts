export type Language = 'en' | 'ta';

export type ScreenId = 'gateway' | 'test-stress' | 'report';

export type BleStatus = 'synced' | 'searching';

export type UserRole = 'patient' | 'doctor';

export interface WaveformData {
  id: string;
  type: 'eeg' | 'gsr';
  name: string;
  source: 'camera' | 'gallery' | 'file' | 'benchmark';
  timestamp: string;
  points: number[];
  samplingRate: string;
  duration: string;
  fileSize?: string;
  fileName?: string;
  previewUrl?: string;
}

export interface DiagnosticResult {
  verdict: 'NORMAL' | 'HIGH STRESS';
  physStateCaption: string;
  predictionConfidence: number; // e.g. 96.8
  benchmarkMet: boolean; // >= 95.0%
  tierLevel: 'Low' | 'Moderate' | 'High';
  eegStripAnalyzed: WaveformData;
  gsrGraphAnalyzed: WaveformData;
  telemetry: {
    betaAlphaRatio: number;
    dominantFreqHz: number;
    tonicConductanceMicroSiemens: number;
    phasicScrSpikeCount: number;
    baselineOffsetDeltaF: string;
  };
  clinicalRecommendation: string;
  evaluatedAt: string;
}
