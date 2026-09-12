"""
Real Waveform Image Dataset Generator
Extracts real 32-channel EEG and GSR data from the 37-Subject Dataset (stress_dataset_colab.zip)
and generates realistic biomedical waveform images alongside negative/OOD samples.

Classes Generated:
  1. eeg_normal          - Synchronized alpha rhythm (8-12 Hz) from baseline rest trials
  2. eeg_stress          - Desynchronized beta rhythm (13-30 Hz) from acute mental stress trials
  3. gsr_normal          - Smooth, low-conductance tonic curve (1-3 uS) with minimal SCR spikes
  4. gsr_stress          - Elevated skin conductance with acute phasic SCR surges (5-12 uS)
  5. invalid_non_biomarker - Out-Of-Distribution samples: 12-lead ECG strips, faces, photos, objects
"""

import os
import io
import zipfile
import argparse
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
from PIL import Image, ImageDraw

def render_eeg_strip(eeg_window, sampling_rate=128, channels_to_plot=None, title="EEG Rhythm Strip"):
    fig, ax = plt.subplots(figsize=(6.4, 3.2), dpi=100)
    ax.set_facecolor('#ffffff')
    fig.patch.set_facecolor('#ffffff')

    time = np.arange(eeg_window.shape[-1]) / sampling_rate
    ch_names = ['Fp1', 'Fp2', 'F3', 'F4', 'C3', 'C4', 'P3', 'P4']
    
    if channels_to_plot is None:
        n_ch = np.random.choice([1, 2, 4], p=[0.4, 0.25, 0.35])
        if n_ch == 1:
            channels_to_plot = (np.random.choice([0, 1, 2, 3]),)
        elif n_ch == 2:
            channels_to_plot = (0, 1)
        else:
            channels_to_plot = (0, 1, 2, 3)

    bg_style = np.random.choice(['pink_grid', 'gray_grid', 'clean_white'])
    if bg_style == 'pink_grid':
        ax.grid(True, which='both', color='#ffcccc', linestyle='-', linewidth=0.5, alpha=0.7)
        ax.minorticks_on()
        ax.grid(True, which='minor', color='#ffe6e6', linestyle=':', linewidth=0.4, alpha=0.5)
    elif bg_style == 'gray_grid':
        ax.grid(True, which='both', color='#e0e0e0', linestyle='--', linewidth=0.5, alpha=0.7)
    else:
        ax.grid(False)

    offset_step = 100.0  # uV offset per lead
    line_color = np.random.choice(['#0b2545', '#000000', '#134074', '#1d3557'])
    for idx, ch in enumerate(channels_to_plot):
        signal = eeg_window[ch]
        y = signal - np.mean(signal) + (len(channels_to_plot) - 1 - idx) * offset_step
        name = ch_names[ch] if ch < len(ch_names) else f'Ch{ch+1}'
        ax.plot(time, y, color=line_color, linewidth=1.2, label=name)
        if len(channels_to_plot) > 1:
            ax.text(time[0] - 0.15, (len(channels_to_plot) - 1 - idx) * offset_step, name, 
                    fontsize=8, fontweight='bold', color='#134074', va='center')

    ax.set_xlim(time[0] - 0.2, time[-1] + 0.1)
    ax.set_ylim(-offset_step * 0.8, max(offset_step, len(channels_to_plot) * offset_step))
    ax.set_xlabel('Time (seconds)', fontsize=8, color='#333333')
    ax.set_ylabel('Amplitude (uV)', fontsize=8, color='#333333')
    ax.set_title(title, fontsize=9, fontweight='bold', color='#102A43', pad=6)
    
    plt.tight_layout()
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight')
    plt.close(fig)
    buf.seek(0)
    return Image.open(buf).convert('RGB')

