// Hierarchical programs catalog.
//   Level 1  groups   (Academic Diplomas / Professional Diplomas / Professional Courses)
//   Level 2  types    (a diploma or a course family inside a group)
//   Level 3  courses  (subjects / modules of that diploma)
//   Level 4  course details + study plan
//
// Every text is written once as { ar, en } through t(); getCatalog(lang) resolves it to plain strings.
// Group ids intentionally match courses.programs ids ('acad' | 'pro' | 'courses').
// Shared details (objectives, outcomes, skills, practical, prerequisites) are set once per type
// and can be overridden on any single course.

const t = (ar, en) => ({ ar, en });

const mod = (ar, en, topics) => ({ title: t(ar, en), topics: topics.map(([a, e]) => t(a, e)) });

const course = (id, icon, title, desc, hours, weeks, modules, extra = {}) => ({
  id,
  icon,
  title: t(...title),
  desc: t(...desc),
  hours,
  duration: t(`${weeks} أسابيع`, `${weeks} weeks`),
  modules: modules.map((m) => ({ ...m, hours: Math.round(hours / modules.length) })),
  ...extra,
});

const type = (id, icon, title, desc, duration, hours, shared, courses) => ({
  id,
  icon,
  title: t(...title),
  desc: t(...desc),
  duration: t(...duration),
  hours,
  courses: courses.map((c) => ({ ...shared, ...c })),
});

const list = (...pairs) => pairs.map(([a, e]) => t(a, e));

/* ───────────────────────── ACADEMIC DIPLOMAS ───────────────────────── */
const business = type(
  'business-admin',
  'building',
  ['دبلوم إدارة الأعمال', 'Business Administration Diploma'],
  ['أساس أكاديمي متكامل في الإدارة والمحاسبة وبيئة الأعمال.', 'A complete academic foundation in management, accounting and the business environment.'],
  ['سنتان', '2 years'],
  960,
  {
    objectives: list(
      ['تعريف المتدرب بالمفاهيم الأساسية في الإدارة وبيئة الأعمال.', 'Introduce the core concepts of management and the business environment.'],
      ['تنمية القدرة على التحليل واتخاذ القرار.', 'Develop analytical and decision-making ability.'],
      ['إعداد المتدرب للعمل في المنشآت الحكومية والخاصة.', 'Prepare trainees for public- and private-sector roles.']
    ),
    outcomes: list(
      ['يشرح وظائف الإدارة ويطبقها على حالات واقعية.', 'Explains management functions and applies them to real cases.'],
      ['يعدّ تقارير مالية وإدارية بسيطة.', 'Prepares basic financial and management reports.'],
      ['يعمل ضمن فريق ويدير مهامه بكفاءة.', 'Works within a team and manages tasks efficiently.']
    ),
    skills: list(['التخطيط والتنظيم', 'Planning and organizing'], ['التحليل المالي الأساسي', 'Basic financial analysis'], ['التواصل المهني', 'Professional communication'], ['حل المشكلات', 'Problem solving']),
    practical: list(['دراسات حالة أسبوعية وعروض تقديمية جماعية.', 'Weekly case studies and group presentations.'], ['اختبار منتصف المقرر واختبار نهائي ومشروع تطبيقي.', 'Mid-term exam, final exam and an applied project.']),
    prerequisites: list(['شهادة الثانوية العامة أو ما يعادلها.', 'High-school certificate or equivalent.']),
  },
  [
    course('principles-management', 'users', ['مبادئ الإدارة', 'Principles of Management'], ['يتناول وظائف الإدارة الأربع ونظريات التنظيم والقيادة.', 'Covers the four management functions, organizational theory and leadership.'], 120, 12, [
      mod('مدخل إلى الإدارة', 'Introduction to Management', [['تطور الفكر الإداري', 'Evolution of management thought'], ['مستويات الإدارة ومهاراتها', 'Management levels and skills']]),
      mod('التخطيط والتنظيم', 'Planning and Organizing', [['أنواع الخطط وأهدافها', 'Types of plans and goals'], ['الهياكل التنظيمية', 'Organizational structures']]),
      mod('القيادة والرقابة', 'Leading and Controlling', [['أنماط القيادة والتحفيز', 'Leadership styles and motivation'], ['أدوات الرقابة وقياس الأداء', 'Control tools and performance measurement']]),
    ]),
    course('financial-accounting', 'chart', ['المحاسبة المالية', 'Financial Accounting'], ['أساسيات القيد المحاسبي وإعداد القوائم المالية.', 'Fundamentals of bookkeeping and preparing financial statements.'], 140, 14, [
      mod('المبادئ المحاسبية', 'Accounting Principles', [['المعادلة المحاسبية', 'The accounting equation'], ['القيد المزدوج ودفتر اليومية', 'Double entry and the journal']]),
      mod('دفتر الأستاذ وميزان المراجعة', 'Ledger and Trial Balance', [['الترحيل وإعداد ميزان المراجعة', 'Posting and preparing the trial balance'], ['قيود التسوية', 'Adjusting entries']]),
      mod('القوائم المالية', 'Financial Statements', [['قائمة الدخل والمركز المالي', 'Income statement and balance sheet'], ['قراءة القوائم وتفسيرها', 'Reading and interpreting statements']]),
    ], { prerequisites: list(['إتمام مقرر مبادئ الإدارة يُفضّل.', 'Completion of Principles of Management is preferred.']) }),
  ]
);

