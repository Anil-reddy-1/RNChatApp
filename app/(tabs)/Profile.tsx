import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  SectionList,
  Alert,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/contexts/AuthContext';
import { friendsApi, usersApi, FriendRequest, SearchUser } from '@/api/api';
import { Colors, FontSize, FontWeight, Radius, Spacing, Shadows } from '@/constants/theme';

// ─── Avatar ───────────────────────────────────────────────────
const Avatar: React.FC<{ name: string; size?: number }> = ({ name, size = 48 }) => (
  <View style={[styles.avatarCircle, { width: size, height: size, borderRadius: size / 2 }]}>
    <Text style={[styles.avatarLetter, { fontSize: size * 0.4 }]}>
      {name.charAt(0).toUpperCase()}
    </Text>
  </View>
);

// ─── Search user row ──────────────────────────────────────────
const SearchRow: React.FC<{ user: SearchUser; onAdd: (id: string) => void; added: boolean }> = ({
  user, onAdd, added,
}) => (
  <View style={styles.userRow}>
    <Avatar name={user.name} size={42} />
    <Text style={styles.userName} numberOfLines={1}>{user.name}</Text>
    <TouchableOpacity
      style={[styles.addBtn, added && styles.addBtnDone]}
      onPress={() => !added && onAdd(user._id)}
      activeOpacity={0.75}
      disabled={added}
    >
      <Ionicons name={added ? 'checkmark' : 'person-add-outline'} size={14} color={added ? Colors.success : Colors.accent} />
      <Text style={[styles.addBtnText, added && { color: Colors.success }]}>
        {added ? 'Sent' : 'Add'}
      </Text>
    </TouchableOpacity>
  </View>
);

// ─── Request row ──────────────────────────────────────────────
const RequestRow: React.FC<{
  req: FriendRequest;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}> = ({ req, onAccept, onReject }) => (
  <View style={styles.userRow}>
    <Avatar name={req.name} size={42} />
    <Text style={styles.userName} numberOfLines={1}>{req.name}</Text>
    <View style={styles.reqActions}>
      <TouchableOpacity style={styles.rejectBtn} onPress={() => onReject(req._id)} activeOpacity={0.75}>
        <Ionicons name="close" size={14} color={Colors.error} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.acceptBtn} onPress={() => onAccept(req._id)} activeOpacity={0.75}>
        <Ionicons name="checkmark" size={14} color={Colors.textInverse} />
        <Text style={styles.acceptText}>Accept</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// ─── Profile Screen ───────────────────────────────────────────
