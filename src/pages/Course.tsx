import { Link } from 'react-router-dom'
import { Card, Button, ProgressBar, Badge } from '../components/ui'
import { COURSE, COURSE_LESSONS, COURSE_QUIZ } from '../data/course'
import { getProgress } from '../lib/progress'
import { IconCheck, IconPlay, IconClipboard, IconSpeaker, IconTarget, IconArrowLeft } from '../components/icons'

export function Course() {
  const progress = getProgress()
  const doneCount = COURSE_LESSONS.filter((l) => progress.completedLessons.includes(l.id)).length
  const pct = Math.round((doneCount / COURSE_LESSONS.length) * 100)
  const quizDone = progress.quizScores.length > 0

  return (
    <div className="space-y-6">
      <Link to="/learn" className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:underline dark:text-blue-400">
        <IconArrowLeft size={15} /> العودة للتعلم
      </Link>

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-amber-700 via-orange-600 to-rose-600 p-6 text-white shadow-xl shadow-orange-700/20 sm:p-8">
        <div className="absolute -left-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-16 left-1/3 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <Badge color="amber" className="bg-white/20 text-white">كورس المحاضرة الأولى</Badge>
            <Badge className="bg-white/20 text-white">{COURSE_LESSONS.length} دروس + أسئلة</Badge>
          </div>
          <h1 className="mt-4 text-2xl font-extrabold leading-tight sm:text-4xl">{COURSE.title}</h1>
          <p className="mt-2 text-base text-orange-100 sm:text-lg">{COURSE.tagline}</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-bold text-orange-100">
            <span className="inline-flex items-center gap-1.5"><IconSpeaker size={15} /> كل درس له صوت عربي</span>
            <span className="hidden text-orange-200/60 sm:inline">•</span>
            <span>شرح بالبلدي بسيط</span>
          </div>
          <div className="mt-5">
            <div className="mb-1 flex items-center justify-between text-xs font-bold text-orange-100">
              <span>تقدمك في الكورس</span>
              <span>خلصت {doneCount} من {COURSE_LESSONS.length} دروس</span>
            </div>
            <ProgressBar value={pct} color="bg-white" className="bg-white/25" />
          </div>
        </div>
      </div>

      <div>
        <h2 className="mb-3 text-lg font-extrabold text-slate-800 dark:text-slate-100">دروس الكورس</h2>
        <div className="space-y-2.5">
          {COURSE_LESSONS.map((lesson) => {
            const done = progress.completedLessons.includes(lesson.id)
            return (
              <Link key={lesson.id} to={`/course/${lesson.id}`}>
                <Card className="flex items-center gap-3 px-4 py-3.5">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold ${
                      done
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                        : 'bg-gradient-to-br from-amber-500 to-rose-500 text-white'
                    }`}
                  >
                    {done ? <IconCheck size={20} /> : lesson.num}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-extrabold text-slate-800 dark:text-slate-100">{lesson.title}</div>
                    <div className="truncate text-xs text-slate-500 dark:text-slate-400">{lesson.subtitle}</div>
                  </div>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400">
                    <IconPlay size={15} />
                  </span>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>

      <div>
        <h2 className="mb-3 flex items-center gap-2 text-lg font-extrabold text-slate-800 dark:text-slate-100">
          <IconClipboard size={18} className="text-blue-600" /> أسئلة المحاضرة
        </h2>
        <Card className="border-2 border-blue-100 bg-blue-50/70 dark:border-blue-500/20 dark:bg-blue-500/10">
          <p className="text-sm leading-relaxed text-blue-800/90 dark:text-blue-200/80">
            {COURSE_QUIZ.length} أسئلة قصيرة على اللي اتشرح في الكورس — كل سؤال وتفسيره في الآخر.
          </p>
          <Link to="/course/quiz" className="mt-4 block">
            <Button className="w-full">{quizDone ? 'راجع الأسئلة تاني' : 'ابدأ الأسئلة'} <IconTarget size={15} /></Button>
          </Link>
          {quizDone && (
            <div className="mt-3 text-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <IconCheck size={12} /> حليتهم قبل كده — عدّي عليهم للمراجعة
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}