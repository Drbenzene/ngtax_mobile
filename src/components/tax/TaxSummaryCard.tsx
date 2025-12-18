// Tax Summary Card Component

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../styles/theme';
import { MonthlyTaxSummary } from '../../types/taxTypes';
import { formatCurrency } from '../../utils/taxCalculations';
import { FILING_STATUS_COLORS, FILING_STATUS_LABELS } from '../../utils/taxConstants';

interface TaxSummaryCardProps {
  summary: MonthlyTaxSummary;
  onPress?: () => void;
}

export default function TaxSummaryCard({ summary, onPress }: TaxSummaryCardProps) {
  const { period, totalIncome, totalExpenses, netIncome, vatReturn, estimatedTaxLiability, missingReceipts } = summary;

  const monthName = new Date(period.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const statusColor = FILING_STATUS_COLORS[vatReturn.status];
  const statusLabel = FILING_STATUS_LABELS[vatReturn.status];

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={!onPress}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.monthText}>{monthName}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColor + '20' }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>{statusLabel}</Text>
        </View>
      </View>

      {/* Main Amount */}
      <View style={styles.mainAmount}>
        <Text style={styles.amountLabel}>Tax Liability</Text>
        <Text style={styles.amountValue}>{formatCurrency(estimatedTaxLiability)}</Text>
      </View>

      {/* Breakdown */}
      <View style={styles.breakdown}>
        <View style={styles.breakdownRow}>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownLabel}>VAT Collected</Text>
            <Text style={[styles.breakdownValue, { color: COLORS.success }]}>
              {formatCurrency(vatReturn.vatCollected)}
            </Text>
          </View>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownLabel}>Taxable Income</Text>
            <Text style={styles.breakdownValue}>{formatCurrency(totalIncome)}</Text>
          </View>
        </View>
        
        <View style={styles.breakdownRow}>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownLabel}>Deductions</Text>
            <Text style={[styles.breakdownValue, { color: COLORS.warning }]}>
              {formatCurrency(totalExpenses)}
            </Text>
          </View>
          <View style={styles.breakdownItem}>
            <Text style={styles.breakdownLabel}>Net Income</Text>
            <Text style={styles.breakdownValue}>{formatCurrency(netIncome)}</Text>
          </View>
        </View>
      </View>

      {/* Warning for missing receipts */}
      {missingReceipts > 0 && (
        <View style={styles.warningBox}>
          <Ionicons name="warning" size={16} color={COLORS.warning} />
          <Text style={styles.warningText}>
            {missingReceipts} transaction{missingReceipts > 1 ? 's' : ''} missing receipt{missingReceipts > 1 ? 's' : ''}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.lg,
    ...SHADOWS.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  monthText: {
    fontSize: TYPOGRAPHY.h3,
    fontFamily: TYPOGRAPHY.fontBold,
    color: COLORS.black,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xxs,
    borderRadius: BORDER_RADIUS.xs,
  },
  statusText: {
    fontSize: TYPOGRAPHY.caption,
    fontFamily: TYPOGRAPHY.fontSemiBold,
  },
  mainAmount: {
    marginBottom: SPACING.lg,
  },
  amountLabel: {
    fontSize: TYPOGRAPHY.small,
    fontFamily: TYPOGRAPHY.fontMedium,
    color: COLORS.mediumGray,
    marginBottom: SPACING.xxs,
  },
  amountValue: {
    fontSize: TYPOGRAPHY.xxxl,
    fontFamily: TYPOGRAPHY.fontBold,
    color: COLORS.primary,
  },
  breakdown: {
    gap: SPACING.sm,
  },
  breakdownRow: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  breakdownItem: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.sm,
  },
  breakdownLabel: {
    fontSize: TYPOGRAPHY.caption,
    fontFamily: TYPOGRAPHY.fontMedium,
    color: COLORS.mediumGray,
    marginBottom: SPACING.xxs,
  },
  breakdownValue: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: TYPOGRAPHY.fontBold,
    color: COLORS.black,
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.md,
    padding: SPACING.sm,
    backgroundColor: COLORS.warning + '10',
    borderRadius: BORDER_RADIUS.xs,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.warning,
  },
  warningText: {
    flex: 1,
    fontSize: TYPOGRAPHY.small,
    fontFamily: TYPOGRAPHY.fontMedium,
    color: COLORS.warning,
  },
});