const computerScience = type(
  'computer-science',
  'screen',
  ['دبلوم علوم الحاسب', 'Computer Science Diploma'],
  ['أساسيات البرمجة وقواعد البيانات لبناء مسار تقني متين.', 'Programming and database fundamentals for a solid technical path.'],
  ['سنتان', '2 years'],
  1000,
  {
    objectives: list(
      ['ترسيخ أسس التفكير الحاسوبي والبرمجة.', 'Build solid foundations in computational thinking and programming.'],
      ['تمكين المتدرب من تصميم قواعد بيانات واستعلامها.', 'Enable trainees to design and query databases.'],
      ['تجهيز المتدرب للتخصصات التقنية المتقدمة.', 'Prepare trainees for advanced technical specializations.']
    ),
    outcomes: list(
      ['يكتب برامج منظمة بلغة برمجية حديثة.', 'Writes well-structured programs in a modern language.'],
      ['يصمم جداول مترابطة وينفذ استعلامات.', 'Designs related tables and runs queries.'],
      ['يختبر برامجه ويصلح أخطاءها.', 'Tests and debugs his or her programs.']
    ),
    skills: list(['البرمجة', 'Programming'], ['تصميم قواعد البيانات', 'Database design'], ['التفكير المنطقي', 'Logical thinking'], ['التوثيق التقني', 'Technical documentation']),
    practical: list(['معامل برمجة أسبوعية مع واجبات تطبيقية.', 'Weekly coding labs with practical assignments.'], ['مشروع ختامي يُقيَّم أمام لجنة.', 'A final project assessed by a panel.']),
    prerequisites: list(['شهادة الثانوية العامة أو ما يعادلها.', 'High-school certificate or equivalent.'], ['إلمام أساسي باستخدام الحاسب.', 'Basic computer literacy.']),
  },
  [
    course('programming-fundamentals', 'screen', ['أساسيات البرمجة', 'Programming Fundamentals'], ['مدخل عملي إلى البرمجة: المتغيرات، الشروط، الحلقات والدوال.', 'A hands-on introduction: variables, conditions, loops and functions.'], 150, 15, [
      mod('المتغيرات وأنواع البيانات', 'Variables and Data Types', [['الإدخال والإخراج', 'Input and output'], ['العمليات الحسابية والمنطقية', 'Arithmetic and logical operations']]),
      mod('التحكم في التدفق', 'Control Flow', [['الجمل الشرطية', 'Conditional statements'], ['الحلقات التكرارية', 'Loops']]),
      mod('الدوال والمصفوفات', 'Functions and Arrays', [['تعريف الدوال واستدعاؤها', 'Defining and calling functions'], ['التعامل مع القوائم', 'Working with lists']]),
    ], { prerequisites: list(['لا توجد متطلبات سابقة.', 'No prior requirements.']) }),
    course('databases', 'layers', ['قواعد البيانات', 'Databases'], ['تصميم قواعد البيانات العلاقية والاستعلام عنها بلغة SQL.', 'Designing relational databases and querying them with SQL.'], 130, 13, [
      mod('النمذجة', 'Data Modeling', [['الكيانات والعلاقات', 'Entities and relationships'], ['التطبيع', 'Normalization']]),
      mod('لغة SQL الأساسية', 'Core SQL', [['الاستعلام والتصفية', 'Selecting and filtering'], ['الربط والتجميع', 'Joins and aggregation']]),
      mod('إدارة البيانات', 'Data Management', [['الفهارس والأداء', 'Indexes and performance'], ['النسخ الاحتياطي والأمان', 'Backup and security']]),
    ]),
  ]
);

