import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Dimensions,
  Clipboard,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../src/store/store';
import { toggleShowBalance } from '../../src/store/slices/walletSlice';
import { SPACING, TYPOGRAPHY, BORDER_RADIUS, SHADOWS } from '../../src/styles/theme';
import { useTheme } from '../../src/hooks/useTheme';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const { user } = useSelector((state: RootState) => state.auth);
  const { accounts, showBalance } = useSelector((state: RootState) => state.wallet);
  const { transactions } = useSelector((state: RootState) => state.transaction);
  
  const [refreshing, setRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAccountDetails, setShowAccountDetails] = useState(false);

  const businessAccount = {
    bankName: 'Sterling Bank',
    accountName: 'NGTAX TECHNOLOGIES LTD',
    accountNumber: '0123456789',
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const recentTransactions = transactions.slice(0, 3);

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const handleCopyAccount = () => {
    Clipboard.setString(businessAccount.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
    >
      {/* Compact Header */}
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: colors.text }]}>Hi, {user?.fullName?.split(' ')[0] || 'User'}</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="notifications-outline" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Compact Balance Card - Keep primary color for balance card */}
      <View style={[styles.balanceCard, { backgroundColor: colors.primary }]}>
        <View style={styles.balanceRow}>
          <View style={styles.balanceInfo}>
            <Text style={styles.balanceLabel}>Total balance</Text>
            <Text style={styles.balanceAmount}>
              {showBalance ? `$${totalBalance.toFixed(2)}` : '$ ••,•••'}
            </Text>
          </View>
          <TouchableOpacity onPress={() => dispatch(toggleShowBalance())}>
            <Ionicons 
              name={showBalance ? 'eye-outline' : 'eye-off-outline'} 
              size={22} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>
        </View>

        {/* Expandable Account Details */}
        <TouchableOpacity 
          style={styles.accountToggle}
          onPress={() => setShowAccountDetails(!showAccountDetails)}
        >
          <Ionicons name="business-outline" size={16} color="rgba(255,255,255,0.9)" />
          <Text style={styles.toggleText}>Business account</Text>
          <Ionicons 
            name={showAccountDetails ? 'chevron-up' : 'chevron-down'} 
            size={16} 
            color="rgba(255,255,255,0.9)" 
          />
        </TouchableOpacity>

        {showAccountDetails && (
          <View style={styles.accountDetails}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>{businessAccount.bankName}</Text>
              <Text style={styles.detailValue}>{businessAccount.accountName}</Text>
            </View>
            <View style={styles.accountNumberRow}>
              <Text style={styles.accountNum}>{businessAccount.accountNumber}</Text>
              <TouchableOpacity onPress={handleCopyAccount} style={styles.copyBtn}>
                <Ionicons 
                  name={copied ? 'checkmark' : 'copy-outline'} 
                  size={16} 
                  color="rgba(255,255,255,0.9)" 
                />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {/* Horizontal Quick Actions */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.actionsScroll}
        contentContainerStyle={styles.actionsContent}
      >
        <TouchableOpacity 
          style={styles.actionBtn}
          onPress={() => router.push('/(tabs)/ai-chat')}
        >
          <View style={[styles.actionIcon, { backgroundColor: colors.card }]}>
            <Ionicons name="paper-plane" size={20} color={colors.primary} />
          </View>
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>Send</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn}>
          <View style={[styles.actionIcon, { backgroundColor: colors.card }]}>
            <Ionicons name="download-outline" size={20} color={colors.primary} />
          </View>
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>Request</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn}>
          <View style={[styles.actionIcon, { backgroundColor: colors.card }]}>
            <Ionicons name="add-circle-outline" size={20} color={colors.primary} />
          </View>
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>Top up</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionBtn}
          onPress={() => router.push('/(tabs)/ai-chat')}
        >
          <View style={[styles.actionIcon, { backgroundColor: colors.card }]}>
            <Ionicons name="sparkles" size={20} color={colors.primary} />
          </View>
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>AI Pay</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionBtn}
          onPress={() => router.push('/(tabs)/tax')}
        >
          <View style={[styles.actionIcon, { backgroundColor: colors.card }]}>
            <Ionicons name="briefcase-outline" size={20} color={colors.primary} />
          </View>
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>Tax</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn}>
          <View style={[styles.actionIcon, { backgroundColor: colors.card }]}>
            <Ionicons name="receipt-outline" size={20} color={colors.primary} />
          </View>
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>Bills</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Compact Transactions */}
      <View style={styles.transactionsSection}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/transactions')}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
          </TouchableOpacity>
        </View>

        {recentTransactions.map((transaction) => {
          const isPositive = transaction.amount > 0;
          return (
            <TouchableOpacity 
              key={transaction.id} 
              style={[styles.transactionRow, { borderBottomColor: colors.border }]}
              onPress={() => router.push(`/(tabs)/transaction/${transaction.id}`)}
            >
              <View style={styles.transactionLeft}>
                <View style={[styles.txIcon, { backgroundColor: colors.card }]}>
                  <Text style={styles.emoji}>{transaction.icon}</Text>
                </View>
                <View>
                  <Text style={[styles.txName, { color: colors.text }]}>{transaction.description}</Text>
                  <Text style={[styles.txDate, { color: colors.textSecondary }]}>
                    {new Date(transaction.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </Text>
                </View>
              </View>
              <Text style={[styles.txAmount, isPositive ? { color: colors.success } : { color: colors.text }]}>
                {isPositive ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  greeting: {
    fontSize: TYPOGRAPHY.h2,
    fontFamily: TYPOGRAPHY.fontBold,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: SPACING.md,
  },
  balanceCard: {
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.lg,
    padding: SPACING.lg,
    borderRadius: BORDER_RADIUS.md,
    ...SHADOWS.md,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  balanceInfo: {
    flex: 1,
  },
  balanceLabel: {
    fontSize: TYPOGRAPHY.small,
    fontFamily: TYPOGRAPHY.fontMedium,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  balanceAmount: {
    fontSize: 32,
    fontFamily: TYPOGRAPHY.fontBold,
    color: '#FFFFFF',
  },
  accountToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.md,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
    gap: SPACING.xs,
  },
  toggleText: {
    flex: 1,
    fontSize: TYPOGRAPHY.small,
    fontFamily: TYPOGRAPHY.fontMedium,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  accountDetails: {
    marginTop: SPACING.sm,
    paddingTop: SPACING.sm,
    gap: SPACING.xs,
  },
  detailRow: {
    gap: 2,
  },
  detailLabel: {
    fontSize: TYPOGRAPHY.caption,
    fontFamily: TYPOGRAPHY.fontRegular,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  detailValue: {
    fontSize: TYPOGRAPHY.small,
    fontFamily: TYPOGRAPHY.fontMedium,
    color: 'rgba(255, 255, 255, 0.95)',
  },
  accountNumberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
  },
  accountNum: {
    fontSize: TYPOGRAPHY.h3,
    fontFamily: TYPOGRAPHY.fontBold,
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  copyBtn: {
    padding: SPACING.xs,
  },
  actionsScroll: {
    marginBottom: SPACING.lg,
  },
  actionsContent: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.md,
  },
  actionBtn: {
    alignItems: 'center',
    marginRight: SPACING.sm,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  actionText: {
    fontSize: TYPOGRAPHY.caption,
    fontFamily: TYPOGRAPHY.fontMedium,
  },
  transactionsSection: {
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
  },
  seeAll: {
    fontSize: TYPOGRAPHY.small,
    fontFamily: TYPOGRAPHY.fontMedium,
  },
  transactionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
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
    marginBottom: 2,
  },
  txDate: {
    fontSize: TYPOGRAPHY.caption,
    fontFamily: TYPOGRAPHY.fontRegular,
  },
  txAmount: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: TYPOGRAPHY.fontBold,
  },
});
