import type { FC } from 'react'
import type { VocabTerm } from './accountingEnglish'
import {
  IconCoins,
  IconFileText,
  IconBook,
  IconChartUp,
  IconChartDown,
  IconLayers,
  IconHome,
  IconShield,
  IconClock,
  IconWallet,
  IconTarget,
  IconFlame,
  IconGift,
  IconRocket,
  IconBriefcase,
  IconScale,
  IconSpark,
  IconPen,
  IconLandmark,
  IconPhone,
} from '../components/icons'

interface Visual {
  Icon: FC<{ size?: number; className?: string }>
  gradient: string
  anim: string
}

interface Rule {
  match: (t: VocabTerm) => boolean
  visual: Visual
}

const V = {
  coins: { Icon: IconCoins, gradient: 'from-amber-400 to-yellow-500', anim: 'animate-pulse' },
  file: { Icon: IconFileText, gradient: 'from-sky-400 to-blue-600', anim: 'animate-float' },
  book: { Icon: IconBook, gradient: 'from-violet-400 to-purple-600', anim: 'animate-pulse' },
  up: { Icon: IconChartUp, gradient: 'from-emerald-400 to-green-600', anim: 'animate-float' },
  down: { Icon: IconChartDown, gradient: 'from-rose-400 to-red-600', anim: 'animate-pulse' },
  layers: { Icon: IconLayers, gradient: 'from-teal-400 to-cyan-600', anim: 'animate-float' },
  home: { Icon: IconHome, gradient: 'from-orange-400 to-amber-600', anim: 'animate-pulse' },
  shield: { Icon: IconShield, gradient: 'from-blue-500 to-indigo-600', anim: 'animate-float' },
  clock: { Icon: IconClock, gradient: 'from-fuchsia-400 to-pink-600', anim: 'animate-float' },
  wallet: { Icon: IconWallet, gradient: 'from-lime-400 to-green-600', anim: 'animate-pulse' },
  target: { Icon: IconTarget, gradient: 'from-cyan-400 to-sky-600', anim: 'animate-float' },
  flame: { Icon: IconFlame, gradient: 'from-red-400 to-rose-600', anim: 'animate-pulse' },
  gift: { Icon: IconGift, gradient: 'from-pink-400 to-fuchsia-600', anim: 'animate-float' },
  rocket: { Icon: IconRocket, gradient: 'from-indigo-400 to-violet-600', anim: 'animate-float' },
  brief: { Icon: IconBriefcase, gradient: 'from-slate-500 to-slate-700', anim: 'animate-pulse' },
  scale: { Icon: IconScale, gradient: 'from-indigo-500 to-blue-700', anim: 'animate-float' },
  spark: { Icon: IconSpark, gradient: 'from-amber-400 to-orange-500', anim: 'animate-float' },
  pen: { Icon: IconPen, gradient: 'from-emerald-400 to-teal-600', anim: 'animate-pulse' },
  landmark: { Icon: IconLandmark, gradient: 'from-slate-400 to-slate-600', anim: 'animate-float' },
  phone: { Icon: IconPhone, gradient: 'from-blue-400 to-cyan-600', anim: 'animate-pulse' },
}

