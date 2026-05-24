import { MaterialIcons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Platform, View, Text } from 'react-native';
import { useApp } from '../../contexts/AppContext';

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const { theme, unreadNotifCount, t } = useApp();

  const tabBarStyle = {
    height: Platform.select({
      ios: insets.bottom + 64,
      android: insets.bottom + 64,
      default: 70,
    }),
    paddingTop: 8,
    paddingBottom: Platform.select({
      ios: insets.bottom + 8,
      android: insets.bottom + 8,
      default: 8,
    }),
    paddingHorizontal: 4,
    backgroundColor: theme.tabBarBg,
    borderTopWidth: 1,
    borderTopColor: theme.borderLight,
    elevation: 0,
    shadowOpacity: 0,
  };

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textMuted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('الرئيسية', 'Home'),
          tabBarIcon: ({ color, size }) => <MaterialIcons name="home-filled" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="lectures"
        options={{
          title: t('المحاضرات', 'Lectures'),
          tabBarIcon: ({ color, size }) => <MaterialIcons name="headset" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="quizzes"
        options={{
          title: t('الكويزات', 'Quizzes'),
          tabBarIcon: ({ color, size }) => <MaterialIcons name="quiz" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: t('المساعد', 'AI Chat'),
          tabBarIcon: ({ color, size }) => (
            <View>
              <MaterialIcons name="smart-toy" size={size} color={color} />
              <View style={{
                position: 'absolute', top: -2, right: -4, width: 8, height: 8,
                borderRadius: 4, backgroundColor: theme.accent,
              }} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('حسابي', 'Profile'),
          tabBarIcon: ({ color, size }) => <MaterialIcons name="person" size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}
