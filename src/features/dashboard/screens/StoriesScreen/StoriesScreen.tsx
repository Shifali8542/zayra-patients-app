import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../../contexts/ThemeContext';
import { storiesStyles as styles } from './StoriesScreen.style';
import type { Story } from '../../../../types';

interface StoriesScreenProps {
  stories: Story[];
}

export function StoriesScreen({ stories }: StoriesScreenProps) {
  const { theme } = useTheme();

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={[styles.headerLabel, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xs }]}>
          Real Stories. Real Outcomes.
        </Text>
        <Text style={[styles.headerTitle, { color: theme.colors.textPrimary, fontFamily: theme.fonts.displayBold, fontSize: theme.fontSize.h2 }]}>
          Zayra Journeys
        </Text>
      </View>

      {stories.map((story, i) => {
        const isDark = i % 2 === 0;
        if (isDark) {
          return (
            <LinearGradient
              key={story.id}
              colors={['#1B3A55', '#0D1B2A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.storyCard}
            >
              <Text style={styles.quoteIcon}>❝</Text>
              <Text style={[styles.storyType, { color: 'rgba(255,255,255,0.60)', fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xxs }]}>
                {story.type}
              </Text>
              <Text style={[styles.storyQuote, { color: '#FFFFFF', fontFamily: theme.fonts.sansMedium, fontSize: theme.fontSize.sm }]}>
                "{story.quote}"
              </Text>
              <View style={styles.storyFooter}>
                <Text style={[styles.authorText, { color: 'rgba(255,255,255,0.70)', fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.xs }]}>
                  {story.author}{story.authorAge ? `, ${story.authorAge}` : ''}
                </Text>
                <View style={[styles.tagChip, { backgroundColor: theme.colors.tealAlpha20 }]}>
                  <Text style={[styles.tagText, { color: theme.colors.primary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xxs }]}>
                    {story.tag}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          );
        }

        return (
          <View
            key={story.id}
            style={[
              styles.storyCard,
              {
                backgroundColor: theme.colors.card,
                borderWidth: 1,
                borderColor: theme.colors.cardBorder,
                ...theme.shadow.card,
              },
            ]}
          >
            <Text style={styles.quoteIcon}>❝</Text>
            <Text style={[styles.storyType, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xxs }]}>
              {story.type}
            </Text>
            <Text style={[styles.storyQuote, { color: theme.colors.textPrimary, fontFamily: theme.fonts.sansMedium, fontSize: theme.fontSize.sm }]}>
              "{story.quote}"
            </Text>
            <View style={styles.storyFooter}>
              <Text style={[styles.authorText, { color: theme.colors.textSecondary, fontFamily: theme.fonts.sansRegular, fontSize: theme.fontSize.xs }]}>
                {story.author}{story.authorAge ? `, ${story.authorAge}` : ''}
              </Text>
              <View style={[styles.tagChip, { backgroundColor: theme.colors.mint }]}>
                <Text style={[styles.tagText, { color: theme.colors.primary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xxs }]}>
                  {story.tag}
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}
