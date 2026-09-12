import { useState, useMemo } from 'react'
import { Card, Button, Badge, ProgressBar } from '../components/ui'
import { QUIZ_QUESTIONS } from '../data/quizzes'
import { recordQuiz } from '../lib/progress'
import { cn } from '../lib/cn'

interface QuizAnswer {
  selected: number
  correct: boolean
}

export function Quiz() {
  const [started, setStarted] = useState(false)
  const [currentQ, setCurrentQ] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [difficulty, setDifficulty] = useState(0)

  const quiz = useMemo(() => {
    let pool = QUIZ_QUESTIONS
    if (difficulty > 0) pool = pool.filter((q) => q.difficulty === difficulty)
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, Math.min(20, shuffled.length))
  }, [difficulty])

  const question = quiz[currentQ]
  const score = answers.filter((a) => a.correct).length
  const pct = quiz.length > 0 ? Math.round((score / quiz.length) * 100) : 0

  if (!started) {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <h1 className="text-xl font-extrabold text-slate-800 dark:text-slate-100">📝 اختبار المحاسبة</h1>
        <Card>
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">اختار مستوى الصعوبة:</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {[0, 1, 2, 3, 4, 5].map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={cn(
                  'rounded-xl border-2 p-2 text-sm font-bold transition',
                  difficulty === d ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/15 dark:text-blue-300' : 'border-slate-200 dark:border-slate-700'
                )}
              >
                {d === 0 ? 'الكل' : '⭐'.repeat(d)}
              </button>
            ))}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mb-4">
            عدد الأسئلة: {quiz.length}
          </div>
          <Button onClick={() => setStarted(true)} className="w-full">ابدأ الاختبار</Button>
        </Card>
      </div>
    )
  }

  if (!question) return null

  if (showResult) {
    const mistakes = answers
      .map((a, i) => ({ ...a, question: quiz[i] }))
      .filter((a) => !a.correct)

    const weakTopics: Record<string, number> = {}
    mistakes.forEach((m) => {
      weakTopics[m.question.mistakeCategory] = (weakTopics[m.question.mistakeCategory] || 0) + 1
    })

    const topWeak = Object.entries(weakTopics).sort((a, b) => b[1] - a[1]).slice(0, 3)

    return (
      <div className="max-w-xl mx-auto space-y-6">
        <Card className="text-center">
          <div className="text-5xl mb-3">{pct >= 80 ? '🎉' : pct >= 50 ? '👍' : '💪'}</div>
          <div className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{pct}%</div>
          <div className="text-sm text-slate-600 dark:text-slate-300">
            {score} من {quiz.length} صح
          </div>
          <div className="mt-2">
            {pct >= 80 ? (
              <Badge color="green">ممتاز! أنت عندك معلومات قوية 🎯</Badge>
            ) : pct >= 50 ? (
              <Badge color="amber">كويس — بس في أماكن محتاج تراجعها</Badge>
            ) : (
              <Badge color="red">محتاج تراجع — هنقولك فين بالظبط</Badge>
            )}
          </div>
        </Card>

        {topWeak.length > 0 && (
          <Card>
            <h3 className="mb-2 text-sm font-extrabold text-slate-800 dark:text-slate-100">📍 أماكن محتاج تراجع:</h3>
            <div className="space-y-1">
              {topWeak.map(([topic, count]) => (
                <div key={topic} className="rounded-lg bg-amber-50 px-3 py-2 text-sm font-semibold text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
                  {topic} — غلطت {count} مرة
                </div>
              ))}
            </div>
          </Card>
        )}

        <Card>
          <h3 className="mb-2 text-sm font-extrabold text-slate-800 dark:text-slate-100">📋 تقرير الأخطاء:</h3>
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {mistakes.map((m, i) => (
              <div key={i} className="rounded-lg border border-rose-200 bg-rose-50 p-3 dark:border-rose-500/30 dark:bg-rose-500/10">
                <div className="text-xs font-bold text-rose-700 dark:text-rose-300">{m.question.question}</div>
                <div className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  جوابك: <span className="font-bold">{m.question.options[m.selected]}</span>
                </div>
                <div className="text-xs text-emerald-700 dark:text-emerald-300">
                  الصح: <span className="font-bold">{m.question.options[m.question.correctIndex]}</span>
                </div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{m.question.explanation}</div>
              </div>
            ))}
          </div>
        </Card>

        <Button onClick={() => { setStarted(false); setAnswers([]); setCurrentQ(0); setShowResult(false); setSelected(null) }} className="w-full">
          🔄 اختبار تاني
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">📝 اختبار</h1>
        <span className="text-sm font-bold text-slate-500">{currentQ + 1}/{quiz.length}</span>
      </div>

      <ProgressBar value={Math.round(((currentQ) / quiz.length) * 100)} />

      <Card className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge color="slate">{question.topic}</Badge>
          <span className="text-xs text-slate-400">⭐'.repeat(question.difficulty)</span>
        </div>
        <div className="text-base font-bold text-slate-800 dark:text-slate-100">{question.question}</div>

        <div className="space-y-2">
          {question.options.map((opt, i) => {
            const answered = showResult || answers.length > currentQ
            const isCorrect = i === question.correctIndex
            const isSelected = selected === i

            return (
              <button
                key={i}
                disabled={answered}
                onClick={() => { setSelected(i); }}
                className={cn(
                  'block w-full rounded-xl border-2 p-3 text-right text-sm font-semibold transition',
                  answered && isCorrect
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10'
                    : answered && isSelected && !isCorrect
                      ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/10'
                      : isSelected
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-500/10'
                        : 'border-slate-200 hover:border-blue-300 dark:border-slate-700 dark:bg-slate-800'
                )}
              >
                {answered && isCorrect ? '✅ ' : answered && isSelected ? '❌ ' : ''}
                {opt}
              </button>
            )
          })}
        </div>

        {answers.length > currentQ && (
          <div className={cn(
            'rounded-xl border p-3 text-sm animate-fade-in-up',
            answers[currentQ]?.correct
              ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10'
              : 'border-rose-200 bg-rose-50 dark:border-rose-500/30 dark:bg-rose-500/10'
          )}>
            <div className="font-extrabold mb-1">{answers[currentQ]?.correct ? '✅ صح!' : '❌ غلط!'}</div>
            <div className="text-slate-700 dark:text-slate-200">{question.explanation}</div>
          </div>
        )}

        {selected !== null && answers.length <= currentQ && (
          <Button onClick={() => {
            const correct = selected === question.correctIndex
            const newAnswer = [...answers]
            newAnswer[currentQ] = { selected, correct }
            setAnswers(newAnswer)
          }} className="w-full">تأكيد</Button>
        )}

        {answers.length > currentQ && (
          <Button onClick={() => {
            if (currentQ < quiz.length - 1) {
              setCurrentQ(currentQ + 1)
              setSelected(null)
            } else {
              const finalScore = answers.filter((a) => a.correct).length
              recordQuiz(finalScore, quiz.length)
              setShowResult(true)
            }
          }} className="w-full">
            {currentQ < quiz.length - 1 ? 'السؤال الجاي ←' : 'عرض النتيجة'}
          </Button>
        )}
      </Card>
    </div>
  )
}