export const FontFamily = {
  // DM Sans - body/UI
  sansRegular: 'DMSans_400Regular',
  sansMedium: 'DMSans_500Medium',
  sansSemiBold: 'DMSans_600SemiBold',
  sansBold: 'DMSans_700Bold',

  // Sora - display/headings
  displayRegular: 'Sora_400Regular',
  displaySemiBold: 'Sora_600SemiBold',
  displayBold: 'Sora_700Bold',
  displayExtraBold: 'Sora_800ExtraBold',

  // Fallbacks
  system: 'System',
} as const;

export const FontSize = {
  xxs: 9,
  xs: 11,
  sm: 12,
  base: 14,
  md: 15,
  lg: 16,
  xl: 18,
  xxl: 20,
  h3: 22,
  h2: 24,
  h1: 28,
  display: 32,
  hero: 40,
  giant: 48,
} as const;

export const LineHeight = {
  tight: 1.2,
  snug: 1.35,
  normal: 1.5,
  relaxed: 1.65,
} as const;

export const LetterSpacing = {
  tight: -0.5,
  normal: 0,
  wide: 0.5,
  wider: 1,
  widest: 2,
} as const;
