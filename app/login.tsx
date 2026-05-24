import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useApp } from '../contexts/AppContext';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, t, language } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.push('/setup');
  };

  const isRTL = language === 'ar';

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 16 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          {/* Back */}
          <Animated.View entering={FadeInDown.duration(300)}>
            <Pressable style={[styles.backBtn, { backgroundColor: theme.surfaceSecondary }]} onPress={() => { Haptics.selectionAsync(); router.back(); }}>
              <MaterialIcons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={22} color={theme.textPrimary} />
            </Pressable>
          </Animated.View>

          {/* Header */}
          <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.headerBlock}>
            <Text style={[styles.logo, { color: theme.primary }]}>AudiAI</Text>
            <Text style={[styles.title, { color: theme.textPrimary }]}>
              {isLogin ? t('تسجيل الدخول', 'Sign In') : t('إنشاء حساب', 'Create Account')}
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              {isLogin
                ? t('أدخل بياناتك للمتابعة', 'Enter your credentials to continue')
                : t('انضم لمجتمع AudiAI', 'Join the AudiAI community')}
            </Text>
          </Animated.View>

          {/* Form */}
          <Animated.View entering={FadeInDown.delay(200).duration(400)} style={styles.form}>
            {!isLogin && (
              <View style={[styles.inputWrap, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
                <MaterialIcons name="person-outline" size={20} color={theme.textMuted} />
                <TextInput
                  placeholder={t('الاسم الكامل', 'Full Name')}
                  placeholderTextColor={theme.textMuted}
                  value={name}
                  onChangeText={setName}
                  style={[styles.input, { color: theme.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}
                />
              </View>
            )}

            <View style={[styles.inputWrap, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
              <MaterialIcons name="email" size={20} color={theme.textMuted} />
              <TextInput
                placeholder={t('البريد الإلكتروني', 'Email')}
                placeholderTextColor={theme.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={[styles.input, { color: theme.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}
              />
            </View>

            <View style={[styles.inputWrap, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
              <MaterialIcons name="lock-outline" size={20} color={theme.textMuted} />
              <TextInput
                placeholder={t('كلمة المرور', 'Password')}
                placeholderTextColor={theme.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                style={[styles.input, { color: theme.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} size={20} color={theme.textMuted} />
              </Pressable>
            </View>

            {isLogin && (
              <Pressable style={{ alignSelf: isRTL ? 'flex-start' : 'flex-end' }}>
                <Text style={[styles.forgot, { color: theme.primary }]}>{t('نسيت كلمة المرور؟', 'Forgot Password?')}</Text>
              </Pressable>
            )}
          </Animated.View>

          {/* Submit */}
          <Animated.View entering={FadeInDown.delay(300).duration(400)} style={styles.submitWrap}>
            <Pressable onPress={handleSubmit} style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }]}>
              <LinearGradient colors={[theme.primary, theme.primaryDark]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.submitBtn}>
                <Text style={styles.submitText}>
                  {isLogin ? t('دخول', 'Sign In') : t('إنشاء حساب', 'Sign Up')}
                </Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>

          {/* Divider */}
          <Animated.View entering={FadeInDown.delay(400).duration(400)} style={styles.dividerRow}>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            <Text style={[styles.dividerText, { color: theme.textMuted }]}>{t('أو', 'OR')}</Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
          </Animated.View>

          {/* Social */}
          <Animated.View entering={FadeInDown.delay(500).duration(400)} style={styles.socialRow}>
            {['google', 'apple'].map((provider) => (
              <Pressable key={provider} style={[styles.socialBtn, { backgroundColor: theme.surface, borderColor: theme.border, ...theme.shadow }]}
                onPress={() => Haptics.selectionAsync()}>
                <MaterialIcons name={provider === 'google' ? 'mail' : 'phone-iphone'} size={22} color={theme.textPrimary} />
              </Pressable>
            ))}
          </Animated.View>

          {/* Toggle */}
          <Animated.View entering={FadeInDown.delay(600).duration(400)} style={styles.toggleRow}>
            <Text style={[styles.toggleText, { color: theme.textSecondary }]}>
              {isLogin ? t('ليس لديك حساب؟', "Don't have an account?") : t('لديك حساب؟', 'Already have an account?')}
            </Text>
            <Pressable onPress={() => { Haptics.selectionAsync(); setIsLogin(!isLogin); }}>
              <Text style={[styles.toggleLink, { color: theme.primary }]}>
                {isLogin ? t('سجّل الآن', 'Sign Up') : t('سجّل دخول', 'Sign In')}
              </Text>
            </Pressable>
          </Animated.View>

          {/* Mock Login Note */}
          <View style={[styles.mockNote, { backgroundColor: theme.accentFaded }]}>
            <MaterialIcons name="info-outline" size={16} color={theme.accentDark} />
            <Text style={[styles.mockNoteText, { color: theme.accentDark }]}>
              MOCK LOGIN - {t('اضغط دخول للمتابعة', 'Press Sign In to continue')}
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', marginLeft: 16, marginTop: 8 },
  headerBlock: { alignItems: 'center', marginTop: 24, paddingHorizontal: 24 },
  logo: { fontSize: 32, fontWeight: '800', letterSpacing: -1, marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '700' },
  subtitle: { fontSize: 14, marginTop: 6, textAlign: 'center' },
  form: { paddingHorizontal: 24, marginTop: 32, gap: 14 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, height: 52, borderRadius: 16, borderWidth: 1,
  },
  input: { flex: 1, fontSize: 15, fontWeight: '500' },
  forgot: { fontSize: 13, fontWeight: '600', marginTop: 4 },
  submitWrap: { paddingHorizontal: 24, marginTop: 24 },
  submitBtn: { paddingVertical: 16, borderRadius: 999, alignItems: 'center' },
  submitText: { fontSize: 17, fontWeight: '700', color: '#FFF' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, marginTop: 24, gap: 12 },
  dividerLine: { flex: 1, height: 1 },
  dividerText: { fontSize: 13, fontWeight: '500' },
  socialRow: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 20 },
  socialBtn: {
    width: 56, height: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', borderWidth: 1,
  },
  toggleRow: { flexDirection: 'row', justifyContent: 'center', gap: 4, marginTop: 24 },
  toggleText: { fontSize: 14 },
  toggleLink: { fontSize: 14, fontWeight: '700' },
  mockNote: {
    flexDirection: 'row', alignItems: 'center', gap: 6, marginHorizontal: 24,
    marginTop: 16, padding: 12, borderRadius: 12,
  },
  mockNoteText: { fontSize: 12, fontWeight: '600' },
});
