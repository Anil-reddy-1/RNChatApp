import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Animated,
  StatusBar,
} from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { usersApi } from '@/api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, FontSize, FontWeight, Radius, Spacing, Shadows } from '@/constants/theme';

// ─── Floating Label Input ─────────────────────────────────────
interface FloatInputProps {
  label: string;
  value: string;
  onChangeText: (t: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address';
  autoCapitalize?: 'none' | 'sentences';
}

const FloatInput: React.FC<FloatInputProps> = ({
  label, value, onChangeText, secureTextEntry, keyboardType, autoCapitalize,
}) => {
  const [focused, setFocused] = useState(false);
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  const handleFocus = () => {
    setFocused(true);
    Animated.timing(anim, { toValue: 1, duration: 180, useNativeDriver: false }).start();
  };
  const handleBlur = () => {
    setFocused(false);
    if (!value) {
      Animated.timing(anim, { toValue: 0, duration: 180, useNativeDriver: false }).start();
    }
  };

  const labelTop = anim.interpolate({ inputRange: [0, 1], outputRange: [16, 6] });
  const labelSize = anim.interpolate({ inputRange: [0, 1], outputRange: [FontSize.base, FontSize.xs] });
  const labelColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.textMuted, focused ? Colors.accent : Colors.textSecondary],
  });

  return (
    <View style={[styles.inputWrap, focused && styles.inputWrapFocused]}>
      <Animated.Text style={[styles.floatLabel, { top: labelTop, fontSize: labelSize, color: labelColor }]}>
        {label}
      </Animated.Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType ?? 'default'}
        autoCapitalize={autoCapitalize ?? 'sentences'}
        placeholderTextColor={Colors.textMuted}
        selectionColor={Colors.accent}
      />
    </View>
  );
};

// ─── Main Login Component ─────────────────────────────────────
const Login = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const context = useAuth();

  async function handleSubmit() {
    setError('');

    if (name.trim().length < 5) {
      setError('Username must be at least 5 characters');
      return;
    }
    if (!email.includes('@')) {
      setError('Enter a valid email address');
      return;
    }
    if (password.trim().length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    try {
      const { data } = await usersApi.loginOrRegister({ name, email, password });
      const user = { name: data.name, token: data.token, id: data.id };
      context?.setUser(user);
      await AsyncStorage.setItem('ChatUserData', JSON.stringify(user));
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? 'Something went wrong. Try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.root}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" backgroundColor={Colors.bgPrimary} />
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Logo / Branding ── */}
        <View style={styles.brandWrap}>
          <View style={styles.logoMark}>
            <Text style={styles.logoIcon}>💬</Text>
          </View>
          <Text style={styles.appName}>ChatApp</Text>
          <Text style={styles.tagline}>Connect with your people</Text>
        </View>

        {/* ── Form Card ── */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Welcome</Text>
          <Text style={styles.cardSubtitle}>Sign in or create your account</Text>

          <View style={styles.fieldGroup}>
            <FloatInput
              label="Username"
              value={name}
              onChangeText={setName}
              autoCapitalize="none"
            />
            <FloatInput
              label="Email address"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <FloatInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          {/* Error pill */}
          {!!error && (
            <View style={styles.errorPill}>
              <Text style={styles.errorText}>⚠️  {error}</Text>
            </View>
          )}

          {/* Submit button */}
          <TouchableOpacity
            style={[styles.btn, loading && styles.btnDisabled]}
            onPress={handleSubmit}
            activeOpacity={0.8}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.textInverse} size="small" />
            ) : (
              <Text style={styles.btnText}>Continue →</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.hint}>
            New user? We'll create your account automatically.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.bgPrimary,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing['5xl'],
  },

  // ── Brand ──────────────────────────────────
  brandWrap: {
    alignItems: 'center',
    marginBottom: Spacing['3xl'],
  },
  logoMark: {
    width: 72,
    height: 72,
    borderRadius: Radius.xl,
    backgroundColor: Colors.accentDim,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.accent,
    ...Shadows.accent,
  },
  logoIcon: {
    fontSize: 34,
  },
  appName: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },

  // ── Card ───────────────────────────────────
  card: {
    backgroundColor: Colors.bgSurface,
    borderRadius: Radius.lg,
    padding: Spacing.xxl,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.md,
  },
  cardTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  cardSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xxl,
  },

  // ── Fields ─────────────────────────────────
  fieldGroup: {
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  inputWrap: {
    height: 58,
    backgroundColor: Colors.bgElevated,
    borderRadius: Radius.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'flex-end',
    paddingBottom: 8,
  },
  inputWrapFocused: {
    borderColor: Colors.accent,
    backgroundColor: Colors.bgHover,
  },
  floatLabel: {
    position: 'absolute',
    left: Spacing.lg,
    fontWeight: FontWeight.medium,
  },
  input: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    color: Colors.textPrimary,
    paddingTop: 14,
    paddingBottom: 0,
  },

  // ── Error ──────────────────────────────────
  errorPill: {
    backgroundColor: 'rgba(255,94,126,0.12)',
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,94,126,0.3)',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.lg,
  },
  errorText: {
    color: Colors.error,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    textAlign: 'center',
  },

  // ── Button ─────────────────────────────────
  btn: {
    height: 52,
    backgroundColor: Colors.accent,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    ...Shadows.accent,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: {
    color: Colors.textInverse,
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    letterSpacing: 0.3,
  },
  hint: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    textAlign: 'center',
  },
});