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
  const drawings = drawingItems.reduce((s2, r) => s2 + r.amount, 0)
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