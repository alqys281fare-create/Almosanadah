// Default content for the whole website, one object per language.
// Everything here can be edited from /dashboard (per language) and is persisted in localStorage.

import { getCatalogGroups } from './Programscatalog.js';

export const CONTENT_VERSION = 2; // bump whenever the data shape changes

const ar = {
  site: {
    name: 'معهد المسانِدة',
    subtitle: 'العالي للتدريب',
    phone: '0514569531',
    email: 'info@almosanadah.net',
    logo: '',
    topbar: {
      dashboard: { show: true, label: '', href: '/dashboard', icon: 'user' },
      lang: { show: true, label: '', icon: 'globe' },
    },
    actions: [
      { id: 'services', label: 'خدماتى التعليمية', href: '/courses', icon: 'book', variant: 'ghost' },
      { id: 'register', label: 'سجل الأن', href: '#contact', icon: 'user', variant: 'primary' },
    ],
  },

  nav: [
    { id: 'home', label: 'الرئيسية', href: '#home' },
    { id: 'about', label: 'من نحن', href: '#about' },
    { id: 'programs', label: 'البرامج', href: '/programs' },
    { id: 'trainers', label: 'أصدقاءالمسانَدة', href: '#stats' },
    { id: 'admission', label: 'قواعد القبول', href: '/admission' },
    { id: 'system', label: 'النظام الإداري', href: '#stats' },
    { id: 'faq', label: 'فروعنا', href: '/branches' },
    { id: 'contact', label: 'تواصل معنا', href: '#contact' },
  ],

  /* order / visibility of the home page sections (edited in the dashboard, shared by both languages) */
  homeLayout: {
    order: ['hero', 'features', 'programs', 'about', 'stats', 'gallery', 'branches', 'accreditation', 'testimonials', 'partners', 'faq', 'contact'],
    hidden: [],
  },

  hero: {
    title: 'معهد المسانِدة',
    highlight: 'بيئة تعليمية متميزة .. تصنع مستقبلك',
    description:
      'نقدم برامج تعليمية وتدريبية عالية الجودة في مختلف التخصصات، بإشراف نخبة من المدربين المعتمدين، لنساهم في بناء جيل مؤهل لسوق العمل في المملكة العربية السعودية.',
    cta: 'اكتشف برامجنا',
    badges: [
      { id: 1, icon: 'cap', text: 'برامج معتمدة في شتى التخصصات' },
      { id: 2, icon: 'book', text: 'قواعد تعليمية موثقة وحديثة' },
      { id: 3, icon: 'users', text: 'شبكة علاقات واسعة مع سوق العمل' },
    ],
    image: 'poster.png',
  },

  features: [
    { id: 1, icon: 'cert', title: 'جودة التعليم والتدريب' },
    { id: 2, icon: 'screen', title: 'بيئة تعليمية داعمة ومحفزة' },
    { id: 3, icon: 'building', title: 'بيئة تعليمية داعمة ومحفزة' },
    { id: 4, icon: 'eye', title: 'فروع متعددة في جميع أنحاء المملكة' },
    { id: 5, icon: 'chart', title: 'نحو مستقبل مهني أفضل' },
  ],

  programs: {
    title: 'البرامج',
    description:
      'برامج تدريبية معتمدة تمنحك المعرفة والخبرة العملية في مجالات الإدارة المكتبية والأنشطة الإدارية، بما يتوافق مع متطلبات سوق العمل.',
    tabs: [
      { id: 'pro', label: 'الدبلومات المهنية' },
      { id: 'acad', label: 'الدبلومات الأكاديمية' },
      { id: 'courses', label: 'الدورات المهنية' },
      { id: 'all', label: 'عرض الكل' },
    ],
    items: [
      {
        id: 1,
        program: 'pro',
        category: 'pro',
        title: 'دورة الإدارة المكتبية',
        duration: '3 أشهر',
        hours: '180 ساعة تدريبية',
        image: '',
        topics: ['تطوير مهارات التنظيم وإدارة المرجعات', 'تطوير مهارات التنظيم وإدارة المرجعات', 'تطوير مهارات التنظيم وإدارة المرجعات'],
      },
      {
        id: 2,
        program: 'acad',
        category: 'acad',
        title: 'دورة الإدارة المكتبية',
        duration: '3 أشهر',
        hours: '180 ساعة تدريبية',
        image: '',
        topics: ['تطوير مهارات التنظيم وإدارة المرجعات', 'تطوير مهارات التنظيم وإدارة المرجعات', 'تطوير مهارات التنظيم وإدارة المرجعات'],
      },
      {
        id: 3,
        program: 'courses',
        category: 'courses',
        title: 'دورة الإدارة المكتبية',
        duration: '3 أشهر',
        hours: '180 ساعة تدريبية',
        image: '',
        topics: ['تطوير مهارات التنظيم وإدارة المرجعات', 'تطوير مهارات التنظيم وإدارة المرجعات', 'تطوير مهارات التنظيم وإدارة المرجعات'],
      },
    ],
    detailsLabel: 'عرض التفاصيل',
  },

  about: {
    label: 'من نحن',
    title: 'نصنع فرصًا حقيقية لمستقبل مهني واعد',
    paragraphs: [
      'في معهد المسانِدة العالي للتدريب، نؤمن بأن التدريب النوعي هو الخطوة الأولى نحو التميز المهني. لذلك، لا نكتفي بتقديم المعرفة أو منح الشهادات، بل نعمل على تطوير المهارات.',
      'وتعزيز الخبرات العملية، وربط التعلم بمتطلبات سوق العمل؛ لنمكّن متدربينا من بناء مسار مهني ناجح، واغتنام فرص وظيفية أفضل، وتحقيق طموحاتهم نحو مستقبل أكثر استقرارًا ونموًا.',
    ],
  },

  stats: [
    { id: 1, icon: 'building', value: 27, suffix: '', label: 'فرع' },
    { id: 2, icon: 'users', value: 1500, suffix: '+', label: 'متدرب' },
    { id: 3, icon: 'grad', value: 8500, suffix: '+', label: 'خريج' },
    { id: 4, icon: 'trainer', value: 105, suffix: '', label: 'مدرب' },
    { id: 5, icon: 'cert', value: 40, suffix: '', label: 'برنامج تعليمي' },
  ],

  courses: {
    title: 'الدورات',
    subtitle: 'يقدم معهد المساندة أفضل الدورات التي تلائم سوق العمل',
    banner: '',
    searchPlaceholder: 'ابحث عن دورة أو موضوع أو مهارة ......',
    searchButton: 'بحث',
    categoriesTitle: 'الفئات التدريبية',
    allLabel: 'كل الدورات',
    empty: 'لا توجد دورات مطابقة لبحثك.',
    // NEW: every course must belong to exactly one of these three programs
    programLabel: 'البرنامج',
    programsTitle: 'نوع البرنامج',
    allProgramsLabel: 'كل البرامج',
    programs: [
      { id: 'acad', label: 'دبلومات أكاديمية' },
      { id: 'pro', label: 'دبلومات مهنية' },
      { id: 'courses', label: 'دورات مهنية' },
    ],
    categories: [
      { id: 1, label: 'دورات الفعالية الإنجليزية', icon: 'book' },
      { id: 2, label: 'دورات تقنية المعلومات', icon: 'screen' },
      { id: 3, label: 'التعليم الإلكتروني', icon: 'cap' },
      { id: 4, label: 'دورات التأهيل', icon: 'cert' },
    ],
    // ─────────────────────────────────────────────────────────────
    // 24 courses · 6 per category · 8 per program (acad / pro / courses)
    // ─────────────────────────────────────────────────────────────
    items: [
      // ── Category 1: دورات الفعالية الإنجليزية ──────────────────
      { id: 1,  category: 1, program: 'courses', icon: 'book',   title: 'مهارات المحادثة الإنجليزية',        href: '' },
      { id: 2,  category: 1, program: 'courses', icon: 'users',  title: 'الإنجليزية للأعمال',                href: '' },
      { id: 3,  category: 1, program: 'pro',     icon: 'book',   title: 'دبلوم اللغة الإنجليزية المتقدم',    href: '' },
      { id: 4,  category: 1, program: 'pro',     icon: 'book',   title: 'دبلوم الترجمة الاحترافية',          href: '' },
      { id: 5,  category: 1, program: 'acad',    icon: 'book',   title: 'دبلوم اللغة الإنجليزية التطبيقي',   href: '' },
      { id: 6,  category: 1, program: 'acad',    icon: 'book',   title: 'دبلوم الأدب الإنجليزي',             href: '' },

      // ── Category 2: دورات تقنية المعلومات ──────────────────────
      { id: 7,  category: 2, program: 'courses', icon: 'screen', title: 'أساسيات الحاسب والشبكات',           href: '' },
      { id: 8,  category: 2, program: 'courses', icon: 'screen', title: 'مقدمة في البرمجة',                  href: '' },
      { id: 9,  category: 2, program: 'pro',     icon: 'screen', title: 'دبلوم تطوير الويب',                 href: '' },
      { id: 10, category: 2, program: 'pro',     icon: 'chart',  title: 'دبلوم الأمن السيبراني',             href: '' },
      { id: 11, category: 2, program: 'acad',    icon: 'screen', title: 'دبلوم علوم الحاسب',                 href: '' },
      { id: 12, category: 2, program: 'acad',    icon: 'chart',  title: 'دبلوم تحليل البيانات',              href: '' },

      // ── Category 3: التعليم الإلكتروني ─────────────────────────
      { id: 13, category: 3, program: 'courses', icon: 'users',   title: 'الوسائل التعليمية التفاعلية',       href: '' },
      { id: 14, category: 3, program: 'courses', icon: 'trainer', title: 'مهارات التدريس عن بُعد',            href: '' },
      { id: 15, category: 3, program: 'pro',     icon: 'eye',     title: 'دبلوم تصميم المحتوى الرقمي',        href: '' },
      { id: 16, category: 3, program: 'pro',     icon: 'screen',  title: 'دبلوم إدارة منصات التعليم',         href: '' },
      { id: 17, category: 3, program: 'acad',    icon: 'cap',     title: 'دبلوم التعليم الإلكتروني',          href: '' },
      { id: 18, category: 3, program: 'acad',    icon: 'cap',     title: 'دبلوم تكنولوجيا التعليم',           href: '' },

      // ── Category 4: دورات التأهيل ──────────────────────────────
      { id: 19, category: 4, program: 'courses', icon: 'cert',     title: 'التأهيل لسوق العمل',                href: '' },
      { id: 20, category: 4, program: 'courses', icon: 'users',    title: 'مهارات المقابلات الشخصية',          href: '' },
      { id: 21, category: 4, program: 'pro',     icon: 'grad',     title: 'دبلوم إعداد المدربين المعتمدين',    href: '' },
      { id: 22, category: 4, program: 'pro',     icon: 'chart',    title: 'دبلوم التسويق الرقمي',              href: '' },
      { id: 23, category: 4, program: 'acad',    icon: 'building', title: 'دبلوم إدارة الأعمال',               href: '' },
      { id: 24, category: 4, program: 'acad',    icon: 'users',    title: 'دبلوم الموارد البشرية',             href: '' },
    ],
  },

  branches: {
    title: 'الفروع',
    description: 'نحرص على أن نكون قريبين منك في جميع مناطق المملكة من خلال شبكة فروعنا المنتشرة لتقديم أفضل الخدمات التعليمية والتدريبية.',
    banner: '',
    allLabel: 'جميع الفروع',
    locationLabel: 'عرض الموقع',
    videoLabel: 'فيديو تعريفي',
    perPage: 6,
    regions: [
      { id: 'central', label: 'المنطقة الوسطى' },
      { id: 'eastern', label: 'المنطقة الشرقية' },
      { id: 'western', label: 'المنطقة الغربية' },
      { id: 'northern', label: 'المنطقة الشمالية' },
      { id: 'southern', label: 'المنطقة الجنوبية' },
    ],
    items: [
      { id: 1, region: 'central', name: 'فرع الرياض', address: 'الرياض - الفرع الرئيسي', phone: '0514569531', hours: '8:00 صباحًا - 4:00 مساءً', mapUrl: 'https://www.google.com/maps?q=24.71,46.68', videoUrl: '', logo: '', lat: 24.71, lng: 46.68 },
      { id: 2, region: 'eastern', name: 'فرع الدمام', address: 'الدمام - الفرع الرئيسي', phone: '0514569531', hours: '8:00 صباحًا - 4:00 مساءً', mapUrl: 'https://www.google.com/maps?q=26.43,50.1', videoUrl: '', logo: '', lat: 26.43, lng: 50.1 },
      { id: 3, region: 'western', name: 'فرع جدة', address: 'جدة - الفرع الرئيسي', phone: '0514569531', hours: '8:00 صباحًا - 4:00 مساءً', mapUrl: 'https://www.google.com/maps?q=21.54,39.17', videoUrl: '', logo: '', lat: 21.54, lng: 39.17 },
      { id: 4, region: 'western', name: 'فرع مكة المكرمة', address: 'مكة المكرمة - الفرع الرئيسي', phone: '0514569531', hours: '8:00 صباحًا - 4:00 مساءً', mapUrl: 'https://www.google.com/maps?q=21.39,39.86', videoUrl: '', logo: '', lat: 21.39, lng: 39.86 },
      { id: 5, region: 'western', name: 'فرع المدينة المنورة', address: 'المدينة المنورة - الفرع الرئيسي', phone: '0514569531', hours: '8:00 صباحًا - 4:00 مساءً', mapUrl: 'https://www.google.com/maps?q=24.47,39.61', videoUrl: '', logo: '', lat: 24.47, lng: 39.61 },
      { id: 6, region: 'northern', name: 'فرع تبوك', address: 'تبوك - الفرع الرئيسي', phone: '0514569531', hours: '8:00 صباحًا - 4:00 مساءً', mapUrl: 'https://www.google.com/maps?q=28.38,36.57', videoUrl: '', logo: '', lat: 28.38, lng: 36.57 },
      { id: 7, region: 'northern', name: 'فرع سكاكا', address: 'سكاكا - الفرع الرئيسي', phone: '0514569531', hours: '8:00 صباحًا - 4:00 مساءً', mapUrl: 'https://www.google.com/maps?q=29.97,40.2', videoUrl: '', logo: '', lat: 29.97, lng: 40.2 },
      { id: 8, region: 'northern', name: 'فرع حائل', address: 'حائل - الفرع الرئيسي', phone: '0514569531', hours: '8:00 صباحًا - 4:00 مساءً', mapUrl: 'https://www.google.com/maps?q=27.52,41.7', videoUrl: '', logo: '', lat: 27.52, lng: 41.7 },
      { id: 9, region: 'southern', name: 'فرع أبها', address: 'أبها - الفرع الرئيسي', phone: '0514569531', hours: '8:00 صباحًا - 4:00 مساءً', mapUrl: 'https://www.google.com/maps?q=18.22,42.5', videoUrl: '', logo: '', lat: 18.22, lng: 42.5 },
      { id: 10, region: 'southern', name: 'فرع جازان', address: 'جازان - الفرع الرئيسي', phone: '0514569531', hours: '8:00 صباحًا - 4:00 مساءً', mapUrl: 'https://www.google.com/maps?q=16.89,42.55', videoUrl: '', logo: '', lat: 16.89, lng: 42.55 },
      { id: 11, region: 'southern', name: 'فرع نجران', address: 'نجران - الفرع الرئيسي', phone: '0514569531', hours: '8:00 صباحًا - 4:00 مساءً', mapUrl: 'https://www.google.com/maps?q=17.49,44.13', videoUrl: '', logo: '', lat: 17.49, lng: 44.13 },
    ],
  },

  /* ---- Home sections added from the new design ---- */
  gallery: {
    title: 'معرض الصور',
    allLabel: 'عرض الكل',
    empty: 'لا توجد صور في هذا القسم حاليًا.',
    tabs: [
      { id: 'programs', label: 'برامج تدريبية', icon: 'book' },
      { id: 'events', label: 'فعاليات و لقاءات', icon: 'layers' },
      { id: 'facilities', label: 'مرافق المعهد', icon: 'building' },
    ],
    items: [
      { id: 1, category: 'programs', title: 'هنا تبدأ المهارة... ويكبر الطموح', date: 'أكتوبر ٢٠٢٦', image: '/gallery/meeting.jpg' },
      { id: 2, category: 'events', title: 'مساحة للحوار وتبادل الخبرات', date: 'سبتمبر ٢٠٢٦', image: '/gallery/dialogue.jpg' },
      { id: 3, category: 'facilities', title: 'بيئة مهيّأة لكل خطوة', date: 'سبتمبر ٢٠٢٦', image: '/gallery/classroom.jpg' },
      { id: 4, category: 'facilities', title: 'بيئة مهيّأة لكل خطوة', date: 'سبتمبر ٢٠٢٦', image: '/gallery/classroom.jpg' },
      { id: 5, category: 'facilities', title: 'بيئة مهيّأة لكل خطوة', date: 'سبتمبر ٢٠٢٦', image: '/gallery/classroom.jpg' },
      { id: 6, category: 'facilities', title: 'بيئة مهيّأة لكل خطوة', date: 'سبتمبر ٢٠٢٦', image: '/gallery/classroom.jpg' },
    ],
  },

  accreditation: {
    title: 'الاعتماد',
    allLabel: 'عرض الكل',
    tabs: [
      { id: 'gov', label: 'اعتماد حكومي', icon: 'cert' },
      { id: 'intl', label: 'اعتماد دولي', icon: 'globe' },
    ],
    items: [
      { id: 1, category: 'gov', name: 'معتمد من المؤسسة العامة للتدريب التقني والمهني.', logo: '/accreditation/a1.png' },
      { id: 2, category: 'gov', name: 'مصنّف ومعتمد من وزارة الموارد البشرية والتنمية الاجتماعية', logo: '/accreditation/a2.png' },
      { id: 3, category: 'gov', name: 'مصنف من الهيئة السعودية للتخصصات الصحية', logo: '/accreditation/a3.png' },
      { id: 4, category: 'gov', name: 'المركز الوطني للتعليم الإلكتروني', logo: '/accreditation/a4.png' },
    ],
  },

  testimonials: {
    title: 'أراء طلابنا',
    items: [
      { id: 1, name: 'محمد رجب', meta: 'خريج المعهد', rating: 5, image: '', text: 'سلام عليكم، المعهد المساندة على درجة عالية من الكفاءة المهنية' },
      { id: 2, name: 'محمد رجب', meta: 'خريج المعهد', rating: 5, image: '', text: 'سلام عليكم، المعهد المساندة على درجة عالية من الكفاءة المهنية' },
      { id: 3, name: 'محمد رجب', meta: 'خريج المعهد', rating: 5, image: '', text: 'سلام عليكم، المعهد المساندة على درجة عالية من الكفاءة المهنية' },
    ],
  },

  partners: {
    title: 'شركاءنا',
    subtitle: 'نعتز بشراكاتنا مع الجهات والمؤسسات التي تدعم مسيرتنا وتساهم في تحقيق أهدافنا',
    items: [
      { id: 1, name: 'شريك 1', logo: '/accreditation/a1.png', href: '' },
      { id: 2, name: 'شريك 2', logo: '/accreditation/a2.png', href: '' },
      { id: 3, name: 'شريك 3', logo: '/accreditation/a3.png', href: '' },
      { id: 4, name: 'شريك 4', logo: '/accreditation/a4.png', href: '' },
      { id: 5, name: 'شريك 5', logo: '/logo.png', href: '' },
      { id: 6, name: 'شريك 6', logo: '/accreditation/a1.png', href: '' },
      { id: 7, name: 'شريك 7', logo: '/accreditation/a2.png', href: '' },
      { id: 8, name: 'شريك 8', logo: '/accreditation/a3.png', href: '' },
      { id: 9, name: 'شريك 9', logo: '/accreditation/a4.png', href: '' },
      { id: 10, name: 'شريك 10', logo: '/logo.png', href: '' },
      { id: 11, name: 'شريك 11', logo: '/accreditation/a1.png', href: '' },
      { id: 12, name: 'شريك 12', logo: '/accreditation/a2.png', href: '' },
    ],
  },

  faq: {
    title: 'الأسئلة الشائعة',
    subtitle: 'إجابات على أكثر الأسئلة شيوعًا لمساعدتك في الحصول على المعلومة التي تحتاجها بسرعة وسهولة',
    items: [
      { id: 1, q: 'ما هي مدة معالجة الطلب بعد تقديمه؟', a: 'تختلف مدة المعالجة حسب نوع الخدمة، وعادةً ما تتراوح بين يومين إلى أسبوع عمل، وسيتم إشعارك بحالة الطلب عبر قنوات التواصل المختارة.' },
      { id: 2, q: 'هل يمكنني إلغاء الطلب بعد تقديمه؟', a: 'يمكنك طلب الإلغاء بالتواصل مع فريق خدمة المتدربين، وتختلف إمكانية الإلغاء حسب مرحلة معالجة الطلب ونوع الخدمة.' },
      { id: 3, q: 'ما هي طرق الدفع المتاحة؟', a: 'تتوفر عدة طرق للدفع، ويمكنك الاستفسار من فرع المعهد الأقرب إليك أو عبر قنوات التواصل عن الخيارات المتاحة لبرنامجك.' },
      { id: 4, q: 'كيف يمكنني التسجيل في أحد البرامج؟', a: 'اختر البرنامج المناسب من قسم البرامج ثم اضغط «سجل الآن»، أو تواصل معنا وسيساعدك فريقنا في إتمام التسجيل خطوة بخطوة.' },
      { id: 5, q: 'هل يمكنني زيارة أقرب فرع لي؟', a: 'بالتأكيد، يمكنك الاطلاع على جميع فروعنا وعناوينها ومواعيد العمل من صفحة «فروعنا».' },
    ],
  },

  ads: {
    enabled: true,
    label: 'إعلان',
    // four positions: two on the left of the page, two on the right (one image per language)
    slots: [
      { id: 'left-1', side: 'left', image: '', href: '/courses', title: 'اكتشف برامجنا', text: 'برامج تدريبية معتمدة' },
      { id: 'left-2', side: 'left', image: '', href: '/programs', title: 'الدبلومات والدورات', text: 'اختر مسارك المهني' },
      { id: 'right-1', side: 'right', image: '', href: '#contact', title: 'سجّل الآن', text: 'معهد المسانِدة العالي للتدريب' },
      { id: 'right-2', side: 'right', image: '', href: '/admission', title: 'قواعد القبول', text: 'تعرّف على شروط الالتحاق' },
    ],
  },

  contact: {
    title: 'تواصل معنا',
    subtitle: 'نحن دائمًا بالقرب منك ... لمساعدتك والإجابة عن كل استفساراتك',
    formTitle: 'أرسل لنا رسالة',
    formHint: 'يمكنك التواصل معنا من خلال تعبئة النموذج أدناه، وسنقوم بالرد عليك في أقرب وقت ممكن.',
    name: 'الاسم الكامل',
    email: 'البريد الإلكتروني',
    subject: 'الموضوع',
    message: 'الرسالة',
    send: 'إرسال الرسالة',
    success: 'شكرًا لك! تم تجهيز رسالتك وفتحها في تطبيق البريد لديك، اضغط «إرسال» هناك لإتمامها.',
    error: 'يرجى تعبئة الاسم والبريد الإلكتروني (بشكل صحيح) والرسالة.',
    phoneLabel: 'رقم التواصل الموحد',
    emailLabel: 'البريد الإلكتروني',
    regionsValue: 'جميع مناطق المملكة',
    regionsLabel: 'فروعنا المنتشرة',
    social: [
      { id: 'x', name: 'X', icon: 'x', href: 'https://x.com/' },
      { id: 'instagram', name: 'Instagram', icon: 'instagram', href: 'https://instagram.com/' },
      { id: 'facebook', name: 'Facebook', icon: 'facebook', href: 'https://facebook.com/' },
      { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin', href: 'https://linkedin.com/' },
      { id: 'youtube', name: 'YouTube', icon: 'youtube', href: 'https://youtube.com/' },
    ],
  },

  footer: {
    brandName: '',
    brandSubtitle: '',
    logo: '',
    images: [],
    showYear: true,
    text: 'جميع الحقوق محفوظة لمعهد المسانِدة العالي للتدريب',
    address: 'المملكة العربية السعودية',
    description: 'معهد المسانِدة العالي للتدريب، منصة تعليمية رائدة تقدم برامج تدريبية معتمدة عالية الجودة، تسهم في بناء الكفاءات الوطنية وتأهيلها لسوق العمل.',
    columns: [
      {
        id: 1,
        title: 'روابط سريعة',
        links: [
          { id: 1, label: 'الرئيسية', href: '/' },
          { id: 2, label: 'من نحن', href: '#about' },
          { id: 3, label: 'الأخبار والفعاليات', href: '/gallery' },
          { id: 4, label: 'القبول والتسجيل', href: '#contact' },
          { id: 5, label: 'الفروع', href: '/branches' },
        ],
      },
      {
        id: 2,
        title: 'برامجنا التدريبية',
        links: [
          { id: 1, label: 'برامج الدبلوم', href: '/courses' },
          { id: 2, label: 'برامج الشهادات المهنية', href: '/courses' },
          { id: 3, label: 'برامج قصيرة المدى', href: '/courses' },
          { id: 4, label: 'التعلم عن بعد', href: '/courses' },
        ],
      },
      {
        id: 3,
        title: 'خدمات المتدربين',
        links: [
          { id: 1, label: 'بوابة المتدربين', href: '' },
          { id: 2, label: 'الاستعلام عن الشهادات', href: '' },
          { id: 3, label: 'الدعم الفني', href: '#contact' },
          { id: 4, label: 'سياسات التدريب', href: '' },
          { id: 5, label: 'خدمة العملاء', href: '#contact' },
        ],
      },
    ],
    bottomLinks: [
      { id: 1, label: 'سياسة الخصوصية', href: '' },
      { id: 2, label: 'الشروط والخصوصية', href: '' },
      { id: 3, label: 'خريطة الموقع', href: '' },
    ],
  },
};

const en = {
  site: {
    name: 'Al-Musanadah Institute',
    subtitle: 'Higher Institute for Training',
    phone: '0514569531',
    email: 'info@almosanadah.net',
    logo: '',
    topbar: {
      dashboard: { show: true, label: '', href: '/dashboard', icon: 'user' },
      lang: { show: true, label: '', icon: 'globe' },
    },
    actions: [
      { id: 'services', label: 'My Educational Services', href: '/courses', icon: 'book', variant: 'ghost' },
      { id: 'register', label: 'Register Now', href: '#contact', icon: 'user', variant: 'primary' },
    ],
  },

  nav: [
    { id: 'home', label: 'Home', href: '#home' },
    { id: 'about', label: 'About Us', href: '#about' },
    { id: 'programs', label: 'Training Programs', href: '/programs' },
    { id: 'trainers', label: 'Al Musanadah Community', href: '#stats' },
    { id: 'admission', label: 'Admission Requirements', href: '/admission' },
    { id: 'system', label: 'Administrative Portal', href: '#stats' },
    { id: 'faq', label: 'Our Branches', href: '/branches' },
    { id: 'contact', label: 'Contact Us', href: '#contact' },
  ],

  /* order / visibility of the home page sections (edited in the dashboard, shared by both languages) */
  homeLayout: {
    order: ['hero', 'features', 'programs', 'about', 'stats', 'gallery', 'branches', 'accreditation', 'testimonials', 'partners', 'faq', 'contact'],
    hidden: [],
  },

  hero: {
    title: 'Al-Musanadah Institute',
    highlight: 'An outstanding learning environment… that shapes your future',
    description:
      'We offer high-quality educational and training programs across a wide range of specializations, led by an elite team of certified trainers, helping build a generation ready for the job market in the Kingdom of Saudi Arabia.',
    cta: 'Discover Our Programs',
    badges: [
      { id: 1, icon: 'cap', text: 'Accredited programs across all specializations' },
      { id: 2, icon: 'book', text: 'Documented, up-to-date learning standards' },
      { id: 3, icon: 'users', text: 'A wide network of job-market connections' },
    ],
    image: 'poster.png',
  },

  features: [
    { id: 1, icon: 'cert', title: 'Quality of education and training' },
    { id: 2, icon: 'screen', title: 'A supportive and motivating learning environment' },
    { id: 3, icon: 'building', title: 'A supportive and motivating learning environment' },
    { id: 4, icon: 'eye', title: 'Multiple branches across the Kingdom' },
    { id: 5, icon: 'chart', title: 'Towards a better professional future' },
  ],

  programs: {
    title: 'Programs',
    description:
      'Accredited training programs that give you knowledge and hands-on experience in office management and administrative activities, aligned with the needs of the job market.',
    tabs: [
      { id: 'pro', label: 'Professional Diplomas' },
      { id: 'acad', label: 'Academic Diplomas' },
      { id: 'courses', label: 'Professional Courses' },
      { id: 'all', label: 'View All' },
    ],
    items: [
      {
        id: 1,
        program: 'pro',
        category: 'pro',
        title: 'Office Management Course',
        duration: '3 months',
        hours: '180 training hours',
        image: '',
        topics: ['Developing organization and records management skills', 'Developing organization and records management skills', 'Developing organization and records management skills'],
      },
      {
        id: 2,
        program: 'acad',
        category: 'acad',
        title: 'Office Management Course',
        duration: '3 months',
        hours: '180 training hours',
        image: '',
        topics: ['Developing organization and records management skills', 'Developing organization and records management skills', 'Developing organization and records management skills'],
      },
      {
        id: 3,
        program: 'courses',
        category: 'courses',
        title: 'Office Management Course',
        duration: '3 months',
        hours: '180 training hours',
        image: '',
        topics: ['Developing organization and records management skills', 'Developing organization and records management skills', 'Developing organization and records management skills'],
      },
    ],
    detailsLabel: 'View Details',
  },

  about: {
    label: 'About Us',
    title: 'We create real opportunities for a promising professional future',
    paragraphs: [
      'At Al-Musanadah Higher Institute for Training, we believe that quality training is the first step towards professional excellence. That is why we do not stop at delivering knowledge or awarding certificates; we work on developing skills,',
      'strengthening practical experience, and linking learning to the demands of the job market, so that our trainees can build a successful career path, seize better job opportunities, and achieve their ambitions for a more stable and prosperous future.',
    ],
  },

  stats: [
    { id: 1, icon: 'building', value: 27, suffix: '', label: 'Branches' },
    { id: 2, icon: 'users', value: 1500, suffix: '+', label: 'Trainees' },
    { id: 3, icon: 'grad', value: 8500, suffix: '+', label: 'Graduates' },
    { id: 4, icon: 'trainer', value: 105, suffix: '', label: 'Trainers' },
    { id: 5, icon: 'cert', value: 40, suffix: '', label: 'Educational Programs' },
  ],

  courses: {
    title: 'Courses',
    subtitle: 'Al-Musanadah Institute offers the best courses that fit the job market',
    banner: '',
    searchPlaceholder: 'Search for a course, topic or skill ......',
    searchButton: 'Search',
    categoriesTitle: 'Training categories',
    allLabel: 'All courses',
    empty: 'No courses match your search.',
    // NEW: every course must belong to exactly one of these three programs
    programLabel: 'Program',
    programsTitle: 'Program type',
    allProgramsLabel: 'All programs',
    programs: [
      { id: 'acad', label: 'Academic Diplomas' },
      { id: 'pro', label: 'Professional Diplomas' },
      { id: 'courses', label: 'Professional Courses' },
    ],
    categories: [
      { id: 1, label: 'English Language Courses', icon: 'book' },
      { id: 2, label: 'IT Courses', icon: 'screen' },
      { id: 3, label: 'E-Learning', icon: 'cap' },
      { id: 4, label: 'Qualification Courses', icon: 'cert' },
    ],
    // ─────────────────────────────────────────────────────────────
    // 24 courses · 6 per category · 8 per program (acad / pro / courses)
    // ─────────────────────────────────────────────────────────────
    items: [
      // ── Category 1: English Language Courses ───────────────────
      { id: 1,  category: 1, program: 'courses', icon: 'book',   title: 'English Conversation Skills',            href: '' },
      { id: 2,  category: 1, program: 'courses', icon: 'users',  title: 'Business English',                       href: '' },
      { id: 3,  category: 1, program: 'pro',     icon: 'book',   title: 'Advanced English Language Diploma',      href: '' },
      { id: 4,  category: 1, program: 'pro',     icon: 'book',   title: 'Professional Translation Diploma',       href: '' },
      { id: 5,  category: 1, program: 'acad',    icon: 'book',   title: 'Applied English Language Diploma',       href: '' },
      { id: 6,  category: 1, program: 'acad',    icon: 'book',   title: 'English Literature Diploma',             href: '' },

      // ── Category 2: IT Courses ─────────────────────────────────
      { id: 7,  category: 2, program: 'courses', icon: 'screen', title: 'Computer & Networking Basics',           href: '' },
      { id: 8,  category: 2, program: 'courses', icon: 'screen', title: 'Introduction to Programming',            href: '' },
      { id: 9,  category: 2, program: 'pro',     icon: 'screen', title: 'Web Development Diploma',                href: '' },
      { id: 10, category: 2, program: 'pro',     icon: 'chart',  title: 'Cybersecurity Diploma',                  href: '' },
      { id: 11, category: 2, program: 'acad',    icon: 'screen', title: 'Computer Science Diploma',               href: '' },
      { id: 12, category: 2, program: 'acad',    icon: 'chart',  title: 'Data Analysis Diploma',                  href: '' },

      // ── Category 3: E-Learning ─────────────────────────────────
      { id: 13, category: 3, program: 'courses', icon: 'users',   title: 'Interactive Learning Tools',            href: '' },
      { id: 14, category: 3, program: 'courses', icon: 'trainer', title: 'Remote Teaching Skills',                href: '' },
      { id: 15, category: 3, program: 'pro',     icon: 'eye',     title: 'Digital Content Design Diploma',        href: '' },
      { id: 16, category: 3, program: 'pro',     icon: 'screen',  title: 'LMS Management Diploma',                href: '' },
      { id: 17, category: 3, program: 'acad',    icon: 'cap',     title: 'E-Learning Diploma',                    href: '' },
      { id: 18, category: 3, program: 'acad',    icon: 'cap',     title: 'Educational Technology Diploma',        href: '' },

      // ── Category 4: Qualification Courses ──────────────────────
      { id: 19, category: 4, program: 'courses', icon: 'cert',     title: 'Job-Market Readiness',                 href: '' },
      { id: 20, category: 4, program: 'courses', icon: 'users',    title: 'Interview Skills',                     href: '' },
      { id: 21, category: 4, program: 'pro',     icon: 'grad',     title: 'Certified Trainer Preparation Diploma',href: '' },
      { id: 22, category: 4, program: 'pro',     icon: 'chart',    title: 'Digital Marketing Diploma',            href: '' },
      { id: 23, category: 4, program: 'acad',    icon: 'building', title: 'Business Administration Diploma',      href: '' },
      { id: 24, category: 4, program: 'acad',    icon: 'users',    title: 'Human Resources Diploma',              href: '' },
    ],
  },

  branches: {
    title: 'Branches',
    description: 'We make sure to be close to you in every region of the Kingdom through our network of branches, delivering the best educational and training services.',
    banner: '',
    allLabel: 'All branches',
    locationLabel: 'View location',
    videoLabel: 'Intro video',
    perPage: 6,
    regions: [
      { id: 'central', label: 'Central Region' },
      { id: 'eastern', label: 'Eastern Region' },
      { id: 'western', label: 'Western Region' },
      { id: 'northern', label: 'Northern Region' },
      { id: 'southern', label: 'Southern Region' },
    ],
    items: [
      { id: 1, region: 'central', name: 'Riyadh Branch', address: 'Riyadh - Main branch', phone: '0514569531', hours: '8:00 AM - 4:00 PM', mapUrl: 'https://www.google.com/maps?q=24.71,46.68', videoUrl: '', logo: '', lat: 24.71, lng: 46.68 },
      { id: 2, region: 'eastern', name: 'Dammam Branch', address: 'Dammam - Main branch', phone: '0514569531', hours: '8:00 AM - 4:00 PM', mapUrl: 'https://www.google.com/maps?q=26.43,50.1', videoUrl: '', logo: '', lat: 26.43, lng: 50.1 },
      { id: 3, region: 'western', name: 'Jeddah Branch', address: 'Jeddah - Main branch', phone: '0514569531', hours: '8:00 AM - 4:00 PM', mapUrl: 'https://www.google.com/maps?q=21.54,39.17', videoUrl: '', logo: '', lat: 21.54, lng: 39.17 },
      { id: 4, region: 'western', name: 'Makkah Branch', address: 'Makkah - Main branch', phone: '0514569531', hours: '8:00 AM - 4:00 PM', mapUrl: 'https://www.google.com/maps?q=21.39,39.86', videoUrl: '', logo: '', lat: 21.39, lng: 39.86 },
      { id: 5, region: 'western', name: 'Madinah Branch', address: 'Madinah - Main branch', phone: '0514569531', hours: '8:00 AM - 4:00 PM', mapUrl: 'https://www.google.com/maps?q=24.47,39.61', videoUrl: '', logo: '', lat: 24.47, lng: 39.61 },
      { id: 6, region: 'northern', name: 'Tabuk Branch', address: 'Tabuk - Main branch', phone: '0514569531', hours: '8:00 AM - 4:00 PM', mapUrl: 'https://www.google.com/maps?q=28.38,36.57', videoUrl: '', logo: '', lat: 28.38, lng: 36.57 },
      { id: 7, region: 'northern', name: 'Sakaka Branch', address: 'Sakaka - Main branch', phone: '0514569531', hours: '8:00 AM - 4:00 PM', mapUrl: 'https://www.google.com/maps?q=29.97,40.2', videoUrl: '', logo: '', lat: 29.97, lng: 40.2 },
      { id: 8, region: 'northern', name: 'Hail Branch', address: 'Hail - Main branch', phone: '0514569531', hours: '8:00 AM - 4:00 PM', mapUrl: 'https://www.google.com/maps?q=27.52,41.7', videoUrl: '', logo: '', lat: 27.52, lng: 41.7 },
      { id: 9, region: 'southern', name: 'Abha Branch', address: 'Abha - Main branch', phone: '0514569531', hours: '8:00 AM - 4:00 PM', mapUrl: 'https://www.google.com/maps?q=18.22,42.5', videoUrl: '', logo: '', lat: 18.22, lng: 42.5 },
      { id: 10, region: 'southern', name: 'Jazan Branch', address: 'Jazan - Main branch', phone: '0514569531', hours: '8:00 AM - 4:00 PM', mapUrl: 'https://www.google.com/maps?q=16.89,42.55', videoUrl: '', logo: '', lat: 16.89, lng: 42.55 },
      { id: 11, region: 'southern', name: 'Najran Branch', address: 'Najran - Main branch', phone: '0514569531', hours: '8:00 AM - 4:00 PM', mapUrl: 'https://www.google.com/maps?q=17.49,44.13', videoUrl: '', logo: '', lat: 17.49, lng: 44.13 },
    ],
  },

  gallery: {
    title: 'Photo Gallery',
    allLabel: 'View all',
    empty: 'No photos in this section yet.',
    tabs: [
      { id: 'programs', label: 'Training programs', icon: 'book' },
      { id: 'events', label: 'Events & meetups', icon: 'layers' },
      { id: 'facilities', label: 'Institute facilities', icon: 'building' },
    ],
    items: [
      { id: 1, category: 'programs', title: 'Where skill begins… and ambition grows', date: 'October 2026', image: '/gallery/meeting.jpg' },
      { id: 2, category: 'events', title: 'A space for dialogue and sharing experience', date: 'September 2026', image: '/gallery/dialogue.jpg' },
      { id: 3, category: 'facilities', title: 'An environment ready for every step', date: 'September 2026', image: '/gallery/classroom.jpg' },
      { id: 4, category: 'facilities', title: 'An environment ready for every step', date: 'September 2026', image: '/gallery/classroom.jpg' },
      { id: 5, category: 'facilities', title: 'An environment ready for every step', date: 'September 2026', image: '/gallery/classroom.jpg' },
      { id: 6, category: 'facilities', title: 'An environment ready for every step', date: 'September 2026', image: '/gallery/classroom.jpg' },
    ],
  },

  accreditation: {
    title: 'Accreditation',
    allLabel: 'View all',
    tabs: [
      { id: 'gov', label: 'Government accreditation', icon: 'cert' },
      { id: 'intl', label: 'International accreditation', icon: 'globe' },
    ],
    items: [
      { id: 1, category: 'gov', name: 'Accredited by the Technical and Vocational Training Corporation', logo: '/accreditation/a1.png' },
      { id: 2, category: 'gov', name: 'Classified and accredited by the Ministry of Human Resources and Social Development', logo: '/accreditation/a2.png' },
      { id: 3, category: 'gov', name: 'Classified by the Saudi Commission for Health Specialties', logo: '/accreditation/a3.png' },
      { id: 4, category: 'gov', name: 'National eLearning Center', logo: '/accreditation/a4.png' },
    ],
  },

  testimonials: {
    title: 'Student Reviews',
    items: [
      { id: 1, name: 'Mohamed Ragab', meta: 'Institute graduate', rating: 5, image: '', text: 'Hello, Al-Musanadah Institute is of a very high professional standard.' },
      { id: 2, name: 'Mohamed Ragab', meta: 'Institute graduate', rating: 5, image: '', text: 'Hello, Al-Musanadah Institute is of a very high professional standard.' },
      { id: 3, name: 'Mohamed Ragab', meta: 'Institute graduate', rating: 5, image: '', text: 'Hello, Al-Musanadah Institute is of a very high professional standard.' },
    ],
  },

  partners: {
    title: 'Our Partners',
    subtitle: 'We are proud of our partnerships with the entities and institutions that support our journey and help us achieve our goals',
    items: [
      { id: 1, name: 'Partner 1', logo: '/accreditation/a1.png', href: '' },
      { id: 2, name: 'Partner 2', logo: '/accreditation/a2.png', href: '' },
      { id: 3, name: 'Partner 3', logo: '/accreditation/a3.png', href: '' },
      { id: 4, name: 'Partner 4', logo: '/accreditation/a4.png', href: '' },
      { id: 5, name: 'Partner 5', logo: '/logo.png', href: '' },
      { id: 6, name: 'Partner 6', logo: '/accreditation/a1.png', href: '' },
      { id: 7, name: 'Partner 7', logo: '/accreditation/a2.png', href: '' },
      { id: 8, name: 'Partner 8', logo: '/accreditation/a3.png', href: '' },
      { id: 9, name: 'Partner 9', logo: '/accreditation/a4.png', href: '' },
      { id: 10, name: 'Partner 10', logo: '/logo.png', href: '' },
      { id: 11, name: 'Partner 11', logo: '/accreditation/a1.png', href: '' },
      { id: 12, name: 'Partner 12', logo: '/accreditation/a2.png', href: '' },
    ],
  },

  faq: {
    title: 'Frequently Asked Questions',
    subtitle: 'Answers to the most common questions, to help you find the information you need quickly and easily',
    items: [
      { id: 1, q: 'How long does it take to process a request?', a: 'Processing time depends on the type of service, and usually ranges from two days to one working week. You will be notified of the request status through your chosen contact channels.' },
      { id: 2, q: 'Can I cancel a request after submitting it?', a: 'You can ask for a cancellation by contacting the trainee services team. Whether it is possible depends on the stage of processing and the type of service.' },
      { id: 3, q: 'What payment methods are available?', a: 'Several payment methods are available. Ask your nearest branch or contact us to learn which options apply to your program.' },
      { id: 4, q: 'How can I enroll in a program?', a: 'Pick the right program from the Programs section and press “Register Now”, or contact us and our team will guide you through enrollment step by step.' },
      { id: 5, q: 'Can I visit my nearest branch?', a: 'Of course. You can see all our branches, addresses and working hours on the “Our Branches” page.' },
    ],
  },

  ads: {
    enabled: true,
    label: 'Ad',
    // four positions: two on the left of the page, two on the right (one image per language)
    slots: [
      { id: 'left-1', side: 'left', image: '', href: '/courses', title: 'Discover our programs', text: 'Accredited training programs' },
      { id: 'left-2', side: 'left', image: '', href: '/programs', title: 'Diplomas & courses', text: 'Choose your career path' },
      { id: 'right-1', side: 'right', image: '', href: '#contact', title: 'Register now', text: 'Al-Musanadah Higher Institute' },
      { id: 'right-2', side: 'right', image: '', href: '/admission', title: 'Admission rules', text: 'Learn the entry requirements' },
    ],
  },

  contact: {
    title: 'Contact Us',
    subtitle: 'We are always close to you ... to help you and answer all your questions',
    formTitle: 'Send us a message',
    formHint: 'You can reach us by filling in the form below, and we will reply as soon as possible.',
    name: 'Full name',
    email: 'Email address',
    subject: 'Subject',
    message: 'Message',
    send: 'Send message',
    success: 'Thank you! Your message was prepared and opened in your email app — press “Send” there to complete it.',
    error: 'Please fill in your name, a valid email address and your message.',
    phoneLabel: 'Unified contact number',
    emailLabel: 'Email',
    regionsValue: 'All regions of the Kingdom',
    regionsLabel: 'Our branches nationwide',
    social: [
      { id: 'x', name: 'X', icon: 'x', href: 'https://x.com/' },
      { id: 'instagram', name: 'Instagram', icon: 'instagram', href: 'https://instagram.com/' },
      { id: 'facebook', name: 'Facebook', icon: 'facebook', href: 'https://facebook.com/' },
      { id: 'linkedin', name: 'LinkedIn', icon: 'linkedin', href: 'https://linkedin.com/' },
      { id: 'youtube', name: 'YouTube', icon: 'youtube', href: 'https://youtube.com/' },
    ],
  },

  footer: {
    brandName: '',
    brandSubtitle: '',
    logo: '',
    images: [],
    showYear: true,
    text: 'All rights reserved to Al-Musanadah Higher Institute for Training',
    address: 'Kingdom of Saudi Arabia',
    description: 'Al-Musanadah Higher Institute for Training is a leading educational platform offering accredited, high-quality training programs that help build national talent and prepare it for the job market.',
    columns: [
      {
        id: 1,
        title: 'Quick Links',
        links: [
          { id: 1, label: 'Home', href: '/' },
          { id: 2, label: 'About Us', href: '#about' },
          { id: 3, label: 'News & Events', href: '/gallery' },
          { id: 4, label: 'Admission & Registration', href: '#contact' },
          { id: 5, label: 'Branches', href: '/branches' },
        ],
      },
      {
        id: 2,
        title: 'Our Training Programs',
        links: [
          { id: 1, label: 'Diploma Programs', href: '/courses' },
          { id: 2, label: 'Professional Certificates', href: '/courses' },
          { id: 3, label: 'Short-term Programs', href: '/courses' },
          { id: 4, label: 'Distance Learning', href: '/courses' },
        ],
      },
      {
        id: 3,
        title: 'Trainee Services',
        links: [
          { id: 1, label: 'Trainee Portal', href: '' },
          { id: 2, label: 'Certificate Inquiry', href: '' },
          { id: 3, label: 'Technical Support', href: '#contact' },
          { id: 4, label: 'Training Policies', href: '' },
          { id: 5, label: 'Customer Service', href: '#contact' },
        ],
      },
    ],
    bottomLinks: [
      { id: 1, label: 'Privacy Policy', href: '' },
      { id: 2, label: 'Terms & Conditions', href: '' },
      { id: 3, label: 'Site Map', href: '' },
    ],
  },
};

// programs catalog: groups → diplomas → courses → modules (same shape the public /programs pages render)
ar.catalog = { groups: getCatalogGroups('ar') };
en.catalog = { groups: getCatalogGroups('en') };

/*
 * Courses page: every course card opens a details window. Give each shipped course sensible details
 * (duration, hours, short description, highlights) by program type; the dashboard can edit all of them.
 * branchMode 'all' = offered at every branch (pick specific branches per course in the dashboard).
 */
const COURSE_DEFAULTS = {
  ar: {
    acad: { duration: 'سنتان', hours: 960, tail: 'دبلوم أكاديمي يمنحك أساسًا علميًا متينًا ويؤهلك لمواصلة مسارك الأكاديمي والمهني.' },
    pro: { duration: '6 أشهر', hours: 360, tail: 'دبلوم مهني تطبيقي يركّز على المهارات التي يطلبها سوق العمل.' },
    courses: { duration: '4 أسابيع', hours: 40, tail: 'دورة قصيرة ومكثفة لاكتساب مهارة محددة في وقت قياسي.' },
    highlights: ['محتوى تطبيقي يواكب سوق العمل', 'مدربون ذوو خبرة عملية', 'شهادة معتمدة بعد إتمام البرنامج'],
    requirements: ['شهادة الثانوية العامة أو ما يعادلها'],
  },
  en: {
    acad: { duration: '2 years', hours: 960, tail: 'An academic diploma that builds a strong foundation and prepares you for further study and work.' },
    pro: { duration: '6 months', hours: 360, tail: 'An applied professional diploma focused on the skills the job market asks for.' },
    courses: { duration: '4 weeks', hours: 40, tail: 'A short, intensive course to gain a specific skill quickly.' },
    highlights: ['Practical content aligned with the job market', 'Instructors with hands-on experience', 'Accredited certificate on completion'],
    requirements: ['High-school certificate or equivalent'],
  },
};
[['ar', ar], ['en', en]].forEach(([l, c]) => {
  const d = COURSE_DEFAULTS[l];
  c.courses.items = c.courses.items.map((it) => {
    const p = d[it.program] || d.courses;
    return {
      ...it,
      desc: it.desc ?? `${it.title}. ${p.tail}`,
      duration: it.duration ?? p.duration,
      hours: it.hours ?? p.hours,
      highlights: it.highlights ?? d.highlights,
      requirements: it.requirements ?? d.requirements,
      branchMode: it.branchMode ?? 'all',
      branchIds: it.branchIds ?? [],
    };
  });
});

export const defaultContents = { ar, en };

export const defaultCredentials = { username: 'admin', password: 'admin123' };