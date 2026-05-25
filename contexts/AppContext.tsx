import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { lightTheme, darkTheme, Theme, ThemeMode } from '../constants/theme';
import {
  mockStudent, mockCourses, mockLectures, mockQuizzes,
  mockStudyTasks, mockWeakPoints, mockNotifications,
  StudentProfile, Course, Lecture, Quiz, StudyTask, WeakPoint, Notification, ChatMessage,
} from '../services/mockData';

export type Language = 'ar' | 'en';

interface AppContextType {
  // Theme
  theme: Theme;
  themeMode: ThemeMode;
  toggleTheme: () => void;

  // Language
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (ar: string, en: string) => string;

  // Onboarding
  isOnboarded: boolean;
  completeOnboarding: () => void;

  // Student
  student: StudentProfile;
  updateStudent: (data: Partial<StudentProfile>) => void;

  // Data
  courses: Course[];
  lectures: Lecture[];
  quizzes: Quiz[];
  studyTasks: StudyTask[];
  weakPoints: WeakPoint[];
  notifications: Notification[];
  unreadNotifCount: number;

  // Actions
  toggleTaskComplete: (id: string) => void;
  updateQuizScore: (quizId: string, score: number) => void;
  markNotifRead: (id: string) => void;
  markAllNotifsRead: () => void;

  // Chat
  chatMessages: ChatMessage[];
  addChatMessage: (msg: ChatMessage) => void;
  clearChat: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [themeMode, setThemeMode] = useState<ThemeMode>('light');
  const [language, setLanguage] = useState<Language>('en');
  const [isOnboarded, setIsOnboarded] = useState(false);
  const [student, setStudent] = useState<StudentProfile>(mockStudent);
  const [courses] = useState<Course[]>(mockCourses);
  const [lectures] = useState<Lecture[]>(mockLectures);
  const [quizzes, setQuizzes] = useState<Quiz[]>(mockQuizzes);
  const [studyTasks, setStudyTasks] = useState<StudyTask[]>(mockStudyTasks);
  const [weakPoints] = useState<WeakPoint[]>(mockWeakPoints);
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);

  const currentTheme = themeMode === 'light' ? lightTheme : darkTheme;

  const toggleTheme = useCallback(() => {
    setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const t = useCallback((ar: string, en: string) => (language === 'ar' ? ar : en), [language]);

  const completeOnboarding = useCallback(() => setIsOnboarded(true), []);

  const updateStudent = useCallback((data: Partial<StudentProfile>) => {
    setStudent((prev) => ({ ...prev, ...data }));
  }, []);

  const toggleTaskComplete = useCallback((id: string) => {
    setStudyTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }, []);

  const updateQuizScore = useCallback((quizId: string, score: number) => {
    setQuizzes((prev) =>
      prev.map((q) =>
        q.id === quizId
          ? { ...q, bestScore: Math.max(q.bestScore || 0, score), attempts: q.attempts + 1 }
          : q
      )
    );
  }, []);

  const markNotifRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllNotifsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const addChatMessage = useCallback((msg: ChatMessage) => {
    setChatMessages((prev) => [...prev, msg]);
  }, []);

  const clearChat = useCallback(() => setChatMessages([]), []);

  const unreadNotifCount = notifications.filter((n) => !n.read).length;

  return (
    <AppContext.Provider
      value={{
        theme: currentTheme, themeMode, toggleTheme,
        language, setLanguage, t,
        isOnboarded, completeOnboarding,
        student, updateStudent,
        courses, lectures, quizzes, studyTasks, weakPoints,
        notifications, unreadNotifCount,
        toggleTaskComplete, updateQuizScore, markNotifRead, markAllNotifsRead,
        chatMessages, addChatMessage, clearChat,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
