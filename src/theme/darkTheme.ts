import { Colors } from './colors';
import { FontFamily, FontSize } from './fonts';
import { Spacing, Radius, Shadow } from './spacing';
import type { Theme } from './lightTheme';

export const darkTheme: Theme = {
  isDark: true,
  colors: {
    background: Colors.gradientDarkBg,
    backgroundSolid: Colors.navy,
    surface: Colors.navyMid,
    surfaceAlt: '#0F2235',
    border: 'rgba(255,255,255,0.10)',
    borderLight: 'rgba(255,255,255,0.10)',

    textPrimary: Colors.white,
    textSecondary: '#9CA3AF',
    textTertiary: '#6B7280',
    textOnDark: Colors.white,
    textOnTeal: Colors.white,

    primary: Colors.teal,
    primaryAccent: Colors.tealAccent,
    primaryDark: Colors.tealDark,
    secondary: Colors.white,
    secondaryMid: Colors.navyMid,
    mint: 'rgba(0,194,178,0.15)',
    mintLight: 'rgba(0,194,178,0.08)',

    navBackground: Colors.navy,
    navBorder: 'rgba(255,255,255,0.08)',
    navActive: Colors.teal,
    navInactive: '#6B7280',

    card: Colors.navyMid,
    cardBorder: 'rgba(255,255,255,0.10)',

    inputBg: 'rgba(27,58,85,0.50)',
    inputBorder: 'rgba(255,255,255,0.10)',
    inputText: Colors.white,
    inputPlaceholder: '#6B7280',
    inputFocus: Colors.teal,

    success: Colors.success,
    warning: Colors.warning,
    error: Colors.error,

    tealAlpha10: Colors.tealAlpha10,
    tealAlpha20: Colors.tealAlpha20,
    divider: 'rgba(255,255,255,0.08)',
  },
  fonts: FontFamily,
  fontSize: FontSize,
  spacing: Spacing,
  radius: Radius,
  shadow: Shadow,
  gradients: {
    bg: Colors.gradientDarkBg as string[],
    teal: Colors.gradientTeal as string[],
    navy: Colors.gradientNavy as string[],
    card: ['rgba(27,58,85,0.90)', 'rgba(27,58,85,0.70)'] as string[],
  },
} as const;
