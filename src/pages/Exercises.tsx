import { useState, useMemo } from 'react'
import { Card, Button, Badge, DifficultyStars } from '../components/ui'
import { EXERCISES } from '../data/exercises'
import { recordExercise } from '../lib/progress'
import type { Exercise } from '../types'
import { cn } from '../lib/cn'
import { generateQuestions, type GeneratorConfig } from '../lib/generator'
import { IconPen, IconRocket, IconRefresh, IconCheck, IconXCircle, IconArrowRight, IconArrowLeft, IconCheckCircle } from '../components/icons'

type AnswerState = { answered: boolean; correct: boolean | null }

const LEVEL_LABELS: Record<string, string> = {
  A: 'استخراج الحسابات',
  B: 'نوع الحساب',
  C: 'زيادة / نقص',
  D: 'مدين / دائن',
  E: 'أكمل القيد',
  F: 'تحليل كامل',
  G: 'اختبار مختلط',
}

const DIFFICULTY_LABELS = ['مبتدئ', 'سهل', 'متوسط', 'متقدم', 'تحدّي']

export function Exercises() {
  const [config, setConfig] = useState<GeneratorConfig>({ topic: 'all', difficulty: 0, count: 10, level: 'mixed' })
  const [pool, setPool] = useState<Exercise[]>(() => generateQuestions(config))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, AnswerState>>({})
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [filterTopic, setFilterTopic] = useState('all')
  const [filterLevel, setFilterLevel] = useState<'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'mixed'>('mixed')
  const [filterDifficulty, setFilterDifficulty] = useState(0)

  const current = pool[currentIndex]
  const currentAnswer = current ? answers[current.id] : null

  const allTopics = useMemo(() => {
    const topics = new Set(EXERCISES.map((e) => e.topic))
    return ['all', ...Array.from(topics)]
  }, [])

  const filteredPool = useMemo(() => {
    return EXERCISES.filter((e) => {
      if (filterTopic !== 'all' && e.topic !== filterTopic) return false
      if (filterLevel !== 'mixed' && e.level !== filterLevel) return false
      if (filterDifficulty > 0 && e.difficulty !== filterDifficulty) return false
      return true
    }).slice(0, 50)
  }, [filterTopic, filterLevel, filterDifficulty])

  const handleStart = () => {
    const cfg = { topic: filterTopic, difficulty: filterDifficulty, count: 20, level: filterLevel }
    setConfig(cfg)
    const newPool = generateQuestions(cfg)
    setPool(newPool.length > 0 ? newPool : EXERCISES.slice(0, 10))
    setCurrentIndex(0)
    setAnswers({})
    setSelectedOption(null)
    setShowExplanation(false)
  }

  const handleAnswer = (answer: string) => {
    if (!current || currentAnswer?.answered) return
    setSelectedOption(answer)
    setShowExplanation(true)

    let correct = false
    if (current.correctIndex !== undefined && current.options) {
      correct = current.options[current.correctIndex] === answer
    } else if (current.correctAnswer) {
      if (current.level === 'A') {
        const userSet = new Set(
          answer
            .split(/[,،]/)
            .map((a) => a.trim())
            .filter(Boolean)
        )
        const correctSet = new Set(current.correctAnswer)
        correct = userSet.size === correctSet.size && [...correctSet].every((c) => userSet.has(c))
      } else {
        correct = current.correctAnswer.includes(answer)
      }
    }

    setAnswers((prev) => ({ ...prev, [current.id]: { answered: true, correct } }))
    recordExercise(current.id, correct, current.topic)
  }

  const goNext = () => {
    if (currentIndex < pool.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedOption(null)
      setShowExplanation(false)
    }
  }

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setSelectedOption(null)
      setShowExplanation(false)
    }
  }

  const correctCount = Object.values(answers).filter((a) => a.correct === true).length
  const totalAnswered = Object.values(answers).filter((a) => a.answered).length

  if (pool.length === 0 || !current) {
    return (
      <div className="space-y-6">
        <h1 className="flex items-center gap-2 text-xl font-extrabold text-slate-800 dark:text-slate-100">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"><IconPen size={18} /></span>
          تمارين تفاعلية
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">اختار إعدادات التمارين واضغط "ابدأ"</p>

        <Card>
          <div className="grid gap-4 sm:grid-cols-3">
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
              <label className="mb-1 block text-xs font-bold text-slate-600 dark:text-slate-300">نوع التمرين</label>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value as typeof filterLevel)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800"
              >
                <option value="mixed">مختلط</option>
                {Object.entries(LEVEL_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
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
          <Button onClick={handleStart} className="mt-4"><IconRocket size={15} /> ابدأ التمرين ({filteredPool.length} سؤال)</Button>
        </Card>
      </div>
    )
  }

  const progress = Math.round(((currentIndex + 1) / pool.length) * 100)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-xl font-extrabold text-slate-800 dark:text-slate-100">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"><IconPen size={18} /></span>
          التمارين
        </h1>
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
          <Badge color={current.level === 'A' ? 'blue' : current.level === 'E' ? 'green' : current.level === 'F' || current.level === 'G' ? 'purple' : 'slate'}>
            {LEVEL_LABELS[current.level] || current.level}
          </Badge>
          <DifficultyStars level={current.difficulty} />
          <span className="text-xs text-slate-500 dark:text-slate-400">{current.topic}</span>
        </div>

        <div className="text-base font-bold text-slate-800 dark:text-slate-100 leading-relaxed">
          {current.question}
        </div>

        {current.options && (
          <div className="space-y-2">
            {current.options.map((opt) => {
              const isSelected = selectedOption === opt
              const isCorrectOption = current.correctIndex !== undefined && current.options![current.correctIndex] === opt
              const answered = currentAnswer?.answered

              return (
                <button
                  key={opt}
                  disabled={answered}
                  onClick={() => handleAnswer(opt)}
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

        {!current.options && current.level === 'A' && (
          <div className="space-y-2">
            <div className="text-xs text-slate-500 dark:text-slate-400">اكتب الحسابات المتأثرة:</div>
            <input
              type="text"
              value={selectedOption ?? ''}
              onChange={(e) => setSelectedOption(e.target.value)}
              disabled={currentAnswer?.answered}
              placeholder="مثال: الموردون، النقدية"
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            />
            {!currentAnswer?.answered && (
              <Button onClick={() => handleAnswer(selectedOption ?? '')}>تأكيد</Button>
            )}
          </div>
        )}

        {showExplanation && (
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