const ProfileScreen = () => {
  const Auth = useAuth();
  const userName = Auth?.user?.name ?? 'User';

  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchUser[]>([]);
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [searching, setSearching] = useState(false);
  const [addedIds, setAddedIds] = useState<Set<string>>(new Set());
  const [requestsLoading, setRequestsLoading] = useState(true);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Load friend requests ──────────────────
  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchRequests = async () => {
        try {
          const { data } = await friendsApi.getRequests();
          if (isActive) {
            setRequests(Array.isArray(data) ? data : []);
          }
        } catch (err: any) {
          console.error("Profile requests error:", err?.response?.data || err.message);
        } finally {
          if (isActive) setRequestsLoading(false);
        }
      };
      fetchRequests();

      return () => {
        isActive = false;
      };
    }, [])
  );

  // ── Debounced search ──────────────────────
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const { data } = await usersApi.search(query.trim());
        // Filter out self
        setSearchResults(data.filter(u => u._id !== Auth?.user?.id));
      } catch { /* ignore */ }
      finally { setSearching(false); }
    }, 400);
  }, [query]);

  // ── Add friend ────────────────────────────
  const handleAdd = async (friendId: string) => {
    try {
      await friendsApi.sendRequest(friendId);
      setAddedIds(prev => new Set(prev).add(friendId));
    } catch (e: any) {
      Alert.alert('Error', e?.response?.data?.message ?? 'Could not send request');
    }
  };

  // ── Accept / Reject ───────────────────────
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
    <SafeAreaProvider style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgPrimary} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <FlatList
          data={[]}
          keyExtractor={() => 'dummy'}
          renderItem={null}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <>
              {/* ── My Profile Card ── */}
              <View style={styles.profileCard}>
                <Avatar name={userName} size={76} />
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>{userName}</Text>
                  <View style={styles.onlineBadge}>
                    <View style={styles.onlineDot} />
                    <Text style={styles.onlineLabel}>Active now</Text>
                  </View>
                </View>
              </View>

              {/* ── Find Friends ── */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Find Friends</Text>

                <View style={styles.searchBar}>
                  <Ionicons name="search" size={16} color={Colors.textMuted} />
                  <TextInput
                    style={styles.searchInput}
                    value={query}
                    onChangeText={setQuery}
                    placeholder="Search by username..."
                    placeholderTextColor={Colors.textMuted}
                    autoCapitalize="none"
                    selectionColor={Colors.accent}
                  />
                  {searching && <ActivityIndicator size="small" color={Colors.accent} />}
                  {!!query && !searching && (
                    <TouchableOpacity onPress={() => setQuery('')}>
                      <Ionicons name="close-circle" size={16} color={Colors.textMuted} />
                    </TouchableOpacity>
                  )}
                </View>

                {searchResults.length > 0 && (
                  <View style={styles.resultCard}>
                    {searchResults.map((u, i) => (
                      <View key={u._id}>
                        <SearchRow user={u} onAdd={handleAdd} added={addedIds.has(u._id)} />
                        {i < searchResults.length - 1 && <View style={styles.rowDivider} />}
                      </View>
                    ))}
                  </View>
                )}
                {query.trim().length > 0 && !searching && searchResults.length === 0 && (
                  <View style={styles.emptySearch}>
                    <Ionicons name="person-outline" size={28} color={Colors.textMuted} />
                    <Text style={styles.emptySearchText}>No users found for "{query}"</Text>
                  </View>
                )}
              </View>

              {/* ── Friend Requests ── */}
              {(requestsLoading || requests.length > 0) && (
                <View style={styles.section}>
                  <View style={styles.sectionRow}>
                    <Text style={styles.sectionLabel}>Friend Requests</Text>
                    {requests.length > 0 && (
                      <View style={styles.reqBadge}>
                        <Text style={styles.reqBadgeText}>{requests.length}</Text>
                      </View>
                    )}
                  </View>

                  {requestsLoading ? (
                    <ActivityIndicator color={Colors.accent} style={{ marginTop: Spacing.md }} />
                  ) : (
                    <View style={styles.resultCard}>
                      {requests.map((r, i) => (
                        <View key={r._id}>
                          <RequestRow req={r} onAccept={handleAccept} onReject={handleReject} />
                          {i < requests.length - 1 && <View style={styles.rowDivider} />}
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              )}

              {/* ── Account Settings ── */}
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Settings</Text>
                <View style={styles.resultCard}>
                  <SettingsRow icon="notifications-outline" label="Notifications" />
                  <View style={styles.rowDivider} />
                  <SettingsRow icon="lock-closed-outline" label="Privacy" />
                  <View style={styles.rowDivider} />
                  <SettingsRow icon="help-circle-outline" label="Help & Support" />
                </View>
              </View>

              {/* ── Logout ── */}
              <View style={[styles.section, { marginBottom: Spacing['4xl'] }]}>
                <TouchableOpacity
                  style={styles.logoutBtn}
                  onPress={() => Auth?.logOut()}
                  activeOpacity={0.8}
                >
                  <Ionicons name="log-out-outline" size={18} color={Colors.error} />
                  <Text style={styles.logoutText}>Sign out</Text>
                </TouchableOpacity>
              </View>
            </>
          }
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

// ─── Settings Row ─────────────────────────────────────────────
const SettingsRow: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <TouchableOpacity style={styles.settingsRow} activeOpacity={0.7}>
    <Ionicons name={icon as any} size={18} color={Colors.accent} style={{ marginRight: Spacing.md }} />
    <Text style={styles.settingsLabel}>{label}</Text>
    <Ionicons name="chevron-forward" size={14} color={Colors.textMuted} />
  </TouchableOpacity>
);

export default ProfileScreen;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgPrimary },
  safe: { flex: 1, backgroundColor: Colors.bgPrimary },

  // ── Profile Card ───────────────────────────
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xl,
    padding: Spacing.xxl,
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.xl,
    marginBottom: Spacing.xs,
    backgroundColor: Colors.bgSurface,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  avatarCircle: {
    backgroundColor: Colors.accentDim,
    borderWidth: 2,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.accent,
  },
  avatarLetter: {
    fontWeight: FontWeight.bold,
    color: Colors.accentLight,
  },
  profileInfo: {
    flex: 1,
    gap: Spacing.sm,
  },
  profileName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  onlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    backgroundColor: 'rgba(63,217,119,0.1)',
    paddingVertical: Spacing.xxs,
    paddingHorizontal: Spacing.sm,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(63,217,119,0.25)',
    alignSelf: 'flex-start',
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

  // ── Section ────────────────────────────────
  section: {
    marginHorizontal: Spacing.xl,
    marginTop: Spacing.xxl,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  sectionLabel: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 1.1,
    marginBottom: Spacing.md,
  },

  // ── Search bar ─────────────────────────────
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.bgElevated,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.md,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    fontWeight: FontWeight.medium,
  },

  // ── Result card ────────────────────────────
  resultCard: {
    backgroundColor: Colors.bgSurface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  rowDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginLeft: Spacing.xxl + 42,
  },

  // ── User rows ──────────────────────────────
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    gap: Spacing.md,
  },
  userName: {
    flex: 1,
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
  },

  // ── Add friend button ──────────────────────
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.xs + 2,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.accent,
    backgroundColor: Colors.accentDim,
  },
  addBtnDone: {
    borderColor: Colors.success,
    backgroundColor: 'rgba(63,217,119,0.1)',
  },
  addBtnText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    color: Colors.accent,
  },

  // ── Request buttons ────────────────────────
  reqBadge: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xs,
    marginBottom: Spacing.md,
  },
  reqBadgeText: {
    color: Colors.textInverse,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
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

  // ── Empty search ───────────────────────────
  emptySearch: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxl,
    gap: Spacing.md,
  },
  emptySearchText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // ── Settings ───────────────────────────────
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md + 2,
  },
  settingsLabel: {
    flex: 1,
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
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
});