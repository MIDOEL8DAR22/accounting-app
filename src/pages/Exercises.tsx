import { useState, useMemo } from 'react'
import { Card, Button, Badge, DifficultyStars } from '../components/ui'
import { EXERCISES, EXERCISE_LEVELS, LEVEL_LABELS, LEVEL_UNLOCK } from '../data/exercises'
import { LESSONS } from '../data/stages'
import { getProgress, recordExercise } from '../lib/progress'
import type { Exercise, ExerciseEntry } from '../types'
import { cn } from '../lib/cn'
import {
  IconPen,
  IconRocket,
  IconRefresh,
  IconCheck,
  IconXCircle,
  IconArrowRight,
  IconArrowLeft,
  IconCheckCircle,
  IconKey,
  IconScale,
  IconLightbulb,
  IconEye,
} from '../components/icons'

const DIFFICULTY_LABELS = ['مبتدئ', 'سهل', 'متوسط', 'متقدم', 'تحدّي']

const lessonTitle = (id: string) => LESSONS.find((l) => l.id === id)?.title ?? id

const isLevelUnlocked = (level: string, completedLessons: string[]) =>
  (LEVEL_UNLOCK[level] ?? []).every((id) => completedLessons.includes(id))

const getKind = (e: Exercise): 'mc' | 'text' | 'entry' => e.kind ?? (e.options ? 'mc' : 'text')

/* ---------- entry helpers ---------- */

