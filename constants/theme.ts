// ─────────────────────────────────────────────────────────────
// RNChatApp — Design System
// Inspired by: iMessage · Telegram · Linear · Vercel
// ─────────────────────────────────────────────────────────────

export const Colors = {
  // ── Backgrounds ──────────────────────────────
  bgPrimary:   '#0D0D12',   // deepest base
  bgSurface:   '#15151E',   // cards, modals
  bgElevated:  '#1E1E2C',   // inputs, tab bar
  bgHover:     '#252535',   // list item press

  // ── Accent ───────────────────────────────────
  accent:      '#7C6FFF',   // primary CTA
  accentLight: '#A59EFF',   // soft accent
  accentDim:   'rgba(124,111,255,0.15)', // accent bg tint

  // ── Text ─────────────────────────────────────
  textPrimary:   '#EEEEF8',
  textSecondary: '#8888A8',
  textMuted:     '#48485E',
  textInverse:   '#FFFFFF',

  // ── Messages ─────────────────────────────────
  sentBg:     '#7C6FFF',
  sentText:   '#FFFFFF',
  rcvBg:      '#1E1E2C',
  rcvText:    '#EEEEF8',

  // ── Status ───────────────────────────────────
  online:  '#3FD977',
  offline: '#FF5E7E',
  warning: '#FFB547',

  // ── Border / Divider ─────────────────────────
  border:  '#222235',
  divider: 'rgba(255,255,255,0.06)',

  // ── Semantic ─────────────────────────────────
  error:   '#FF5E7E',
  success: '#3FD977',
  info:    '#60AFFE',
} as const;

export const Spacing = {
  xxs: 2,
  xs:  4,
  sm:  8,
  md:  12,
  lg:  16,
  xl:  20,
  xxl: 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
} as const;

export const Radius = {
  xs:   6,
  sm:   10,
  md:   14,
  lg:   18,
  xl:   24,
  full: 999,
} as const;

export const FontSize = {
  xs:   11,
  sm:   13,
  base: 15,
  md:   17,
  lg:   20,
  xl:   24,
  '2xl': 28,
  '3xl': 34,
} as const;

export const FontWeight = {
  regular:  '400' as const,
  medium:   '500' as const,
  semibold: '600' as const,
  bold:     '700' as const,
  extrabold:'800' as const,
};

export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  accent: {
    shadowColor: '#7C6FFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
} as const;
