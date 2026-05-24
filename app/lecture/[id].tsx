import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useApp } from '../../contexts/AppContext';
import { mockFlashcards, mockLectures } from '../../services/mockData';

export default function LectureDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme, t, language, courses, lectures } = useApp();
  const isRTL = language === 'ar';

  const lecture = lectures.find((l) => l.id === id) || mockLectures[0];
  const course = courses.find((c) => c.id === lecture.courseId);
  const [activeTab, setActiveTab] = useState<'summary' | 'flashcards' | 'keypoints'>('summary');
  const [flippedCards, setFlippedCards] = useState<Set<string>>(new Set());

  const toggleFlip = (cardId: string) => {
    Haptics.selectionAsync();
    setFlippedCards((p) => { const n = new Set(p); if (n.has(cardId)) n.delete(cardId); else n.add(cardId); return n; });
  };

  const mainIdeas = [
    t('القوائم المترابطة هي هياكل بيانات خطية تتكون من عُقد مرتبطة', 'Linked lists are linear data structures made of connected nodes'),
    t('كل عقدة تحتوي على بيانات ومؤشر للعقدة التالية', 'Each node contains data and a pointer to the next node'),
    t('عمليات الإضافة والحذف أسرع من المصفوفات O(1)', 'Insert/Delete operations are faster than arrays O(1)'),
    t('القائمة الثنائية تحتوي على مؤشرين: للتالي والسابق', 'Doubly linked list has two pointers: next and previous'),
    t('القائمة الدائرية آخر عقدة تشير لأول عقدة', 'Circular list: last node points to first node'),
  ];

  const definitions = [
    { term: 'Node', def: t('الوحدة الأساسية في القائمة', 'Basic unit of a linked list') },
    { term: 'Head', def: t('أول عقدة في القائمة', 'First node in the list') },
    { term: 'Tail', def: t('آخر عقدة، مؤشرها null', 'Last node, pointer is null') },
    { term: 'Pointer', def: t('عنوان الذاكرة للعقدة التالية', 'Memory address of next node') },
  ];

  const examHints = [
    t('ركّز الدكتور على المقارنة بين Array و Linked List', 'Professor emphasized Array vs Linked List comparison'),
    t('تم تكرار عمليات الإضافة 3 مرات', 'Insertion operations were repeated 3 times'),
    t('قال: "هذا دائماً بالامتحان" عند Doubly Linked List', 'Said "always in exam" about Doubly Linked List'),
  ];

  const tabs = [
    { id: 'summary' as const, label: t('الملخص', 'Summary'), icon: 'article' as const },
    { id: 'flashcards' as const, label: t('البطاقات', 'Cards'), icon: 'style' as const },
    { id: 'keypoints' as const, label: t('النقاط', 'Points'), icon: 'lightbulb' as const },
  ];

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.stickyHeader, { backgroundColor: theme.background, borderBottomColor: theme.borderLight }]}>
        <Pressable style={[styles.backBtn, { backgroundColor: theme.surfaceSecondary }]}
          onPress={() => { Haptics.selectionAsync(); router.back(); }}>
          <MaterialIcons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={22} color={theme.textPrimary} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]} numberOfLines={1}>{lecture.title}</Text>
          <Text style={{ fontSize: 12, color: theme.textMuted }}>{course?.code} • {lecture.date}</Text>
        </View>
      </View>

      <View style={[styles.tabBar, { backgroundColor: theme.background }]}>
        {tabs.map((tab) => (
          <Pressable key={tab.id} style={[styles.tab, activeTab === tab.id && { backgroundColor: theme.primaryFaded }]}
            onPress={() => { Haptics.selectionAsync(); setActiveTab(tab.id); }}>
            <MaterialIcons name={tab.icon} size={18} color={activeTab === tab.id ? theme.primary : theme.textMuted} />
            <Text style={{ fontSize: 13, fontWeight: '600', color: activeTab === tab.id ? theme.primary : theme.textMuted }}>{tab.label}</Text>
          </Pressable>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 80 }} showsVerticalScrollIndicator={false}>
        {activeTab === 'summary' && (
          <Animated.View entering={FadeIn.duration(300)}>
            <View style={[styles.heroWrap, { overflow: 'hidden' }]}>
              <Image source={require('../../assets/images/hero-brain.png')} style={{ width: '100%', height: '100%' }} contentFit="cover" />
              <LinearGradient colors={['transparent', 'rgba(0,0,0,0.6)']} style={styles.heroOverlay}>
                <View style={styles.heroStats}>
                  {[
                    { icon: 'lightbulb' as const, color: '#FCD34D', text: `${lecture.keyPoints} ${t('نقاط', 'points')}` },
                    { icon: 'style' as const, color: '#22D3EE', text: `${lecture.flashcards} ${t('بطاقة', 'cards')}` },
                    { icon: 'schedule' as const, color: '#A78BFA', text: lecture.duration },
                  ].map((s, i) => (
                    <View key={i} style={styles.heroStat}>
                      <MaterialIcons name={s.icon} size={16} color={s.color} />
                      <Text style={{ fontSize: 12, fontWeight: '600', color: '#FFF' }}>{s.text}</Text>
                    </View>
                  ))}
                </View>
              </LinearGradient>
            </View>

            <Text style={[styles.secTitle, { color: theme.textPrimary }]}>{t('الأفكار الرئيسية', 'Main Ideas')}</Text>
            {mainIdeas.map((idea, i) => (
              <Animated.View key={i} entering={FadeInDown.delay(i * 60).duration(350)} style={[styles.ideaCard, { backgroundColor: theme.surface, ...theme.shadow }]}>
                <View style={[styles.ideaNum, { backgroundColor: theme.primaryFaded }]}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: theme.primary }}>{i + 1}</Text>
                </View>
                <Text style={{ flex: 1, fontSize: 14, color: theme.textPrimary, lineHeight: 22 }}>{idea}</Text>
              </Animated.View>
            ))}

            <Text style={[styles.secTitle, { color: theme.textPrimary, marginTop: 24 }]}>{t('التعريفات', 'Definitions')}</Text>
            {definitions.map((d, i) => (
              <View key={i} style={[styles.defCard, { backgroundColor: theme.surface, borderLeftColor: theme.accent, ...theme.shadow }]}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: theme.accent }}>{d.term}</Text>
                <Text style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 20, marginTop: 4 }}>{d.def}</Text>
              </View>
            ))}

            <Text style={[styles.secTitle, { color: theme.textPrimary, marginTop: 24 }]}>{t('تلميحات امتحانية', 'Exam Hints')} ⚡</Text>
            {examHints.map((h, i) => (
              <View key={i} style={[styles.hintCard, { backgroundColor: theme.warningLight }]}>
                <MaterialIcons name="warning" size={16} color={theme.warning} />
                <Text style={{ flex: 1, fontSize: 13, color: '#92400E', lineHeight: 20 }}>{h}</Text>
              </View>
            ))}
          </Animated.View>
        )}

        {activeTab === 'flashcards' && (
          <Animated.View entering={FadeIn.duration(300)}>
            <Text style={{ fontSize: 13, color: theme.textSecondary, textAlign: 'center', marginBottom: 16 }}>
              {t('اضغط على البطاقة لعرض الإجابة', 'Tap card to reveal answer')}
            </Text>
            {mockFlashcards.map((card, i) => {
              const flipped = flippedCards.has(card.id);
              const dc = card.difficulty === 'easy' ? theme.success : card.difficulty === 'medium' ? theme.warning : theme.error;
              return (
                <Animated.View key={card.id} entering={FadeInDown.delay(i * 60).duration(350)}>
                  <Pressable style={[styles.flashcard, { backgroundColor: flipped ? theme.primaryFaded : theme.surface, ...theme.shadow }, flipped && { borderWidth: 1, borderColor: theme.primary + '40' }]}
                    onPress={() => toggleFlip(card.id)}>
                    <View style={styles.fcTop}>
                      <View style={[styles.fcDiff, { backgroundColor: dc + '15' }]}>
                        <Text style={{ fontSize: 11, fontWeight: '600', color: dc }}>
                          {card.difficulty === 'easy' ? t('سهل', 'Easy') : card.difficulty === 'medium' ? t('متوسط', 'Med') : t('صعب', 'Hard')}
                        </Text>
                      </View>
                      {card.mastered ? <MaterialIcons name="check-circle" size={18} color={theme.success} /> : null}
                    </View>
                    <Text style={{ fontSize: 15, fontWeight: '600', color: theme.textPrimary, lineHeight: 24 }}>{flipped ? card.back : card.front}</Text>
                    <Text style={{ fontSize: 11, color: theme.textMuted, textAlign: 'center', marginTop: 12 }}>
                      {flipped ? t('اضغط لعرض السؤال', 'Tap for question') : t('اضغط لعرض الإجابة', 'Tap for answer')}
                    </Text>
                  </Pressable>
                </Animated.View>
              );
            })}
          </Animated.View>
        )}

        {activeTab === 'keypoints' && (
          <Animated.View entering={FadeIn.duration(300)}>
            <View style={[styles.kpSummary, { backgroundColor: theme.primaryFaded }]}>
              <MaterialIcons name="auto-awesome" size={20} color={theme.primary} />
              <Text style={{ flex: 1, fontSize: 13, color: theme.primary, fontWeight: '500', lineHeight: 20 }}>
                {t(`تم استخراج ${lecture.keyPoints} نقطة مهمة بواسطة AI`, `${lecture.keyPoints} key points extracted by AI`)}
              </Text>
            </View>
            {mainIdeas.map((p, i) => (
              <Animated.View key={i} entering={FadeInDown.delay(i * 60).duration(350)}>
                <View style={[styles.kpCard, { backgroundColor: theme.surface, ...theme.shadow }]}>
                  <View style={[styles.kpPrio, { backgroundColor: (i < 2 ? theme.error : i < 4 ? theme.warning : theme.success) + '15' }]}>
                    <Text style={{ fontSize: 11, fontWeight: '600', color: i < 2 ? theme.error : i < 4 ? theme.warning : theme.success }}>
                      {i < 2 ? t('عالي', 'High') : i < 4 ? t('متوسط', 'Med') : t('عادي', 'Normal')}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 14, color: theme.textPrimary, lineHeight: 22 }}>{p}</Text>
                  {i < 3 && (
                    <View style={styles.kpExam}>
                      <MaterialIcons name="school" size={12} color={theme.error} />
                      <Text style={{ fontSize: 11, color: theme.error, fontWeight: '600' }}>{t('متوقع بالامتحان', 'Expected in exam')}</Text>
                    </View>
                  )}
                </View>
              </Animated.View>
            ))}
          </Animated.View>
        )}
      </ScrollView>

      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12, backgroundColor: theme.background, borderTopColor: theme.borderLight }]}>
        <Pressable onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}
          style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1 }]}>
          <LinearGradient colors={[theme.primary, '#E03A8C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.ctaBtn}>
            <MaterialIcons name="quiz" size={20} color="#FFF" />
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#FFF' }}>{t('ابدأ كويز على هذه المحاضرة', 'Start Quiz on This Lecture')}</Text>
          </LinearGradient>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  stickyHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: 1, gap: 8 },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '600' },
  tabBar: { flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 8, gap: 4 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: 8 },
  heroWrap: { height: 170, borderRadius: 20, marginBottom: 20 },
  heroOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingBottom: 14, paddingTop: 40 },
  heroStats: { flexDirection: 'row', gap: 16 },
  heroStat: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  secTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  ideaCard: { flexDirection: 'row', alignItems: 'flex-start', borderRadius: 14, padding: 14, marginBottom: 8, gap: 12 },
  ideaNum: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  defCard: { borderRadius: 14, padding: 14, marginBottom: 8, borderLeftWidth: 3 },
  hintCard: { flexDirection: 'row', alignItems: 'flex-start', borderRadius: 14, padding: 12, marginBottom: 8, gap: 8 },
  flashcard: { borderRadius: 14, padding: 18, marginBottom: 10, minHeight: 110, justifyContent: 'space-between' },
  fcTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  fcDiff: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  kpSummary: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 14, padding: 14, marginBottom: 16 },
  kpCard: { borderRadius: 14, padding: 14, marginBottom: 8 },
  kpPrio: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginBottom: 8 },
  kpExam: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 8 },
  bottomBar: { paddingHorizontal: 16, paddingTop: 8, borderTopWidth: 1 },
  ctaBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 14, borderRadius: 999 },
});