const norm = (s: string) =>
  s
    .replace(/حـ/g, '')
    .replace(/[^\u0621-\u064A\u0660-\u0669A-Za-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase()

const ACCOUNT_ALIASES: Record<string, string[]> = {
  'الصندوق': ['النقدية', 'نقدية', 'الخزينة'],
  'المدينون': ['العملاء', 'العميل', 'المدينين'],
  'الدائنون': ['الموردون', 'المورد', 'الدائنين'],
  'مردودات المشتريات': ['مرتجعات المشتريات', 'مردودات', 'مرتجعات'],
  'رأس المال': ['راس المال', 'رأس مال'],
  'مصروفات مقدمة': ['مصروفات مدفوعة مقدما', 'مصروف الإيجار المقدم', 'الإيجار المقدم', 'إيجار مدفوع مقدم'],
  'تأمينات لدى الغير': ['تأمين لدى الغير', 'التأمين المدفوع'],
  'تأمينات لدى الشركة': ['تأمين لدى الشركة', 'التأمين المستلم'],
}

const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩'

const parseAmount = (s: string): number | null => {
  const normalized = String(s).replace(/[\u0660-\u0669]/g, (d) => String(ARABIC_DIGITS.indexOf(d)))
  const m = normalized.match(/\d[\d.,]*/)
  return m ? parseFloat(m[0].replace(/,/g, '')) : null
}

const acctMatch = (user: string, expected: string) => {
  const u = norm(user)
  const e = norm(expected)
  if (!u || !e) return false
  if (u === e) return true
  if (ACCOUNT_ALIASES[expected]?.some((a) => norm(a) === u)) return true
  if (u.length >= 3 && (u.includes(e) || e.includes(u))) return true
  return false
}

const amountEqual = (a: string, b: string) => {
  const na = parseAmount(a)
  const nb = parseAmount(b)
  return na !== null && nb !== null && na === nb
}

interface EntryFields {
  dA: string
  dAmt: string
  cA: string
  cAmt: string
}

function gradeEntry(entry: ExerciseEntry, f: EntryFields) {
  const dAccOk = acctMatch(f.dA, entry.debit.account)
  const dAmtOk = amountEqual(f.dAmt, entry.debit.amount)
  const cAccOk = acctMatch(f.cA, entry.credit.account)
  const cAmtOk = amountEqual(f.cAmt, entry.credit.amount)
  const balanced = amountEqual(f.dAmt, f.cAmt)
  const correct = dAccOk && dAmtOk && cAccOk && cAmtOk && balanced
  return { dAccOk, dAmtOk, cAccOk, cAmtOk, balanced, correct }
}

const EMPTY_ENTRY: EntryFields = { dA: '', dAmt: '', cA: '', cAmt: '' }

/* ---------- text scoring ---------- */

const wordMatches = (word: string, expected: string) => {
  const e = norm(expected)
  if (!word || !e) return false
  if (word === e) return true
  if (word.length >= 2 && (e.includes(word) || word.includes(e))) return true
  return false
}

function textScore(userRaw: string, correctAnswer: string[]) {
  const words = userRaw.split(/[,،]/).map(norm).filter(Boolean)
  const matched = correctAnswer.filter((c) => words.some((w) => wordMatches(w, c)))
  return { correct: correctAnswer.length > 0 && matched.length === correctAnswer.length, words, matchedCount: matched.length }
}

function textDiagnose(userRaw: string, correctAnswer: string[]) {
  const words = userRaw.split(/[,،]/).map(norm).filter(Boolean)
  const missing = correctAnswer.filter((c) => !words.some((w) => wordMatches(w, c)))
  const extras = [...new Set(words.filter((w) => w.length >= 2 && !correctAnswer.some((c) => wordMatches(w, c))))]
  return { missing, extras }
}

/* ---------- level badge colors ---------- */

const badgeColor = (level: string) =>
  level === 'A' || level === 'J' ? 'blue' : level === 'E' || level === 'H' || level === 'I' ? 'green' : level === 'B' || level === 'C' || level === 'D' ? 'slate' : 'purple'

export function Exercises() {
  const [selectedLevels, setSelectedLevels] = useState<string[]>(() => {
    const completed = getProgress().completedLessons ?? []
    return EXERCISE_LEVELS.filter((l) => isLevelUnlocked(l, completed))
  })
  const [pool, setPool] = useState<Exercise[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, { answered: boolean; correct: boolean | null }>>({})
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [entryField, setEntryField] = useState<EntryFields>(EMPTY_ENTRY)
  const [filterTopic, setFilterTopic] = useState('all')
  const [filterDifficulty, setFilterDifficulty] = useState(0)

  const completed = getProgress().completedLessons ?? []
  const unlockedCount = EXERCISE_LEVELS.filter((l) => isLevelUnlocked(l, completed)).length

  const current = pool[currentIndex]
  const currentAnswer = current ? answers[current.id] : null
  const kind = current ? getKind(current) : 'mc'

  const allTopics = useMemo(() => {
    const topics = new Set(EXERCISES.map((e) => e.topic))
    return ['all', ...Array.from(topics)]
  }, [])

  const buildPool = (levels: string[], topic: string, difficulty: number) =>
    EXERCISES.filter((e) => {
      if (!levels.includes(e.level)) return false
      if (topic !== 'all' && e.topic !== topic) return false
      if (difficulty > 0 && e.difficulty !== difficulty) return false
      return true
    })

  const availableCount = buildPool(selectedLevels, filterTopic, filterDifficulty).length

  const toggleLevel = (l: string) => {
    setSelectedLevels((prev) => (prev.includes(l) ? prev.filter((x) => x !== l) : [...prev, l]))
  }

  const resetFields = () => {
    setSelectedOption(null)
    setShowExplanation(false)
    setShowHint(false)
    setEntryField(EMPTY_ENTRY)
  }

  const handleStart = () => {
    const poolToUse = buildPool(selectedLevels, filterTopic, filterDifficulty)
    const shuffled = [...poolToUse].sort(() => Math.random() - 0.5).slice(0, 20)
    setPool(shuffled.length > 0 ? shuffled : EXERCISES.filter((e) => e.level === 'A').slice(0, 10))
    setCurrentIndex(0)
    setAnswers({})
    resetFields()
  }

  const handleMcAnswer = (answer: string) => {
    if (!current || currentAnswer?.answered) return
    setSelectedOption(answer)
    setShowExplanation(true)
    const correct = current.correctIndex !== undefined && current.options ? current.options[current.correctIndex] === answer : false
    setAnswers((prev) => ({ ...prev, [current.id]: { answered: true, correct } }))
    recordExercise(current.id, correct, current.topic)
  }

  const handleTextAnswer = () => {
    if (!current || currentAnswer?.answered) return
    const answer = selectedOption ?? ''
    setShowExplanation(true)
    const { correct } = textScore(answer, current.correctAnswer ?? [])
    setAnswers((prev) => ({ ...prev, [current.id]: { answered: true, correct } }))
    recordExercise(current.id, correct, current.topic)
  }

  const handleEntryAnswer = () => {
    if (!current || currentAnswer?.answered || !current.entry) return
    setShowExplanation(true)
    const verdict = gradeEntry(current.entry, entryField)
    setAnswers((prev) => ({ ...prev, [current.id]: { answered: true, correct: verdict.correct } }))
    recordExercise(current.id, verdict.correct, current.topic)
  }

  const goNext = () => {
    if (currentIndex < pool.length - 1) {
      setCurrentIndex(currentIndex + 1)
      resetFields()
    }
  }

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      resetFields()
    }
  }

  const correctCount = Object.values(answers).filter((a) => a.correct === true).length
  const totalAnswered = Object.values(answers).filter((a) => a.answered).length

  /* ---------- setup screen ---------- */

  if (pool.length === 0 || !current) {
    return (
      <div className="space-y-6">
        <h1 className="flex items-center gap-2 text-xl font-extrabold text-slate-800 dark:text-slate-100">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"><IconPen size={18} /></span>
          تمارين تفاعلية
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">حل أسئلة مراحل مترتبة — أفتح مرحلة جديدة لما تكمل الدروس المطلوبة في «تقدمك».</p>

        <Card className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-600 dark:text-slate-300">الموضوع</label>
              <select
                value={filterTopic}
                onChange={(e) => setFilterTopic(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
              >
                <option value="all">الكل</option>
                {allTopics.slice(1).map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-slate-600 dark:text-slate-300">الصعوبة</label>
              <select
                value={filterDifficulty}
                onChange={(e) => setFilterDifficulty(parseInt(e.target.value))}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
              >
                <option value={0}>الكل</option>
                {DIFFICULTY_LABELS.map((d, i) => (
                  <option key={i} value={i + 1}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-300">المراحل</label>
              <span className="text-xs text-slate-500 dark:text-slate-400">المفتوحة: {unlockedCount} من {EXERCISE_LEVELS.length}</span>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {EXERCISE_LEVELS.map((l) => {
                const unlocked = isLevelUnlocked(l, completed)
                const active = selectedLevels.includes(l)
                const lockedBy = LEVEL_UNLOCK[l]?.[0]
                return (
                  <button
                    key={l}
                    disabled={!unlocked}
                    onClick={() => toggleLevel(l)}
                    className={cn(
                      'flex items-center gap-2 rounded-xl border-2 p-3 text-right transition',
                      !unlocked
                        ? 'cursor-not-allowed border-slate-100 bg-slate-50 opacity-60 dark:border-slate-800 dark:bg-slate-900'
                        : active
                          ? 'border-blue-500 bg-blue-50 text-blue-800 dark:bg-blue-500/10 dark:text-blue-300'
                          : 'border-slate-200 bg-white hover:border-blue-300 dark:border-slate-700 dark:bg-slate-800'
                    )}
                  >
                    <span className={cn('flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm font-extrabold', unlocked ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300' : 'bg-slate-200 text-slate-500 dark:bg-slate-700')}>
                      {l}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block truncate text-sm font-bold">{LEVEL_LABELS[l]}</span>
                      {!unlocked && (
                        <span className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-slate-500">
                          <IconKey size={12} /> مقفولة — كمل الدرس «{lessonTitle(lockedBy)}» الأول
                        </span>
                      )}
                    </span>
                    {unlocked && (
                      <span className={cn('flex h-5 w-5 shrink-0 items-center justify-center rounded-full', active ? 'bg-blue-500 text-white' : 'bg-slate-200 text-transparent dark:bg-slate-700')}>
                        <IconCheck size={12} />
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <Button
            onClick={handleStart}
            disabled={availableCount === 0}
            className="w-full"
          >
            <IconRocket size={15} /> ابدأ التمرين ({availableCount} سؤال)
          </Button>
        </Card>
      </div>
    )
  }

  const progress = Math.round(((currentIndex + 1) / pool.length) * 100)
  const entry = current.kind === 'entry' || (!current.options && current.entry) ? current.entry : undefined
  const verdict = entry && currentAnswer?.answered ? gradeEntry(entry, entryField) : null
  const dNum = parseAmount(entryField.dAmt)
  const cNum = parseAmount(entryField.cAmt)
  const liveBalanced = dNum !== null && cNum !== null && dNum === cNum

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"><IconPen size={18} /></span>
          </h1>
          <div className="flex flex-wrap items-center gap-1.5">
            {[...new Set(pool.map((e) => e.level))].slice(0, 4).map((lv) => (
              <Badge key={lv} color={badgeColor(lv)}>{LEVEL_LABELS[lv]}</Badge>
            ))}
          </div>
        </div>
        <Button variant="ghost" onClick={handleStart}><IconRefresh size={14} /> تمرين جديد</Button>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
          <div className="h-full rounded-full bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
        </div>
        <span className="text-xs font-bold text-slate-500">
          {currentIndex + 1}/{pool.length}
        </span>
      </div>

      <Card className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge color={badgeColor(current.level)}>{LEVEL_LABELS[current.level] || current.level}</Badge>
          <DifficultyStars level={current.difficulty} />
          <span className="text-xs text-slate-500 dark:text-slate-400">{current.topic}</span>
        </div>

        <div className="text-base font-bold text-slate-800 dark:text-slate-100 leading-relaxed">
          {current.question}
        </div>

        {/* MC */}
        {kind === 'mc' && current.options && (
          <div className="space-y-2">
            {current.options.map((opt) => {
              const isSelected = selectedOption === opt
              const isCorrectOption = current.correctIndex !== undefined && current.options![current.correctIndex] === opt
              const answered = currentAnswer?.answered
              return (
                <button
                  key={opt}
                  disabled={answered}
                  onClick={() => handleMcAnswer(opt)}
                  className={cn(
                    'block w-full rounded-xl border-2 p-3 text-right text-sm font-semibold transition',
                    answered && isCorrectOption
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300'
                      : answered && isSelected && !isCorrectOption
                        ? 'border-rose-500 bg-rose-50 text-rose-800 dark:bg-rose-500/10 dark:text-rose-300'
                        : isSelected
                          ? 'border-blue-500 bg-blue-50 text-blue-800 dark:bg-blue-500/10 dark:text-blue-300'
                          : 'border-slate-200 bg-white hover:border-blue-300 dark:border-slate-700 dark:bg-slate-800'
                  )}
                >
                  <span className="inline-flex items-center gap-1.5">
                    {answered && isCorrectOption && <IconCheck size={15} className="text-emerald-500" />}
                    {answered && isSelected && !isCorrectOption && <IconXCircle size={15} className="text-rose-500" />}
                    {opt}
                  </span>
                </button>
              )
            })}
          </div>
        )}

        {/* text input (اكتب الحسابات) */}
        {kind === 'text' && (
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400">اكتب الحسابات المتأثرة (افصل بينهم بفاصلة):</label>
            <input
              type="text"
              value={selectedOption ?? ''}
              onChange={(e) => setSelectedOption(e.target.value)}
              disabled={currentAnswer?.answered}
              placeholder="مثال: الموردون، النقدية"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
            {!currentAnswer?.answered && (
              <Button onClick={handleTextAnswer}>تأكيد</Button>
            )}

            {currentAnswer?.answered && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-700 dark:bg-slate-900">
                <div className="font-bold text-slate-600 dark:text-slate-300">إجابتك:</div>
                <div className={cn('mt-1 rounded-lg bg-white p-2 font-mono text-xs dark:bg-slate-800', !selectedOption && 'text-slate-300 dark:text-slate-600')}>
                  {selectedOption?.trim() || 'ما كتبتش حاجة'}
                </div>
                {currentAnswer.correct === false && (
                  <>
                    <div className="mt-3 font-bold text-emerald-700 dark:text-emerald-400">الإجابة الصحيحة:</div>
                    <div className="mt-1 rounded-lg bg-emerald-50 p-2 text-xs font-semibold text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-300">
                      {current.correctAnswer?.join(' ، ') ?? ''}
                    </div>
                    {(() => {
                      const { missing, extras } = textDiagnose(selectedOption ?? '', current.correctAnswer ?? [])
                      return (
                        <div className="mt-3 space-y-1 text-xs">
                          {missing.length > 0 && (
                            <div className="text-rose-600 dark:text-rose-400">
                              غلطتي فين؟ نسيت تكتب: <b>{missing.join(' ، ')}</b>
                            </div>
                          )}
                          {extras.length > 0 && (
                            <div className="text-amber-600 dark:text-amber-400">
                              كلمات مش مطلوبة هنا: <b>{extras.join(' ، ')}</b>
                            </div>
                          )}
                          {missing.length === 0 && extras.length === 0 && (
                            <div className="text-rose-600 dark:text-rose-400">الإجابة ناقصة أو مش كاملة — ركّز على الحسابات اللي أثرت في العملية كلها.</div>
                          )}
                        </div>
                      )
                    })()}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* entry builder (اكتب القيد) */}
        {kind === 'entry' && entry && (
          <div className="space-y-3">
            {!currentAnswer?.answered && (
              <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-extrabold text-slate-500 dark:text-slate-400">اكتب القيد بنفسك — خطوة بخطوة</div>
                  <span className={cn(
                    'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-bold',
                    liveBalanced ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400' : 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400'
                  )}>
                    <IconScale size={12} /> {liveBalanced ? 'ميزان القيد سليم' : 'مش متوازن بعد'}
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-blue-600 dark:text-blue-400">من حـ/ — حساب مدين</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={entryField.dA}
                        onChange={(e) => setEntryField({ ...entryField, dA: e.target.value })}
                        placeholder="الحساب المدين"
                        className="w-full min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                      />
                      <input
                        type="text"
                        inputMode="numeric"
                        value={entryField.dAmt}
                        onChange={(e) => setEntryField({ ...entryField, dAmt: e.target.value })}
                        placeholder="المبلغ"
                        className="w-24 rounded-xl border border-slate-300 bg-white px-2 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-rose-600 dark:text-rose-400">إلى حـ/ — حساب دائن</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={entryField.cA}
                        onChange={(e) => setEntryField({ ...entryField, cA: e.target.value })}
                        placeholder="الحساب الدائن"
                        className="w-full min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                      />
                      <input
                        type="text"
                        inputMode="numeric"
                        value={entryField.cAmt}
                        onChange={(e) => setEntryField({ ...entryField, cAmt: e.target.value })}
                        placeholder="المبلغ"
                        className="w-24 rounded-xl border border-slate-300 bg-white px-2 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-3 text-sm dark:border-slate-700 dark:bg-slate-900">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400"><IconEye size={13} /> معاينة القيد</div>
                  {entryField.dA || entryField.dAmt || entryField.cA || entryField.cAmt ? (
                    <div className="mt-1 font-semibold text-slate-700 dark:text-slate-200">
                      <span>من حـ/ {entryField.dA || '؟'} {entryField.dAmt && `مبلغ ${entryField.dAmt}`}</span>
                      <span className="mx-2 text-slate-300">•</span>
                      <span>إلى حـ/ {entryField.cA || '؟'} {entryField.cAmt && `مبلغ ${entryField.cAmt}`}</span>
                    </div>
                  ) : (
                    <div className="mt-1 text-xs text-slate-400">اكتب الحسابات والمبالغ عشان تشوف القيد بيتجمع قدامك</div>
                  )}
                </div>

                {entry.hint && (
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400"
                  >
                    <IconLightbulb size={13} /> دليل سريع
                  </button>
                )}
                {showHint && entry.hint && (
                  <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-xs text-blue-800 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-300">
                    {entry.hint}
                  </div>
                )}

                {!currentAnswer?.answered && (
                  <Button onClick={handleEntryAnswer} className="w-full">تأكيد القيد</Button>
                )}
              </div>
            )}

            {currentAnswer?.answered && verdict && (
              <div className={cn(
                'rounded-xl border p-4 text-sm animate-fade-in-up',
                verdict.correct
                  ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10'
                  : 'border-rose-200 bg-rose-50 dark:border-rose-500/30 dark:bg-rose-500/10'
              )}>
                <div className="mb-2 flex items-center gap-1.5 font-extrabold">
                  {verdict.correct
                    ? (<><IconCheckCircle size={16} className="text-emerald-500" /> ممتاز! قيدك صحيح ومتوازن</>)
                    : (<><IconXCircle size={16} className="text-rose-500" /> مش مظبوط — نشوف غلطتك فين</>)}
                </div>

                {!verdict.correct && (
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="rounded-lg border border-blue-200 bg-white p-3 dark:border-blue-500/30 dark:bg-slate-900">
                      <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400">من حـ/ (مدين)</div>
                      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">إنت كتبت: <b className="text-slate-700 dark:text-slate-200">{entryField.dA || '—'} {entryField.dAmt}</b></div>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
                        <span className="text-slate-500 dark:text-slate-400">المفروض:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-100">{entry.debit.account} {entry.debit.amount}</span>
                        {verdict.dAccOk ? <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400"><IconCheck size={13} /> الحساب صح</span> : <span className="inline-flex items-center gap-0.5 text-rose-600 dark:text-rose-400"><IconXCircle size={13} /> الحساب غلط</span>}
                        {verdict.dAmtOk ? <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400"><IconCheck size={13} /> المبلغ صح</span> : <span className="inline-flex items-center gap-0.5 text-rose-600 dark:text-rose-400"><IconXCircle size={13} /> المبلغ غلط</span>}
                      </div>
                    </div>
                    <div className="rounded-lg border border-rose-200 bg-white p-3 dark:border-rose-500/30 dark:bg-slate-900">
                      <div className="text-[11px] font-bold text-rose-600 dark:text-rose-400">إلى حـ/ (دائن)</div>
                      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">إنت كتبت: <b className="text-slate-700 dark:text-slate-200">{entryField.cA || '—'} {entryField.cAmt}</b></div>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
                        <span className="text-slate-500 dark:text-slate-400">المفروض:</span>
                        <span className="font-bold text-slate-800 dark:text-slate-100">{entry.credit.account} {entry.credit.amount}</span>
                        {verdict.cAccOk ? <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400"><IconCheck size={13} /> الحساب صح</span> : <span className="inline-flex items-center gap-0.5 text-rose-600 dark:text-rose-400"><IconXCircle size={13} /> الحساب غلط</span>}
                        {verdict.cAmtOk ? <span className="inline-flex items-center gap-0.5 text-emerald-600 dark:text-emerald-400"><IconCheck size={13} /> المبلغ صح</span> : <span className="inline-flex items-center gap-0.5 text-rose-600 dark:text-rose-400"><IconXCircle size={13} /> المبلغ غلط</span>}
                      </div>
                    </div>
                  </div>
                )}

                {!verdict.correct && (
                  <ul className="mt-3 list-inside list-disc space-y-1 text-xs text-slate-700 dark:text-slate-200">
                    {!verdict.balanced && (
                      <li><b>القيد مش متوازن:</b> إنت كتبت مدين {dNum ?? '—'} ودائن {cNum ?? '—'} — لازم المدين = الدائن.</li>
                    )}
                    {!verdict.dAccOk && (
                      <li><b>حساب المدين غلط:</b> عامل إيه المدين المفروض يكون «{entry.debit.account}».</li>
                    )}
                    {!verdict.dAmtOk && (
                      <li><b>المبلغ المدين غلط:</b> المفروض يكون {entry.debit.amount}.</li>
                    )}
                    {!verdict.cAccOk && (
                      <li><b>حساب الدائن غلط:</b> المفروض يكون «{entry.credit.account}».</li>
                    )}
                    {!verdict.cAmtOk && (
                      <li><b>المبلغ الدائن غلط:</b> المفروض يكون {entry.credit.amount}.</li>
                    )}
                  </ul>
                )}

                <div className="mt-3 rounded-lg bg-white/60 p-2.5 text-xs text-slate-700 dark:bg-slate-900/60 dark:text-slate-200">
                  <b>شرح:</b> {current.explanation}
                </div>
              </div>
            )}
          </div>
        )}

        {/* explanation box for mc + text */}
        {showExplanation && (kind === 'mc' || kind === 'text') && (
          <div className={cn(
            'rounded-xl border p-4 text-sm animate-fade-in-up',
            currentAnswer?.correct
              ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10'
              : 'border-rose-200 bg-rose-50 dark:border-rose-500/30 dark:bg-rose-500/10'
          )}>
            <div className="mb-1 flex items-center gap-1.5 font-extrabold">
              {currentAnswer?.correct ? (<><IconCheckCircle size={16} className="text-emerald-500" /> ممتاز! صح</>) : (<><IconXCircle size={16} className="text-rose-500" /> غلط — ممكن تفهم الغلطة فين؟</>)}
            </div>
            <div className="text-slate-700 dark:text-slate-200">{current.explanation}</div>
          </div>
        )}
      </Card>

      <div className="flex items-center justify-between">
        <Button variant="secondary" onClick={goPrev} disabled={currentIndex === 0}><IconArrowRight size={15} /> السابق</Button>
        <span className="text-xs font-bold text-slate-500">صحيح: {correctCount} / {totalAnswered}</span>
        <Button onClick={goNext} disabled={currentIndex >= pool.length - 1}><IconArrowLeft size={15} /> التالي</Button>
      </div>
    </div>
  )
}