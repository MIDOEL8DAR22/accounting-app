import { useState } from 'react'
import type { VocabTerm } from './accountingEnglish'

const KEYWORDS: Record<number, string> = {
  1: 'accounting,calculator',
  2: 'accountant,calculator',
  3: 'money,finance',
  4: 'minus,decrease',
  5: 'plus,increase',
  6: 'documents,folder',
  7: 'purchase,shopping list',
  8: 'delivery,parcel',
  9: 'shipping,package',
  10: 'invoice,bill',
  11: 'books,ledger',
  12: 'journal,notebook',
  13: 'writing,notes',
  14: 'accounting,records',
  15: 'ledger,bookkeeping',
  16: 'charts,analytics',
  17: 'report,graphs',
  18: 'balance,scale',
  19: 'financial,documents',
  20: 'balance,sheet,report',
  21: 'income,chart',
  22: 'cost,graph',
  23: 'cash,flow,money',
  24: 'assets,building',
  25: 'time,long term',
  26: 'factory,building',
  27: 'land,field',
  28: 'furniture,sofa',
  29: 'tools,equipment',
  30: 'building,house',
  31: 'machine,factory',
  32: 'car,vehicle',
  33: 'recycle,arrows',
  34: 'cash,money',
  35: 'bank,building',
  36: 'receipt,bill',
  37: 'warehouse,boxes',
  38: 'customer,handshake',
  39: 'invoice,document',
  40: 'clock,advance',
  41: 'growth,income',
  42: 'star,fame',
  43: 'loan,coins',
  44: 'purse,wallet',
  45: 'supply,warehouse',
  46: 'withdrawal,atm',
  47: 'construction,assets',
  48: 'advertising,billboard',
  49: 'construction,startup',
  50: 'chains,obligation',
  51: 'time,long term',
  52: 'loan,bank',
  53: 'recycle,arrows',
  54: 'supplier,truck',
  55: 'payment,bill',
  56: 'payment,credit',
  57: 'payable,bills',
  58: 'pause,future',
  59: 'clock,pending',
  60: 'customer,advance',
  61: 'equity,scale',
  62: 'capital,money',
  63: 'partners,handshake',
  64: 'gear,working',
  65: 'shield,reserve',
  66: 'savings,bank',
  67: 'savings,growth',
  68: 'depreciation,decline',
  69: 'clock,decline',
  70: 'revenue,income,money',
  71: 'sales,shop',
  72: 'cost,goods,receipt',
  73: 'calendar,january',
  74: 'shopping,store',
  75: 'shipping,cost',
  76: 'return,arrows',
  77: 'discount,tag',
  78: 'warehouse,stock',
  79: 'calendar,december',
  80: 'sales,profit',
  81: 'return,refund',
  82: 'discount,sale',
  83: 'profit,money',
  84: 'expenses,budget',
  85: 'marketing,megaphone',
  86: 'office,administration',
  87: 'operations,gear',
  88: 'cost,production',
  89: 'rent,house',
  90: 'salary,paycheck',
  91: 'freight,truck,cargo',
  92: 'customs,airport',
  93: 'hospitality,coffee',
  94: 'maintenance,repair',
  95: 'advertising,promotion',
  96: 'bank,fees',
  97: 'electricity,light',
  98: 'telephone,call',
  99: 'water,tap',
  100: 'gift,box',
  101: 'fees,contract',
  102: 'interest,growth',
  103: 'communication,phone',
  104: 'commission,coins',
  105: 'office,desk',
  106: 'mail,letters',
  107: 'travel,airplane',
  108: 'license,permit',
  109: 'cleaning,laundry',
  110: 'debt,problem',
  111: 'meal,restaurant',
  112: 'securities,stocks',
  113: 'credit,benefits',
  114: 'profit,balance',
  115: 'capital,gains,market',
  116: 'currency,exchange',
  117: 'exchange,currency',
  118: 'income,tax',
  119: 'sales,tax,receipt',
  120: 'tax,government',
}

