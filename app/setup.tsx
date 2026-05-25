import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, ScrollView, FlatList, Modal } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useApp } from '../contexts/AppContext';
import { jordanianUniversities, commonMajors, academicYears, University } from '../constants/universities';

type Step = 1 | 2 | 3;

export default function SetupScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { theme, t, language, completeOnboarding, updateStudent } = useApp();
  const isRTL = language === 'ar';

  const [step, setStep] = useState<Step>(1);
  const [studentId, setStudentId] = useState('');
  const [selectedUni, setSelectedUni] = useState<University | null>(null);
  const [selectedMajor, setSelectedMajor] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [uniSearch, setUniSearch] = useState('');
  const [showUniModal, setShowUniModal] = useState(false);
  const [showMajorModal, setShowMajorModal] = useState(false);

  const filteredUnis = useMemo(() => {
    const q = uniSearch.toLowerCase();
    if (!q) return jordanianUniversities;
    return jordanianUniversities.filter(
      (u) => u.nameAr.includes(q) || u.nameEn.toLowerCase().includes(q)
    );
  }, [uniSearch]);

  const handleFinish = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    updateStudent({
      universityId: studentId,
      university: selectedUni ? (isRTL ? selectedUni.nameAr : selectedUni.nameEn) : '',
      major: selectedMajor,
      year: selectedYear,
    });
    completeOnboarding();
    router.replace('/(tabs)');
  };

  const canProceed = () => {
    if (step === 1) return studentId.length >= 3 && selectedUni !== null;
    if (step === 2) return selectedMajor.length > 0 && selectedYear.length > 0;
    return true;
  };

  const stepTitles = [
    t('بيانات الجامعة', 'University Info'),
    t('التخصص والسنة', 'Major & Year'),
    t('جاهز للانطلاق!', 'Ready to Go!'),
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Progress */}
      <Animated.View entering={FadeInDown.duration(300)} style={styles.topBar}>
        <Pressable style={[styles.backBtn, { backgroundColor: theme.surfaceSecondary }]} onPress={() => {
          Haptics.selectionAsync();
          if (step > 1) setStep((s) => (s - 1) as Step);
          else router.back();
        }}>
          <MaterialIcons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={22} color={theme.textPrimary} />
        </Pressable>
        <View style={styles.progressRow}>
          {[1, 2, 3].map((s) => (
            <View key={s} style={[styles.progressDot, { backgroundColor: s <= step ? theme.primary : theme.border }]} />
          ))}
        </View>
        <Text style={[styles.stepLabel, { color: theme.textMuted }]}>{step}/3</Text>
      </Animated.View>

      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 80 }} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={styles.headerBlock}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>{stepTitles[step - 1]}</Text>
        </Animated.View>

        {/* Step 1: University */}
        {step === 1 && (
          <View style={styles.formArea}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>{t('الرقم الجامعي', 'Student ID')}</Text>
            <View style={[styles.inputWrap, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
              <MaterialIcons name="badge" size={20} color={theme.textMuted} />
              <TextInput
                placeholder={t('مثال: 202310451', 'e.g. 202310451')}
                placeholderTextColor={theme.textMuted}
                value={studentId} onChangeText={setStudentId}
                keyboardType="number-pad"
                style={[styles.input, { color: theme.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}
              />
            </View>

            <Text style={[styles.label, { color: theme.textSecondary, marginTop: 20 }]}>{t('اسم الجامعة', 'University')}</Text>
            <Pressable
              style={[styles.selectBtn, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}
              onPress={() => { Haptics.selectionAsync(); setShowUniModal(true); }}
            >
              <MaterialIcons name="school" size={20} color={theme.textMuted} />
              <Text style={[styles.selectText, selectedUni ? { color: theme.textPrimary } : { color: theme.textMuted }, { flex: 1, textAlign: isRTL ? 'right' : 'left' }]}>
                {selectedUni ? (isRTL ? selectedUni.nameAr : selectedUni.nameEn) : t('اختر الجامعة', 'Select University')}
              </Text>
              <MaterialIcons name="expand-more" size={20} color={theme.textMuted} />
            </Pressable>

            {selectedUni && (
              <Animated.View entering={FadeInDown.duration(300)} style={[styles.uniCard, { backgroundColor: theme.primaryFaded, borderColor: theme.primary + '30' }]}>
                <View style={[styles.uniType, { backgroundColor: selectedUni.type === 'public' ? theme.successLight : theme.accentFaded }]}>
                  <Text style={{ fontSize: 11, fontWeight: '600', color: selectedUni.type === 'public' ? theme.success : theme.accentDark }}>
                    {selectedUni.type === 'public' ? t('حكومية', 'Public') : t('خاصة', 'Private')}
                  </Text>
                </View>
                <Text style={[styles.uniName, { color: theme.textPrimary }]}>{isRTL ? selectedUni.nameAr : selectedUni.nameEn}</Text>
                {selectedUni.city ? <Text style={{ fontSize: 12, color: theme.textSecondary }}>{selectedUni.city}</Text> : null}
              </Animated.View>
            )}
          </View>
        )}

        {/* Step 2: Major & Year */}
        {step === 2 && (
          <View style={styles.formArea}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>{t('التخصص', 'Major')}</Text>
            <Pressable
              style={[styles.selectBtn, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}
              onPress={() => { Haptics.selectionAsync(); setShowMajorModal(true); }}
            >
              <MaterialIcons name="menu-book" size={20} color={theme.textMuted} />
              <Text style={[styles.selectText, selectedMajor ? { color: theme.textPrimary } : { color: theme.textMuted }, { flex: 1, textAlign: isRTL ? 'right' : 'left' }]}>
                {selectedMajor || t('اختر التخصص', 'Select Major')}
              </Text>
              <MaterialIcons name="expand-more" size={20} color={theme.textMuted} />
            </Pressable>

            <Text style={[styles.label, { color: theme.textSecondary, marginTop: 20 }]}>{t('السنة الدراسية', 'Academic Year')}</Text>
            <View style={styles.yearGrid}>
              {academicYears.map((year) => {
                const selected = selectedYear === (isRTL ? year.nameAr : year.nameEn);
                return (
                  <Pressable key={year.id}
                    style={[styles.yearChip, { backgroundColor: selected ? theme.primary : theme.surfaceSecondary, borderColor: selected ? theme.primary : theme.border }]}
                    onPress={() => { Haptics.selectionAsync(); setSelectedYear(isRTL ? year.nameAr : year.nameEn); }}
                  >
                    <Text style={[styles.yearText, { color: selected ? '#FFF' : theme.textPrimary }]}>
                      {isRTL ? year.nameAr : year.nameEn}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {/* Step 3: Ready */}
        {step === 3 && (
          <View style={[styles.formArea, { alignItems: 'center', paddingTop: 32 }]}>
            <View style={[styles.readyIcon, { backgroundColor: theme.primaryFaded }]}>
              <MaterialIcons name="rocket-launch" size={48} color={theme.primary} />
            </View>
            <Text style={[styles.readyTitle, { color: theme.textPrimary }]}>
              {t('أنت جاهز!', 'You are all set!')}
            </Text>
            <Text style={[styles.readyDesc, { color: theme.textSecondary }]}>
              {t('سيقوم AudiAI بتخصيص تجربتك الأكاديمية بناءً على بياناتك', 'AudiAI will personalize your academic experience based on your data')}
            </Text>
            <View style={[styles.summaryCard, { backgroundColor: theme.surface, ...theme.shadow }]}>
              {[
                { icon: 'school' as const, label: selectedUni ? (isRTL ? selectedUni.nameAr : selectedUni.nameEn) : '' },
                { icon: 'menu-book' as const, label: selectedMajor },
                { icon: 'event' as const, label: selectedYear },
                { icon: 'badge' as const, label: studentId },
              ].map((item, i) => (
                <View key={i} style={[styles.summaryRow, i < 3 && { borderBottomWidth: 1, borderBottomColor: theme.borderLight }]}>
                  <MaterialIcons name={item.icon} size={18} color={theme.primary} />
                  <Text style={[styles.summaryText, { color: theme.textPrimary }]}>{item.label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 12, backgroundColor: theme.background, borderTopColor: theme.borderLight }]}>
        <Pressable
          onPress={() => {
            Haptics.selectionAsync();
            if (step < 3) setStep((s) => (s + 1) as Step);
            else handleFinish();
          }}
          disabled={!canProceed()}
          style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }]}
        >
          <LinearGradient
            colors={canProceed() ? [theme.primary, '#1E3A5F'] : [theme.border, theme.border]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
            style={styles.ctaBtn}
          >
            <Text style={styles.ctaText}>
              {step < 3 ? t('التالي', 'Next') : t('ابدأ رحلتك', 'Start Your Journey')}
            </Text>
            <MaterialIcons name={isRTL ? 'arrow-back' : 'arrow-forward'} size={20} color="#FFF" />
          </LinearGradient>
        </Pressable>
      </View>

      {/* University Modal */}
      <Modal visible={showUniModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.borderLight }]}>
            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>{t('اختر الجامعة', 'Select University')}</Text>
            <Pressable onPress={() => setShowUniModal(false)}>
              <MaterialIcons name="close" size={24} color={theme.textSecondary} />
            </Pressable>
          </View>
          <View style={[styles.modalSearch, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
            <MaterialIcons name="search" size={20} color={theme.textMuted} />
            <TextInput
              placeholder={t('ابحث عن جامعتك...', 'Search university...')}
              placeholderTextColor={theme.textMuted}
              value={uniSearch} onChangeText={setUniSearch}
              style={[styles.input, { color: theme.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}
            />
          </View>
          <FlatList
            data={filteredUnis}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            renderItem={({ item }) => (
              <Pressable
                style={[styles.uniListItem, { borderBottomColor: theme.borderLight },
                  selectedUni?.id === item.id && { backgroundColor: theme.primaryFaded }]}
                onPress={() => { Haptics.selectionAsync(); setSelectedUni(item); setShowUniModal(false); setUniSearch(''); }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.uniListName, { color: theme.textPrimary }]}>{isRTL ? item.nameAr : item.nameEn}</Text>
                  <Text style={{ fontSize: 12, color: theme.textMuted }}>
                    {isRTL ? item.nameEn : item.nameAr} {item.city ? `• ${item.city}` : ''}
                  </Text>
                </View>
                <View style={[styles.uniListType, { backgroundColor: item.type === 'public' ? theme.successLight : theme.accentFaded }]}>
                  <Text style={{ fontSize: 10, fontWeight: '600', color: item.type === 'public' ? theme.success : theme.accentDark }}>
                    {item.type === 'public' ? t('حكومية', 'Public') : t('خاصة', 'Private')}
                  </Text>
                </View>
              </Pressable>
            )}
          />
        </SafeAreaView>
      </Modal>

      {/* Major Modal */}
      <Modal visible={showMajorModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.borderLight }]}>
            <Text style={[styles.modalTitle, { color: theme.textPrimary }]}>{t('اختر التخصص', 'Select Major')}</Text>
            <Pressable onPress={() => setShowMajorModal(false)}>
              <MaterialIcons name="close" size={24} color={theme.textSecondary} />
            </Pressable>
          </View>
          <FlatList
            data={commonMajors}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 16 }}
            renderItem={({ item }) => (
              <Pressable
                style={[styles.uniListItem, { borderBottomColor: theme.borderLight },
                  selectedMajor === (isRTL ? item.nameAr : item.nameEn) && { backgroundColor: theme.primaryFaded }]}
                onPress={() => { Haptics.selectionAsync(); setSelectedMajor(isRTL ? item.nameAr : item.nameEn); setShowMajorModal(false); }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={[styles.uniListName, { color: theme.textPrimary }]}>{isRTL ? item.nameAr : item.nameEn}</Text>
                  <Text style={{ fontSize: 12, color: theme.textMuted }}>{isRTL ? item.nameEn : item.nameAr}</Text>
                </View>
                {selectedMajor === (isRTL ? item.nameAr : item.nameEn) ? <MaterialIcons name="check-circle" size={22} color={theme.primary} /> : null}
              </Pressable>
            )}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, gap: 12 },
  backBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  progressRow: { flex: 1, flexDirection: 'row', gap: 6, justifyContent: 'center' },
  progressDot: { width: 32, height: 4, borderRadius: 2 },
  stepLabel: { fontSize: 13, fontWeight: '600', width: 30, textAlign: 'center' },
  headerBlock: { paddingHorizontal: 24, marginTop: 12, marginBottom: 24 },
  title: { fontSize: 24, fontWeight: '700' },
  formArea: { paddingHorizontal: 24 },
  label: { fontSize: 13, fontWeight: '600', marginBottom: 8 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, height: 52, borderRadius: 16, borderWidth: 1,
  },
  input: { flex: 1, fontSize: 15, fontWeight: '500' },
  selectBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 16, height: 52, borderRadius: 16, borderWidth: 1,
  },
  selectText: { fontSize: 15, fontWeight: '500' },
  uniCard: { marginTop: 12, padding: 14, borderRadius: 14, borderWidth: 1, gap: 4 },
  uniType: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  uniName: { fontSize: 15, fontWeight: '600' },
  yearGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  yearChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1 },
  yearText: { fontSize: 13, fontWeight: '600' },
  readyIcon: { width: 100, height: 100, borderRadius: 30, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  readyTitle: { fontSize: 24, fontWeight: '700', marginBottom: 8 },
  readyDesc: { fontSize: 14, textAlign: 'center', lineHeight: 22, paddingHorizontal: 16 },
  summaryCard: { width: '100%', marginTop: 24, borderRadius: 16, overflow: 'hidden' },
  summaryRow: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  summaryText: { fontSize: 14, fontWeight: '500' },
  bottomBar: { paddingHorizontal: 24, paddingTop: 8, borderTopWidth: 1 },
  ctaBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 16, borderRadius: 999,
  },
  ctaText: { fontSize: 17, fontWeight: '700', color: '#FFF' },
  modalContainer: { flex: 1 },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1,
  },
  modalTitle: { fontSize: 18, fontWeight: '700' },
  modalSearch: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    marginHorizontal: 16, marginVertical: 12, paddingHorizontal: 14, height: 44, borderRadius: 12, borderWidth: 1,
  },
  uniListItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, gap: 12, paddingHorizontal: 4 },
  uniListName: { fontSize: 15, fontWeight: '600' },
  uniListType: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
});
