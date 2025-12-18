// Tax Settings Screen - Placeholder

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../src/store/store';
import { updatePreferences } from '../../../src/store/slices/taxSlice';
import { Ionicons } from '@expo/vector-icons';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../../src/styles/theme';
import { useTheme } from '../../../src/hooks/useTheme';

export default function TaxSettingsScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { preferences, businessInfo } = useSelector((state: RootState) => state.tax);
  const { theme, colors, toggleTheme } = useTheme();

  const toggleReminders = () => {
    dispatch(updatePreferences({ enableReminders: !preferences.enableReminders }));
  };

  const toggleAutoVAT = () => {
    dispatch(updatePreferences({ autoCalculateVAT: !preferences.autoCalculateVAT }));
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Tax Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Business Information */}
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Business Information</Text>
          
          <View style={styles.infoCard}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Business Name</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{businessInfo?.businessName || 'Not set'}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>CAC Number</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{businessInfo?.cacNumber || 'Not set'}</Text>
          </View>

          <View style={styles.infoCard}>
            <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>TIN Number</Text>
            <Text style={[styles.infoValue, { color: colors.text }]}>{businessInfo?.tinNumber || 'Not set'}</Text>
          </View>
        </View>

        {/* Tax Preferences */}
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferences</Text>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Appearance</Text>
              <Text style={[styles.settingHint, { color: colors.textSecondary }]}>Switch between light and dark mode</Text>
            </View>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary + '40' }}
              thumbColor={theme === 'dark' ? colors.primary : colors.textTertiary}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Enable Reminders</Text>
              <Text style={[styles.settingHint, { color: colors.textSecondary }]}>Get notified before tax deadlines</Text>
            </View>
            <Switch
              value={preferences.enableReminders}
              onValueChange={toggleReminders}
              trackColor={{ false: colors.border, true: colors.primary + '40' }}
              thumbColor={preferences.enableReminders ? colors.primary : colors.textTertiary}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Text style={[styles.settingLabel, { color: colors.text }]}>Auto-Calculate VAT</Text>
              <Text style={[styles.settingHint, { color: colors.textSecondary }]}>Automatically calculate VAT on transactions</Text>
            </View>
            <Switch
              value={preferences.autoCalculateVAT}
              onValueChange={toggleAutoVAT}
              trackColor={{ false: colors.border, true: colors.primary + '40' }}
              thumbColor={preferences.autoCalculateVAT ? colors.primary : colors.textTertiary}
            />
          </View>
        </View>

        {/* Actions */}
        <View style={[styles.section, { borderBottomColor: colors.border }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Actions</Text>

          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.card }]}>
            <Ionicons name="download-outline" size={20} color={colors.primary} />
            <Text style={[styles.actionButtonText, { color: colors.text }]}>Export Tax Data</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.card }]}>
            <Ionicons name="document-text-outline" size={20} color={colors.primary} />
            <Text style={[styles.actionButtonText, { color: colors.text }]}>Tax Law Guide</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, { backgroundColor: colors.card }]}>
            <Ionicons name="help-circle-outline" size={20} color={colors.primary} />
            <Text style={[styles.actionButtonText, { color: colors.text }]}>Help & Support</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: 60,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.h3,
    fontFamily: TYPOGRAPHY.fontBold,
  },
  content: {
    flex: 1,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.h3,
    fontFamily: TYPOGRAPHY.fontBold,
    marginBottom: SPACING.md,
  },
  infoCard: {
    marginBottom: SPACING.md,
  },
  infoLabel: {
    fontSize: TYPOGRAPHY.small,
    fontFamily: TYPOGRAPHY.fontMedium,
    marginBottom: SPACING.xxs,
  },
  infoValue: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: TYPOGRAPHY.fontSemiBold,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
  },
  settingLeft: {
    flex: 1,
    marginRight: SPACING.md,
  },
  settingLabel: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: TYPOGRAPHY.fontSemiBold,
    marginBottom: SPACING.xxs,
  },
  settingHint: {
    fontSize: TYPOGRAPHY.small,
    fontFamily: TYPOGRAPHY.fontRegular,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.sm,
  },
  actionButtonText: {
    flex: 1,
    fontSize: TYPOGRAPHY.body,
    fontFamily: TYPOGRAPHY.fontMedium,
    marginLeft: SPACING.sm,
  },
});
