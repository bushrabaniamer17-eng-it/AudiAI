import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useApp } from '../contexts/AppContext';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme, t, language, setLanguage, themeMode, toggleTheme } = useApp();
  const isRTL = language === 'ar';

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.borderLight }]}>
        <Pressable style={[styles.backBtn, { backgroundColor: theme.surfaceSecondary }]}
          onPress={() => { Haptics.selectionAsync(); router.back(); }}>
          <MaterialIcons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={22} color={theme.textPrimary} />
        </Pressable>
        <Text style={[styles.title, { color: theme.textPrimary }]}>{t('الإعدادات', 'Settings')}</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 16 }} showsVerticalScrollIndicator={false}>
        {/* Language */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <Text style={[styles.secTitle, { color: theme.textSecondary }]}>{t('اللغة', 'Language')}</Text>
          <View style={[styles.group, { backgroundColor: theme.surface, ...theme.shadow }]}>
            {[
              { id: 'ar' as const, label: 'العربية', sub: 'Arabic' },
              { id: 'en' as const, label: 'English', sub: 'الإنجليزية' },
            ].map((lang, i) => (
              <Pressable key={lang.id}
                style={[styles.item, i < 1 && { borderBottomWidth: 1, borderBottomColor: theme.borderLight }]}
                onPress={() => { Haptics.selectionAsync(); setLanguage(lang.id); }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '500', color: theme.textPrimary }}>{lang.label}</Text>
                  <Text style={{ fontSize: 12, color: theme.textMuted }}>{lang.sub}</Text>
                </View>
                {language === lang.id && <MaterialIcons name="check-circle" size={22} color={theme.primary} />}
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Appearance */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)}>
          <Text style={[styles.secTitle, { color: theme.textSecondary }]}>{t('المظهر', 'Appearance')}</Text>
          <View style={[styles.group, { backgroundColor: theme.surface, ...theme.shadow }]}>
            <Pressable style={styles.item} onPress={() => { Haptics.selectionAsync(); toggleTheme(); }}>
              <View style={[styles.iconWrap, { backgroundColor: theme.primaryFaded }]}>
                <MaterialIcons name="dark-mode" size={20} color={theme.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '500', color: theme.textPrimary }}>{t('الوضع الليلي', 'Dark Mode')}</Text>
                <Text style={{ fontSize: 12, color: theme.textMuted }}>
                  {themeMode === 'dark' ? t('مفعّل', 'Enabled') : t('معطّل', 'Disabled')}
                </Text>
              </View>
              <View style={[styles.toggle, { backgroundColor: themeMode === 'dark' ? theme.primary : theme.border }]}>
                <Animated.View style={[styles.toggleDot, { transform: [{ translateX: themeMode === 'dark' ? 18 : 2 }] }]} />
              </View>
            </Pressable>
          </View>
        </Animated.View>

        {/* Study Preferences */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)}>
          <Text style={[styles.secTitle, { color: theme.textSecondary }]}>{t('التفضيلات الدراسية', 'Study Preferences')}</Text>
          <View style={[styles.group, { backgroundColor: theme.surface, ...theme.shadow }]}>
            {[
              { icon: 'notifications' as const, label: t('الإشعارات الذكية', 'Smart Notifications'), desc: t('مفعّلة', 'Enabled') },
              { icon: 'schedule' as const, label: t('تذكير الدراسة', 'Study Reminders'), desc: t('كل 25 دقيقة', 'Every 25 min') },
              { icon: 'auto-awesome' as const, label: t('التعلم التكيفي', 'Adaptive Learning'), desc: t('مفعّل', 'Enabled') },
            ].map((item, i) => (
              <Pressable key={item.label} style={[styles.item, i < 2 && { borderBottomWidth: 1, borderBottomColor: theme.borderLight }]}
                onPress={() => Haptics.selectionAsync()}>
                <View style={[styles.iconWrap, { backgroundColor: theme.primaryFaded }]}>
                  <MaterialIcons name={item.icon} size={20} color={theme.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '500', color: theme.textPrimary }}>{item.label}</Text>
                  <Text style={{ fontSize: 12, color: theme.textMuted }}>{item.desc}</Text>
                </View>
                <MaterialIcons name="chevron-left" size={20} color={theme.textMuted} />
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* About */}
        <Animated.View entering={FadeInDown.delay(400).duration(400)}>
          <Text style={[styles.secTitle, { color: theme.textSecondary }]}>{t('حول', 'About')}</Text>
          <View style={[styles.group, { backgroundColor: theme.surface, ...theme.shadow }]}>
            {[
              { icon: 'info-outline' as const, label: t('إصدار التطبيق', 'App Version'), desc: 'v1.0.0' },
              { icon: 'privacy-tip' as const, label: t('سياسة الخصوصية', 'Privacy Policy'), desc: '' },
              { icon: 'description' as const, label: t('الشروط والأحكام', 'Terms of Service'), desc: '' },
            ].map((item, i) => (
              <Pressable key={item.label} style={[styles.item, i < 2 && { borderBottomWidth: 1, borderBottomColor: theme.borderLight }]}
                onPress={() => Haptics.selectionAsync()}>
                <View style={[styles.iconWrap, { backgroundColor: theme.surfaceSecondary }]}>
                  <MaterialIcons name={item.icon} size={20} color={theme.textSecondary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: '500', color: theme.textPrimary }}>{item.label}</Text>
                </View>
                {item.desc ? <Text style={{ fontSize: 13, color: theme.textMuted }}>{item.desc}</Text> : <MaterialIcons name="chevron-left" size={20} color={theme.textMuted} />}
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Branding */}
        <View style={styles.branding}>
          <Text style={{ fontSize: 24, fontWeight: '800', color: theme.primary, letterSpacing: -1 }}>AudiAI</Text>
          <Text style={{ fontSize: 12, color: theme.textMuted, marginTop: 4 }}>{t('مساعدك الأكاديمي الذكي', 'Your Smart Academic Assistant')}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: 20, fontWeight: '700' },
  secTitle: { fontSize: 13, fontWeight: '600', paddingHorizontal: 16, marginTop: 24, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  group: { marginHorizontal: 16, borderRadius: 14, overflow: 'hidden' },
  item: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  iconWrap: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  toggle: { width: 44, height: 26, borderRadius: 13, justifyContent: 'center' },
  toggleDot: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#FFF' },
  branding: { alignItems: 'center', marginTop: 40, marginBottom: 16 },
});
