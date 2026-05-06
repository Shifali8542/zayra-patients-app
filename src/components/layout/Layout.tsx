import React from 'react';
import {
  ScrollView,
  View,
  StyleSheet,
  ViewStyle,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../contexts/ThemeContext';

interface LayoutProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  contentStyle?: ViewStyle;
  withGradient?: boolean;
  withKeyboard?: boolean;
}

export function Layout({
  children,
  scrollable = true,
  style,
  contentStyle,
  withGradient = true,
  withKeyboard = false,
}: LayoutProps) {
  const { theme } = useTheme();

  const inner = scrollable ? (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={[styles.scrollContent, contentStyle]}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.fill, contentStyle]}>{children}</View>
  );

  const wrapped = withKeyboard ? (
    <KeyboardAvoidingView
      style={styles.fill}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {inner}
    </KeyboardAvoidingView>
  ) : (
    inner
  );

  if (withGradient) {
    return (
      <LinearGradient
        colors={theme.gradients.bg as [string, string, ...string[]]}
        locations={[0, 0.3, 0.6, 1]}
        style={[styles.fill, style]}
      >
        <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
          <StatusBar
            barStyle={theme.isDark ? 'light-content' : 'dark-content'}
            backgroundColor="transparent"
            translucent
          />
          {wrapped}
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <View style={[styles.fill, { backgroundColor: theme.colors.backgroundSolid }, style]}>
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <StatusBar
          barStyle={theme.isDark ? 'light-content' : 'dark-content'}
          backgroundColor="transparent"
          translucent
        />
        {wrapped}
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  safe: {
    flex: 1,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
});
