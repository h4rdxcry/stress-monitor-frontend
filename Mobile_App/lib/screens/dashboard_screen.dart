import 'dart:io';
import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:file_picker/file_picker.dart';

import '../state/analysis_controller.dart';
import 'result_screen.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({
    super.key,
    required this.isDoctor,
  });

  final bool isDoctor;

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> with SingleTickerProviderStateMixin {
  final AnalysisController _controller = AnalysisController();
  final ImagePicker _picker = ImagePicker();
  late TabController _tabController;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    _controller.dispose();
    super.dispose();
  }

  Future<void> _pickImage({required bool isEeg, required ImageSource source}) async {
    try {
      final picked = await _picker.pickImage(
        source: source,
        maxWidth: 1024,
        maxHeight: 1024,
        imageQuality: 85,
      );
      if (picked != null) {
        if (isEeg) {
          _controller.setEegImage(File(picked.path));
        } else {
          _controller.setGsrImage(File(picked.path));
        }
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error selecting image: $e')),
      );
    }
  }

  Future<void> _pickFile({required bool isEeg}) async {
    try {
      final result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: ['csv', 'json', 'txt'],
      );
      if (result != null && result.files.single.path != null) {
        final file = File(result.files.single.path!);
        if (isEeg) {
          _controller.setEegFile(file);
        } else {
          _controller.setGsrFile(file);
        }
      }
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error selecting medical file: $e')),
      );
    }
  }

  Future<void> _runImageAnalysis() async {
    await _controller.analyzeImages();
    _handleAnalysisResult();
  }

  Future<void> _runFileAnalysis() async {
    await _controller.analyzeFiles();
    _handleAnalysisResult();
  }

  Future<void> _runDemoAnalysis(bool highStress) async {
    await _controller.analyze(highStress: highStress);
    _handleAnalysisResult();
  }

  void _handleAnalysisResult() {
    if (!mounted) return;
    if (_controller.result != null) {
      Navigator.push(
        context,
        MaterialPageRoute(
          builder: (_) => ResultScreen(
            result: _controller.result!,
            isDoctor: widget.isDoctor,
            onNewAnalysis: () {
              _controller.clear();
              Navigator.pop(context);
            },
          ),
        ),
      );
    } else if (_controller.errorKey != null) {
      showDialog(
        context: context,
        builder: (ctx) => AlertDialog(
          icon: const Icon(Icons.gpp_bad, color: Colors.red, size: 48),
          title: const Text(
            'Waveform Ingestion Rejected',
            style: TextStyle(fontWeight: FontWeight.bold),
          ),
          content: Text(
            _controller.errorKey!,
            style: const TextStyle(fontSize: 13, height: 1.4),
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Acknowledge'),
            ),
          ],
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(
          widget.isDoctor ? 'Doctor Diagnostic Portal' : 'Stress Monitoring',
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        centerTitle: true,
        bottom: TabBar(
          controller: _tabController,
          labelColor: Theme.of(context).colorScheme.primary,
          unselectedLabelColor: Colors.blueGrey,
          indicatorColor: Theme.of(context).colorScheme.primary,
          tabs: const [
            Tab(icon: Icon(Icons.add_a_photo_outlined), text: 'Waveform Image'),
            Tab(icon: Icon(Icons.file_present_outlined), text: 'Medical File'),
            Tab(icon: Icon(Icons.science_outlined), text: 'Demo Test'),
          ],
        ),
      ),
      body: AnimatedBuilder(
        animation: _controller,
        builder: (context, _) {
          return Stack(
            children: [
              TabBarView(
                controller: _tabController,
                children: [
                  _buildImageUploadTab(),
                  _buildFileUploadTab(),
                  _buildDemoTab(),
                ],
              ),
              if (_controller.isLoading)
                Container(
                  color: Colors.black.withOpacity(0.55),
                  child: Center(
                    child: Card(
                      margin: const EdgeInsets.symmetric(horizontal: 32),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                      child: Padding(
                        padding: const EdgeInsets.all(28),
                        child: Column(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const CircularProgressIndicator(),
                            const SizedBox(height: 20),
                            const Text(
                              'AI Diagnostic Processing',
                              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
                            ),
                            const SizedBox(height: 10),
                            Text(
                              _controller.statusMessage.isNotEmpty
                                  ? _controller.statusMessage
                                  : 'Assessing waveforms for high stress markers...',
                              textAlign: TextAlign.center,
                              style: TextStyle(color: Colors.blueGrey[700], fontSize: 14),
                            ),
                            const SizedBox(height: 12),
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              decoration: BoxDecoration(
                                color: Colors.teal.withOpacity(0.12),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Text(
                                'Target Accuracy: >= 95.4%',
                                style: TextStyle(
                                  color: Color(0xFF167D85),
                                  fontWeight: FontWeight.bold,
                                  fontSize: 13,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),
            ],
          );
        },
      ),
    );
  }

  Widget _buildImageUploadTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFFE9F5F3),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFF167D85).withOpacity(0.25)),
            ),
            child: Row(
              children: [
                const Icon(Icons.info_outline, color: Color(0xFF167D85)),
                const SizedBox(width: 12),
                Expanded(
                  child: Text(
                    widget.isDoctor
                        ? 'Upload or photograph EEG strip graphs and GSR curves to run automated clinical stress assessment.'
                        : 'Upload clear photos or screenshots of your EEG and GSR waveform printouts.',
                    style: const TextStyle(fontSize: 13, color: Color(0xFF1B494F)),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),

          // Slot 1: EEG Image
          _buildUploadSlot(
            title: '1. EEG Waveform Strip / Image',
            subtitle: 'Electroencephalogram (32-channel or single strip)',
            icon: Icons.psychology_outlined,
            file: _controller.selectedEegImage,
            isEeg: true,
            isImage: true,
          ),

          const SizedBox(height: 16),

          // Slot 2: GSR Image
          _buildUploadSlot(
            title: '2. GSR / EDA Waveform Graph',
            subtitle: 'Galvanic Skin Response (Skin Conductance Level)',
            icon: Icons.waves_rounded,
            file: _controller.selectedGsrImage,
            isEeg: false,
            isImage: true,
          ),

          const SizedBox(height: 24),

          SizedBox(
            height: 54,
            child: ElevatedButton.icon(
              onPressed: _controller.canAnalyze && _controller.hasValidImageUpload
                  ? _runImageAnalysis
                  : null,
              icon: const Icon(Icons.analytics_outlined),
              label: Text(
                _controller.hasValidImageUpload
                    ? 'Analyze Waveform Images'
                    : 'Select Both Waveforms to Analyze',
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF167D85),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFileUploadTab() {
    return SingleChildScrollView(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: const Color(0xFFF0F4F8),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Row(
              children: [
                const Icon(Icons.file_copy_outlined, color: Color(0xFF102A43)),
                const SizedBox(width: 12),
                const Expanded(
                  child: Text(
                    'Direct export ingestion: Select .csv or .json time-series recording files from EEG and GSR sensor hardware.',
                    style: TextStyle(fontSize: 13, color: Color(0xFF102A43)),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(height: 18),

          // Slot 1: EEG File
          _buildUploadSlot(
            title: '1. EEG Signal Data File',
            subtitle: 'Formatted .csv or .json with 32 channels',
            icon: Icons.biotech_outlined,
            file: _controller.selectedEegFile,
            isEeg: true,
            isImage: false,
          ),

          const SizedBox(height: 16),

          // Slot 2: GSR File
          _buildUploadSlot(
            title: '2. GSR / EDA Signal Data File',
            subtitle: 'Skin conductance micro-Siemens time-series',
            icon: Icons.show_chart_rounded,
            file: _controller.selectedGsrFile,
            isEeg: false,
            isImage: false,
          ),

          const SizedBox(height: 24),

          SizedBox(
            height: 54,
            child: ElevatedButton.icon(
              onPressed: _controller.canAnalyze && _controller.hasValidFileUpload
                  ? _runFileAnalysis
                  : null,
              icon: const Icon(Icons.speed_outlined),
              label: Text(
                _controller.hasValidFileUpload
                    ? 'Analyze Medical Files'
                    : 'Select Both Data Files to Analyze',
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF102A43),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDemoTab() {
    return Padding(
      padding: const EdgeInsets.all(24),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Icon(Icons.science_outlined, size: 70, color: Color(0xFF167D85)),
          const SizedBox(height: 16),
          const Text(
            'Calibrated Laboratory Benchmark',
            style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 10),
          Text(
            'Use standard 30-second physiological baseline samples to verify the model on-device in presentation mode.',
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.blueGrey[700], fontSize: 15),
          ),
          const SizedBox(height: 32),
          SizedBox(
            width: double.infinity,
            height: 54,
            child: ElevatedButton.icon(
              onPressed: _controller.isLoading ? null : () => _runDemoAnalysis(false),
              icon: const Icon(Icons.check_circle_outline),
              label: const Text('Evaluate NORMAL Sample', style: TextStyle(fontSize: 16)),
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.teal[700],
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
            ),
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            height: 54,
            child: ElevatedButton.icon(
              onPressed: _controller.isLoading ? null : () => _runDemoAnalysis(true),
              icon: const Icon(Icons.warning_amber_rounded),
              label: const Text('Evaluate HIGH STRESS Sample', style: TextStyle(fontSize: 16)),
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFFE7775C),
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildUploadSlot({
    required String title,
    required String subtitle,
    required IconData icon,
    required File? file,
    required bool isEeg,
    required bool isImage,
  }) {
    final bool isUploaded = file != null;

    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(18),
        side: BorderSide(
          color: isUploaded ? const Color(0xFF167D85) : Colors.grey.shade300,
          width: isUploaded ? 1.8 : 1.0,
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  backgroundColor: isUploaded
                      ? const Color(0xFF167D85).withOpacity(0.15)
                      : Colors.grey.shade100,
                  child: Icon(
                    isUploaded ? Icons.check : icon,
                    color: isUploaded ? const Color(0xFF167D85) : Colors.grey.shade700,
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15),
                      ),
                      Text(
                        subtitle,
                        style: TextStyle(color: Colors.blueGrey[600], fontSize: 12),
                      ),
                    ],
                  ),
                ),
                if (isUploaded)
                  IconButton(
                    icon: const Icon(Icons.cancel, color: Colors.red),
                    tooltip: 'Remove',
                    onPressed: () {
                      if (isImage) {
                        isEeg ? _controller.setEegImage(null) : _controller.setGsrImage(null);
                      } else {
                        isEeg ? _controller.setEegFile(null) : _controller.setGsrFile(null);
                      }
                    },
                  ),
              ],
            ),
            const SizedBox(height: 12),
            if (isUploaded) ...[
              if (isImage)
                ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: Container(
                    height: 120,
                    width: double.infinity,
                    color: Colors.black12,
                    child: Image.file(file, fit: BoxFit.cover),
                  ),
                )
              else
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade100,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.insert_drive_file, color: Color(0xFF167D85), size: 20),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          file.path.split(Platform.pathSeparator).last,
                          style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                ),
              const SizedBox(height: 10),
            ],
            Row(
              children: [
                if (isImage) ...[
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () => _pickImage(isEeg: isEeg, source: ImageSource.camera),
                      icon: const Icon(Icons.camera_alt, size: 18),
                      label: const Text('Camera'),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () => _pickImage(isEeg: isEeg, source: ImageSource.gallery),
                      icon: const Icon(Icons.photo_library, size: 18),
                      label: const Text('Gallery'),
                    ),
                  ),
                ] else ...[
                  Expanded(
                    child: OutlinedButton.icon(
                      onPressed: () => _pickFile(isEeg: isEeg),
                      icon: const Icon(Icons.upload_file, size: 18),
                      label: const Text('Choose .csv / .json'),
                    ),
                  ),
                ],
              ],
            ),
          ],
        ),
      ),
    );
  }
}
