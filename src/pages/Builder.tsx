import { useState } from 'react'
import { Card, Button } from '../components/ui'
import { ACCOUNT_CATALOG } from '../data/accountDictionary'
import { cn } from '../lib/cn'
import { formatAmount } from '../lib/engine'
import { IconNotebook, IconX, IconCheckCircle, IconAlert, IconPlus } from '../components/icons'

interface Line {
  accountId: string
  amount: string
}

export function Builder() {
  const [debits, setDebits] = useState<Line[]>([{ accountId: '', amount: '' }])
  const [credits, setCredits] = useState<Line[]>([{ accountId: '', amount: '' }])

  const totalDebit = debits.reduce((s, l) => s + (parseFloat(l.amount) || 0), 0)
  const totalCredit = credits.reduce((s, l) => s + (parseFloat(l.amount) || 0), 0)
  const isBalanced = totalDebit > 0 && totalDebit === totalCredit
  const isEmpty = debits.every((l) => !l.accountId) && credits.every((l) => !l.accountId)

  const updateDebit = (i: number, field: keyof Line, val: string) => {
    setDebits((prev) => prev.map((l, j) => (j === i ? { ...l, [field]: val } : l)))
  }
  const updateCredit = (i: number, field: keyof Line, val: string) => {
    setCredits((prev) => prev.map((l, j) => (j === i ? { ...l, [field]: val } : l)))
  }

  const addDebitLine = () => setDebits((prev) => [...prev, { accountId: '', amount: '' }])
  const addCreditLine = () => setCredits((prev) => [...prev, { accountId: '', amount: '' }])
  const removeDebitLine = (i: number) => setDebits((prev) => prev.filter((_, j) => j !== i))
  const removeCreditLine = (i: number) => setCredits((prev) => prev.filter((_, j) => j !== i))

  const allAccounts = ACCOUNT_CATALOG || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-extrabold text-slate-800 dark:text-slate-100 sm:text-2xl">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"><IconNotebook size={18} /></span>
          منشئ القيد اليومي
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">اختار الحسابات والمبالغ — وشوف القيد بيتكتب صح</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="mb-3 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-600" />
            <h2 className="text-sm font-extrabold text-blue-700 dark:text-blue-400">مدين (Debit) — من حـ/</h2>
          </div>
          <div className="space-y-2">
            {debits.map((line, i) => (
              <div key={i} className="flex gap-2">
                <select
                  value={line.accountId}
                  onChange={(e) => updateDebit(i, 'accountId', e.target.value)}
                  className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="">اختر حساب...</option>
                  {allAccounts.map((a) => (
                    <option key={a.id} value={a.id}>{a.nameAr} — {a.nameEn}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={line.amount}
                  onChange={(e) => updateDebit(i, 'amount', e.target.value)}
                  placeholder="المبلغ"
                  className="num w-32 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                />
                {debits.length > 1 && (
                  <button onClick={() => removeDebitLine(i)} className="rounded-md p-1 text-rose-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10" aria-label="حذف السطر"><IconX size={15} /></button>
                )}
              </div>
            ))}
            <Button variant="ghost" onClick={addDebitLine} className="w-full border border-dashed border-blue-300 text-blue-600">
              <IconPlus size={14} /> سطر مدين
            </Button>
          </div>
          <div className="mt-3 border-t border-slate-200 pt-2 dark:border-slate-700">
            <div className="text-sm font-extrabold text-blue-700 dark:text-blue-400">
              الإجمالي: <span className="num">{formatAmount(totalDebit)}</span> {totalDebit > 0 ? 'جنيه' : ''}
            </div>
          </div>
        </Card>

        <Card>
          <div className="mb-3 flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-emerald-600" />
            <h2 className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400">دائن (Credit) — إلى حـ/</h2>
          </div>
          <div className="space-y-2">
            {credits.map((line, i) => (
              <div key={i} className="flex gap-2">
                <select
                  value={line.accountId}
                  onChange={(e) => updateCredit(i, 'accountId', e.target.value)}
                  className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                >
                  <option value="">اختر حساب...</option>
                  {allAccounts.map((a) => (
                    <option key={a.id} value={a.id}>{a.nameAr} — {a.nameEn}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={line.amount}
                  onChange={(e) => updateCredit(i, 'amount', e.target.value)}
                  placeholder="المبلغ"
                  className="num w-32 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                />
                {credits.length > 1 && (
                  <button onClick={() => removeCreditLine(i)} className="rounded-md p-1 text-rose-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10" aria-label="حذف السطر"><IconX size={15} /></button>
                )}
              </div>
            ))}
            <Button variant="ghost" onClick={addCreditLine} className="w-full border border-dashed border-emerald-300 text-emerald-600">
              <IconPlus size={14} /> سطر دائن
            </Button>
          </div>
          <div className="mt-3 border-t border-slate-200 pt-2 dark:border-slate-700">
            <div className="text-sm font-extrabold text-emerald-700 dark:text-emerald-400">
              الإجمالي: <span className="num">{formatAmount(totalCredit)}</span> {totalCredit > 0 ? 'جنيه' : ''}
            </div>
          </div>
        </Card>
      </div>

      <Card className={cn(
        'transition',
        isBalanced ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-500/10' : !isEmpty ? 'border-rose-300 bg-rose-50 dark:bg-rose-500/10' : ''
      )}>
        {isEmpty ? (
          <div className="text-center text-sm text-slate-500 dark:text-slate-400">اختار الحسابات والمبلغ</div>
        ) : isBalanced ? (
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400"><IconCheckCircle size={24} /></div>
            <div className="text-sm font-extrabold text-emerald-700 dark:text-emerald-300">
              القيد متوازن — {formatAmount(totalDebit)} جنيه
            </div>
            <div className="mt-3 space-y-1">
              {debits.filter((l) => l.accountId).map((l, i) => {
                const acct = allAccounts.find((a) => a.id === l.accountId)
                return (
                  <div key={i} className="text-sm font-bold text-blue-700 dark:text-blue-400">
                    من حـ/ {acct?.nameAr || l.accountId} — {formatAmount(parseFloat(l.amount) || 0)} جنيه
                  </div>
                )
              })}
              {credits.filter((l) => l.accountId).map((l, i) => {
                const acct = allAccounts.find((a) => a.id === l.accountId)
                return (
                  <div key={i} className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                    إلى حـ/ {acct?.nameAr || l.accountId} — {formatAmount(parseFloat(l.amount) || 0)} جنيه
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400"><IconAlert size={24} /></div>
            <div className="text-sm font-bold text-rose-700 dark:text-rose-300">
              القيد مش متوازن! المدين ({formatAmount(totalDebit)}) لا يساوي الدائن ({formatAmount(totalCredit)})
            </div>
            <div className="mt-1 text-xs text-rose-600 dark:text-rose-400">
              الفارق: {formatAmount(Math.abs(totalDebit - totalCredit))} جنيه
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}