import type { AccountType } from '../types'

export type ScenarioAccountType = AccountType | 'cost' | 'drawing'

export interface ScenarioTx {
  id: string
  date: string
  story: string
  debit: { account: string; amount: number }
  credit: { account: string; amount: number }
}

export interface Scenario {
  id: string
  title: string
  business: string
  stepsIntro: string[]
  difficulty: 1 | 2 | 3
  accountType: Record<string, ScenarioAccountType>
  txs: ScenarioTx[]
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'supermarket',
    title: 'سوبر ماركت الأمانة',
    business: 'محل سوبر ماركت صغير في الحي — بضاعة يومية، مبيعات نقدًا وآجل، ومصروفات تشغيل ثابتة.',
    stepsIntro: ['رأس المال بيبدأ الصورة', 'الشرا والمبيعات اليومية', 'سداد الموردين وتحصيل العملاء', 'مصروفات الشهر والمسحوبات'],
    difficulty: 1,
    accountType: {
      'النقدية': 'asset',
      'البنك': 'asset',
      'العملاء': 'asset',
      'المشتريات': 'cost',
      'الموردون': 'liability',
      'المبيعات': 'revenue',
      'مصروف الإيجار': 'expense',
      'مصروف المرتبات': 'expense',
      'مصروف الكهرباء': 'expense',
      'رأس المال': 'equity',
      'المسحوبات': 'drawing',
    },
    txs: [
      { id: 's1-1', date: 'يوم 1', story: 'فتح صاحب المحل رأس ماله: 100,000 نقدًا', debit: { account: 'النقدية', amount: 100000 }, credit: { account: 'رأس المال', amount: 100000 } },
      { id: 's1-2', date: 'يوم 1', story: 'اشترى بضاعة نقدًا: 30,000', debit: { account: 'المشتريات', amount: 30000 }, credit: { account: 'النقدية', amount: 30000 } },
      { id: 's1-3', date: 'يوم 1', story: 'اشترى بضاعة بالدين من المورد: 20,000', debit: { account: 'المشتريات', amount: 20000 }, credit: { account: 'الموردون', amount: 20000 } },
      { id: 's1-4', date: 'يوم 2', story: 'باع بضاعة نقدًا: 55,000', debit: { account: 'النقدية', amount: 55000 }, credit: { account: 'المبيعات', amount: 55000 } },
      { id: 's1-5', date: 'يوم 2', story: 'باع بضاعة لعميل بالأجل: 15,000', debit: { account: 'العملاء', amount: 15000 }, credit: { account: 'المبيعات', amount: 15000 } },
      { id: 's1-6', date: 'يوم 2', story: 'دفع إيجار المحل نقدًا: 5,000', debit: { account: 'مصروف الإيجار', amount: 5000 }, credit: { account: 'النقدية', amount: 5000 } },
      { id: 's1-7', date: 'يوم 3', story: 'دفع المرتبات نقدًا: 6,000', debit: { account: 'مصروف المرتبات', amount: 6000 }, credit: { account: 'النقدية', amount: 6000 } },
      { id: 's1-8', date: 'يوم 3', story: 'استلم 10,000 من عميل سدادًا عن الأجل', debit: { account: 'النقدية', amount: 10000 }, credit: { account: 'العملاء', amount: 10000 } },
      { id: 's1-9', date: 'يوم 3', story: 'سدد للمورد 12,000 نقدًا', debit: { account: 'الموردون', amount: 12000 }, credit: { account: 'النقدية', amount: 12000 } },
      { id: 's1-10', date: 'يوم 4', story: 'سحب صاحب المحل 2,000 للاستخدام الشخصي', debit: { account: 'المسحوبات', amount: 2000 }, credit: { account: 'النقدية', amount: 2000 } },
      { id: 's1-11', date: 'يوم 4', story: 'دفع فاتورة الكهرباء 800 نقدًا', debit: { account: 'مصروف الكهرباء', amount: 800 }, credit: { account: 'النقدية', amount: 800 } },
      { id: 's1-12', date: 'يوم 4', story: 'أودع 20,000 من الصندوق في البنك', debit: { account: 'البنك', amount: 20000 }, credit: { account: 'النقدية', amount: 20000 } },
    ],
  },
  {
    id: 'translation-office',
    title: 'مكتب الترجمة والخدمات',
    business: 'مكتب صغير بيقدم خدمات ترجمة وساطة — إيرادات من خدمات وعمولات، ومصروفات تشغيل.',
    stepsIntro: ['رأس المال وتجهيز المكتب', 'إيرادات الخدمات نقدًا وآجل', 'مصاريف التشغيل والتحصيل', 'مسحوبات المالك وتأمين البنك'],
    difficulty: 2,
    accountType: {
      'النقدية': 'asset',
      'البنك': 'asset',
      'العملاء': 'asset',
      'الأجهزة والمعدات': 'asset',
      'إيراد خدمات': 'revenue',
      'إيراد عمولات': 'revenue',
      'مصروف الإيجار': 'expense',
      'مصروف الإعلان': 'expense',
      'مصروف الإنترنت': 'expense',
      'رأس المال': 'equity',
      'المسحوبات': 'drawing',
    },
    txs: [
      { id: 's2-1', date: 'يوم 1', story: 'رأس مال صاحب المكتب: 60,000 نقدًا', debit: { account: 'النقدية', amount: 60000 }, credit: { account: 'رأس المال', amount: 60000 } },
      { id: 's2-2', date: 'يوم 1', story: 'اشترى جهاز كمبيوتر 12,000 بشيك', debit: { account: 'الأجهزة والمعدات', amount: 12000 }, credit: { account: 'البنك', amount: 12000 } },
      { id: 's2-3', date: 'يوم 1', story: 'دفع إيجار المكتب نقدًا: 4,000', debit: { account: 'مصروف الإيجار', amount: 4000 }, credit: { account: 'النقدية', amount: 4000 } },
      { id: 's2-4', date: 'يوم 2', story: 'قبض إيراد ترجمة نقدًا: 18,000', debit: { account: 'النقدية', amount: 18000 }, credit: { account: 'إيراد خدمات', amount: 18000 } },
      { id: 's2-5', date: 'يوم 2', story: 'أنهى ترجمة لعميل بالأجل: 9,000', debit: { account: 'العملاء', amount: 9000 }, credit: { account: 'إيراد خدمات', amount: 9000 } },
      { id: 's2-6', date: 'يوم 2', story: 'دفع مصروف إعلان 2,500 نقدًا', debit: { account: 'مصروف الإعلان', amount: 2500 }, credit: { account: 'النقدية', amount: 2500 } },
      { id: 's2-7', date: 'يوم 3', story: 'استلم 6,000 من عميل سدادًا عن الأجل', debit: { account: 'النقدية', amount: 6000 }, credit: { account: 'العملاء', amount: 6000 } },
      { id: 's2-8', date: 'يوم 3', story: 'دفع فاتورة الإنترنت والاتصالات 900 نقدًا', debit: { account: 'مصروف الإنترنت', amount: 900 }, credit: { account: 'النقدية', amount: 900 } },
      { id: 's2-9', date: 'يوم 3', story: 'قبض عمولة وساطة نقدًا: 3,000', debit: { account: 'النقدية', amount: 3000 }, credit: { account: 'إيراد عمولات', amount: 3000 } },
      { id: 's2-10', date: 'يوم 4', story: 'سحب صاحب المكتب 1,500 للاستخدام الشخصي', debit: { account: 'المسحوبات', amount: 1500 }, credit: { account: 'النقدية', amount: 1500 } },
      { id: 's2-11', date: 'يوم 4', story: 'أودع 20,000 من الصندوق في البنك', debit: { account: 'البنك', amount: 20000 }, credit: { account: 'النقدية', amount: 20000 } },
    ],
  },
  {
    id: 'accounting-office',
    title: 'مكتب المحاسبة والمراجعة',
    business: 'مكتب محاسبة بيراجع وبيعمل ميزانيات للعملاء — ديون أتعاب خدمات مهنية، ومصاريف تشغيل.',
    stepsIntro: ['تأسيس المكتب وتجهيزه', 'أتعاب خدمات العملاء', 'مصاريف الشغل والنقابات', 'التأمينات والمسحوبات'],
    difficulty: 1,
    accountType: {
      'النقدية': 'asset',
      'البنك': 'asset',
      'العملاء': 'asset',
      'الأجهزة والمعدات': 'asset',
      'إيراد خدمات مهنية': 'revenue',
      'مصروف الإيجار': 'expense',
      'مصروف المرتبات': 'expense',
      'تأمينات لدى الغير': 'expense',
      'مصروف الإعلان': 'expense',
      'رأس المال': 'equity',
      'المسحوبات': 'drawing',
    },
    txs: [
      { id: 's3-1', date: 'يوم 1', story: 'رأس مال المكتب: 80,000 نقدًا', debit: { account: 'النقدية', amount: 80000 }, credit: { account: 'رأس المال', amount: 80000 } },
      { id: 's3-2', date: 'يوم 1', story: 'جهّز المكتب بملكية كمبيوتر 18,000 بشيك', debit: { account: 'الأجهزة والمعدات', amount: 18000 }, credit: { account: 'البنك', amount: 18000 } },
      { id: 's3-3', date: 'يوم 1', story: 'دفع إيجار المكتب نقدًا: 5,000', debit: { account: 'مصروف الإيجار', amount: 5000 }, credit: { account: 'النقدية', amount: 5000 } },
      { id: 's3-4', date: 'يوم 2', story: 'أتعاب إعداد ميزانية عميل نقدًا: 25,000', debit: { account: 'النقدية', amount: 25000 }, credit: { account: 'إيراد خدمات مهنية', amount: 25000 } },
      { id: 's3-5', date: 'يوم 2', story: 'أتعاب مراجعة لعميل بالأجل: 15,000', debit: { account: 'العملاء', amount: 15000 }, credit: { account: 'إيراد خدمات مهنية', amount: 15000 } },
      { id: 's3-6', date: 'يوم 2', story: 'دفع المرتبات نقدًا: 8,000', debit: { account: 'مصروف المرتبات', amount: 8000 }, credit: { account: 'النقدية', amount: 8000 } },
      { id: 's3-7', date: 'يوم 3', story: 'سدد تأمينات اشتراك النقابة 2,000 نقدًا', debit: { account: 'تأمينات لدى الغير', amount: 2000 }, credit: { account: 'النقدية', amount: 2000 } },
      { id: 's3-8', date: 'يوم 3', story: 'استلم 10,000 من عميل سدادًا عن الأجل', debit: { account: 'النقدية', amount: 10000 }, credit: { account: 'العملاء', amount: 10000 } },
      { id: 's3-9', date: 'يوم 3', story: 'دفع مصروف إعلان 1,500 نقدًا', debit: { account: 'مصروف الإعلان', amount: 1500 }, credit: { account: 'النقدية', amount: 1500 } },
      { id: 's3-10', date: 'يوم 4', story: 'أودع 20,000 من الصندوق في البنك', debit: { account: 'البنك', amount: 20000 }, credit: { account: 'النقدية', amount: 20000 } },
      { id: 's3-11', date: 'يوم 4', story: 'سحب صاحب المكتب 3,000 للاستخدام الشخصي', debit: { account: 'المسحوبات', amount: 3000 }, credit: { account: 'النقدية', amount: 3000 } },
    ],
  },
  {
    id: 'contracting-company',
    title: 'شركة النيل للمقاولات',
    business: 'شركة مقاولات بتشتغل في تشطيب وتوريد شقق — مواد بناء، معدات، ومشروعات بالآجل.',
    stepsIntro: ['رأس المال وشراء المعدات', 'مواد البناء والمشروعات', 'العمالة والتشغيل', 'التحصيل والمسحوبات'],
    difficulty: 3,
    accountType: {
      'النقدية': 'asset',
      'البنك': 'asset',
      'العملاء': 'asset',
      'الآلات والمعدات': 'asset',
      'المشتريات': 'cost',
      'إيراد مقاولات': 'revenue',
      'مصروف الإيجار': 'expense',
      'مصروف المرتبات': 'expense',
      'مصروف الوقود': 'expense',
      'رأس المال': 'equity',
      'المسحوبات': 'drawing',
    },
    txs: [
      { id: 's4-1', date: 'يوم 1', story: 'رأس مال الشركة: 150,000 نقدًا', debit: { account: 'النقدية', amount: 150000 }, credit: { account: 'رأس المال', amount: 150000 } },
      { id: 's4-2', date: 'يوم 1', story: 'أودع 70,000 من الصندوق في البنك', debit: { account: 'البنك', amount: 70000 }, credit: { account: 'النقدية', amount: 70000 } },
      { id: 's4-3', date: 'يوم 1', story: 'اشترى معدات إنشاء (خلاطات) 60,000 بشيك', debit: { account: 'الآلات والمعدات', amount: 60000 }, credit: { account: 'البنك', amount: 60000 } },
      { id: 's4-4', date: 'يوم 2', story: 'اشترى مواد بناء (أسمنت وحديد) 40,000 نقدًا', debit: { account: 'المشتريات', amount: 40000 }, credit: { account: 'النقدية', amount: 40000 } },
      { id: 's4-5', date: 'يوم 2', story: 'استلم إيراد مقاولة تشطيب نقدًا: 90,000', debit: { account: 'النقدية', amount: 90000 }, credit: { account: 'إيراد مقاولات', amount: 90000 } },
      { id: 's4-6', date: 'يوم 2', story: 'أعمال مقاولة لعميل بالأجل: 50,000', debit: { account: 'العملاء', amount: 50000 }, credit: { account: 'إيراد مقاولات', amount: 50000 } },
      { id: 's4-7', date: 'يوم 3', story: 'دفع إيجار الكراج والموقع 6,000 نقدًا', debit: { account: 'مصروف الإيجار', amount: 6000 }, credit: { account: 'النقدية', amount: 6000 } },
      { id: 's4-8', date: 'يوم 3', story: 'دفع مرتبات العمالة 12,000 نقدًا', debit: { account: 'مصروف المرتبات', amount: 12000 }, credit: { account: 'النقدية', amount: 12000 } },
      { id: 's4-9', date: 'يوم 3', story: 'سدد وقود وسولار للمعدات 4,500 نقدًا', debit: { account: 'مصروف الوقود', amount: 4500 }, credit: { account: 'النقدية', amount: 4500 } },
      { id: 's4-10', date: 'يوم 4', story: 'استلم 25,000 من عميل آجل', debit: { account: 'النقدية', amount: 25000 }, credit: { account: 'العملاء', amount: 25000 } },
      { id: 's4-11', date: 'يوم 4', story: 'سحب صاحب الشركة 5,000 للاستخدام الشخصي', debit: { account: 'المسحوبات', amount: 5000 }, credit: { account: 'النقدية', amount: 5000 } },
    ],
  },
  {
    id: 'logistics-company',
    title: 'شركة النقل السريع',
    business: 'شركة لوجيستيك ناقلة بضائع وعينيات — أسطول سيارات، إيرادات نقل، ومصاريف تشغيل.',
    stepsIntro: ['رأس المال والأسطول', 'إيرادات النقل', 'الوقود والصيانة', 'التحصيل والمسحوبات'],
    difficulty: 2,
    accountType: {
      'النقدية': 'asset',
      'البنك': 'asset',
      'العملاء': 'asset',
      'السيارات': 'asset',
      'إيراد نقل': 'revenue',
      'مصروف الوقود': 'expense',
      'مصروف الإيجار': 'expense',
      'مصروف المرتبات': 'expense',
      'مصروف الصيانة': 'expense',
      'رأس المال': 'equity',
      'المسحوبات': 'drawing',
    },
    txs: [
      { id: 's5-1', date: 'يوم 1', story: 'رأس مال الشركة: 120,000 نقدًا', debit: { account: 'النقدية', amount: 120000 }, credit: { account: 'رأس المال', amount: 120000 } },
      { id: 's5-2', date: 'يوم 1', story: 'أودع 100,000 من الصندوق في البنك', debit: { account: 'البنك', amount: 100000 }, credit: { account: 'النقدية', amount: 100000 } },
      { id: 's5-3', date: 'يوم 1', story: 'اشترى 3 سيارات نقل 90,000 بشيك', debit: { account: 'السيارات', amount: 90000 }, credit: { account: 'البنك', amount: 90000 } },
      { id: 's5-4', date: 'يوم 2', story: 'استلم إيراد نقل نقدًا: 60,000', debit: { account: 'النقدية', amount: 60000 }, credit: { account: 'إيراد نقل', amount: 60000 } },
      { id: 's5-5', date: 'يوم 2', story: 'إيراد نقل لعميل بالأجل: 25,000', debit: { account: 'العملاء', amount: 25000 }, credit: { account: 'إيراد نقل', amount: 25000 } },
      { id: 's5-6', date: 'يوم 2', story: 'دفع وقود للأسطول 9,000 نقدًا', debit: { account: 'مصروف الوقود', amount: 9000 }, credit: { account: 'النقدية', amount: 9000 } },
      { id: 's5-7', date: 'يوم 3', story: 'دفع إيجار المخزن 5,000 نقدًا', debit: { account: 'مصروف الإيجار', amount: 5000 }, credit: { account: 'النقدية', amount: 5000 } },
      { id: 's5-8', date: 'يوم 3', story: 'دفع مرتبات السواقين 14,000 نقدًا', debit: { account: 'مصروف المرتبات', amount: 14000 }, credit: { account: 'النقدية', amount: 14000 } },
      { id: 's5-9', date: 'يوم 3', story: 'دفع صيانة سيارات 3,500 نقدًا', debit: { account: 'مصروف الصيانة', amount: 3500 }, credit: { account: 'النقدية', amount: 3500 } },
      { id: 's5-10', date: 'يوم 4', story: 'استلم 12,000 من عميل آجل', debit: { account: 'النقدية', amount: 12000 }, credit: { account: 'العملاء', amount: 12000 } },
      { id: 's5-11', date: 'يوم 4', story: 'سحب صاحب الشركة 4,000 للاستخدام الشخصي', debit: { account: 'المسحوبات', amount: 4000 }, credit: { account: 'النقدية', amount: 4000 } },
    ],
  },
  {
    id: 'garment-factory',
    title: 'مصنع قطن النيل للملابس',
    business: 'مصنع ملابس — خامات وأقمشة، ماكينات خياطة، وإنتاج ومبيعات للعملاء.',
    stepsIntro: ['رأس المال وخط الانتاج', 'الخامات والمبيعات', 'المصاريف التشغيلية', 'التحصيل والمسحوبات'],
    difficulty: 3,
    accountType: {
      'النقدية': 'asset',
      'البنك': 'asset',
      'العملاء': 'asset',
      'الآلات والمعدات': 'asset',
      'المشتريات': 'cost',
      'إيراد مبيعات': 'revenue',
      'مصروف المرتبات': 'expense',
      'مصروف الكهرباء': 'expense',
      'رأس المال': 'equity',
      'المسحوبات': 'drawing',
    },
    txs: [
      { id: 's6-1', date: 'يوم 1', story: 'رأس مال المصنع: 200,000 نقدًا', debit: { account: 'النقدية', amount: 200000 }, credit: { account: 'رأس المال', amount: 200000 } },
      { id: 's6-2', date: 'يوم 1', story: 'أودع 120,000 من الصندوق في البنك', debit: { account: 'البنك', amount: 120000 }, credit: { account: 'النقدية', amount: 120000 } },
      { id: 's6-3', date: 'يوم 1', story: 'اشترى ماكينات خياطة 80,000 بشيك', debit: { account: 'الآلات والمعدات', amount: 80000 }, credit: { account: 'البنك', amount: 80000 } },
      { id: 's6-4', date: 'يوم 2', story: 'اشترى أقمشة وخامات 45,000 نقدًا', debit: { account: 'المشتريات', amount: 45000 }, credit: { account: 'النقدية', amount: 45000 } },
      { id: 's6-5', date: 'يوم 2', story: 'باع إنتاج المصنع نقدًا: 100,000', debit: { account: 'النقدية', amount: 100000 }, credit: { account: 'إيراد مبيعات', amount: 100000 } },
      { id: 's6-6', date: 'يوم 2', story: 'مبيعات لعميل بالأجل: 40,000', debit: { account: 'العملاء', amount: 40000 }, credit: { account: 'إيراد مبيعات', amount: 40000 } },
      { id: 's6-7', date: 'يوم 3', story: 'دفع مرتبات العمالة 20,000 نقدًا', debit: { account: 'مصروف المرتبات', amount: 20000 }, credit: { account: 'النقدية', amount: 20000 } },
      { id: 's6-8', date: 'يوم 3', story: 'دفع فاتورة كهرباء المصنع 3,000 نقدًا', debit: { account: 'مصروف الكهرباء', amount: 3000 }, credit: { account: 'النقدية', amount: 3000 } },
      { id: 's6-9', date: 'يوم 4', story: 'استلم 15,000 من عميل آجل', debit: { account: 'النقدية', amount: 15000 }, credit: { account: 'العملاء', amount: 15000 } },
      { id: 's6-10', date: 'يوم 4', story: 'سحب صاحب المصنع 6,000 للاستخدام الشخصي', debit: { account: 'المسحوبات', amount: 6000 }, credit: { account: 'النقدية', amount: 6000 } },
    ],
  },
]

