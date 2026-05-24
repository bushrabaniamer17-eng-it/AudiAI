export const config = {
  appName: 'AudiAI',
  appNameAr: 'أودي آي',
  appDescription: 'مساعدك الأكاديمي الذكي',
  appDescriptionEn: 'Your Smart Academic Assistant',
  version: '1.0.0',

  quiz: {
    timePerQuestion: 60,
    passingScore: 70,
    questionsPerQuiz: 10,
  },

  studyPlan: {
    defaultHoursPerDay: 4,
    breakInterval: 25,
    breakDuration: 5,
  },

  difficulty: {
    easy: { labelAr: 'سهل', labelEn: 'Easy' },
    medium: { labelAr: 'متوسط', labelEn: 'Medium' },
    hard: { labelAr: 'صعب', labelEn: 'Hard' },
  },

  questionTypes: {
    multipleChoice: { labelAr: 'اختيار من متعدد', labelEn: 'Multiple Choice' },
    trueFalse: { labelAr: 'صح أو خطأ', labelEn: 'True or False' },
    fillBlank: { labelAr: 'أكمل الفراغ', labelEn: 'Fill in the Blank' },
    essay: { labelAr: 'سؤال مقالي', labelEn: 'Essay' },
  },
};
