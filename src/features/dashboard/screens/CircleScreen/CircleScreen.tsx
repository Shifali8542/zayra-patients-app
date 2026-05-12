import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../../contexts/ThemeContext';
import { circleStyles as styles } from './CircleScreen.style';
import type { CircleMember, Journey, User } from '../../../../types';

interface CircleScreenProps {
  members: CircleMember[];
  journeys: Journey[];
  user: User | null;
}

const JOURNEY_GRADIENTS: [string, string][] = [
  ['#00C2B2', '#0D1B2A'],
  ['#0D1B2A', '#0D1B2A'],
  ['#1B3A55', '#0D1B2A'],
];

export function CircleScreen({ members, journeys, user }: CircleScreenProps) {
  const { theme } = useTheme();

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={[styles.headerLabel, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xs }]}>
          Calm Support, Real Journeys
        </Text>
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary, fontFamily: theme.fonts.displayBold, fontSize: theme.fontSize.h2 }]}>
          Community
        </Text>
      </View>

      {/* My Circle */}
      <View style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.cardBorder, ...theme.shadow.card }]}>
        <View style={styles.cardHeaderRow}>
          <Text style={[styles.cardHeaderLabel, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xs }]}>
            My Circle
          </Text>
          <View style={[styles.membersBadge, { backgroundColor: theme.colors.mint }]}>
            <Text style={[styles.membersBadgeText, { color: theme.colors.primary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xs }]}>
              {members.length} with you
            </Text>
          </View>
        </View>
        <View style={styles.avatarsRow}>
          {members.map(m => (
            <View key={m.id} style={[styles.avatar, { backgroundColor: m.color }]}>
              <Text style={[styles.avatarText, { color: '#FFFFFF', fontSize: 14 }]}>{m.initials}</Text>
            </View>
          ))}
          <TouchableOpacity style={[styles.addBtn, { borderColor: theme.colors.divider }]}>
            <Text style={[styles.addBtnText, { color: theme.colors.textTertiary }]}>+</Text>
          </TouchableOpacity>
        </View>
        {members[0]?.lastMessage && (
          <Text style={[styles.circleMessage, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.xs }]}>
            {members[0].name} sent you "{members[0].lastMessage}" this morning.
          </Text>
        )}
      </View>

      {/* Shared Journeys */}
      <View>
        <Text style={[styles.sectionLabel, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xs }]}>
          Shared Journeys
        </Text>
        <View style={styles.journeyList}>
          {journeys.map((j, i) => (
            <LinearGradient key={j.id} colors={JOURNEY_GRADIENTS[i % JOURNEY_GRADIENTS.length]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.journeyCard}>
              <View>
                <Text style={[styles.journeyTitle, { color: '#FFFFFF', fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.sm }]}>{j.title}</Text>
                <Text style={[styles.journeySubtitle, { color: 'rgba(255,255,255,0.70)', fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.xs }]}>{j.subtitle}</Text>
              </View>
              <Text style={styles.journeyEmoji}>{j.emoji}</Text>
            </LinearGradient>
          ))}
        </View>
      </View>

      {/* Care Team */}
      <View>
        <Text style={[styles.sectionLabel, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xs }]}>
          Care Team
        </Text>
        <View style={[styles.careTeamCard, { backgroundColor: theme.colors.card, borderColor: theme.colors.cardBorder, ...theme.shadow.card }]}>
          {user?.hospital_name ? (
            <View style={styles.careTeamRow}>
              <View style={[styles.careTeamAvatar, { backgroundColor: theme.colors.tealAlpha20 }]}>
                <Text style={[styles.careTeamAvatarText, { color: theme.colors.primary, fontSize: 14 }]}>
                  {user.hospital_name[0].toUpperCase()}
                </Text>
              </View>
              <View>
                <Text style={[styles.careTeamName, { color: theme.colors.textPrimary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.sm }]}>
                  {user.hospital_name}
                </Text>
                <Text style={[styles.careTeamSub, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.xs }]}>
                  Your registered care provider
                </Text>
              </View>
            </View>
          ) : (
            <Text style={[styles.careTeamEmpty, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.sm }]}>
              No care provider linked to your profile yet.
            </Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}