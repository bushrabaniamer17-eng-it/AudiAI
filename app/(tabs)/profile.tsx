import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Svg, { Circle } from 'react-native-svg';
import { useApp } from '../../contexts/AppContext';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme, t, student, courses, themeMode, toggleTheme } = useApp();

  const weeklyPercent = student.weeklyGoal > 0 ? Math.min(student.weeklyProgress / student.weeklyGoal, 1) : 0;

  const sections = [
    {
      title: t('الحساب', 'Account'),
      items: [
        { icon: 'person' as const, label: t('الملف الشخصي', 'Profile'), desc: student.university },
        { icon: 'school' as const, label: t('البيانات الأكاديمية', 'Academic Info'), desc: student.major },
        { icon: 'calendar-today' as const, label: t('الجدول الجامعي', 'Schedule'), desc: t('6 مواد', '6 courses') },
      ],
    },
    {
      title: t('التفضيلات', 'Preferences'),
      items: [
        { icon: 'translate' as const, label: t('اللغة', 'Language'), desc: t('العربية', 'Arabic') },
        { icon: 'notifications' as const, label: t('الإشعارات', 'Notifications'), desc: t('مفعّلة', 'Enabled') },
        { icon: 'dark-mode' as const, label: t('الوضع الليلي', 'Dark Mode'), desc: themeMode === 'dark' ? t('مفعّل', 'On') : t('إيقاف', 'Off'), onPress: toggleTheme },
      ],
    },
    {
      title: t('المساعدة', 'Help'),
      items: [
        { icon: 'help-outline' as const, label: t('الأسئلة الشائعة', 'FAQ'), desc: '' },
        { icon: 'mail-outline' as const, label: t('تواصل معنا', 'Contact Us'), desc: '' },
        { icon: 'info-outline' as const, label: t('حول التطبيق', 'About'), desc: 'v1.0.0' },
      ],
    },
  ];

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: insets.bottom + 16 }} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(300)} style={styles.header}>
          <Text style={[styles.pageTitle, { color: theme.textPrimary }]}>{t('حسابي', 'My Profile')}</Text>
          <Pressable style={[styles.settingsBtn, { backgroundColor: theme.surfaceSecondary }]}
            onPress={() => { Haptics.selectionAsync(); router.push('/settings'); }}>
            <MaterialIcons name="settings" size={22} color={theme.textSecondary} />
          </Pressable>
        </Animated.View>

        {/* Profile Card */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)}>
          <LinearGradient colors={[theme.primary, '#1E3A5F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.profileCard}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{student.name.charAt(0)}</Text>
            </View>
            <Text style={styles.profileName}>{student.name}</Text>
            <Text style={styles.profileUni}>{student.university} • {student.year}</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: 'rgba(255,255,255,0.9)', marginTop: 2 }}>{student.major}</Text>
            <View style={styles.profileStats}>
              {[
                { val: student.gpa.toString(), label: t('المعدل', 'GPA') },
                { val: student.streak.toString(), label: t('يوم', 'Streak') },
                { val: student.quizzesCompleted.toString(), label: t('كويز', 'Quizzes') },
              ].map((s, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <View style={styles.statDivider} />}
                  <View style={styles.statItem}>
                    <Text style={styles.statValue}>{s.val}</Text>
                    <Text style={styles.statLabel}>{s.label}</Text>
                  </View>
                </React.Fragment>
              ))}
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Weekly Goal */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)} style={[styles.weeklyCard, { backgroundColor: theme.surface, ...theme.shadow }]}>
          <View style={styles.weeklyHeader}>
            <Text style={[styles.weeklyTitle, { color: theme.textPrimary }]}>{t('هدف الأسبوع', 'Weekly Goal')}</Text>
            <Text style={{ fontSize: 16, fontWeight: '700', color: theme.primary }}>{Math.round(weeklyPercent * 100)}%</Text>
          </View>
          <View style={styles.weeklyRow}>
            <View style={{ alignItems: 'center' }}>
              <Svg width={80} height={80}>
                <Circle cx={40} cy={40} r={34} stroke={theme.borderLight} strokeWidth={5} fill="none" />
                <Circle cx={40} cy={40} r={34} stroke={theme.primary} strokeWidth={5} strokeDasharray={214} strokeDashoffset={214 - weeklyPercent * 214} strokeLinecap="round" fill="none" rotation="-90" origin="40,40" />
              </Svg>
              <View style={styles.weeklyCenter}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: theme.primary }}>{student.weeklyProgress}</Text>
                <Text style={{ fontSize: 10, color: theme.textMuted }}>{t('ساعة', 'hrs')}</Text>
              </View>
            </View>
            <View style={{ flex: 1, marginLeft: 16 }}>
              <Text style={{ fontSize: 14, color: theme.textPrimary, fontWeight: '500', marginBottom: 8 }}>
                {student.weeklyProgress} {t('من', 'of')} {student.weeklyGoal} {t('ساعة', 'hours')}
              </Text>
              <View style={[styles.weeklyTrack, { backgroundColor: theme.borderLight }]}>
                <View style={[styles.weeklyFill, { width: `${weeklyPercent * 100}%`, backgroundColor: theme.primary }]} />
              </View>
              <Text style={{ fontSize: 12, color: theme.textMuted, marginTop: 6 }}>
                {t('متبقي', 'Remaining')}: {student.weeklyGoal - student.weeklyProgress} {t('ساعة', 'hours')}
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Course Progress */}
        <Animated.View entering={FadeInDown.delay(300).duration(500)}>
          <View style={styles.secHeader}>
            <Text style={[styles.secTitle, { color: theme.textPrimary }]}>{t('تقدم المواد', 'Course Progress')}</Text>
          </View>
          {courses.map((c) => (
            <View key={c.id} style={styles.courseRow}>
              <View style={[styles.courseIndicator, { backgroundColor: c.color }]} />
              <View style={{ flex: 1 }}>
                <View style={styles.courseNameRow}>
                  <Text style={{ fontSize: 14, fontWeight: '500', color: theme.textPrimary }}>{c.name}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: theme.textSecondary }}>{Math.round(c.progress * 100)}%</Text>
                </View>
                <View style={[styles.courseTrack, { backgroundColor: theme.borderLight }]}>
                  <View style={[styles.courseFill, { width: `${c.progress * 100}%`, backgroundColor: c.color }]} />
                </View>
              </View>
            </View>
          ))}
        </Animated.View>

        {/* Settings */}
        {sections.map((sec, si) => (
          <Animated.View key={sec.title} entering={FadeInDown.delay(400 + si * 80).duration(500)}>
            <View style={styles.secHeader}><Text style={[styles.secTitle, { color: theme.textPrimary }]}>{sec.title}</Text></View>
            <View style={[styles.settingsGroup, { backgroundColor: theme.surface, ...theme.shadow }]}>
              {sec.items.map((item, ii) => (
                <Pressable key={item.label}
                  style={[styles.settingItem, ii < sec.items.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.borderLight }]}
                  onPress={() => { Haptics.selectionAsync(); if ('onPress' in item && item.onPress) item.onPress(); }}>
                  <View style={[styles.settingIcon, { backgroundColor: theme.primaryFaded }]}>
                    <MaterialIcons name={item.icon} size={20} color={theme.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '500', color: theme.textPrimary }}>{item.label}</Text>
                    {item.desc ? <Text style={{ fontSize: 12, color: theme.textMuted, marginTop: 1 }}>{item.desc}</Text> : null}
                  </View>
                  <MaterialIcons name="chevron-left" size={20} color={theme.textMuted} />
                </Pressable>
              ))}
            </View>
          </Animated.View>
        ))}

        {/* Logout */}
        <Animated.View entering={FadeInDown.delay(650).duration(500)} style={{ paddingHorizontal: 16, marginTop: 8 }}>
          <Pressable style={[styles.logoutBtn, { backgroundColor: theme.errorLight }]} onPress={() => Haptics.selectionAsync()}>
            <MaterialIcons name="logout" size={18} color={theme.error} />
            <Text style={{ fontSize: 15, fontWeight: '600', color: theme.error }}>{t('تسجيل الخروج', 'Sign Out')}</Text>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  pageTitle: { fontSize: 28, fontWeight: '700' },
  settingsBtn: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  profileCard: { marginHorizontal: 16, borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 16 },
  avatarCircle: { width: 72, height: 72, borderRadius: 36, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: 12, borderWidth: 3, borderColor: 'rgba(255,255,255,0.4)' },
  avatarText: { fontSize: 28, fontWeight: '700', color: '#FFF' },
  profileName: { fontSize: 20, fontWeight: '700', color: '#FFF' },
  profileUni: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  profileStats: { flexDirection: 'row', alignItems: 'center', marginTop: 20, paddingTop: 16, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)', width: '100%' },
  statDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.15)' },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '700', color: '#FFF' },
  statLabel: { fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2, fontWeight: '500' },
  weeklyCard: { marginHorizontal: 16, borderRadius: 14, padding: 16, marginBottom: 16 },
  weeklyHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  weeklyTitle: { fontSize: 16, fontWeight: '600' },
  weeklyRow: { flexDirection: 'row', alignItems: 'center' },
  weeklyCenter: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' },
  weeklyTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
  weeklyFill: { height: 6, borderRadius: 3 },
  secHeader: { paddingHorizontal: 16, marginBottom: 10, marginTop: 12 },
  secTitle: { fontSize: 16, fontWeight: '700' },
  courseRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12, gap: 10 },
  courseIndicator: { width: 4, height: 32, borderRadius: 2 },
  courseNameRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  courseTrack: { height: 4, borderRadius: 2, overflow: 'hidden' },
  courseFill: { height: 4, borderRadius: 2 },
  settingsGroup: { marginHorizontal: 16, borderRadius: 14, overflow: 'hidden' },
  settingItem: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  settingIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 14, borderRadius: 14 },
});
