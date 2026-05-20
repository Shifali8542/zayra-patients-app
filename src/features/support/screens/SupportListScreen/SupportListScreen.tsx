import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../../../contexts/ThemeContext';
import { useSupportTickets, StatusFilter } from '../../hooks/useSupportTicket';
import { CreateTicketSheet } from '../../components/CreateTicketSheet/CreateTicketSheet';
import { supportListStyles as styles } from './SupportListScreen.style';
import type { SupportTicket, TicketStatus } from '../../../../types';

interface SupportListScreenProps {
  onOpenTicket: (ticketId: number) => void;
  onBack: () => void;
}

// Status badge config
const STATUS_CONFIG: Record<TicketStatus, { label: string; bgColor: string; textColor: string }> = {
  open:        { label: 'Open',        bgColor: 'rgba(59,130,246,0.12)',  textColor: '#3B82F6' },
  in_progress: { label: 'In Progress', bgColor: 'rgba(0,194,178,0.12)',   textColor: '#00C2B2' },
  escalated:   { label: 'Escalated',   bgColor: 'rgba(245,158,11,0.12)',  textColor: '#F59E0B' },
  resolved:    { label: 'Resolved',    bgColor: 'rgba(107,114,128,0.12)', textColor: '#6B7280' },
  closed:      { label: 'Closed',      bgColor: 'rgba(107,114,128,0.08)', textColor: '#9CA3AF' },
};

const SEVERITY_COLORS: Record<string, string> = {
  critical: '#EF4444',
  urgent:   '#F59E0B',
  normal:   '#00C2B2',
  resolved: '#9CA3AF',
};

const FILTERS: { id: StatusFilter; label: string }[] = [
  { id: 'all',      label: 'All' },
  { id: 'open',     label: 'Open' },
  { id: 'resolved', label: 'Resolved' },
];

// Sub-components

function SkeletonRow() {
  const { theme } = useTheme();
  return (
    <View style={[styles.skeleton, { backgroundColor: theme.colors.card, borderColor: theme.colors.cardBorder, borderWidth: 1 }]}>
      <View style={[styles.skeletonLine1, { backgroundColor: theme.colors.divider }]} />
      <View style={[styles.skeletonLine2, { backgroundColor: theme.colors.divider }]} />
      <View style={[styles.skeletonLine3, { backgroundColor: theme.colors.divider }]} />
    </View>
  );
}

function TicketRow({ ticket, onPress }: { ticket: SupportTicket; onPress: () => void }) {
  const { theme } = useTheme();
  const status    = STATUS_CONFIG[ticket.status] ?? STATUS_CONFIG.open;
  const dotColor  = SEVERITY_COLORS[ticket.severity] ?? '#9CA3AF';
  const hasNew    = ticket.message_count > 0 && ticket.status !== 'resolved';

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.ticketRow, {
        backgroundColor: theme.colors.card,
        borderColor: theme.colors.cardBorder,
        ...theme.shadow.card,
      }]}
      activeOpacity={0.8}
    >
      {/* Severity dot */}
      <View style={[styles.severityDot, { backgroundColor: dotColor }]} />

      <View style={styles.ticketBody}>
        {/* Meta row: number + badge + live dot */}
        <View style={styles.ticketMeta}>
          <Text style={[styles.ticketNumber, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular }]}>
            {ticket.ticket_number}
          </Text>
          <View style={[styles.statusBadge, { backgroundColor: status.bgColor }]}>
            <Text style={[styles.statusBadgeText, { color: status.textColor, fontFamily: theme.fonts.sansSemiBold }]}>
              {status.label}
            </Text>
          </View>
          {hasNew && (
            <View style={[styles.activeDot, { backgroundColor: theme.colors.primary }]} />
          )}
        </View>

        <Text style={[styles.ticketTitle, { color: theme.colors.textPrimary, fontFamily: theme.fonts.sansSemiBold }]} numberOfLines={1}>
          {ticket.title}
        </Text>
        <Text style={[styles.ticketSub, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular }]}>
          {ticket.time_ago} · {ticket.message_count} message{ticket.message_count !== 1 ? 's' : ''}
        </Text>
      </View>

      <Text style={[styles.ticketChevron, { color: theme.colors.textTertiary }]}>›</Text>
    </TouchableOpacity>
  );
}

