import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../src/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import Button from '../../src/components/common/Button';
import {
  requestAllSMSPermissions,
  checkSMSPermissions,
  isSMSAvailable,
} from '../../src/services/smsPermissionService';
import smsListener from '../../src/services/smsListenerService';

const PERMISSIONS_CHECKED_KEY = '@ngtax_permissions_checked';

interface Permission {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  granted: boolean;
  required?: boolean;
}

export default function PermissionsRequestScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [smsAvailable, setSmsAvailable] = useState(false);
  const [permissions, setPermissions] = useState<Permission[]>([
    {
      id: 'sms',
      icon: 'mail',
      title: 'SMS Access',
      description: 'Auto-detect bank transactions from SMS',
      granted: false,
      required: true,
    },
    {
      id: 'camera',
      icon: 'camera',
      title: 'Camera Access',
      description: 'Scan receipts and documents',
      granted: false,
    },
    {
      id: 'storage',
      icon: 'folder',
      title: 'Storage Access',
      description: 'Upload receipts and PDFs',
      granted: false,
    },
    {
      id: 'notifications',
      icon: 'notifications',
      title: 'Notifications',
      description: 'Transaction alerts and updates',
      granted: false,
    },
  ]);

  useEffect(() => {
    checkExistingPermissions();
  }, []);

  const checkExistingPermissions = async () => {
    // Check if SMS is available
    const available = await isSMSAvailable();
    setSmsAvailable(available);

    if (Platform.OS === 'android') {
      // Check SMS permissions
      const smsPerms = await checkSMSPermissions();
      
      setPermissions((prev) =>
        prev.map((p) =>
          p.id === 'sms'
            ? { ...p, granted: smsPerms.read && smsPerms.receive }
            : p
        )
      );
    }
  };

  const handleAllow = async (id: string) => {
    if (id === 'sms') {
      setLoading(true);
      
      try {
        const granted = await requestAllSMSPermissions();
        
        if (granted) {
          Alert.alert(
            'SMS Permission Granted',
            'NGTax AI will now automatically detect your bank transactions from SMS!',
            [{ text: 'Great!', style: 'default' }]
          );

          // Start SMS listener
          smsListener.startListening();

          setPermissions((prev) =>
            prev.map((p) => (p.id === id ? { ...p, granted: true } : p))
          );
        } else {
          Alert.alert(
            'Permission Denied',
            'SMS permission is required to automatically track your transactions. You can enable it later in settings.',
            [{ text: 'OK', style: 'cancel' }]
          );
        }
      } catch (error) {
        console.error('Error requesting SMS permission:', error);
        Alert.alert('Error', 'Failed to request SMS permission');
      } finally {
        setLoading(false);
      }
    } else {
      // Handle other permissions
      setPermissions((prev) =>
        prev.map((p) => (p.id === id ? { ...p, granted: true } : p))
      );
    }
  };

  const handleContinue = async () => {
    const smsPermission = permissions.find((p) => p.id === 'sms');
    
    if (smsPermission?.granted) {
      // Start SMS listener if permission granted
      smsListener.startListening();
    }

    // Mark that permissions have been checked
    try {
      await AsyncStorage.setItem(PERMISSIONS_CHECKED_KEY, 'true');
    } catch (error) {
      console.error('Error saving permissions status:', error);
    }

    router.replace('/(tabs)');
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Permissions?',
      'Without SMS access, you\'ll need to manually enter all transactions. Are you sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip Anyway',
          style: 'destructive',
          onPress: async () => {
            // Mark permissions as checked even if skipped
            try {
              await AsyncStorage.setItem(PERMISSIONS_CHECKED_KEY, 'true');
            } catch (error) {
              console.error('Error saving permissions status:', error);
            }
            router.replace('/(tabs)');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <Ionicons name="lock-closed" size={40} color={COLORS.white} />
          </View>
          
          <Text style={styles.title}>Enhance Your Experience</Text>
          <Text style={styles.subtitle}>
            Grant permissions to unlock powerful AI features
          </Text>
        </View>

        <View style={styles.permissionsList}>
          {permissions.map((permission) => (
            <View key={permission.id} style={styles.permissionCard}>
              <View style={styles.permissionIcon}>
                <Ionicons
                  name={permission.icon}
                  size={24}
                  color={COLORS.primary}
                />
              </View>

              <View style={styles.permissionContent}>
                <View style={styles.permissionTitleRow}>
                  <Text style={styles.permissionTitle}>{permission.title}</Text>
                  {permission.required && (
                    <View style={styles.requiredBadge}>
                      <Text style={styles.requiredText}>Required</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.permissionDescription}>
                  {permission.description}
                </Text>
                {permission.id === 'sms' && Platform.OS !== 'android' && (
                  <Text style={styles.platformNote}>
                    (Android only)
                  </Text>
                )}
              </View>

              <TouchableOpacity
                style={[
                  styles.allowButton,
                  permission.granted && styles.allowButtonGranted,
                ]}
                onPress={() => handleAllow(permission.id)}
                disabled={permission.granted || (permission.id === 'sms' && Platform.OS !== 'android') || loading}
              >
                {permission.granted ? (
                  <Ionicons name="checkmark" size={16} color={COLORS.white} />
                ) : (
                  <Ionicons name="arrow-forward" size={16} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Button title="Continue" onPress={handleContinue} variant="primary" />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.xl,
    paddingTop: 60,
    paddingBottom: SPACING.xl,
  },
  skipButton: {
    alignSelf: 'flex-end',
    padding: SPACING.sm,
    marginBottom: SPACING.md,
  },
  skipText: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.mediumGray,
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
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
    fontSize: TYPOGRAPHY.h2,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: SPACING.xs,
  },
  subtitle: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.mediumGray,
    textAlign: 'center',
    lineHeight: 22,
  },
  permissionsList: {
    flex: 1,
  },
  permissionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.md,
  },
  permissionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  permissionContent: {
    flex: 1,
  },
  permissionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  permissionTitle: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.black,
    marginRight: SPACING.xs,
  },
  requiredBadge: {
    backgroundColor: COLORS.error + '20',
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.xs,
  },
  requiredText: {
    fontSize: TYPOGRAPHY.tiny,
    fontWeight: '600',
    color: COLORS.error,
  },
  permissionDescription: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.mediumGray,
  },
  platformNote: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.mediumGray,
    fontStyle: 'italic',
    marginTop: 2,
  },
  allowButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  allowButtonGranted: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  footer: {
    marginTop: SPACING.lg,
  },
});
