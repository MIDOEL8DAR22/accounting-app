import { useState } from 'react'
import { Card, Button, Badge, DifficultyStars } from '../components/ui'
import { SCENARIOS, computeLedger, computeSummary, type Scenario, type ScenarioTx } from '../data/practicalScenarios'
import { getProgress, completePracticalScenario } from '../lib/progress'
import { acctMatch, parseAmountText, formatAmount } from '../lib/entryCheck'
import { cn } from '../lib/cn'
import {
  IconBriefcase,
  IconNotebook,
  IconScale,
  IconChart,
  IconLandmark,
  IconCheck,
  IconCheckCircle,
  IconLightbulb,
  IconEye,
  IconArrowRight,
  IconArrowLeft,
  IconAward,
  IconRefresh,
} from '../components/icons'

interface RowFields {
  dA: string
  dAmt: string
  cA: string
  cAmt: string
}

interface TbFields {
  debit: string
  credit: string
}

interface Session {
  step: number
  rows: Record<string, RowFields>
  tb: Record<string, TbFields>
  inc: { revenues: string; costs: string; expenses: string }
  bs: { assets: string; liabilities: string; equity: string }
  done: boolean
}

const emptyRow = (): RowFields => ({ dA: '', dAmt: '', cA: '', cAmt: '' })

function buildSession(s: Scenario): Session {
  const rows: Record<string, RowFields> = {}
  for (const tx of s.txs) rows[tx.id] = emptyRow()
  const tb: Record<string, TbFields> = {}
  for (const r of computeLedger(s)) tb[r.account] = { debit: '', credit: '' }
  return { step: 1, rows, tb, inc: { revenues: '', costs: '', expenses: '' }, bs: { assets: '', liabilities: '', equity: '' }, done: false }
}

function gradeTx(tx: ScenarioTx, f: RowFields) {
  const dAmt = parseAmountText(f.dAmt)
  const cAmt = parseAmountText(f.cAmt)
  const dAccOk = acctMatch(f.dA, tx.debit.account)
  const dAmtOk = dAmt === tx.debit.amount
  const cAccOk = acctMatch(f.cA, tx.credit.account)
  const cAmtOk = cAmt === tx.credit.amount
  const balanced = dAmt !== null && cAmt !== null && dAmt === cAmt
  return { dAccOk, dAmtOk, cAccOk, cAmtOk, balanced, correct: dAccOk && dAmtOk && cAccOk && cAmtOk && balanced }
}

function isRowFilled(f: RowFields): boolean {
  return f.dA.trim() !== '' && f.dAmt.trim() !== '' && f.cA.trim() !== '' && f.cAmt.trim() !== ''
}

const STEPS = [
  { id: 1, label: 'دفتر اليومية', icon: IconNotebook },
  { id: 2, label: 'ميزان المراجعة', icon: IconScale },
  { id: 3, label: 'قائمة الدخل', icon: IconChart },
  { id: 4, label: 'الميزانية', icon: IconLandmark },
] as const

