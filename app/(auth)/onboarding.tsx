import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../src/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import Input from '../../src/components/common/Input';
import Button from '../../src/components/common/Button';

type UserType = 'business' | 'individual' | 'salary_earner' | null;
type BusinessStatus = 'registered' | 'not_registered' | null;

const FIRST_TIME_KEY = '@ngtax_first_time_user';

export default function OnboardingScreen() {
  const router = useRouter();
  const dispatch = useDispatch();

  // Multi-step state
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<UserType>(null);
  const [businessStatus, setBusinessStatus] = useState<BusinessStatus>(null);
  
  // Form data
  const [cacNumber, setCacNumber] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [bvn, setBvn] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const handleNext = () => {
    // Validation logic here
    setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  const handleSkipBVN = () => {
    setBvn('');
    setStep(step + 1);
  };

  const handleFinish = async () => {
    // Mark that user has seen onboarding
    try {
      await AsyncStorage.setItem(FIRST_TIME_KEY, 'true');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
    // Save data and navigate to biometrics or home
    router.replace('/(tabs)');
  };

  const handleGoToLogin = async () => {
    // Mark that user has seen onboarding
    try {
      await AsyncStorage.setItem(FIRST_TIME_KEY, 'true');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
    }
    router.push('/(auth)/login');
  };

  const renderProgressBar = () => {
    const totalSteps = userType === 'individual' ? 5 : 8;
    const progress = (step / totalSteps) * 100;

    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Step {step} of {totalSteps}
        </Text>
      </View>
    );
  };

  // Step 1: User Type Selection
  const renderUserTypeStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Welcome! Let's get started</Text>
      <Text style={styles.stepSubtitle}>How would you describe yourself?</Text>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.optionCard, userType === 'business' && styles.optionCardSelected]}
          onPress={() => setUserType('business')}
        >
          <Ionicons 
            name="briefcase" 
            size={32} 
            color={userType === 'business' ? COLORS.primary : COLORS.mediumGray} 
          />
          <Text style={[styles.optionTitle, userType === 'business' && styles.optionTitleSelected]}>
            Business Owner
          </Text>
          <Text style={styles.optionDescription}>I own or run a business</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionCard, userType === 'individual' && styles.optionCardSelected]}
          onPress={() => setUserType('individual')}
        >
          <Ionicons 
            name="person" 
            size={32} 
            color={userType === 'individual' ? COLORS.primary : COLORS.mediumGray} 
          />
          <Text style={[styles.optionTitle, userType === 'individual' && styles.optionTitleSelected]}>
            Individual
          </Text>
          <Text style={styles.optionDescription}>Personal account</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionCard, userType === 'salary_earner' && styles.optionCardSelected]}
          onPress={() => setUserType('salary_earner')}
        >
          <Ionicons 
            name="wallet" 
            size={32} 
            color={userType === 'salary_earner' ? COLORS.primary : COLORS.mediumGray} 
          />
          <Text style={[styles.optionTitle, userType === 'salary_earner' && styles.optionTitleSelected]}>
            Salary Earner
          </Text>
          <Text style={styles.optionDescription}>I receive monthly salary</Text>
        </TouchableOpacity>
      </View>

      <Button
        title="Continue"
        onPress={handleNext}
        disabled={!userType}
      />

      <TouchableOpacity style={styles.loginLink} onPress={handleGoToLogin}>
        <Text style={styles.loginLinkText}>
          Already have an account? <Text style={styles.loginLinkBold}>Sign in</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );

  // Step 2: Business Registration Status (only for business)
  const renderBusinessStatusStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Business registration</Text>
      <Text style={styles.stepSubtitle}>Is your business registered?</Text>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={[styles.optionCard, businessStatus === 'registered' && styles.optionCardSelected]}
          onPress={() => setBusinessStatus('registered')}
        >
          <Ionicons 
            name="checkmark-circle" 
            size={32} 
            color={businessStatus === 'registered' ? COLORS.primary : COLORS.mediumGray} 
          />
          <Text style={[styles.optionTitle, businessStatus === 'registered' && styles.optionTitleSelected]}>
            Yes, Registered
          </Text>
          <Text style={styles.optionDescription}>I have CAC/RC number</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.optionCard, businessStatus === 'not_registered' && styles.optionCardSelected]}
          onPress={() => setBusinessStatus('not_registered')}
        >
          <Ionicons 
            name="document" 
            size={32} 
            color={businessStatus === 'not_registered' ? COLORS.primary : COLORS.mediumGray} 
          />
          <Text style={[styles.optionTitle, businessStatus === 'not_registered' && styles.optionTitleSelected]}>
            Not Registered
          </Text>
          <Text style={styles.optionDescription}>Unregistered business</Text>
        </TouchableOpacity>
      </View>

      <Button
        title="Continue"
        onPress={handleNext}
        disabled={!businessStatus}
      />
    </View>
  );

  // Step 3: CAC/RC Number (if registered)
  const renderCACStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Business verification</Text>
      <Text style={styles.stepSubtitle}>Enter your CAC or RC number</Text>

      <Input
        label="CAC/RC Number"
        placeholder="e.g., RC1234567"
        value={cacNumber}
        onChangeText={setCacNumber}
        autoCapitalize="characters"
      />

      <Button
        title="Continue"
        onPress={handleNext}
        disabled={!cacNumber.trim()}
      />
    </View>
  );

  // Step 3/4: Business Details (if not registered)
  const renderBusinessDetailsStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Business information</Text>
      <Text style={styles.stepSubtitle}>Tell us about your business</Text>

      <Input
        label="Business Name"
        placeholder="Enter business name"
        value={businessName}
        onChangeText={setBusinessName}
      />

      <Input
        label="Business Email"
        placeholder="business@example.com"
        value={businessEmail}
        onChangeText={setBusinessEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Input
        label="Business Address"
        placeholder="Enter business address"
        value={businessAddress}
        onChangeText={setBusinessAddress}
        multiline
      />

      <Button
        title="Continue"
        onPress={handleNext}
        disabled={!businessName.trim() || !businessEmail.trim()}
      />
    </View>
  );

  // Personal Email Step
  const renderEmailStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Your email</Text>
      <Text style={styles.stepSubtitle}>We'll use this to keep you updated</Text>

      <Input
        label="Email Address"
        placeholder="you@example.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Button
        title="Continue"
        onPress={handleNext}
        disabled={!email.trim()}
      />
    </View>
  );

  // Phone Number Step
  const renderPhoneStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Phone number</Text>
      <Text style={styles.stepSubtitle}>For account verification</Text>

      <Input
        label="Phone Number"
        placeholder="+234 800 000 0000"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <Button
        title="Continue"
        onPress={handleNext}
        disabled={!phone.trim()}
      />
    </View>
  );

  // BVN Step
  const renderBVNStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Bank Verification Number</Text>
      <Text style={styles.stepSubtitle}>
        This helps us verify your identity (optional)
      </Text>

      <Input
        label="BVN"
        placeholder="Enter your 11-digit BVN"
        value={bvn}
        onChangeText={setBvn}
        keyboardType="number-pad"
        maxLength={11}
      />

      <Button
        title="Continue"
        onPress={handleNext}
        disabled={bvn.length > 0 && bvn.length !== 11}
      />

      <TouchableOpacity style={styles.skipButton} onPress={handleSkipBVN}>
        <Text style={styles.skipText}>Skip for now</Text>
      </TouchableOpacity>
    </View>
  );

  // PIN Step
  const renderPINStep = () => (
    <View style={styles.stepContainer}>
      <Text style={styles.stepTitle}>Create transaction PIN</Text>
      <Text style={styles.stepSubtitle}>
        A 4-6 digit PIN for securing transactions
      </Text>

      <Input
        label="Transaction PIN"
        placeholder="Enter 4-6 digits"
        value={pin}
        onChangeText={setPin}
        secureTextEntry
        keyboardType="number-pad"
        maxLength={6}
      />

      <Input
        label="Confirm PIN"
        placeholder="Re-enter PIN"
        value={confirmPin}
        onChangeText={setConfirmPin}
        secureTextEntry
        keyboardType="number-pad"
        maxLength={6}
      />

      <Button
        title="Continue"
        onPress={handleNext}
        disabled={!pin || pin !== confirmPin || pin.length < 4}
      />
    </View>
  );

  // Biometrics Step
  const renderBiometricsStep = () => (
    <View style={styles.stepContainer}>
      <View style={styles.centeredContent}>
        <View style={styles.iconCircle}>
          <Ionicons name="finger-print" size={48} color={COLORS.primary} />
        </View>
        <Text style={styles.stepTitle}>Enable biometrics</Text>
        <Text style={styles.stepSubtitle}>
          Use your fingerprint or face ID for quick and secure access
        </Text>
      </View>

      <Button
        title="Enable biometrics"
        onPress={handleFinish}
      />

      <TouchableOpacity style={styles.skipButton} onPress={handleFinish}>
        <Text style={styles.skipText}>Skip for now</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCurrentStep = () => {
    if (step === 1) return renderUserTypeStep();
    
    if (userType === 'business') {
      if (step === 2) return renderBusinessStatusStep();
      if (step === 3 && businessStatus === 'registered') return renderCACStep();
      if (step === 3 && businessStatus === 'not_registered') return renderBusinessDetailsStep();
      if (step === 4 && businessStatus === 'registered') return renderEmailStep();
      if (step === 4 && businessStatus === 'not_registered') return renderEmailStep();
      if (step === 5) return renderPhoneStep();
      if (step === 6) return renderBVNStep();
      if (step === 7) return renderPINStep();
      if (step === 8) return renderBiometricsStep();
    } else {
      // Individual or salary earner
      if (step === 2) return renderEmailStep();
      if (step === 3) return renderPhoneStep();
      if (step === 4) return renderBVNStep();
      if (step === 5) return renderPINStep();
      if (step === 6) return renderBiometricsStep();
    }

    return renderUserTypeStep();
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
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Ionicons name="arrow-back" size={24} color={COLORS.black} />
          </TouchableOpacity>
        </View>

        {/* Progress Bar */}
        {renderProgressBar()}

        {/* Current Step */}
        {renderCurrentStep()}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SPACING.xl,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 60,
    paddingBottom: SPACING.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressContainer: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  progressBar: {
    height: 4,
    backgroundColor: COLORS.lightGray,
    borderRadius: 2,
    marginBottom: SPACING.sm,
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: TYPOGRAPHY.caption,
    fontFamily: TYPOGRAPHY.fontMedium,
    color: COLORS.mediumGray,
  },
  stepContainer: {
    paddingHorizontal: SPACING.lg,
    flex: 1,
  },
  stepTitle: {
    fontSize: TYPOGRAPHY.h1,
    fontFamily: TYPOGRAPHY.fontBold,
    color: COLORS.black,
    marginBottom: SPACING.sm,
  },
  stepSubtitle: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: TYPOGRAPHY.fontRegular,
    color: COLORS.mediumGray,
    marginBottom: SPACING.xl,
    lineHeight: 24,
  },
  optionsContainer: {
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  optionCard: {
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 2,
    borderColor: COLORS.lightGray,
    backgroundColor: COLORS.white,
  },
  optionCardSelected: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.primary + '08',
  },
  optionTitle: {
    fontSize: TYPOGRAPHY.h3,
    fontFamily: TYPOGRAPHY.fontSemiBold,
    color: COLORS.black,
    marginTop: SPACING.sm,
    marginBottom: 4,
  },
  optionTitleSelected: {
    color: COLORS.primary,
  },
  optionDescription: {
    fontSize: TYPOGRAPHY.small,
    fontFamily: TYPOGRAPHY.fontRegular,
    color: COLORS.mediumGray,
  },
  skipButton: {
    alignSelf: 'center',
    marginTop: SPACING.md,
    padding: SPACING.sm,
  },
  skipText: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: TYPOGRAPHY.fontMedium,
    color: COLORS.mediumGray,
  },
  centeredContent: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  loginLink: {
    alignSelf: 'center',
    marginTop: SPACING.lg,
    padding: SPACING.sm,
  },
  loginLinkText: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: TYPOGRAPHY.fontRegular,
    color: COLORS.mediumGray,
    textAlign: 'center',
  },
  loginLinkBold: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: TYPOGRAPHY.fontBold,
    color: COLORS.primary,
  },
});
