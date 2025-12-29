import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  PermissionsAndroid
} from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { demoLogin } from '../../src/store/slices/authSlice';
import { COLORS, SPACING, TYPOGRAPHY } from '../../src/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../src/components/common/Button';
import Input from '../../src/components/common/Input';
import * as SMS from 'expo-sms';


const PERMISSIONS_CHECKED_KEY = '@ngtax_permissions_checked';

export default function LoginScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [email, setEmail] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkSMSAvailability = async () => {
      const isAvailable = await SMS.isAvailableAsync();
      if (isAvailable) {
        console.log('SMS is available');
        //request READ SMS PERMISSION
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_SMS,
          {
            title: 'Read SMS Permission',
            message: 'We need your permission to read SMS messages.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        console.log(granted, "MEMME");
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('SMS permission granted');
          // do your SMS stuff here
        } else {
          console.log('SMS permission denied');
        }
      } else {
        // misfortune... there's no SMS available on this device
      }
    };
    checkSMSAvailability();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    
    // Demo login - no validation
    setTimeout(async () => {
      dispatch(demoLogin());
      setLoading(false);
      
      try {
        const permissionsChecked = await AsyncStorage.getItem(PERMISSIONS_CHECKED_KEY);
        
        if (permissionsChecked === null) {
          router.replace('/(auth)/permissions');
        } else {
          router.replace('/(tabs)');
        }
      } catch (error) {
        console.error('Error checking permissions:', error);
        router.replace('/(tabs)');
      }
    }, 1000);
  };

  const handleBiometric = () => {
    // Demo biometric login
    setTimeout(() => {
      dispatch(demoLogin());
      router.replace('/(tabs)');
    }, 500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name="flash" size={40} color={COLORS.white} />
          </View>
          
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email or Phone"
            placeholder="Enter your email or phone"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={
              <Ionicons name="mail-outline" size={20} color={COLORS.mediumGray} />
            }
          />

          <Input
            label="PIN"
            placeholder="Enter your PIN"
            value={pin}
            onChangeText={setPin}
            secureTextEntry
            keyboardType="number-pad"
            maxLength={6}
            leftIcon={
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.mediumGray} />
            }
          />

          <TouchableOpacity style={styles.forgotButton}>
            <Text style={styles.forgotText}>Forgot PIN?</Text>
          </TouchableOpacity>

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            variant="primary"
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <Button
            title="Use Biometrics"
            onPress={handleBiometric}
            variant="outline"
            icon={<Ionicons name="finger-print" size={20} color={COLORS.white} />}
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
            <Text style={styles.footerLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
    marginTop: SPACING.xl,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  title: {
    fontSize: TYPOGRAPHY.h1,
    fontWeight: '700',
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.primaryLight,
  },
  form: {
    flex: 1,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: SPACING.lg,
    marginTop: -SPACING.sm,
  },
  forgotText: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.primaryLight,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.lg,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.darkGray,
  },
  dividerText: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.mediumGray,
    marginHorizontal: SPACING.md,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  footerText: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.mediumGray,
  },
  footerLink: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.primary,
    fontWeight: '600',
  },
});
