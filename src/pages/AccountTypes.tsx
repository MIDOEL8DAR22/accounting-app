import { useState } from 'react'
import type { FC } from 'react'
import { Card, Button, Badge, DifficultyStars } from '../components/ui'
import { ACCOUNT_TYPES, TYPE_BG, getAccountType } from '../data/accountTypes'
import { TYPE_ORDER, TYPE_PRACTICE, MIXED_QUESTIONS, DIFFICULTY_LABELS, mixedOrder, type PracticeQuestion } from '../data/accountPractice'
import { getProgress, recordExercise, completeAccountType, completeAccountMixed } from '../lib/progress'
import type { AccountType } from '../types'
import { cn } from '../lib/cn'
import { IconWallet, IconCoins, IconFileText, IconLandmark, IconChartUp, IconCheck, IconCheckCircle, IconKey, IconRocket, IconXCircle, IconArrowRight, IconRefresh, IconTarget, IconChartDown } from '../components/icons'

const TYPE_ICONS: Record<AccountType, FC<{ size?: number; className?: string }>> = {
  asset: IconWallet,
  expense: IconCoins,
  liability: IconFileText,
  equity: IconLandmark,
  revenue: IconChartUp,
}

type Stage = { kind: 'type'; type: AccountType } | { kind: 'mixed' }

interface Session {
  stage: Stage
  questions: PracticeQuestion[]
  index: number
  chosen: number | null
  score: number
  done: boolean
}

const typeName = (t: AccountType) => getAccountType(t).nameAr