// Main screen

export function SupportListScreen({ onOpenTicket, onBack }: SupportListScreenProps) {
  const { theme }                             = useTheme();
  const { tickets, loading, error, filter, setFilter, refresh } = useSupportTickets();
  const [showCreate, setShowCreate]           = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <View style={styles.header}>
            <Text style={[styles.headerLabel, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansSemiBold, fontSize: theme.fontSize.xs }]}>
              Help & Support
            </Text>
            <Text style={[styles.headerTitle, { color: theme.colors.textPrimary, fontFamily: theme.fonts.displayBold, fontSize: theme.fontSize.h2 }]}>
              My Tickets
            </Text>
          </View>
          <TouchableOpacity
            onPress={refresh}
            style={[styles.refreshBtn, { backgroundColor: theme.colors.tealAlpha10 }]}
            activeOpacity={0.8}
          >
            <Text style={styles.refreshIcon}>↻</Text>
          </TouchableOpacity>
        </View>

        {/* New ticket button */}
        <TouchableOpacity
          onPress={() => setShowCreate(true)}
          style={[styles.newBtn, { backgroundColor: theme.colors.primary }]}
          activeOpacity={0.85}
        >
          <Text style={{ fontSize: 16, color: '#FFFFFF' }}>+</Text>
          <Text style={[styles.newBtnText, { fontFamily: theme.fonts.sansSemiBold }]}>
            New support request
          </Text>
        </TouchableOpacity>

        {/* Filter chips */}
        <View style={styles.filterRow}>
          {FILTERS.map(f => {
            const isActive = filter === f.id;
            return (
              <TouchableOpacity
                key={f.id}
                onPress={() => setFilter(f.id)}
                style={[styles.filterChip, {
                  backgroundColor: isActive ? theme.colors.tealAlpha10 : 'transparent',
                  borderColor: isActive ? theme.colors.primary : theme.colors.cardBorder,
                }]}
                activeOpacity={0.8}
              >
                <Text style={[styles.filterChipText, {
                  color: isActive ? theme.colors.primary : theme.colors.textSecondary,
                  fontFamily: isActive ? theme.fonts.sansSemiBold : theme.fonts.sansRegular,
                }]}>
                  {f.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Error */}
        {error && (
          <View style={[styles.errorBox, { backgroundColor: 'rgba(239,68,68,0.08)', borderColor: 'rgba(239,68,68,0.20)' }]}>
            <Text style={{ fontSize: 14 }}>⚠️</Text>
            <Text style={[styles.errorText, { color: '#EF4444', fontFamily: theme.fonts.sansRegular }]}>
              {error}
            </Text>
          </View>
        )}

        {/* Loading skeletons */}
        {loading && (
          <View style={styles.list}>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </View>
        )}

        {/* Empty state */}
        {!loading && !error && tickets.length === 0 && (
          <View style={styles.emptyWrap}>
            <View style={[styles.emptyIcon, { backgroundColor: theme.colors.tealAlpha10 }]}>
              <Text style={styles.emptyIconText}>💬</Text>
            </View>
            <Text style={[styles.emptyTitle, { color: theme.colors.textPrimary, fontFamily: theme.fonts.sansSemiBold }]}>
              No tickets yet
            </Text>
            <Text style={[styles.emptyBody, { color: theme.colors.textTertiary, fontFamily: theme.fonts.sansRegular }]}>
              Tap the button above to contact support for any issue.
            </Text>
          </View>
        )}

        {/* Ticket list */}
        {!loading && tickets.length > 0 && (
          <View style={styles.list}>
            {tickets.map(ticket => (
              <TicketRow
                key={ticket.id}
                ticket={ticket}
                onPress={() => onOpenTicket(ticket.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Bottom sheet: create ticket */}
      {showCreate && (
        <CreateTicketSheet
          onClose={() => setShowCreate(false)}
          onCreated={(ticketId) => {
            setShowCreate(false);
            refresh();
            onOpenTicket(ticketId);
          }}
        />
      )}
    </View>
  );
}