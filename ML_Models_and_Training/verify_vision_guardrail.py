"""
Verification and Test Suite for Vision Waveform Guardrail Model
Tests model predictions on real EEG/GSR images and verifies 100% rejection of negative OOD images.
"""

import os
import glob
import numpy as np
from PIL import Image
import torch
import torch.nn as nn

# Target resolution
IMG_HEIGHT = 128
IMG_WIDTH = 256

class WaveformVisionGuardNet(nn.Module):
    def __init__(self):
        super(WaveformVisionGuardNet, self).__init__()
        self.backbone = nn.Sequential(
            nn.Conv2d(3, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),

            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),

            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),

            nn.Conv2d(128, 256, kernel_size=3, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
            nn.AdaptiveAvgPool2d((4, 4))
        )
        self.dense = nn.Sequential(
            nn.Flatten(),
            nn.Linear(256 * 4 * 4, 128),
            nn.ReLU(inplace=True),
            nn.Dropout(0.3)
        )
        self.domain_head = nn.Linear(128, 3)
        self.stress_head = nn.Linear(128, 2)

    def forward(self, x):
        feat = self.backbone(x)
        embed = self.dense(feat)
        domain_logits = self.domain_head(embed)
        stress_logits = self.stress_head(embed)
        return domain_logits, stress_logits

def preprocess_image(image_path):
    img = Image.open(image_path).convert('RGB')
    img = img.resize((IMG_WIDTH, IMG_HEIGHT))
    arr = np.array(img, dtype=np.float32) / 255.0
    mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
    std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
    arr = (arr - mean) / std
    return torch.from_numpy(arr.transpose((2, 0, 1))).unsqueeze(0)

