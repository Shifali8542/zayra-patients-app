import { Colors } from './colors';
import { FontFamily, FontSize } from './fonts';
import { Spacing, Radius, Shadow } from './spacing';

export const lightTheme = {
  isDark: false,
  colors: {
    background: Colors.gradientBg,
    backgroundSolid: '#E4F7F5',
    surface: Colors.white,
    surfaceAlt: Colors.gray50,
    border: Colors.gray100,
    borderLight: 'rgba(255,255,255,0.80)',

    // Text
    textPrimary: Colors.navy,
    textSecondary: Colors.gray500,
    textTertiary: Colors.gray400,
    textOnDark: Colors.white,
    textOnTeal: Colors.white,

    // Brand
    primary: Colors.teal,
    primaryAccent: Colors.tealAccent,
    primaryDark: Colors.tealDark,
    secondary: Colors.navy,
    secondaryMid: Colors.navyMid,
    mint: Colors.mint,
    mintLight: Colors.mintLight,

    // Nav
    navBackground: Colors.white,
    navBorder: Colors.gray100,
    navActive: Colors.teal,
    navInactive: Colors.gray400,

    // Card
    card: Colors.white,
    cardBorder: Colors.gray100,

    // Input
    inputBg: 'rgba(255,255,255,0.70)',
    inputBorder: 'rgba(255,255,255,0.80)',
    inputText: Colors.navy,
    inputPlaceholder: Colors.gray400,
    inputFocus: Colors.teal,

    // Status
    success: Colors.success,
    warning: Colors.warning,
    error: Colors.error,

    // Misc
    tealAlpha10: Colors.tealAlpha10,
    tealAlpha20: Colors.tealAlpha20,
    divider: Colors.gray100,
  },
  fonts: FontFamily,
  fontSize: FontSize,
  spacing: Spacing,
  radius: Radius,
  shadow: Shadow,
  gradients: {
    bg: Colors.gradientBg as string[],
    teal: Colors.gradientTeal as string[],
    navy: Colors.gradientNavy as string[],
    card: ['rgba(255,255,255,0.90)', 'rgba(255,255,255,0.70)'] as string[],
  },
};


export type Theme = {
  isDark: boolean;
  colors: Record<string, string>;
  fonts: typeof FontFamily;
  fontSize: typeof FontSize;
  spacing: typeof Spacing;
  radius: typeof Radius;
  shadow: typeof Shadow;
  gradients: Record<string, string[]>;
};
