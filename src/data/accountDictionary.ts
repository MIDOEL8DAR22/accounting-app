import type { AccountMapping } from '../types'

export const ACCOUNT_DICTIONARY: AccountMapping[] = [
  // ================= ASSETS =================
  {
    id: 'cash',
    keywords: ['نقدية', 'نقدًا', 'نقداً', 'فلوس في الصندوق', 'صندوق', 'كاش', 'نقدي', 'عبارة صندوق'],
    account: 'النقدية / الصندوق',
    accountEn: 'Cash',
    type: 'asset',
    examples: ['استلمنا فلوس من العميل → النقدية زادت → مدين'],
    note: 'النقدية أصل طبيعته مدين. لما تزيد → مدين، ولما تنقص → دائن.',
  },
  {
    id: 'bank',
    keywords: ['بنك', 'فلوس في البنك', 'إيداع في البنك', 'حساب جاري', 'دفع من البنك', 'شيك'],
    account: 'البنك',
    accountEn: 'Bank',
    type: 'asset',
    examples: ['أودعنا فلوس في البنك → البنك زاد → مدين'],
  },
  {
    id: 'customers',
    keywords: ['عملاء', 'العميل عليه', 'مستحق من العملاء', 'بعنّا بالآجل', 'مبيعات آجلة', 'المدينون'],
    account: 'العملاء',
    accountEn: 'Customers / Accounts Receivable',
    type: 'asset',
    examples: ['بعنا بضاعة للعميل بالآجل → العملاء زادوا → مدين'],
    note: 'العملاء أصل: العميل عليه فلوس لصالح الشركة.',
  },
  {
    id: 'notes_receivable',
    keywords: ['أوراق قبض', 'سند قبض', 'كمبيالة مستحقة لنا', 'مبلغ مكتوب لنا في سند'],
    account: 'أوراق القبض',
    accountEn: 'Notes Receivable',
    type: 'asset',
    examples: ['استلمنا كمبيالة من عميل → أوراق القبض زادت → مدين'],
  },
  {
    id: 'prepaid',
    keywords: ['مقدم إيجار', 'دفعنا مقدم', 'مصروفات مقدمة', 'دفع مستقبلي', 'إيجار مقدم', 'دفعة مقدمة للمورد'],
    account: 'مصروفات مقدمة',
    accountEn: 'Prepaid Expenses',
    type: 'asset',
    examples: ['دفعنا إيجار عن 6 شهور قدام → مصروفات مقدمة → مدين'],
    note: 'مهم: دفع إيجار عن فترة مستقبلية = أصل (مصروفات مقدمة) مش مصروف دلوقتي.',
  },
  {
    id: 'insurance_given',
    keywords: ['تأمينات لدى الغير', 'دفعنا تأمين', 'تأمين لشخص', 'تأمين لجهة', 'دفعنا تأمين ×'],
    account: 'تأمينات لدى الغير',
    accountEn: 'Insurance Given to Third Party',
    type: 'asset',
    examples: ['دفعنا تأمين لجهة → تأمينات لدى الغير → مدين'],
    note: 'تفرّق: "تأمينات لدى الغير" = أصل، "تأمينات لدى الشركة من الغير" = خصم.',
  },
  {
    id: 'vehicles',
    keywords: ['سيارة للاستخدام', 'سيارات للاستخدام', 'عربية للاستخدام', 'مشترين سيارة'],
    account: 'السيارات',
    accountEn: 'Vehicles',
    type: 'asset',
    examples: ['اشترينا سيارة للاستخدام في الشركة → السيارات → مدين'],
  },
  {
    id: 'equipment',
    keywords: ['آلات', 'معدات', 'ماكينات', 'آلة للاستخدام', 'خط إنتاج'],
    account: 'الآلات والمعدات',
    accountEn: 'Equipment & Machinery',
    type: 'asset',
    examples: ['اشترينا آلة للاستخدام → الآلات والمعدات → مدين'],
  },
  {
    id: 'buildings',
    keywords: ['مبنى للاستخدام', 'مباني', 'عمارة للاستخدام', 'مخزن للاستخدام'],
    account: 'المباني',
    accountEn: 'Buildings',
    type: 'asset',
    examples: ['اشترينا مبنى للاستخدام → المباني → مدين'],
  },
  {
    id: 'land',
    keywords: ['أرض', 'قطعة أرض', 'شراء أرض'],
    account: 'الأراضي',
    accountEn: 'Land',
    type: 'asset',
    examples: ['اشترينا أرض → الأراضي → مدين'],
  },
  {
    id: 'computers',
    keywords: ['أجهزة كمبيوتر', 'كمبيوتر', 'لابتوب للاستخدام', 'اجهزة للاستخدام'],
    account: 'أجهزة الكمبيوتر',
    accountEn: 'Computers',
    type: 'asset',
    examples: ['اشترينا كمبيوترات للاستخدام → أجهزة الكمبيوتر → مدين'],
  },
  {
    id: 'inventory',
    keywords: ['مخزون', 'لدينا مخزون', 'بضاعة متبقية', 'بضاعة بالمخزن'],
    account: 'المخزون / المشتريات حسب المعالجة',
    accountEn: 'Inventory / Purchases',
    type: 'asset',
    examples: ['عندنا مخزون بضاعة → المخزون → مدين'],
  },
  // ================= EXPENSES =================
  {
    id: 'rent',
    keywords: ['إيجار', 'دفعنا إيجار', 'تحملنا إيجار', 'إيجار المنشأة'],
    account: 'مصروف الإيجار',
    accountEn: 'Rent Expense',
    type: 'expense',
    examples: ['دفعنا إيجار 5,000 → مصروف الإيجار → مدين'],
    note: 'الحالة دي (فوري) = مصروف. الحالة اللي عن فترة قادمة = مصروفات مقدمة.',
  },
  {
    id: 'salaries',
    keywords: ['مرتبات', 'أجور', 'رواتب', 'دفعنا مرتبات', 'تحملنا مرتبات', 'مكافآت'],
    account: 'مصروف المرتبات',
    accountEn: 'Salaries Expense',
    type: 'expense',
    examples: ['دفعنا مرتبات الشهر → مصروف المرتبات → مدين'],
  },
  {
    id: 'electricity',
    keywords: ['كهرباء', 'فاتورة كهرباء', 'دفعنا كهرباء'],
    account: 'مصروف الكهرباء',
    accountEn: 'Electricity Expense',
    type: 'expense',
    examples: ['دفعنا فاتورة الكهرباء → مصروف الكهرباء → مدين'],
  },
  {
    id: 'water',
    keywords: ['مياه', 'فاتورة مياه', 'دفعنا مياه'],
    account: 'مصروف المياه',
    accountEn: 'Water Expense',
    type: 'expense',
    examples: ['دفعنا فاتورة المياه → مصروف المياه → مدين'],
  },
  {
    id: 'advertising',
    keywords: ['إعلان', 'إعلانات', 'دفعنا إعلان', 'حملة إعلانية'],
    account: 'مصروف الإعلان',
    accountEn: 'Advertising Expense',
    type: 'expense',
    examples: ['دفعنا مصروف إعلان → مصروف الإعلان → مدين'],
  },
  {
    id: 'transport',
    keywords: ['نقل', 'شحن', 'تكاليف نقل', 'دفعنا نقل', 'سولار', 'بنزين'],
    account: 'مصروف النقل',
    accountEn: 'Transport Expense',
    type: 'expense',
    examples: ['دفعنا مصروف نقل البضاعة → مصروف النقل → مدين'],
  },
  {
    id: 'commissions_expense',
    keywords: ['عمولة بيع', 'مصروف عمولات', 'عمولة للمندوب', 'عمولات بيع'],
    account: 'مصروف العمولات',
    accountEn: 'Commissions Expense',
    type: 'expense',
    examples: ['دفعنا عمولة للمندوب → مصروف العمولات → مدين'],
  },
  {
    id: 'office_supplies',
    keywords: ['أدوات مكتبية', 'قرطاسية', 'مشترين قرطاسية', 'ورق وأقلام'],
    account: 'مصروف الأدوات المكتبية',
    accountEn: 'Office Supplies Expense',
    type: 'expense',
    examples: ['اشترينا أدوات مكتبية للاستخدام → مصروف أدوات مكتبية → مدين'],
  },
  {
    id: 'activity_cost',
    keywords: ['تكلفة النشاط', 'تكلفة الإيراد', 'تكلفة الحصول على الإيراد', 'تكلفة مباعة'],
    account: 'تكلفة النشاط / تكلفة البضاعة المباعة',
    accountEn: 'Cost of Activity / COGS',
    type: 'expense',
    examples: ['تحملنا تكلفة للحصول على الإيراد → تكلفة النشاط → مدين'],
  },
  // ================= LIABILITIES =================
  {
    id: 'vendors',
    keywords: ['مورد', 'موردين', 'الموردون', 'علينا فلوس للمورد', 'بضاعة بالأجل', 'شراء آجل من مورد'],
    account: 'الموردون',
    accountEn: 'Suppliers / Accounts Payable',
    type: 'liability',
    examples: ['اشترينا بضاعة من المورد بالآجل → الموردون زادوا → دائن'],
    note: 'المورد = الشركة مدينة ليه. لما نسدد → الموردون ينقصوا → مدين.',
  },
  {
    id: 'creditors',
    keywords: ['دائنون', 'علينا مبلغ لشخص', 'علينا مبلغ لجهة', 'اشترينا أصل بالأجل من غير مورد بضاعة'],
    account: 'الدائنون',
    accountEn: 'Creditors',
    type: 'liability',
    examples: ['علينا مبلغ لجهة → الدائنون → دائن'],
  },
  {
    id: 'loans',
    keywords: ['قرض', 'قروض', 'أخذنا قرض', 'اقتراض من البنك', 'قرض من جهة'],
    account: 'القروض',
    accountEn: 'Loans',
    type: 'liability',
    examples: ['أخذنا قرض من البنك → القروض زادت → دائن'],
  },
  {
    id: 'notes_payable',
    keywords: ['أوراق دفع', 'سند دفع', 'كمبيالة علينا', 'أصدرنا ورقة دفع'],
    account: 'أوراق الدفع',
    accountEn: 'Notes Payable',
    type: 'liability',
    examples: ['أصدرنا كمبيالة لمورد → أوراق الدفع → دائن'],
  },
  {
    id: 'accrued_expenses',
    keywords: ['مصروفات مستحقة', 'استحق مصروف ولم ندفعه', 'إيجار مستحق', 'كهرباء مستحقة'],
    account: 'المصروفات المستحقة',
    accountEn: 'Accrued Expenses',
    type: 'liability',
    examples: ['استحق علينا إيجار ولم ندفعه → مصروفات مستحقة → دائن'],
  },
  {
    id: 'accrued_salaries',
    keywords: ['مرتبات مستحقة', 'مرتبات لم تدفع', 'استحق مرتب ولم ندفعه'],
    account: 'مرتبات مستحقة',
    accountEn: 'Accrued Salaries',
    type: 'liability',
    examples: ['استحق مرتب الموظفين ولم ندفعه → مرتبات مستحقة → دائن'],
  },
  {
    id: 'customer_advances',
    keywords: ['مقدم من العميل', 'دفعات مقدمة من العملاء', 'استلمنا مقدم', 'عربون', 'السلفة من العميل', 'دفعة مقدمة من عميل'],
    account: 'دفعات مقدمة من العملاء',
    accountEn: 'Customer Advances',
    type: 'liability',
    examples: ['العميل دفع مقدم 10,000 → دفعات مقدمة من العملاء → دائن'],
    note: 'مهم: "مقدم من العميل" = خصم (دفعات مقدمة). مش إيراد، لأن الخدمة لسه ما اتقدمتش.',
  },
  {
    id: 'insurance_held',
    keywords: ['تأمينات لدى الشركة من الغير', 'استلمنا تأمين', 'تأمين من الغير', 'تأمينات مستلمة'],
    account: 'تأمينات لدى الشركة من الغير',
    accountEn: 'Insurance Held from Third Party',
    type: 'liability',
    examples: ['استلمنا تأمين من الغير → تأمينات لدى الشركة → دائن'],
    note: 'تفرّق: دفعنا تأمين (أصل) ↔ استلمنا تأمين من الغير (خصم).',
  },
  // ================= EQUITY =================
  {
    id: 'capital',
    keywords: ['رأس المال', 'وضع مال في الشركة', 'زيادة رأس المال', 'استثمار المالك', 'ريادة من المالك', 'أودع صاحب المنشأة'],
    account: 'رأس المال',
    accountEn: 'Capital',
    type: 'equity',
    examples: ['أودع صاحب المنشأة 200,000 → رأس المال → دائن'],
  },
  {
    id: 'withdrawals',
    keywords: ['مسحوبات', 'سحب المالك', 'سحب صاحب المنشأة', 'سحب فلوس من الشركة', 'مسحوبات شخصية'],
    account: 'المسحوبات',
    accountEn: 'Drawings / Withdrawals',
    type: 'equity',
    examples: ['سحب صاحب المنشأة فلوس → المسحوبات → مدين'],
    note: 'المسحوبات بتنقص حقوق الملكية، فطبيعتها مدين (عكس رأس المال).',
  },
  {
    id: 'retained',
    keywords: ['أرباح محتجزة', 'أرباح لم توزع', 'أرباح مستبقاة'],
    account: 'الأرباح المحتجزة',
    accountEn: 'Retained Earnings',
    type: 'equity',
    examples: ['أرباح لم توزع → أرباح محتجزة → دائن'],
  },
  {
    id: 'reserves',
    keywords: ['احتياطي', 'احتياطيات', 'تكوين احتياطي'],
    account: 'الاحتياطيات',
    accountEn: 'Reserves',
    type: 'equity',
    examples: ['كوننا احتياطي قانوني → الاحتياطيات → دائن'],
  },
  {
    id: 'net_profit',
    keywords: ['صافي الربح', 'صافي ربح', 'أرباح السنة'],
    account: 'صافي الربح',
    accountEn: 'Net Profit',
    type: 'equity',
    examples: ['صافي الربح لآخر السنة → حقوق ملكية → دائن'],
  },
  {
    id: 'partners',
    keywords: ['حسابات الشركاء', 'حساب الشريك', 'استثمار شريك'],
    account: 'حسابات الشركاء',
    accountEn: 'Partners Accounts',
    type: 'equity',
    examples: ['الشريك أضاف فلوس → حساب الشريك → دائن'],
  },
  // ================= REVENUES =================
  {
    id: 'sales',
    keywords: ['مبيعات', 'بعنا بضاعة', 'باعوا بضاعة', 'حققنا مبيعات', 'بيع بضاعة'],
    account: 'المبيعات',
    accountEn: 'Sales Revenue',
    type: 'revenue',
    examples: ['بعنا بضاعة نقدًا → المبيعات → دائن'],
  },
  {
    id: 'service_revenue',
    keywords: ['إيراد خدمات', 'قدمنا خدمة', 'إيراد خدمة', 'أتعاب', 'خدمات مهنية'],
    account: 'إيراد خدمات',
    accountEn: 'Service Revenue',
    type: 'revenue',
    examples: ['قدمنا خدمة استشارية → إيراد خدمات → دائن'],
  },
  {
    id: 'commission_revenue',
    keywords: ['إيراد عمولات', 'حصلنا عمولة', 'عمولة مستحقة لنا', 'عمولة وساطة'],
    account: 'إيراد العمولات',
    accountEn: 'Commissions Revenue',
    type: 'revenue',
    examples: ['حصلنا عمولة وسيط → إيراد عمولات → دائن'],
  },
  {
    id: 'rent_revenue',
    keywords: ['إيراد إيجار', 'حققنا إيراد إيجار', 'أجرنا عقار', 'إيراد تأجير'],
    account: 'إيراد الإيجار',
    accountEn: 'Rent Revenue',
    type: 'revenue',
    examples: ['أجرنا مبنى → إيراد إيجار → دائن'],
  },
  {
    id: 'interest_revenue',
    keywords: ['إيراد فوائد', 'دخل فوائد', 'استحق لنا فوائد', 'فوائد بنك'],
    account: 'إيراد الفوائد',
    accountEn: 'Interest Revenue',
    type: 'revenue',
    examples: ['استحقت لنا فوائد → إيراد فوائد → دائن'],
  },
  {
    id: 'discount_earned',
    keywords: ['خصم مكتسب', 'حصلنا خصم', 'خصم تعجيل السداد', 'خصم نقدي من المورد'],
    account: 'خصم مكتسب',
    accountEn: 'Discount Earned',
    type: 'revenue',
    examples: ['سددنا للمورد قبل الميعاد وحصلنا خصم → خصم مكتسب → دائن'],
  },
  {
    id: 'other_revenue',
    keywords: ['إيرادات أخرى', 'إيراد آخر', 'حققنا إيراد'],
    account: 'الإيراد المناسب',
    accountEn: 'Other Revenue',
    type: 'revenue',
    examples: ['حققنا إيراد آخر → الإيراد المناسب → دائن'],
  },
]

