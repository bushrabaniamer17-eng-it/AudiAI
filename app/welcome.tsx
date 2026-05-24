import React from 'react';
import { View, Text, Pressable, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useApp } from '../contexts/AppContext';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();
  const { theme, language, setLanguage, t } = useApp();

  const handleContinue = () => {
    Haptics.selectionAsync();
    router.push('/login');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Language Toggle */}
      <Animated.View entering={FadeIn.delay(200).duration(400)} style={styles.langRow}>
        <Pressable
          style={[styles.langBtn, language === 'ar' && { backgroundColor: theme.primary }]}
          onPress={() => { Haptics.selectionAsync(); setLanguage('ar'); }}
        >
          <Text style={[styles.langText, language === 'ar' && { color: '#FFF' }]}>العربية</Text>
        </Pressable>
        <Pressable
          style={[styles.langBtn, language === 'en' && { backgroundColor: theme.primary }]}
          onPress={() => { Haptics.selectionAsync(); setLanguage('en'); }}
        >
          <Text style={[styles.langText, language === 'en' && { color: '#FFF' }]}>English</Text>
        </Pressable>
      </Animated.View>

      {/* Hero Image */}
      <Animated.View entering={FadeInDown.delay(300).duration(600)} style={styles.heroWrap}>
        <Image
          source={require('../assets/images/welcome-hero.png')}
          style={styles.heroImage}
          contentFit="contain"
          transition={300}
        />
      </Animated.View>

      {/* Text */}
      <Animated.View entering={FadeInDown.delay(500).duration(600)} style={styles.textBlock}>
        <Text style={[styles.appName, { color: theme.primary }]}>AudiAI</Text>
        <Text style={[styles.headline, { color: theme.textPrimary }]}>
          {t('مساعدك الأكاديمي الذكي', 'Your Smart Academic Assistant')}
        </Text>
        <Text style={[styles.subhead, { color: theme.textSecondary }]}>
          {t(
            'حلّل محاضراتك، أنشئ كويزات ذكية، واكتشف نقاط ضعفك باستخدام الذكاء الاصطناعي',
            'Analyze lectures, create smart quizzes, and discover your weaknesses using AI'
          )}
        </Text>
      </Animated.View>

      {/* Features */}
      <Animated.View entering={FadeInDown.delay(700).duration(600)} style={styles.features}>
        {[
          { icon: 'auto-awesome' as const, text: t('تلخيص بالذكاء الاصطناعي', 'AI-Powered Summaries') },
          { icon: 'quiz' as const, text: t('كويزات تكيفية', 'Adaptive Quizzes') },
          { icon: 'trending-up' as const, text: t('تتبع تقدمك', 'Track Your Progress') },
        ].map((f, i) => (
          <View key={i} style={styles.featureRow}>
            <View style={[styles.featureIcon, { backgroundColor: theme.primaryFaded }]}>
              <MaterialIcons name={f.icon} size={18} color={theme.primary} />
            </View>
            <Text style={[styles.featureText, { color: theme.textPrimary }]}>{f.text}</Text>
          </View>
        ))}
      </Animated.View>

      {/* CTA */}
      <Animated.View entering={FadeInDown.delay(900).duration(600)} style={styles.ctaWrap}>
        <Pressable onPress={handleContinue} style={({ pressed }) => [{ opacity: pressed ? 0.9 : 1, transform: [{ scale: pressed ? 0.98 : 1 }] }]}>
          <LinearGradient
            colors={[theme.primary, theme.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaButton}
          >
            <Text style={styles.ctaText}>{t('ابدأ الآن', 'Get Started')}</Text>
            <MaterialIcons name={language === 'ar' ? 'arrow-back' : 'arrow-forward'} size={20} color="#FFF" />
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  langRow: {
    flexDirection: 'row', justifyContent: 'center', gap: 8, paddingTop: 12, paddingBottom: 8,
  },
  langBtn: {
    paddingHorizontal: 20, paddingVertical: 8, borderRadius: 999,
    backgroundColor: '#F3F4F6',
  },
  langText: { fontSize: 14, fontWeight: '600', color: '#6B7280' },
  heroWrap: { alignItems: 'center', paddingTop: 8 },
  heroImage: { width: width * 0.65, height: width * 0.65 },
  textBlock: { alignItems: 'center', paddingHorizontal: 32, marginTop: 8 },
  appName: { fontSize: 36, fontWeight: '800', letterSpacing: -1 },
  headline: { fontSize: 20, fontWeight: '700', textAlign: 'center', marginTop: 8 },
  subhead: { fontSize: 14, textAlign: 'center', lineHeight: 22, marginTop: 8 },
  features: { paddingHorizontal: 40, marginTop: 24, gap: 12 },
  featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  featureIcon: {
    width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center',
  },
  featureText: { fontSize: 14, fontWeight: '500' },
  ctaWrap: { paddingHorizontal: 24, marginTop: 'auto', marginBottom: 24 },
  ctaButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 16, borderRadius: 999,
  },
  ctaText: { fontSize: 18, fontWeight: '700', color: '#FFF' },
});
