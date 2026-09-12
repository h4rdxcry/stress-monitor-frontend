import 'package:flutter/material.dart';

import '../l10n/app_localizations.dart';

class SettingsScreen extends StatelessWidget {
  const SettingsScreen({super.key, required this.onLocaleChanged});
  final ValueChanged<Locale> onLocaleChanged;

  @override
  Widget build(BuildContext context) {
    final strings = Localizations.of<AppLocalizations>(
      context,
      AppLocalizations,
    )!;
    return Scaffold(
      appBar: AppBar(title: Text(strings.settings)),
      body: ListView(
        padding: const EdgeInsets.all(22),
        children: [
          Text(
            strings.language,
            style: Theme.of(context).textTheme.titleLarge
                ?.copyWith(fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 12),
          Card(
            child: Column(
              children: [
                ListTile(
                  leading: const Icon(Icons.translate),
                  title: Text(strings.english),
                  onTap: () {
                    onLocaleChanged(const Locale('en'));
                    Navigator.pop(context);
                  },
                ),
                const Divider(height: 1),
                ListTile(
                  leading: const Icon(Icons.translate),
                  title: Text(strings.tamil),
                  onTap: () {
                    onLocaleChanged(const Locale('ta'));
                    Navigator.pop(context);
                  },
                ),
              ],
            ),
          ),
          const SizedBox(height: 28),
          Text(
            strings.privacy,
            style: Theme.of(context).textTheme.titleLarge
                ?.copyWith(fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 12),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(18),
              child: Text(
                strings.privacyText,
                style: const TextStyle(height: 1.5),
              ),
            ),
          ),
          const SizedBox(height: 28),
          Text(
            strings.help,
            style: Theme.of(context).textTheme.titleLarge
                ?.copyWith(fontWeight: FontWeight.w800),
          ),
          const SizedBox(height: 12),
          Card(
            child: Padding(
              padding: const EdgeInsets.all(18),
              child: Text(
                strings.workflow,
                style: const TextStyle(height: 1.5),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
