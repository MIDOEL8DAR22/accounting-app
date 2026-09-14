import { Link } from 'react-router-dom'
import { useState } from 'react'
import { Card, Button, ProgressBar } from '../components/ui'
import { COURSE_QUIZ } from '../data/course'
import { recordQuiz } from '../lib/progress'
import { cn } from '../lib/cn'
import { IconCheck, IconXCircle, IconArrowRight, IconRefresh, IconArrowLeft, IconAward } from '../components/icons'

export function CourseQuiz() {
  const [index, setIndex] = useState(0)
  const [chosen, setChosen] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)

  const q = COURSE_QUIZ[index]
  const answered = chosen !== null
  const correct = answered && chosen === q.correctIndex

  const choose = (i: number) => {
    if (answered) return
    setChosen(i)
    if (i === q.correctIndex) setScore((s) => s + 1)
  }

  const next = () => {
    if (index < COURSE_QUIZ.length - 1) {
      setIndex((i) => i + 1)
      setChosen(null)
    } else {
      recordQuiz(score, COURSE_QUIZ.length)
      setDone(true)
    }
  }

  const restart = () => {
    setIndex(0)
    setChosen(null)
    setScore(0)
    setDone(false)
  }

  if (done) {
    const pct = Math.round((score / COURSE_QUIZ.length) * 100)
    return (
      <div className="space-y-6">
        <Link to="/course" className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:underline dark:text-blue-400">
          <IconArrowLeft size={15} /> العودة للكورس
        </Link>
        <Card className="text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-rose-500 mx-auto text-white">
            <IconAward size={28} />
          </div>
          <h1 className="mt-4 text-2xl font-extrabold text-slate-800 dark:text-slate-100">نتيجتك: {score} من {COURSE_QUIZ.length}</h1>
          <ProgressBar value={pct} className="mx-auto mt-3 max-w-sm" />
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
            {pct === 100 ? 'باشا! انت جاوبت صح كلها — الميزانية في دماغك' : pct >= 70 ? 'كلام حلو — راجع اللي غلط فيه وادوس تاني' : 'متزعلش — اسمع الدروس تاني وحاول'}
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Button variant="secondary" onClick={restart}>
              <IconRefresh size={15} /> عيد الاختبار
            </Button>
            <Link to="/course">
              <Button variant="success"><IconArrowLeft size={15} /> رجوع للكورس</Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Link to="/course" className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:underline dark:text-blue-400">
        <IconArrowLeft size={15} /> العودة للكورس
      </Link>

      <div>
        <h1 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 sm:text-2xl">اختبار المحاضرة الأولى</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          جاوب باللي فاهمه — وكل سؤال فيه تفسير عشان تذاكر أول بأول
        </p>
      </div>

      <Card className="space-y-4">
        <div className="flex items-center justify-between text-sm font-bold text-slate-500 dark:text-slate-400">
          <span>سؤال {index + 1} من {COURSE_QUIZ.length}</span>
          <span>صح عندك: {score}</span>
        </div>
        <ProgressBar value={((index + (answered ? 1 : 0)) / COURSE_QUIZ.length) * 100} />

        <h2 className="text-lg font-extrabold leading-relaxed text-slate-800 dark:text-slate-100">{q.question}</h2>

        <div className="space-y-2">
          {q.options.map((opt, i) => {
            const isCorrect = i === q.correctIndex
            const isChosen = chosen === i
            return (
              <button
                key={i}
                onClick={() => choose(i)}
                disabled={answered}
                className={cn(
                  'flex w-full items-center justify-between gap-2 rounded-xl border-2 px-4 py-3 text-right text-base font-semibold transition',
                  !answered && 'border-slate-200 bg-white hover:border-blue-400 dark:border-slate-700 dark:bg-slate-800/60',
                  answered && isCorrect && 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-500/10 dark:text-emerald-200',
                  answered && isChosen && !isCorrect && 'border-rose-500 bg-rose-50 text-rose-800 dark:bg-rose-500/10 dark:text-rose-200',
                  answered && !isChosen && !isCorrect && 'border-slate-200 opacity-60 dark:border-slate-700'
                )}
              >
                <span>{opt}</span>
                {answered && isCorrect && <IconCheck size={18} className="shrink-0 text-emerald-600" />}
                {answered && isChosen && !isCorrect && <IconXCircle size={18} className="shrink-0 text-rose-600" />}
              </button>
            )
          })}
        </div>

        {answered && (
          <div className={cn('rounded-xl border p-4 text-sm font-semibold leading-relaxed', correct
            ? 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200'
            : 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200')}>
            {correct ? 'صح — ' : 'الإجابة الصح: '}{q.options[q.correctIndex]}. {q.explanation}
          </div>
        )}

        {answered && (
          <Button onClick={next} className="w-full">
            {index < COURSE_QUIZ.length - 1 ? 'السؤال الجاي' : 'عرض النتيجة'} <IconArrowRight size={15} />
          </Button>
        )}
      </Card>
    </div>
  )
}