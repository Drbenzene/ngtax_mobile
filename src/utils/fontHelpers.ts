import { TextStyle } from 'react-native';
import { TYPOGRAPHY } from '../styles/theme';

// Helper to apply Inter font to text styles
export const withFont = (weight: 'regular' | 'medium' | 'semibold' | 'bold' = 'regular'): TextStyle => {
  const fontMap = {
    regular: TYPOGRAPHY.fontRegular,
    medium: TYPOGRAPHY.fontMedium,
    semibold: TYPOGRAPHY.fontSemiBold,
    bold: TYPOGRAPHY.fontBold,
  };

  return {
    fontFamily: fontMap[weight],
  };
};

// Preset text styles with font families
export const textStyles = {
  display: {
    ...withFont('bold'),
    fontSize: TYPOGRAPHY.xxxl,
  },
  h1: {
    ...withFont('bold'),
    fontSize: TYPOGRAPHY.h1,
  },
  h2: {
    ...withFont('bold'),
    fontSize: TYPOGRAPHY.h2,
  },
  h3: {
    ...withFont('semibold'),
    fontSize: TYPOGRAPHY.h3,
  },
  body: {
    ...withFont('regular'),
    fontSize: TYPOGRAPHY.body,
  },
  bodyMedium: {
    ...withFont('medium'),
    fontSize: TYPOGRAPHY.body,
  },
  bodyBold: {
    ...withFont('bold'),
    fontSize: TYPOGRAPHY.body,
  },
  small: {
    ...withFont('regular'),
    fontSize: TYPOGRAPHY.small,
  },
  smallMedium: {
    ...withFont('medium'),
    fontSize: TYPOGRAPHY.small,
  },
  caption: {
    ...withFont('regular'),
    fontSize: TYPOGRAPHY.caption,
  },
  captionMedium: {
    ...withFont('medium'),
    fontSize: TYPOGRAPHY.caption,
  },
};
