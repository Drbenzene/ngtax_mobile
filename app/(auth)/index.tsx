import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, TYPOGRAPHY } from '../../src/styles/theme';
import { Ionicons } from '@expo/vector-icons';

const FIRST_TIME_KEY = '@ngtax_first_time_user';

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.3);

  useEffect(() => {
    // Animate logo entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();

    // Check if first time user and navigate
    const checkFirstTimeUser = async () => {
      try {
        const hasSeenOnboarding = await AsyncStorage.getItem(FIRST_TIME_KEY);
        
        // Wait for animation before navigating
        setTimeout(() => {
          if (hasSeenOnboarding === null) {
            // First time user - show onboarding
            router.replace('/(auth)/onboarding');
          } else {
            // Returning user - show login
            router.replace('/(auth)/login');
          }
        }, 2500);
      } catch (error) {
        console.error('Error checking first time user:', error);
        // Default to login on error
        setTimeout(() => {
          router.replace('/(auth)/login');
        }, 2500);
      }
    };

    checkFirstTimeUser();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <View style={styles.iconCircle}>
          <Ionicons name="flash" size={60} color={COLORS.white} />
        </View>
        
        <Text style={styles.appName}>NGTax AI</Text>
        <Text style={styles.tagline}>
          Your AI-Powered Financial Assistant
        </Text>
      </Animated.View>

      <View style={styles.footer}>
        <ActivityIndicator size="small" color={COLORS.primary} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  appName: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: COLORS.primaryLight,
    textAlign: 'center',
    maxWidth: 280,
  },
  footer: {
    position: 'absolute',
    bottom: 60,
  },
});