/* ───────────────────────── PROFESSIONAL DIPLOMAS ───────────────────────── */
const marketing = type(
  'digital-marketing',
  'chart',
  ['دبلوم التسويق الرقمي', 'Digital Marketing Diploma'],
  ['مهارات تسويقية تطبيقية تلبي احتياجات الشركات الرقمية.', 'Applied marketing skills that meet the needs of digital-first companies.'],
  ['6 أشهر', '6 months'],
  360,
  {
    objectives: list(
      ['فهم قنوات التسويق الرقمي وكيفية التكامل بينها.', 'Understand digital channels and how they work together.'],
      ['بناء حملات إعلانية وقياس نتائجها.', 'Build ad campaigns and measure their results.'],
      ['إعداد المتدرب لدخول سوق العمل أو إدارة نشاطه الخاص.', 'Prepare trainees to enter the job market or run their own business.']
    ),
    outcomes: list(
      ['يخطط حملة رقمية متكاملة بميزانية محددة.', 'Plans a complete digital campaign within a set budget.'],
      ['يحلل مؤشرات الأداء ويحسّن الحملات.', 'Analyzes KPIs and optimizes campaigns.'],
      ['ينتج محتوى مناسبًا لكل منصة.', 'Produces content suited to each platform.']
    ),
    skills: list(['إدارة الحملات الإعلانية', 'Ad campaign management'], ['كتابة المحتوى', 'Content writing'], ['تحليل البيانات التسويقية', 'Marketing analytics'], ['تحسين محركات البحث', 'Search engine optimization']),
    practical: list(['تنفيذ حملة حقيقية بميزانية تجريبية.', 'Run a live campaign on a trial budget.'], ['تقييم مستمر وعرض ختامي لملف الأعمال.', 'Continuous assessment and a final portfolio presentation.']),
    prerequisites: list(['إجادة استخدام الحاسب والإنترنت.', 'Comfortable using computers and the internet.']),
  },
  [
    course('social-media', 'users', ['التسويق عبر وسائل التواصل', 'Social Media Marketing'], ['بناء الحضور على المنصات وإدارة المجتمعات والإعلانات الممولة.', 'Building presence on platforms, community management and paid ads.'], 90, 8, [
      mod('استراتيجية المنصات', 'Platform Strategy', [['اختيار المنصة والجمهور', 'Choosing platforms and audiences'], ['تقويم المحتوى', 'Content calendar']]),
      mod('الإعلانات الممولة', 'Paid Advertising', [['إعداد الحملات وأهدافها', 'Setting up campaigns and goals'], ['الاستهداف والميزانية', 'Targeting and budget']]),
      mod('القياس والتحسين', 'Measurement and Optimization', [['لوحات المؤشرات', 'Dashboards'], ['اختبار الإعلانات A/B', 'A/B testing ads']]),
    ]),
    course('seo-content', 'eye', ['تحسين محركات البحث وصناعة المحتوى', 'SEO and Content Creation'], ['رفع ظهور المواقع في نتائج البحث وكتابة محتوى يحقق التحويل.', 'Improving search visibility and writing content that converts.'], 100, 9, [
      mod('أساسيات SEO', 'SEO Basics', [['الكلمات المفتاحية', 'Keyword research'], ['تحسين الصفحات', 'On-page optimization']]),
      mod('كتابة المحتوى', 'Content Writing', [['هيكلة المقال', 'Structuring an article'], ['أسلوب الكتابة التسويقية', 'Copywriting style']]),
      mod('الروابط والتحليل', 'Links and Analytics', [['بناء الروابط الخلفية', 'Backlink building'], ['تحليل الزيارات', 'Traffic analysis']]),
    ]),
  ]
);

