import type {
  AccountInfo,
  AccountType,
  Change,
  JournalLine,
  Side,
  StepResult,
} from '../types'
import { getAccountType, TYPE_LABELS, TYPE_LABELS_EN } from '../data/accountTypes'

export function classify(type: AccountType, change: Change): Side {
  const info = getAccountType(type)
  return change === 'increase' ? info.increaseSide : info.decreaseSide
}

/** Turns "الموردون" into an account definition using the dictionary */
export function resolveAccount(name: string): AccountInfo | null {
  const map: Record<string, AccountInfo> = {
    'النقدية': { id: 'cash', nameAr: 'النقدية', nameEn: 'Cash', type: 'asset', increaseSide: 'debit', decreaseSide: 'credit' },
    'الصندوق': { id: 'cash', nameAr: 'النقدية', nameEn: 'Cash', type: 'asset', increaseSide: 'debit', decreaseSide: 'credit' },
    'البنك': { id: 'bank', nameAr: 'البنك', nameEn: 'Bank', type: 'asset', increaseSide: 'debit', decreaseSide: 'credit' },
    'العملاء': { id: 'customers', nameAr: 'العملاء', nameEn: 'Customers', type: 'asset', increaseSide: 'debit', decreaseSide: 'credit' },
    'أوراق القبض': { id: 'notes_receivable', nameAr: 'أوراق القبض', nameEn: 'Notes Receivable', type: 'asset', increaseSide: 'debit', decreaseSide: 'credit' },
    'مصروفات مقدمة': { id: 'prepaid', nameAr: 'مصروفات مقدمة', nameEn: 'Prepaid Expenses', type: 'asset', increaseSide: 'debit', decreaseSide: 'credit' },
    'تأمينات لدى الغير': { id: 'insurance_given', nameAr: 'تأمينات لدى الغير', nameEn: 'Insurance Given', type: 'asset', increaseSide: 'debit', decreaseSide: 'credit' },
    'السيارات': { id: 'vehicles', nameAr: 'السيارات', nameEn: 'Vehicles', type: 'asset', increaseSide: 'debit', decreaseSide: 'credit' },
    'الآلات والمعدات': { id: 'equipment', nameAr: 'الآلات والمعدات', nameEn: 'Equipment', type: 'asset', increaseSide: 'debit', decreaseSide: 'credit' },
    'المباني': { id: 'buildings', nameAr: 'المباني', nameEn: 'Buildings', type: 'asset', increaseSide: 'debit', decreaseSide: 'credit' },
    'الأراضي': { id: 'land', nameAr: 'الأراضي', nameEn: 'Land', type: 'asset', increaseSide: 'debit', decreaseSide: 'credit' },
    'أجهزة الكمبيوتر': { id: 'computers', nameAr: 'أجهزة الكمبيوتر', nameEn: 'Computers', type: 'asset', increaseSide: 'debit', decreaseSide: 'credit' },
    'المخزون': { id: 'inventory', nameAr: 'المخزون', nameEn: 'Inventory', type: 'asset', increaseSide: 'debit', decreaseSide: 'credit' },
    'المشتريات': { id: 'purchases', nameAr: 'المشتريات', nameEn: 'Purchases', type: 'expense', increaseSide: 'debit', decreaseSide: 'credit' },
    'مصروف الإيجار': { id: 'rent', nameAr: 'مصروف الإيجار', nameEn: 'Rent Expense', type: 'expense', increaseSide: 'debit', decreaseSide: 'credit' },
    'مصروف المرتبات': { id: 'salaries', nameAr: 'مصروف المرتبات', nameEn: 'Salaries Expense', type: 'expense', increaseSide: 'debit', decreaseSide: 'credit' },
    'مصروف الكهرباء': { id: 'electricity', nameAr: 'مصروف الكهرباء', nameEn: 'Electricity Expense', type: 'expense', increaseSide: 'debit', decreaseSide: 'credit' },
    'مصروف المياه': { id: 'water', nameAr: 'مصروف المياه', nameEn: 'Water Expense', type: 'expense', increaseSide: 'debit', decreaseSide: 'credit' },
    'مصروف الإعلان': { id: 'advertising', nameAr: 'مصروف الإعلان', nameEn: 'Advertising Expense', type: 'expense', increaseSide: 'debit', decreaseSide: 'credit' },
    'مصروف النقل': { id: 'transport', nameAr: 'مصروف النقل', nameEn: 'Transport Expense', type: 'expense', increaseSide: 'debit', decreaseSide: 'credit' },
    'مصروف العمولات': { id: 'commissions_expense', nameAr: 'مصروف العمولات', nameEn: 'Commissions Expense', type: 'expense', increaseSide: 'debit', decreaseSide: 'credit' },
    'مصروف الأدوات المكتبية': { id: 'office_supplies', nameAr: 'مصروف الأدوات المكتبية', nameEn: 'Office Supplies', type: 'expense', increaseSide: 'debit', decreaseSide: 'credit' },
    'تكلفة النشاط': { id: 'activity_cost', nameAr: 'تكلفة النشاط', nameEn: 'Activity Cost', type: 'expense', increaseSide: 'debit', decreaseSide: 'credit' },
    'الموردون': { id: 'vendors', nameAr: 'الموردون', nameEn: 'Suppliers', type: 'liability', increaseSide: 'credit', decreaseSide: 'debit' },
    'الموردين': { id: 'vendors', nameAr: 'الموردون', nameEn: 'Suppliers', type: 'liability', increaseSide: 'credit', decreaseSide: 'debit' },
    'الدائنون': { id: 'creditors', nameAr: 'الدائنون', nameEn: 'Creditors', type: 'liability', increaseSide: 'credit', decreaseSide: 'debit' },
    'القروض': { id: 'loans', nameAr: 'القروض', nameEn: 'Loans', type: 'liability', increaseSide: 'credit', decreaseSide: 'debit' },
    'أوراق الدفع': { id: 'notes_payable', nameAr: 'أوراق الدفع', nameEn: 'Notes Payable', type: 'liability', increaseSide: 'credit', decreaseSide: 'debit' },
    'المصروفات المستحقة': { id: 'accrued_expenses', nameAr: 'المصروفات المستحقة', nameEn: 'Accrued Expenses', type: 'liability', increaseSide: 'credit', decreaseSide: 'debit' },
    'مرتبات مستحقة': { id: 'accrued_salaries', nameAr: 'مرتبات مستحقة', nameEn: 'Accrued Salaries', type: 'liability', increaseSide: 'credit', decreaseSide: 'debit' },
    'دفعات مقدمة من العملاء': { id: 'customer_advances', nameAr: 'دفعات مقدمة من العملاء', nameEn: 'Customer Advances', type: 'liability', increaseSide: 'credit', decreaseSide: 'debit' },
    'تأمينات لدى الشركة': { id: 'insurance_held', nameAr: 'تأمينات لدى الشركة', nameEn: 'Insurance Held', type: 'liability', increaseSide: 'credit', decreaseSide: 'debit' },
    'تأمينات الغير': { id: 'insurance_held', nameAr: 'تأمينات لدى الشركة', nameEn: 'Insurance Held', type: 'liability', increaseSide: 'credit', decreaseSide: 'debit' },
    'رأس المال': { id: 'capital', nameAr: 'رأس المال', nameEn: 'Capital', type: 'equity', increaseSide: 'credit', decreaseSide: 'debit' },
    'رأس مال': { id: 'capital', nameAr: 'رأس المال', nameEn: 'Capital', type: 'equity', increaseSide: 'credit', decreaseSide: 'debit' },
    'المسحوبات': { id: 'withdrawals', nameAr: 'المسحوبات', nameEn: 'Drawings', type: 'equity', increaseSide: 'debit', decreaseSide: 'credit' },
    'مسحوبات': { id: 'withdrawals', nameAr: 'المسحوبات', nameEn: 'Drawings', type: 'equity', increaseSide: 'debit', decreaseSide: 'credit' },
    'الأرباح المحتجزة': { id: 'retained', nameAr: 'الأرباح المحتجزة', nameEn: 'Retained Earnings', type: 'equity', increaseSide: 'credit', decreaseSide: 'debit' },
    'الاحتياطيات': { id: 'reserves', nameAr: 'الاحتياطيات', nameEn: 'Reserves', type: 'equity', increaseSide: 'credit', decreaseSide: 'debit' },
    'صافي الربح': { id: 'net_profit', nameAr: 'صافي الربح', nameEn: 'Net Profit', type: 'equity', increaseSide: 'credit', decreaseSide: 'debit' },
    'المبيعات': { id: 'sales', nameAr: 'المبيعات', nameEn: 'Sales', type: 'revenue', increaseSide: 'credit', decreaseSide: 'debit' },
    'إيراد خدمات': { id: 'service_revenue', nameAr: 'إيراد خدمات', nameEn: 'Service Revenue', type: 'revenue', increaseSide: 'credit', decreaseSide: 'debit' },
    'إيراد خدمة': { id: 'service_revenue', nameAr: 'إيراد خدمات', nameEn: 'Service Revenue', type: 'revenue', increaseSide: 'credit', decreaseSide: 'debit' },
    'إيراد عمولات': { id: 'commission_revenue', nameAr: 'إيراد العمولات', nameEn: 'Commissions Revenue', type: 'revenue', increaseSide: 'credit', decreaseSide: 'debit' },
    'إيراد العمولات': { id: 'commission_revenue', nameAr: 'إيراد العمولات', nameEn: 'Commissions Revenue', type: 'revenue', increaseSide: 'credit', decreaseSide: 'debit' },
    'إيراد إيجار': { id: 'rent_revenue', nameAr: 'إيراد الإيجار', nameEn: 'Rent Revenue', type: 'revenue', increaseSide: 'credit', decreaseSide: 'debit' },
    'إيراد فوائد': { id: 'interest_revenue', nameAr: 'إيراد الفوائد', nameEn: 'Interest Revenue', type: 'revenue', increaseSide: 'credit', decreaseSide: 'debit' },
    'خصم مكتسب': { id: 'discount_earned', nameAr: 'خصم مكتسب', nameEn: 'Discount Earned', type: 'revenue', increaseSide: 'credit', decreaseSide: 'debit' },
  }
  const key = map[name] ? name : Object.keys(map).find((k) => name.includes(k))
  return key ? map[key] : null
}

