enum StressLevel { low, moderate, high }

enum InputSourceType { demo, imageUpload, fileUpload }

class AnalysisResult {
  const AnalysisResult({
    required this.level,
    required this.observation,
    this.confidence,
    this.modelDetails,
    this.sourceType = InputSourceType.demo,
    this.eegImagePath,
    this.gsrImagePath,
    this.eegFileName,
    this.gsrFileName,
    this.dominantBand,
    this.gsrPeakCount,
    this.accuracyRate = '96.4%',
  });

  final StressLevel level;
  final String observation;
  final double? confidence;
  final String? modelDetails;
  final InputSourceType sourceType;
  final String? eegImagePath;
  final String? gsrImagePath;
  final String? eegFileName;
  final String? gsrFileName;
  final String? dominantBand;
  final int? gsrPeakCount;
  final String accuracyRate;

  bool get isHigh => level == StressLevel.high;
}

class ModelUnavailableException implements Exception {
  const ModelUnavailableException();
}
