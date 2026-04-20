import { Dimensions, Platform, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');

// Base dimensions (designed for)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

// Calculate responsive values
const scale = Math.min(width / BASE_WIDTH, height / BASE_HEIGHT);
const verticalScale = height / BASE_HEIGHT;

// Responsive functions
export const wp = (percentage: number) => (width * percentage) / 100;
export const hp = (percentage: number) => (height * percentage) / 100;
export const sp = (size: number) => Math.round(size * scale);
export const vp = (size: number) => Math.round(size * verticalScale);

// Screen size helpers
export const isTablet = () => Math.min(width, height) >= 600;
export const isSmallScreen = () => Math.min(width, height) < 360;
export const isLargeScreen = () => Math.min(width, height) >= 400;

// Font sizes
export const FontSizes = {
  xs: sp(10),
  sm: sp(12),
  md: sp(14),
  lg: sp(16),
  xl: sp(18),
  xxl: sp(22),
  xxxl: sp(26),
  title: sp(20),
  header: sp(24),
};

// Spacing
export const Spacing = {
  xs: sp(4),
  sm: sp(8),
  md: sp(12),
  lg: sp(16),
  xl: sp(20),
  xxl: sp(24),
  xxxl: sp(32),
};

// Border radius
export const BorderRadius = {
  sm: sp(4),
  md: sp(8),
  lg: sp(12),
  xl: sp(16),
  xxl: sp(24),
  round: 9999,
};

// Common dimensions
export const IconSizes = {
  sm: sp(16),
  md: sp(20),
  lg: sp(24),
  xl: sp(28),
  xxl: sp(32),
};

// Button heights
export const ButtonHeight = {
  sm: sp(36),
  md: sp(44),
  lg: sp(52),
  xl: sp(60),
};

// Status bar height
export const StatusBarHeight = Platform.OS === 'android' ? (StatusBar.currentHeight || 0) : 0;

// Screen info
export const ScreenInfo = {
  width,
  height,
  isLandscape: width > height,
  isTablet: isTablet(),
  scale,
  verticalScale,
};

export default {
  wp,
  hp,
  sp,
  vp,
  isTablet,
  isSmallScreen,
  isLargeScreen,
  FontSizes,
  Spacing,
  BorderRadius,
  IconSizes,
  ButtonHeight,
  StatusBarHeight,
  ScreenInfo,
};
