import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface StatusBadgeProps {
  label: string;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export function StatusBadge({ label, icon, style }: StatusBadgeProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.badge,
        {
          backgroundColor: theme.colors.mint,
          borderColor: theme.colors.tealAlpha20,
        },
        style,
      ]}
    >
      {icon}
      <Text
        style={[
          styles.label,
          {
            color: theme.colors.secondary,
            fontFamily: theme.fonts.sansSemiBold,
            fontSize: theme.fontSize.xs,
          },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
    borderWidth: 1,
  },
  label: {
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