export function Practical() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [sessions, setSessions] = useState<Record<string, Session>>({})

  const progress = getProgress()
  const completed = progress.practicalCompleted ?? []
  const scenario = activeId ? SCENARIOS.find((s) => s.id === activeId) ?? null : null
  const session = scenario ? sessions[scenario.id] ?? buildSession(scenario) : null
  const summary = scenario ? computeSummary(scenario) : null

  if (!scenario || !session || !summary) {
    return (
      <div className="space-y-4">
        <Card className="border-violet-200 border-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center">
              <IconBriefcase size={26} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-violet-900">التطبيق العملي</h1>
              <p className="text-sm text-violet-600">شغل حقيقي... وسجّله بنفسك في جداول الشغل الحقيقية</p>
            </div>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            هتشتغل كمحاسب لشركة حقيقية: كل معاملة سوا كنت عايز تكتبها في دفتر اليومية، وبعدين ترحّلها لميزان المراجعة، وتجهّز منها قائمة الدخل والميزانية.
            القيد يُصحّح لحظيًا، وتتعلّم غلطتك في نفس اللحظة.
          </p>
        </Card>

        {SCENARIOS.map((s) => {
          const isDone = completed.includes(s.id)
          return (
            <Card key={s.id} className="space-y-3 border-slate-200">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <IconBriefcase size={22} />
                  </div>
                  <div>
                    <h2 className="font-bold text-slate-900">{s.title}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <DifficultyStars level={s.difficulty} />
                      {isDone && (
                        <Badge color="green" className="flex items-center gap-1">
                          <IconCheck size={13} /> مكتملة
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button variant="ghost" onClick={() => setSessions((prev) => ({ ...prev, [s.id]: buildSession(s) }))}>
                    <IconRefresh size={15} />
                  </Button>
                  <Button onClick={() => setActiveId(s.id)}>{isDone ? 'اعملها كمان مرة' : 'ابدأ'}</Button>
                </div>
              </div>
              <p className="text-sm text-slate-600">{s.business}</p>
              <div className="flex flex-wrap gap-2">
                {s.stepsIntro.map((st, i) => (
                  <span key={i} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-lg">
                    {st}
                  </span>
                ))}
              </div>
            </Card>
          )
        })}
      </div>
    )
  }

  const setSession = (updater: (sess: Session) => Session) => {
    setSessions((prev) => ({ ...prev, [scenario.id]: updater(prev[scenario.id] ?? buildSession(scenario)) }))
  }

  const stepComplete = (sess: Session): boolean => {
    if (sess.step === 1) return scenario.txs.every((tx) => gradeTx(tx, sess.rows[tx.id] ?? emptyRow()).correct)
    if (sess.step === 2) {
      const ledger = computeLedger(scenario)
      return ledger.every((r) => {
        const f = sess.tb[r.account]
        return (parseAmountText(f?.debit ?? '0') ?? 0) === r.debitTotal && (parseAmountText(f?.credit ?? '0') ?? 0) === r.creditTotal
      })
    }
    if (sess.step === 3) {
      const v = sess.inc
      return (parseAmountText(v.revenues) ?? -1) === summary.totalRevenues && (parseAmountText(v.costs) ?? -1) === summary.totalCosts && (parseAmountText(v.expenses) ?? -1) === summary.totalExpenses
    }
    const v = sess.bs
    return (parseAmountText(v.assets) ?? -1) === summary.totalAssets && (parseAmountText(v.liabilities) ?? -1) === summary.totalLiabilities && (parseAmountText(v.equity) ?? -1) === summary.equity
  }

  const markDone = () => {
    if (session.done) return
    completePracticalScenario(scenario.id)
    setSession((s) => ({ ...s, done: true }))
  }

  const ledger = computeLedger(scenario)
  const journalDone = scenario.txs.every((tx) => gradeTx(tx, session.rows[tx.id] ?? emptyRow()).correct)
  const tbDone = stepComplete({ ...session })
  const incomeDone = (() => {
    const v = session.inc
    return (parseAmountText(v.revenues) ?? -1) === summary.totalRevenues && (parseAmountText(v.costs) ?? -1) === summary.totalCosts && (parseAmountText(v.expenses) ?? -1) === summary.totalExpenses
  })()
  const bsDone = session.done || !!(session.step === 4 && stepComplete(session))

  const firstIncomplete = session.done ? 5 : !journalDone ? 1 : !tbDone ? 2 : !incomeDone ? 3 : !bsDone ? 4 : 5

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <IconBriefcase size={22} />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-slate-900">{scenario.title}</h1>
            <p className="text-sm text-slate-500">{scenario.business}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" onClick={() => setActiveId(null)}>
            <IconArrowRight size={16} /> الكل
          </Button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {STEPS.map((st) => {
          const Icon = st.icon
          const reachable = st.id <= firstIncomplete
          const isCurrent = session.step === st.id
          return (
            <button
              key={st.id}
              onClick={() => {
                if (st.id <= firstIncomplete) setSession((s) => ({ ...s, step: st.id }))
              }}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-bold whitespace-nowrap border-2 transition-colors',
                isCurrent
                  ? 'border-violet-600 bg-violet-600 text-white'
                  : reachable
                    ? 'border-violet-200 bg-white text-violet-700'
                    : 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
              )}
            >
              <Icon size={16} />
              {st.label}
              {st.id < firstIncomplete && !isCurrent && <IconCheckCircle size={15} className="text-emerald-500" />}
            </button>
          )
        })}
      </div>

      {session.step === 1 && (
        <JournalStep
          scenario={scenario}
          rows={session.rows}
          setRows={(r) => setSession((s) => ({ ...s, rows: r }))}
        />
      )}
      {session.step === 2 && (
        <TrialBalanceStep
          scenario={scenario}
          tb={session.tb}
          setTb={(v) => setSession((s) => ({ ...s, tb: v }))}
        />
      )}
      {session.step === 3 && (
        <IncomeStep
          summary={summary}
          inc={session.inc}
          setInc={(v) => setSession((s) => ({ ...s, inc: v }))}
        />
      )}
      {session.step === 4 && (
        <BalanceSheetStep
          summary={summary}
          bs={session.bs}
          setBs={(v) => setSession((s) => ({ ...s, bs: v }))}
          onDone={markDone}
          done={session.done}
        />
      )}

      {!session.done && stepComplete(session) && session.step < 4 && (
        <Card className="border-emerald-300 bg-emerald-50 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 font-bold text-emerald-800">
            <IconCheckCircle size={20} /> الخطوة دي تمام! كمل يا محاسب
          </div>
          <Button variant="success" onClick={() => setSession((s) => ({ ...s, step: s.step + 1 }))}>
            الخطوة الجاية <IconArrowLeft size={16} />
          </Button>
        </Card>
      )}

      {session.done && (
        <Card className="border-violet-300 bg-violet-50 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-violet-600 text-white flex items-center justify-center">
              <IconAward size={26} />
            </div>
            <div>
              <h2 className="font-extrabold text-violet-900">إنجاز حقيقي!</h2>
              <p className="text-sm text-violet-600">سجّلت دورة محاسبية كاملة من أول القيد لحد الميزانية.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setActiveId(null)}>
              <IconArrowRight size={16} /> سيناريوهات تانية
            </Button>
            <Button variant="secondary" onClick={() => setActiveId(null)}>
              <IconRefresh size={15} /> الصفحة الرئيسية
            </Button>
          </div>
        </Card>
      )}

      <p className="text-center text-xs text-slate-400">كل قيد مش مزبوط؟ اضغط "دليل" جنب أي صف يشوفلك الإجابة.</p>
    </div>
  )
}