const trainerPrep = type(
  'trainer-prep',
  'trainer',
  ['دبلوم إعداد المدربين المعتمدين', 'Certified Trainer Preparation Diploma'],
  ['تأهيل مهني لتصميم البرامج التدريبية وتقديمها باحترافية.', 'Professional qualification to design and deliver training programs.'],
  ['4 أشهر', '4 months'],
  240,
  {
    objectives: list(
      ['إتقان تحليل الاحتياجات التدريبية وتصميم الحقائب.', 'Master training-needs analysis and course design.'],
      ['تنمية مهارات العرض والتيسير داخل القاعة.', 'Develop presentation and facilitation skills.'],
      ['تطبيق معايير الجودة وقياس أثر التدريب.', 'Apply quality standards and measure training impact.']
    ),
    outcomes: list(
      ['يصمم حقيبة تدريبية متكاملة.', 'Designs a complete training package.'],
      ['يقدم جلسة تدريبية مؤثرة ويدير المجموعة.', 'Delivers an engaging session and manages the group.'],
      ['يقيس نتائج التدريب بمؤشرات واضحة.', 'Measures training results with clear indicators.']
    ),
    skills: list(['التصميم التعليمي', 'Instructional design'], ['مهارات العرض', 'Presentation skills'], ['إدارة القاعة', 'Classroom management'], ['التقييم والقياس', 'Assessment and evaluation']),
    practical: list(['تقديم جلسات تدريبية قصيرة أمام الزملاء.', 'Short training sessions delivered to peers.'], ['تقييم أداء عملي من لجنة معتمدة.', 'A practical performance evaluation by an accredited panel.']),
    prerequisites: list(['مؤهل جامعي أو خبرة عملية لا تقل عن سنتين.', 'A university degree or at least two years of work experience.']),
  },
  [
    course('needs-analysis', 'cert', ['تحليل الاحتياجات التدريبية', 'Training Needs Analysis'], ['تحديد الفجوات المهارية وتحويلها إلى أهداف تدريبية قابلة للقياس.', 'Identifying skill gaps and turning them into measurable training goals.'], 80, 7, [
      mod('مفهوم الاحتياج التدريبي', 'The Training Need', [['مستويات التحليل', 'Levels of analysis'], ['مصادر البيانات', 'Data sources']]),
      mod('أدوات الجمع', 'Collection Tools', [['الاستبيانات والمقابلات', 'Surveys and interviews'], ['الملاحظة وتحليل الأداء', 'Observation and performance review']]),
      mod('التقرير والتوصيات', 'Report and Recommendations', [['ترتيب الأولويات', 'Prioritizing needs'], ['كتابة الأهداف', 'Writing objectives']]),
    ]),
    course('presentation-skills', 'users', ['مهارات التقديم والتيسير', 'Presentation and Facilitation Skills'], ['تقنيات العرض والتفاعل مع المتدربين وإدارة الوقت والأسئلة.', 'Delivery techniques, audience interaction, time and Q&A management.'], 90, 8, [
      mod('الحضور والصوت', 'Presence and Voice', [['لغة الجسد', 'Body language'], ['التحكم في الصوت', 'Voice control']]),
      mod('أنشطة التفاعل', 'Engagement Activities', [['العصف الذهني والمجموعات', 'Brainstorming and group work'], ['الألعاب التدريبية', 'Training games']]),
      mod('إدارة المواقف الصعبة', 'Handling Difficult Moments', [['التعامل مع الأسئلة', 'Handling questions'], ['ضبط الوقت', 'Managing time']]),
    ]),
  ]
);

/* ───────────────────────── PROFESSIONAL COURSES ───────────────────────── */
const office = type(
  'office-management',
  'book',
  ['دورات الإدارة المكتبية', 'Office Management Courses'],
  ['دورات قصيرة لتنظيم العمل المكتبي وإدارة المراسلات والملفات.', 'Short courses on organizing office work, correspondence and records.'],
  ['3 أشهر', '3 months'],
  180,
  {
    objectives: list(
      ['تطوير مهارات التنظيم وإدارة المرجعات.', 'Develop organization and records-management skills.'],
      ['إتقان كتابة المراسلات الرسمية.', 'Master formal business writing.'],
      ['رفع الإنتاجية باستخدام أدوات المكتب الحديثة.', 'Raise productivity with modern office tools.']
    ),
    outcomes: list(
      ['ينظم الملفات الورقية والإلكترونية بنظام واضح.', 'Organizes paper and digital files in a clear system.'],
      ['يكتب خطابات ومحاضر رسمية سليمة.', 'Writes proper formal letters and minutes.'],
      ['يدير جدول المسؤول والاجتماعات.', 'Manages an executive’s schedule and meetings.']
    ),
    skills: list(['التنظيم', 'Organization'], ['إدارة الوقت', 'Time management'], ['الكتابة الرسمية', 'Business writing'], ['استخدام برامج المكتب', 'Office software']),
    practical: list(['تمارين عملية على نماذج مكتبية حقيقية.', 'Hands-on exercises with real office templates.'], ['اختبار عملي في نهاية الدورة.', 'A practical test at the end of the course.']),
    prerequisites: list(['لا توجد متطلبات سابقة.', 'No prior requirements.']),
  },
  [
    course('records-filing', 'layers', ['إدارة المرجعات والأرشفة', 'Records and Filing Management'], ['أنظمة الأرشفة الورقية والإلكترونية وحفظ الوثائق.', 'Paper and digital filing systems and document retention.'], 60, 5, [
      mod('أسس الأرشفة', 'Filing Fundamentals', [['أنظمة التصنيف', 'Classification systems'], ['الترميز والفهرسة', 'Coding and indexing']]),
      mod('الأرشفة الإلكترونية', 'Digital Archiving', [['المسح الضوئي وتسمية الملفات', 'Scanning and file naming'], ['النسخ الاحتياطي', 'Backups']]),
    ]),
    course('business-correspondence', 'book', ['المراسلات الإدارية', 'Business Correspondence'], ['كتابة الخطابات والتقارير والمحاضر بأسلوب مهني.', 'Writing letters, reports and minutes in a professional tone.'], 60, 5, [
      mod('الخطابات الرسمية', 'Formal Letters', [['البنية والصياغة', 'Structure and wording'], ['العبارات المهنية', 'Professional phrasing']]),
      mod('المحاضر والتقارير', 'Minutes and Reports', [['تدوين الاجتماعات', 'Taking meeting notes'], ['كتابة تقرير موجز', 'Writing a concise report']]),
    ]),
  ]
);

