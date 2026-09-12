class AppLocalizations {
  const AppLocalizations(this.locale);

  final Locale locale;
  static const supportedLocales = [Locale('en'), Locale('ta')];
  static const delegate = _AppLocalizationsDelegate();
  bool get isTamil => locale.languageCode == 'ta';

  String get appName => isTamil ? 'BioMonitor' : 'BioMonitor';
  String get tagline => isTamil
      ? 'EEG மற்றும் GSR மூலம் அழுத்தக் கண்காணிப்பு'
      : 'Stress monitoring with EEG + GSR';
  String get welcome =>
      isTamil ? 'உங்கள் கண்காணிப்பு பணியிடம்' : 'Your monitoring workspace';
  String get chooseDashboard => isTamil
      ? 'தொடங்கும் இடத்தைத் தேர்ந்தெடுக்கவும்'
      : 'Choose a workspace to begin';
  String get patient => isTamil ? 'நோயாளி' : 'Patient';
  String get doctor => isTamil ? 'மருத்துவர்' : 'Doctor';
  String get patientDescription => isTamil
      ? 'எளிய அழுத்தக் கண்காணிப்பு மற்றும் நல்வாழ்வு வழிகாட்டி'
      : 'Simple stress monitoring and wellness guidance';
  String get doctorDescription => isTamil
      ? 'விரிவான மாதிரி தகவல்கள் மற்றும் கவனிப்புகள்'
      : 'Detailed model information and observations';
  String get settings => isTamil ? 'அமைப்புகள்' : 'Settings';
  String get language => isTamil ? 'மொழி' : 'Language';
  String get english => 'English';
  String get tamil => 'தமிழ்';
  String get privacy => isTamil ? 'தனியுரிமை' : 'Privacy';
  String get privacyText => isTamil
      ? 'படங்கள் இந்த சாதனத்தில் உள்ளூர் மாதிரியால் செயலாக்கப்படும். பகுப்பாய்வு முடிந்ததும் தேவையற்ற கோப்புகள் சேமிக்கப்படாது.'
      : 'Images are processed locally by the connected model. Unnecessary files are not retained after analysis.';
  String get disclaimer => isTamil
      ? 'இது கல்வி மற்றும் ஆராய்ச்சி நோக்கங்களுக்கான அழுத்தக் கண்காணிப்பு தகவல் மட்டுமே; மருத்துவ நோயறிதல் அல்லது சிகிச்சைக்கு மாற்றாகாது.'
      : 'For educational and research stress monitoring only. Not a substitute for professional medical diagnosis or treatment.';
  String get uploadTitle =>
      isTamil ? 'உங்கள் தரவைச் சேர்க்கவும்' : 'Add your signals';
  String get uploadSubtitle => isTamil
      ? 'இரண்டு படங்களையும் சேர்த்து பகுப்பாய்வு செய்யவும்'
      : 'Add both images to begin analysis';
  String get eeg => isTamil ? 'EEG படம்' : 'EEG image';
  String get gsr => isTamil ? 'GSR படம்' : 'GSR image';
  String get selectImage => isTamil ? 'படத்தைத் தேர்ந்தெடு' : 'Select image';
  String get replace => isTamil ? 'மாற்று' : 'Replace';
  String get remove => isTamil ? 'நீக்கு' : 'Remove';
  String get analyze => isTamil ? 'பகுப்பாய்வு தொடங்கு' : 'Analyze signals';
  String get clear => isTamil ? 'அனைத்தையும் அழி' : 'Clear all';
  String get missingImages => isTamil
      ? 'EEG மற்றும் GSR படங்களைச் சேர்க்கவும்.'
      : 'Add both EEG and GSR images before analyzing.';
  String get formatError => isTamil
      ? 'JPG, PNG அல்லது WEBP படத்தைத் தேர்ந்தெடுக்கவும்.'
      : 'Choose a JPG, PNG, or WEBP image.';
  String get sizeError => isTamil
      ? 'படம் 12 MB-க்கு குறைவாக இருக்க வேண்டும்.'
      : 'The image must be smaller than 12 MB.';
  String get processing =>
      isTamil ? 'மாதிரி செயலாக்குகிறது' : 'Model is processing';
  String get processingText => isTamil
      ? 'உங்கள் EEG மற்றும் GSR தரவைப் பாதுகாப்பாக பகுப்பாய்வு செய்கிறோம்.'
      : 'Your EEG and GSR signals are being analyzed locally.';
  String get unavailable => isTamil
      ? 'மாதிரி இன்னும் இணைக்கப்படவில்லை. உண்மையான பயிற்சி பெற்ற மாதிரியை இணைத்து மீண்டும் முயற்சிக்கவும்.'
      : 'The model is not connected yet. Connect your trained local model and try again.';
  String get result => isTamil ? 'பகுப்பாய்வு முடிவு' : 'Analysis result';
  String get stressLevel => isTamil ? 'அழுத்த நிலை' : 'Stress level';
  String get low => isTamil ? 'குறைவு' : 'LOW';
  String get moderate => isTamil ? 'மிதமானது' : 'MODERATE';
  String get high => isTamil ? 'அதிகம்' : 'HIGH';
  String get recommendations =>
      isTamil ? 'பரிந்துரைகள்' : 'Wellness recommendations';
  String get observations => isTamil ? 'கவனிப்புகள்' : 'Clinical observations';
  String get newAnalysis => isTamil ? 'புதிய பகுப்பாய்வு' : 'New analysis';
  String get modelDetails => isTamil ? 'மாதிரி தகவல்கள்' : 'Model details';
  String get confidence => isTamil ? 'நம்பகத்தன்மை' : 'Confidence';
  String get noDiagnosis =>
      isTamil ? 'இது நோயறிதல் அல்ல' : 'This is not a diagnosis';
  String get lowAdvice => isTamil
      ? 'தொடர்ந்து ஓய்வு, நீர்ச்சத்து மற்றும் சமநிலையான தினசரி பழக்கங்களைப் பேணுங்கள்.'
      : 'Continue regular rest, hydration, and balanced daily routines.';
  String get moderateAdvice => isTamil
      ? 'சிறிது இடைவேளை எடுத்து, மெதுவான சுவாசப் பயிற்சி அல்லது அமைதியான நடைப்பயிற்சியை முயற்சிக்கவும்.'
      : 'Take a short pause and try slow breathing or a calm walk.';
  String get highAdvice => isTamil
      ? 'அமைதியான இடத்தில் ஓய்வு எடுத்து நம்பகமான நபரிடம் பேசுங்கள். தேவைப்பட்டால் சுகாதார நிபுணரை அணுகவும்.'
      : 'Rest in a calm place and speak with someone you trust. Contact a health professional if needed.';
  String get observationText => isTamil
      ? 'EEG மற்றும் GSR உள்ளீடுகளில் அழுத்தம் தொடர்பான முறை கவனிக்கப்பட்டது. முடிவை மருத்துவ சூழலுடன் சேர்த்து மதிப்பிடவும்.'
      : 'A stress-related pattern was observed across the EEG and GSR inputs. Interpret this output with clinical context.';
  String get back => isTamil ? 'பின்' : 'Back';
  String get help => isTamil ? 'உதவி & பற்றி' : 'Help & about';
  String get workflow => isTamil
      ? 'EEG படம் + GSR படம் → உள்ளூர் மாதிரி → முடிவு'
      : 'EEG image + GSR image → local model → result';

  String stressLabel(String value) => value == 'low'
      ? low
      : value == 'moderate'
      ? moderate
      : high;
}

class _AppLocalizationsDelegate
    extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();
  @override
  bool isSupported(Locale locale) => ['en', 'ta'].contains(locale.languageCode);
  @override
  Future<AppLocalizations> load(Locale locale) async =>
      AppLocalizations(locale);
  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}
