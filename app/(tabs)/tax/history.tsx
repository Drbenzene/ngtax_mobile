// Tax History Screen - Placeholder

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '../../../src/store/store';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../../src/styles/theme';
import { DEMO_TAX_FILINGS } from '../../../src/utils/demoTaxData';
import { formatCurrency } from '../../../src/utils/taxCalculations';
import { FILING_STATUS_COLORS } from '../../../src/utils/taxConstants';

export default function TaxHistoryScreen() {
  const router = useRouter();
  const { filings } = useSelector((state: RootState) => state.tax);

  // Use demo filings if none in state
  const allFilings = filings.length > 0 ? filings : DEMO_TAX_FILINGS;

  const renderFiling = ({ item }: any) => {
    const statusColor: string = FILING_STATUS_COLORS[item.status] || COLORS.mediumGray;
    const monthName = new Date(item.period.startDate).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });

    return (
      <TouchableOpacity style={styles.filingCard}>
        <View style={styles.filingHeader}>
          <Text style={styles.filingMonth}>{monthName}</Text>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        </View>
        <Text style={styles.filingAmount}>
          {formatCurrency(item.summary.estimatedTaxLiability)}
        </Text>
        <View style={styles.filingDetails}>
          <Text style={styles.detailText}>
            VAT: {formatCurrency(item.summary.vatReturn.netVATPayable)}
          </Text>
          <Text style={styles.detailText}>
            {item.summary.transactionCount} transactions
          </Text>
        </View>
        {item.confirmationNumber && (
          <Text style={styles.confirmationText}>
            Ref: {item.confirmationNumber}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.black} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tax History</Text>
        <TouchableOpacity>
          <Ionicons name="filter-outline" size={24} color={COLORS.black} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={allFilings}
        renderItem={renderFiling}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="document-outline" size={64} color={COLORS.mediumGray} />
            <Text style={styles.emptyText}>No tax filings yet</Text>
          </View>
        }
      />
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
  listContent: {
    padding: SPACING.lg,
  },
  filingCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  filingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  filingMonth: {
    fontSize: TYPOGRAPHY.h3,
    fontFamily: TYPOGRAPHY.fontBold,
    color: COLORS.black,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  filingAmount: {
    fontSize: TYPOGRAPHY.xxl,
    fontFamily: TYPOGRAPHY.fontBold,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  filingDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xs,
  },
  detailText: {
    fontSize: TYPOGRAPHY.small,
    fontFamily: TYPOGRAPHY.fontRegular,
    color: COLORS.mediumGray,
  },
  confirmationText: {
    fontSize: TYPOGRAPHY.caption,
    fontFamily: TYPOGRAPHY.fontMedium,
    color: COLORS.mediumGray,
    marginTop: SPACING.xs,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl * 2,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: TYPOGRAPHY.fontMedium,
    color: COLORS.mediumGray,
    marginTop: SPACING.md,
  },
});
