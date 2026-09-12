/**
 * Utility for triggering subtle clinical haptic patterns using the HTML5 Vibration API.
 * Provides safe fallback for environments or browsers where navigator.vibrate is not available.
 */

// Custom event name for optional visual haptic ripple feedback in desktop/iFrame previews
export const HAPTIC_FEEDBACK_EVENT = 'biometric-haptic-trigger';

export interface HapticEventDetail {
  pattern: number[];
  type: 'upload' | 'report' | 'tap' | 'breathing';
  label: string;
}

function dispatchVisualHaptic(type: 'upload' | 'report' | 'tap' | 'breathing', pattern: number[], label: string) {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent<HapticEventDetail>(HAPTIC_FEEDBACK_EVENT, {
      detail: { pattern, type, label },
    });
    window.dispatchEvent(event);
  }
}

/**
 * Triggered on successful EEG/GSR biomarker upload or scan completion.
 * Subtle double-pulse tactile confirmation pattern: [18ms, 35ms pause, 22ms].
 */
export function triggerBiomarkerUploadHaptic(): boolean {
  const pattern = [18, 35, 22];
  dispatchVisualHaptic('upload', pattern, 'Biomarker Validated & Ingested');

  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      return navigator.vibrate(pattern);
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * Triggered when neural inference completes and diagnostic assessment report is generated.
 * Celebratory clinical confirmation wave: [28ms, 45ms pause, 18ms, 40ms pause, 32ms].
 */
export function triggerReportGeneratedHaptic(): boolean {
  const pattern = [28, 45, 18, 40, 32];
  dispatchVisualHaptic('report', pattern, 'Report Generated');

  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      return navigator.vibrate(pattern);
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * Triggered on light button presses or tab transitions.
 * Ultra-subtle single tick: [12ms].
 */
export function triggerLightHaptic(): boolean {
  const pattern = [12];
  dispatchVisualHaptic('tap', pattern, 'Touch Feedback');

  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      return navigator.vibrate(pattern);
    } catch {
      return false;
    }
  }
  return false;
}

/**
 * Triggered at each phase transition of the Guided Breathing biofeedback session.
 * Inhale: gentle progressive rise [15, 30, 20]
 * Hold: tiny reassuring tick [10]
 * Exhale: prolonged soft downward pulse [35]
 */
export function triggerBreathingHaptic(phase: 'inhale' | 'hold' | 'exhale'): boolean {
  const pattern = phase === 'inhale' 
    ? [15, 30, 20] 
    : phase === 'hold' 
    ? [10] 
    : [35];

  dispatchVisualHaptic('breathing', pattern, `Breathing: ${phase.toUpperCase()}`);

  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    try {
      return navigator.vibrate(pattern);
    } catch {
      return false;
    }
  }
  return false;
}

