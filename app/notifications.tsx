import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useApp } from '../contexts/AppContext';
import { Notification } from '../services/mockData';

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { theme, t, language, notifications, markNotifRead, markAllNotifsRead, unreadNotifCount } = useApp();
  const isRTL = language === 'ar';

  const typeConfig: Record<string, { icon: keyof typeof MaterialIcons.glyphMap; color: string }> = {
    exam: { icon: 'school', color: theme.error },
    quiz: { icon: 'quiz', color: theme.primary },
    study: { icon: 'menu-book', color: theme.accent },
    weakness: { icon: 'warning', color: theme.warning },
    lecture: { icon: 'headset', color: theme.success },
    professor: { icon: 'person', color: theme.primary },
  };

  const renderItem = ({ item, index }: { item: Notification; index: number }) => {
    const cfg = typeConfig[item.type] || { icon: 'notifications' as const, color: theme.primary };
    return (
      <Animated.View entering={FadeInDown.delay(index * 50).duration(300)}>
        <Pressable
          style={[styles.notifCard, { backgroundColor: item.read ? theme.surface : theme.primaryFaded, ...theme.shadow }]}
          onPress={() => { Haptics.selectionAsync(); markNotifRead(item.id); }}
        >
          <View style={[styles.notifIcon, { backgroundColor: cfg.color + '15' }]}>
            <MaterialIcons name={cfg.icon as any} size={20} color={cfg.color} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.notifTitle, { color: theme.textPrimary }]}>{item.title}</Text>
            <Text style={{ fontSize: 13, color: theme.textSecondary, lineHeight: 20, marginTop: 2 }}>{item.body}</Text>
            <Text style={{ fontSize: 11, color: theme.textMuted, marginTop: 4 }}>{item.time}</Text>
          </View>
          {!item.read && <View style={[styles.unreadDot, { backgroundColor: theme.primary }]} />}
        </Pressable>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.header, { borderBottomColor: theme.borderLight }]}>
        <Pressable style={[styles.backBtn, { backgroundColor: theme.surfaceSecondary }]}
          onPress={() => { Haptics.selectionAsync(); router.back(); }}>
          <MaterialIcons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={22} color={theme.textPrimary} />
        </Pressable>
        <Text style={[styles.title, { color: theme.textPrimary }]}>{t('الإشعارات', 'Notifications')}</Text>
        {unreadNotifCount > 0 && (
          <Pressable onPress={() => { Haptics.selectionAsync(); markAllNotifsRead(); }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: theme.primary }}>{t('قراءة الكل', 'Read All')}</Text>
          </Pressable>
        )}
      </View>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: insets.bottom + 16 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  backBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  title: { flex: 1, fontSize: 20, fontWeight: '700' },
  notifCard: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 14, borderRadius: 14, marginBottom: 8 },
  notifIcon: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  notifTitle: { fontSize: 15, fontWeight: '600' },
  unreadDot: { width: 8, height: 8, borderRadius: 4, marginTop: 6 },
});
