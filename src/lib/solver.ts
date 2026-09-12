import type { JournalLine, StepResult } from '../types'
import { makeSteps, resolveAccount, formatAmount } from './engine'

export interface PatternMatch {
  id: string
  transaction: string
  amounts: number[]
  explanation: string
  accountLines: { name: string; change: 'increase' | 'decrease'; reason: string }[]
  why: string
  memoryRule: string
  assumption?: string
  _score?: number
}

interface AmountInfo {
  primary: number | null
  amounts: number[]
  counterPartAmount: number | null
  allEqual: boolean
}

// Number parsing that understands Arabic numerals, Arabic-Indic digits, and thousands separators.
export function extractAmounts(text: string): AmountInfo {
  // normalize Arabic-Indic digits to western
  const normalized = text
    .replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)))
    .replace(/[۰-۹]/g, (d) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[،,]/g, '')
    .replace(/[.٫]/g, '')
  const amounts: number[] = []
  const re = /(\d+)\s*(الف|آلاف|ألف|مليون|ملايين|جنيها?|جنيه|ريال|دينار|درهم)?/g
  let m: RegExpExecArray | null
  let primary: number | null = null
  while ((m = re.exec(normalized))) {
    let value = parseInt(m[1], 10)
    const unit = m[2] || ''
    if (unit.includes('مليون') || unit.includes('ملايين')) value *= 1_000_000
    else if (unit.includes('ألف') || unit.includes('الف') || unit.includes('آلاف')) value *= 1000
    if (primary === null) primary = value
    amounts.push(value)
  }
  const counterPartAmount =
    primary !== null && Array.from(new Set(amounts)).length === 1 ? primary : null
  return {
    primary,
    amounts,
    counterPartAmount,
    allEqual: amounts.length > 0 && Array.from(new Set(amounts)).length === 1,
  }
}

export function amountText(amount: number | null): string {
  if (amount === null) return 'المبلغ'
  return formatAmount(amount)
}

