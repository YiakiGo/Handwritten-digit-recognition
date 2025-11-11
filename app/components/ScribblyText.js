import React from 'react';
import { Text, StyleSheet } from 'react-native';

export default function ScribblyText({
  children,
  variant = 'primary',
  size = 'medium',
  scribbly = true,
  color = null
}) {
  const variantStyles = {
    primary: styles.primary,
    secondary: styles.secondary,
    accent: styles.accent,
    muted: styles.muted,
    ink: styles.ink,
  };

  const sizeStyles = {
    tiny: styles.tiny,
    small: styles.small,
    medium: styles.medium,
    large: styles.large,
    title: styles.title,
    giant: styles.giant,
  };

  const scribblyStyles = scribbly ? styles.scribbly : {};

  return (
    <Text
      style={[
        styles.text,
        variantStyles[variant],
        sizeStyles[size],
        scribblyStyles,
        color && { color }
      ]}
    >
      {children}
    </Text>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: 'System', // Will use handwriting font when loaded
    letterSpacing: 0.5,
    lineHeight: undefined, // Let the font handle line height
  },

  // Color variants
  primary: {
    color: '#2C3E50', // Ink black
  },
  secondary: {
    color: '#555555',
  },
  accent: {
    color: '#FF6B6B', // Cute red
  },
  muted: {
    color: '#999999',
  },
  ink: {
    color: '#4682B4', // Ink blue
  },

  // Size variants
  tiny: {
    fontSize: 12,
  },
  small: {
    fontSize: 14,
  },
  medium: {
    fontSize: 16,
  },
  large: {
    fontSize: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  giant: {
    fontSize: 36,
    fontWeight: '700',
  },

  // Scribbly effect
  scribbly: {
    // Simulate handwriting imperfections
    transform: [{ rotate: '-1deg' }],
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});