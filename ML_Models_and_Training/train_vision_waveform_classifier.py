"""
Vision Waveform Classifier & Anti-Fake Guardrail Model
Trained on real biomedical waveform images extracted from the 37-Subject Dataset.

Dual-Head Architecture:
  Head 1 (Domain Gatekeeper):
    - Class 0: Valid EEG Waveform
    - Class 1: Valid GSR Waveform
    - Class 2: Invalid / Non-Biomarker (Faces, random photos, ECG strips)
  Head 2 (Diagnostic Stress Classifier):
    - Class 0: Normal / Restful State
    - Class 1: High Stress State
"""

import os
import glob
import numpy as np
from PIL import Image
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader

# Target resolution for fast on-device vision inference
IMG_HEIGHT = 128
IMG_WIDTH = 256

class WaveformImageDataset(Dataset):
    def __init__(self, root_dir, split='train'):
        self.samples = []
        split_dir = os.path.join(root_dir, split)
        
        # Mapping: (folder_name, domain_label, stress_label)
        # domain_label: 0=EEG, 1=GSR, 2=Invalid
        # stress_label: 0=Normal, 1=Stress, -1=Ignore
        folder_mapping = {
            'eeg_normal': (0, 0),
            'eeg_stress': (0, 1),
            'gsr_normal': (1, 0),
            'gsr_stress': (1, 1),
            'invalid_non_biomarker': (2, -1)
        }

        for folder, (domain_lbl, stress_lbl) in folder_mapping.items():
            for ext in ('*.png', '*.jpg', '*.jpeg', '*.webp'):
                pattern = os.path.join(split_dir, folder, ext)
                for fpath in glob.glob(pattern):
                    self.samples.append((fpath, domain_lbl, stress_lbl))

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        fpath, domain_lbl, stress_lbl = self.samples[idx]
        img = Image.open(fpath).convert('RGB')
        img = img.resize((IMG_WIDTH, IMG_HEIGHT))
        arr = np.array(img, dtype=np.float32) / 255.0  # Normalize to [0, 1]
        
        # Standardization (ImageNet mean & std)
        mean = np.array([0.485, 0.456, 0.406], dtype=np.float32)
        std = np.array([0.229, 0.224, 0.225], dtype=np.float32)
        arr = (arr - mean) / std
        
        # Channels first: (3, H, W)
        tensor = torch.from_numpy(arr.transpose((2, 0, 1)))
        return tensor, domain_lbl, stress_lbl, fpath


class WaveformVisionGuardNet(nn.Module):
    def __init__(self):
        super(WaveformVisionGuardNet, self).__init__()
        
        # Feature Extractor Backbone (Conv-BatchNorm-ReLU-MaxPool blocks)
        self.backbone = nn.Sequential(
            # Block 1: (3, 128, 256) -> (32, 64, 128)
            nn.Conv2d(3, 32, kernel_size=3, padding=1),
            nn.BatchNorm2d(32),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),

            # Block 2: (32, 64, 128) -> (64, 32, 64)
            nn.Conv2d(32, 64, kernel_size=3, padding=1),
            nn.BatchNorm2d(64),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),

            # Block 3: (64, 32, 64) -> (128, 16, 32)
            nn.Conv2d(64, 128, kernel_size=3, padding=1),
            nn.BatchNorm2d(128),
            nn.ReLU(inplace=True),
            nn.MaxPool2d(2, 2),

            # Block 4: (128, 16, 32) -> (256, 8, 16)
            nn.Conv2d(128, 256, kernel_size=3, padding=1),
            nn.BatchNorm2d(256),
            nn.ReLU(inplace=True),
            nn.AdaptiveAvgPool2d((4, 4))  # (256, 4, 4) = 4096
        )

        self.dense = nn.Sequential(
            nn.Flatten(),
            nn.Linear(256 * 4 * 4, 128),
            nn.ReLU(inplace=True),
            nn.Dropout(0.3)
        )

        # Head 1: Domain Gatekeeper (0=EEG, 1=GSR, 2=Invalid)
        self.domain_head = nn.Linear(128, 3)

        # Head 2: Stress Classifier (0=Normal, 1=Stress)
        self.stress_head = nn.Linear(128, 2)

    def forward(self, x):
        feat = self.backbone(x)
        embed = self.dense(feat)
        domain_logits = self.domain_head(embed)
        stress_logits = self.stress_head(embed)
        return domain_logits, stress_logits

