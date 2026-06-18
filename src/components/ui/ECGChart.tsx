import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';
import { useTheme } from '../../contexts/ThemeContext';
import { useBLEContext } from '../../contexts/BLEContext';

// Constants
const SVG_WIDTH      = 320;
const DISPLAY_POINTS = 200; 
const FPS            = 30; 
const FRAME_MS       = 1000 / FPS;
const ADVANCE_PER_FRAME = 1;

// Helpers
function downsample(arr: number[], maxPts: number): number[] {
  if (arr.length <= maxPts) return arr;
  const step = Math.floor(arr.length / maxPts);
  return arr.filter((_, i) => i % step === 0).slice(0, maxPts);
}

function normalise(arr: number[]): number[] {
  const min = Math.min(...arr);
  const max = Math.max(...arr);
  const range = max - min || 1;
  return arr.map(v => (v - min) / range);
}

function toSvgPoints(window: number[], height: number): string {
  const mid   = height / 2;
  const amp   = (height - 12) / 2; 
  const xStep = SVG_WIDTH / (window.length - 1);
  return window
    .map((v, i) => `${(i * xStep).toFixed(1)},${(mid - v * amp * 2 + amp).toFixed(1)}`)
    .join(' ');
}

const STATIC_BEAT: number[] = [
  0,0,0,0,0, 0.05,0.02,0, 0, 0,
  0, 0.02, 0.08, 0.02, 0,
  0.6, -0.3, 1, -0.15, 0.05,
  0, 0.1, 0.15, 0.1, 0,
  0,0,0,0,0,0,0,0,0,0,0,
];
const STATIC_SAMPLES = [...STATIC_BEAT, ...STATIC_BEAT, ...STATIC_BEAT,
                        ...STATIC_BEAT, ...STATIC_BEAT, ...STATIC_BEAT];

interface ECGChartProps {
  height?:  number;
  samples?: number[] | null;
}

export function ECGChart({ height = 56, samples = null }: ECGChartProps) {
  const { theme }                            = useTheme();
  const { status, ecgRingBufferRef, ecgWriteIndexRef } = useBLEContext();
  const isLive                               = status === 'streaming';

  // Pre-process static samples once when they arrive
  const staticNormRef = useRef<number[]>([]);
  useEffect(() => {
    if (!samples || samples.length < 2) {
      staticNormRef.current = normalise(STATIC_SAMPLES);
      return;
    }
    const ds = downsample(samples, 2000);
    staticNormRef.current = normalise(ds);
  }, [samples]);

  // Current scroll offset into the source array
  const offsetRef  = useRef(0);
  const rafRef     = useRef<number | null>(null);
  const lastTsRef  = useRef<number>(0);

  // SVG points string
  const [points, setPoints] = useState<string>('');

  const tick = useCallback((ts: number) => {
    if (ts - lastTsRef.current < FRAME_MS) {
      rafRef.current = requestAnimationFrame(tick);
      return;
    }
    lastTsRef.current = ts;

    let source: number[];

    if (isLive) {
      // Read from live BLE ring buffer
      const buf       = ecgRingBufferRef.current;
      const writeIdx  = ecgWriteIndexRef.current;
      const bufLen    = buf.length;

      if (writeIdx < DISPLAY_POINTS) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      // Extract the most recent DISPLAY_POINTS samples in order
      const raw: number[] = new Array(DISPLAY_POINTS);
      for (let i = 0; i < DISPLAY_POINTS; i++) {
        raw[i] = buf[(writeIdx - DISPLAY_POINTS + i + bufLen) % bufLen];
      }
      source = normalise(raw);
      setPoints(toSvgPoints(source, height));
      rafRef.current = requestAnimationFrame(tick);
      return;
    }

    // Static source
    const src = staticNormRef.current.length > 0
      ? staticNormRef.current
      : normalise(STATIC_SAMPLES);

    const total = src.length;
    offsetRef.current = (offsetRef.current + ADVANCE_PER_FRAME) % total;

    // Extract DISPLAY_POINTS
    const window: number[] = new Array(DISPLAY_POINTS);
    for (let i = 0; i < DISPLAY_POINTS; i++) {
      window[i] = src[(offsetRef.current - DISPLAY_POINTS + 1 + i + total * 2) % total];
    }

    setPoints(toSvgPoints(window, height));

    setPoints(toSvgPoints(window, height));
    rafRef.current = requestAnimationFrame(tick);
  }, [isLive, height, ecgRingBufferRef, ecgWriteIndexRef]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [tick]);

  if (!points) return <View style={[styles.container, { height }]} />;

  return (
    <View style={[styles.container, { height }]}>
      <Svg
        width="100%"
        height={height}
        viewBox={`0 0 ${SVG_WIDTH} ${height}`}
        preserveAspectRatio="none"
      >
        <Polyline
          points={points}
          fill="none"
          stroke={theme.colors.primary}
          strokeWidth={isLive ? 1.5 : 1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
});