export const Colors = {
  // Brand
  teal: '#00C2B2',
  tealAccent: '#00B4A6',
  tealDark: '#007A70',
  navy: '#0D1B2A',
  navyMid: '#1B3A55',
  mint: '#E0F7F5',
  mintLight: '#F0FAFA',

  // Gradients (as arrays for LinearGradient)
  gradientBg: ['#D6F3F0', '#C8EEE9', '#D8F2EF', '#E4F7F5'] as string[],
  gradientTeal: ['#00C2B2', '#0D1B2A'] as string[],
  gradientNavy: ['#0D1B2A', '#1B3A55'] as string[],
  gradientDarkBg: ['#0D1B2A', '#0F2235', '#0D1B2A'] as string[],

  // Neutral
  white: '#FFFFFF',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',

  // Status
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  blue: '#3B82F6',
  purple: '#8B5CF6',

  // Transparent
  tealAlpha10: 'rgba(0,194,178,0.10)',
  tealAlpha20: 'rgba(0,194,178,0.20)',
  tealAlpha30: 'rgba(0,194,178,0.30)',
  navyAlpha8: 'rgba(13,27,42,0.08)',
  whiteAlpha60: 'rgba(255,255,255,0.60)',
  whiteAlpha70: 'rgba(255,255,255,0.70)',
  whiteAlpha80: 'rgba(255,255,255,0.80)',
  blackAlpha10: 'rgba(0,0,0,0.10)',
} as const;

export type ColorKey = keyof typeof Colors;
