import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';

import 'l10n/app_localizations.dart';
import 'screens/home_screen.dart';
import 'theme/app_theme.dart';

class BioMonitorApp extends StatefulWidget {
  const BioMonitorApp({super.key});
  @override
  State<BioMonitorApp> createState() => _BioMonitorAppState();
}

class _BioMonitorAppState extends State<BioMonitorApp> {
  Locale _locale = const Locale('en');

  @override
  Widget build(BuildContext context) => MaterialApp(
    debugShowCheckedModeBanner: false,
    title: 'BioMonitor',
    theme: AppTheme.light,
    locale: _locale,
    supportedLocales: AppLocalizations.supportedLocales,
    localizationsDelegates: const [
      AppLocalizations.delegate,
      GlobalMaterialLocalizations.delegate,
      GlobalWidgetsLocalizations.delegate,
      GlobalCupertinoLocalizations.delegate,
    ],
    home: HomeScreen(
      onLocaleChanged: (locale) => setState(() => _locale = locale),
    ),
  );
}
