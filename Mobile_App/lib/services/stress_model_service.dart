import 'dart:math' as math;
import 'package:tflite_flutter/tflite_flutter.dart';

class StressPrediction {
  final double probability;
  final bool highStress;

  StressPrediction({
    required this.probability,
    required this.highStress,
  });

  String get label => highStress ? 'HIGH STRESS' : 'NORMAL';
}

class StressModelService {
  Interpreter? _interpreter;

  static const String modelPath =
      'assets/models/Stress_V4_Final.tflite';

  // Validation threshold obtained from the trained V4 model.
  static const double threshold = 0.26;

  /// Loads the TensorFlow Lite model.
  Future<void> loadModel() async {
    if (_interpreter != null) {
      return;
    }

    _interpreter = await Interpreter.fromAsset(modelPath);

    print('====================================');
    print('Stress model loaded successfully');
    print(
      'Input 0 shape: ${_interpreter!.getInputTensor(0).shape}',
    );
    print(
      'Input 1 shape: ${_interpreter!.getInputTensor(1).shape}',
    );
    print(
      'Output shape: ${_interpreter!.getOutputTensor(0).shape}',
    );
    print('====================================');
  }

  /// EEG preprocessing.
  ///
  /// Input:
  ///   3840 samples × 32 channels
  ///
  /// For every EEG channel:
  ///   1. Calculate mean
  ///   2. Calculate standard deviation
  ///   3. Z-score normalize
  ///   4. Clip values between -5 and +5
  List<List<double>> normalizeEEG(
      List<List<double>> eeg,
      ) {
    final int samples = eeg.length;
    final int channels = eeg[0].length;

    final result = List.generate(
      samples,
          (_) => List.filled(channels, 0.0),
    );

    for (int ch = 0; ch < channels; ch++) {
      double sum = 0.0;

      for (int i = 0; i < samples; i++) {
        sum += eeg[i][ch];
      }

      final double mean = sum / samples;

      double variance = 0.0;

      for (int i = 0; i < samples; i++) {
        final double difference =
            eeg[i][ch] - mean;

        variance += difference * difference;
      }

      final double standardDeviation =
          math.sqrt(variance / samples) + 1e-6;

      for (int i = 0; i < samples; i++) {
        double value =
            (eeg[i][ch] - mean) / standardDeviation;

        value = value.clamp(-5.0, 5.0);

        result[i][ch] = value;
      }
    }

    return result;
  }

  /// GSR preprocessing.
  ///
  /// Input:
  ///   120 samples × 1 channel
  ///
  /// Z-score normalize and clip between -5 and +5.
  List<List<double>> normalizeGSR(
      List<List<double>> gsr,
      ) {
    final int samples = gsr.length;

    double sum = 0.0;

    for (final row in gsr) {
      sum += row[0];
    }

    final double mean = sum / samples;

    double variance = 0.0;

    for (final row in gsr) {
      final double difference =
          row[0] - mean;

      variance += difference * difference;
    }

    final double standardDeviation =
        math.sqrt(variance / samples) + 1e-6;

    return List.generate(
      samples,
          (i) {
        double value =
            (gsr[i][0] - mean) / standardDeviation;

        value = value.clamp(-5.0, 5.0);

        return [value];
      },
    );
  }

  /// Runs the trained EEG + GSR stress model.
  ///
  /// EEG shape:
  ///   3840 × 32
  ///
  /// GSR shape:
  ///   120 × 1
  Future<StressPrediction> predict({
    required List<List<double>> eeg,
    required List<List<double>> gsr,
  }) async {
    await loadModel();

    // -----------------------------
    // Check EEG dimensions
    // -----------------------------

    if (eeg.length != 3840) {
      throw Exception(
        'Invalid EEG data: '
            'expected 3840 samples, '
            'received ${eeg.length}.',
      );
    }

    if (eeg.isEmpty || eeg[0].length != 32) {
      throw Exception(
        'Invalid EEG data: '
            'expected 32 channels.',
      );
    }

    // -----------------------------
    // Check GSR dimensions
    // -----------------------------

    if (gsr.length != 120) {
      throw Exception(
        'Invalid GSR data: '
            'expected 120 samples, '
            'received ${gsr.length}.',
      );
    }

    if (gsr.isEmpty || gsr[0].length != 1) {
      throw Exception(
        'Invalid GSR data: '
            'expected 1 channel.',
      );
    }

    // -----------------------------
    // Preprocessing
    // -----------------------------

    final normalizedEEG =
    normalizeEEG(eeg);

    final normalizedGSR =
    normalizeGSR(gsr);

    // -----------------------------
    // Add batch dimension
    // -----------------------------

    final eegInput = [
      normalizedEEG,
    ];

    final gsrInput = [
      normalizedGSR,
    ];

    // -----------------------------
    // Model output
    // -----------------------------

    final output = {
      0: [
        [0.0]
      ],
    };

    // -----------------------------
    // Run model
    // -----------------------------

    _interpreter!.runForMultipleInputs(
      [
        eegInput,
        gsrInput,
      ],
      output,
    );

    // -----------------------------
    // Read prediction
    // -----------------------------

    final probability =
    ((output[0] as List)[0] as List)[0] as double;

    // -----------------------------
    // Apply threshold
    // -----------------------------

    final bool highStress =
        probability >= threshold;

    return StressPrediction(
      probability: probability,
      highStress: highStress,
    );
  }

  /// Releases the TensorFlow Lite interpreter.
  void close() {
    _interpreter?.close();
    _interpreter = null;
  }
}
