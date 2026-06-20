import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
  StatusBar,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { friendsApi, FriendRequest } from '@/api/api';
import { Colors, FontSize, FontWeight, Radius, Spacing, Shadows } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';

// ─── Avatar component shared ──────────────────────────────────
const ProfileAvatar: React.FC<{ name?: string; size?: number }> = ({ name = '?', size = 38 }) => (
  <View style={[styles.avatarCircle, { width: size, height: size, borderRadius: size / 2 }]}>
    <Text style={[styles.avatarLetter, { fontSize: size * 0.42 }]}>
      {name.charAt(0).toUpperCase()}
    </Text>
  </View>
);

// ─── Header ───────────────────────────────────────────────────
const Header = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);

  const Auth = useAuth();
  const userName = Auth?.user?.name ?? '';

  React.useEffect(() => {
    const loadRequests = async () => {
      try {
        const { data } = await friendsApi.getRequests();
        setRequests(data);
      } catch { /* ignore */ }
      finally { setRequestsLoading(false); }
    };
    loadRequests();
  }, []);

  const handleAccept = async (friendId: string) => {
    try {
      await friendsApi.accept(friendId);
      setRequests(prev => prev.filter(r => r._id !== friendId));
    } catch { /* ignore */ }
  };

  const handleReject = async (friendId: string) => {
    try {
      await friendsApi.reject(friendId);
      setRequests(prev => prev.filter(r => r._id !== friendId));
    } catch { /* ignore */ }
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgPrimary} />
      <View style={styles.header}>
        {/* Left: App wordmark */}
        <View style={styles.wordmark}>
          <Text style={styles.wordmarkDot}>💬</Text>
          <Text style={styles.wordmarkText}>Chats</Text>
        </View>

        {/* Right: Notifications & Avatar */}
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.bellBtn}
            onPress={() => setNotificationsOpen(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="notifications-outline" size={24} color={Colors.textPrimary} />
            {requests.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{requests.length}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.avatarBtn}
            onPress={() => setProfileOpen(true)}
            activeOpacity={0.75}
          >
            <ProfileAvatar name={userName} size={38} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Profile Modal ─────────────────────────── */}
      <Modal
        visible={profileOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setProfileOpen(false)}
      >
        <KeyboardAvoidingView
          style={styles.modalRoot}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.modalScroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Handle bar */}
            <View style={styles.handleBar} />

            {/* Close button */}
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setProfileOpen(false)}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>

            {/* Big avatar */}
            <View style={styles.modalAvatarWrap}>
              <ProfileAvatar name={userName} size={96} />
              <View style={styles.onlineBadge}>
                <View style={styles.onlineDot} />
                <Text style={styles.onlineLabel}>Online</Text>
              </View>
            </View>

            {/* Display name */}
            <Text style={styles.modalName}>{userName || 'User'}</Text>
            <Text style={styles.modalSub}>Tap avatar to change photo</Text>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Section: Account */}
            <Text style={styles.sectionTitle}>Account</Text>

            <View style={styles.settingsCard}>
              <SettingsRow icon="person-outline" label="Display name" value={userName} />
              <View style={styles.rowDivider} />
              <SettingsRow icon="notifications-outline" label="Notifications" value="On" />
              <View style={styles.rowDivider} />
              <SettingsRow icon="lock-closed-outline" label="Privacy" value="Friends only" />
            </View>

            {/* Logout */}
            <TouchableOpacity
              style={styles.logoutBtn}
              onPress={() => {
                setProfileOpen(false);
                setTimeout(() => Auth?.logOut(), 200);
              }}
              activeOpacity={0.8}
            >
              <Ionicons name="log-out-outline" size={18} color={Colors.error} />
              <Text style={styles.logoutText}>Sign out</Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      {/* ── Notifications Modal ───────────────────────── */}
      <Modal
        visible={notificationsOpen}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setNotificationsOpen(false)}
      >
        <View style={styles.modalRoot}>
          {/* Handle bar */}
          <View style={[styles.handleBar, { marginTop: Spacing.xl }]} />

          <View style={styles.notificationsHeader}>
            <Text style={styles.notificationsTitle}>Notifications</Text>
            <TouchableOpacity onPress={() => setNotificationsOpen(false)}>
              <Ionicons name="close-circle-outline" size={28} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {requestsLoading ? (
            <ActivityIndicator style={{ marginTop: Spacing.xl }} color={Colors.accent} />
          ) : requests.length === 0 ? (
            <View style={styles.emptyNotifications}>
              <Ionicons name="notifications-off-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyText}>No new notifications</Text>
            </View>
          ) : (
            <ScrollView contentContainerStyle={{ padding: Spacing.xl }}>
              <Text style={styles.sectionTitle}>Friend Requests</Text>
              <View style={styles.settingsCard}>
                {requests.map((r, i) => (
                  <View key={r._id}>
                    <View style={styles.requestRow}>
                      <ProfileAvatar name={r.name} size={42} />
                      <Text style={styles.requestName} numberOfLines={1}>{r.name}</Text>
                      <View style={styles.reqActions}>
                        <TouchableOpacity style={styles.rejectBtn} onPress={() => handleReject(r._id)}>
                          <Ionicons name="close" size={14} color={Colors.error} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.acceptBtn} onPress={() => handleAccept(r._id)}>
                          <Ionicons name="checkmark" size={14} color={Colors.textInverse} />
                          <Text style={styles.acceptText}>Accept</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                    {i < requests.length - 1 && <View style={styles.rowDivider} />}
                  </View>
                ))}
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>
    </>
  );
};

