import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Button } from '../components/ui'
import { LessonBlockView } from '../components/LessonBlocks'
import { COURSE, COURSE_LESSONS } from '../data/course'
import { getProgress, completeLesson, touchLesson } from '../lib/progress'
import { stopSpeech } from '../lib/speech'
import { IconCheck, IconCheckCircle, IconArrowRight, IconArrowLeft, IconTarget, IconSpeaker } from '../components/icons'

export function CourseLesson() {
  const { lessonId } = useParams<{ lessonId: string }>()
  const lesson = COURSE_LESSONS.find((l) => l.id === lessonId)
  const progress = getProgress()
  const done = lesson ? progress.completedLessons.includes(lesson.id) : false
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (lesson) touchLesson(lesson.id)
  }, [lessonId])

  useEffect(() => {
    return () => stopSpeech()
  }, [])

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
        <IconArrowLeft size={15} /> العودة للكورس
      </Link>

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-amber-700 via-orange-600 to-rose-600 p-6 text-white shadow-xl shadow-orange-700/20 sm:p-8">
        <div className="absolute -left-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
              الدرس {lesson.num} من {COURSE_LESSONS.length} — {COURSE.title}
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

      {tick >= 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-orange-100 bg-orange-50/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-orange-500/20 dark:bg-orange-500/10">
          <div>
            <div className="flex items-center gap-1.5 text-base font-extrabold text-orange-900 dark:text-orange-100">
              <IconSpeaker size={17} /> استمع للدرس
            </div>
            <div className="text-xs text-orange-600/80 dark:text-orange-300/70">
              شرح صوتي بالعربي للدرس كامل — جاهز للتشغيل
            </div>
          </div>
          <audio controls preload="none" className="h-10 w-full sm:w-72" src={lesson.audio}>
            المتصفح بتاعك مش بيشغّل الصوت
          </audio>
        </div>
      )}

      <div className="space-y-5">
        {lesson.blocks.map((block, i) => (
          <LessonBlockView key={i} block={block} index={i + 1} />
        ))}
      </div>

      <div className="text-center space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
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
              <IconTarget size={16} /> خلصنا الدروس — روّح للاختبار
            </Button>
          </Link>
        </div>
      )}

      <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        {prev ? (
          <Link to={`/course/${prev.id}`} className="flex-1">
            <Button variant="secondary" className="w-full"><IconArrowRight size={15} /> الدرس اللي فات</Button>
          </Link>
        ) : <div />}
        {next ? (
          <Link to={`/course/${next.id}`} className="flex-1">
            <Button className="w-full"><IconArrowLeft size={15} /> الدرس الجاي</Button>
          </Link>
        ) : (
          <Link to="/course" className="flex-1">
            <Button variant="success" className="w-full"><IconTarget size={15} /> رجوع للكورس</Button>
          </Link>
        )}
      </div>
    </div>
  )
}