const RULES: Rule[] = [
  { match: (t) => /tax|reserve|احتياطي|ضريب|ضرائب/.test(t.en) || /ضرائب|احتياطي/.test(t.ar), visual: V.shield },
  { match: (t) => /journal|ledger|book|اليومية|الأستاذ|الدفتر|الاستاذ/.test(t.en) || /يومية|أستاذ|دفتر|الدفترية/.test(t.ar), visual: V.book },
  { match: (t) => /invoice|order|receipt|document|فا|فاتورة|أمر|إيصال|مستند/.test(t.en) || /فاتورة|أمر|إيصال|مستند/.test(t.ar), visual: V.file },
  { match: (t) => /revenue|sales|income|profit|gain|earn|credit benefits|إيراد|مبيعات|ربح|أرباح|دخل|فوائد دائنة/.test(t.en) || /إيراد|مبيعات|ربح|أرباح|دخل/.test(t.ar), visual: V.up },
  { match: (t) => /loss|خسارة/.test(t.en) || /خسائر/.test(t.ar), visual: V.down },
  { match: (t) => /depreciat|اهلاك|إهلاك/.test(t.en) || /اهلاك|إهلاك/.test(t.ar), visual: V.clock },
  { match: (t) => /asset|inventory|stock|أصل|مخزون/.test(t.en) || /أصل|مخزون|أصول/.test(t.ar), visual: V.layers },
  { match: (t) => /land|building|machin|equipment|furniture|car|أرض|مبان|آل|معد|أثاث|سيار/.test(t.en) || /أراضي|مباني|آلات|معدات|أثاث|سيارات/.test(t.ar), visual: V.home },
  { match: (t) => /rent|ايجار/.test(t.en) || /إيجار/.test(t.ar), visual: V.home },
  { match: (t) => /bank|بنك/.test(t.en) || /بنك/.test(t.ar) || /بنوك/.test(t.ar), visual: V.landmark },
  { match: (t) => /cash|petty|نقد|صندوق|عهدة/.test(t.en) || /نقد|صندوق|عهدة/.test(t.ar), visual: V.coins },
  { match: (t) => /money-related|loan|interest|discount|currency|commission|عمول|فوائد|خصم|قرض|عملة/.test(t.en) || /قروض|فوائد|خصم|عملة|عمولات/.test(t.ar), visual: V.coins },
  { match: (t) => /salary|wage|payroll|allowance|مرتب|أجور|سلف/.test(t.en) || /مرتبات|أجور|سلف/.test(t.ar), visual: V.wallet },
  { match: (t) => /capital|equity|withdraw|owner|رأس|مال|مسحوبات|ملكية/.test(t.en) || /رأس المال|حقوق الملكية|مسحوبات/.test(t.ar), visual: V.wallet },
  { match: (t) => /marketing|advertis|customer|تسويق|إعلان|عملاء/.test(t.en) || /تسويقية|إعلان|عملاء/.test(t.ar), visual: V.target },
  { match: (t) => /electricity|telephone|water|كهرب|تليفون|مياه|اتصال/.test(t.en) || /كهرباء|تليفون|مياه|اتصالات/.test(t.ar), visual: V.phone },
  { match: (t) => /laundry|cleaning|نظاف/.test(t.en) || /نظافة/.test(t.ar), visual: V.flame },
  { match: (t) => /gift|meals|entertainment|hospitality|هدايا|وجبات|ترفيه|ضيافة/.test(t.en) || /هدايا|وجبات|ترفيه|ضيافة/.test(t.ar), visual: V.gift },
  { match: (t) => /travel|freight|postage|customs|ship|سفر|شحن|بريد|جمارك/.test(t.en) || /سفريات|شحن|بريد|جمارك/.test(t.ar), visual: V.rocket },
  { match: (t) => /license|fee|office|postage|تراخيص|أتعاب|مكتبية/.test(t.en) || /تراخيص|أتعاب|مكتبية/.test(t.ar), visual: V.pen },
  { match: (t) => /balance|trial|ميزان/.test(t.en) || /ميزان|مراجعة/.test(t.ar), visual: V.scale },
  { match: (t) => /goodwill|شهرة/.test(t.en) || /شهرة/.test(t.ar), visual: V.spark },
  { match: (t) => /statement|قوائم|قائمة/.test(t.en) || /قائمة|القوائم/.test(t.ar), visual: V.file },
  { match: (t) => /expense|cost|مصروف|تكلف/.test(t.en) || /مصروف|مصروفات|تكلفة/.test(t.ar), visual: V.down },
  { match: (t) => /partner|شركاء/.test(t.en) || /شركاء/.test(t.ar), visual: V.brief },
  { match: (t) => /accountant|محاسب/.test(t.en) || /محاسب/.test(t.ar), visual: V.brief },
  { match: (t) => /accounting|محاسبة/.test(t.en) || /محاسبة/.test(t.ar), visual: V.book },
  { match: () => true, visual: V.spark },
]

export function getVisual(term: VocabTerm): Visual {
  const lowerEn = term.en.toLowerCase()
  const rule = RULES.find((r) => r.match({ id: term.id, en: lowerEn, ar: term.ar }))
  return rule?.visual ?? V.spark
}

export function WordArt({ term, size = 'lg' }: { term: VocabTerm; size?: 'sm' | 'lg' }) {
  const { Icon, gradient, anim } = getVisual(term)
  return (
    <div
      className={cnVisual(gradient, anim, size)}
    >
      <Icon size={size === 'lg' ? 34 : 16} />
    </div>
  )
}

function cnVisual(gradient: string, anim: string, size: 'sm' | 'lg'): string {
  const base =
    'flex items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg shadow-slate-900/20'
  const s = size === 'lg' ? 'mx-auto h-20 w-20' : 'h-10 w-10 rounded-xl'
  return [base, gradient, anim, s].join(' ')
}