export const ACCOUNT_CATALOG = ACCOUNT_DICTIONARY.map((d) => ({
  id: d.id,
  nameAr: d.account,
  nameEn: d.accountEn,
  type: d.type,
  keywords: d.keywords,
}))

export function searchDictionary(query: string): AccountMapping[] {
  const q = query.trim()
  if (!q) return []
  const terms = q.split(/\s+/).filter(Boolean)
  const results = ACCOUNT_DICTIONARY.filter((d) => {
    const haystack = [
      d.account,
      d.accountEn,
      ...d.keywords,
      ...d.examples,
      ...(d.note ? [d.note] : []),
    ]
      .join(' ')
      .toLowerCase()
    return terms.every((t) => haystack.includes(t.toLowerCase()))
  })
  if (results.length > 0) return results
  // fallback: partial token match on any single keyword
  return ACCOUNT_DICTIONARY.filter((d) =>
    [...d.keywords, d.account, d.accountEn].some((k) =>
      k.toLowerCase().includes(q.toLowerCase())
    )
  )
}

export function findByKeyword(input: string): AccountMapping[] {
  const terms = input.split(/\s+/).filter(Boolean)
  return ACCOUNT_DICTIONARY.filter((d) => {
    const combined = [...d.keywords, d.account, d.accountEn].join(' ')
    return terms.some((t) => combined.includes(t))
  })
}

export const SEARCH_HINTS = [
  'المورد',
  'عميل',
  'قرض',
  'إيجار',
  'مقدم',
  'تأمين',
  'سيارة',
  'بنك',
  'مرتبات',
  'مبيعات',
  'كهرباء',
  'رأس المال',
  'سحب المالك',
]