/** Attempts to match a transaction string against known operation patterns. */
export function analyzeTransaction(raw: string): PatternMatch | null {
  const text = raw
    .replace(/[؛;:]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  const amounts = extractAmounts(text)

  // Lowercased english-aware search helpers
  const has = (...tokens: string[]) => tokens.some((t) => text.includes(t))
  const score = (...tokens: string[]) => tokens.filter((t) => text.includes(t)).length
  const p = (base: PatternMatch, sc: number): PatternMatch => ({ ...base, _score: sc })

  const patterns: PatternMatch[] = []

  // ============ CASH IN / COLLECTIONS ============
  const payVerb = has('سددنا', 'سداد', 'دفعنا', 'دفع', 'سدد', 'تسديد', 'قمنا بسداد', 'سداد المديونية')
  const mentionsSupplier = has('للمورد', 'المورد', 'للموردين', 'الموردين', 'حساب المورد')
  if (payVerb && mentionsSupplier && !has('بالبنك', 'البنك', 'شيك', 'حوالة')) {
    patterns.push(p({
      id: 'pay_supplier',
      transaction: text,
      amounts: amounts.amounts,
      explanation: 'الشركة كانت مدينة للمورد، وقامت بسداد جزء من المبلغ المستحق عليه.',
      accountLines: [
        { name: 'الموردون', change: 'decrease', reason: 'سداد المورد يقلل الالتزام اللي علينا' },
        { name: 'النقدية', change: 'decrease', reason: 'فلوس خرجت من الشركة للسداد' },
      ],
      why: 'لأن سداد المورد يقلل الالتزام (الخصم ينقص → مدين)، وخروج النقدية يقلل الأصل (الأصل ينقص → دائن).',
      memoryRule: 'سداد المورد = الموردون مدين + النقدية دائن',
    }, score('سددنا', 'سداد', 'دفعنا', 'المورد', 'نقدًا', 'تسديد')))
  }

  if (payVerb && mentionsSupplier && has('بالبنك', 'البنك', 'شيك', 'حوالة')) {
    patterns.push(p({
      id: 'pay_supplier_bank',
      transaction: text,
      amounts: amounts.amounts,
      explanation: 'سداد المورد عن طريق البنك (شيك / حوالة بنكية).',
      accountLines: [
        { name: 'الموردون', change: 'decrease', reason: 'التزام اتسدد' },
        { name: 'البنك', change: 'decrease', reason: 'رصيد البنك قل' },
      ],
      why: 'سداد المورد يقلل الخصم → مدين. الدفع من البنك يقلل الأصل → دائن.',
      memoryRule: 'سداد المورد من البنك = الموردون مدين + البنك دائن',
    }, score('سددنا', 'سداد', 'دفعنا', 'المورد', 'البنك', 'شيك', 'حوالة')))
  }

  const collectVerb = has('قبضنا', 'قبض', 'استلمنا', 'استلام', 'تحصيل', 'استلم', 'حصلنا')
  const mentionsCustomer = has('العميل', 'من العميل', 'مديونية سابقة', 'قيمة', 'مستحقات')
  if (collectVerb && mentionsCustomer) {
    // Important distinction: "مقدم" shifts to customer advances
    if (has('مقدم', 'عربون', 'دفعة مقدمة', 'سلفة')) {
      patterns.push(p({
        id: 'customer_advance',
        transaction: text,
        amounts: amounts.amounts,
        explanation: 'العميل دفع مقدم قبل ما ياخد البضاعة أو الخدمة. المبلغ ده التزام علينا (لسه هنقدم له الخدمة).',
        assumption: 'العبارة "مقدم من العميل" = دفعة مقدمة، أصنّفها التزام (خصم) وليس إيراد.',
        accountLines: [
          { name: 'النقدية', change: 'increase', reason: 'فلوس دخلت الشركة' },
          { name: 'دفعات مقدمة من العملاء', change: 'increase', reason: 'التزام علينا نقدم بضاعة/خدمة قدام' },
        ],
        why: 'النقدية زادت → مدين. دفعات العملاء المقدمة التزام زاد → دائن. مش إيراد، لأننا لسه ما قدمنا البضاعة.',
        memoryRule: 'استلمنا مقدم من العميل = نقدية مدين + دفعات مقدمة من العملاء دائن',
      }, score('قبضنا', 'استلمنا', 'تحصيل', 'العميل', 'مقدم', 'عربون')))
    } else {
      patterns.push(p({
        id: 'collect_customer',
        transaction: text,
        amounts: amounts.amounts,
        explanation: 'العميل رد فلوس كان عليه للشركة (تحصيل مديونية سابقة).',
        accountLines: [
          { name: 'النقدية', change: 'increase', reason: 'فلوس دخلت الشركة' },
          { name: 'العملاء', change: 'decrease', reason: 'مستحقات العملاء قلت' },
        ],
        why: 'النقدية زادت (أصل → مدين)، ومستحقات العملاء قلت (أصل → دائن). مش إيراد — دي تحصيل مديونية قديمة.',
        memoryRule: 'قبض من العميل (تحصيل) = نقدية مدين + العملاء دائن',
      }, score('قبضنا', 'استلمنا', 'تحصيل', 'العميل', 'مديونية', 'مستحقات')))
    }
  }

  // ============ CASH OUT / PAYMENTS ============
  if (has('دفعنا إيجار', 'سددنا الإيجار', 'سداد الإيجار', 'دفع الإيجار', 'إيجار نقدًا')) {
    if (has('مقدم', 'الآجل', 'عن سنة', 'عن 6', 'عن ستة', 'عن سنة قادمة', 'مقدمًا عن')) {
      patterns.push({
        id: 'prepaid_rent',
        transaction: text,
        amounts: amounts.amounts,
        explanation: 'دفعنا إيجار عن فترة مستقبلية. الفايدة لسه متستهلكتش، يعني أصل (مصروفات مقدمة) مش مصروف دلوقتي.',
        assumption: 'اِعتبرت أن دفع الإيجار عن فترة قادمة.',
        accountLines: [
          { name: 'مصروفات مقدمة', change: 'increase', reason: 'دفعنا عن فترة مش فاتت — ليها قيمة تنفعنا جاية' },
          { name: 'النقدية', change: 'decrease', reason: 'فلوس خرجت' },
        ],
        why: 'مصروفات مقدمة أصل زاد → مدين. النقدية نقصت → دائن.',
        memoryRule: 'دفع إيجار مقدم = مصروفات مقدمة مدين + نقدية دائن',
      })
    } else {
      patterns.push({
        id: 'rent_expense',
        transaction: text,
        amounts: amounts.amounts,
        explanation: 'دفعنا إيجار عن فترة استخدمناها (مصروف فعلًا استنفدنا منفعته).',
        accountLines: [
          { name: 'مصروف الإيجار', change: 'increase', reason: 'تحملنا مصروف إيجار' },
          { name: 'النقدية', change: 'decrease', reason: 'فلوس خرجت' },
        ],
        why: 'المصروف زاد (مدين)، والنقدية نقصت (دائن).',
        memoryRule: 'دفع إيجار فوري = مصروف الإيجار مدين + نقدية دائن',
      })
    }
  }

  if (has('دفعنا مرتبات', 'سداد المرتبات', 'صرف المرتبات', 'دفع الأجور', 'مرتبات الشهر', 'سلامة المرتبات', 'صرنا المرتبات')) {
    patterns.push({
      id: 'salaries',
      transaction: text,
      amounts: amounts.amounts,
      explanation: 'صرفنا مرتبات الموظفين — مصروف عن الفترة.',
      accountLines: [
        { name: 'مصروف المرتبات', change: 'increase', reason: 'تكلفة المرتبات ع الحسابات' },
        { name: 'النقدية', change: 'decrease', reason: 'فلوس خرجت للرواتب' },
      ],
      why: 'المصروف زاد → مدين. النقدية نقصت → دائن.',
      memoryRule: 'دفع مرتبات = مصروف المرتبات مدين + نقدية دائن',
    })
  }

  if (has('مرتبات مستحقة', 'استحق المرتبات', 'مرتبات لم تدفع', 'استحق راتب', 'مرتبات مستحق')) {
    patterns.push({
      id: 'accrued_salaries',
      transaction: text,
      amounts: amounts.amounts,
      explanation: 'المرتبات استحقت (المفروض تتصرف) لكن لسه ما اتدفعتش → التزام.',
      accountLines: [
        { name: 'مصروف المرتبات', change: 'increase', reason: 'المصروف اتسجل' },
        { name: 'مرتبات مستحقة', change: 'increase', reason: 'التزام علينا للموظفين' },
      ],
      why: 'المصروف زاد → مدين. المرتبات المستحقة التزام زاد → دائن.',
      memoryRule: 'مرتبات مستحقة = مصروف المرتبات مدين + مرتبات مستحقة دائن',
    })
  }

  if (has('كهرباء', 'فاتورة الكهرباء', 'استهلاك كهرباء')) {
    patterns.push({
      id: 'electricity',
      transaction: text,
      amounts: amounts.amounts,
      explanation: 'فاتورة الكهرباء الخاصة بتشغيل المنشأة = مصروف.',
      accountLines: [
        { name: 'مصروف الكهرباء', change: 'increase', reason: 'تكلفة تشغيل' },
        { name: 'النقدية', change: 'decrease', reason: 'فلوس خرجت' },
      ],
      why: 'المصروف زاد → مدين. النقدية نقصت → دائن.',
      memoryRule: 'دفع كهرباء = مصروف الكهرباء مدين + نقدية دائن',
    })
  }

  if (has('مياه', 'فاتورة مياه')) {
    patterns.push({
      id: 'water',
      transaction: text,
      amounts: amounts.amounts,
      explanation: 'فاتورة المياه الخاصة بالمنشأة = مصروف.',
      accountLines: [
        { name: 'مصروف المياه', change: 'increase', reason: 'تكلفة تشغيل' },
        { name: 'النقدية', change: 'decrease', reason: 'فلوس خرجت' },
      ],
      why: 'المصروف زاد → مدين. النقدية نقصت → دائن.',
      memoryRule: 'دفع مياه = مصروف المياه مدين + نقدية دائن',
    })
  }

  if (has('إعلان', 'حملة إعلانية', 'دعاية')) {
    patterns.push({
      id: 'advertising',
      transaction: text,
      amounts: amounts.amounts,
      explanation: 'مصروف إعلان عن الخدمة أو المنتج.',
      accountLines: [
        { name: 'مصروف الإعلان', change: 'increase', reason: 'تكلفة تسويق' },
        { name: 'النقدية', change: 'decrease', reason: 'فلوس خرجت' },
      ],
      why: 'المصروف زاد → مدين. النقدية نقصت → دائن.',
      memoryRule: 'دفع إعلان = مصروف الإعلان مدين + نقدية دائن',
    })
  }

  if (has('نقل', 'شحن', 'سولار', 'بنزين', 'وقود')) {
    patterns.push({
      id: 'transport',
      transaction: text,
      amounts: amounts.amounts,
      explanation: 'تكاليف نقل أو تشغيل سيارة = مصروف.',
      accountLines: [
        { name: 'مصروف النقل', change: 'increase', reason: 'تكلفة نقل' },
        { name: 'النقدية', change: 'decrease', reason: 'فلوس خرجت' },
      ],
      why: 'المصروف زاد → مدين. النقدية نقصت → دائن.',
      memoryRule: 'دفع نقل = مصروف النقل مدين + نقدية دائن',
    })
  }

  // ============ PURCHASES ============
  const saleVerb = has('بعنا', 'باع', 'باعنا', 'بيع بضاعة', 'مبيعات', 'بعناه')
  if (
    has('اشترينا بضاعة', 'اشترى بضاعة', 'شراء بضاعة', 'مشترين بضاعة', 'شراء مشتريات', 'بضاعة من المورد', 'اشترينا مشتريات', 'اشترينا بضاعة من') &&
    !saleVerb
  ) {
    if (has('من المورد', 'بالأجل', 'بالآجل', 'آجل', 'على الحساب', 'دين')) {
      patterns.push(p({
        id: 'purchase_credit',
        transaction: text,
        amounts: amounts.amounts,
        explanation: 'اشترينا بضاعة من المورد بالآجل — المورد بقى التزام علينا.',
        accountLines: [
          { name: 'المشتريات', change: 'increase', reason: 'حسب المعالجة اللي اتعلمناها، المشتريات بتتعامل كمصروف/نشاط' },
          { name: 'الموردون', change: 'increase', reason: 'بقى علينا فلوس للمورد' },
        ],
        why: 'المشتريات زادت (طبيعتهم مدين حسب مادة الكورس)، والموردون التزام زاد → دائن.',
        memoryRule: 'شراء بضاعة بالآجل = المشتريات مدين + الموردون دائن',
      }, score('اشترينا', 'بضاعة', 'المورد', 'بالأجل')))
    } else {
      patterns.push(p({
        id: 'purchase_cash',
        transaction: text,
        amounts: amounts.amounts,
        explanation: 'اشترينا بضاعة ودفعنا ثمنها نقدًا.',
        accountLines: [
          { name: 'المشتريات', change: 'increase', reason: 'حسب المعالجة اتعاملنا مع المشتريات كمصروف' },
          { name: 'النقدية', change: 'decrease', reason: 'فلوس خرجت' },
        ],
        why: 'المشتريات زادت → مدين. النقدية نقصت → دائن.',
        memoryRule: 'شراء بضاعة نقدًا = المشتريات مدين + نقدية دائن',
      }, score('اشترينا', 'بضاعة', 'نقدًا', 'شراء')))
    }
  }

  if (has('اشترى أصل للأجل', 'اشترينا أصل بالأجل')) {
    patterns.push({
      id: 'asset_credit_buy',
      transaction: text,
      amounts: amounts.amounts,
      explanation: 'اشترينا أصل (أصل ثابت) بالآجل من غير مورد بضاعة.',
      accountLines: [
        { name: 'الأصل المناسب', change: 'increase', reason: 'شئنا أصل جديد' },
        { name: 'الدائنون', change: 'increase', reason: 'التزام علينا' },
      ],
      why: 'الأصل زاد → مدين. الدائنون التزام زاد → دائن.',
      memoryRule: 'شراء أصل بالآجل = الأصل مدين + الدائنون دائن',
    })
  }

  // ============ FIXED ASSETS ============
  const assetPatterns: { key: string; account: string; plural: string }[] = [
    { key: 'سيارة', account: 'السيارات', plural: 'سيارات' },
    { key: 'آلة', account: 'الآلات والمعدات', plural: 'آلات ومعدات' },
    { key: 'معدات', account: 'الآلات والمعدات', plural: 'معدات' },
    { key: 'مبنى', account: 'المباني', plural: 'مباني' },
    { key: 'أرض', account: 'الأراضي', plural: 'أراضي' },
    { key: 'كمبيوتر', account: 'أجهزة الكمبيوتر', plural: 'أجهزة كمبيوتر' },
  ]
  for (const ap of assetPatterns) {
    if (text.includes(ap.key)) {
      const forResale =
        has('إعادة بيع', 'للبيع', 'بغرض إعادة', 'بغرض البيع', 'تداول') ||
        (ap.key === 'سيارة' && has('معرض سيارات', 'بيع سيارات'))
      if (forResale) {
        // سيارة لإعادة البيع → بضاعة/مخزون
        patterns.push({
          id: `resale_${ap.key}`,
          transaction: text,
          amounts: amounts.amounts,
          explanation: `اشترينا ${ap.key} بغرض إعادة بيعها — تبقى بضاعة (مخزون) مش أصل ثابت.`,
          assumption: 'افترضت أن الشراء بغرض إعادة البيع.',
          accountLines: [
            { name: 'المخزون', change: 'increase', reason: 'بضاعة هنبيعها' },
            { name: 'النقدية', change: 'decrease', reason: 'فلوس خرجت' },
          ],
          why: 'المخزون زاد → مدين. النقدية نقصت → دائن.',
          memoryRule: `شراء ${ap.key} لإعادة البيع = المخزون مدين + نقدية دائن`,
        })
      } else {
        const paidByBank = has('البنك', 'شيك', 'حوالة') ? 'البنك' : 'النقدية'
        if (has('بالأجل', 'بالآجل', 'من المورد', 'آجل', 'على الحساب')) {
          patterns.push({
            id: `asset_credit_${ap.key}`,
            transaction: text,
            amounts: amounts.amounts,
            explanation: `اشترينا ${ap.key} للاستخدام في المنشأة بالآجل.`,
            assumption: 'افترضت أن الأصل للاستخدام الداخلي وليس بغرض إعادة البيع.',
            accountLines: [
              { name: ap.account, change: 'increase', reason: `أصل جديد للاستخدام` },
              { name: 'الدائنون', change: 'increase', reason: 'التزام علينا' },
            ],
            why: `${ap.account} أصل زاد → مدين. الدائنون التزام زاد → دائن.`,
            memoryRule: `شراء ${ap.key} بالآجل = ${ap.account} مدين + الدائنون دائن`,
          })
        } else {
          patterns.push({
            id: `asset_cash_${ap.key}`,
            transaction: text,
            amounts: amounts.amounts,
            explanation: `اشترينا ${ap.key} للاستخدام في المنشأة ودفعنا تمنها ${paidByBank === 'البنك' ? 'من البنك' : 'نقدًا'}.`,
            assumption: 'افترضت أن الأصل للاستخدام الداخلي وليس بغرض إعادة البيع.',
            accountLines: [
              { name: ap.account, change: 'increase', reason: 'أصل جديد للاستخدام' },
              { name: paidByBank, change: 'decrease', reason: 'فلوس خرجت' },
            ],
            why: `${ap.account} أصل زاد → مدين. ${paidByBank} نقصت → دائن.`,
            memoryRule: `شراء ${ap.key} = ${ap.account} مدين + ${paidByBank} دائن`,
          })
        }
      }
    }
  }

  // ============ SALES ============
  if (has('بعنا', 'باع بضاعة', 'بيع بضاعة', 'مبيعات نقدًا', 'مبيعات بالآجل', 'مبيعات آجلة', 'حققنا مبيعات', 'بعنا بغرض')) {
    if (has('للعميل بالأجل', 'بالآجل', 'بالأجل', 'آجل', 'على الحساب', 'للعميل بالدين', 'للعميل آجل')) {
      patterns.push(p({
        id: 'sale_credit',
        transaction: text,
        amounts: amounts.amounts,
        explanation: 'بعنا بضاعة للعميل بالآجل — العميل بقى عليه فلوس للشركة.',
        accountLines: [
          { name: 'العملاء', change: 'increase', reason: 'العميل مدين للشركة' },
          { name: 'المبيعات', change: 'increase', reason: 'إيراد مبيعات تحقق' },
        ],
        why: 'العملاء أصل زاد → مدين. المبيعات إيراد زاد → دائن.',
        memoryRule: 'بيع بالآجل = العملاء مدين + المبيعات دائن',
      }, score('بعنا', 'بضاعة', 'العميل', 'بالآجل')))
    } else {
      patterns.push(p({
        id: 'sale_cash',
        transaction: text,
        amounts: amounts.amounts,
        explanation: 'بعنا بضاعة واستلمنا ثمنها فورًا.',
        accountLines: [
          { name: 'النقدية', change: 'increase', reason: 'فلوس دخلت من البيع' },
          { name: 'المبيعات', change: 'increase', reason: 'إيراد مبيعات تحقق' },
        ],
        why: 'النقدية زادت → مدين. المبيعات إيراد زاد → دائن.',
        memoryRule: 'بيع نقدًا = نقدية مدين + المبيعات دائن',
      }, score('بعنا', 'باع', 'بضاعة', 'نقدًا', 'مبيعات')))
    }
  }

  if (has('قدمنا خدمة', 'إيراد خدمات', 'أتعاب', 'خدمة للعميل', 'خدمة استشارية', 'إيراد خدمة')) {
    patterns.push({
      id: 'service_revenue',
      transaction: text,
      amounts: amounts.amounts,
      explanation: 'الشركة قدمت خدمة وحققنا إيراد منها.',
      accountLines: [
        { name: 'النقدية', change: 'increase', reason: 'فلوس دخلت' },
        { name: 'إيراد خدمات', change: 'increase', reason: 'إيراد تم تحقيقه' },
      ],
      why: 'النقدية زادت → مدين. إيراد الخدمات زاد → دائن.',
      memoryRule: 'إيراد خدمات = نقدية مدين + إيراد خدمات دائن',
    })
  }

  if (has('عمولة', 'إيراد عمولات')) {
    patterns.push({
      id: 'commission_revenue',
      transaction: text,
      amounts: amounts.amounts,
      explanation: 'الشركة حصلت عمولة عن وساطة أو خدمة.',
      accountLines: [
        { name: 'النقدية', change: 'increase', reason: 'فلوس دخلت' },
        { name: 'إيراد عمولات', change: 'increase', reason: 'إيراد عمولة تحقق' },
      ],
      why: 'النقدية زادت → مدين. إيراد العمولات زاد → دائن.',
      memoryRule: 'إيراد عمولات = نقدية مدين + إيراد عمولات دائن',
    })
  }

  // ============ LOANS ============
  if (has('قرض', 'اقتراض') && !has('سداد', 'سددنا')) {
    patterns.push({
      id: 'loan_taken',
      transaction: text,
      amounts: amounts.amounts,
      explanation: 'الشركة أخذت قرضًا من جهة تمويلية.',
      accountLines: [
        { name: 'البنك', change: 'increase', reason: 'فلوس دخلت على حساب البنك' },
        { name: 'القروض', change: 'increase', reason: 'التزام القرض اتسجل' },
      ],
      why: 'البنك أصل زاد → مدين. القروض التزام زاد → دائن.',
      memoryRule: 'أخذ قرض = البنك مدين + القروض دائن',
    })
  }

  if (has('قرض') && has('سداد', 'سددنا', 'سدد', 'جزءًا من', 'جزء من')) {
    patterns.push({
      id: 'loan_payment',
      transaction: text,
      amounts: amounts.amounts,
      explanation: 'سداد جزء من القرض يقلل الالتزام ويقلل النقدية/البنك.',
      accountLines: [
        { name: 'القروض', change: 'decrease', reason: 'التزام القرض قل' },
        { name: 'البنك', change: 'decrease', reason: 'فلوس خرجت للسداد' },
      ],
      why: 'القروض التزام نقص → مدين. البنك أصل نقص → دائن.',
      memoryRule: 'سداد قرض = القروض مدين + البنك دائن',
    })
  }

  // ============ CAPITAL ============
  if (has('رأس المال', 'رأس مال', 'أودع صاحب', 'وضع صاحب', 'استثمار المالك', 'زيادة رأس')) {
    patterns.push({
      id: 'capital_invest',
      transaction: text,
      amounts: amounts.amounts,
      explanation: 'صاحب المنشأة ضخ فلوس أو أصول في الشركة كرأس مال.',
      accountLines: [
        { name: 'النقدية', change: 'increase', reason: 'فلوس دخلت من المالك' },
        { name: 'رأس المال', change: 'increase', reason: 'حق المالك زاد في الشركة' },
      ],
      why: 'النقدية زادت (أصل → مدين). رأس المال حق ملكية زاد → دائن.',
      memoryRule: 'إيداع رأس مال = نقدية مدين + رأس المال دائن',
    })
  }

  if (has('سحب المالك', 'مسحوبات', 'سحب صاحب', 'سحب مالك', 'سحب من المنشأة')) {
    patterns.push({
      id: 'owner_withdrawal',
      transaction: text,
      amounts: amounts.amounts,
      explanation: 'صاحب المنشأة سحب فلوس من الشركة لاستخدامه الشخصي.',
      accountLines: [
        { name: 'المسحوبات', change: 'increase', reason: 'حقوق الملكية بتقل، والمسحوبات طبيعتها مدين' },
        { name: 'النقدية', change: 'decrease', reason: 'فلوس سحبت' },
      ],
      why: 'المسحوبات بتقلل حقوق الملكية وطبيعتها مدين. النقدية نقصت → دائن.',
      memoryRule: 'مسحوبات المالك = المسحوبات مدين + نقدية دائن',
    })
  }

  // ============ MISCELLANEOUS ============
  if (has('تأمين') && (has('دفعنا', 'دفع', 'سددنا', 'سداد', 'أدينا', 'قدمنا تأمين'))) {
    patterns.push({
      id: 'insurance_given',
      transaction: text,
      amounts: amounts.amounts,
      explanation: 'دفعنا تأمين لجهة خارجية — ليها قيمة مستحقة لنا. أصل.',
      accountLines: [
        { name: 'تأمينات لدى الغير', change: 'increase', reason: 'مبلغ مقدم بنأخده أول ما يتقفل التأمين' },
        { name: 'النقدية', change: 'decrease', reason: 'فلوس خرجت' },
      ],
      why: 'تأمينات لدى الغير أصل زاد → مدين. النقدية نقصت → دائن.',
      memoryRule: 'دفع تأمين = تأمينات لدى الغير مدين + نقدية دائن',
    })
  }

  if (has('تأمين') && has('استلمنا', 'استلام', 'من الغير', 'من عميل', 'قبضنا تأمين')) {
    patterns.push({
      id: 'insurance_held',
      transaction: text,
      amounts: amounts.amounts,
      explanation: 'استلمنا تأمين من جهة أخرى — التزام علينا نرجعه/نخصمه.',
      accountLines: [
        { name: 'النقدية', change: 'increase', reason: 'فلوس دخلت' },
        { name: 'تأمينات لدى الشركة', change: 'increase', reason: 'التزام علينا' },
      ],
      why: 'النقدية زادت → مدين. تأمينات لدى الشركة التزام زاد → دائن.',
      memoryRule: 'استلام تأمين من الغير = نقدية مدين + تأمينات لدى الشركة دائن',
    })
  }

  // Last resort: refine patterns with priority — return best match
  if (patterns.length === 0) return null

  // Prefer patterns with the most matching trigger tokens, then most accounts
  patterns.sort(
    (a, b) =>
      (b._score ?? 0) - (a._score ?? 0) ||
      b.accountLines.length - a.accountLines.length
  )
  return patterns[0]
}

/** Final step builder that converts a matched pattern into a full StepResult. */
export function solveTransaction(raw: string): StepResult | null {
  const p = analyzeTransaction(raw)
  if (!p) return null
  const amount = p.amounts.length > 0 && Array.from(new Set(p.amounts)).length === 1
    ? p.amounts[0]
    : null

  const result = makeSteps({
    transaction: p.transaction,
    explanation: p.explanation,
    accounts: p.accountLines.map((l) => ({ name: l.name, change: l.change, reason: l.reason })),
    why: p.why,
    memoryRule: p.memoryRule,
    assumptions: p.assumption ? [p.assumption] : undefined,
  })

  // attach amounts to entry lines
  const entry: JournalLine[] = result.sides.map((s) => ({
    accountId: resolveAccount(s.account)?.id ?? s.account,
    accountNameAr: s.account,
    side: s.side,
    amount: amount ?? 0,
  }))

  return { ...result, entry }
}

export function entryAmountFor(result: StepResult): number {
  return result.entry.find((l) => l.amount != null && l.amount > 0)?.amount ?? 0
}