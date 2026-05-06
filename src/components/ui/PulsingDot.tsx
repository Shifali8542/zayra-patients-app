import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';

interface PulsingDotProps {
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export function PulsingDot({ size = 8, color, style }: PulsingDotProps) {
  const { theme } = useTheme();
  const scale = useRef(new Animated.Value(1)).current;
  const dotColor = color ?? theme.colors.primary;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, { toValue: 1.4, duration: 800, useNativeDriver: true }),
        Animated.timing(scale, { toValue: 1, duration: 800, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [scale]);

  return (
    <Animated.View
      style={[
        styles.dot,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: dotColor,
          transform: [{ scale }],
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  dot: {},
});
