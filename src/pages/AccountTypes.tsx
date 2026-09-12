import { useState } from 'react'
import { Card, Badge } from '../components/ui'
import { ACCOUNT_TYPES, TYPE_BG } from '../data/accountTypes'
import type { AccountType } from '../types'
import { cn } from '../lib/cn'

export function AccountTypes() {
  const [selected, setSelected] = useState<AccountType | null>(null)
  const active = selected ? ACCOUNT_TYPES.find((t) => t.type === selected) : null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 sm:text-2xl">أنواع الحسابات الخمسة</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          كل حساب ليه نوع — اضغط عليه عشان تعرف التفاصيل
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {ACCOUNT_TYPES.map((t) => (
          <button
            key={t.type}
            onClick={() => setSelected(selected === t.type ? null : t.type)}
            className={cn(
              'rounded-xl border-2 px-4 py-3 text-center transition',
              selected === t.type
                ? cn(TYPE_BG[t.type], 'ring-2 ring-blue-400 shadow-md')
                : 'border-slate-200 bg-white hover:border-blue-300 dark:border-slate-700 dark:bg-slate-800/60'
            )}
          >
            <div className="text-2xl">{t.type === 'asset' ? '💰' : t.type === 'expense' ? '💸' : t.type === 'liability' ? '📋' : t.type === 'equity' ? '🏛️' : '📈'}</div>
            <div className="mt-1 text-sm font-extrabold text-slate-800 dark:text-slate-100">{t.nameAr}</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400 lang-en">{t.nameEn}</div>
            <Badge color={t.type === 'asset' ? 'blue' : t.type === 'expense' ? 'red' : t.type === 'liability' ? 'green' : t.type === 'equity' ? 'purple' : 'amber'} className="mt-2">
              طبيعته: {t.normalSide === 'debit' ? 'مدين' : 'دائن'}
            </Badge>
          </button>
        ))}
      </div>

      {active && (
        <Card className="animate-fade-in-up">
          <div className="flex items-center gap-3 mb-3">
            <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">{active.nameAr}</h2>
            <Badge color={active.type === 'asset' ? 'blue' : active.type === 'expense' ? 'red' : active.type === 'liability' ? 'green' : active.type === 'equity' ? 'purple' : 'amber'}>
              {active.normalSide === 'debit' ? 'طبيعته مدين' : 'طبيعته دائن'}
            </Badge>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-200">{active.definition}</p>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-500/30 dark:bg-emerald-500/10">
              <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400">📈 عند الزيادة</div>
              <div className="text-lg font-extrabold text-emerald-800 dark:text-emerald-200">
                {active.increaseSide === 'debit' ? 'مدين' : 'دائن'}
              </div>
            </div>
            <div className="rounded-xl border border-orange-200 bg-orange-50 p-3 dark:border-orange-500/30 dark:bg-orange-500/10">
              <div className="text-xs font-bold text-orange-600 dark:text-orange-400">📉 عند النقص</div>
              <div className="text-lg font-extrabold text-orange-800 dark:text-orange-200">
                {active.decreaseSide === 'debit' ? 'مدين' : 'دائن'}
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="mb-2 text-sm font-extrabold text-slate-700 dark:text-slate-200">أمثلة على الحسابات:</div>
            <div className="flex flex-wrap gap-2">
              {active.examples.map((ex) => (
                <span key={ex} className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                  {ex}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm font-bold text-blue-800 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200">
            🧠 {active.phoneRule}
          </div>
        </Card>
      )}
    </div>
  )
}