export interface LedgerRow {
  account: string
  type: ScenarioAccountType
  debitTotal: number
  creditTotal: number
  net: number
  side: 'debit' | 'credit'
}

const TYPE_ORDER: ScenarioAccountType[] = ['asset', 'cost', 'expense', 'drawing', 'liability', 'equity', 'revenue']

export function computeLedger(s: Scenario): LedgerRow[] {
  const map = new Map<string, LedgerRow>()
  const touch = (account: string) => {
    if (!map.has(account)) {
      map.set(account, { account, type: s.accountType[account] ?? 'asset', debitTotal: 0, creditTotal: 0, net: 0, side: 'debit' })
    }
  }
  for (const tx of s.txs) {
    touch(tx.debit.account)
    touch(tx.credit.account)
    const d = map.get(tx.debit.account)!
    d.debitTotal += tx.debit.amount
    d.net += tx.debit.amount
    const c = map.get(tx.credit.account)!
    c.creditTotal += tx.credit.amount
    c.net -= tx.credit.amount
  }
  const rows = [...map.values()]
  for (const r of rows) r.side = r.net >= 0 ? 'debit' : 'credit'
  return rows.sort(
    (a, b) => TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type) || a.account.localeCompare(b.account, 'ar')
  )
}

export interface PracticeSummary {
  revenues: { account: string; amount: number }[]
  costs: { account: string; amount: number }[]
  expenses: { account: string; amount: number }[]
  totalRevenues: number
  totalCosts: number
  totalExpenses: number
  netProfit: number
  assets: { account: string; amount: number }[]
  liabilities: { account: string; amount: number }[]
  equityItems: { account: string; amount: number }[]
  drawings: number
  totalAssets: number
  totalLiabilities: number
  equity: number
}

