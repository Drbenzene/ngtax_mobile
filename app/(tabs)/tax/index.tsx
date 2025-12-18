// Tax Dashboard Screen

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '../../../src/store/store';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../../src/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import TaxSummaryCard from '../../../src/components/tax/TaxSummaryCard';
import {
  getTaxPeriod,
  calculateMonthlyTaxSummary,
  getVATFilingDueDate,
  getDaysUntilDeadline,
} from '../../../src/utils/taxCalculations';
import { DEMO_BUSINESS_INFO, DEMO_MONTHLY_SUMMARY } from '../../../src/utils/demoTaxData';

export default function TaxDashboardScreen() {
  const router = useRouter();
  const { transactions } = useSelector((state: RootState) => state.transaction);
  const { businessInfo, currentPeriod, filings } = useSelector((state: RootState) => state.tax);

  const [refreshing, setRefreshing] = useState(false);

  //  Use demo data for now
  const bizInfo = businessInfo || DEMO_BUSINESS_INFO;
  const period = currentPeriod || getTaxPeriod(new Date());

  // Calculate current month summary
  const monthlySummary = useMemo(
    () => calculateMonthlyTaxSummary(transactions, period, bizInfo),
    [transactions, period, bizInfo]
  );

  // Get VAT filing due date and days remaining
  const dueDate = getVATFilingDueDate(period);
  const daysRemaining = getDaysUntilDeadline(dueDate);
  const isOverdue = daysRemaining < 0;

  // Recent filings (last 3)
  const recentFilings = filings.slice(0, 3);

  const onRefresh = () => {
    setRefreshing(true);
    // TODO: Refresh tax data
    setTimeout(() => setRefreshing(false), 1000);
  };

  const formatDueDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tax Dashboard</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/tax/settings' as any)}>
          <Ionicons name="settings-outline" size={24} color={COLORS.black} />
        </TouchableOpacity>
      </View>

      {/* Current Month Summary */}
      <TaxSummaryCard summary={monthlySummary} />

      {/* Next Deadline Card */}
      <View style={[styles.deadlineCard, isOverdue && styles.deadlineCardOverdue]}>
        <View style={styles.deadlineHeader}>
          <Ionicons
            name={isOverdue ? 'alert-circle' : 'calendar-outline'}
            size={24}
            color={isOverdue ? COLORS.error : COLORS.primary}
          />
          <Text style={styles.deadlineTitle}>
            {isOverdue ? 'Overdue Filing' : 'Next Deadline'}
          </Text>
        </View>
        <Text style={styles.deadlineText}>
          VAT Return Due: {formatDueDate(dueDate)}
        </Text>
        <Text style={[styles.daysRemaining, isOverdue && styles.daysRemainingOverdue]}>
          {isOverdue
            ? `${Math.abs(daysRemaining)} days overdue`
            : `${daysRemaining} days remaining`}
        </Text>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={[styles.actionButton, styles.actionButtonPrimary]}
            onPress={() => router.push('/(tabs)/tax/filing' as any)}
          >
            <Ionicons name="document-text" size={24} color={COLORS.white} />
            <Text style={styles.actionTextPrimary}>File Tax</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)/tax/receipts' as any)}
          >
            <Ionicons name="camera" size={24} color={COLORS.primary} />
            <Text style={styles.actionText}>Add Receipt</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)/tax/history' as any)}
          >
            <Ionicons name="time-outline" size={24} color={COLORS.primary} />
            <Text style={styles.actionText}>Tax History</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)/tax/settings' as any)}
          >
            <Ionicons name="settings-outline" size={24} color={COLORS.primary} />
            <Text style={styles.actionText}>Settings</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* Show recent transactions with tax categories */}
        {transactions.slice(0, 4).map((transaction) => (
          <TouchableOpacity
            key={transaction.id}
            style={styles.transactionRow}
            onPress={() => router.push(`/(tabs)/transaction/${transaction.id}` as any)}
          >
            <View style={styles.transactionLeft}>
              <View style={styles.txIcon}>
                <Text style={styles.emoji}>{transaction.icon}</Text>
              </View>
              <View>
                <Text style={styles.txName}>{transaction.description}</Text>
                <Text style={styles.txDate}>
                  {new Date(transaction.timestamp).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </Text>
              </View>
            </View>
            <View style={styles.transactionRight}>
              <Text
                style={[
                  styles.txAmount,
                  transaction.amount > 0 ? styles.positive : styles.negative,
                ]}
              >
                {transaction.amount > 0 ? '+' : ''}₦{Math.abs(transaction.amount).toFixed(2)}
              </Text>
              {transaction.taxCategory && (
                <View style={styles.taxBadge}>
                  <Text style={styles.taxBadgeText}>
                    {transaction.taxCategory === 'vat_sale' && '📊 VAT'}
                    {transaction.taxCategory === 'deductible_expense' && '💰 Deduct'}
                    {transaction.taxCategory === 'taxable_income' && '💼 Income'}
                  </Text>
                </View>
              )}
              {transaction.receiptUrl && (
                <Ionicons name="receipt" size={14} color={COLORS.success} />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Compliance Score (Optional future feature) */}
      <View style={styles.complianceSection}>
        <Text style={styles.complianceTitle}>Tax Compliance</Text>
        <View style={styles.complianceBar}>
          <View style={[styles.complianceFill, { width: '85%' }]} />
        </View>
        <Text style={styles.complianceText}>85% - Good standing</Text>
        <Text style={styles.complianceHint}>
          Upload 2 missing receipts to reach 100%
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: 60,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.h2,
    fontFamily: TYPOGRAPHY.fontBold,
    color: COLORS.black,
  },
  deadlineCard: {
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    padding: SPACING.lg,
    backgroundColor: COLORS.primary + '10',
    borderRadius: BORDER_RADIUS.md,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
  },
  deadlineCardOverdue: {
    backgroundColor: COLORS.error + '10',
    borderLeftColor: COLORS.error,
  },
  deadlineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginBottom: SPACING.xs,
  },
  deadlineTitle: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: TYPOGRAPHY.fontSemiBold,
    color: COLORS.black,
  },
  deadlineText: {
    fontSize: TYPOGRAPHY.small,
    fontFamily: TYPOGRAPHY.fontRegular,
    color: COLORS.darkGray,
    marginBottom: SPACING.xxs,
  },
  daysRemaining: {
    fontSize: TYPOGRAPHY.h3,
    fontFamily: TYPOGRAPHY.fontBold,
    color: COLORS.primary,
  },
  daysRemainingOverdue: {
    color: COLORS.error,
  },
  section: {
    marginTop: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.h3,
    fontFamily: TYPOGRAPHY.fontBold,
    color: COLORS.black,
    marginBottom: SPACING.md,
  },
  seeAll: {
    fontSize: TYPOGRAPHY.small,
    fontFamily: TYPOGRAPHY.fontMedium,
    color: COLORS.primary,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
  },
  actionButton: {
    flex: 1,
    minWidth: '45%',
    padding: SPACING.lg,
    backgroundColor: COLORS.lightGray,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    gap: SPACING.xs,
  },
  actionButtonPrimary: {
    backgroundColor: COLORS.primary,
  },
  actionText: {
    fontSize: TYPOGRAPHY.small,
    fontFamily: TYPOGRAPHY.fontSemiBold,
    color: COLORS.primary,
  },
  actionTextPrimary: {
    fontSize: TYPOGRAPHY.small,
    fontFamily: TYPOGRAPHY.fontSemiBold,
    color: COLORS.white,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  txIcon: {
    width: 40,
    height: 40,
    borderRadius: BORDER_RADIUS.sm,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  emoji: {
    fontSize: 18,
  },
  txName: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: TYPOGRAPHY.fontMedium,
    color: COLORS.black,
    marginBottom: 2,
  },
  txDate: {
    fontSize: TYPOGRAPHY.caption,
    fontFamily: TYPOGRAPHY.fontRegular,
    color: COLORS.mediumGray,
  },
  transactionRight: {
    alignItems: 'flex-end',
    gap: SPACING.xxs,
  },
  txAmount: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: TYPOGRAPHY.fontBold,
  },
  positive: {
    color: COLORS.success,
  },
  negative: {
    color: COLORS.black,
  },
  taxBadge: {
    paddingHorizontal: SPACING.xs,
    paddingVertical: 2,
    backgroundColor: COLORS.lightGray,
    borderRadius: BORDER_RADIUS.xs,
  },
  taxBadgeText: {
    fontSize: TYPOGRAPHY.tiny,
    fontFamily: TYPOGRAPHY.fontMedium,
    color: COLORS.darkGray,
  },
  complianceSection: {
    marginTop: SPACING.xl,
    marginHorizontal: SPACING.lg,
    padding: SPACING.lg,
    backgroundColor: COLORS.lightGray,
    borderRadius: BORDER_RADIUS.md,
  },
  complianceTitle: {
    fontSize: TYPOGRAPHY.h3,
    fontFamily: TYPOGRAPHY.fontBold,
    color: COLORS.black,
   marginBottom: SPACING.sm,
  },
  complianceBar: {
    height: 8,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xs,
    overflow: 'hidden',
    marginBottom: SPACING.xs,
  },
  complianceFill: {
    height: '100%',
    backgroundColor: COLORS.success,
  },
  complianceText: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: TYPOGRAPHY.fontSemiBold,
    color: COLORS.success,
    marginBottom: SPACING.xxs,
  },
  complianceHint: {
    fontSize: TYPOGRAPHY.small,
    fontFamily: TYPOGRAPHY.fontRegular,
    color: COLORS.mediumGray,
  },
});
