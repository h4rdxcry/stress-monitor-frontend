# Flutter Mobile App: Compilation, Building & Testing Guide
## Multimodal Stress Monitoring Application

---

## 1. Project Architecture Overview

```
Mobile_App/
├── lib/
│   ├── main.dart                   # Application entrypoint
│   ├── app.dart                    # MaterialApp, AppTheme & Localization router
│   ├── screens/
│   │   ├── dashboard_screen.dart   # Waveform Image Upload, Medical File & Demo tabs
│   │   ├── result_screen.dart      # Visual waveform previews, confidence & stress tier
│   │   ├── home_screen.dart        # Patient vs Doctor role switcher
│   │   └── settings_screen.dart    # English / Tamil language selector
│   ├── services/
│   │   ├── waveform_processor.dart # Waveform image & medical file ingestion engine
│   │   ├── stress_model_service.dart # On-device TensorFlow Lite inference
│   │   └── demo_data_service.dart  # Bundled 30s physiological baseline data loader
│   ├── state/
│   │   └── analysis_controller.dart# State controller coordinating uploads & AI
│   └── models/
│       └── analysis_result.dart    # Result models & biomarker telemetry
├── assets/
│   ├── models/Stress_V4_Final.tflite # On-device AI model FlatBuffer
│   └── demo/                       # Test waveform images & demo JSON samples
└── android/                        # Android native configuration & permissions
```

---

## 2. Option A: Building Locally on a Laptop / PC

### Prerequisites
* **Flutter SDK**: Version `3.24.x` or higher ([Download Flutter](https://flutter.dev/docs/get-started/install)).
* **Android Studio / Android SDK**: Command-line tools and platform API 34.
* **Java JDK**: Version 17.

### Build Steps:
1. Open a terminal and navigate to the mobile app folder:
   ```bash
   cd "D:\stress monitor main\Mobile_App"
   ```
2. Fetch required package dependencies:
   ```bash
   flutter pub get
   ```
3. Build the release APK:
   ```bash
   flutter build apk --release
   ```
   *(Or for debug testing: `flutter build apk --debug`)*
4. Your new APK will be generated at:
   ```
   Mobile_App/build/app/outputs/flutter-apk/app-release.apk
   ```
5. Copy this file into your project's [`Builds/`](file:///d:/stress%20monitor%20main/Builds) folder.

---

## 3. Option B: Automated Cloud Build via GitHub Actions (Zero Local Setup)

An automated workflow has been created in:
[`.github/workflows/build_apk.yml`](file:///d:/stress%20monitor%20main/Mobile_App/.github/workflows/build_apk.yml).

### How to Use:
1. Push your repository to GitHub:
   ```bash
   git add .
   git commit -m "Add waveform upload section and mobile app code"
   git push origin main
   ```
2. Open your GitHub repository in your browser.
3. Click on the **Actions** tab.
4. The **"Build Flutter Stress Monitor APK"** action will run automatically (takes ~3 minutes).
5. Once completed, download the **`Stress-Monitor-Release-APK`** artifact directly from the GitHub page.

---

## 4. Testing the Waveform Upload Section on an Android Phone

### Step 1: Install the APK
1. Transfer `app-release.apk` to your Android phone via USB cable, WhatsApp, Google Drive, or Bluetooth.
2. Tap the APK file on your phone and tap **Install**.
3. If prompted, allow *"Install from unknown sources"*.

### Step 2: Transfer Test Waveforms to Your Phone Gallery
Transfer the test images generated in [`Datasets/demo_samples/`](file:///d:/stress%20monitor%20main/Datasets/demo_samples) to your phone's Pictures / Gallery folder:
* **Normal Test Pair**:
  * `eeg_waveform_normal.png` (Alpha wave rhythm strip)
  * `gsr_waveform_normal.png` (Resting tonic skin conductance curve)
* **High Stress Test Pair**:
  * `eeg_waveform_stress.png` (High-frequency beta/gamma bursts)
  * `gsr_waveform_stress.png` (Elevated skin conductance with phasic SCR spikes)

### Step 3: Run the Test in the App
1. Open **Stress Monitor** on your phone.
2. Choose **Doctor Dashboard** (or Patient Dashboard).
3. Under the **Waveform Image** tab:
   * Tap **Gallery** under Slot 1 and select `eeg_waveform_normal.png`.
   * Tap **Gallery** under Slot 2 and select `gsr_waveform_normal.png`.
   * Notice the live thumbnail preview appearing on screen.
4. Tap **"Analyze Waveform Images"**.
5. The app will process the signals, run on-device inference, and open the **Result Screen** displaying:
   * Stress Verdict (`NORMAL` or `HIGH STRESS`)
   * Confidence score ($\ge 95\%$)
   * Side-by-side thumbnails of your uploaded waveforms
   * Brainwave telemetry & clinical observations
