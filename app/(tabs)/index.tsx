import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter, Redirect } from 'expo-router';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Svg, { Circle } from 'react-native-svg';
import { useApp } from '../../contexts/AppContext';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme, t, language, isOnboarded, student, studyTasks, courses, weakPoints, notifications, toggleTaskComplete, unreadNotifCount } = useApp();

  if (!isOnboarded) return <Redirect href="/welcome" />;

  const completedTasks = studyTasks.filter((tk) => tk.completed).length;
  const totalTasks = studyTasks.length;
  const taskProgress = totalTasks > 0 ? completedTasks / totalTasks : 0;

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return t('صباح الخير', 'Good Morning');
    return t('مساء الخير', 'Good Evening');
  };

  const upcomingExams = courses.filter((c) => c.nextExam)
    .sort((a, b) => new Date(a.nextExam!).getTime() - new Date(b.nextExam!).getTime())
    .slice(0, 3);

  const daysUntil = (d: string) => Math.ceil((new Date(d).getTime() - Date.now()) / 86400000);

  const profUpdates = courses.filter((c) => c.nextTopic).slice(0, 2);

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: insets.bottom + 16 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View entering={FadeInDown.delay(80).duration(400)} style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.greeting, { color: theme.textSecondary }]}>{getGreeting()}</Text>
            <Text style={[styles.name, { color: theme.textPrimary }]}>{student.name.split(' ')[0]} 👋</Text>
          </View>
          <Pressable onPress={() => { Haptics.selectionAsync(); router.push('/notifications'); }}
            style={[styles.notifBtn, { backgroundColor: theme.surface, ...theme.shadow }]}>
            <MaterialIcons name="notifications-none" size={24} color={theme.textPrimary} />
            {unreadNotifCount > 0 && (
              <View style={[styles.badge, { backgroundColor: theme.primary }]}>
                <Text style={styles.badgeText}>{unreadNotifCount}</Text>
              </View>
            )}
          </Pressable>
        </Animated.View>

        {/* Hero Progress */}
        <Animated.View entering={FadeInDown.delay(150).duration(500)}>
          <LinearGradient colors={[theme.primary, '#E03A8C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.heroCard}>
            <View style={styles.heroContent}>
              <View style={{ flex: 1 }}>
                <Text style={styles.heroLabel}>{t('خطة اليوم', "TODAY'S PLAN")}</Text>
                <Text style={styles.heroValue}>{completedTasks}/{totalTasks}</Text>
                <Text style={styles.heroSub}>{t('مهام مكتملة', 'tasks completed')}</Text>
                <View style={styles.heroTrack}>
                  <View style={[styles.heroFill, { width: `${taskProgress * 100}%` }]} />
                </View>
              </View>
              <View style={styles.ringWrap}>
                <Svg width={90} height={90}>
                  <Circle cx={45} cy={45} r={38} stroke="rgba(255,255,255,0.2)" strokeWidth={6} fill="none" />
                  <Circle cx={45} cy={45} r={38} stroke="#FFF" strokeWidth={6} strokeDasharray={239} strokeDashoffset={239 - taskProgress * 239} strokeLinecap="round" fill="none" rotation="-90" origin="45,45" />
                </Svg>
                <View style={styles.ringCenter}>
                  <Text style={styles.ringPercent}>{Math.round(taskProgress * 100)}%</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Quick Stats */}
        <Animated.View entering={FadeInDown.delay(220).duration(400)} style={styles.statsRow}>
          {[
            { icon: 'local-fire-department' as const, value: `${student.streak}`, label: t('يوم متواصل', 'day streak'), bg: theme.primaryFaded, color: theme.primary },
            { icon: 'check-circle' as const, value: `${student.quizzesCompleted}`, label: t('كويز', 'quizzes'), bg: theme.successLight, color: theme.success },
            { icon: 'schedule' as const, value: `${student.totalStudyHours}`, label: t('ساعة', 'hours'), bg: theme.accentFaded, color: theme.accent },
          ].map((s, i) => (
            <View key={i} style={[styles.statCard, { backgroundColor: s.bg }]}>
              <MaterialIcons name={s.icon} size={22} color={s.color} />
              <Text style={[styles.statVal, { color: s.color }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>{s.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Professor Updates */}
        {profUpdates.length > 0 && (
          <Animated.View entering={FadeInDown.delay(280).duration(400)}>
            <View style={styles.secHeader}>
              <Text style={[styles.secTitle, { color: theme.textPrimary }]}>{t('آخر تحديثات الدكتور', 'Professor Updates')}</Text>
            </View>
            {profUpdates.map((c) => (
              <View key={c.id} style={[styles.profCard, { backgroundColor: theme.surface, ...theme.shadow }]}>
                <View style={[styles.profIcon, { backgroundColor: c.color + '15' }]}>
                  <MaterialIcons name="person" size={20} color={c.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.profCourseName, { color: theme.textPrimary }]}>{c.name}</Text>
                  <Text style={{ fontSize: 12, color: theme.textSecondary }}>
                    {t('وصل إلى:', 'Currently at:')} <Text style={{ fontWeight: '700', color: c.color }}>{c.currentTopic}</Text>
                  </Text>
                  <Text style={{ fontSize: 12, color: theme.textMuted, marginTop: 2 }}>
                    {t('القادم:', 'Next:')} {c.nextTopic}
                  </Text>
                </View>
              </View>
            ))}
          </Animated.View>
        )}

        {/* Tasks */}
        <Animated.View entering={FadeInDown.delay(340).duration(400)}>
          <View style={styles.secHeader}>
            <Text style={[styles.secTitle, { color: theme.textPrimary }]}>{t('مهام اليوم', "Today's Tasks")}</Text>
          </View>
          {studyTasks.map((task, idx) => (
            <Animated.View key={task.id} entering={FadeInRight.delay(380 + idx * 60).duration(350)}>
              <Pressable style={[styles.taskCard, { backgroundColor: theme.surface, ...theme.shadow }, task.completed && { opacity: 0.55 }]}
                onPress={() => { Haptics.selectionAsync(); toggleTaskComplete(task.id); }}>
                <View style={[styles.taskLine, { backgroundColor: task.color }]} />
                <Pressable
                  style={[styles.checkbox, task.completed && { backgroundColor: theme.success, borderColor: theme.success }]}
                  onPress={() => { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); toggleTaskComplete(task.id); }}
                >
                  {task.completed ? <MaterialIcons name="check" size={14} color="#FFF" /> : null}
                </Pressable>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.taskTitle, { color: theme.textPrimary }, task.completed && styles.taskDone]}>{task.title}</Text>
                  <View style={styles.taskMeta}>
                    <Text style={{ fontSize: 12, color: theme.textSecondary }}>{task.courseCode}</Text>
                    <Text style={{ fontSize: 12, color: theme.textMuted }}>·</Text>
                    <Text style={{ fontSize: 12, color: theme.textSecondary }}>{task.duration}</Text>
                    {task.priority === 'high' && (
                      <View style={[styles.prioTag, { backgroundColor: theme.errorLight }]}>
                        <Text style={{ fontSize: 10, fontWeight: '600', color: theme.error }}>{t('أولوية', 'Priority')}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </Pressable>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Upcoming Exams */}
        <Animated.View entering={FadeInDown.delay(500).duration(400)}>
          <View style={styles.secHeader}>
            <Text style={[styles.secTitle, { color: theme.textPrimary }]}>{t('الامتحانات القادمة', 'Upcoming Exams')}</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}>
            {upcomingExams.map((c) => {
              const days = daysUntil(c.nextExam!);
              const urg = days <= 3 ? theme.error : days <= 7 ? theme.warning : theme.success;
              return (
                <View key={c.id} style={[styles.examCard, { backgroundColor: theme.surface, ...theme.shadow }]}>
                  <View style={[styles.examDays, { backgroundColor: urg + '15' }]}>
                    <Text style={[styles.examDaysNum, { color: urg }]}>{days}</Text>
                    <Text style={{ fontSize: 11, fontWeight: '600', color: urg }}>{t('يوم', 'days')}</Text>
                  </View>
                  <Text style={[styles.examName, { color: theme.textPrimary }]}>{c.name}</Text>
                  <Text style={{ fontSize: 12, color: theme.textSecondary }}>{c.code}</Text>
                  <View style={styles.examProgRow}>
                    <View style={[styles.examTrack, { backgroundColor: theme.borderLight }]}>
                      <View style={[styles.examFill, { width: `${c.progress * 100}%`, backgroundColor: c.color }]} />
                    </View>
                    <Text style={{ fontSize: 11, fontWeight: '600', color: theme.textSecondary }}>{Math.round(c.progress * 100)}%</Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* Weak Points */}
        {weakPoints.length > 0 && (
          <Animated.View entering={FadeInDown.delay(580).duration(400)}>
            <View style={styles.secHeader}>
              <Text style={[styles.secTitle, { color: theme.textPrimary }]}>{t('نقاط تحتاج تركيز', 'Focus Areas')}</Text>
              <MaterialIcons name="warning" size={18} color={theme.warning} />
            </View>
            {weakPoints.slice(0, 2).map((wp) => (
              <View key={wp.id} style={[styles.weakCard, { backgroundColor: theme.surface, ...theme.shadow, borderLeftColor: theme.warning }]}>
                <View style={[styles.weakScore, { backgroundColor: theme.warningLight }]}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: theme.warning }}>{wp.score}%</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: theme.textPrimary }}>{wp.topic}</Text>
                  <Text style={{ fontSize: 12, color: theme.textSecondary, marginTop: 2 }}>{wp.courseName}</Text>
                  {wp.reviewMinute ? (
                    <Text style={{ fontSize: 11, color: theme.primary, marginTop: 4, fontWeight: '600' }}>
                      {t('راجع من الدقيقة', 'Review from minute')} {wp.reviewMinute}
                    </Text>
                  ) : null}
                </View>
              </View>
            ))}
          </Animated.View>
        )}

        {/* AI Recommendation */}
        <Animated.View entering={FadeInDown.delay(650).duration(400)}>
          <LinearGradient colors={[theme.primaryFaded, theme.accentFaded]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.aiCard}>
            <View style={[styles.aiBadge, { backgroundColor: theme.primary + '15' }]}>
              <MaterialIcons name="auto-awesome" size={14} color={theme.primary} />
              <Text style={{ fontSize: 12, fontWeight: '600', color: theme.primary }}>{t('توصية ذكية', 'AI Recommendation')}</Text>
            </View>
            <Text style={[styles.aiText, { color: theme.textPrimary }]}>
              {t(
                'بناءً على أدائك، ننصحك بالتركيز الليلة على الأشجار الثنائية في هياكل البيانات. امتحانك قريب ونسبة إتقانك 45% فقط.',
                'Based on your performance, focus tonight on Binary Trees in Data Structures. Your exam is soon and mastery is only 45%.'
              )}
            </Text>
            <Pressable style={[styles.aiBtn, { backgroundColor: theme.primary }]}
              onPress={() => { Haptics.selectionAsync(); router.push('/lecture/lec-003'); }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#FFF' }}>{t('ابدأ المراجعة', 'Start Review')}</Text>
              <MaterialIcons name={language === 'ar' ? 'arrow-back' : 'arrow-forward'} size={16} color="#FFF" />
            </Pressable>
          </LinearGradient>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 14 },
  greeting: { fontSize: 13, fontWeight: '500' },
  name: { fontSize: 24, fontWeight: '700', marginTop: 2 },
  notifBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  badge: { position: 'absolute', top: 6, right: 6, width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#FFF', fontSize: 9, fontWeight: '700' },
  heroCard: { marginHorizontal: 16, borderRadius: 20, padding: 20, marginBottom: 16 },
  heroContent: { flexDirection: 'row', alignItems: 'center' },
  heroLabel: { fontSize: 11, fontWeight: '600', color: 'rgba(255,255,255,0.7)', letterSpacing: 1 },
  heroValue: { fontSize: 44, fontWeight: '700', color: '#FFF', marginTop: 4 },
  heroSub: { fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 },
  heroTrack: { height: 4, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 2, marginTop: 12, overflow: 'hidden' },
  heroFill: { height: 4, backgroundColor: '#FFF', borderRadius: 2 },
  ringWrap: { width: 90, height: 90, alignItems: 'center', justifyContent: 'center' },
  ringCenter: { position: 'absolute', alignItems: 'center' },
  ringPercent: { fontSize: 18, fontWeight: '700', color: '#FFF' },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginBottom: 20 },
  statCard: { flex: 1, borderRadius: 14, padding: 12, alignItems: 'center', gap: 4 },
  statVal: { fontSize: 22, fontWeight: '700' },
  statLabel: { fontSize: 11, fontWeight: '500' },
  secHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginBottom: 10, marginTop: 8 },
  secTitle: { fontSize: 16, fontWeight: '700' },
  profCard: { flexDirection: 'row', alignItems: 'center', gap: 12, marginHorizontal: 16, marginBottom: 8, padding: 14, borderRadius: 14 },
  profIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  profCourseName: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  taskCard: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 16, marginBottom: 8, borderRadius: 14, padding: 14, gap: 10 },
  taskLine: { width: 3, height: 34, borderRadius: 2 },
  checkbox: { width: 22, height: 22, borderRadius: 7, borderWidth: 2, borderColor: '#D1D5DB', alignItems: 'center', justifyContent: 'center' },
  taskTitle: { fontSize: 15, fontWeight: '600' },
  taskDone: { textDecorationLine: 'line-through', opacity: 0.6 },
  taskMeta: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 },
  prioTag: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginLeft: 4 },
  examCard: { width: 155, borderRadius: 14, padding: 14 },
  examDays: { flexDirection: 'row', alignItems: 'baseline', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, gap: 3, marginBottom: 10 },
  examDaysNum: { fontSize: 22, fontWeight: '700' },
  examName: { fontSize: 14, fontWeight: '600', marginBottom: 2 },
  examProgRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  examTrack: { flex: 1, height: 4, borderRadius: 2, overflow: 'hidden' },
  examFill: { height: 4, borderRadius: 2 },
  weakCard: { flexDirection: 'row', alignItems: 'flex-start', marginHorizontal: 16, marginBottom: 8, borderRadius: 14, padding: 14, gap: 12, borderLeftWidth: 3 },
  weakScore: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  aiCard: { marginHorizontal: 16, marginTop: 12, borderRadius: 20, padding: 20, marginBottom: 8 },
  aiBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 999, alignSelf: 'flex-start', marginBottom: 10 },
  aiText: { fontSize: 14, lineHeight: 22 },
  aiBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderRadius: 999, paddingVertical: 10, paddingHorizontal: 20, alignSelf: 'flex-start', marginTop: 12 },
});
