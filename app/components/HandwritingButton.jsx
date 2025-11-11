import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Animated, View } from 'react-native';

export default function HandwritingButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  icon = null
}) {
  const scaleAnim = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const buttonStyles = {
    primary: styles.primaryButton,
    secondary: styles.secondaryButton,
    cute: styles.cuteButton,
    scribbly: styles.scribblyButton,
  };

  const textStyles = {
    primary: styles.primaryText,
    secondary: styles.secondaryText,
    cute: styles.cuteText,
    scribbly: styles.scribblyText,
  };

  const sizeStyles = {
    small: styles.smallSize,
    medium: styles.mediumSize,
    large: styles.largeSize,
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[
          styles.button,
          buttonStyles[variant],
          sizeStyles[size],
          styles.handwritingStyle
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.8}
      >
        <View style={styles.content}>
          {icon && <Text style={styles.icon}>{icon}</Text>}
          <Text style={[styles.text, textStyles[variant]]}>
            {title}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  handwritingStyle: {
    // Slight random tilt for handwriting feel
    transform: [{ rotate: '-1deg' }],
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    // Use system handwriting-style font as fallback
    fontFamily: 'System',
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },

  // Button variants
  primaryButton: {
    backgroundColor: '#FFE5E5',
    borderWidth: 2,
    borderColor: '#FF6B6B',
    borderStyle: 'dashed',
  },
  secondaryButton: {
    backgroundColor: '#E5F3FF',
    borderWidth: 2,
    borderColor: '#4ECDC4',
    borderStyle: 'solid',
  },
  cuteButton: {
    backgroundColor: '#FFF5E5',
    borderWidth: 3,
    borderColor: '#FFD93D',
    borderStyle: 'dotted',
  },
  scribblyButton: {
    backgroundColor: '#F0F8FF',
    borderWidth: 2,
    borderColor: '#87CEEB',
    borderStyle: 'solid',
  },

  // Text colors
  primaryText: {
    color: '#FF6B6B',
    transform: [{ rotate: '1deg' }], // Counter-tilt for readability
  },
  secondaryText: {
    color: '#4ECDC4',
    transform: [{ rotate: '-0.5deg' }],
  },
  cuteText: {
    color: '#FFD93D',
    transform: [{ rotate: '0.5deg' }],
    fontSize: 20, // Slightly larger for cute effect
  },
  scribblyText: {
    color: '#4682B4',
    transform: [{ rotate: '-1deg' }],
  },

  // Size variants
  smallSize: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  mediumSize: {
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  largeSize: {
    paddingVertical: 20,
    paddingHorizontal: 32,
  },
});