# Application Builds & Releases

## Android Production Package (APK)
The production Android APK package (`base.apk`, ~113 MB) enables standalone on-device AI stress classification using embedded TensorFlow Lite models.

### Installation Instructions
1. Download the release APK from the project's [GitHub Releases](../../releases) section.
2. Transfer the APK to your Android smartphone or tablet (Android 8.0+).
3. Enable "Install Unknown Apps" in your Android system security settings.
4. Tap the `.apk` file to install and launch the app.

### Building from Source (Flutter)
If you have the Flutter SDK installed on your workstation:
```bash
cd Mobile_App
flutter pub get
flutter build apk --release
```
The generated APK will be placed at:
`Mobile_App/build/app/outputs/flutter-apk/app-release.apk`