const english = type(
  'workplace-english',
  'globe',
  ['دورات اللغة الإنجليزية للعمل', 'Workplace English Courses'],
  ['دورات تطبيقية لتعزيز الإنجليزية في بيئة العمل والمقابلات.', 'Applied courses to strengthen English at work and in interviews.'],
  ['شهران', '2 months'],
  120,
  {
    objectives: list(
      ['تعزيز الطلاقة في المحادثات المهنية.', 'Build fluency in professional conversations.'],
      ['اكتساب المفردات والعبارات الخاصة بالأعمال.', 'Acquire business vocabulary and expressions.'],
      ['رفع الثقة في المقابلات والاجتماعات.', 'Raise confidence in interviews and meetings.']
    ),
    outcomes: list(
      ['يجري محادثة مهنية بثقة.', 'Holds a professional conversation with confidence.'],
      ['يكتب بريدًا إلكترونيًا واضحًا بالإنجليزية.', 'Writes a clear email in English.'],
      ['يجيب عن أسئلة المقابلة الشائعة.', 'Answers common interview questions.']
    ),
    skills: list(['المحادثة', 'Speaking'], ['الاستماع', 'Listening'], ['الكتابة المهنية', 'Professional writing'], ['العروض باللغة الإنجليزية', 'Presenting in English']),
    practical: list(['محاكاة مواقف عمل وتمثيل أدوار.', 'Workplace simulations and role play.'], ['تقييم شفهي وكتابي في نهاية الدورة.', 'Oral and written assessment at the end.']),
    prerequisites: list(['مستوى إنجليزي أساسي (A2).', 'Basic English level (A2).']),
  },
  [
    course('business-english', 'users', ['الإنجليزية للأعمال', 'Business English'], ['لغة الاجتماعات والمراسلات والعروض في بيئة العمل.', 'The language of meetings, emails and presentations at work.'], 60, 6, [
      mod('الاجتماعات والمكالمات', 'Meetings and Calls', [['العبارات الشائعة', 'Common expressions'], ['التفاوض البسيط', 'Simple negotiation']]),
      mod('البريد المهني', 'Professional Email', [['البنية والنبرة', 'Structure and tone'], ['الردود والمتابعة', 'Replies and follow-ups']]),
    ]),
    course('interview-english', 'cert', ['الإنجليزية للمقابلات الشخصية', 'Interview English'], ['التحضير لأسئلة المقابلة وتقديم النفس بثقة.', 'Preparing for interview questions and presenting yourself with confidence.'], 60, 6, [
      mod('التعريف بالنفس', 'Introducing Yourself', [['السيرة المختصرة', 'The short pitch'], ['نقاط القوة والخبرات', 'Strengths and experience']]),
      mod('الأسئلة الشائعة', 'Common Questions', [['أسئلة السلوك والمواقف', 'Behavioral questions'], ['أسئلة ختامية للمُقابِل', 'Closing questions for the interviewer']]),
    ]),
  ]
);

