// Tax Receipts Screen - Placeholder

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../../src/styles/theme';

export default function TaxReceiptsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Receipts</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        <View style={styles.comingSoon}>
          <Ionicons name="camera-outline" size={64} color={COLORS.mediumGray} />
          <Text style={styles.comingSoonTitle}>Receipt Management</Text>
          <Text style={styles.comingSoonText}>
            Upload and manage receipts:{'\n'}
            • Capture with camera{'\n'}
            • Upload from gallery{'\n'}
            • Link to transactions{'\n'}
            • Organize by tax period
          </Text>
          <TouchableOpacity style={styles.uploadButton}>
            <Ionicons name="camera" size={24} color={COLORS.white} />
            <Text style={styles.uploadButtonText}>Upload Receipt</Text>
          </TouchableOpacity>
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: 60,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  backButton: {
    padding: SPACING.xs,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.h3,
    fontFamily: TYPOGRAPHY.fontBold,
    color: COLORS.black,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  comingSoon: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  comingSoonTitle: {
    fontSize: TYPOGRAPHY.h2,
    fontFamily: TYPOGRAPHY.fontBold,
    color: COLORS.black,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  comingSoonText: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: TYPOGRAPHY.fontRegular,
    color: COLORS.mediumGray,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: SPACING.xl,
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
  },
  uploadButtonText: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: TYPOGRAPHY.fontSemiBold,
    color: COLORS.white,
  },
});
