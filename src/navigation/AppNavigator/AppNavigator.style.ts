import { StyleSheet } from 'react-native';

export const appNavigatorStyles = StyleSheet.create({
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
    marginHorizontal: 8,
    marginBottom: 4,
  },
  tabIconWrap: {
    borderRadius: 14,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Tab bar
  safeArea: { borderTopWidth: 1 },
  bar: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6 },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 4, position: 'relative' },
  tabIcon: { fontSize: 20, marginBottom: 2 },
  tabLabel: { letterSpacing: 0.3 },
  activeIndicator: { position: 'absolute', top: -6, width: 20, height: 2, borderRadius: 1 },

  // Loading / error / no-profile full-screen states
  stateScreen: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  stateIcon: { fontSize: 48, marginBottom: 16 },
  stateTitle: { textAlign: 'center', letterSpacing: -0.5, marginBottom: 8 },
  stateSubtext: { textAlign: 'center', lineHeight: 22, marginBottom: 24 },
  stateLoadingText: { marginTop: 12 },
  retryBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  retryBtnText: { color: '#FFFFFF' },
  signOutBtn: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, borderWidth: 1 },
  signOutBtnText: { color: '#EF4444' },
});