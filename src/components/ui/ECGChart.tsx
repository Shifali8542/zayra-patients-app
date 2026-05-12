import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { useTheme } from '../../contexts/ThemeContext';

interface ECGChartProps {
  height?: number;
  samples?: number[] | null;
}

// Generate ECG-like path points
function generateECGPoints(width: number, height: number): string {
  const points: string[] = [];
  const mid = height / 2;
  const step = width / 60;

  for (let i = 0; i <= 60; i++) {
    const x = i * step;
    let y = mid;

    const phase = i % 20;
    if (phase === 5) y = mid + 4;
    else if (phase === 6) y = mid - 18;
    else if (phase === 7) y = mid + 12;
    else if (phase === 8) y = mid - 5;
    else if (phase === 9) y = mid + 2;
    else if (phase === 10) y = mid;
    else if (phase === 13) y = mid - 6;
    else if (phase === 14) y = mid - 8;
    else if (phase === 15) y = mid - 6;
    else y = mid;

    points.push(`${x},${y}`);
  }
  return points.join(' ');
}

export function ECGChart({ height = 56, samples = null }: ECGChartProps) {
  const { theme } = useTheme();
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.6,
          duration: 1200,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [opacity]);

  const width = 320;

  // Build SVG polyline string from real samples
  // Downsample to max 600 points so SVG stays performant
  const realPoints: string | null = (() => {
    if (!samples || samples.length < 2) return null;
    const step = Math.max(1, Math.floor(samples.length / 600));
    const pts = samples.filter((_, i) => i % step === 0);
    const min = Math.min(...pts);
    const max = Math.max(...pts);
    const range = max - min || 1;
    const mid = height / 2;
    return pts
      .map((v, i) => {
        const x = (i / (pts.length - 1)) * width;
        const y = mid - ((v - min) / range) * (height - 10) + 5;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  })();

  const fallbackPoints = generateECGPoints(width, height);
  const isReal = realPoints !== null;

  return (
    <View style={[styles.container, { height }]}>
      <Animated.View style={{ opacity: isReal ? 1 : opacity }}>
        <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
          <Polyline
            points={isReal ? realPoints! : fallbackPoints}
            fill="none"
            stroke={theme.colors.primary}
            strokeWidth={isReal ? 1.5 : 2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </Svg>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
});
