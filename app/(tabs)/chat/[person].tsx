import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { usePerson } from '@/contexts/PersonContext';
import { useAuth } from '@/contexts/AuthContext';
import { messagesApi, Message } from '@/api/api';
import { connectSocket, getSocket } from '@/api/socket';
import { Colors, FontSize, FontWeight, Radius, Spacing, Shadows } from '@/constants/theme';

// ─── Format timestamp ─────────────────────────────────────────
function formatMsgTime(iso?: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
}

// ─── Message Bubble ───────────────────────────────────────────
interface BubbleProps {
  msg: Message;
  isMine: boolean;
}

const Bubble: React.FC<BubbleProps> = React.memo(({ msg, isMine }) => (
  <View style={[styles.bubbleWrap, isMine ? styles.bubbleWrapRight : styles.bubbleWrapLeft]}>
    <View style={[
      styles.bubble,
      isMine ? styles.bubbleSent : styles.bubbleRcv,
    ]}>
      <Text style={[styles.bubbleText, isMine ? styles.bubbleTextSent : styles.bubbleTextRcv]}>
        {msg.msg}
      </Text>
      <Text style={[styles.bubbleTime, isMine ? styles.bubbleTimeSent : styles.bubbleTimeRcv]}>
        {formatMsgTime(msg.time || msg.createdAt)}
      </Text>
    </View>
  </View>
));

