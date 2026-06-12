import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

// icon.png — placed at assets/icon.png in the project root
const iconAsset = require('../../../assets/icon.png');

interface ZayraLogoProps {
  size?: number;
  showText?: boolean;
  variant?: 'icon' | 'logo'; // 'icon' = square icon only, 'logo' = icon + wordmark
}

export function ZayraLogo({ size = 40, showText = true, variant = 'logo' }: ZayraLogoProps) {
  const { theme } = useTheme();

  // Web uses h-7 w-7 (28px) in HomeTab header, h-10 w-10 (40px) in onboarding headers
  // Match exact sizing by scaling icon relative to passed size
  const iconSize = variant === 'icon' ? size : size * 0.7;
  const radius = iconSize * 0.25; // rounded-lg equivalent
  const wordmarkSize = size * 0.38;

  return (
    <View style={styles.container}>
      <Image
        source={iconAsset}
        style={[
          styles.icon,
          {
            width: iconSize,
            height: iconSize,
            borderRadius: radius,
          },
        ]}
        resizeMode="cover"
      />
      {showText && variant !== 'icon' && (
        <Text
          style={[
            styles.wordmark,
            {
              fontSize: wordmarkSize,
              color: theme.colors.textPrimary,
              fontFamily: theme.fonts.displayBold,
            },
          ]}
        >
          Zayra
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    // shadow matching web's shadow-soft
    shadowColor: '#00C2B2',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  wordmark: {
    letterSpacing: -0.3,
  },
});