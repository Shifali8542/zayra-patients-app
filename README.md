# Zayra Patients — React Native App

A production-ready React Native (Expo SDK 54) mobile app for Zayra Patients, pixel-perfectly matching the web design.

> **SDK 54** · React Native **0.76.7** · New Architecture enabled · TypeScript strict


---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Expo Go app on your phone (iOS or Android)
- Or an iOS/Android simulator

### Install & Run

```bash
# Install dependencies
npm install

# Start Expo dev server
npm start

# Then scan QR code with Expo Go app
# Or press 'a' for Android emulator, 'i' for iOS simulator
```

---

## 📁 Project Structure

```
zayra-patients/
├── App.tsx                          # Root entry point
├── app.json                         # Expo config
├── src/
│   ├── theme/
│   │   ├── colors.ts               # All brand colors
│   │   ├── fonts.ts                # Font families, sizes, weights
│   │   ├── spacing.ts              # Spacing, radius, shadows
│   │   ├── lightTheme.ts           # Light theme object
│   │   ├── darkTheme.ts            # Dark theme object
│   │   └── theme.ts                # Export barrel
│   ├── types/
│   │   └── index.ts                # All TypeScript interfaces
│   ├── mocks/
│   │   └── mockData.ts             # Mock API data (easily swappable)
│   ├── services/
│   │   └── api.ts                  # Centralized API layer
│   ├── contexts/
│   │   ├── ThemeContext.tsx         # Theme provider + useTheme hook
│   │   └── AuthContext.tsx          # Auth provider + useAuth hook
│   ├── navigation/
│   │   ├── RootNavigator.tsx        # Auth vs App routing
│   │   ├── AuthNavigator.tsx        # Login / Signup stack
│   │   └── AppNavigator.tsx         # Bottom tab navigator
│   ├── components/
│   │   ├── ui/
│   │   │   ├── ZayraLogo.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── ECGChart.tsx         # Animated ECG visualization
│   │   │   ├── PulsingDot.tsx       # Live indicator
│   │   │   └── StatusBadge.tsx
│   │   └── layout/
│   │       ├── Layout.tsx           # Screen wrapper with gradient + safe area
│   │       └── Layout.style.ts
│   └── features/
│       ├── auth/
│       │   └── screens/
│       │       ├── LoginScreen/
│       │       │   ├── LoginScreen.tsx
│       │       │   └── LoginScreen.style.ts
│       │       └── SignupScreen/
│       │           ├── SignupScreen.tsx
│       │           └── SignupScreen.style.ts
│       └── dashboard/
│           ├── hooks/
│           │   └── useDashboard.ts  # All dashboard data loading
│           └── screens/
│               ├── HomeScreen/      (+ .style.ts)
│               ├── AlynaScreen/     (+ .style.ts)
│               ├── CircleScreen/    (+ .style.ts)
│               ├── RhythmScreen/    (+ .style.ts)
│               ├── StoriesScreen/   (+ .style.ts)
│               └── ProfileScreen/   (+ .style.ts)
```

---

## 🎨 Design System

### Colors (from web)
| Token | Value |
|---|---|
| `teal` | `#00C2B2` |
| `navy` | `#0D1B2A` |
| `navyMid` | `#1B3A55` |
| `mint` | `#E0F7F5` |
| `tealAccent` | `#00B4A6` |

### Typography
- **Display / Headings**: Sora (400, 600, 700, 800)
- **Body / UI**: DM Sans (400, 500, 600, 700)

### Gradients
- Background: `#D6F3F0 → #C8EEE9 → #D8F2EF → #E4F7F5`
- Teal: `#00C2B2 → #0D1B2A`
- Dark BG: `#0D1B2A → #0F2235 → #0D1B2A`

---

## 🌓 Theme Support

- **Light Theme** (default): teal-mint gradient background, white cards
- **Dark Theme**: navy gradient background, navy-mid cards
- Toggle via Profile tab or Login header button
- No hardcoded colors anywhere — all via `theme.colors.*`

---

## 🔐 Authentication

- **Login**: Email + password, "Skip for now" → Dashboard
- **Signup**: Name + email + password, feature promises
- Auth state managed via `AuthContext`
- `skipAuth()` → jumps straight to Dashboard with mock user

---

## 📱 Screens

| Screen | Tab Icon | Description |
|---|---|---|
| Home | 🏠 | Live monitor, ECG chart, Alyna timeline |
| Alyna | ✨ | AI chat with typing indicator |
| Circle | 👥 | Members, shared journeys, expert rooms |
| Rhythm | 🔥 | Streak card, milestones grid, consistency bars |
| Stories | 📖 | User testimonials in alternating dark/light cards |
| Profile | 👤 | Settings, theme toggle, journey switcher, logout |

---

## 🔧 Replacing Mock Data with Real API

All API calls are in `src/services/api.ts`. Replace the mock implementations:

```ts
// Before (mock):
login: async (email, password) => {
  await delay(600);
  return { ...mockUser, email };
}

// After (real):
login: async (email, password) => {
  const res = await fetch('https://api.zayra.health/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
    headers: { 'Content-Type': 'application/json' },
  });
  return res.json();
}
```

---

## 🧱 Engineering Principles

- ✅ Every `.tsx` has a companion `.style.ts`
- ✅ No inline styles
- ✅ No hardcoded colors
- ✅ No duplicated logic
- ✅ Feature-based modular architecture
- ✅ Custom hooks for complex logic (`useDashboard`)
- ✅ Clean separation: UI / hooks / styles
- ✅ TypeScript throughout with strict mode

---

*Calm vigilance. Clinician-validated. © Zayra Health.*
