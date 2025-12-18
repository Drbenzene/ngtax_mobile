import { Platform } from 'react-native';

// Light Mode Color Palette
export const lightColors = {
  // Primary - Professional Teal
  primary: '#00897B',
  primaryLight: '#4DB6AC',
  primaryDark: '#00695C',
  
  // Neutrals - Light theme
  background: '#FFFFFF',
  surface: '#FFFFFF',
  card: '#F9FAFB',
  border: '#E5E7EB',
  
  // Text colors
  text: '#0A0E27',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  
  // Semantic colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  
  // Accent colors
  purple: '#8B5CF6',
  pink: '#EC4899',
  orange: '#F97316',
  
  // Gradient overlays
  gradientStart: '#00D9A3',
  gradientMiddle: '#00B8D9',
  gradientEnd: '#0095E8',
};

// Dark Mode Color Palette
export const darkColors = {
  // Primary - Professional Teal (slightly brighter for dark mode)
  primary: '#4DB6AC',
  primaryLight: '#80CBC4',
  primaryDark: '#00897B',
  
  // Neutrals - Dark theme
  background: '#0A0E27',
  surface: '#1F2937',
  card: '#374151',
  border: '#4B5563',
  
  // Text colors
  text: '#F9FAFB',
  textSecondary: '#D1D5DB',
  textTertiary: '#9CA3AF',
  
  // Semantic colors
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#60A5FA',
  
  // Accent colors
  purple: '#A78BFA',
  pink: '#F472B6',
  orange: '#FB923C',
  
  // Gradient overlays
  gradientStart: '#00D9A3',
  gradientMiddle: '#00B8D9',
  gradientEnd: '#0095E8',
};

// Legacy COLORS export for backward compatibility (defaults to light)
export const COLORS = {
  primary: lightColors.primary,
  primaryLight: lightColors.primaryLight,
  primaryDark: lightColors.primaryDark,
  black: '#0A0E27',
  darkGray: '#1F2937',
  mediumGray: '#6B7280',
  lightGray: '#F3F4F6',
  white: '#FFFFFF',
  success: lightColors.success,
  warning: lightColors.warning,
  error: lightColors.error,
  info: lightColors.info,
  purple: lightColors.purple,
  pink: lightColors.pink,
  orange: lightColors.orange,
  gradientStart: lightColors.gradientStart,
  gradientMiddle: lightColors.gradientMiddle,
  gradientEnd: lightColors.gradientEnd,
};

// Modern Typography with Inter (Wise.com's font)
export const TYPOGRAPHY = {
  // Font families - Inter (same as Wise.com)
  fontRegular: 'Inter-Regular',
  fontMedium: 'Inter-Medium',
  fontSemiBold: 'Inter-SemiBold',
  fontBold: 'Inter-Bold',
  
  // Font sizes - Modern scale
  xxxl: 48,
  xxl: 36,
  xl: 28,
  h1: 24,
  h2: 20,
  h3: 18,
  body: 16,
  small: 14,
  caption: 12,
  tiny: 10,
};

// Spacing - 8pt grid system
export const SPACING = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Border Radius - Modern, softer corners
export const BORDER_RADIUS = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  full: 9999,
};

// Shadows - Elevated, modern depth
export const SHADOWS = {
  sm: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  md: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  lg: {
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 10,
  },
};

export const theme = {
  colors: COLORS,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  borderRadius: BORDER_RADIUS,
  shadows: SHADOWS,
};

export default theme;
