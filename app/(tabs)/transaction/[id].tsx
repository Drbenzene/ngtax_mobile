import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Share,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSelector } from 'react-redux';
import { RootState } from '../../../src/store/store';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../../src/styles/theme';
import { Ionicons } from '@expo/vector-icons';

export default function TransactionDetailScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = typeof params.id === 'string' ? params.id : params.id?.[0];
  const { transactions } = useSelector((state: RootState) => state.transaction);
  
  const transaction = transactions.find(t => t.id === id);

  if (!transaction) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.black} />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Transaction not found</Text>
        </View>
      </View>
    );
  }

  const isPositive = transaction.amount > 0;
  const statusColor = transaction.status === 'completed' ? COLORS.success : 
                     transaction.status === 'pending' ? COLORS.warning : COLORS.error;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `${transaction.description}\n${isPositive ? '+' : ''}$${Math.abs(transaction.amount).toFixed(2)}\n${new Date(transaction.timestamp).toLocaleDateString()}`,
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Minimal Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="close" size={28} color={COLORS.black} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color={COLORS.black} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.iconContainer}>
            <Text style={styles.heroEmoji}>{transaction.icon}</Text>
          </View>
          
          <Text style={styles.merchantName}>{transaction.description}</Text>
          
          <Text style={[styles.heroAmount, isPositive ? styles.positive : styles.negative]}>
            {isPositive ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
          </Text>

          <View style={[styles.statusPill, { backgroundColor: statusColor + '15' }]}>
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
            <Text style={[styles.statusLabel, { color: statusColor }]}>
              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </Text>
          </View>
        </View>

        {/* Info Grid */}
        <View style={styles.infoGrid}>
          <InfoItem 
            icon="calendar-outline"
            label="Date"
            value={new Date(transaction.timestamp).toLocaleDateString('en-US', { 
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          />
          <InfoItem 
            icon="time-outline"
            label="Time"
            value={new Date(transaction.timestamp).toLocaleTimeString('en-US', { 
              hour: '2-digit',
              minute: '2-digit'
            })}
          />
          <InfoItem 
            icon="pricetag-outline"
            label="Category"
            value={transaction.category}
          />
          <InfoItem 
            icon="swap-horizontal-outline"
            label="Type"
            value={isPositive ? 'Money in' : 'Money out'}
          />
        </View>

        {/* Details Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Details</Text>
          
          <View style={styles.detailsCard}>
            <DetailRow label="Reference" value={`TXN${transaction.id.slice(0, 8).toUpperCase()}`} />
            <DetailRow label="From" value={isPositive ? transaction.description : 'Current account'} />
            <DetailRow label="To" value={isPositive ? 'Current account' : transaction.description} />
            <DetailRow label="Account" value="•••• 6789" showBorder={false} />
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.actionBtn}>
            <Ionicons name="download-outline" size={22} color={COLORS.black} />
            <Text style={styles.actionBtnText}>Download receipt</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionBtn, styles.actionBtnDanger]}>
            <Ionicons name="flag-outline" size={22} color={COLORS.error} />
            <Text style={[styles.actionBtnText, { color: COLORS.error }]}>Report issue</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

const InfoItem = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View style={styles.infoItem}>
    <Ionicons name={icon as any} size={20} color={COLORS.mediumGray} />
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const DetailRow = ({ label, value, showBorder = true }: { label: string; value: string; showBorder?: boolean }) => (
  <View style={[styles.detailRow, !showBorder && styles.detailRowNoBorder]}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

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
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: -12,
  },
  shareButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -12,
  },
  content: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  heroEmoji: {
    fontSize: 40,
  },
  merchantName: {
    fontSize: TYPOGRAPHY.h2,
    fontFamily: TYPOGRAPHY.fontBold,
    color: COLORS.black,
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  heroAmount: {
    fontSize: 48,
    fontFamily: TYPOGRAPHY.fontBold,
    marginBottom: SPACING.md,
  },
  positive: {
    color: COLORS.success,
  },
  negative: {
    color: COLORS.black,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    gap: SPACING.xs,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusLabel: {
    fontSize: TYPOGRAPHY.small,
    fontFamily: TYPOGRAPHY.fontSemiBold,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
    gap: SPACING.sm,
  },
  infoItem: {
    width: '48%',
    backgroundColor: COLORS.lightGray,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.md,
    gap: 4,
  },
  infoLabel: {
    fontSize: TYPOGRAPHY.caption,
    fontFamily: TYPOGRAPHY.fontMedium,
    color: COLORS.mediumGray,
  },
  infoValue: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: TYPOGRAPHY.fontSemiBold,
    color: COLORS.black,
  },
  section: {
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.h3,
    fontFamily: TYPOGRAPHY.fontBold,
    color: COLORS.black,
    marginBottom: SPACING.md,
  },
  detailsCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    overflow: 'hidden',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGray,
  },
  detailRowNoBorder: {
    borderBottomWidth: 0,
  },
  detailLabel: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: TYPOGRAPHY.fontRegular,
    color: COLORS.mediumGray,
  },
  detailValue: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: TYPOGRAPHY.fontSemiBold,
    color: COLORS.black,
  },
  actionsSection: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.lg,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    gap: SPACING.sm,
  },
  actionBtnDanger: {
    borderColor: COLORS.error + '30',
    backgroundColor: COLORS.error + '05',
  },
  actionBtnText: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: TYPOGRAPHY.fontSemiBold,
    color: COLORS.black,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: TYPOGRAPHY.body,
    fontFamily: TYPOGRAPHY.fontMedium,
    color: COLORS.mediumGray,
  },
});
