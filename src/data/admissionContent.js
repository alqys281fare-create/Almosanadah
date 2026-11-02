/*
 * Default content of the "قواعد القبول" (Admission Rules) page.
 * Kept in its own file so it does not touch defaultContent.js. The page reads
 *   { ...admissionDefaults[lang], ...content.admission }
 * and the dashboard section «قواعد القبول» saves into content.admission.
 * The rules below are SAMPLE text — replace them with your institute's real admission rules.
 */
export const admissionDefaults = {
  ar: {
    title: 'قواعد القبول',
    subtitle: 'تعرّف على شروط القبول والمستندات المطلوبة وخطوات التسجيل في برامج المعهد.',
    banner: '',

    introTitle: 'ابدأ رحلتك مع المسانِدة',
    intro:
      'نرحب بجميع الراغبين في الالتحاق ببرامجنا التدريبية. تجد في هذه الصفحة كل ما تحتاج معرفته قبل التقديم: شروط القبول العامة، والمستندات المطلوبة، وخطوات التسجيل من أول طلب حتى بدء الدراسة.',

    stepsTitle: 'خطوات التسجيل',
    steps: [
      { id: 1, icon: 'book', title: 'اختر البرنامج', text: 'تصفّح البرامج التدريبية واختر البرنامج المناسب لهدفك المهني.' },
      { id: 2, icon: 'edit', title: 'قدّم طلبك', text: 'عبّئ بيانات الطلب أو تواصل مع أقرب فرع لمساعدتك في التسجيل.' },
      { id: 3, icon: 'cert', title: 'أرفق المستندات', text: 'سلّم المستندات المطلوبة للبرنامج كاملة وواضحة.' },
      { id: 4, icon: 'check', title: 'مراجعة الطلب', text: 'يراجع فريق القبول طلبك ويُبلغك بالنتيجة عبر قنوات التواصل.' },
      { id: 5, icon: 'grad', title: 'ابدأ الدراسة', text: 'أكمل إجراءات التسجيل واحصل على جدولك لتبدأ رحلتك التدريبية.' },
    ],

    conditionsTitle: 'شروط القبول العامة',
    conditions: [
      { id: 1, text: 'أن يكون المتقدم حاصلًا على المؤهل الدراسي المطلوب للبرنامج.' },
      { id: 2, text: 'أن يستوفي الحد الأدنى للعمر وفق متطلبات البرنامج المختار.' },
      { id: 3, text: 'تعبئة طلب الالتحاق بشكل كامل وصحيح.' },
      { id: 4, text: 'تقديم المستندات المطلوبة ضمن المدة المحددة.' },
      { id: 5, text: 'اجتياز المقابلة أو الاختبار التحديدي إن كان البرنامج يتطلب ذلك.' },
    ],

    documentsTitle: 'المستندات المطلوبة',
    documents: [
      { id: 1, icon: 'user', title: 'الهوية الوطنية / الإقامة', text: 'نسخة سارية المفعول.' },
      { id: 2, icon: 'cert', title: 'شهادة المؤهل الدراسي', text: 'نسخة من آخر مؤهل مع السجل الأكاديمي.' },
      { id: 3, icon: 'image', title: 'صورة شخصية', text: 'حديثة بخلفية بيضاء.' },
      { id: 4, icon: 'phone', title: 'بيانات التواصل', text: 'رقم جوال وبريد إلكتروني فعّالان.' },
    ],

    notesTitle: 'ملاحظات مهمة',
    notes: [
      { id: 1, text: 'قد تختلف بعض الشروط والمستندات من برنامج إلى آخر، يرجى مراجعة تفاصيل البرنامج قبل التقديم.' },
      { id: 2, text: 'الطلبات غير المكتملة قد تتأخر في المعالجة إلى حين استكمال المستندات.' },
    ],

    ctaTitle: 'هل لديك استفسار عن القبول؟',
    ctaText: 'فريق القبول والتسجيل جاهز للإجابة عن أسئلتك ومساعدتك في كل خطوة.',
    ctaButton: 'تواصل معنا',
    ctaHref: '/#contact',
    ctaSecondary: 'تصفح البرامج',
    ctaSecondaryHref: '/courses',
  },

  en: {
    title: 'Admission Rules',
    subtitle: 'Learn about the admission requirements, the documents you need and the registration steps for the institute programs.',
    banner: '',

    introTitle: 'Start your journey with Al-Musanadah',
    intro:
      'We welcome everyone who wants to join our training programs. This page gives you everything you need before applying: the general admission requirements, the required documents, and the registration steps from your first request until you start studying.',

    stepsTitle: 'Registration steps',
    steps: [
      { id: 1, icon: 'book', title: 'Choose a program', text: 'Browse the training programs and pick the one that fits your career goal.' },
      { id: 2, icon: 'edit', title: 'Submit your request', text: 'Fill in the application or contact the nearest branch to help you register.' },
      { id: 3, icon: 'cert', title: 'Attach the documents', text: 'Hand in the documents required for the program, complete and clear.' },
      { id: 4, icon: 'check', title: 'Application review', text: 'The admissions team reviews your request and notifies you of the result.' },
      { id: 5, icon: 'grad', title: 'Start studying', text: 'Complete the registration procedures and get your schedule to begin training.' },
    ],

    conditionsTitle: 'General admission requirements',
    conditions: [
      { id: 1, text: 'The applicant holds the educational qualification required for the program.' },
      { id: 2, text: 'The applicant meets the minimum age required by the chosen program.' },
      { id: 3, text: 'The application form is filled in completely and correctly.' },
      { id: 4, text: 'The required documents are submitted within the given period.' },
      { id: 5, text: 'Passing the interview or placement test, if the program requires one.' },
    ],

    documentsTitle: 'Required documents',
    documents: [
      { id: 1, icon: 'user', title: 'National ID / Residence permit', text: 'A valid copy.' },
      { id: 2, icon: 'cert', title: 'Educational certificate', text: 'A copy of the latest qualification with the transcript.' },
      { id: 3, icon: 'image', title: 'Personal photo', text: 'Recent, with a white background.' },
      { id: 4, icon: 'phone', title: 'Contact details', text: 'An active mobile number and email address.' },
    ],

    notesTitle: 'Important notes',
    notes: [
      { id: 1, text: 'Some requirements and documents may differ from one program to another; please check the program details before applying.' },
      { id: 2, text: 'Incomplete applications may be delayed until the documents are completed.' },
    ],

    ctaTitle: 'Have a question about admission?',
    ctaText: 'Our admissions and registration team is ready to answer your questions and help you at every step.',
    ctaButton: 'Contact us',
    ctaHref: '/#contact',
    ctaSecondary: 'Browse programs',
    ctaSecondaryHref: '/courses',
  },
};

/* merge saved dashboard content over the defaults of the current language */
export const getAdmission = (lang, saved) => ({ ...(admissionDefaults[lang] || admissionDefaults.ar), ...(saved || {}) });
