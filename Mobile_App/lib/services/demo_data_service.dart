import 'dart:convert';
import 'package:flutter/services.dart';

class DemoDataService {
  static const String highStressPath =
      'assets/demo/demo_stress_sample.json';

  static const String normalPath =
      'assets/demo/demo_normal_sample.json';

  Future<Map<String, dynamic>> loadDemoData({
    required bool highStress,
  }) async {
    final path = highStress ? highStressPath : normalPath;

    final jsonString = await rootBundle.loadString(path);
    final data = jsonDecode(jsonString);

    return {
      'eeg': (data['eeg'] as List)
          .map<List<double>>(
            (row) => (row as List)
            .map<double>((value) => (value as num).toDouble())
            .toList(),
      )
          .toList(),

      'gsr': (data['gsr'] as List)
          .map<List<double>>(
            (row) => (row as List)
            .map<double>((value) => (value as num).toDouble())
            .toList(),
      )
          .toList(),
    };
  }
}
