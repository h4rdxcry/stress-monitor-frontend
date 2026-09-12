import 'package:flutter/material.dart';

class AppTheme {
  static const ink = Color(0xFF102A43);
  static const teal = Color(0xFF167D85);
  static const mint = Color(0xFFDDF3EE);
  static const coral = Color(0xFFE7775C);
  static const canvas = Color(0xFFF5F8F7);

  static ThemeData get light => ThemeData(
    useMaterial3: true,
    scaffoldBackgroundColor: canvas,
    colorScheme:
        ColorScheme.fromSeed(
          seedColor: teal,
          brightness: Brightness.light,
        ).copyWith(
          primary: teal,
          secondary: coral,
          surface: Colors.white,
          onSurface: ink,
        ),
    fontFamily: 'Arial',
    appBarTheme: const AppBarTheme(
      backgroundColor: canvas,
      foregroundColor: ink,
      elevation: 0,
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: Colors.white,
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: BorderSide.none,
      ),
    ),
    cardTheme: CardThemeData(
      color: Colors.white,
      elevation: 0,
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
    ),
  );
}
