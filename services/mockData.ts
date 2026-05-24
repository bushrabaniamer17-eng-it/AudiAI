export interface Course {
  id: string;
  name: string;
  nameEn: string;
  code: string;
  instructor: string;
  color: string;
  lectureCount: number;
  progress: number;
  nextExam?: string;
  credits: number;
  currentTopic?: string;
  nextTopic?: string;
}

export interface Lecture {
  id: string;
  courseId: string;
  title: string;
  date: string;
  duration: string;
  status: 'analyzed' | 'processing' | 'pending';
  keyPoints: number;
  flashcards: number;
  summaryPreview: string;
}

export interface QuizQuestion {
  id: string;
  type: 'multipleChoice' | 'trueFalse' | 'fillBlank';
  question: string;
  options?: string[];
  correctAnswer: string | number;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
  explanation: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  title: string;
  questionCount: number;
  duration: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'mixed';
  topics: string[];
  bestScore?: number;
  attempts: number;
  isAdaptive: boolean;
  color: string;
}

export interface StudyTask {
  id: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  taskType: 'review' | 'quiz' | 'practice' | 'lecture';
  title: string;
  duration: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  color: string;
}

export interface Notification {
  id: string;
  type: 'exam' | 'quiz' | 'study' | 'weakness' | 'lecture' | 'professor';
  title: string;
  body: string;
  time: string;
  read: boolean;
  icon: string;
  color: string;
}

export interface WeakPoint {
  id: string;
  courseId: string;
  courseName: string;
  topic: string;
  score: number;
  recommendation: string;
  suggestedVideo?: string;
  reviewMinute?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  universityId: string;
  university: string;
  major: string;
  year: string;
  gpa: number;
  totalStudyHours: number;
  quizzesCompleted: number;
  streak: number;
  weeklyGoal: number;
  weeklyProgress: number;
}

