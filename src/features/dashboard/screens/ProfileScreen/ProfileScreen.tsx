import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from '../../../../contexts/ThemeContext';
import { profileStyles as styles } from './ProfileScreen.style';
import type { User } from '../../../../types';

interface ProfileScreenProps {
  user: User;
  onLogout: () => void;
}

const JOURNEYS = ['Wellness', 'Care', 'Evac', 'Hospital'] as const;

function buildMenuItems(user: User) {
  const baselineLabel =
    user.baseline && (user.baseline.hrv != null || user.baseline.restingHr != null)
      ? [
          user.baseline.hrv != null ? `${user.baseline.hrv} ms HRV` : '',
          user.baseline.restingHr != null ? `${user.baseline.restingHr} bpm rest` : '',
        ]
          .filter(Boolean)
          .join(' · ')
      : 'Baseline not yet available';

  return [
    {
      icon: user.first_name?.[0] ?? user.email[0].toUpperCase(),
      iconBg: '#00C2B2' as string | undefined,
      iconColor: '#FFFFFF' as string | undefined,
      label: 'Your baseline',
      sub: baselineLabel,
    },
    { icon: '💻', iconBg: undefined, iconColor: undefined, label: 'Devices', sub: 'Zen · Axiom · Alyna' },
    { icon: '🛡', iconBg: undefined, iconColor: undefined, label: 'Privacy Center', sub: 'What Zayra sees · what others see' },
    { icon: '👥', iconBg: undefined, iconColor: undefined, label: 'Family & Circle', sub: 'Sharing & emergency awareness' },
    { icon: '📄', iconBg: undefined, iconColor: undefined, label: 'Reports', sub: 'Clinician-ready PDFs' },
  ];
}

export function ProfileScreen({ user, onLogout }: ProfileScreenProps) {
  const { theme, toggleTheme, isDark } = useTheme();
  const menuItems = buildMenuItems(user);

  const initial = user.first_name?.[0] ?? user.email[0].toUpperCase();

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text
          style={[
            styles.headerLabel,
            { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xs },
          ]}
        >
          Your Zayra, Your Control
        </Text>
        <Text
          style={[
            styles.headerTitle,
            { color: theme.colors.textPrimary, fontFamily: theme.fonts.displayBold, fontSize: theme.fontSize.h2 },
          ]}
        >
          Profile
        </Text>
      </View>

      {/* User Info Card */}
      <View
        style={[
          styles.userInfoCard,
          { backgroundColor: theme.colors.tealAlpha10, borderColor: theme.colors.primary },
        ]}
      >
        <View style={[styles.menuIconWrap, { backgroundColor: theme.colors.primary }]}>
          <View style={[styles.userAvatar, { backgroundColor: theme.colors.primary }]}>
            <Text style={styles.userAvatarText}>{initial}</Text>
          </View>
        </View>
        <View style={styles.menuTextWrap}>
          <Text
            style={[
              styles.menuLabel,
              { color: theme.colors.textPrimary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.sm },
            ]}
          >
            {user.name}
          </Text>
          <Text
            style={[
              styles.menuSub,
              { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.xs },
            ]}
          >
            {user.email}
          </Text>
        </View>
      </View>

      {/* Menu Items */}
      {menuItems.map((item, i) => (
        <TouchableOpacity
          key={i}
          style={[
            styles.menuItem,
            { backgroundColor: theme.colors.card, borderColor: theme.colors.cardBorder, ...theme.shadow.card },
          ]}
          activeOpacity={0.8}
        >
          <View style={[styles.menuIconWrap, { backgroundColor: theme.colors.surfaceAlt }]}>
            {item.iconBg ? (
              <View style={[styles.menuIconInner, { backgroundColor: item.iconBg }]}>
                <Text style={[styles.menuIconText, { color: item.iconColor ?? theme.colors.textPrimary, fontSize: 14 }]}>
                  {item.icon}
                </Text>
              </View>
            ) : (
              <Text style={{ fontSize: 18 }}>{item.icon}</Text>
            )}
          </View>
          <View style={styles.menuTextWrap}>
            <Text
              style={[
                styles.menuLabel,
                { color: theme.colors.textPrimary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.sm },
              ]}
              numberOfLines={1}
            >
              {item.label}
            </Text>
            <Text
              style={[
                styles.menuSub,
                { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.xs },
              ]}
              numberOfLines={1}
            >
              {item.sub}
            </Text>
          </View>
          <Text style={[styles.menuChevron, { color: theme.colors.textTertiary }]}>›</Text>
        </TouchableOpacity>
      ))}

      {/* Theme Toggle */}
      <TouchableOpacity
        style={[
          styles.themeRow,
          { backgroundColor: theme.colors.card, borderColor: theme.colors.cardBorder, ...theme.shadow.card },
        ]}
        onPress={toggleTheme}
        activeOpacity={0.8}
      >
        <View style={[styles.themeIconWrap, { backgroundColor: theme.colors.surfaceAlt }]}>
          <Text style={{ fontSize: 20 }}>{isDark ? '☀️' : '🌙'}</Text>
        </View>
        <View style={styles.menuTextWrap}>
          <Text
            style={[
              styles.menuLabel,
              { color: theme.colors.textPrimary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.sm },
            ]}
          >
            {isDark ? 'Light mode' : 'Dark mode'}
          </Text>
          <Text
            style={[
              styles.menuSub,
              { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.xs },
            ]}
          >
            Currently: {isDark ? 'dark' : 'light'} theme
          </Text>
        </View>
      </TouchableOpacity>

      {/* Journey Switcher */}
      <View
        style={[
          styles.journeyCard,
          { backgroundColor: theme.colors.card, borderColor: theme.colors.cardBorder, ...theme.shadow.card },
        ]}
      >
        <Text
          style={[
            styles.journeyCardLabel,
            { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.xs },
          ]}
        >
          Switch journey
        </Text>
        <View style={styles.journeyBtns}>
          {JOURNEYS.map((j) => {
            const isActive = user.journey === j.toLowerCase();
            return (
              <TouchableOpacity
                key={j}
                style={[
                  styles.journeyBtn,
                  { backgroundColor: isActive ? theme.colors.secondary : theme.colors.surfaceAlt },
                ]}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.journeyBtnText,
                    { color: isActive ? '#FFFFFF' : theme.colors.textSecondary, fontFamily: theme.fonts.sansMedium },
                  ]}
                >
                  {j}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity
        style={[styles.logoutBtn, { borderColor: 'rgba(239,68,68,0.20)' }]}
        onPress={onLogout}
        activeOpacity={0.8}
      >
        <Text style={{ fontSize: 16 }}>🚪</Text>
        <Text
          style={[
            styles.logoutText,
            { color: '#EF4444', fontFamily: theme.fonts.sansMedium, fontSize: theme.fontSize.sm },
          ]}
        >
          Sign out
        </Text>
      </TouchableOpacity>

      <Text
        style={[
          styles.legalText,
          { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.xs },
        ]}
      >
        Calm vigilance. Clinician-validated. © Zayra Health.
      </Text>
    </ScrollView>
  );
}