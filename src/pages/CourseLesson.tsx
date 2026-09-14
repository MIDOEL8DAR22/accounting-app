import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Button, Card } from '../components/ui'
import { CourseParts } from '../components/CourseParts'
import { COURSE_LESSONS } from '../data/course'
import { getProgress, completeLesson, touchLesson } from '../lib/progress'
import { IconCheck, IconCheckCircle, IconArrowRight, IconArrowLeft, IconTarget, IconSpeaker, IconList } from '../components/icons'

export function CourseLesson() {
  const { lessonId } = useParams<{ lessonId: string }>()
  const lesson = COURSE_LESSONS.find((l) => l.id === lessonId)
  const progress = getProgress()
  const done = lesson ? progress.completedLessons.includes(lesson.id) : false
  const [, setTick] = useState(0)

  useEffect(() => {
    if (lesson) touchLesson(lesson.id)
  }, [lessonId])

  if (!lesson) return <div className="text-center py-12">الدرس مش موجود</div>

  const index = COURSE_LESSONS.findIndex((l) => l.id === lesson.id)
  const prev = index > 0 ? COURSE_LESSONS[index - 1] : null
  const next = index < COURSE_LESSONS.length - 1 ? COURSE_LESSONS[index + 1] : null

  const handleComplete = () => {
    if (!done) {
      completeLesson(lesson.id)
      setTick((t) => t + 1)
    }
  }

  return (
    <div className="space-y-6">
      <Link to="/course" className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:underline dark:text-blue-400">
        <IconArrowLeft size={15} /> كل الدروس
      </Link>

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-amber-700 via-orange-600 to-rose-600 p-6 text-white shadow-xl shadow-orange-700/20 sm:p-8">
        <div className="absolute -left-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
              الدرس {lesson.num} من {COURSE_LESSONS.length}
            </span>
            {done && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/25 px-3 py-1 text-xs font-bold text-emerald-200">
                <IconCheckCircle size={13} /> مكتمل
              </span>
            )}
          </div>
          <h1 className="mt-4 text-2xl font-extrabold leading-tight sm:text-3xl">{lesson.title}</h1>
          <p className="mt-2 text-base text-orange-100">{lesson.subtitle}</p>
        </div>
      </div>

      <Card className="border-2 border-orange-100 p-4 dark:border-orange-500/20 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-base font-extrabold text-orange-900 dark:text-orange-100">
              <IconSpeaker size={17} /> استمع للدرس
            </div>
            <div className="text-xs text-orange-600/80 dark:text-orange-300/70">شرح صوتي كامل للدرس — شغّله وريح نفسك</div>
          </div>
          <audio controls preload="none" className="h-10 w-full sm:w-80" src={lesson.audio}>
            المتصفح بتاعك مش بيشغّل الصوت
          </audio>
        </div>
      </Card>

      <Card className="p-4 sm:p-6">
        <div className="flex items-center gap-2 text-base font-extrabold text-slate-800 dark:text-slate-100">
          <IconList size={17} className="text-amber-500" /> شرح الدرس بالتفصيل
        </div>
        <CourseParts parts={lesson.parts} />
      </Card>

      <div className="text-center">
        {!done ? (
          <Button onClick={handleComplete} variant="success" className="px-8">
            <IconCheck size={16} /> أتممت الدرس!
          </Button>
        ) : (
          <div className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 dark:text-emerald-400">
            <IconCheckCircle size={16} /> انت خلّيته — راجع الصوت لو حابب
          </div>
        )}
      </div>

      {index === COURSE_LESSONS.length - 1 && (
        <div className="text-center">
          <Link to="/course/quiz">
            <Button variant="warning">
              <IconTarget size={16} /> خلصنا الدروس — روّح للأسئلة
            </Button>
          </Link>
        </div>
      )}

      <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-5 dark:border-slate-700">
        {prev ? (
          <Link to={`/course/${prev.id}`} className="flex-1">
            <Button variant="secondary" className="w-full"><IconArrowRight size={15} /> السابق</Button>
          </Link>
        ) : <div />}
        {next ? (
          <Link to={`/course/${next.id}`} className="flex-1">
            <Button className="w-full"><IconArrowLeft size={15} /> التالي</Button>
          </Link>
        ) : (
          <Link to="/course" className="flex-1">
            <Button variant="success" className="w-full"><IconTarget size={15} /> كل الدروس</Button>
          </Link>
        )}
      </div>
    </div>
  )
}