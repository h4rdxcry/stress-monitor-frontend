import os
import numpy as np
import matplotlib.pyplot as plt

os.makedirs('Datasets/demo_samples', exist_ok=True)
os.makedirs('Mobile_App/assets/demo', exist_ok=True)

# 1. Generate Synthetic Realistic Waveform Test Images (for Camera/Gallery Upload)
fs_eeg = 128
duration = 10  # 10 seconds for clean graphical representation
t_eeg = np.linspace(0, duration, duration * fs_eeg)

# NORMAL EEG: Dominant Alpha (10 Hz) with minor theta/noise
alpha = 1.8 * np.sin(2 * np.pi * 10 * t_eeg)
theta = 0.5 * np.sin(2 * np.pi * 6 * t_eeg + 0.5)
noise = 0.2 * np.random.normal(0, 1, len(t_eeg))
eeg_normal = alpha + theta + noise

# HIGH STRESS EEG: Dominant Beta (22 Hz) & Gamma bursts (35 Hz), suppressed alpha
beta = 2.0 * np.sin(2 * np.pi * 22 * t_eeg)
gamma = 1.2 * np.sin(2 * np.pi * 35 * t_eeg + 1.0)
alpha_suppressed = 0.3 * np.sin(2 * np.pi * 10 * t_eeg)
noise_stress = 0.4 * np.random.normal(0, 1, len(t_eeg))
eeg_stress = beta + gamma + alpha_suppressed + noise_stress

# GSR: 4 Hz sampling rate
fs_gsr = 4
t_gsr = np.linspace(0, duration, duration * fs_gsr)

# NORMAL GSR: Low tonic level (~3.5 uS), smooth, very few phasic spikes
gsr_normal = 3.5 + 0.15 * np.sin(2 * np.pi * 0.05 * t_gsr) + 0.05 * np.random.normal(0, 1, len(t_gsr))

# STRESS GSR: Elevated tonic level (~7.8 uS) + repeated steep SCR spikes
gsr_stress = 7.8 + 0.5 * np.sin(2 * np.pi * 0.08 * t_gsr)
# Add 4 sharp phasic SCR spikes
for spike_t in [2.0, 4.5, 7.0, 8.8]:
    idx = int(spike_t * fs_gsr)
    if idx < len(gsr_stress):
        gsr_stress[idx:min(idx+6, len(gsr_stress))] += np.array([0.8, 1.6, 1.2, 0.7, 0.4, 0.1])[:len(gsr_stress)-idx]

def save_waveform_image(time_arr, signal_arr, title, ylabel, filename, color):
    plt.figure(figsize=(9, 4), dpi=150)
    plt.plot(time_arr, signal_arr, color=color, linewidth=1.5)
    plt.title(title, fontsize=14, fontweight='bold', pad=12)
    plt.xlabel('Time (seconds)', fontsize=11)
    plt.ylabel(ylabel, fontsize=11)
    plt.grid(True, linestyle='--', alpha=0.6)
    plt.tight_layout()
    
    out_path = os.path.join('Datasets/demo_samples', filename)
    plt.savefig(out_path)
    # Also copy to Mobile_App assets
    plt.savefig(os.path.join('Mobile_App/assets/demo', filename))
    plt.close()
    print(f"Generated waveform image: {out_path}")

save_waveform_image(t_eeg, eeg_normal, 'Clinical EEG Rhythm Strip - Normal Baseline (Alpha Rhythm)', 'Amplitude (µV)', 'eeg_waveform_normal.png', '#167D85')
save_waveform_image(t_eeg, eeg_stress, 'Clinical EEG Rhythm Strip - High Cognitive Stress (Beta/Gamma)', 'Amplitude (µV)', 'eeg_waveform_stress.png', '#D32F2F')

save_waveform_image(t_gsr, gsr_normal, 'Galvanic Skin Response (GSR) - Resting Baseline (Tonic Low)', 'Skin Conductance (µS)', 'gsr_waveform_normal.png', '#2E7D32')
save_waveform_image(t_gsr, gsr_stress, 'Galvanic Skin Response (GSR) - Acute Sympathetic Arousal (SCR Spikes)', 'Skin Conductance (µS)', 'gsr_waveform_stress.png', '#E65100')

# 2. Generate Medical CSV Files for direct file upload testing
# EEG CSV: 1280 samples (10s) x 4 representative channels
eeg_csv_data = np.stack([
    eeg_normal,
    eeg_normal * 0.9 + 0.1 * np.random.normal(0, 1, len(eeg_normal)),
    eeg_normal * 1.1 - 0.1 * np.random.normal(0, 1, len(eeg_normal)),
    eeg_normal * 0.95
], axis=1)
eeg_csv_path = 'Datasets/demo_samples/sample_eeg_recording.csv'
np.savetxt(eeg_csv_path, eeg_csv_data, delimiter=',', header='Fp1,Fp2,F3,F4', comments='')
print(f"Generated CSV: {eeg_csv_path}")

gsr_csv_data = gsr_normal[:, np.newaxis]
gsr_csv_path = 'Datasets/demo_samples/sample_gsr_recording.csv'
np.savetxt(gsr_csv_path, gsr_csv_data, delimiter=',', header='GSR_EDA_Conductance', comments='')
print(f"Generated CSV: {gsr_csv_path}")

print("\nALL SAMPLE TEST WAVEFORMS AND CSVs CREATED SUCCESSFULLY!")
