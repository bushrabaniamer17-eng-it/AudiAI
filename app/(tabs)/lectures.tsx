import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useApp } from '../../contexts/AppContext';

export default function LecturesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme, t, language, courses, lectures } = useApp();
  const [selectedCourse, setSelectedCourse] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const isRTL = language === 'ar';

  const filteredLectures = useMemo(() => {
    let res = lectures;
    if (selectedCourse !== 'all') res = res.filter((l) => l.courseId === selectedCourse);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      res = res.filter((l) => l.title.toLowerCase().includes(q) || l.summaryPreview.toLowerCase().includes(q));
    }
    return res;
  }, [lectures, selectedCourse, searchQuery]);

  const getStatus = (s: string) => {
    if (s === 'analyzed') return { label: t('جاهز', 'Ready'), color: theme.success, icon: 'check-circle' as const };
    if (s === 'processing') return { label: t('جاري التحليل', 'Processing'), color: theme.warning, icon: 'hourglass-top' as const };
    return { label: t('بانتظار الرفع', 'Pending'), color: theme.textMuted, icon: 'cloud-upload' as const };
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      <Animated.View entering={FadeInDown.duration(300)} style={styles.header}>
        <Text style={[styles.pageTitle, { color: theme.textPrimary }]}>{t('المحاضرات', 'Lectures')}</Text>
        <Pressable style={[styles.uploadBtn, { backgroundColor: theme.primary }]} onPress={() => Haptics.selectionAsync()}>
          <MaterialIcons name="add" size={20} color="#FFF" />
          <Text style={styles.uploadText}>{t('رفع', 'Upload')}</Text>
        </Pressable>
      </Animated.View>

      <Animated.View entering={FadeInDown.delay(80).duration(300)} style={[styles.searchWrap, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
        <MaterialIcons name="search" size={20} color={theme.textMuted} />
        <TextInput
          placeholder={t('البحث في المحاضرات...', 'Search lectures...')}
          placeholderTextColor={theme.textMuted} value={searchQuery} onChangeText={setSearchQuery}
          style={[styles.searchInput, { color: theme.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}
        />
        {searchQuery.length > 0 && <Pressable onPress={() => setSearchQuery('')}><MaterialIcons name="close" size={18} color={theme.textMuted} /></Pressable>}
      </Animated.View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
        <Pressable style={[styles.chip, selectedCourse === 'all' && { backgroundColor: theme.primary, borderColor: theme.primary }]}
          onPress={() => { Haptics.selectionAsync(); setSelectedCourse('all'); }}>
          <Text style={[styles.chipText, selectedCourse === 'all' && { color: '#FFF' }]}>{t('الكل', 'All')}</Text>
        </Pressable>
        {courses.map((c) => (
          <Pressable key={c.id} style={[styles.chip, selectedCourse === c.id && { backgroundColor: c.color, borderColor: c.color }]}
            onPress={() => { Haptics.selectionAsync(); setSelectedCourse(c.id); }}>
            <Text style={[styles.chipText, selectedCourse === c.id && { color: '#FFF' }]}>{c.code}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: insets.bottom + 16, paddingHorizontal: 16 }} showsVerticalScrollIndicator={false}>
        {filteredLectures.length === 0 ? (
          <View style={styles.empty}>
            <Image source={require('../../assets/images/empty-lectures.png')} style={styles.emptyImg} contentFit="contain" />
            <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>{t('لا توجد محاضرات', 'No Lectures')}</Text>
            <Text style={{ fontSize: 14, color: theme.textSecondary, textAlign: 'center' }}>{t('ارفع محاضراتك وسيحللها الذكاء الاصطناعي', 'Upload your lectures and AI will analyze them')}</Text>
          </View>
        ) : filteredLectures.map((lec, idx) => {
          const course = courses.find((c) => c.id === lec.courseId);
          const status = getStatus(lec.status);
          return (
            <Animated.View key={lec.id} entering={FadeInRight.delay(200 + idx * 60).duration(350)}>
              <Pressable style={[styles.lecCard, { backgroundColor: theme.surface, ...theme.shadow }]}
                onPress={() => { Haptics.selectionAsync(); router.push(`/lecture/${lec.id}`); }}>
                <View style={styles.lecTop}>
                  <View style={[styles.courseTag, { backgroundColor: (course?.color || theme.primary) + '15' }]}>
                    <View style={[styles.tagDot, { backgroundColor: course?.color || theme.primary }]} />
                    <Text style={{ fontSize: 12, fontWeight: '600', color: course?.color || theme.primary }}>{course?.code}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: status.color + '15' }]}>
                    <MaterialIcons name={status.icon} size={12} color={status.color} />
                    <Text style={{ fontSize: 11, fontWeight: '600', color: status.color }}>{status.label}</Text>
                  </View>
                </View>
                <Text style={[styles.lecTitle, { color: theme.textPrimary }]}>{lec.title}</Text>
                <Text style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 20, marginBottom: 10 }} numberOfLines={2}>{lec.summaryPreview}</Text>
                <View style={styles.lecBottom}>
                  <View style={styles.lecMeta}><MaterialIcons name="calendar-today" size={12} color={theme.textMuted} /><Text style={{ fontSize: 12, color: theme.textMuted }}>{lec.date}</Text></View>
                  <View style={styles.lecMeta}><MaterialIcons name="schedule" size={12} color={theme.textMuted} /><Text style={{ fontSize: 12, color: theme.textMuted }}>{lec.duration}</Text></View>
                  {lec.status === 'analyzed' && <>
                    <View style={styles.lecMeta}><MaterialIcons name="lightbulb" size={12} color={theme.primary} /><Text style={{ fontSize: 12, color: theme.primary }}>{lec.keyPoints} {t('نقطة', 'pts')}</Text></View>
                    <View style={styles.lecMeta}><MaterialIcons name="style" size={12} color={theme.accent} /><Text style={{ fontSize: 12, color: theme.accentDark }}>{lec.flashcards} {t('بطاقة', 'cards')}</Text></View>
                  </>}
                </View>
              </Pressable>
            </Animated.View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 12 },
  pageTitle: { fontSize: 28, fontWeight: '700' },
  uploadBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999 },
  uploadText: { fontSize: 14, fontWeight: '600', color: '#FFF' },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, marginHorizontal: 16, marginBottom: 12, paddingHorizontal: 12, height: 44, borderRadius: 14, borderWidth: 1 },
  searchInput: { flex: 1, fontSize: 15 },
  chipRow: { paddingHorizontal: 16, gap: 8, paddingBottom: 12 },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999, backgroundColor: '#F3F4F6', borderWidth: 1, borderColor: '#E5E7EB' },
  chipText: { fontSize: 13, fontWeight: '600', color: '#6B7280' },
  empty: { alignItems: 'center', paddingTop: 60, paddingHorizontal: 32 },
  emptyImg: { width: 180, height: 180, marginBottom: 20 },
  emptyTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  lecCard: { borderRadius: 14, padding: 16, marginBottom: 10 },
  lecTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  courseTag: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, gap: 4 },
  tagDot: { width: 6, height: 6, borderRadius: 3 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, gap: 4 },
  lecTitle: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  lecBottom: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  lecMeta: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
