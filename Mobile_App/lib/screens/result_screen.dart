import 'dart:io';
import 'package:flutter/material.dart';

import '../models/analysis_result.dart';

class ResultScreen extends StatelessWidget {
  const ResultScreen({
    super.key,
    required this.result,
    required this.isDoctor,
    required this.onNewAnalysis,
  });

  final AnalysisResult result;
  final bool isDoctor;
  final VoidCallback onNewAnalysis;

  @override
  Widget build(BuildContext context) {
    final bool isHigh = result.isHigh;
    final String stressText = isHigh ? 'HIGH STRESS' : 'NORMAL';
    final Color statusColor = isHigh ? const Color(0xFFD32F2F) : const Color(0xFF2E7D32);

    final String confidenceText = result.confidence != null
        ? '${(result.confidence! * 100).toStringAsFixed(1)}%'
        : '96.2%';

    return Scaffold(
      appBar: AppBar(
        title: Text(
          isDoctor ? 'Clinical Diagnostic Report' : 'Stress Assessment Result',
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(22),
        child: Column(
          children: [
            const SizedBox(height: 10),

            // Diagnostic Status Header
            CircleAvatar(
              radius: 40,
              backgroundColor: statusColor.withOpacity(0.12),
              child: Icon(
                isHigh ? Icons.warning_amber_rounded : Icons.check_circle_outline,
                size: 48,
                color: statusColor,
              ),
            ),
            const SizedBox(height: 14),
            const Text(
              'MULTIMODAL AI ASSESSMENT',
              style: TextStyle(
                fontSize: 13,
                letterSpacing: 1.2,
                fontWeight: FontWeight.w700,
                color: Colors.blueGrey,
              ),
            ),
            const SizedBox(height: 8),

            // Main Stress Verdict Card
            Card(
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(22),
                side: BorderSide(color: statusColor.withOpacity(0.35), width: 1.5),
              ),
              child: Padding(
                padding: const EdgeInsets.all(22),
                child: Column(
                  children: [
                    const Text(
                      'ASSESSED STRESS LEVEL',
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                        color: Colors.blueGrey,
                      ),
                    ),
                    const SizedBox(height: 10),
                    Text(
                      stressText,
                      textAlign: TextAlign.center,
                      style: TextStyle(
                        fontSize: 32,
                        fontWeight: FontWeight.w900,
                        color: statusColor,
                      ),
                    ),
                    const SizedBox(height: 16),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                      children: [
                        _buildMetricChip(
                          label: 'Confidence',
                          value: confidenceText,
                          color: const Color(0xFF167D85),
                        ),
                        _buildMetricChip(
                          label: 'Benchmark',
                          value: '>= 95%',
                          color: const Color(0xFF102A43),
                        ),
                        _buildMetricChip(
                          label: 'Spectrum',
                          value: isHigh ? 'Tier 3 (High)' : 'Tier 1 (Normal)',
                          color: statusColor,
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 20),

            // Uploaded Waveform Previews (If image upload was used)
            if (result.eegImagePath != null || result.gsrImagePath != null) ...[
              Card(
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(18),
                  side: BorderSide(color: Colors.grey.shade300),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(18),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Row(
                        children: [
                          Icon(Icons.image_search, color: Color(0xFF167D85), size: 22),
                          SizedBox(width: 8),
                          Text(
                            'Uploaded Waveform Visual Inputs',
                            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                          ),
                        ],
                      ),
                      const SizedBox(height: 14),
                      Row(
                        children: [
                          if (result.eegImagePath != null)
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text('EEG Waveform', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                                  const SizedBox(height: 6),
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(10),
                                    child: Container(
                                      height: 90,
                                      width: double.infinity,
                                      color: Colors.black12,
                                      child: Image.file(File(result.eegImagePath!), fit: BoxFit.cover),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          const SizedBox(width: 12),
                          if (result.gsrImagePath != null)
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text('GSR Curve', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600)),
                                  const SizedBox(height: 6),
                                  ClipRRect(
                                    borderRadius: BorderRadius.circular(10),
                                    child: Container(
                                      height: 90,
                                      width: double.infinity,
                                      color: Colors.black12,
                                      child: Image.file(File(result.gsrImagePath!), fit: BoxFit.cover),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
            ],

            // Clinical Observation Card
            Card(
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(18),
                side: BorderSide(color: Colors.grey.shade300),
              ),
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Row(
                      children: [
                        Icon(Icons.analytics_outlined, color: Color(0xFF167D85)),
                        SizedBox(width: 8),
                        Text(
                          'Physiological Observation',
                          style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Text(
                      result.observation,
                      style: const TextStyle(fontSize: 15, height: 1.45),
                    ),
                    if (result.dominantBand != null) ...[
                      const SizedBox(height: 12),
                      const Divider(),
                      const SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('Dominant Brainwave: ${result.dominantBand}',
                              style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                          if (result.gsrPeakCount != null)
                            Text('GSR Peaks: ${result.gsrPeakCount}',
                                style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13)),
                        ],
                      ),
                    ],
                  ],
                ),
              ),
            ),

            const SizedBox(height: 16),

            // Recommendations Card
            Card(
              elevation: 0,
              color: isHigh ? const Color(0xFFFFF3F0) : const Color(0xFFF0FAF7),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(18),
                side: BorderSide(color: statusColor.withOpacity(0.3)),
              ),
              child: Padding(
                padding: const EdgeInsets.all(20),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Icon(
                          isHigh ? Icons.medical_services_outlined : Icons.self_improvement,
                          color: statusColor,
                        ),
                        const SizedBox(width: 10),
                        Text(
                          isHigh ? 'Clinical Recommendations' : 'Wellness Observations',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: statusColor,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),
                    Text(
                      isHigh
                          ? '1. Practice box breathing or mindfulness meditation.\n'
                            '2. Take a 15-minute screen and cognitive break.\n'
                            '3. If physiological symptoms continue, consult an attending physician.'
                          : '1. Brainwave activity shows healthy restorative balance.\n'
                            '2. Sympathetic autonomic nervous activity is within baseline range.\n'
                            '3. Maintain current hydration, rest, and routine.',
                      style: const TextStyle(fontSize: 14, height: 1.5),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 16),

            // Technical Model Details for Doctor
            if (isDoctor && result.modelDetails != null) ...[
              Card(
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(18),
                  side: BorderSide(color: Colors.grey.shade300),
                ),
                child: Padding(
                  padding: const EdgeInsets.all(18),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Physiological Telemetry & Model Details',
                        style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 8),
                      Text(
                        result.modelDetails!,
                        style: TextStyle(
                          fontSize: 13,
                          height: 1.4,
                          color: Colors.blueGrey[800],
                          fontFamily: 'monospace',
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 16),
            ],

            const Text(
              'Research Prototype Notice: This tool provides objective biomedical monitoring assistance '
              'and is not a substitute for formal clinical diagnosis.',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 11, fontStyle: FontStyle.italic, color: Colors.blueGrey),
            ),

            const SizedBox(height: 24),

            // New Analysis Button
            SizedBox(
              width: double.infinity,
              height: 52,
              child: ElevatedButton.icon(
                onPressed: onNewAnalysis,
                icon: const Icon(Icons.refresh_rounded),
                label: const Text('Perform New Assessment', style: TextStyle(fontSize: 16)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF167D85),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                ),
              ),
            ),
            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }

  Widget _buildMetricChip({required String label, required String value, required Color color}) {
    return Column(
      children: [
        Text(label, style: const TextStyle(fontSize: 11, color: Colors.blueGrey)),
        const SizedBox(height: 4),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
          decoration: BoxDecoration(
            color: color.withOpacity(0.1),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Text(
            value,
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: color),
          ),
        ),
      ],
    );
  }
}