/* ─────────────────────────────── CATALOG ─────────────────────────────── */
const catalog = {
  ui: {
    home: t('الرئيسية', 'Home'),
    programs: t('البرامج', 'Programs'),
    title: t('البرامج التدريبية', 'Training Programs'),
    subtitle: t('اختر نوع البرنامج ثم الدبلوم ثم المقرر لتصل إلى الخطة الدراسية الكاملة.', 'Pick a program group, then a diploma, then a course to reach its full study plan.'),
    back: t('رجوع', 'Back'),
    explore: t('استعرض', 'Explore'),
    viewCourses: t('عرض المقررات', 'View courses'),
    viewDetails: t('عرض التفاصيل والخطة الدراسية', 'View details & study plan'),
    showModules: t('عرض المحاور', 'Show modules'),
    hideModules: t('إخفاء المحاور', 'Hide modules'),
    types: t('نوع', 'types'),
    courses: t('مقرر', 'courses'),
    modules: t('محاور', 'modules'),
    duration: t('المدة', 'Duration'),
    hours: t('ساعة تدريبية', 'training hours'),
    hoursShort: t('ساعة', 'hrs'),
    chooseType: t('اختر الدبلوم أو نوع الدورة', 'Choose a diploma or course type'),
    chooseCourse: t('مقررات هذا البرنامج', 'Courses in this program'),
    overview: t('نبذة عن المقرر', 'Course overview'),
    objectives: t('أهداف المقرر', 'Course objectives'),
    outcomes: t('مخرجات التعلم', 'Learning outcomes'),
    content: t('محتوى المقرر ومحاوره', 'Course content & modules'),
    plan: t('الخطة الدراسية التفصيلية', 'Detailed study plan'),
    practical: t('التدريب العملي والتقييم', 'Practical training & assessment'),
    skills: t('المهارات المكتسبة', 'Skills acquired'),
    prerequisites: t('المتطلبات والشروط المسبقة', 'Requirements & prerequisites'),
    module: t('المحور', 'Module'),
    topics: t('المواضيع', 'Topics'),
    expandAll: t('فتح الكل', 'Expand all'),
    collapseAll: t('إغلاق الكل', 'Collapse all'),
    summary: t('ملخص المقرر', 'Course summary'),
    register: t('سجّل الآن', 'Register now'),
    prev: t('المقرر السابق', 'Previous course'),
    next: t('المقرر التالي', 'Next course'),
    empty: t('لا يوجد محتوى بعد.', 'Nothing here yet.'),
    notFound: t('لم نعثر على هذه الصفحة.', 'We could not find this page.'),
    backToPrograms: t('العودة إلى البرامج', 'Back to programs'),
  },
  groups: [
    {
      id: 'acad',
      icon: 'cap',
      title: t('الدبلومات الأكاديمية', 'Academic Diplomas'),
      desc: t('برامج أكاديمية متخصصة تمنحك أساسًا علميًا متينًا في مجالك.', 'Specialized academic programs that give you a strong scientific foundation.'),
      types: [business, computerScience],
    },
    {
      id: 'pro',
      icon: 'cert',
      title: t('الدبلومات المهنية', 'Professional Diplomas'),
      desc: t('دبلومات تطبيقية تركز على المهارات المطلوبة في سوق العمل.', 'Applied diplomas focused on the skills the job market demands.'),
      types: [marketing, trainerPrep],
    },
    {
      id: 'courses',
      icon: 'book',
      title: t('الدورات المهنية', 'Professional Courses'),
      desc: t('دورات قصيرة ومكثفة لاكتساب مهارة محددة في وقت قياسي.', 'Short, intensive courses to gain a specific skill quickly.'),
      types: [office, english],
    },
  ],
};

// ── resolver: { ar, en } leaves → strings ──
const isLeaf = (v) =>
  v && typeof v === 'object' && !Array.isArray(v) && Object.keys(v).length === 2 && 'ar' in v && 'en' in v;

const resolve = (node, lang) => {
  if (isLeaf(node)) return node[lang];
  if (Array.isArray(node)) return node.map((x) => resolve(x, lang));
  if (node && typeof node === 'object') {
    return Object.fromEntries(Object.entries(node).map(([k, v]) => [k, resolve(v, lang)]));
  }
  return node;
};

export const getCatalog = (lang) => resolve(catalog, lang === 'en' ? 'en' : 'ar');

export const PROGRAMS_PATH = '/programs';
export const getCatalogGroups = (lang) => getCatalog(lang).groups;
