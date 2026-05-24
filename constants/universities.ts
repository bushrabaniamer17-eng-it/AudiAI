export interface University {
  id: string;
  nameAr: string;
  nameEn: string;
  type: 'public' | 'private';
  city?: string;
}

export const jordanianUniversities: University[] = [
  // الجامعات الحكومية
  { id: 'ju', nameAr: 'الجامعة الأردنية', nameEn: 'University of Jordan', type: 'public', city: 'عمّان' },
  { id: 'just', nameAr: 'جامعة العلوم والتكنولوجيا الأردنية', nameEn: 'Jordan University of Science and Technology', type: 'public', city: 'إربد' },
  { id: 'yu', nameAr: 'جامعة اليرموك', nameEn: 'Yarmouk University', type: 'public', city: 'إربد' },
  { id: 'mutah', nameAr: 'جامعة مؤتة', nameEn: "Mu'tah University", type: 'public', city: 'الكرك' },
  { id: 'hu', nameAr: 'الجامعة الهاشمية', nameEn: 'The Hashemite University', type: 'public', city: 'الزرقاء' },
  { id: 'aabu', nameAr: 'جامعة آل البيت', nameEn: 'Al al-Bayt University', type: 'public', city: 'المفرق' },
  { id: 'bau', nameAr: 'جامعة البلقاء التطبيقية', nameEn: 'Al-Balqa Applied University', type: 'public', city: 'السلط' },
  { id: 'ahu', nameAr: 'جامعة الحسين بن طلال', nameEn: 'Al-Hussein Bin Talal University', type: 'public', city: 'معان' },
  { id: 'ttu', nameAr: 'جامعة الطفيلة التقنية', nameEn: 'Tafila Technical University', type: 'public', city: 'الطفيلة' },
  { id: 'gju', nameAr: 'الجامعة الألمانية الأردنية', nameEn: 'German Jordanian University', type: 'public', city: 'عمّان' },

  // الجامعات الخاصة
  { id: 'ammanu', nameAr: 'جامعة عمان الأهلية', nameEn: 'Al-Ahliyya Amman University', type: 'private', city: 'عمّان' },
  { id: 'zuj', nameAr: 'جامعة الزيتونة الأردنية', nameEn: 'Al-Zaytoonah University of Jordan', type: 'private', city: 'عمّان' },
  { id: 'philadelphia', nameAr: 'جامعة فيلادلفيا', nameEn: 'Philadelphia University', type: 'private', city: 'عمّان' },
  { id: 'isra', nameAr: 'جامعة الإسراء', nameEn: 'Al-Isra University', type: 'private', city: 'عمّان' },
  { id: 'meu', nameAr: 'جامعة الشرق الأوسط', nameEn: 'Middle East University', type: 'private', city: 'عمّان' },
  { id: 'uop', nameAr: 'جامعة البترا', nameEn: 'University of Petra', type: 'private', city: 'عمّان' },
  { id: 'asu', nameAr: 'جامعة العلوم التطبيقية الخاصة', nameEn: 'Applied Science Private University', type: 'private', city: 'عمّان' },
  { id: 'zu', nameAr: 'جامعة الزرقاء', nameEn: 'Zarqa University', type: 'private', city: 'الزرقاء' },
  { id: 'jpu', nameAr: 'جامعة جرش', nameEn: 'Jerash University', type: 'private', city: 'جرش' },
  { id: 'inu', nameAr: 'جامعة إربد الأهلية', nameEn: 'Irbid National University', type: 'private', city: 'إربد' },
  { id: 'aau', nameAr: 'جامعة عمان العربية', nameEn: 'Amman Arab University', type: 'private', city: 'عمّان' },
  { id: 'jadara', nameAr: 'جامعة جدارا', nameEn: 'Jadara University', type: 'private', city: 'إربد' },
  { id: 'aut', nameAr: 'جامعة العقبة للتكنولوجيا', nameEn: 'Aqaba University of Technology', type: 'private', city: 'العقبة' },
  { id: 'anu', nameAr: 'جامعة عجلون الوطنية', nameEn: 'Ajloun National University', type: 'private', city: 'عجلون' },
];

