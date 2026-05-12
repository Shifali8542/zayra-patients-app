import { StyleSheet } from 'react-native';

export const profileStyles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: 16, paddingBottom: 32, gap: 14 },

  header: { gap: 2 },
  headerLabel: { letterSpacing: 2, textTransform: 'uppercase' },
  headerTitle: { letterSpacing: -0.5 },

  // ── User info card (new — shown at top, displays name + email) ────────────
  userInfoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userAvatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // ── Menu items ─────────────────────────────────────────────────────────────
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
  },
  menuIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  menuIconInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuIconText: { fontWeight: '700' },
  menuTextWrap: { flex: 1, minWidth: 0 },
  menuLabel: {},
  menuSub: { marginTop: 1 },
  menuChevron: { fontSize: 14 },

  // ── Theme toggle ───────────────────────────────────────────────────────────
  themeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
  },
  themeIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Journey switcher ───────────────────────────────────────────────────────
  journeyCard: {
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
  },
  journeyCardLabel: { marginBottom: 8 },
  journeyBtns: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  journeyBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
  },
  journeyBtnText: { fontSize: 12 },

  // ── Logout ─────────────────────────────────────────────────────────────────
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 20,
    borderWidth: 1,
  },
  logoutText: {},

  legalText: { textAlign: 'center', paddingBottom: 8 },
});