import 'package:flutter/material.dart';

import '../l10n/app_localizations.dart';
import 'dashboard_screen.dart';
import 'settings_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key, required this.onLocaleChanged});
  final ValueChanged<Locale> onLocaleChanged;

  @override
  Widget build(BuildContext context) {
    final strings = Localizations.of<AppLocalizations>(
      context,
      AppLocalizations,
    )!;
    return Scaffold(
      appBar: AppBar(
        actions: [
          IconButton(
            tooltip: strings.settings,
            icon: const Icon(Icons.tune_rounded),
            onPressed: () => Navigator.push(
              context,
              MaterialPageRoute(
                builder: (_) =>
                    SettingsScreen(onLocaleChanged: onLocaleChanged),
              ),
            ),
          ),
        ],
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(22, 14, 22, 28),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: const Color(0xFF102A43),
                  borderRadius: BorderRadius.circular(28),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(
                      Icons.monitor_heart_outlined,
                      color: Color(0xFF8CE0D1),
                      size: 36,
                    ),
                    const SizedBox(height: 22),
                    Text(
                      strings.appName,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 30,
                        fontWeight: FontWeight.w800,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      strings.tagline,
                      style: const TextStyle(
                        color: Color(0xFFD6E7E5),
                        fontSize: 15,
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 32),
              Text(
                strings.welcome,
                style: Theme.of(context).textTheme.headlineSmall
                    ?.copyWith(fontWeight: FontWeight.w800),
              ),
              const SizedBox(height: 8),
              Text(
                strings.chooseDashboard,
                style: Theme.of(context).textTheme.bodyLarge
                    ?.copyWith(color: Colors.blueGrey[700]),
              ),
              const SizedBox(height: 22),
              _DashboardChoice(
                icon: Icons.person_outline_rounded,
                title: strings.patient,
                description: strings.patientDescription,
                color: const Color(0xFF167D85),
                onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => const DashboardScreen(isDoctor: false),
                  ),
                ),
              ),
              const SizedBox(height: 14),
              _DashboardChoice(
                icon: Icons.medical_information_outlined,
                title: strings.doctor,
                description: strings.doctorDescription,
                color: const Color(0xFFE7775C),
                onTap: () => Navigator.push(
                  context,
                  MaterialPageRoute(
                    builder: (_) => const DashboardScreen(isDoctor: true),
                  ),
                ),
              ),
              const SizedBox(height: 24),
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: const Color(0xFFE9F3F0),
                  borderRadius: BorderRadius.circular(18),
                ),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Icon(Icons.lock_outline, color: Color(0xFF167D85)),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        strings.privacyText,
                        style: const TextStyle(
                          height: 1.45,
                          color: Color(0xFF234E52),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _DashboardChoice extends StatelessWidget {
  const _DashboardChoice({
    required this.icon,
    required this.title,
    required this.description,
    required this.color,
    required this.onTap,
  });
  final IconData icon;
  final String title;
  final String description;
  final Color color;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) => Card(
    child: InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(24),
      child: Padding(
        padding: const EdgeInsets.all(20),
        child: Row(
          children: [
            CircleAvatar(
              radius: 27,
              backgroundColor: color.withOpacity(.12),
              foregroundColor: color,
              child: Icon(icon, size: 28),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w800,
                    ),
                  ),
                  const SizedBox(height: 5),
                  Text(
                    description,
                    style: TextStyle(color: Colors.blueGrey[700], height: 1.3),
                  ),
                ],
              ),
            ),
            Icon(Icons.arrow_forward_ios_rounded, size: 18, color: color),
          ],
        ),
      ),
    ),
  );
}