export const commonMajors = [
  { id: 'cs', nameAr: 'علم الحاسوب', nameEn: 'Computer Science' },
  { id: 'se', nameAr: 'هندسة البرمجيات', nameEn: 'Software Engineering' },
  { id: 'ce', nameAr: 'هندسة الحاسوب', nameEn: 'Computer Engineering' },
  { id: 'it', nameAr: 'تكنولوجيا المعلومات', nameEn: 'Information Technology' },
  { id: 'is', nameAr: 'نظم المعلومات', nameEn: 'Information Systems' },
  { id: 'ai', nameAr: 'الذكاء الاصطناعي', nameEn: 'Artificial Intelligence' },
  { id: 'cy', nameAr: 'الأمن السيبراني', nameEn: 'Cybersecurity' },
  { id: 'ee', nameAr: 'الهندسة الكهربائية', nameEn: 'Electrical Engineering' },
  { id: 'me', nameAr: 'الهندسة الميكانيكية', nameEn: 'Mechanical Engineering' },
  { id: 'cv', nameAr: 'الهندسة المدنية', nameEn: 'Civil Engineering' },
  { id: 'ar', nameAr: 'الهندسة المعمارية', nameEn: 'Architecture' },
  { id: 'med', nameAr: 'الطب البشري', nameEn: 'Medicine' },
  { id: 'dent', nameAr: 'طب الأسنان', nameEn: 'Dentistry' },
  { id: 'pharm', nameAr: 'الصيدلة', nameEn: 'Pharmacy' },
  { id: 'nurs', nameAr: 'التمريض', nameEn: 'Nursing' },
  { id: 'ba', nameAr: 'إدارة الأعمال', nameEn: 'Business Administration' },
  { id: 'acc', nameAr: 'المحاسبة', nameEn: 'Accounting' },
  { id: 'fin', nameAr: 'التمويل', nameEn: 'Finance' },
  { id: 'mkt', nameAr: 'التسويق', nameEn: 'Marketing' },
  { id: 'eco', nameAr: 'الاقتصاد', nameEn: 'Economics' },
  { id: 'law', nameAr: 'القانون', nameEn: 'Law' },
  { id: 'eng-ar', nameAr: 'اللغة العربية', nameEn: 'Arabic Language' },
  { id: 'eng-en', nameAr: 'اللغة الإنجليزية', nameEn: 'English Language' },
  { id: 'math', nameAr: 'الرياضيات', nameEn: 'Mathematics' },
  { id: 'phy', nameAr: 'الفيزياء', nameEn: 'Physics' },
  { id: 'chem', nameAr: 'الكيمياء', nameEn: 'Chemistry' },
  { id: 'bio', nameAr: 'الأحياء', nameEn: 'Biology' },
  { id: 'gd', nameAr: 'التصميم الجرافيكي', nameEn: 'Graphic Design' },
  { id: 'other', nameAr: 'أخرى', nameEn: 'Other' },
];

export const academicYears = [
  { id: '1', nameAr: 'السنة الأولى', nameEn: 'First Year' },
  { id: '2', nameAr: 'السنة الثانية', nameEn: 'Second Year' },
  { id: '3', nameAr: 'السنة الثالثة', nameEn: 'Third Year' },
  { id: '4', nameAr: 'السنة الرابعة', nameEn: 'Fourth Year' },
  { id: '5', nameAr: 'السنة الخامسة', nameEn: 'Fifth Year' },
  { id: '6', nameAr: 'السنة السادسة', nameEn: 'Sixth Year' },
  { id: 'grad', nameAr: 'دراسات عليا', nameEn: 'Graduate' },
];
