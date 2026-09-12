export const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩'

/** normalize an account name for comparison: strips 'حـ', spaces/diacritics, keeps Arabic/Latin/digits */
export function normAccount(s: string): string {
  return s
    .replace(/حـ/g, '')
    .replace(/[\u064B-\u0652]/g, '')
    .replace(/[^\u0621-\u064A\u0660-\u0669A-Za-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()
}

export const ACCOUNT_ALIASES: Record<string, string[]> = {
  'النقدية': ['الصندوق', 'نقدية', 'الخزينة', 'الصندوق نقدية'],
  'الصندوق': ['النقدية', 'نقدية', 'الخزينة'],
  'المدينون': ['العملاء', 'العميل', 'المدينين', 'حسابات العملاء'],
  'العملاء': ['المدينون', 'العميل', 'المدينين', 'حسابات العملاء'],
  'الدائنون': ['الموردون', 'المورد', 'الدائنين', 'حسابات الموردين'],
  'الموردون': ['الدائنون', 'المورد', 'الدائنين'],
  'مردودات المشتريات': ['مرتجعات المشتريات', 'مردودات', 'مرتجعات'],
  'رأس المال': ['راس المال', 'رأس مال', 'راس مال'],
  'مصروفات مقدمة': ['مصروفات مدفوعة مقدما', 'مصروف الإيجار المقدم', 'الإيجار المقدم', 'إيجار مدفوع مقدم'],
  'تأمينات لدى الغير': ['تأمين لدى الغير', 'التأمين المدفوع'],
  'تأمينات لدى الشركة': ['تأمين لدى الشركة', 'التأمين المستلم'],
  'الآلات والمعدات': ['الأجهزة والمعدات', 'المعدات', 'الآلات', 'الماكينات'],
  'الأجهزة والمعدات': ['الآلات والمعدات', 'المعدات', 'الآلات'],
}

/** pick the account name (from a candidate list) that most matches what the user typed */
export function acctMatch(user: string, expected: string): boolean {
  const u = normAccount(user)
  const e = normAccount(expected)
  if (!u || !e) return false
  if (u === e) return true
  const aliases = ACCOUNT_ALIASES[expected] ?? []
  if (aliases.some((a) => normAccount(a) === u)) return true
  if (u.length >= 3 && (u.includes(e) || e.includes(u))) return true
  return false
}

/** parse a typed amount as a number (handles 5,000 / 5000 / ٥٠٠٠ / 5.000) */
export function parseAmountText(s: string): number | null {
  const normalized = String(s).replace(/[\u0660-\u0669]/g, (d) => String(ARABIC_DIGITS.indexOf(d)))
  const m = normalized.match(/\d[\d.,]*/)
  return m ? parseFloat(m[0].replace(/,/g, '')) : null
}

export function amountEqualText(a: string, b: string): boolean {
  const na = parseAmountText(a)
  const nb = parseAmountText(b)
  return na !== null && nb !== null && na === nb
}

export function formatAmount(n: number): string {
  return n.toLocaleString('en-US')
}