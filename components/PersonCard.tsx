import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageSourcePropType,
} from 'react-native';
import { useRouter } from 'expo-router';
import { usePerson } from '@/contexts/PersonContext';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '@/constants/theme';

export type PersonCardProps = {
  id: string;
  name: string;
  imgsrc?: ImageSourcePropType;
  isOnline: boolean;
  LastMessage?: string;
  chatId: string;
  lastMessageTime?: string;
};

// ── Avatar with online dot ────────────────────────────────────
const Avatar: React.FC<{ name: string; imgsrc?: ImageSourcePropType; isOnline: boolean }> = ({
  name, imgsrc, isOnline,
}) => (
  <View style={styles.avatarWrap}>
    {imgsrc ? (
      <Image source={imgsrc} style={styles.avatarImg} />
    ) : (
      <View style={styles.avatarFallback}>
        <Text style={styles.avatarInitial}>{name.charAt(0).toUpperCase()}</Text>
      </View>
    )}
    <View style={[styles.onlineDot, isOnline ? styles.dotOnline : styles.dotOffline]} />
  </View>
);

// ── Time formatter ────────────────────────────────────────────
function formatTime(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'now';
  if (diffMins < 60) return `${diffMins}m`;
  const diffH = Math.floor(diffMins / 60);
  if (diffH < 24) return `${diffH}h`;
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

// ── PersonCard ────────────────────────────────────────────────
const PersonCard: React.FC<PersonCardProps> = (props) => {
  const router = useRouter();
  const personContext = usePerson();

  const handlePress = () => {
    personContext.setPerson({
      id: props.id,
      name: props.name,
      imgsrc: props.imgsrc,
      isOnline: props.isOnline,
      LastMessage: props.LastMessage ?? '',
      chatId: props.chatId,
    });
    router.push(`/chat/${props.id}` as any);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Avatar name={props.name} imgsrc={props.imgsrc} isOnline={props.isOnline} />

      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={1}>{props.name}</Text>
          <Text style={styles.time}>{formatTime(props.lastMessageTime)}</Text>
        </View>
        <Text style={styles.lastMsg} numberOfLines={1}>
          {props.LastMessage ?? 'No messages yet'}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default PersonCard;

const AVATAR_SIZE = 52;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    gap: Spacing.md,
  },

  // ── Avatar ─────────────────────────────────
  avatarWrap: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    position: 'relative',
  },
  avatarImg: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: Radius.full,
  },
  avatarFallback: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: Radius.full,
    backgroundColor: Colors.accentDim,
    borderWidth: 1,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.accentLight,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 13,
    height: 13,
    borderRadius: Radius.full,
    borderWidth: 2.5,
    borderColor: Colors.bgPrimary,
  },
  dotOnline:  { backgroundColor: Colors.online },
  dotOffline: { backgroundColor: Colors.textMuted },

  // ── Content ────────────────────────────────
  content: {
    flex: 1,
    gap: Spacing.xxs + 1,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    flex: 1,
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
    marginRight: Spacing.sm,
  },
  time: {
    fontSize: FontSize.xs,
    color: Colors.textSecondary,
    fontWeight: FontWeight.medium,
  },
  lastMsg: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: FontWeight.regular,
  },
});