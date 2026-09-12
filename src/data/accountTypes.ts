import type { AccountType, Side } from '../types'

export const ACCOUNT_TYPES: {
  type: AccountType
  nameAr: string
  nameEn: string
  definition: string
  normalSide: Side
  increaseSide: Side
  decreaseSide: Side
  examples: string[]
  phoneRule: string
  color: string
}[] = [
  {
    type: 'asset',
    nameAr: 'الأصول',
    nameEn: 'Assets',
    definition: 'كل حاجة الشركة تمتلكها أو ليها حق تستلمه.',
    normalSide: 'debit',
    increaseSide: 'debit',
    decreaseSide: 'credit',
    examples: [
      'النقدية',
      'الصندوق',
      'البنك',
      'المخزون / المشتريات حسب المعالجة',
      'العملاء',
      'أوراق القبض',
      'مصروفات مقدمة',
      'تأمينات لدى الغير',
      'السيارات',
      'الآلات والمعدات',
      'المباني',
      'الأراضي',
      'أجهزة الكمبيوتر',
    ],
    phoneRule: 'لو الأصل زاد → مدين / لو الأصل نقص → دائن',
    color: 'blue',
  },
  {
    type: 'expense',
    nameAr: 'المصروفات',
    nameEn: 'Expenses',
    definition: 'المصاريف اللي الشركة بتتحملها عشان تشغّل نشاطها.',
    normalSide: 'debit',
    increaseSide: 'debit',
    decreaseSide: 'credit',
    examples: [
      'مصروف الإيجار',
      'مصروف المرتبات',
      'مصروف الكهرباء',
      'مصروف المياه',
      'مصروف الإعلان',
      'مصروف النقل',
      'مصروف العمولات',
      'أدوات مكتبية',
      'تكلفة النشاط',
    ],
    phoneRule: 'لو المصروف زاد → مدين / لو المصروف نقص → دائن',
    color: 'rose',
  },
  {
    type: 'liability',
    nameAr: 'الخصوم',
    nameEn: 'Liabilities',
    definition: 'ديون على الشركة ليه ليها (أي التزامات عليها).',
    normalSide: 'credit',
    increaseSide: 'credit',
    decreaseSide: 'debit',
    examples: [
      'الموردون',
      'الدائنون',
      'القروض',
      'أوراق الدفع',
      'مصروفات مستحقة',
      'مرتبات مستحقة',
      'دفعات مقدمة من العملاء',
      'تأمينات لدى الشركة من الغير',
    ],
    phoneRule: 'لو الخصم زاد → دائن / لو الخصم نقص → مدين',
    color: 'green',
  },
  {
    type: 'equity',
    nameAr: 'حقوق الملكية',
    nameEn: 'Equity',
    definition: 'حق المالك في أصول الشركة (رأس المال والأرباح المحتجزة).',
    normalSide: 'credit',
    increaseSide: 'credit',
    decreaseSide: 'debit',
    examples: [
      'رأس المال',
      'الاحتياطيات',
      'الأرباح المحتجزة',
      'صافي الربح',
      'حسابات الشركاء',
      'المسحوبات (طبيعتها مدين)',
    ],
    phoneRule: 'لو حقوق الملكية زادت → دائن / لو نقصت → مدين',
    color: 'purple',
  },
  {
    type: 'revenue',
    nameAr: 'الإيرادات',
    nameEn: 'Revenues',
    definition: 'الدخل اللي الشركة بتحققه من بيع منتجاتها أو خدماتها.',
    normalSide: 'credit',
    increaseSide: 'credit',
    decreaseSide: 'debit',
    examples: [
      'المبيعات',
      'إيراد خدمات',
      'إيراد عمولات',
      'إيراد إيجار',
      'إيراد فوائد',
      'إيرادات أخرى',
      'خصم مكتسب',
    ],
    phoneRule: 'لو الإيراد زاد → دائن / لو نقص → مدين',
    color: 'amber',
  },
]

export const getAccountType = (type: AccountType) =>
  ACCOUNT_TYPES.find((t) => t.type === type)!

export const TYPE_LABELS: Record<AccountType, string> = {
  asset: 'أصل',
  expense: 'مصروف',
  liability: 'خصم',
  equity: 'حقوق ملكية',
  revenue: 'إيراد',
}

export const TYPE_LABELS_EN: Record<AccountType, string> = {
  asset: 'Asset',
  expense: 'Expense',
  liability: 'Liability',
  equity: 'Equity',
  revenue: 'Revenue',
}

export const SIDE_LABELS: Record<Side, string> = {
  debit: 'مدين',
  credit: 'دائن',
}

export const CHANGE_LABELS = {
  increase: 'زاد',
  decrease: 'نقص',
}

export const TYPE_COLOR: Record<AccountType, string> = {
  asset: 'text-blue-700 dark:text-blue-400',
  expense: 'text-rose-700 dark:text-rose-400',
  liability: 'text-emerald-700 dark:text-emerald-400',
  equity: 'text-purple-700 dark:text-purple-400',
  revenue: 'text-amber-700 dark:text-amber-500',
}

export const TYPE_BG: Record<AccountType, string> = {
  asset: 'bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/30',
  expense: 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/30',
  liability: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30',
  equity: 'bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/30',
  revenue: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/30',
}

/** Golden rule: accounts whose natural side is debit */
export const DEBIT_GROUP = ['asset', 'expense'] as AccountType[]
/** Golden rule: accounts whose natural side is credit */
export const CREDIT_GROUP = ['liability', 'equity', 'revenue'] as AccountType[]

export const GOLDEN_TABLE = {
  debitGroup: 'الأصول + المصروفات = طبيعتها مدينة',
  creditGroup: 'الخصوم + حقوق الملكية + الإيرادات = طبيعتها دائنة',
}