/* ---------------------------------- step 1 ---------------------------------- */

function JournalStep({
  scenario,
  rows,
  setRows,
}: {
  scenario: Scenario
  rows: Record<string, RowFields>
  setRows: (r: Record<string, RowFields>) => void
}) {
  const [hints, setHints] = useState<Record<string, boolean>>({})
  const doneCount = scenario.txs.filter((tx) => isRowFilled(rows[tx.id] ?? emptyRow()) && gradeTx(tx, rows[tx.id]).correct).length

  return (
    <Card className="border-slate-200 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <IconNotebook size={20} className="text-violet-700" />
          <h2 className="font-extrabold text-slate-900">دفتر اليومية</h2>
        </div>
        <Badge color="violet">
          {doneCount} من {scenario.txs.length} قيد صحيح
        </Badge>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-900 leading-relaxed flex gap-2">
        <IconLightbulb size={18} className="shrink-0 mt-0.5" />
        <p>
          اكتب كل عملية بالنظام: <b>من حـ</b> (الحساب المدين) أولًا ثم <b>إلى حـ</b> (الحساب الدائن)، والمبلغ بجانب كل حساب.
          القيد صحيح لما يكون فيه مدين = دائن والحسابات صح.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[760px] border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-600">
              <th className="px-2 py-2 text-right font-bold border border-slate-200">#</th>
              <th className="px-2 py-2 text-right font-bold border border-slate-200 min-w-[180px]">العملية</th>
              <th className="px-2 py-2 text-right font-bold border border-slate-200">من حـ (مدين)</th>
              <th className="px-2 py-2 text-right font-bold border border-slate-200">المبلغ</th>
              <th className="px-2 py-2 text-right font-bold border border-slate-200">إلى حـ (دائن)</th>
              <th className="px-2 py-2 text-right font-bold border border-slate-200">المبلغ</th>
              <th className="px-2 py-2 text-center font-bold border border-slate-200">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {scenario.txs.map((tx, i) => {
              const f = rows[tx.id] ?? emptyRow()
              const filled = isRowFilled(f)
              const grade = gradeTx(tx, f)
              const locked = filled && grade.correct
              return (
                <Row
                  key={tx.id}
                  tx={tx}
                  index={i}
                  f={f}
                  grade={grade}
                  locked={locked}
                  hint={!!hints[tx.id]}
                  onHint={() => setHints((h) => ({ ...h, [tx.id]: !h[tx.id] }))}
                  onField={(patch) => setRows({ ...rows, [tx.id]: { ...f, ...patch } })}
                />
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}

function Row({
  tx,
  index,
  f,
  grade,
  locked,
  hint,
  onHint,
  onField,
}: {
  tx: ScenarioTx
  index: number
  f: RowFields
  grade: ReturnType<typeof gradeTx>
  locked: boolean
  hint: boolean
  onHint: () => void
  onField: (patch: Partial<RowFields>) => void
}) {
  const fusses = []
  const filled = isRowFilled(f)
  if (filled && !grade.dAccOk) fusses.push('الحساب المدين')
  if (filled && !grade.dAmtOk) fusses.push('مبلغ المدين')
  if (filled && !grade.cAccOk) fusses.push('الحساب الدائن')
  if (filled && !grade.cAmtOk) fusses.push('مبلغ الدائن')
  if (filled && !grade.balanced) fusses.push('التوازن (مدين ≠ دائن)')

  const inputCls = (bad: boolean) =>
    cn(
      'w-full px-2 py-1.5 rounded-lg border-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-violet-300 transition-colors',
      locked ? 'border-emerald-400 bg-emerald-50 text-emerald-900' : bad ? 'border-red-300 bg-red-50' : 'border-slate-200'
    )

  return (
    <tr className={cn('border border-slate-200', locked && 'bg-emerald-50/60')}>
      <td className="px-2 py-2 text-center text-slate-500 font-medium border border-slate-200 w-10">
        <div className="text-[10px] text-slate-400">{tx.date}</div>
        <div className="font-bold">{index + 1}</div>
      </td>
      <td className="px-2 py-2 text-slate-700 border border-slate-200 leading-relaxed">
        {tx.story}
        <div className="mt-1">
          <button
            onClick={onHint}
            className="text-xs text-violet-600 hover:text-violet-800 font-bold flex items-center gap-1"
          >
            <IconEye size={13} /> {hint ? 'إخفاء الدليل' : 'دليل'}
          </button>
        </div>
        {hint && (
          <div className="mt-1 text-xs bg-violet-50 border border-violet-200 rounded-lg p-2 text-violet-800">
            من حـ <b>{tx.debit.account}</b> — {formatAmount(tx.debit.amount)} إلى حـ <b>{tx.credit.account}</b> —{' '}
            {formatAmount(tx.credit.amount)}
          </div>
        )}
      </td>
      <td className="px-2 py-2 border border-slate-200">
        <input
          className={inputCls(filled && !grade.dAccOk)}
          placeholder="الحساب المدين"
          value={f.dA}
          disabled={locked}
          onChange={(e) => onField({ dA: e.target.value })}
        />
      </td>
      <td className="px-2 py-2 border border-slate-200 w-28">
        <input
          className={inputCls(filled && !grade.dAmtOk)}
          placeholder="المبلغ"
          dir="ltr"
          inputMode="decimal"
          value={f.dAmt}
          disabled={locked}
          onChange={(e) => onField({ dAmt: e.target.value })}
        />
      </td>
      <td className="px-2 py-2 border border-slate-200">
        <input
          className={inputCls(filled && !grade.cAccOk)}
          placeholder="الحساب الدائن"
          value={f.cA}
          disabled={locked}
          onChange={(e) => onField({ cA: e.target.value })}
        />
      </td>
      <td className="px-2 py-2 border border-slate-200 w-28">
        <input
          className={inputCls(filled && !grade.cAmtOk)}
          placeholder="المبلغ"
          dir="ltr"
          inputMode="decimal"
          value={f.cAmt}
          disabled={locked}
          onChange={(e) => onField({ cAmt: e.target.value })}
        />
      </td>
      <td className="px-2 py-2 text-center border border-slate-200">
        {locked ? (
          <div className="inline-flex items-center gap-1 text-emerald-600 font-bold">
            <IconCheckCircle size={18} /> صح
          </div>
        ) : fusses.length > 0 ? (
          <div className="text-red-500 text-xs text-right leading-tight max-w-[110px] mx-auto">
            {fusses.map((fu) => (
              <div key={fu}>- {fu}</div>
            ))}
          </div>
        ) : (
          <span className="text-slate-300">…</span>
        )}
      </td>
    </tr>
  )
}

/* ---------------------------------- step 2 ---------------------------------- */

function TrialBalanceStep({
  scenario,
  tb,
  setTb,
}: {
  scenario: Scenario
  tb: Record<string, TbFields>
  setTb: (v: Record<string, TbFields>) => void
}) {
  const ledger = computeLedger(scenario)
  const totalDr = ledger.reduce((s, r) => s + r.debitTotal, 0)
  const totalCr = ledger.reduce((s, r) => s + r.creditTotal, 0)
  const [hints, setHints] = useState(false)

  const drSum = ledger.reduce((s, r) => s + (parseAmountText(tb[r.account]?.debit ?? '0') ?? 0), 0)
  const crSum = ledger.reduce((s, r) => s + (parseAmountText(tb[r.account]?.credit ?? '0') ?? 0), 0)
  const done = drSum === totalDr && crSum === totalCr

  const rowFine = (r: (typeof ledger)[number]): boolean => {
    const f = tb[r.account]
    return (parseAmountText(f?.debit ?? '0') ?? 0) === r.debitTotal && (parseAmountText(f?.credit ?? '0') ?? 0) === r.creditTotal
  }

  const numCls = (fine: boolean) =>
    cn(
      'w-full px-2 py-1.5 rounded-lg border-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300',
      fine ? 'border-emerald-400 bg-emerald-50 text-emerald-900' : 'border-slate-200'
    )

  return (
    <Card className="border-slate-200 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <IconScale size={20} className="text-violet-700" />
          <h2 className="font-extrabold text-slate-900">ميزان المراجعة</h2>
        </div>
        <Badge color={done ? 'green' : 'slate'}>{done ? 'الميزان متزن' : 'لسه فيه غلطات'}</Badge>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-900 leading-relaxed flex gap-2">
        <IconLightbulb size={18} className="shrink-0 mt-0.5" />
        <p>
          ارحّل من دفتر اليومية: لكل حساب اكتب <b>مجموع ما يخصه من المدين والدائن</b>. الخلية اللي مالهاش حركة تسبها فاضية.
          في الآخر لازم مجموع المدين = مجموع الدائن.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[480px] border-collapse">
          <thead>
            <tr className="bg-slate-100 text-slate-600">
              <th className="px-2 py-2 text-right font-bold border border-slate-200">الحساب</th>
              <th className="px-2 py-2 text-right font-bold border border-slate-200">مدين</th>
              <th className="px-2 py-2 text-right font-bold border border-slate-200">دائن</th>
              <th className="px-2 py-2 text-center font-bold border border-slate-200">الحالة</th>
            </tr>
          </thead>
          <tbody>
            {ledger.map((r) => (
              <tr key={r.account} className={cn(rowFine(r) && 'bg-emerald-50/60')}>
                <td className="px-2 py-2 border border-slate-200 font-medium text-slate-800">{r.account}</td>
                <td className="px-2 py-2 border border-slate-200 w-36">
                  <input
                    className={numCls((parseAmountText(tb[r.account]?.debit ?? '0') ?? 0) === r.debitTotal)}
                    dir="ltr"
                    inputMode="decimal"
                    value={tb[r.account]?.debit ?? ''}
                    onChange={(e) => setTb({ ...tb, [r.account]: { debit: e.target.value, credit: tb[r.account]?.credit ?? '' } })}
                  />
                </td>
                <td className="px-2 py-2 border border-slate-200 w-36">
                  <input
                    className={numCls((parseAmountText(tb[r.account]?.credit ?? '0') ?? 0) === r.creditTotal)}
                    dir="ltr"
                    inputMode="decimal"
                    value={tb[r.account]?.credit ?? ''}
                    onChange={(e) => setTb({ ...tb, [r.account]: { credit: e.target.value, debit: tb[r.account]?.debit ?? '' } })}
                  />
                </td>
                <td className="px-2 py-2 border border-slate-200 text-center">
                  {rowFine(r) ? <IconCheckCircle size={18} className="inline text-emerald-600" /> : <span className="text-slate-300">…</span>}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50 font-bold text-slate-800">
              <td className="px-2 py-2 border border-slate-200">المجموع</td>
              <td className={cn('px-2 py-2 border border-slate-200', drSum === totalDr ? 'text-emerald-700' : 'text-red-500')}>
                <span dir="ltr">{drSum === totalDr ? formatAmount(drSum) : formatAmount(drSum) + ' / المطلوب ' + formatAmount(totalDr)}</span>
              </td>
              <td className={cn('px-2 py-2 border border-slate-200', crSum === totalCr ? 'text-emerald-700' : 'text-red-500')}>
                <span dir="ltr">{crSum === totalCr ? formatAmount(crSum) : formatAmount(crSum) + ' / المطلوب ' + formatAmount(totalCr)}</span>
              </td>
              <td className="px-2 py-2 border border-slate-200 text-center">
                {done ? <IconCheckCircle size={18} className="inline text-emerald-600" /> : <span className="text-slate-300">…</span>}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <Button variant="ghost" onClick={() => setHints((h) => !h)}>
        <IconEye size={16} /> {hints ? 'إخفاء الإجابات' : 'عرض الأرقام الصحيحة'}
      </Button>
      {hints && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          {ledger.map((r) => (
            <div key={r.account} className="bg-violet-50 border border-violet-200 rounded-lg px-3 py-2 text-violet-800">
              <b>{r.account}</b> — مدين {r.debitTotal > 0 ? formatAmount(r.debitTotal) : '—'} ، دائن{' '}
              {r.creditTotal > 0 ? formatAmount(r.creditTotal) : '—'}
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}

/* ---------------------------------- step 3 ---------------------------------- */

function IncomeStep({
  summary,
  inc,
  setInc,
}: {
  summary: ReturnType<typeof computeSummary>
  inc: { revenues: string; costs: string; expenses: string }
  setInc: (v: { revenues: string; costs: string; expenses: string }) => void
}) {
  const rev = parseAmountText(inc.revenues)
  const cost = parseAmountText(inc.costs)
  const exp = parseAmountText(inc.expenses)
  const hasAll = rev !== null && cost !== null && exp !== null
  const net = hasAll ? rev - cost - exp : null
  const revOk = rev === summary.totalRevenues
  const costOk = cost === summary.totalCosts
  const expOk = exp === summary.totalExpenses
  const netOk = net === summary.netProfit
  const done = revOk && costOk && expOk && netOk

  const Field = ({ label, items, value, ok, onChange, expected }: { label: string; items: { account: string; amount: number }[]; value: string; ok: boolean; onChange: (v: string) => void; expected: number }) => (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="font-bold text-slate-800 text-sm">{label}</label>
        {value.trim() !== '' && (
          <span className={cn('text-xs font-bold', ok ? 'text-emerald-600' : 'text-red-500')}>
            {ok ? 'صح' : 'مش صح'}
          </span>
        )}
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {items.map((it) => (
            <span key={it.account} className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded-md">
              {it.account} {formatAmount(it.amount)}
            </span>
          ))}
        </div>
      )}
      <input
        className={cn(
          'w-full px-3 py-2 rounded-xl border-2 text-lg font-bold focus:outline-none focus:ring-2 focus:ring-violet-300',
          value.trim() !== '' && ok ? 'border-emerald-400 bg-emerald-50 text-emerald-900' : 'border-slate-200'
        )}
        dir="ltr"
        inputMode="decimal"
        placeholder={formatAmount(expected)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )

  return (
    <Card className="border-slate-200 space-y-4">
      <div className="flex items-center gap-2">
        <IconChart size={20} className="text-violet-700" />
        <h2 className="font-extrabold text-slate-900">قائمة الدخل</h2>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-900 leading-relaxed flex gap-2">
        <IconLightbulb size={18} className="shrink-0 mt-0.5" />
        <p>
          اجمع من ميزان المراجعة: <b>الإيرادات − التكلفة − المصروفات = صافي الربح</b> (أو الخسارة لو الناتج بالسالب).
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="إجمالي الإيرادات" items={summary.revenues} value={inc.revenues} ok={revOk} onChange={(v) => setInc({ ...inc, revenues: v })} expected={summary.totalRevenues} />
        <Field label="تكلفة البضاعة المباعة" items={summary.costs} value={inc.costs} ok={costOk} onChange={(v) => setInc({ ...inc, costs: v })} expected={summary.totalCosts} />
        <Field label="المصروفات التشغيلية" items={summary.expenses} value={inc.expenses} ok={expOk} onChange={(v) => setInc({ ...inc, expenses: v })} expected={summary.totalExpenses} />
      </div>
      <div className={cn('rounded-2xl p-4 flex items-center justify-between', done ? 'bg-emerald-50 border-2 border-emerald-300' : 'bg-slate-50 border-2 border-slate-200')}>
        <div className="font-bold text-slate-700">صافي الربح / الخسارة</div>
        <div className="text-left">
          <div className={cn('text-2xl font-extrabold', done ? 'text-emerald-700' : 'text-slate-400')} dir="ltr">
            {net === null ? '—' : formatAmount(net)}
          </div>
          <div className="text-xs text-slate-500">المطلوب: {formatAmount(summary.netProfit)}</div>
        </div>
      </div>
    </Card>
  )
}

/* ---------------------------------- step 4 ---------------------------------- */

function BalanceSheetStep({
  summary,
  bs,
  setBs,
  onDone,
  done,
}: {
  summary: ReturnType<typeof computeSummary>
  bs: { assets: string; liabilities: string; equity: string }
  setBs: (v: { assets: string; liabilities: string; equity: string }) => void
  onDone: () => void
  done: boolean
}) {
  const a = parseAmountText(bs.assets)
  const l = parseAmountText(bs.liabilities)
  const e = parseAmountText(bs.equity)
  const filled = a !== null && l !== null && e !== null
  const equation = filled ? a === l + e : false
  const aOk = a === summary.totalAssets
  const lOk = l === summary.totalLiabilities
  const eOk = e === summary.equity
  const allOk = filled && aOk && lOk && eOk && equation

  const Cell = ({
    label,
    value,
    ok,
    onChange,
    hint,
  }: {
    label: string
    value: string
    ok: boolean
    onChange: (v: string) => void
    hint: string
  }) => (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <label className="font-bold text-slate-800 text-sm">{label}</label>
        {value.trim() !== '' && (
          <span className={cn('text-xs font-bold', ok ? 'text-emerald-600' : 'text-red-500')}>{ok ? 'صح' : 'مش صح'}</span>
        )}
      </div>
      <input
        className={cn(
          'w-full px-3 py-3 rounded-xl border-2 text-xl font-extrabold text-center focus:outline-none focus:ring-2 focus:ring-violet-300',
          value.trim() !== '' && ok ? 'border-emerald-400 bg-emerald-50 text-emerald-900' : 'border-slate-200'
        )}
        dir="ltr"
        inputMode="decimal"
        placeholder="–"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className="text-xs text-slate-500">{hint}</p>
    </div>
  )

  return (
    <Card className="border-slate-200 space-y-4">
      <div className="flex items-center gap-2">
        <IconLandmark size={20} className="text-violet-700" />
        <h2 className="font-extrabold text-slate-900">الميزانية العمومية</h2>
      </div>
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-sm text-amber-900 leading-relaxed flex gap-2">
        <IconLightbulb size={18} className="shrink-0 mt-0.5" />
        <p>
          إيه اللي بيموّل أصول الشركة؟ <b>الأصول = الخصوم + حقوق الملكية</b>. ولحساب حقوق الملكية: رأس المال + صافي الربح − المسحوبات.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Cell
          label="إجمالي الأصول"
          value={bs.assets}
          ok={aOk}
          onChange={(v) => setBs({ ...bs, assets: v })}
          hint={summary.assets.map((it) => it.account).join(' + ')}
        />
        <Cell
          label="إجمالي الخصوم"
          value={bs.liabilities}
          ok={lOk}
          onChange={(v) => setBs({ ...bs, liabilities: v })}
          hint={summary.liabilities.length ? summary.liabilities.map((it) => it.account).join(' + ') : 'مفيش ديون — صفر'}
        />
        <Cell
          label="حقوق الملكية"
          value={bs.equity}
          ok={eOk}
          onChange={(v) => setBs({ ...bs, equity: v })}
          hint={summary.equityItems.map((it) => it.account).join(' + ') + ' + صافي الربح − المسحوبات'}
        />
      </div>

      <div className={cn('rounded-2xl p-4 flex flex-col items-center gap-1', equation ? 'bg-emerald-50 border-2 border-emerald-300' : 'bg-slate-50 border-2 border-slate-200')}>
        <div className="font-extrabold text-slate-700">معادلة الميزانية</div>
        <div className="text-lg font-bold text-slate-600" dir="ltr">
          {a ?? '—'} = {l ?? '—'} + {e ?? '—'}
        </div>
        <div className="text-xs text-slate-500">
          {filled && (equation ? 'المعادلة متحققّت — أصل = خصوم + ملكية' : 'المعادلة مش متحققّة — راجع الأرقام')}
        </div>
      </div>

      {!done && allOk && (
        <Button variant="success" className="w-full" onClick={onDone}>
          <IconCheckCircle size={18} /> تمّت المهمة! سجّل الإنجاز
        </Button>
      )}
    </Card>
  )
}