export const ACCOUNT_NAME_TO_DICT: Record<string, string> = {
  'السيارات': 'السيارات',
  'الآلات والمعدات': 'الآلات والمعدات',
  'أجهزة الكمبيوتر': 'أجهزة الكمبيوتر',
}

export function balanceEntry(lines: JournalLine[]): boolean {
  const totalDebit = lines.filter((l) => l.side === 'debit').reduce((s, l) => s + l.amount, 0)
  const totalCredit = lines.filter((l) => l.side === 'credit').reduce((s, l) => s + l.amount, 0)
  return totalDebit === totalCredit && totalDebit > 0
}

export function formatAmount(n: number): string {
  return new Intl.NumberFormat('ar-EG').format(n)
}

export function makeSteps(input: {
  transaction: string
  explanation: string
  accounts: { name: string; change: Change; reason: string }[]
  why: string
  memoryRule: string
  assumptions?: string[]
}): StepResult {
  const accountTypes = input.accounts.map((a) => {
    const info = resolveAccount(a.name)
    const type = info?.type ?? 'asset'
    return {
      account: a.name,
      type,
      typeAr: TYPE_LABELS[type],
      typeEn: TYPE_LABELS_EN[type],
    }
  })
  const changes = input.accounts.map((a) => ({
    account: a.name,
    change: a.change,
    changeAr: a.change === 'increase' ? 'زاد' : 'نقص',
  }))
  const sides = input.accounts.map((a) => {
    const info = resolveAccount(a.name)
    const side =
      a.change === 'increase'
        ? info?.increaseSide ?? classify(info?.type ?? 'asset', 'increase')
        : info?.decreaseSide ?? classify(info?.type ?? 'asset', 'decrease')
    return {
      account: a.name,
      side,
      sideAr: side === 'debit' ? 'مدين' : 'دائن',
      reason: a.reason,
    }
  })
  const entry: JournalLine[] = sides.map((s) => ({
    accountId: resolveAccount(s.account)?.id ?? s.account,
    accountNameAr: s.account,
    side: s.side,
    amount: 0,
  }))
  return {
    transaction: input.transaction,
    explanation: input.explanation,
    accounts: input.accounts.map((a) => a.name),
    accountTypes,
    changes,
    sides,
    entry,
    why: input.why,
    memoryRule: input.memoryRule,
    assumptions: input.assumptions,
  }
}