function sideAmount(r: LedgerRow): number {
  return Math.abs(r.net)
}

export function computeSummary(s: Scenario): PracticeSummary {
  const ledger = computeLedger(s)
  const byType = (t: ScenarioAccountType) => ledger.filter((r) => r.type === t && r.net !== 0)

  const revenueItems = byType('revenue').map((r) => ({ account: r.account, amount: sideAmount(r) }))
  const costItems = byType('cost').map((r) => ({ account: r.account, amount: sideAmount(r) }))
  const expenseItems = byType('expense').map((r) => ({ account: r.account, amount: sideAmount(r) }))
  const assetItems = byType('asset').filter((r) => r.side === 'debit').map((r) => ({ account: r.account, amount: sideAmount(r) }))
  const liabilityItems = byType('liability').map((r) => ({ account: r.account, amount: sideAmount(r) }))
  const equityItems = byType('equity').map((r) => ({ account: r.account, amount: sideAmount(r) }))
  const drawingItems = byType('drawing')

  const totalRevenues = revenueItems.reduce((s2, r) => s2 + r.amount, 0)
  const totalCosts = costItems.reduce((s2, r) => s2 + r.amount, 0)
  const totalExpenses = expenseItems.reduce((s2, r) => s2 + r.amount, 0)
  const netProfit = totalRevenues - totalCosts - totalExpenses
  const drawings = drawingItems.reduce((s2, r) => s2 + sideAmount(r), 0)
  const equityBase = equityItems.reduce((s2, r) => s2 + r.amount, 0)
  const totalAssets = assetItems.reduce((s2, r) => s2 + r.amount, 0)
  const totalLiabilities = liabilityItems.reduce((s2, r) => s2 + r.amount, 0)
  const equity = equityBase - drawings + netProfit

  return {
    revenues: revenueItems,
    costs: costItems,
    expenses: expenseItems,
    totalRevenues,
    totalCosts,
    totalExpenses,
    netProfit,
    assets: assetItems,
    liabilities: liabilityItems,
    equityItems,
    drawings,
    totalAssets,
    totalLiabilities,
    equity,
  }
}