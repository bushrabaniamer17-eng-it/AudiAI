import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeIn, useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Svg, { Circle } from 'react-native-svg';
import { useApp } from '../../contexts/AppContext';
import { mockQuizQuestions } from '../../services/mockData';

type QuizState = 'intro' | 'active' | 'result';

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme, t, language, quizzes, updateQuizScore } = useApp();
  const isRTL = language === 'ar';

  const quiz = quizzes.find((q) => q.id === id) || quizzes[0];
  const questions = mockQuizQuestions.slice(0, quiz.questionCount);
  const [state, setState] = useState<QuizState>('intro');
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const shakeX = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ translateX: shakeX.value }] }));

  const startQuiz = () => { Haptics.selectionAsync(); setState('active'); setCurrentQ(0); setSelected(null); setAnswered(false); setScore(0); };

  const confirmAnswer = () => {
    if (selected === null) return;
    setAnswered(true);
    const correct = selected === questions[currentQ].correctAnswer;
    if (correct) { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); setScore((p) => p + 1); }
    else { Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error); shakeX.value = withSequence(withTiming(-10, { duration: 50 }), withTiming(10, { duration: 50 }), withTiming(-10, { duration: 50 }), withTiming(0, { duration: 50 })); }
  };

  const nextQ = () => {
    Haptics.selectionAsync();
    if (currentQ < questions.length - 1) { setCurrentQ((p) => p + 1); setSelected(null); setAnswered(false); }
    else { updateQuizScore(quiz.id, Math.round((score / questions.length) * 100)); setState('result'); }
  };

  const optStyle = (i: number) => {
    if (!answered) return selected === i ? { backgroundColor: theme.primaryFaded, borderColor: theme.primary } : { backgroundColor: theme.surface, borderColor: theme.border };
    const q = questions[currentQ];
    if (i === q.correctAnswer) return { backgroundColor: theme.successLight, borderColor: theme.success };
    if (i === selected) return { backgroundColor: theme.errorLight, borderColor: theme.error };
    return { backgroundColor: theme.surface, borderColor: theme.border };
  };

  const optColor = (i: number) => {
    if (!answered) return selected === i ? theme.primary : theme.textPrimary;
    if (i === questions[currentQ].correctAnswer) return theme.success;
    if (i === selected) return theme.error;
    return theme.textSecondary;
  };

  const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;

  if (state === 'intro') {
    const dc = quiz.difficulty === 'easy' ? theme.success : quiz.difficulty === 'hard' ? theme.error : quiz.difficulty === 'medium' ? theme.warning : theme.primary;
    const dl = quiz.difficulty === 'easy' ? t('سهل', 'Easy') : quiz.difficulty === 'hard' ? t('صعب', 'Hard') : quiz.difficulty === 'medium' ? t('متوسط', 'Medium') : t('متنوع', 'Mixed');
    return (
      <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.introTop}>
          <Pressable style={[styles.closeBtn, { backgroundColor: theme.surfaceSecondary }]} onPress={() => { Haptics.selectionAsync(); router.back(); }}>
            <MaterialIcons name="close" size={22} color={theme.textSecondary} />
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24, paddingBottom: insets.bottom + 80 }}>
          <Animated.View entering={FadeInDown.duration(500)} style={{ alignItems: 'center' }}>
            <LinearGradient colors={[quiz.color, quiz.color + 'CC']} style={styles.introIcon}>
              <MaterialIcons name="quiz" size={40} color="#FFF" />
            </LinearGradient>
            <Text style={[styles.introTitle, { color: theme.textPrimary }]}>{quiz.title}</Text>
            <Text style={{ fontSize: 15, color: theme.textSecondary, marginTop: 6 }}>{quiz.courseName}</Text>
            <View style={[styles.introMeta, { backgroundColor: theme.surface, ...theme.shadow }]}>
              <View style={styles.introMetaItem}>
                <Text style={[styles.introMetaVal, { color: theme.textPrimary }]}>{quiz.questionCount}</Text>
                <Text style={{ fontSize: 11, color: theme.textMuted }}>{t('سؤال', 'Q')}</Text>
              </View>
              <View style={[styles.introDiv, { backgroundColor: theme.border }]} />
              <View style={styles.introMetaItem}>
                <Text style={[styles.introMetaVal, { color: theme.textPrimary }]}>{quiz.duration}</Text>
                <Text style={{ fontSize: 11, color: theme.textMuted }}>{t('دقيقة', 'min')}</Text>
              </View>
              <View style={[styles.introDiv, { backgroundColor: theme.border }]} />
              <View style={styles.introMetaItem}>
                <View style={[styles.diffDot, { backgroundColor: dc }]} />
                <Text style={{ fontSize: 14, fontWeight: '700', color: dc }}>{dl}</Text>
              </View>
            </View>
            {quiz.isAdaptive && (
              <View style={[styles.adaptBanner, { backgroundColor: theme.primaryFaded }]}>
                <MaterialIcons name="auto-awesome" size={16} color={theme.primary} />
                <Text style={{ fontSize: 13, fontWeight: '500', color: theme.primary }}>{t('كويز تكيفي', 'Adaptive Quiz')}</Text>
              </View>
            )}
          </Animated.View>
        </ScrollView>
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12, borderTopColor: theme.borderLight }]}>
          <Pressable onPress={startQuiz} style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}>
            <LinearGradient colors={[theme.primary, '#1E3A5F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.ctaBtn}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#FFF' }}>{t('ابدأ الكويز', 'Start Quiz')}</Text>
              <MaterialIcons name={isRTL ? 'arrow-back' : 'arrow-forward'} size={20} color="#FFF" />
            </LinearGradient>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  if (state === 'result') {
    const pass = pct >= 70;
    return (
      <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
        <ScrollView contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 24, paddingTop: 40, paddingBottom: insets.bottom + 80 }}>
          <Animated.View entering={FadeInDown.duration(600)} style={{ alignItems: 'center' }}>
            <Image source={require('../../assets/images/quiz-success.png')} style={{ width: 160, height: 160, marginBottom: 16 }} contentFit="contain" />
            <Text style={{ fontSize: 24, fontWeight: '700', color: theme.textPrimary, textAlign: 'center', marginBottom: 24 }}>
              {pass ? t('أحسنت! 🎉', 'Great Job! 🎉') : t('حاول مرة أخرى', 'Try Again')}
            </Text>
            <View style={{ width: 140, height: 140, alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
              <Svg width={140} height={140}>
                <Circle cx={70} cy={70} r={60} stroke={theme.borderLight} strokeWidth={8} fill="none" />
                <Circle cx={70} cy={70} r={60} stroke={pass ? theme.success : theme.warning} strokeWidth={8} strokeDasharray={377} strokeDashoffset={377 - (pct / 100) * 377} strokeLinecap="round" fill="none" rotation="-90" origin="70,70" />
              </Svg>
              <View style={{ position: 'absolute', alignItems: 'center' }}>
                <Text style={{ fontSize: 36, fontWeight: '700', color: pass ? theme.success : theme.warning }}>{pct}%</Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 24, marginBottom: 24 }}>
              {[
                { icon: 'check-circle' as const, val: score, label: t('صحيح', 'Correct'), color: theme.success },
                { icon: 'cancel' as const, val: questions.length - score, label: t('خاطئ', 'Wrong'), color: theme.error },
              ].map((s, i) => (
                <View key={i} style={{ alignItems: 'center', gap: 4 }}>
                  <MaterialIcons name={s.icon} size={20} color={s.color} />
                  <Text style={{ fontSize: 20, fontWeight: '700', color: theme.textPrimary }}>{s.val}</Text>
                  <Text style={{ fontSize: 12, color: theme.textMuted }}>{s.label}</Text>
                </View>
              ))}
            </View>
          </Animated.View>
        </ScrollView>
        <View style={[styles.resultBottom, { paddingBottom: insets.bottom + 12, borderTopColor: theme.borderLight }]}>
          <Pressable style={[styles.retryBtn, { borderColor: theme.primary }]} onPress={startQuiz}>
            <MaterialIcons name="refresh" size={18} color={theme.primary} />
            <Text style={{ fontSize: 16, fontWeight: '600', color: theme.primary }}>{t('إعادة', 'Retry')}</Text>
          </Pressable>
          <Pressable style={[styles.doneBtn, { backgroundColor: theme.primary }]} onPress={() => { Haptics.selectionAsync(); router.back(); }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFF' }}>{t('إنهاء', 'Done')}</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const q = questions[currentQ];
  const progress = (currentQ + 1) / questions.length;

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.qHeader}>
        <Pressable style={[styles.closeBtn, { backgroundColor: theme.surfaceSecondary }]} onPress={() => { Haptics.selectionAsync(); router.back(); }}>
          <MaterialIcons name="close" size={22} color={theme.textSecondary} />
        </Pressable>
        <View style={styles.progWrap}>
          <View style={[styles.progTrack, { backgroundColor: theme.borderLight }]}>
            <View style={[styles.progFill, { width: `${progress * 100}%`, backgroundColor: theme.primary }]} />
          </View>
        </View>
        <Text style={{ fontSize: 14, fontWeight: '600', color: theme.textSecondary }}>{currentQ + 1}/{questions.length}</Text>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 100, paddingTop: 16 }} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(300)}>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
            <View style={[styles.qBadge, { backgroundColor: (q.difficulty === 'easy' ? theme.success : q.difficulty === 'medium' ? theme.warning : theme.error) + '15' }]}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: q.difficulty === 'easy' ? theme.success : q.difficulty === 'medium' ? theme.warning : theme.error }}>
                {q.difficulty === 'easy' ? t('سهل', 'Easy') : q.difficulty === 'medium' ? t('متوسط', 'Med') : t('صعب', 'Hard')}
              </Text>
            </View>
          </View>
          <Text style={{ fontSize: 20, fontWeight: '600', color: theme.textPrimary, lineHeight: 32, marginBottom: 24 }}>{q.question}</Text>
        </Animated.View>
        <Animated.View style={shakeStyle}>
          {q.options?.map((opt, i) => (
            <Animated.View key={i} entering={FadeInDown.delay(100 + i * 60).duration(350)}>
              <Pressable style={[styles.optCard, optStyle(i), { borderWidth: 1.5 }]} onPress={() => { if (!answered) { Haptics.selectionAsync(); setSelected(i); } }} disabled={answered}>
                <View style={[styles.optLetter, { backgroundColor: theme.surfaceSecondary }]}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: optColor(i) }}>{String.fromCharCode(65 + i)}</Text>
                </View>
                <Text style={{ flex: 1, fontSize: 15, fontWeight: '500', color: optColor(i) }}>{opt}</Text>
                {answered && i === q.correctAnswer ? <MaterialIcons name="check-circle" size={20} color={theme.success} /> : null}
                {answered && i === selected && i !== q.correctAnswer ? <MaterialIcons name="cancel" size={20} color={theme.error} /> : null}
              </Pressable>
            </Animated.View>
          ))}
        </Animated.View>
        {answered && (
          <Animated.View entering={FadeInDown.delay(150).duration(350)}>
            <View style={[styles.explCard, { backgroundColor: theme.primaryFaded, borderLeftColor: theme.primary }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <MaterialIcons name="lightbulb" size={16} color={theme.primary} />
                <Text style={{ fontSize: 14, fontWeight: '600', color: theme.primary }}>{t('التفسير', 'Explanation')}</Text>
              </View>
              <Text style={{ fontSize: 14, color: theme.textPrimary, lineHeight: 22 }}>{q.explanation}</Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12, borderTopColor: theme.borderLight }]}>
        {!answered ? (
          <Pressable style={[styles.confirmBtn, { backgroundColor: selected !== null ? theme.primary : theme.border }]} onPress={confirmAnswer} disabled={selected === null}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFF' }}>{t('تأكيد الإجابة', 'Confirm Answer')}</Text>
          </Pressable>
        ) : (
          <Pressable onPress={nextQ}>
            <LinearGradient colors={[theme.primary, '#1E3A5F']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.ctaBtn}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#FFF' }}>{currentQ < questions.length - 1 ? t('السؤال التالي', 'Next') : t('عرض النتيجة', 'Results')}</Text>
              <MaterialIcons name={isRTL ? 'arrow-back' : 'arrow-forward'} size={18} color="#FFF" />
            </LinearGradient>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  introTop: { flexDirection: 'row', paddingHorizontal: 12, paddingVertical: 8 },
  closeBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  introIcon: { width: 80, height: 80, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  introTitle: { fontSize: 24, fontWeight: '700', textAlign: 'center' },
  introMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 24, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 20 },
  introMetaItem: { flex: 1, alignItems: 'center', gap: 4 },
  introMetaVal: { fontSize: 18, fontWeight: '700' },
  introDiv: { width: 1, height: 30 },
  diffDot: { width: 8, height: 8, borderRadius: 4 },
  adaptBanner: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 10, borderRadius: 14, marginTop: 16 },
  bottomBar: { paddingHorizontal: 16, paddingTop: 8, borderTopWidth: 1 },
  ctaBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16, borderRadius: 999 },
  qHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, gap: 12 },
  progWrap: { flex: 1 },
  progTrack: { height: 6, borderRadius: 3, overflow: 'hidden' },
  progFill: { height: 6, borderRadius: 3 },
  qBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  optCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 14, marginBottom: 10, gap: 12, minHeight: 56 },
  optLetter: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  explCard: { borderRadius: 14, padding: 16, marginTop: 8, borderLeftWidth: 3 },
  confirmBtn: { paddingVertical: 16, borderRadius: 999, alignItems: 'center' },
  resultBottom: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 8, borderTopWidth: 1, gap: 10 },
  retryBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, borderWidth: 1.5, borderRadius: 999, paddingVertical: 14 },
  doneBtn: { flex: 1, borderRadius: 999, paddingVertical: 14, alignItems: 'center' },
});