// ─── Settings Row ─────────────────────────────────────────────
const SettingsRow: React.FC<{ icon: string; label: string; value: string }> = ({ icon, label, value }) => (
  <View style={styles.settingsRow}>
    <View style={styles.settingsLeft}>
      <Ionicons name={icon as any} size={18} color={Colors.accent} style={{ marginRight: Spacing.md }} />
      <Text style={styles.settingsLabel}>{label}</Text>
    </View>
    <Text style={styles.settingsValue}>{value}</Text>
    <Ionicons name="chevron-forward" size={14} color={Colors.textMuted} style={{ marginLeft: Spacing.xs }} />
  </View>
);

export default Header;

const styles = StyleSheet.create({
  // ── App Header ─────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.bgPrimary,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  wordmark: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  wordmarkDot: {
    fontSize: 22,
  },
  wordmarkText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    letterSpacing: 0.2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  bellBtn: {
    padding: Spacing.xs,
    position: 'relative',
    marginRight: Spacing.xs,
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: Colors.error,
    borderRadius: Radius.full,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.bgPrimary,
  },
  badgeText: {
    color: Colors.textInverse,
    fontSize: 9,
    fontWeight: FontWeight.bold,
  },
  avatarBtn: {
    padding: Spacing.xs,
  },
  avatarCircle: {
    backgroundColor: Colors.accentDim,
    borderWidth: 1.5,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.accent,
  },
  avatarLetter: {
    fontWeight: FontWeight.bold,
    color: Colors.accentLight,
  },

  // ── Modal ──────────────────────────────────
  modalRoot: {
    flex: 1,
    backgroundColor: Colors.bgSurface,
  },
  modalScroll: {
    padding: Spacing.xxl,
    paddingBottom: Spacing['4xl'],
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: Radius.full,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginBottom: Spacing.xl,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    backgroundColor: Colors.bgElevated,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
    marginBottom: Spacing.xxl,
  },
  modalAvatarWrap: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: Spacing.md,
    backgroundColor: 'rgba(63,217,119,0.12)',
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(63,217,119,0.3)',
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: Radius.full,
    backgroundColor: Colors.online,
  },
  onlineLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.online,
  },
  modalName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  modalSub: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginBottom: Spacing.xxl,
  },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.md,
  },
  settingsCard: {
    backgroundColor: Colors.bgElevated,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xxl,
    overflow: 'hidden',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md + 2,
  },
  settingsLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingsLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },
  settingsValue: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  rowDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginLeft: Spacing.lg + 18 + Spacing.md,
  },

  // ── Logout ─────────────────────────────────
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.md + 2,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: 'rgba(255,94,126,0.35)',
    backgroundColor: 'rgba(255,94,126,0.07)',
  },
  logoutText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.error,
  },

  // ── Notifications ──────────────────────────
  notificationsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  notificationsTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  emptyNotifications: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    paddingBottom: 100,
  },
  emptyText: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },
  requestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  requestName: {
    flex: 1,
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },
  reqActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    alignItems: 'center',
  },
  rejectBtn: {
    width: 32,
    height: 32,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,94,126,0.4)',
    backgroundColor: 'rgba(255,94,126,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xxs,
    paddingVertical: Spacing.xs + 1,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    backgroundColor: Colors.accent,
    ...Shadows.accent,
  },
  acceptText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textInverse,
  },
});