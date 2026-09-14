import { Link } from 'react-router-dom'
import { Card, Button, ProgressBar, Badge } from '../components/ui'
import { COURSES } from '../data/course'
import { getProgress } from '../lib/progress'
import { IconCheck, IconPlay, IconClipboard, IconSpeaker, IconTarget, IconArrowLeft, IconBookOpen } from '../components/icons'

export function Course() {
  const progress = getProgress()

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
            <Badge color="amber" className="bg-white/20 text-white">كورس المحاسبة كاملة</Badge>
            <Badge className="bg-white/20 text-white">{COURSES.length} محاضرات</Badge>
          </div>
          <h1 className="mt-4 text-2xl font-extrabold leading-tight sm:text-4xl">محاضرات الكورس</h1>
          <p className="mt-2 text-base text-orange-100 sm:text-lg">
            امشي بالترتيب: المحاضرة الأولى أسس، والتانية أنواع الحسابات — كل درس صوت + شرح مصور + أسئلة في الآخر.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-bold text-orange-100">
            <span className="inline-flex items-center gap-1.5"><IconSpeaker size={15} /> كل درس له صوت عربي</span>
            <span className="hidden text-orange-200/60 sm:inline">•</span>
            <span>شرح بالبلدي بسيط</span>
          </div>
        </div>
      </div>

      {COURSES.map((course, ci) => {
        const doneCount = course.lessons.filter((l) => progress.completedLessons.includes(l.id)).length
        const pct = Math.round((doneCount / course.lessons.length) * 100)
        const quizDone = progress.quizScores.length > 0
        const accents = [
          'from-amber-500 to-rose-500',
          'from-violet-500 to-sky-500',
        ]
        const lightAccents = [
          'border-orange-100 bg-orange-50/60 dark:border-orange-500/20 dark:bg-orange-500/5',
          'border-violet-100 bg-violet-50/60 dark:border-violet-500/20 dark:bg-violet-500/5',
        ]
        const titleClr = [
          'text-orange-900 dark:text-orange-100',
          'text-violet-900 dark:text-violet-100',
        ]
        const badge = ci === 0 ? 'المحاضرة الأولى' : 'المحاضرة الثانية'

        return (
          <section key={course.id} className="space-y-4">
            <Card className={`border-2 p-4 ${lightAccents[ci]}`}>
              <div className="flex items-start gap-3">
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${accents[ci]} text-white`}>
                  <IconBookOpen size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className={`text-lg font-extrabold ${titleClr[ci]}`}>{course.title}</h2>
                    <Badge color={ci === 0 ? 'orange' : 'violet'}>{badge}</Badge>
                  </div>
                  <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{course.tagline}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <ProgressBar value={pct} className="flex-1" />
                    <span className="text-xs font-bold text-slate-400">{doneCount}/{course.lessons.length} دروس خلصتها</span>
                  </div>
                </div>
              </div>
            </Card>

            <div className="space-y-2.5 pr-2 sm:pr-3">
              {course.lessons.map((lesson) => {
                const done = progress.completedLessons.includes(lesson.id)
                return (
                  <Link key={lesson.id} to={`/course/${lesson.id}`}>
                    <Card className="flex items-center gap-3 px-4 py-3.5">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold ${
                          done
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                            : `bg-gradient-to-br ${accents[ci]} text-white`
                        }`}
                      >
                        {done ? <IconCheck size={20} /> : lesson.num}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-extrabold text-slate-800 dark:text-slate-100">{lesson.title}</div>
                        <div className="truncate text-xs text-slate-500 dark:text-slate-400">{lesson.subtitle}</div>
                      </div>
                      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        ci === 0
                          ? 'bg-orange-50 text-orange-600 dark:bg-orange-500/10 dark:text-orange-400'
                          : 'bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400'
                      }`}>
                        <IconPlay size={15} />
                      </span>
                    </Card>
                  </Link>
                )
              })}
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2 text-base font-extrabold text-slate-800 dark:text-slate-100">
                <IconClipboard size={17} className={ci === 0 ? 'text-blue-600' : 'text-violet-600'} /> أسئلة {badge}
              </div>
              <Card className="border-2 border-blue-100 bg-blue-50/70 dark:border-blue-500/20 dark:bg-blue-500/10">
                <p className="text-sm leading-relaxed text-blue-800/90 dark:text-blue-200/80">
                  {course.quiz?.length ?? 0} أسئلة قصيرة على اللي اتشرح في المحاضرة — كل سؤال وتفسيره في الآخر.
                </p>
                <Link to={`/course/${course.id}/quiz`} className="mt-4 block">
                  <Button className="w-full">{quizDone ? 'راجع الأسئلة تاني' : 'ابدأ الأسئلة'} <IconTarget size={15} /></Button>
                </Link>
                {quizDone && (
                  <div className="mt-3 text-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <IconCheck size={12} /> حليتهم قبل كده — عدّي عليهم للمراجعة
                  </div>
                )}
              </Card>
            </div>
          </section>
        )
      })}
    </div>
  )
}