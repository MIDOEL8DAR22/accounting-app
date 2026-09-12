import { useState } from 'react'
import { Card, Button } from '../components/ui'
import { DecisionFlow, WhyBox } from '../components/DecisionFlow'
import { solveTransaction, analyzeTransaction, type PatternMatch } from '../lib/solver'
import type { StepResult } from '../types'
import { recordSolver } from '../lib/progress'
import { IconBrain, IconPen, IconSearch, IconLightbulb, IconQuestion, IconAlert } from '../components/icons'

const EXAMPLE_TRANSACTIONS = [
  'سددنا 20,000 للمورد نقدًا',
  'اشترينا بضاعة نقدًا بمبلغ 30,000',
  'اشترينا بضاعة من المورد بالأجل بمبلغ 50,000',
  'بعنا بضاعة نقدًا بمبلغ 15,000',
  'بعنا بضاعة للعميل بالأجل بمبلغ 25,000',
  'قبضنا 10,000 من العميل',
  'دفعنا إيجار 5,000 نقدًا',
  'أخذت الشركة قرضًا من البنك 100,000',
  'سددنا جزءًا من القرض 20,000',
  'أودع صاحب المنشأة 200,000 كرأس مال',
]

export function Solver() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<{ steps: StepResult; pattern: PatternMatch } | null>(null)
  const [noMatch, setNoMatch] = useState(false)

  const handleSolve = (text?: string) => {
    const q = text ?? input
    if (!q.trim()) return
    const steps = solveTransaction(q)
    const pattern = analyzeTransaction(q)
    if (steps && pattern) {
      setResult({ steps, pattern })
      setNoMatch(false)
      recordSolver()
    } else {
      setResult(null)
      setNoMatch(true)
    }
  }

  const handleExampleClick = (ex: string) => {
    setInput(ex)
    handleSolve(ex)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-xl font-extrabold text-slate-800 dark:text-slate-100 sm:text-2xl">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400"><IconBrain size={18} /></span>
          حل أي سؤال محاسبي
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          اكتب العملية المحاسبية وهنحلها خطوة بخطوة
        </p>
      </div>

      <Card>
        <label className="mb-2 flex items-center gap-1.5 block text-sm font-bold text-slate-700 dark:text-slate-200"><IconPen size={14} className="text-slate-400" /> اكتب العملية:</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="مثال: سددنا 20,000 للمورد نقدًا"
          rows={3}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
        />
        <Button onClick={() => handleSolve()} className="mt-3">
          <IconSearch size={15} /> حل العملية
        </Button>
      </Card>

      <div>
        <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400"><IconLightbulb size={13} className="text-amber-500" /> جرّب أمثلة جاهزة:</div>
        <div className="flex flex-wrap gap-2">
          {EXAMPLE_TRANSACTIONS.map((ex) => (
            <button
              key={ex}
              onClick={() => handleExampleClick(ex)}
              className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {noMatch && (
        <Card className="border-amber-200 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10">
          <div className="flex items-start gap-2 text-sm font-bold text-amber-800 dark:text-amber-300">
            <IconQuestion size={16} className="mt-0.5 shrink-0" />
            <span>مش قادر أحل العملية دي لسه.</span>
          </div>
          <div className="mt-1 text-xs text-amber-700 dark:text-amber-400">
            جرّب صياغة تانية أو استخدم أمثلة جاهزة. المنصة بتتعلم مع الوقت!
          </div>
          <div className="mt-3 space-y-2 text-xs text-amber-600 dark:text-amber-500">
            <div className="mb-1 flex items-center gap-1.5 font-bold"><IconLightbulb size={13} className="text-amber-500" /> أمثلة على عمليات أقدر أحلها:</div>
            <div>• سددنا / دفعنا / اشترينا بضاعة / بعنا بضاعة</div>
            <div>• قبضنا من العميل / استلمنا مقدم</div>
            <div>• دفعنا إيجار / مرتبات / كهرباء / إعلان</div>
            <div>• أخذنا قرض / سددنا جزء من القرض</div>
            <div>• أودع صاحب المنشأة / سحب صاحب المنشأة</div>
            <div>• اشترينا سيارة / آلة / مبنى / أرض</div>
          </div>
        </Card>
      )}

      {result && (
        <div className="space-y-4 animate-fade-in-up">
          {result.pattern.assumption && (
            <div className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm font-bold text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
              <IconAlert size={15} className="mt-0.5 shrink-0" />
              <span>افتراض: {result.pattern.assumption}</span>
            </div>
          )}

          <DecisionFlow result={result.steps} showAmounts />

          <WhyBox why={result.steps.why} rule={result.steps.memoryRule} />
        </div>
      )}
    </div>
  )
}