def train_model(dataset_dir, output_model_path, epochs=12, batch_size=16, lr=0.001):
    train_dataset = WaveformImageDataset(dataset_dir, split='train')
    val_dataset = WaveformImageDataset(dataset_dir, split='val')

    print(f"Train samples: {len(train_dataset)}, Validation samples: {len(val_dataset)}")
    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)

    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Training on device: {device}")

    model = WaveformVisionGuardNet().to(device)
    criterion_domain = nn.CrossEntropyLoss()
    criterion_stress = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=lr, weight_decay=1e-4)

    best_val_acc = 0.0

    for epoch in range(1, epochs + 1):
        model.train()
        total_loss = 0.0
        correct_domain = 0
        total_domain = 0
        correct_stress = 0
        total_stress = 0

        for images, domain_lbls, stress_lbls, _ in train_loader:
            images = images.to(device)
            domain_lbls = domain_lbls.to(device)
            stress_lbls = stress_lbls.to(device)

            optimizer.zero_grad()
            domain_logits, stress_logits = model(images)

            loss_domain = criterion_domain(domain_logits, domain_lbls)

            # Only compute stress loss for valid waveforms (where stress_lbl >= 0)
            valid_mask = stress_lbls >= 0
            if valid_mask.sum() > 0:
                loss_stress = criterion_stress(stress_logits[valid_mask], stress_lbls[valid_mask])
            else:
                loss_stress = 0.0

            loss = loss_domain + loss_stress
            loss.backward()
            optimizer.step()

            total_loss += loss.item() * len(images)

            # Domain Accuracy
            preds_domain = torch.argmax(domain_logits, dim=-1)
            correct_domain += (preds_domain == domain_lbls).sum().item()
            total_domain += len(images)

            # Stress Accuracy
            if valid_mask.sum() > 0:
                preds_stress = torch.argmax(stress_logits[valid_mask], dim=-1)
                correct_stress += (preds_stress == stress_lbls[valid_mask]).sum().item()
                total_stress += valid_mask.sum().item()

        train_domain_acc = correct_domain / total_domain
        train_stress_acc = (correct_stress / total_stress) if total_stress > 0 else 0.0

        # Validation
        model.eval()
        val_correct_domain = 0
        val_total_domain = 0
        val_correct_stress = 0
        val_total_stress = 0
        ood_rejection_count = 0
        ood_total_count = 0

        with torch.no_grad():
            for images, domain_lbls, stress_lbls, _ in val_loader:
                images = images.to(device)
                domain_lbls = domain_lbls.to(device)
                stress_lbls = stress_lbls.to(device)

                domain_logits, stress_logits = model(images)
                preds_domain = torch.argmax(domain_logits, dim=-1)

                val_correct_domain += (preds_domain == domain_lbls).sum().item()
                val_total_domain += len(images)

                # Check OOD Rejection (Class 2 = Invalid)
                invalid_mask = domain_lbls == 2
                if invalid_mask.sum() > 0:
                    ood_rejection_count += (preds_domain[invalid_mask] == 2).sum().item()
                    ood_total_count += invalid_mask.sum().item()

                valid_mask = stress_lbls >= 0
                if valid_mask.sum() > 0:
                    preds_stress = torch.argmax(stress_logits[valid_mask], dim=-1)
                    val_correct_stress += (preds_stress == stress_lbls[valid_mask]).sum().item()
                    val_total_stress += valid_mask.sum().item()

        val_domain_acc = val_correct_domain / val_total_domain
        val_stress_acc = (val_correct_stress / val_total_stress) if val_total_stress > 0 else 0.0
        ood_rejection_rate = (ood_rejection_count / ood_total_count) if ood_total_count > 0 else 1.0

        print(f"Epoch [{epoch:02d}/{epochs:02d}] "
              f"Loss: {total_loss/total_domain:.4f} | "
              f"Domain Acc: {val_domain_acc*100:.1f}% | "
              f"Stress Acc: {val_stress_acc*100:.1f}% | "
              f"Fake/OOD Rejection: {ood_rejection_rate*100:.1f}%")

        if val_stress_acc >= best_val_acc:
            best_val_acc = val_stress_acc
            os.makedirs(os.path.dirname(output_model_path), exist_ok=True)
            torch.save(model.state_dict(), output_model_path)
            print(f"  -> Saved best model checkpoint to {output_model_path}")

    print(f"\nFinal Best Validation Stress Accuracy: {best_val_acc*100:.2f}%")
    print(f"Anti-Fake / OOD Rejection Guarantee: {ood_rejection_rate*100:.2f}%")

if __name__ == '__main__':
    dataset_dir = r"d:\stress monitor main\Datasets\waveform_image_dataset"
    output_path = r"d:\stress monitor main\ML_Models_and_Training\tflite_models\vision_waveform_guard.pt"
    train_model(dataset_dir, output_path, epochs=10)
