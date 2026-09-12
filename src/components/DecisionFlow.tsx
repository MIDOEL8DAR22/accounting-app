import type { StepResult } from '../types'
import { Card } from './ui'
import { formatAmount } from '../lib/engine'
import { TYPE_BG } from '../data/accountTypes'
import { cn } from '../lib/cn'

export function DecisionFlow({ result, showAmounts = false }: { result: StepResult; showAmounts?: boolean }) {
  return (
    <div className="space-y-3">
      {/* Step 1: transaction */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-1 text-xs font-bold text-slate-500 dark:text-slate-400">📝 الخطوة 1 — العملية</div>
        <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{result.transaction}</div>
      </div>

      {/* Step 2: accounts */}
      <FlowArrow />
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-2 text-xs font-bold text-slate-500 dark:text-slate-400">🔎 الخطوة 2 — الحسابات المتأثرة</div>
        <div className="flex flex-wrap gap-2">
          {result.accounts.map((a) => (
            <span key={a} className="rounded-lg bg-white px-3 py-1 text-sm font-bold text-slate-700 shadow-sm dark:bg-slate-700 dark:text-slate-100">
              {a}
            </span>
          ))}
        </div>
      </div>

      {/* Step 3: account type */}
      <FlowArrow />
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-2 text-xs font-bold text-slate-500 dark:text-slate-400">🏷️ الخطوة 3 — نوع كل حساب</div>
        <div className="space-y-1.5">
          {result.accountTypes.map((at) => (
            <div key={at.account} className="flex items-center justify-between gap-2">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{at.account}</span>
              <span className={cn('rounded-lg border px-2.5 py-0.5 text-xs font-bold', TYPE_BG[at.type])}>
                {at.typeAr}
                <span className="mr-1 text-[10px] opacity-60 lang-en">{at.typeEn}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step 4: change */}
      <FlowArrow />
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-2 text-xs font-bold text-slate-500 dark:text-slate-400">📈 الخطوة 4 — زاد ولا نقص</div>
        <div className="space-y-1.5">
          {result.changes.map((c) => (
            <div key={c.account} className="flex items-center justify-between gap-2">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{c.account}</span>
              <span
                className={cn(
                  'rounded-lg px-2.5 py-0.5 text-xs font-bold',
                  c.change === 'increase'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                    : 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300'
                )}
              >
                {c.changeAr} {c.change === 'increase' ? '📈' : '📉'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step 5: side */}
      <FlowArrow />
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-2 text-xs font-bold text-slate-500 dark:text-slate-400">↔️ الخطوة 5 — مدين أم دائن؟</div>
        <div className="space-y-1.5">
          {result.sides.map((s) => (
            <div key={s.account} className="flex items-center justify-between gap-2">
              <div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{s.account}</span>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">{s.reason}</div>
              </div>
              <span
                className={cn(
                  'rounded-lg px-3 py-1 text-xs font-extrabold',
                  s.side === 'debit'
                    ? 'bg-blue-600 text-white'
                    : 'bg-emerald-600 text-white'
                )}
              >
                {s.side === 'debit' ? 'مدين' : 'دائن'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Step 6: entry */}
      <FlowArrow />
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
        <div className="mb-2 text-xs font-bold text-slate-500 dark:text-slate-400">📒 الخطوة 6 — القيد اليومي</div>
        <JournalEntryDisplay result={result} showAmounts={showAmounts} />
      </div>
    </div>
  )
}

function FlowArrow() {
  return <div className="flex justify-center text-slate-300 dark:text-slate-600">↓</div>
}

export function JournalEntryDisplay({ result, showAmounts = false }: { result: StepResult; showAmounts?: boolean }) {
  const debitLines = result.entry.filter((l) => l.side === 'debit')
  const creditLines = result.entry.filter((l) => l.side === 'credit')
  const amount = showAmounts
    ? result.entry.find((l) => l.amount > 0)?.amount ?? null
    : null

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-300 bg-white text-sm dark:border-slate-600 dark:bg-slate-900">
      <table className="w-full min-w-[340px]">
        <thead>
          <tr className="border-b border-slate-200 text-xs dark:border-slate-700">
            <th className="px-3 py-2 text-right font-bold text-slate-600 dark:text-slate-300">الحساب</th>
            <th className="px-3 py-2 text-center font-bold text-blue-700 dark:text-blue-400">مدين</th>
            <th className="px-3 py-2 text-center font-bold text-emerald-700 dark:text-emerald-400">دائن</th>
          </tr>
        </thead>
        <tbody>
          {debitLines.map((l) => (
            <tr key={'d' + l.accountNameAr}>
              <td className="px-3 py-2 font-semibold text-slate-800 dark:text-slate-100">
                <span className="text-slate-400">من حـ/ </span>
                {l.accountNameAr}
              </td>
              <td className="num px-3 py-2 text-center font-mono font-bold text-blue-700 dark:text-blue-400">
                {formatAmount(amount ?? l.amount)}
              </td>
              <td className="px-3 py-2 text-center text-slate-300">—</td>
            </tr>
          ))}
          {creditLines.map((l) => (
            <tr key={'c' + l.accountNameAr}>
              <td className="px-3 py-2 font-semibold text-slate-800 dark:text-slate-100">
                <span className="text-slate-400">إلى حـ/ </span>
                {l.accountNameAr}
              </td>
              <td className="px-3 py-2 text-center text-slate-300">—</td>
              <td className="num px-3 py-2 text-center font-mono font-bold text-emerald-700 dark:text-emerald-400">
                {formatAmount(amount ?? l.amount)}
              </td>
            </tr>
          ))}
          <tr className="border-t border-slate-200 font-extrabold dark:border-slate-700">
            <td className="px-3 py-2 text-slate-600 dark:text-slate-300">الإجمالي</td>
            <td className={cn('num px-3 py-2 text-center font-mono')}>
              <span className="text-blue-700 dark:text-blue-400">
                {formatAmount(debitLines.reduce((s, l) => s + (amount ?? l.amount), 0))}
              </span>
            </td>
            <td className="num px-3 py-2 text-center font-mono">
              <span className="text-emerald-700 dark:text-emerald-400">
                {formatAmount(creditLines.reduce((s, l) => s + (amount ?? l.amount), 0))}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export function EntryTable({ debit, credit }: { debit?: string; credit?: string }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-300 bg-white text-sm dark:border-slate-600 dark:bg-slate-900">
      <table className="w-full min-w-[340px]">
        <thead>
          <tr className="border-b border-slate-200 text-xs dark:border-slate-700">
            <th className="px-3 py-2 text-right font-bold text-slate-600 dark:text-slate-300">الحساب</th>
            <th className="px-3 py-2 text-center font-bold text-blue-700 dark:text-blue-400">مدين</th>
            <th className="px-3 py-2 text-center font-bold text-emerald-700 dark:text-emerald-400">دائن</th>
          </tr>
        </thead>
        <tbody>
          {debit && (
            <tr>
              <td className="px-3 py-2 font-semibold text-slate-800 dark:text-slate-100">
                <span className="text-slate-400">من حـ/ </span>
                {debit}
              </td>
              <td className="num px-3 py-2 text-center font-mono font-bold text-blue-700 dark:text-blue-400">✓</td>
              <td className="px-3 py-2 text-center text-slate-300">—</td>
            </tr>
          )}
          {credit && (
            <tr>
              <td className="px-3 py-2 font-semibold text-slate-800 dark:text-slate-100">
                <span className="text-slate-400">إلى حـ/ </span>
                {credit}
              </td>
              <td className="px-3 py-2 text-center text-slate-300">—</td>
              <td className="num px-3 py-2 text-center font-mono font-bold text-emerald-700 dark:text-emerald-400">✓</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

export function WhyBox({ why, rule }: { why: string; rule?: string }) {
  return (
    <Card className="animate-fade-in-up">
      <div className="mb-1 text-xs font-bold text-slate-500 dark:text-slate-400">لماذا؟</div>
      <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">{why}</p>
      {rule && (
        <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
          🧠 قاعدة للحفظ: {rule}
        </div>
      )}
    </Card>
  )
}