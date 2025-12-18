import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '../../src/store/store';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../src/styles/theme';
import { Ionicons } from '@expo/vector-icons';

export default function TransactionsScreen() {
  const router = useRouter();
  const { transactions } = useSelector((state: RootState) => state.transaction);
  const [filter, setFilter] = useState<'all' | 'sent' | 'received' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = transactions.filter((t) => {
    const matchesFilter =
      filter === 'all' ||
      (filter === 'sent' && t.amount < 0) ||
      (filter === 'received' && t.amount > 0) ||
      (filter === 'pending' && t.status === 'pending');

    const matchesSearch = t.description
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const groupByDate = () => {
    const groups: { [key: string]: any[] } = {};
    
    filteredTransactions.forEach((transaction) => {
      const date = new Date(transaction.timestamp);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let key: string;
      if (date.toDateString() === today.toDateString()) {
        key = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        key = 'Yesterday';
      } else {
        key = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
        });
      }

      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(transaction);
    });

    return Object.entries(groups).map(([date, items]) => ({
      date,
      data: items,
    }));
  };

  const groupedData = groupByDate();

  const FilterTab = ({ label, value }: { label: string; value: typeof filter }) => (
    <TouchableOpacity
      style={[styles.filterTab, filter === value && styles.filterTabActive]}
      onPress={() => setFilter(value)}
    >
      <Text
        style={[
          styles.filterTabText,
          filter === value && styles.filterTabTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const TransactionItem = ({ item }: { item: any }) => {
    const isPositive = item.amount > 0;

    return (
      <TouchableOpacity
        style={styles.transactionItem}
        onPress={() => router.push(`/(tabs)/transaction/${item.id}`)}
      >
        <View style={styles.transactionIcon}>
          <Text style={styles.transactionEmoji}>{item.icon}</Text>
        </View>

        <View style={styles.transactionContent}>
          <Text style={styles.transactionName}>{item.description}</Text>
          <Text style={styles.transactionCategory}>{item.category}</Text>
        </View>

        <View style={styles.transactionRight}>
          <Text
            style={[
              styles.transactionAmount,
              isPositive ? styles.amountPositive : styles.amountNegative,
            ]}
          >
            {isPositive ? '+' : ''}${Math.abs(item.amount).toFixed(2)}
          </Text>
          <Text style={styles.transactionTime}>
            {new Date(item.timestamp).toLocaleTimeString('en-US', {
              hour: 'numeric',
              minute: '2-digit',
            })}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Transactions</Text>
        <TouchableOpacity style={styles.searchButton}>
          <Ionicons name="search-outline" size={24} color={COLORS.black} />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <FilterTab label="All" value="all" />
        <FilterTab label="Sent" value="sent" />
        <FilterTab label="Received" value="received" />
        <FilterTab label="Pending" value="pending" />
      </View>

      {/* Transactions List */}
      <FlatList
        data={groupedData}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <View style={styles.section}>
            <Text style={styles.sectionDate}>{item.date}</Text>
            {item.data.map((transaction: any) => (
              <TransactionItem key={transaction.id} item={transaction} />
            ))}
          </View>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={64} color={COLORS.mediumGray} />
            <Text style={styles.emptyText}>No transactions found</Text>
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
    paddingHorizontal: SPACING.xl,
    paddingTop: 60,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.h2,
    fontWeight: '700',
    color: COLORS.black,
  },
  searchButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtersContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.xl,
    marginBottom: SPACING.md,
    gap: SPACING.sm,
  },
  filterTab: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.lightGray,
  },
  filterTabActive: {
    backgroundColor: COLORS.primary,
  },
  filterTabText: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: '600',
    color: COLORS.mediumGray,
  },
  filterTabTextActive: {
    color: COLORS.white,
  },
  listContent: {
    paddingHorizontal: SPACING.xl,
    paddingBottom: 100,
  },
  section: {
    marginBottom: SPACING.lg,
  },
  sectionDate: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: '600',
    color: COLORS.mediumGray,
    marginBottom: SPACING.sm,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    marginBottom: SPACING.xs,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
  },
  transactionIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  transactionEmoji: {
    fontSize: 22,
  },
  transactionContent: {
    flex: 1,
  },
  transactionName: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.black,
    marginBottom: 2,
  },
  transactionCategory: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.mediumGray,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: '700',
    marginBottom: 2,
  },
  amountPositive: {
    color: COLORS.success,
  },
  amountNegative: {
    color: COLORS.error,
  },
  transactionTime: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.mediumGray,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.xxl * 2,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.body,
    color: COLORS.mediumGray,
    marginTop: SPACING.md,
  },
});