export interface FlashCard {
  id: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  mastered: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// ========== MOCK DATA ==========

export const mockStudent: StudentProfile = {
  id: 'std-001',
  name: 'أحمد محمد الخالدي',
  universityId: '202310451',
  university: 'الجامعة الأردنية',
  major: 'هندسة البرمجيات',
  year: 'السنة الثالثة',
  gpa: 3.42,
  totalStudyHours: 156,
  quizzesCompleted: 47,
  streak: 12,
  weeklyGoal: 20,
  weeklyProgress: 14,
};

export const mockCourses: Course[] = [
  {
    id: 'crs-001', name: 'هياكل البيانات', nameEn: 'Data Structures', code: 'CS301',
    instructor: 'د. محمد العبادي', color: '#FF4FA3', lectureCount: 12, progress: 0.75,
    nextExam: '2026-06-15', credits: 3, currentTopic: 'Linked Lists', nextTopic: 'Binary Trees',
  },
  {
    id: 'crs-002', name: 'قواعد البيانات', nameEn: 'Database Systems', code: 'CS310',
    instructor: 'د. سارة الحسن', color: '#FFD54A', lectureCount: 10, progress: 0.60,
    nextExam: '2026-06-20', credits: 3, currentTopic: 'SQL Joins', nextTopic: 'Normalization',
  },
  {
    id: 'crs-003', name: 'الخوارزميات', nameEn: 'Algorithms', code: 'CS305',
    instructor: 'د. عمر الناصر', color: '#3B82F6', lectureCount: 14, progress: 0.45,
    nextExam: '2026-06-18', credits: 3, currentTopic: 'Sorting Algorithms', nextTopic: 'Graph Algorithms',
  },
  {
    id: 'crs-004', name: 'هندسة البرمجيات', nameEn: 'Software Engineering', code: 'CS320',
    instructor: 'د. ليلى الكرمي', color: '#10B981', lectureCount: 8, progress: 0.85,
    credits: 3, currentTopic: 'Testing', nextTopic: 'Deployment',
  },
  {
    id: 'crs-005', name: 'شبكات الحاسوب', nameEn: 'Computer Networks', code: 'CS330',
    instructor: 'د. خالد الرفاعي', color: '#8B5CF6', lectureCount: 11, progress: 0.55,
    nextExam: '2026-06-25', credits: 3, currentTopic: 'TCP/IP', nextTopic: 'HTTP Protocol',
  },
  {
    id: 'crs-006', name: 'نظم التشغيل', nameEn: 'Operating Systems', code: 'CS340',
    instructor: 'د. فاطمة الزعبي', color: '#EF4444', lectureCount: 9, progress: 0.30,
    nextExam: '2026-07-01', credits: 3, currentTopic: 'Process Scheduling', nextTopic: 'Memory Management',
  },
];

export const mockLectures: Lecture[] = [
  { id: 'lec-001', courseId: 'crs-001', title: 'مقدمة في القوائم المترابطة', date: '2026-05-10', duration: '50 دقيقة', status: 'analyzed', keyPoints: 8, flashcards: 15, summaryPreview: 'تعريف القوائم المترابطة وأنواعها: الأحادية، الثنائية، والدائرية.' },
  { id: 'lec-002', courseId: 'crs-001', title: 'المكدسات والطوابير', date: '2026-05-12', duration: '45 دقيقة', status: 'analyzed', keyPoints: 12, flashcards: 20, summaryPreview: 'تطبيق المكدسات والطوابير باستخدام المصفوفات والقوائم المترابطة.' },
  { id: 'lec-003', courseId: 'crs-001', title: 'الأشجار الثنائية', date: '2026-05-17', duration: '55 دقيقة', status: 'analyzed', keyPoints: 15, flashcards: 18, summaryPreview: 'شرح الأشجار الثنائية: التمثيل، الإضافة، الحذف، والبحث.' },
  { id: 'lec-004', courseId: 'crs-002', title: 'نموذج ER والعلاقات', date: '2026-05-11', duration: '50 دقيقة', status: 'analyzed', keyPoints: 10, flashcards: 12, summaryPreview: 'تصميم قواعد البيانات باستخدام نموذج العلاقات والكيانات.' },
  { id: 'lec-005', courseId: 'crs-002', title: 'لغة SQL الأساسية', date: '2026-05-13', duration: '60 دقيقة', status: 'analyzed', keyPoints: 14, flashcards: 22, summaryPreview: 'أوامر SQL الأساسية: SELECT, INSERT, UPDATE, DELETE.' },
  { id: 'lec-006', courseId: 'crs-003', title: 'تحليل التعقيد الزمني', date: '2026-05-14', duration: '55 دقيقة', status: 'analyzed', keyPoints: 11, flashcards: 16, summaryPreview: 'Big-O Notation وتحليل التعقيد الزمني والمكاني.' },
  { id: 'lec-007', courseId: 'crs-003', title: 'خوارزميات الترتيب', date: '2026-05-16', duration: '50 دقيقة', status: 'processing', keyPoints: 0, flashcards: 0, summaryPreview: 'جاري التحليل...' },
  { id: 'lec-008', courseId: 'crs-004', title: 'منهجيات التطوير Agile', date: '2026-05-15', duration: '45 دقيقة', status: 'analyzed', keyPoints: 9, flashcards: 14, summaryPreview: 'شرح منهجية Agile وScrum.' },
  { id: 'lec-009', courseId: 'crs-005', title: 'نموذج OSI والطبقات', date: '2026-05-18', duration: '50 دقيقة', status: 'analyzed', keyPoints: 7, flashcards: 10, summaryPreview: 'نموذج OSI بالتفصيل: الطبقات السبع.' },
  { id: 'lec-010', courseId: 'crs-006', title: 'إدارة العمليات والخيوط', date: '2026-05-19', duration: '55 دقيقة', status: 'pending', keyPoints: 0, flashcards: 0, summaryPreview: 'بانتظار الرفع...' },
];

export const mockQuizzes: Quiz[] = [
  { id: 'quiz-001', courseId: 'crs-001', courseName: 'هياكل البيانات', courseCode: 'CS301', title: 'القوائم المترابطة والمكدسات', questionCount: 10, duration: 15, difficulty: 'mixed', topics: ['Linked Lists', 'Stacks', 'Queues'], bestScore: 85, attempts: 2, isAdaptive: true, color: '#FF4FA3' },
  { id: 'quiz-002', courseId: 'crs-001', courseName: 'هياكل البيانات', courseCode: 'CS301', title: 'الأشجار الثنائية', questionCount: 8, duration: 12, difficulty: 'hard', topics: ['Binary Trees', 'BST', 'Tree Traversal'], bestScore: 62, attempts: 1, isAdaptive: true, color: '#FF4FA3' },
  { id: 'quiz-003', courseId: 'crs-002', courseName: 'قواعد البيانات', courseCode: 'CS310', title: 'SQL وتصميم القواعد', questionCount: 12, duration: 18, difficulty: 'medium', topics: ['SQL', 'ER Model', 'Normalization'], bestScore: 90, attempts: 3, isAdaptive: true, color: '#FFD54A' },
  { id: 'quiz-004', courseId: 'crs-003', courseName: 'الخوارزميات', courseCode: 'CS305', title: 'التعقيد الزمني والترتيب', questionCount: 10, duration: 15, difficulty: 'hard', topics: ['Big-O', 'Sorting', 'Time Complexity'], attempts: 0, isAdaptive: true, color: '#3B82F6' },
  { id: 'quiz-005', courseId: 'crs-004', courseName: 'هندسة البرمجيات', courseCode: 'CS320', title: 'منهجيات التطوير', questionCount: 8, duration: 10, difficulty: 'easy', topics: ['Agile', 'Scrum', 'Waterfall'], bestScore: 95, attempts: 2, isAdaptive: false, color: '#10B981' },
  { id: 'quiz-006', courseId: 'crs-005', courseName: 'شبكات الحاسوب', courseCode: 'CS330', title: 'نموذج OSI والبروتوكولات', questionCount: 10, duration: 15, difficulty: 'medium', topics: ['OSI Model', 'TCP/IP', 'Protocols'], attempts: 0, isAdaptive: true, color: '#8B5CF6' },
];

export const mockQuizQuestions: QuizQuestion[] = [
  { id: 'q-001', type: 'multipleChoice', question: 'ما هو التعقيد الزمني لعملية البحث في القائمة المترابطة الأحادية؟', options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'], correctAnswer: 2, difficulty: 'medium', topic: 'Linked Lists', explanation: 'في القائمة المترابطة الأحادية، يجب المرور على كل عنصر بالتتابع، لذلك التعقيد O(n).' },
  { id: 'q-002', type: 'trueFalse', question: 'المكدس (Stack) يعمل بمبدأ FIFO.', options: ['صح', 'خطأ'], correctAnswer: 1, difficulty: 'easy', topic: 'Stacks', explanation: 'المكدس يعمل بمبدأ LIFO وليس FIFO.' },
  { id: 'q-003', type: 'multipleChoice', question: 'أي من عمليات التجول التالية تزور العقدة الجذر أولاً؟', options: ['Inorder', 'Preorder', 'Postorder', 'Level-order'], correctAnswer: 1, difficulty: 'medium', topic: 'Binary Trees', explanation: 'في Preorder يتم زيارة الجذر أولاً ثم اليسرى ثم اليمنى.' },
  { id: 'q-004', type: 'multipleChoice', question: 'ما هو الحد الأقصى لعدد العقد في شجرة ثنائية بارتفاع h؟', options: ['2h', '2^h', '2^(h+1) - 1', 'h²'], correctAnswer: 2, difficulty: 'hard', topic: 'Binary Trees', explanation: 'الحد الأقصى 2^(h+1) - 1 عندما تكون الشجرة كاملة.' },
  { id: 'q-005', type: 'trueFalse', question: 'يمكن تنفيذ الطابور باستخدام مصفوفتين من نوع Stack.', options: ['صح', 'خطأ'], correctAnswer: 0, difficulty: 'medium', topic: 'Queues', explanation: 'نعم، يمكن تنفيذ Queue باستخدام Stack واحد أو اثنين.' },
  { id: 'q-006', type: 'multipleChoice', question: 'ما هو أفضل تعقيد زمني لخوارزمية Merge Sort؟', options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(log n)'], correctAnswer: 1, difficulty: 'medium', topic: 'Sorting', explanation: 'Merge Sort لديها O(n log n) في جميع الحالات.' },
  { id: 'q-007', type: 'multipleChoice', question: 'في SQL، أي أمر يستخدم لاسترجاع البيانات؟', options: ['INSERT', 'UPDATE', 'SELECT', 'DELETE'], correctAnswer: 2, difficulty: 'easy', topic: 'SQL', explanation: 'SELECT يسترجع البيانات من جدول أو أكثر.' },
  { id: 'q-008', type: 'trueFalse', question: 'في نموذج OSI، طبقة النقل هي الطبقة الرابعة.', options: ['صح', 'خطأ'], correctAnswer: 0, difficulty: 'easy', topic: 'OSI Model', explanation: 'نعم، طبقة النقل هي الرابعة.' },
  { id: 'q-009', type: 'multipleChoice', question: 'أي من التالي ليس من مبادئ Agile؟', options: ['التسليم المستمر', 'التوثيق الشامل أولاً', 'التعاون مع العميل', 'الاستجابة للتغيير'], correctAnswer: 1, difficulty: 'easy', topic: 'Agile', explanation: 'Agile يفضل البرمجيات العاملة على التوثيق الشامل.' },
  { id: 'q-010', type: 'multipleChoice', question: 'ما نوع العلاقة بين "الطلاب" و"المواد المسجلة"؟', options: ['One-to-One', 'One-to-Many', 'Many-to-Many', 'لا توجد'], correctAnswer: 2, difficulty: 'medium', topic: 'ER Model', explanation: 'العلاقة Many-to-Many لأن الطالب يسجل في عدة مواد والعكس.' },
];

export const mockStudyTasks: StudyTask[] = [
  { id: 'task-001', courseId: 'crs-001', courseName: 'هياكل البيانات', courseCode: 'CS301', taskType: 'review', title: 'مراجعة الأشجار الثنائية', duration: '45 دقيقة', priority: 'high', completed: false, color: '#FF4FA3' },
  { id: 'task-002', courseId: 'crs-003', courseName: 'الخوارزميات', courseCode: 'CS305', taskType: 'quiz', title: 'كويز التعقيد الزمني', duration: '15 دقيقة', priority: 'high', completed: false, color: '#3B82F6' },
  { id: 'task-003', courseId: 'crs-002', courseName: 'قواعد البيانات', courseCode: 'CS310', taskType: 'practice', title: 'تمرين على SQL Joins', duration: '30 دقيقة', priority: 'medium', completed: true, color: '#FFD54A' },
  { id: 'task-004', courseId: 'crs-005', courseName: 'شبكات الحاسوب', courseCode: 'CS330', taskType: 'lecture', title: 'استماع لمحاضرة البروتوكولات', duration: '50 دقيقة', priority: 'medium', completed: false, color: '#8B5CF6' },
  { id: 'task-005', courseId: 'crs-001', courseName: 'هياكل البيانات', courseCode: 'CS301', taskType: 'practice', title: 'حل تمارين Linked Lists', duration: '30 دقيقة', priority: 'low', completed: false, color: '#FF4FA3' },
];

export const mockWeakPoints: WeakPoint[] = [
  { id: 'wp-001', courseId: 'crs-001', courseName: 'هياكل البيانات', topic: 'الأشجار الثنائية - Tree Traversal', score: 45, recommendation: 'راجع محاضرة الأشجار من الدقيقة 12:30 إلى 28:00', reviewMinute: '12:30 - 28:00' },
  { id: 'wp-002', courseId: 'crs-003', courseName: 'الخوارزميات', topic: 'تحليل التعقيد المكاني', score: 38, recommendation: 'ركز على حساب Space Complexity مع أمثلة عملية', reviewMinute: '08:15 - 15:40' },
  { id: 'wp-003', courseId: 'crs-002', courseName: 'قواعد البيانات', topic: 'التطبيع - Normalization (3NF)', score: 52, recommendation: 'اعمل على تمارين تحويل من 1NF إلى 3NF' },
  { id: 'wp-004', courseId: 'crs-006', courseName: 'نظم التشغيل', topic: 'إدارة الذاكرة - Paging', score: 30, recommendation: 'هذا الموضوع يحتاج اهتمام خاص. ابدأ بالأساسيات' },
];

export const mockNotifications: Notification[] = [
  { id: 'notif-001', type: 'exam', title: 'امتحان قريب!', body: 'امتحان هياكل البيانات CS301 بعد 5 أيام. ركز على Trees و Linked Lists', time: 'قبل ساعتين', read: false, icon: 'school', color: '#EF4444' },
  { id: 'notif-002', type: 'professor', title: 'تحديث الدكتور', body: 'غداً سيشرح د. محمد العبادي: Binary Trees في هياكل البيانات', time: 'قبل 3 ساعات', read: false, icon: 'person', color: '#FF4FA3' },
  { id: 'notif-003', type: 'quiz', title: 'كويز جديد متاح', body: 'كويز تكيفي جديد في الخوارزميات بناءً على نقاط ضعفك', time: 'قبل 4 ساعات', read: false, icon: 'quiz', color: '#3B82F6' },
  { id: 'notif-004', type: 'study', title: 'وقت الدراسة', body: 'الأولوية الليلة: مراجعة SQL Joins في قواعد البيانات', time: 'اليوم 6:00 م', read: true, icon: 'menu-book', color: '#FFD54A' },
  { id: 'notif-005', type: 'weakness', title: 'نقطة ضعف مكتشفة', body: 'أداؤك في Tree Traversal أقل من 50%. نوصي بمراجعة إضافية', time: 'أمس', read: true, icon: 'warning', color: '#F59E0B' },
  { id: 'notif-006', type: 'professor', title: 'يفضل مراجعة', body: 'يفضل مراجعة Linked Lists قبل محاضرة الغد في هياكل البيانات', time: 'أمس', read: true, icon: 'lightbulb', color: '#10B981' },
  { id: 'notif-007', type: 'lecture', title: 'محاضرة جاهزة', body: 'تم تحليل محاضرة "خوارزميات الترتيب" - 12 نقطة مهمة', time: 'قبل يومين', read: true, icon: 'headset', color: '#8B5CF6' },
];

export const mockFlashcards: FlashCard[] = [
  { id: 'fc-001', front: 'ما هو Stack؟', back: 'هيكل بيانات يعمل بمبدأ LIFO', difficulty: 'easy', mastered: true },
  { id: 'fc-002', front: 'ما الفرق بين Stack و Queue؟', back: 'Stack يعمل بـ LIFO بينما Queue يعمل بـ FIFO', difficulty: 'easy', mastered: true },
  { id: 'fc-003', front: 'ما هو Binary Search Tree؟', back: 'شجرة ثنائية حيث كل عقدة يسرى أصغر وكل يمنى أكبر', difficulty: 'medium', mastered: false },
  { id: 'fc-004', front: 'ما تعقيد البحث في BST المتوازنة؟', back: 'O(log n)', difficulty: 'medium', mastered: false },
  { id: 'fc-005', front: 'ما هو Inorder Traversal؟', back: 'يسار ← جذر ← يمين. ينتج عناصر BST مرتبة تصاعدياً', difficulty: 'hard', mastered: false },
  { id: 'fc-006', front: 'ما هو Normalization؟', back: 'عملية تنظيم البيانات لتقليل التكرار', difficulty: 'medium', mastered: false },
  { id: 'fc-007', front: 'ما هو JOIN في SQL؟', back: 'عملية دمج صفوف من جدولين بناءً على عمود مشترك', difficulty: 'easy', mastered: true },
  { id: 'fc-008', front: 'ما هو Big-O Notation؟', back: 'تدوين يصف الحد الأعلى لتعقيد الخوارزمية', difficulty: 'medium', mastered: false },
];