export function AccountTypes() {
  const [selected, setSelected] = useState<AccountType | null>(null)
  const [session, setSession] = useState<Session | null>(null)

  const progress = getProgress()
  const completedTypes = progress.accountTypesCompleted
  const isTypeDone = (t: AccountType) => completedTypes.includes(t)
  const isMixedDone = progress.accountMixedCompleted
  const typesDoneCount = TYPE_ORDER.filter(isTypeDone).length
  const mixedUnlocked = typesDoneCount === TYPE_ORDER.length

  const active = selected ? ACCOUNT_TYPES.find((t) => t.type === selected) : null

  const startStage = (stage: Stage) => {
    const questions = stage.kind === 'mixed' ? mixedOrder() : TYPE_PRACTICE[stage.type]
    setSession({ stage, questions, index: 0, chosen: null, score: 0, done: false })
  }

  const answer = (i: number) => {
    if (!session || session.chosen !== null) return
    const q = session.questions[session.index]
    const resultCorrect = i === q.correctIndex
    setSession({
      ...session,
      chosen: i,
      score: resultCorrect ? session.score + 1 : session.score,
    })
    const topic = session.stage.kind === 'mixed' ? 'أنواع الحسابات' : getAccountType(session.stage.type).nameAr
    recordExercise(q.id, resultCorrect, topic)
    if (session.index === session.questions.length - 1) {
      if (session.stage.kind === 'type') completeAccountType(session.stage.type)
      else completeAccountMixed()
    }
  }

  const nextQuestion = () => {
    if (!session) return
    if (session.index < session.questions.length - 1) {
      setSession({ ...session, index: session.index + 1, chosen: null })
    } else {
      setSession({ ...session, done: true })
    }
  }

  const current = session ? session.questions[session.index] : null
  const qProgress = session ? Math.round(((session.index + 1) / session.questions.length) * 100) : 0

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 sm:text-2xl">أنواع الحسابات الخمسة</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          اتعلم كل نوع لحاله، و لما تخلص الخمسة ابدأ الأسئلة المختلطة اللي صعوبتها بتزيد مع الوقت
        </p>
      </div>

      {/* ============ practice section ============ */}
      <Card className="space-y-4">
        {!session ? (
          <>
            <div>
              <h2 className="flex items-center gap-2 text-lg font-extrabold text-slate-800 dark:text-slate-100">
                <IconTarget size={18} className="text-blue-600 dark:text-blue-400" />
                تدرب على الأنواع
              </h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                اختر مرحلة — ستة أسئلة لكل نوع، والمرحلة اللي بعدها بتفتح باب لما تحل اللي قبلها
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {TYPE_ORDER.map((t, i) => {
                const done = isTypeDone(t)
                const unlocked = i === 0 || isTypeDone(TYPE_ORDER[i - 1])
                const Icon = TYPE_ICONS[t]
                const practices = TYPE_PRACTICE[t]
                return (
                  <button
                    key={t}
                    disabled={!unlocked}
                    onClick={() => startStage({ kind: 'type', type: t })}
                    className={cn(
                      'rounded-xl border-2 p-3 text-right transition',
                      !unlocked
                        ? 'cursor-not-allowed border-slate-100 bg-slate-50 opacity-70 dark:border-slate-800 dark:bg-slate-900'
                        : done
                          ? cn(TYPE_BG[t], 'shadow-sm')
                          : 'border-slate-200 bg-white hover:border-blue-300 dark:border-slate-700 dark:bg-slate-800/60'
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl', done ? 'bg-white/70 dark:bg-slate-900/40' : 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300')}>
                        <Icon size={22} />
                      </span>
                      {done ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                          <IconCheck size={12} /> خلصتها
                        </span>
                      ) : !unlocked ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400">
                          <IconKey size={12} /> مقفولة
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-bold text-blue-700 dark:text-blue-300">
                          ابدأ هنا
                        </span>
                      )}
                    </div>
                    <div className="mt-2 text-sm font-extrabold text-slate-800 dark:text-slate-100">{typeName(t)}</div>
                    <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{practices.length} أسئلة</div>
                    {!unlocked && (
                      <div className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">خلص مرحلة «{typeName(TYPE_ORDER[i - 1])}» الأول</div>
                    )}
                  </button>
                )
              })}

              <button
                disabled={!mixedUnlocked}
                onClick={() => startStage({ kind: 'mixed' })}
                className={cn(
                  'rounded-xl border-2 border-dashed p-3 text-right transition',
                  mixedUnlocked
                    ? 'border-blue-300 bg-gradient-to-l from-blue-50 to-violet-50 hover:border-blue-400 dark:border-blue-500/40 dark:from-blue-500/10 dark:to-violet-500/10'
                    : 'cursor-not-allowed border-slate-100 bg-slate-50 opacity-70 dark:border-slate-800 dark:bg-slate-900'
                )}
              >
                <div className="flex items-center justify-between">
                  <span className={cn('flex h-10 w-10 items-center justify-center rounded-xl', mixedUnlocked ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'bg-slate-200 text-slate-500 dark:bg-slate-700')}>
                    <IconRocket size={22} />
                  </span>
                  {isMixedDone ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                      <IconCheck size={12} /> خلصتها
                    </span>
                  ) : mixedUnlocked ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-500/10 px-2 py-0.5 text-[11px] font-bold text-blue-700 dark:text-blue-300">
                      ابدأ هنا
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-400">
                      <IconKey size={12} /> مقفولة
                    </span>
                  )}
                </div>
                <div className="mt-2 text-sm font-extrabold text-slate-800 dark:text-slate-100">أسئلة مختلطة</div>
                <div className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">{MIXED_QUESTIONS.length} سؤال — صعوبتها بتزيد تدريجيًا</div>
                {!mixedUnlocked && (
                  <div className="mt-1 text-[11px] text-slate-400 dark:text-slate-500">خلص الأنواع الخمسة الأول</div>
                )}
              </button>
            </div>
          </>
        ) : (
          <>
            {/* session header */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {session.stage.kind === 'type' ? (
                  <>
                    {(() => {
                      const Icon = TYPE_ICONS[session.stage.type]
                      return <Icon size={20} className="text-slate-600 dark:text-slate-300" />
                    })()}
                    <div className="text-base font-extrabold text-slate-800 dark:text-slate-100">
                      تدريب: {typeName(session.stage.type)}
                    </div>
                  </>
                ) : (
                  <>
                    <IconRocket size={20} className="text-blue-600 dark:text-blue-400" />
                    <div className="text-base font-extrabold text-slate-800 dark:text-slate-100">أسئلة مختلطة</div>
                  </>
                )}
              </div>
              <Button variant="ghost" onClick={() => setSession(null)}><IconArrowRight size={14} /> الخروج</Button>
            </div>

            {!current ? null : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
                    <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${qProgress}%` }} />
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    {session.index + 1}/{session.questions.length}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Badge color={current.type ? (TYPE_ORDER.indexOf(current.type) === 0 ? 'blue' : TYPE_ORDER.indexOf(current.type) === 1 ? 'red' : TYPE_ORDER.indexOf(current.type) === 2 ? 'green' : TYPE_ORDER.indexOf(current.type) === 3 ? 'purple' : 'amber') : 'slate'}>
                    {current.type ? typeName(current.type) : 'مختلط'}
                  </Badge>
                  <DifficultyStars level={current.difficulty} />
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {DIFFICULTY_LABELS[current.difficulty - 1]}
                  </span>
                </div>

                <div className="text-lg font-bold leading-relaxed text-slate-800 dark:text-slate-100">
                  {current.question}
                </div>

                <div className="space-y-2">
                  {current.options.map((opt, i) => {
                    const isChosen = session.chosen === i
                    const isCorrect = i === current.correctIndex
                    const answered = session.chosen !== null
                    return (
                      <button
                        key={i}
                        disabled={answered}
                        onClick={() => answer(i)}
                        className={cn(
                          'block w-full rounded-xl border-2 p-3 text-right text-sm font-semibold transition',
                          answered && isCorrect
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300'
                            : answered && isChosen && !isCorrect
                              ? 'border-rose-500 bg-rose-50 text-rose-800 dark:bg-rose-500/10 dark:text-rose-300'
                              : isChosen
                                ? 'border-blue-500 bg-blue-50 text-blue-800 dark:bg-blue-500/10 dark:text-blue-300'
                                : 'border-slate-200 bg-white hover:border-blue-300 dark:border-slate-700 dark:bg-slate-800'
                        )}
                      >
                        <span className="inline-flex items-center gap-1.5">
                          {answered && isCorrect && <IconCheck size={15} className="text-emerald-500" />}
                          {answered && isChosen && !isCorrect && <IconXCircle size={15} className="text-rose-500" />}
                          {opt}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {session.chosen !== null && (
                  <div className={cn(
                    'rounded-xl border p-4 text-sm animate-fade-in-up',
                    session.chosen === current.correctIndex
                      ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10'
                      : 'border-rose-200 bg-rose-50 dark:border-rose-500/30 dark:bg-rose-500/10'
                  )}>
                    <div className="mb-1 flex items-center gap-1.5 font-extrabold">
                      {session.chosen === current.correctIndex
                        ? (<><IconCheckCircle size={16} className="text-emerald-500" /> ممتاز! صح</>)
                        : (<><IconXCircle size={16} className="text-rose-500" /> غلط — الصح «{current.options[current.correctIndex]}»</>)}
                    </div>
                    <div className="text-slate-700 dark:text-slate-200">{current.explanation}</div>
                    <Button onClick={nextQuestion} className="mt-3">
                      {session.index < session.questions.length - 1 ? 'السؤال اللي بعده' : 'شوف النتيجة'}
                    </Button>
                  </div>
                )}
              </div>
            )}

            {session.done && (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center dark:border-slate-700 dark:bg-slate-900">
                <IconCheckCircle size={34} className={cn('mx-auto', session.score === session.questions.length ? 'text-emerald-500' : session.score >= session.questions.length / 2 ? 'text-blue-500' : 'text-amber-500')} />
                <div className="mt-2 text-lg font-extrabold text-slate-800 dark:text-slate-100">
                  {session.score === session.questions.length ? 'فل كامل! إنت بقت محترف' : session.score >= session.questions.length / 2 ? 'أداء حلو — كمل' : 'حاول تاني وهتوصل'} {session.score}/{session.questions.length}
                </div>
                <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {session.stage.kind === 'mixed' ? 'خلصت الأسئلة المختلطة — جاهز للمرحلة اللي بعدها' : 'خلصت مرحلة هذا النوع — اتفتح لك المرحلة اللي بعده'}
                </div>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  <Button variant="secondary" onClick={() => startStage(session.stage)}><IconRefresh size={15} /> أعد نفس المرحلة</Button>
                  {session.stage.kind === 'type' && (() => {
                    const idx = TYPE_ORDER.indexOf(session.stage.type)
                    const nextType = TYPE_ORDER[idx + 1]
                    if (nextType) {
                      return <Button onClick={() => startStage({ kind: 'type', type: nextType })}>كمل: {typeName(nextType)}</Button>
                    }
                    if (!isMixedDone) {
                      return <Button onClick={() => startStage({ kind: 'mixed' })}><IconRocket size={15} /> ابدأ الأسئلة المختلطة</Button>
                    }
                    return <Button variant="ghost" onClick={() => setSession(null)}><IconArrowRight size={15} /> رجوع</Button>
                  })()}
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* ============ reference section ============ */}
      <div className="flex flex-wrap gap-3">
        {ACCOUNT_TYPES.map((t) => {
          const Icon = TYPE_ICONS[t.type]
          return (
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
              <div className="mx-auto mb-1 text-slate-600 dark:text-slate-300">
                <Icon size={24} />
              </div>
              <div className="text-sm font-extrabold text-slate-800 dark:text-slate-100">{t.nameAr}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 lang-en">{t.nameEn}</div>
              <Badge color={t.type === 'asset' ? 'blue' : t.type === 'expense' ? 'red' : t.type === 'liability' ? 'green' : t.type === 'equity' ? 'purple' : 'amber'} className="mt-2">
                طبيعته: {t.normalSide === 'debit' ? 'مدين' : 'دائن'}
              </Badge>
            </button>
          )
        })}
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
              <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                <IconChartUp size={13} /> عند الزيادة
              </div>
              <div className="text-lg font-extrabold text-emerald-800 dark:text-emerald-200">
                {active.increaseSide === 'debit' ? 'مدين' : 'دائن'}
              </div>
            </div>
            <div className="rounded-xl border border-orange-200 bg-orange-50 p-3 dark:border-orange-500/30 dark:bg-orange-500/10">
              <div className="flex items-center gap-1 text-xs font-bold text-orange-600 dark:text-orange-400">
                <IconChartDown size={13} /> عند النقص
              </div>
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
        </Card>
      )}
    </div>
  )
}