def render_synthetic_12lead_sheet():
    fig, axes = plt.subplots(3, 4, figsize=(6.4, 3.2), dpi=100)
    fig.patch.set_facecolor('#ffffff')
    lead_names = ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6']
    time = np.linspace(0, 2.5, 500)
    for ax, name in zip(axes.flatten(), lead_names):
        ax.set_facecolor('#ffffff')
        ax.grid(True, which='both', color='#ffcccc', linestyle='-', linewidth=0.4, alpha=0.7)
        ecg = np.zeros_like(time)
        for beat in [0.4, 1.2, 2.0]:
            ecg += 1.0 * np.exp(-((time - beat) / 0.025)**2)
            ecg -= 0.25 * np.exp(-((time - (beat + 0.04)) / 0.02)**2)
        ax.plot(time, ecg, color='#111111', linewidth=0.9)
        ax.text(0.1, 0.7, name, fontsize=7, fontweight='bold', color='#800000')
        ax.set_xticks([])
        ax.set_yticks([])
    plt.tight_layout()
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight')
    plt.close(fig)
    buf.seek(0)
    return Image.open(buf).convert('RGB')


def render_gsr_curve(eda_window, title="GSR / EDA Skin Conductance Response"):
    fig, ax = plt.subplots(figsize=(6.4, 3.2), dpi=100)
    ax.set_facecolor('#ffffff')
    fig.patch.set_facecolor('#ffffff')

    x_raw = np.linspace(0, 30, len(eda_window))
    x_smooth = np.linspace(0, 30, 200)
    y_smooth = np.interp(x_smooth, x_raw, eda_window)

    ax.grid(True, which='both', color='#e2e8f0', linestyle='--', linewidth=0.7, alpha=0.8)
    ax.plot(x_smooth, y_smooth, color='#e76f51', linewidth=2.2, label='Tonic Conductance')
    ax.fill_between(x_smooth, y_smooth, np.min(y_smooth) * 0.9, color='#f4a261', alpha=0.15)

    ax.set_xlim(0, 30)
    y_margin = max(1.0, (np.max(y_smooth) - np.min(y_smooth)) * 0.3)
    ax.set_ylim(max(0, np.min(y_smooth) - y_margin), np.max(y_smooth) + y_margin)
    ax.set_xlabel('Time (seconds)', fontsize=8, color='#333333')
    ax.set_ylabel('Conductance (uS)', fontsize=8, color='#333333')
    ax.set_title(title, fontsize=9, fontweight='bold', color='#102A43', pad=6)

    plt.tight_layout()
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight')
    plt.close(fig)
    buf.seek(0)
    return Image.open(buf).convert('RGB')

def render_synthetic_ecg_strip():
    fig, ax = plt.subplots(figsize=(6.4, 3.2), dpi=100)
    ax.set_facecolor('#ffffff')
    fig.patch.set_facecolor('#ffffff')

    time = np.linspace(0, 5, 1000)
    hr = np.random.uniform(65, 95)
    rr = 60.0 / hr
    ecg = np.zeros_like(time)
    for beat in np.arange(0.2, 5.0, rr):
        ecg += 0.15 * np.exp(-((time - (beat - 0.16)) / 0.04)**2)
        ecg -= 0.15 * np.exp(-((time - (beat - 0.04)) / 0.02)**2)
        ecg += 1.2 * np.exp(-((time - beat) / 0.025)**2)
        ecg -= 0.3 * np.exp(-((time - (beat + 0.04)) / 0.02)**2)
        ecg += 0.35 * np.exp(-((time - (beat + 0.22)) / 0.07)**2)

    ecg += np.random.normal(0, 0.02, size=len(time))

    ax.grid(True, which='both', color='#ffb3ba', linestyle='-', linewidth=0.6, alpha=0.8)
    ax.plot(time, ecg, color='#1a1a1a', linewidth=1.3)
    ax.set_xlim(0, 5)
    ax.set_ylim(-0.8, 1.6)
    ax.set_title("Cardiology ECG Rhythm Strip (Lead II) [Non-EEG]", fontsize=9, fontweight='bold', color='#800000', pad=6)
    ax.set_xlabel('Time (s) - 25 mm/s', fontsize=8)
    ax.set_ylabel('Voltage (mV) - 10 mm/mV', fontsize=8)

    plt.tight_layout()
    buf = io.BytesIO()
    plt.savefig(buf, format='png', dpi=100, bbox_inches='tight')
    plt.close(fig)
    buf.seek(0)
    return Image.open(buf).convert('RGB')

