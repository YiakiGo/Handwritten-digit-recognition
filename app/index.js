import { useEffect, useState } from 'react';
import {
  Animated,
  Easing,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useRouter } from 'expo-router';

export default function Index() {
  const router = useRouter();
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.8));
  const [pulseAnim] = useState(new Animated.Value(1));

  useEffect(() => {
    // Animate components on mount
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();

    // Start pulse animation for start button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  const handleStart = () => {
    // Animate button press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.push('/(tabs)');
    });
  };

  const handleNewUser = () => {
    // Animate button press
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => {
      router.push('/signin');
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* Background with clean white */}
      <View style={styles.background}>
        <View style={styles.handwritingTexture} />
      </View>

      {/* Animated content */}
      <Animated.View style={[
        styles.content,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }]
        }
      ]}>
        {/* App logo/title section */}
        <Animated.View style={[styles.logoSection, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>✍️</Text>
          </View>
          <Text style={styles.appTitle}>Written.ai</Text>
          <Text style={styles.appSubtitle}>AI-Powered Handwriting Recognition</Text>
        </Animated.View>

        {/* Features preview */}
        <Animated.View style={[
          styles.featuresSection,
          { opacity: Animated.add(fadeAnim, new Animated.Value(0)), transform: [{ translateY: Animated.add(slideAnim, new Animated.Value(30)) }] }
        ]}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✎</Text>
            <Text style={styles.featureText}>Handwriting Recognition</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>⚡</Text>
            <Text style={styles.featureText}>Real-time Processing</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✐</Text>
            <Text style={styles.featureText}>Save & Share</Text>
          </View>
        </Animated.View>

        {/* Action buttons */}
        <View style={styles.buttonSection}>
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <TouchableOpacity
              style={[styles.button, styles.startButton]}
              onPress={handleStart}
              activeOpacity={0.8}
            >
              <Text style={styles.startButtonText}>Start Writing</Text>
            </TouchableOpacity>
          </Animated.View>

          <TouchableOpacity
            style={[styles.button, styles.newUserButton]}
            onPress={handleNewUser}
            activeOpacity={0.8}
          >
            <Text style={styles.newUserButtonText}>New User</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Powered by Advanced AI</Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  handwritingTexture: {
    flex: 1,
    backgroundColor: '#ffffff',
    // Subtle paper-like texture effect
    opacity: 0.95,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  logoText: {
    fontSize: 40,
    textAlign: 'center',
    color: '#000000',
  },
  appTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
    textAlign: 'center',
  },
  appSubtitle: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.6)',
    textAlign: 'center',
    marginBottom: 20,
  },
  featuresSection: {
    marginBottom: 60,
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
    color: '#000000',
  },
  featureText: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.8)',
    fontWeight: '500',
  },
  buttonSection: {
    width: '100%',
    marginBottom: 40,
  },
  button: {
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  startButton: {
    backgroundColor: '#000000',
  },
  newUserButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.2)',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  newUserButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: 'rgba(0, 0, 0, 0.4)',
  },
});

// Alternative version without SafeAreaView for better compatibility
export function IndexWithoutSafeArea() {
  const router = useRouter();

  return (
    <View style={stylesAlt.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      <View style={stylesAlt.content}>
        <View style={stylesAlt.logoSection}>
          <View style={stylesAlt.logoCircle}>
            <Text style={stylesAlt.logoText}>✍️</Text>
          </View>
          <Text style={stylesAlt.appTitle}>Written.ai</Text>
          <Text style={stylesAlt.appSubtitle}>AI-Powered Handwriting Recognition</Text>
        </View>

        <View style={stylesAlt.buttonSection}>
          <TouchableOpacity
            style={[stylesAlt.button, stylesAlt.startButton]}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={stylesAlt.startButtonText}>Start</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[stylesAlt.button, stylesAlt.newUserButton]}
            onPress={() => router.push('/signin')}
          >
            <Text style={stylesAlt.newUserButtonText}>New User</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const stylesAlt = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 60,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 40,
    color: '#ffffff',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  buttonSection: {
    width: '100%',
    maxWidth: 300,
  },
  button: {
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  startButton: {
    backgroundColor: '#333333',
  },
  newUserButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#ffffff',
  },
  startButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  newUserButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
});

// Export the version you prefer
export { IndexWithoutSafeArea as IndexSimple };
