import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface ZayraLogoProps {
  size?: number;
}

export function ZayraLogo({ size = 40 }: ZayraLogoProps) {
  const { theme } = useTheme();

  const iconSize = size * 0.55;
  const fontSize = size * 0.38;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.icon,
          {
            width: iconSize,
            height: iconSize,
            borderRadius: iconSize * 0.3,
            backgroundColor: theme.colors.primary,
          },
        ]}
      >
        <Text style={[styles.iconText, { fontSize: iconSize * 0.55, color: theme.colors.textOnDark }]}>
          Z
        </Text>
      </View>
      <Text
        style={[
          styles.wordmark,
          {
            fontSize,
            color: theme.colors.textPrimary,
            fontFamily: theme.fonts.displayBold,
          },
        ]}
      >
        zayra
      </Text>
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontWeight: '800',
  },
  wordmark: {
    letterSpacing: -0.5,
  },
});