def render_random_photo_distractor():
    img = Image.new('RGB', (640, 320), color=(np.random.randint(180, 240), np.random.randint(180, 240), np.random.randint(180, 240)))
    draw = ImageDraw.Draw(img)

    distractor_type = np.random.choice(['portrait', 'document', 'gradient_scene', 'abstract_texture'])

    if distractor_type == 'portrait':
        cx, cy = 320, 140
        draw.ellipse([cx - 70, cy - 80, cx + 70, cy + 90], fill=(220, 180, 150), outline=(100, 70, 50), width=2)
        draw.ellipse([cx - 35, cy - 20, cx - 15, cy - 10], fill=(40, 30, 20))
        draw.ellipse([cx + 15, cy - 20, cx + 35, cy - 10], fill=(40, 30, 20))
        draw.arc([cx - 25, cy + 25, cx + 25, cy + 45], 0, 180, fill=(150, 50, 50), width=3)
        draw.polygon([(cx - 140, 320), (cx + 140, 320), (cx + 80, 230), (cx - 80, 230)], fill=(50, 70, 120))
        draw.text((20, 20), "Human Photograph (Face)", fill=(50, 50, 50))

    elif distractor_type == 'document':
        for y in range(40, 290, 18):
            w = np.random.randint(300, 580)
            draw.line([(30, y), (30 + w, y)], fill=(60, 60, 60), width=np.random.choice([2, 3]))
        draw.text((30, 15), "Clinical Prescription / Text Document", fill=(30, 30, 30))

    elif distractor_type == 'gradient_scene':
        arr = np.zeros((320, 640, 3), dtype=np.uint8)
        arr[:180, :, 0] = np.linspace(100, 180, 180)[:, None]
        arr[:180, :, 1] = np.linspace(150, 220, 180)[:, None]
        arr[:180, :, 2] = 255
        arr[180:, :, 1] = np.linspace(120, 60, 140)[:, None]
        img = Image.fromarray(arr)
        draw = ImageDraw.Draw(img)
        draw.text((20, 20), "Natural Scenery / Photography", fill=(255, 255, 255))

    else:
        for _ in range(30):
            x1, y1 = np.random.randint(0, 600), np.random.randint(0, 300)
            x2, y2 = x1 + np.random.randint(20, 120), y1 + np.random.randint(20, 120)
            color = tuple(np.random.randint(50, 220, size=3).tolist())
            draw.rectangle([x1, y1, x2, y2], fill=color, outline=(0, 0, 0))
        draw.text((20, 20), "Geometric Texture / Non-Biomarker", fill=(0, 0, 0))

    return img

