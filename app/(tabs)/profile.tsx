import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../src/store/store';
import { logout } from '../../src/store/slices/authSlice';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../src/styles/theme';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/(auth)');
  };

  const MenuItem = ({
    icon,
    label,
    onPress,
    showArrow = true,
  }: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    onPress: () => void;
    showArrow?: boolean;
  }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuIcon}>
        <Ionicons name={icon} size={22} color={COLORS.primary} />
      </View>
      <Text style={styles.menuLabel}>{label}</Text>
      {showArrow && (
        <Ionicons name="chevron-forward" size={20} color={COLORS.mediumGray} />
      )}
    </TouchableOpacity>
  );

  const MenuSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.menuSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>{children}</View>
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Profile Info */}
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color={COLORS.white} />
        </View>

        <Text style={styles.userName}>{user?.fullName || 'User'}</Text>
        <Text style={styles.userEmail}>{user?.email || ''}</Text>
        <Text style={styles.userPhone}>{user?.phone || ''}</Text>

        <TouchableOpacity style={styles.editButton}>
          <Ionicons name="create-outline" size={18} color={COLORS.primary} />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Menu Sections */}
      <MenuSection title="Account">
        <MenuItem
          icon="shield-checkmark-outline"
          label="Security"
          onPress={() => {}}
        />
        <MenuItem
          icon="notifications-outline"
          label="Notifications"
          onPress={() => {}}
        />
        <MenuItem icon="globe-outline" label="Language" onPress={() => {}} />
      </MenuSection>

      <MenuSection title="Preferences">
        <MenuItem
          icon="chatbubbles-outline"
          label="AI Settings"
          onPress={() => {}}
        />
        <MenuItem
          icon="lock-closed-outline"
          label="Permissions"
          onPress={() => {}}
        />
      </MenuSection>

      <MenuSection title="Support">
        <MenuItem
          icon="help-circle-outline"
          label="Help Center"
          onPress={() => {}}
        />
        <MenuItem
          icon="mail-outline"
          label="Contact Us"
          onPress={() => {}}
        />
      </MenuSection>

      <MenuSection title="Legal">
        <MenuItem
          icon="document-text-outline"
          label="Terms of Use"
          onPress={() => {}}
        />
        <MenuItem
          icon="lock-closed-outline"
          label="Privacy Policy"
          onPress={() => {}}
        />
      </MenuSection>

      {/* Logout Button */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color={COLORS.error} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>

      {/* Version */}
      <Text style={styles.version}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    paddingHorizontal: SPACING.xl,
    paddingTop: 60,
    paddingBottom: SPACING.md,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.h2,
    fontWeight: '700',
    color: COLORS.black,
  },
  profileCard: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    marginHorizontal: SPACING.xl,
    marginBottom: SPACING.lg,
    backgroundColor: COLORS.lightGray,
    borderRadius: BORDER_RADIUS.lg,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  userName: {
    fontSize: TYPOGRAPHY.h3,
    fontWeight: '700',
    color: COLORS.black,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.mediumGray,
    marginBottom: 2,
  },
  userPhone: {
    fontSize: TYPOGRAPHY.small,
    color: COLORS.mediumGray,
    marginBottom: SPACING.md,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  editButtonText: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: '600',
    color: COLORS.primary,
    marginLeft: SPACING.xs,
  },
  menuSection: {
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.small,
    fontWeight: '600',
    color: COLORS.mediumGray,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.xl,
  },
  sectionContent: {
    marginHorizontal: SPACING.xl,
    backgroundColor: COLORS.lightGray,
    borderRadius: BORDER_RADIUS.md,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    backgroundColor: COLORS.white,
    marginBottom: 1,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  menuLabel: {
    flex: 1,
    fontSize: TYPOGRAPHY.body,
    color: COLORS.black,
    fontWeight: '500',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: SPACING.xl,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    borderWidth: 1,
    borderColor: COLORS.error,
    marginTop: SPACING.lg,
  },
  logoutText: {
    fontSize: TYPOGRAPHY.body,
    fontWeight: '600',
    color: COLORS.error,
    marginLeft: SPACING.sm,
  },
  version: {
    fontSize: TYPOGRAPHY.caption,
    color: COLORS.mediumGray,
    textAlign: 'center',
    marginTop: SPACING.lg,
    marginBottom: 100,
  },
});
