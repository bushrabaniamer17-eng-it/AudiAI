import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useApp } from '../../contexts/AppContext';
import { ChatMessage } from '../../services/mockData';

const aiResponses = [
  'الأشجار الثنائية (Binary Trees) هي هيكل بيانات شجري حيث كل عقدة لها طفلين كحد أقصى. التطبيقات: البحث السريع O(log n)، الترتيب، وتمثيل التعبيرات الرياضية.',
  'Merge Sort يعمل بمبدأ "فرّق تسُد" (Divide and Conquer):\n1. قسّم المصفوفة لنصفين\n2. رتّب كل نصف recursively\n3. ادمج النصفين\n\nالتعقيد: O(n log n) دائماً.',
  'SQL JOINs:\n• INNER JOIN: يرجع الصفوف المشتركة فقط\n• LEFT JOIN: كل صفوف الجدول الأيسر + المشتركة\n• RIGHT JOIN: كل صفوف الجدول الأيمن\n• FULL JOIN: كل الصفوف من الجدولين',
  'نصيحة للامتحان: ركز على المقارنة بين Array و Linked List من حيث التعقيد الزمني لكل عملية. هذا السؤال يتكرر كثيراً.',
];

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const { theme, t, language, chatMessages, addChatMessage } = useApp();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const isRTL = language === 'ar';

  const handleSend = () => {
    if (!input.trim()) return;
    Haptics.selectionAsync();

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: input.trim(),
      timestamp: new Date().toLocaleTimeString('ar-JO', { hour: '2-digit', minute: '2-digit' }),
    };
    addChatMessage(userMsg);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const randomReply = aiResponses[Math.floor(Math.random() * aiResponses.length)];
      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: randomReply,
        timestamp: new Date().toLocaleTimeString('ar-JO', { hour: '2-digit', minute: '2-digit' }),
      };
      addChatMessage(aiMsg);
      setIsTyping(false);
    }, 1500);
  };

  const quickQuestions = [
    t('اشرح لي Binary Trees', 'Explain Binary Trees'),
    t('كيف يعمل Merge Sort؟', 'How does Merge Sort work?'),
    t('ما هو SQL JOIN؟', 'What is SQL JOIN?'),
    t('نصائح للامتحان', 'Exam tips'),
  ];

  const renderMessage = ({ item }: { item: ChatMessage }) => {
    const isUser = item.role === 'user';
    return (
      <Animated.View entering={FadeInDown.duration(300)} style={[styles.msgRow, isUser && styles.msgRowUser]}>
        {!isUser && (
          <View style={[styles.avatar, { backgroundColor: theme.primaryFaded }]}>
            <MaterialIcons name="smart-toy" size={18} color={theme.primary} />
          </View>
        )}
        <View style={[
          styles.bubble,
          isUser ? { backgroundColor: theme.primary } : { backgroundColor: theme.surface, ...theme.shadow },
          { maxWidth: '78%' },
        ]}>
          <Text style={[styles.bubbleText, { color: isUser ? '#FFF' : theme.textPrimary }]}>{item.content}</Text>
          <Text style={[styles.timeText, { color: isUser ? 'rgba(255,255,255,0.6)' : theme.textMuted }]}>{item.timestamp}</Text>
        </View>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.borderLight }]}>
        <View style={[styles.headerIcon, { backgroundColor: theme.primaryFaded }]}>
          <MaterialIcons name="smart-toy" size={22} color={theme.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.headerTitle, { color: theme.textPrimary }]}>{t('المساعد الذكي', 'AI Assistant')}</Text>
          <Text style={{ fontSize: 12, color: theme.success, fontWeight: '500' }}>{t('متصل', 'Online')}</Text>
        </View>
        <Pressable style={[styles.headerBtn, { backgroundColor: theme.surfaceSecondary }]} onPress={() => Haptics.selectionAsync()}>
          <MaterialIcons name="more-vert" size={20} color={theme.textSecondary} />
        </Pressable>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }} keyboardVerticalOffset={90}>
        {chatMessages.length === 0 ? (
          <ScrollView contentContainerStyle={styles.emptyWrap} showsVerticalScrollIndicator={false}>
            <Animated.View entering={FadeIn.duration(500)} style={{ alignItems: 'center' }}>
              <Image source={require('../../assets/images/ai-chat-empty.png')} style={styles.emptyImg} contentFit="contain" transition={300} />
              <Text style={[styles.emptyTitle, { color: theme.textPrimary }]}>{t('مرحباً! أنا مساعدك الذكي', 'Hi! I am your AI Assistant')}</Text>
              <Text style={[styles.emptyDesc, { color: theme.textSecondary }]}>
                {t('اسألني أي سؤال أكاديمي وسأساعدك في فهمه', 'Ask me any academic question and I will help you understand it')}
              </Text>
              <View style={styles.quickGrid}>
                {quickQuestions.map((q, i) => (
                  <Pressable key={i} style={[styles.quickChip, { backgroundColor: theme.surface, borderColor: theme.border, ...theme.shadow }]}
                    onPress={() => { setInput(q); }}>
                    <MaterialIcons name="lightbulb" size={14} color={theme.accent} />
                    <Text style={{ fontSize: 13, color: theme.textPrimary, fontWeight: '500', flex: 1 }}>{q}</Text>
                  </Pressable>
                ))}
              </View>
            </Animated.View>
          </ScrollView>
        ) : (
          <FlatList
            ref={flatListRef}
            data={chatMessages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, paddingBottom: 8 }}
            onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
            showsVerticalScrollIndicator={false}
            ListFooterComponent={isTyping ? (
              <View style={[styles.msgRow]}>
                <View style={[styles.avatar, { backgroundColor: theme.primaryFaded }]}>
                  <MaterialIcons name="smart-toy" size={18} color={theme.primary} />
                </View>
                <View style={[styles.typingBubble, { backgroundColor: theme.surface, ...theme.shadow }]}>
                  <View style={styles.typingDots}>
                    {[0, 1, 2].map((i) => (
                      <Animated.View key={i} entering={FadeIn.delay(i * 200).duration(400)}
                        style={[styles.dot, { backgroundColor: theme.primary }]} />
                    ))}
                  </View>
                </View>
              </View>
            ) : null}
          />
        )}

        {/* Input */}
        <View style={[styles.inputBar, { backgroundColor: theme.background, borderTopColor: theme.borderLight, paddingBottom: insets.bottom + 8 }]}>
          <Pressable style={[styles.attachBtn, { backgroundColor: theme.surfaceSecondary }]} onPress={() => Haptics.selectionAsync()}>
            <MaterialIcons name="attach-file" size={20} color={theme.textMuted} />
          </Pressable>
          <View style={[styles.inputWrap, { backgroundColor: theme.surfaceSecondary, borderColor: theme.border }]}>
            <TextInput
              placeholder={t('اكتب سؤالك...', 'Type your question...')}
              placeholderTextColor={theme.textMuted}
              value={input} onChangeText={setInput}
              multiline maxLength={500}
              style={[styles.textInput, { color: theme.textPrimary, textAlign: isRTL ? 'right' : 'left' }]}
            />
          </View>
          <Pressable
            onPress={handleSend}
            disabled={!input.trim()}
            style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
          >
            <LinearGradient
              colors={input.trim() ? [theme.primary, '#1E3A5F'] : [theme.border, theme.border]}
              style={styles.sendBtn}
            >
              <MaterialIcons name="send" size={20} color="#FFF" style={{ transform: [{ scaleX: isRTL ? -1 : 1 }] }} />
            </LinearGradient>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  headerIcon: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, fontWeight: '700' },
  headerBtn: { width: 36, height: 36, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  emptyWrap: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32, paddingBottom: 40 },
  emptyImg: { width: 160, height: 160, marginBottom: 16 },
  emptyTitle: { fontSize: 18, fontWeight: '700', textAlign: 'center' },
  emptyDesc: { fontSize: 14, textAlign: 'center', lineHeight: 22, marginTop: 6, marginBottom: 24 },
  quickGrid: { width: '100%', gap: 8 },
  quickChip: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 12, borderRadius: 14, borderWidth: 1 },
  msgRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 12, gap: 8 },
  msgRowUser: { flexDirection: 'row-reverse' },
  avatar: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  bubble: { paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16 },
  bubbleText: { fontSize: 14, lineHeight: 22 },
  timeText: { fontSize: 10, marginTop: 4, textAlign: 'right' },
  typingBubble: { paddingHorizontal: 16, paddingVertical: 14, borderRadius: 16 },
  typingDots: { flexDirection: 'row', gap: 4 },
  dot: { width: 8, height: 8, borderRadius: 4, opacity: 0.5 },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, paddingHorizontal: 12, paddingTop: 8, borderTopWidth: 1 },
  attachBtn: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 1 },
  inputWrap: { flex: 1, borderRadius: 20, borderWidth: 1, paddingHorizontal: 14, minHeight: 42, maxHeight: 100, justifyContent: 'center' },
  textInput: { fontSize: 15, paddingVertical: 8 },
  sendBtn: { width: 42, height: 42, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 1 },
});