const FALLBACK_EMOJI: Record<number, string> = {
  1: '🧾', 2: '🧮', 3: '💵', 4: '🔻', 5: '🔺', 6: '🗂️', 7: '📋', 8: '📥', 9: '📤', 10: '🧾',
  11: '📚', 12: '📓', 13: '✍️', 14: '🗄️', 15: '📒', 16: '📊', 17: '📈', 18: '⚖️', 19: '📑', 20: '🏛️',
  21: '💹', 22: '📉', 23: '💸', 24: '🏗️', 25: '⏳', 26: '🏢', 27: '🏞️', 28: '🛋️', 29: '🛠️', 30: '🏠',
  31: '🏭', 32: '🚗', 33: '🔄', 34: '💵', 35: '🏦', 36: '📩', 37: '📦', 38: '🤝', 39: '📜', 40: '⏩',
  41: '💹', 42: '🌟', 43: '🪙', 44: '👛', 45: '📦', 46: '💸', 47: '🏗️', 48: '📢', 49: '🏗️', 50: '🧷',
  51: '⏳', 52: '🏦', 53: '🔄', 54: '🚚', 55: '📤', 56: '📤', 57: '📤', 58: '⏸️', 59: '⏰', 60: '🤝',
  61: '👑', 62: '💰', 63: '🤝', 64: '⚙️', 65: '🛡️', 66: '🗃️', 67: '⏭️', 68: '📉', 69: '⏳', 70: '💵',
  71: '🛒', 72: '🧾', 73: '📅', 74: '🛒', 75: '🚚', 76: '↩️', 77: '🏷️', 78: '🧮', 79: '📅', 80: '💲',
  81: '↩️', 82: '🏷️', 83: '💰', 84: '💸', 85: '📣', 86: '🏢', 87: '⚙️', 88: '📉', 89: '🏠', 90: '💳',
  91: '🚚', 92: '🛃', 93: '☕', 94: '🔧', 95: '📢', 96: '🏦', 97: '💡', 98: '📞', 99: '🚰', 100: '🎁',
  101: '🖋️', 102: '📈', 103: '💬', 104: '🪙', 105: '🖨️', 106: '✉️', 107: '✈️', 108: '🪪', 109: '🧹', 110: '💔',
  111: '🍽️', 112: '📈', 113: '💹', 114: '⚖️', 115: '📈', 116: '💱', 117: '🔄', 118: '🏛️', 119: '🛒', 120: '🏛️',
}

const BG = ['bg-sky-100', 'bg-emerald-100', 'bg-amber-100', 'bg-rose-100', 'bg-violet-100', 'bg-teal-100', 'bg-indigo-100', 'bg-orange-100']

function imageUrl(term: VocabTerm, w: number, h: number): string {
  const kw = (KEYWORDS[term.id] ?? 'accounting').replace(/[^a-z0-9 +,-]/gi, '').toLowerCase()
  return `https://loremflickr.com/${w}/${h}/${encodeURIComponent(kw)}?lock=${term.id}`
}

export function WordArt({ term, size = 'lg' }: { term: VocabTerm; size?: 'sm' | 'lg' }) {
  const [failed, setFailed] = useState(false)
  const w = size === 'lg' ? 400 : 120
  const h = size === 'lg' ? 280 : 120
  const bg = BG[term.id % BG.length]

  if (failed) {
    return (
      <div
        className={`flex items-center justify-center rounded-3xl shadow-sm animate-float ${bg} ${
          size === 'lg' ? 'mx-auto h-28 w-40' : 'h-14 w-14 rounded-2xl'
        }`}
      >
        <span className={size === 'lg' ? 'text-5xl leading-none' : 'text-3xl leading-none'}>
          {FALLBACK_EMOJI[term.id] ?? '📘'}
        </span>
      </div>
    )
  }

  return (
    <div
      className={`relative overflow-hidden rounded-3xl shadow-sm animate-float bg-slate-200 dark:bg-slate-700 ${
        size === 'lg' ? 'mx-auto h-28 w-40' : 'h-14 w-14 rounded-2xl'
      }`}
    >
      <img
        src={imageUrl(term, w, h)}
        alt={`${term.en} — ${term.ar}`}
        loading="lazy"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover"
      />
    </div>
  )
}