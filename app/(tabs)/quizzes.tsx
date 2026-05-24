import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useApp } from '../../contexts/AppContext';

export default function QuizzesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme, t, quizzes } = useApp();
  const [filter, setFilter] = useState('all');

  const filters = [
    { id: 'all', label: t('الكل', 'All') },
    { id: 'new', label: t('جديد', 'New') },
    { id: 'attempted', label: t('تمت المحاولة', 'Attempted') },
    { id: 'adaptive', label: t('تكيفي', 'Adaptive') },
  ];

  const filtered = useMemo(() => {
    if (filter === 'new') return quizzes.filter((q) => q.attempts === 0);
    if (filter === 'attempted') return quizzes.filter((q) => q.attempts > 0);
    if (filter === 'adaptive') return quizzes.filter((q) => q.isAdaptive);
    return quizzes;
  }, [quizzes, filter]);

  const totalAttempts = quizzes.reduce((s, q) => s + q.attempts, 0);
  const scoredQuizzes = quizzes.filter((q) => q.bestScore);
  const avgScore = scoredQuizzes.length > 0 ? Math.round(scoredQuizzes.reduce((s, q) => s + (q.bestScore || 0), 0) / scoredQuizzes.length) : 0;

  const getDiff = (d: string) => {
    if (d === 'easy') return { label: t('سهل', 'Easy'), color: theme.success };
    if (d === 'medium') return { label: t('متوسط', 'Medium'), color: theme.warning };
    if (d === 'hard') return { label: t('صعب', 'Hard'), color: theme.error };
    return { label: t('متنوع', 'Mixed'), color: theme.primary };
  };

  const scoreColor = (s: number) => s >= 80 ? theme.success : s >= 60 ? theme.warning : theme.error;

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: insets.bottom + 16 }} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.duration(300)} style={styles.header}>
          <Text style={[styles.pageTitle, { color: theme.textPrimary }]}>{t('الكويزات', 'Quizzes')}</Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(80).duration(400)} style={styles.statsRow}>
          <LinearGradient colors={[theme.primary, '#E03A8C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.statGrad}>
            <Text style={styles.statGradVal}>{avgScore}%</Text>
            <Text style={styles.statGradLabel}>{t('المعدل', 'Average')}</Text>
          </LinearGradient>
          <View style={[styles.statPlain, { backgroundColor: theme.surface, ...theme.shadow }]}>
            <Text style={[styles.statPlainVal, { color: theme.primary }]}>{totalAttempts}</Text>
            <Text style={[styles.statPlainLabel, { color: theme.textSecondary }]}>{t('محاولة', 'Attempts')}</Text>
          </View>
          <View style={[styles.statPlain, { backgroundColor: theme.surface, ...theme.shadow }]}>
            <Text style={[styles.statPlainVal, { color: theme.accent }]}>{quizzes.length}</Text>
            <Text style={[styles.statPlainLabel, { color: theme.textSecondary }]}>{t('كويز', 'Quizzes')}</Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(150).duration(300)}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {filters.map((f) => (
              <Pressable key={f.id} style={[styles.chip, filter === f.id && { backgroundColor: theme.primary, borderColor: theme.primary }]}
                onPress={() => { Haptics.selectionAsync(); setFilter(f.id); }}>
                <Text style={[styles.chipText, filter === f.id && { color: '#FFF' }]}>{f.label}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </Animated.View>

        <View style={{ paddingHorizontal: 16 }}>
          {filtered.map((quiz, idx) => {
            const diff = getDiff(quiz.difficulty);
            return (
              <Animated.View key={quiz.id} entering={FadeInRight.delay(200 + idx * 60).duration(350)}>
                <Pressable style={[styles.quizCard, { backgroundColor: theme.surface, ...theme.shadow }]}
                  onPress={() => { Haptics.selectionAsync(); router.push(`/quiz/${quiz.id}`); }}>
                  <View style={styles.quizTop}>
                    <View style={{ flex: 1 }}>
                      <View style={styles.tagRow}>
                        <View style={[styles.codeTag, { backgroundColor: quiz.color + '15' }]}>
                          <Text style={{ fontSize: 11, fontWeight: '700', color: quiz.color }}>{quiz.courseCode}</Text>
                        </View>
                        <View style={[styles.diffTag, { backgroundColor: diff.color + '15' }]}>
                          <Text style={{ fontSize: 11, fontWeight: '600', color: diff.color }}>{diff.label}</Text>
                        </View>
                        {quiz.isAdaptive && (
                          <View style={[styles.adaptTag, { backgroundColor: theme.primaryFaded }]}>
                            <MaterialIcons name="auto-awesome" size={10} color={theme.primary} />
                            <Text style={{ fontSize: 11, fontWeight: '600', color: theme.primary }}>{t('تكيفي', 'Adaptive')}</Text>
                          </View>
                        )}
                      </View>
                      <Text style={[styles.quizTitle, { color: theme.textPrimary }]}>{quiz.title}</Text>
                      <Text style={{ fontSize: 13, color: theme.textSecondary, marginTop: 2 }}>{quiz.courseName}</Text>
                    </View>
                    {quiz.bestScore !== undefined && quiz.bestScore > 0 ? (
                      <View style={[styles.scoreBadge, { backgroundColor: scoreColor(quiz.bestScore) + '15' }]}>
                        <Text style={{ fontSize: 16, fontWeight: '700', color: scoreColor(quiz.bestScore) }}>{quiz.bestScore}%</Text>
                      </View>
                    ) : (
                      <View style={[styles.playBadge, { backgroundColor: theme.primaryFaded }]}>
                        <MaterialIcons name="play-arrow" size={20} color={theme.primary} />
                      </View>
                    )}
                  </View>
                  <View style={[styles.quizBottom, { borderTopColor: theme.borderLight }]}>
                    <View style={styles.meta}><MaterialIcons name="help-outline" size={14} color={theme.textMuted} /><Text style={{ fontSize: 12, color: theme.textMuted }}>{quiz.questionCount} {t('سؤال', 'Q')}</Text></View>
                    <View style={styles.meta}><MaterialIcons name="schedule" size={14} color={theme.textMuted} /><Text style={{ fontSize: 12, color: theme.textMuted }}>{quiz.duration} {t('دقيقة', 'min')}</Text></View>
                    <View style={styles.meta}><MaterialIcons name="refresh" size={14} color={theme.textMuted} /><Text style={{ fontSize: 12, color: theme.textMuted }}>{quiz.attempts}</Text></View>
                  </View>
                  {quiz.topics.length > 0 && (
                    <View style={styles.topicsRow}>
                      {quiz.topics.map((tp, i) => (
                        <View key={i} style={[styles.topicChip, { backgroundColor: theme.surfaceSecondary }]}>
                          <Text style={{ fontSize: 11, color: theme.textSecondary, fontWeight: '500' }}>{tp}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </Pressable>
              </Animated.View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  pageTitle: { fontSize: 28, fontWeight: '700' },
  statsRow: { flexDirection: 'row', paddingHorizontal: 16, gap: 10, marginBottom: 16 },
  statGrad: { flex: 1, borderRadius: 14, padding: 14, alignItems: 'center' },
  statGradVal: { fontSize: 28, fontWeight: '700', color: '#FFF' },
  statGradLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '500', marginTop: 2 },
  statPlain: { flex: 1, borderRadius: 14, padding: 14, alignItems: 'center' },
  statPlainVal: { fontSize: 28, fontWeight: '700' },
  statPlainLabel: { fontSize: 11, fontWeight: '500', marginTop: 2 },
  chipRow: { paddingHorizontal: 16, gap: 8, paddingBottom: 16 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB' },
  chipText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  quizCard: { borderRadius: 14, padding: 16, marginBottom: 10 },
  quizTop: { flexDirection: 'row', gap: 12 },
  tagRow: { flexDirection: 'row', gap: 6, marginBottom: 8, flexWrap: 'wrap' },
  codeTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  diffTag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  adaptTag: { flexDirection: 'row', alignItems: 'center', gap: 3, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  quizTitle: { fontSize: 16, fontWeight: '600' },
  scoreBadge: { width: 54, height: 54, borderRadius: 27, alignItems: 'center', justifyContent: 'center' },
  playBadge: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  quizBottom: { flexDirection: 'row', gap: 16, marginTop: 12, paddingTop: 12, borderTopWidth: 1 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  topicsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  topicChip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
});
