'use client';
import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Header from '@/components/Header';
import PersonCard from '@/components/PersonCard';
import { friendsApi, Friend } from '@/api/api';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';

// ─── Empty State ──────────────────────────────────────────────
const EmptyState = () => (
  <View style={styles.emptyWrap}>
    <View style={styles.emptyIcon}>
      <Ionicons name="chatbubble-ellipses-outline" size={40} color={Colors.textMuted} />
    </View>
    <Text style={styles.emptyTitle}>No conversations yet</Text>
    <Text style={styles.emptySubtitle}>
      Go to Profile → Find Friends to connect with people
    </Text>
  </View>
);

// ─── Chat List Screen ─────────────────────────────────────────
const ChatListScreen = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadFriends = async () => {
    try {
      const { data } = await friendsApi.getAll();
      setFriends(data);
      setError('');
    } catch (err: any) {
      setError('Failed to load chats');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { loadFriends(); }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadFriends();
  }, []);

  return (
    <SafeAreaProvider style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgPrimary} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <Header />

        {/* Section header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Messages</Text>
          {friends.length > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{friends.length}</Text>
            </View>
          )}
        </View>

        {loading ? (
          <View style={styles.centerWrap}>
            <ActivityIndicator size="large" color={Colors.accent} />
          </View>
        ) : error ? (
          <View style={styles.centerWrap}>
            <Ionicons name="wifi-outline" size={40} color={Colors.textMuted} />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryBtn} onPress={loadFriends}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={friends}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <PersonCard
                id={item.id}
                name={item.name}
                isOnline={item.isOnline}
                LastMessage={item.lastMessage}
                chatId={item.chatId}
                lastMessageTime={item.lastMessageTime}
              />
            )}
            ListEmptyComponent={<EmptyState />}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.accent}
                colors={[Colors.accent]}
              />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={friends.length === 0 ? styles.emptyContainer : undefined}
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ChatListScreen;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  safe: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },

  // ── Section header ─────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.md,
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
  },
  badge: {
    backgroundColor: Colors.accent,
    borderRadius: Radius.full,
    minWidth: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xs,
  },
  badgeText: {
    color: Colors.textInverse,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
  },

  // ── Loading / Error ────────────────────────
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  errorText: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  retryBtn: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xl,
    backgroundColor: Colors.accentDim,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  retryText: {
    color: Colors.accent,
    fontWeight: FontWeight.semibold,
    fontSize: FontSize.sm,
  },

  // ── Empty state ────────────────────────────
  emptyContainer: {
    flexGrow: 1,
  },
  emptyWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing['4xl'],
    gap: Spacing.md,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: Radius.full,
    backgroundColor: Colors.bgElevated,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});