def generate_dataset(zip_path, output_dir, samples_per_class=100):
    os.makedirs(output_dir, exist_ok=True)
    splits = ['train', 'val']
    classes = ['eeg_normal', 'eeg_stress', 'gsr_normal', 'gsr_stress', 'invalid_non_biomarker']

    for sp in splits:
        for cl in classes:
            os.makedirs(os.path.join(output_dir, sp, cl), exist_ok=True)

    print(f"[1/4] Loading real subject windows from {zip_path}...")
    eeg_normal_pool = []
    eeg_stress_pool = []
    gsr_normal_pool = []
    gsr_stress_pool = []

    with zipfile.ZipFile(zip_path, 'r') as z:
        npz_files = [f for f in z.namelist() if f.endswith('.npz')]
        for f in npz_files:
            data = z.read(f)
            npz = np.load(io.BytesIO(data))
            eeg = npz['eeg'].astype(np.float32)
            eda = npz['eda'].astype(np.float32)
            labels = npz['labels']

            for i in range(len(labels)):
                if labels[i] == 0:
                    eeg_normal_pool.append(eeg[i])
                    gsr_normal_pool.append(eda[i])
                elif labels[i] == 1:
                    eeg_stress_pool.append(eeg[i])
                    gsr_stress_pool.append(eda[i])

    print(f"Loaded {len(eeg_normal_pool)} normal windows and {len(eeg_stress_pool)} stress windows.")

    total_samples = samples_per_class
    train_count = int(total_samples * 0.8)
    val_count = total_samples - train_count

    print(f"[2/4] Rendering real EEG & GSR waveform images (Train: {train_count}, Val: {val_count})...")

    for i in range(total_samples):
        sp = 'train' if i < train_count else 'val'
        idx = i % len(eeg_normal_pool)
        img = render_eeg_strip(eeg_normal_pool[idx], title=f"Normal Resting EEG (Alpha 8-12Hz) - Win #{i+1}")
        img.save(os.path.join(output_dir, sp, 'eeg_normal', f'eeg_norm_{i:04d}.png'))

    for i in range(total_samples):
        sp = 'train' if i < train_count else 'val'
        idx = i % len(eeg_stress_pool)
        img = render_eeg_strip(eeg_stress_pool[idx], title=f"High Stress EEG (Beta 13-30Hz Desync) - Win #{i+1}")
        img.save(os.path.join(output_dir, sp, 'eeg_stress', f'eeg_stress_{i:04d}.png'))

    for i in range(total_samples):
        sp = 'train' if i < train_count else 'val'
        idx = i % len(gsr_normal_pool)
        img = render_gsr_curve(gsr_normal_pool[idx], title=f"Resting Skin Conductance (Low Tonic) - Win #{i+1}")
        img.save(os.path.join(output_dir, sp, 'gsr_normal', f'gsr_norm_{i:04d}.png'))

    for i in range(total_samples):
        sp = 'train' if i < train_count else 'val'
        idx = i % len(gsr_stress_pool)
        img = render_gsr_curve(gsr_stress_pool[idx], title=f"Acute Stress SCR (Sympathetic Surge) - Win #{i+1}")
        img.save(os.path.join(output_dir, sp, 'gsr_stress', f'gsr_stress_{i:04d}.png'))

    print("[3/4] Synthesizing negative/distractor samples (ECG strips + 12-lead sheets + human photos)...")
    for i in range(total_samples):
        sp = 'train' if i < train_count else 'val'
        if i % 3 == 0:
            img = render_synthetic_ecg_strip()
            name = f'invalid_ecg_{i:04d}.png'
        elif i % 3 == 1:
            img = render_synthetic_12lead_sheet()
            name = f'invalid_12lead_{i:04d}.png'
        else:
            img = render_random_photo_distractor()
            name = f'invalid_photo_{i:04d}.png'
        img.save(os.path.join(output_dir, sp, 'invalid_non_biomarker', name))

    # Inject real open-source internet patient samples directly into dataset
    internet_dir = os.path.join(os.path.dirname(output_dir), 'internet_samples')
    if os.path.exists(internet_dir):
        print("[4/4] Injecting real downloaded internet patient samples into dataset...")
        import shutil
        mapping = {
            'patient_eeg_normal_alpha.png': 'eeg_normal',
            'patient_alpha_waveform_crop.png': 'eeg_normal',
            'patient_eeg_stress_beta.png': 'eeg_stress',
            'patient_gsr_curve.png': 'gsr_normal',
            'real_12lead_ecg_strip.jpg': 'invalid_non_biomarker',
            'real_human_face_portrait.jpg': 'invalid_non_biomarker'
        }
        for fname, target_folder in mapping.items():
            src_f = os.path.join(internet_dir, fname)
            if os.path.exists(src_f):
                shutil.copy(src_f, os.path.join(output_dir, 'train', target_folder, f'real_{fname}'))
                shutil.copy(src_f, os.path.join(output_dir, 'val', target_folder, f'real_{fname}'))

    print(f"Dataset successfully finalized at: {output_dir}")
    print(f"Total images generated: {total_samples * len(classes)} ({total_samples} per class).")

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--zip-path', default=r'd:\stress monitor main\Datasets\stress_dataset_colab.zip')
    parser.add_argument('--output-dir', default=r'd:\stress monitor main\Datasets\waveform_image_dataset')
    parser.add_argument('--sample-count', type=int, default=120)
    args = parser.parse_args()

    generate_dataset(args.zip_path, args.output_dir, samples_per_class=args.sample_count)