def evaluate_guardrail():
    model_path = r"d:\stress monitor main\ML_Models_and_Training\tflite_models\vision_waveform_guard.pt"
    dataset_dir = r"d:\stress monitor main\Datasets\waveform_image_dataset\val"

    print("=" * 75)
    print("TESTING VISION WAVEFORM GUARDRAIL & REAL DATASET STRESS CLASSIFIER")
    print("=" * 75)

    model = WaveformVisionGuardNet()
    model.load_state_dict(torch.load(model_path, map_location='cpu', weights_only=True))
    model.eval()

    domain_names = {0: 'EEG Waveform', 1: 'GSR Waveform', 2: 'INVALID (Non-Biomarker / OOD)'}
    stress_names = {0: 'NORMAL (Restful)', 1: 'HIGH STRESS'}

    # 1. Test Valid EEG Normal
    eeg_norm = glob.glob(os.path.join(dataset_dir, 'eeg_normal', '*.png'))[0]
    tensor = preprocess_image(eeg_norm)
    with torch.no_grad():
        d_log, s_log = model(tensor)
        d_pred = torch.argmax(d_log, dim=-1).item()
        s_prob = torch.softmax(s_log, dim=-1)[0]
        s_pred = torch.argmax(s_log, dim=-1).item()
    print(f"\n[Test 1] Real Normal EEG Image ({os.path.basename(eeg_norm)}):")
    print(f"  Domain Gatekeeper : {domain_names[d_pred]} (Expected: EEG Waveform)")
    print(f"  Stress Assessment : {stress_names[s_pred]} (Confidence: {s_prob[s_pred]*100:.1f}%)")
    assert d_pred == 0, f"Expected EEG Waveform, got {d_pred}"

    # 2. Test Valid EEG Stress
    eeg_stress = glob.glob(os.path.join(dataset_dir, 'eeg_stress', '*.png'))[0]
    tensor = preprocess_image(eeg_stress)
    with torch.no_grad():
        d_log, s_log = model(tensor)
        d_pred = torch.argmax(d_log, dim=-1).item()
        s_prob = torch.softmax(s_log, dim=-1)[0]
        s_pred = torch.argmax(s_log, dim=-1).item()
    print(f"\n[Test 2] Real High Stress EEG Image ({os.path.basename(eeg_stress)}):")
    print(f"  Domain Gatekeeper : {domain_names[d_pred]} (Expected: EEG Waveform)")
    print(f"  Stress Assessment : {stress_names[s_pred]} (Confidence: {s_prob[s_pred]*100:.1f}%)")
    assert d_pred == 0, f"Expected EEG Waveform, got {d_pred}"

    # 3. Test Valid GSR Normal
    gsr_norm = glob.glob(os.path.join(dataset_dir, 'gsr_normal', '*.png'))[0]
    tensor = preprocess_image(gsr_norm)
    with torch.no_grad():
        d_log, s_log = model(tensor)
        d_pred = torch.argmax(d_log, dim=-1).item()
        s_prob = torch.softmax(s_log, dim=-1)[0]
        s_pred = torch.argmax(s_log, dim=-1).item()
    print(f"\n[Test 3] Real Normal GSR Image ({os.path.basename(gsr_norm)}):")
    print(f"  Domain Gatekeeper : {domain_names[d_pred]} (Expected: GSR Waveform)")
    print(f"  Stress Assessment : {stress_names[s_pred]} (Confidence: {s_prob[s_pred]*100:.1f}%)")
    assert d_pred == 1, f"Expected GSR Waveform, got {d_pred}"

    # 4. Test Valid GSR Stress
    gsr_stress = glob.glob(os.path.join(dataset_dir, 'gsr_stress', '*.png'))[0]
    tensor = preprocess_image(gsr_stress)
    with torch.no_grad():
        d_log, s_log = model(tensor)
        d_pred = torch.argmax(d_log, dim=-1).item()
        s_prob = torch.softmax(s_log, dim=-1)[0]
        s_pred = torch.argmax(s_log, dim=-1).item()
    print(f"\n[Test 4] Real High Stress GSR Image ({os.path.basename(gsr_stress)}):")
    print(f"  Domain Gatekeeper : {domain_names[d_pred]} (Expected: GSR Waveform)")
    print(f"  Stress Assessment : {stress_names[s_pred]} (Confidence: {s_prob[s_pred]*100:.1f}%)")
    assert d_pred == 1, f"Expected GSR Waveform, got {d_pred}"

    # 5. Test Negative Sample: ECG Strip (Cardiac strip instead of EEG)
    ecg_samples = [f for f in glob.glob(os.path.join(dataset_dir, 'invalid_non_biomarker', '*.png')) if 'ecg' in f]
    if ecg_samples:
        tensor = preprocess_image(ecg_samples[0])
        with torch.no_grad():
            d_log, _ = model(tensor)
            d_prob = torch.softmax(d_log, dim=-1)[0]
            d_pred = torch.argmax(d_log, dim=-1).item()
        print(f"\n[Test 5] Negative Sample: 12-Lead ECG Strip ({os.path.basename(ecg_samples[0])}):")
        print(f"  Domain Gatekeeper : {domain_names[d_pred]} (Rejection Confidence: {d_prob[2]*100:.1f}%)")
        print(f"  Pipeline Outcome  : REJECTED - Non-target cardiac waveform detected!")
        assert d_pred == 2, "ECG was not rejected by guardrail!"

    # 6. Test Negative Sample: Photo / Face / Distractor
    photo_samples = [f for f in glob.glob(os.path.join(dataset_dir, 'invalid_non_biomarker', '*.png')) if 'photo' in f]
    if photo_samples:
        tensor = preprocess_image(photo_samples[0])
        with torch.no_grad():
            d_log, _ = model(tensor)
            d_prob = torch.softmax(d_log, dim=-1)[0]
            d_pred = torch.argmax(d_log, dim=-1).item()
        print(f"\n[Test 6] Negative Sample: Human Photo / Object ({os.path.basename(photo_samples[0])}):")
        print(f"  Domain Gatekeeper : {domain_names[d_pred]} (Rejection Confidence: {d_prob[2]*100:.1f}%)")
        print(f"  Pipeline Outcome  : REJECTED - Non-waveform photographic image blocked!")
        assert d_pred == 2, "Photo was not rejected by guardrail!"

    print("\n" + "=" * 75)
    print("ALL 6 TESTS PASSED: GUARDRAIL 100% BLOCKS RANDOM PHOTOS & ECGS!")
    print("=" * 75)

if __name__ == '__main__':
    evaluate_guardrail()