// ─── Chat Header ──────────────────────────────────────────────
interface ChatHeaderProps {
  name: string;
  isOnline: boolean;
  onBack: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ name, isOnline, onBack }) => (
  <View style={styles.chatHeader}>
    <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
      <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
    </TouchableOpacity>

    <View style={styles.chatAvatarWrap}>
      <View style={styles.chatAvatar}>
        <Text style={styles.chatAvatarLetter}>{name.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={[styles.chatOnlineDot, { backgroundColor: isOnline ? Colors.online : Colors.textMuted }]} />
    </View>

    <View style={styles.chatTitleWrap}>
      <Text style={styles.chatTitle} numberOfLines={1}>{name}</Text>
      <Text style={[styles.chatStatus, { color: isOnline ? Colors.online : Colors.textMuted }]}>
        {isOnline ? 'Online' : 'Offline'}
      </Text>
    </View>

    <View style={styles.chatActions}>
      <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
        <Ionicons name="call-outline" size={20} color={Colors.textSecondary} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
        <Ionicons name="ellipsis-vertical" size={20} color={Colors.textSecondary} />
      </TouchableOpacity>
    </View>
  </View>
);

// ─── Main Chat Screen ─────────────────────────────────────────
const ChatScreen = () => {
  const { person } = useLocalSearchParams<{ person: string }>();
  const PersonCtx = usePerson();
  const Auth = useAuth();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const flatRef = useRef<FlatList>(null);

  const chatId = PersonCtx.person?.chatId ?? '';
  const myId = Auth?.user?.id ?? '';
  const personName = PersonCtx.person?.name ?? 'Chat';
  const isOnline = PersonCtx.person?.isOnline ?? false;

  // ── Load history ──────────────────────────
  useEffect(() => {
    if (!chatId) return;
    (async () => {
      try {
        const { data } = await messagesApi.getHistory(chatId);
        setMessages(data);
      } catch { /* show empty */ }
      finally { setLoading(false); }
    })();
  }, [chatId]);

  // ── Socket setup ──────────────────────────
  useEffect(() => {
    if (!chatId) return;
    let mounted = true;

    (async () => {
      const socket = getSocket() ?? await connectSocket();

      socket.emit('joinRoom', chatId);

      socket.on('message', (msg: Message) => {
        if (mounted) {
          setMessages(prev => {
            // Find an optimistic message that matches this real message
            const optIndex = prev.findIndex(p => p.sender === msg.sender && p.msg === msg.msg && p._id.startsWith('opt-'));
            
            if (optIndex !== -1) {
              // Replace optimistic message with the real one from server
              const next = [...prev];
              next[optIndex] = msg;
              return next;
            }
            
            // Fallback: prevent duplicates if we already have this exact ID
            if (prev.some(p => p._id === msg._id)) return prev;

            return [...prev, msg];
          });
        }
      });

      return () => {
        mounted = false;
        socket.off('message');
      };
    })();
  }, [chatId]);

  // ── Auto scroll to bottom ─────────────────
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => flatRef.current?.scrollToEnd({ animated: true }), 80);
    }
  }, [messages]);

  // ── Send ──────────────────────────────────
  const handleSend = useCallback(async () => {
    const text = inputText.trim();
    if (!text || !chatId) return;

    setInputText('');
    setSending(true);

    const now = new Date().toISOString();
    const socket = getSocket();

    // Optimistic message
    const optimistic: Message = {
      _id: `opt-${Date.now()}`,
      chatId,
      msg: text,
      sender: myId,
      time: now,
    };
    setMessages(prev => [...prev, optimistic]);

    try {
      if (socket?.connected) {
        socket.emit('sendMessage', { chatId, msg: text, sender: myId, time: now });
      } else {
        await messagesApi.send({ chatId, msg: text, sender: myId, time: now });
      }
    } catch { /* message already shown optimistically */ }
    finally { setSending(false); }
  }, [inputText, chatId, myId]);

  const renderItem = useCallback(({ item }: { item: Message }) => (
    <Bubble msg={item} isMine={item.sender === myId} />
  ), [myId]);

  return (
    <SafeAreaProvider style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgPrimary} />
      <SafeAreaView style={styles.safe} edges={['top']}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={0}
        >
          {/* Header */}
          <ChatHeader name={personName} isOnline={isOnline} onBack={() => router.back()} />

          {/* Messages */}
          {loading ? (
            <View style={styles.centerWrap}>
              <ActivityIndicator size="large" color={Colors.accent} />
            </View>
          ) : (
            <FlatList
              ref={flatRef}
              data={messages}
              keyExtractor={(item) => item._id}
              renderItem={renderItem}
              contentContainerStyle={styles.messageList}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                <View style={styles.emptyMsg}>
                  <Ionicons name="chatbubble-outline" size={36} color={Colors.textMuted} />
                  <Text style={styles.emptyMsgText}>Say hello 👋</Text>
                </View>
              }
            />
          )}

          {/* Input bar */}
          <View style={styles.inputBar}>
            <View style={styles.inputWrap}>
              <TextInput
                style={styles.textInput}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Message..."
                placeholderTextColor={Colors.textMuted}
                multiline
                maxLength={1000}
                selectionColor={Colors.accent}
              />
            </View>
            <TouchableOpacity
              style={[styles.sendBtn, (!inputText.trim() || sending) && styles.sendBtnDisabled]}
              onPress={handleSend}
              activeOpacity={0.8}
              disabled={!inputText.trim() || sending}
            >
              {sending ? (
                <ActivityIndicator size="small" color={Colors.textInverse} />
              ) : (
                <Ionicons name="send" size={18} color={Colors.textInverse} />
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ChatScreen;

const AVATAR_SIZE = 40;

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.bgPrimary },
  safe: { flex: 1, backgroundColor: Colors.bgPrimary },
  flex: { flex: 1 },

  // ── Chat header ────────────────────────────
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    backgroundColor: Colors.bgSurface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    gap: Spacing.sm,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
  },
  chatAvatarWrap: {
    position: 'relative',
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
  },
  chatAvatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: Radius.full,
    backgroundColor: Colors.accentDim,
    borderWidth: 1.5,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatAvatarLetter: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
    color: Colors.accentLight,
  },
  chatOnlineDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 11,
    height: 11,
    borderRadius: Radius.full,
    borderWidth: 2,
    borderColor: Colors.bgSurface,
  },
  chatTitleWrap: {
    flex: 1,
  },
  chatTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.textPrimary,
  },
  chatStatus: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    marginTop: 1,
  },
  chatActions: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  iconBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: Radius.full,
    backgroundColor: Colors.bgElevated,
  },

  // ── Message list ───────────────────────────
  messageList: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
    gap: Spacing.xs,
  },
  centerWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyMsg: {
    flex: 1,
    minHeight: 200,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
  },
  emptyMsgText: {
    fontSize: FontSize.base,
    color: Colors.textSecondary,
  },

  // ── Bubbles ────────────────────────────────
  bubbleWrap: {
    flexDirection: 'row',
    marginVertical: 2,
  },
  bubbleWrapRight: { justifyContent: 'flex-end' },
  bubbleWrapLeft:  { justifyContent: 'flex-start' },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    gap: Spacing.xxs,
  },
  bubbleSent: {
    backgroundColor: Colors.sentBg,
    borderRadius: Radius.lg,
    borderBottomRightRadius: Radius.xs,
    ...Shadows.accent,
  },
  bubbleRcv: {
    backgroundColor: Colors.rcvBg,
    borderRadius: Radius.lg,
    borderBottomLeftRadius: Radius.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bubbleText: {
    fontSize: FontSize.base,
    lineHeight: 22,
  },
  bubbleTextSent: {
    color: Colors.sentText,
    fontWeight: FontWeight.medium,
  },
  bubbleTextRcv: {
    color: Colors.rcvText,
    fontWeight: FontWeight.regular,
  },
  bubbleTime: {
    fontSize: FontSize.xs,
    alignSelf: 'flex-end',
  },
  bubbleTimeSent: { color: 'rgba(255,255,255,0.55)' },
  bubbleTimeRcv:  { color: Colors.textMuted },

  // ── Input bar ──────────────────────────────
  inputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingBottom: Platform.OS === 'android' ? Spacing.lg : Spacing.md,
    gap: Spacing.md,
    backgroundColor: Colors.bgSurface,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  inputWrap: {
    flex: 1,
    backgroundColor: Colors.bgElevated,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Platform.OS === 'ios' ? Spacing.md : Spacing.sm,
    minHeight: 44,
    justifyContent: 'center',
  },
  textInput: {
    fontSize: FontSize.base,
    color: Colors.textPrimary,
    maxHeight: 120,
    fontWeight: FontWeight.regular,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.accent,
  },
  sendBtnDisabled: {
    opacity: 0.4,
  },
});