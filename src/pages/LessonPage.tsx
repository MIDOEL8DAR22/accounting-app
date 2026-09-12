import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Button } from '../components/ui'
import { LessonBlockView, blockSpeech } from '../components/LessonBlocks'
import { SpeakButton, SpeechUnsupported } from '../components/SpeakButton'
import { LESSONS, STAGES } from '../data/stages'
import { getProgress, completeLesson, touchLesson } from '../lib/progress'
import { stopSpeech, speechAvailable } from '../lib/speech'
import { IconCheck, IconCheckCircle, IconArrowRight, IconArrowLeft, IconDown, IconTarget, IconEye, IconSpeaker } from '../components/icons'

const TYPE_LABEL: Record<string, string> = {
  text: 'جزء جديد',
  note: 'ملاحظة',
  table: 'جدول توضيحي',
  example: 'مثال عملي',
  rule: 'قاعدة',
  list: 'قائمة',
  memory: 'تذكّر',
  steps: 'خطوات',
}

const STAGE_GRADIENT: Record<number, string> = {
  1: 'from-blue-700 via-blue-600 to-indigo-700',
  2: 'from-indigo-700 via-blue-600 to-violet-700',
  3: 'from-fuchsia-700 via-purple-600 to-indigo-700',
  4: 'from-emerald-700 via-teal-600 to-blue-700',
  5: 'from-amber-600 via-orange-600 to-rose-600',
  6: 'from-rose-700 via-red-600 to-orange-600',
}

export function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>()
  const lesson = LESSONS.find((l) => l.id === lessonId)
  const progress = getProgress()
  const done = lesson ? progress.completedLessons.includes(lesson.id) : false
  const [expanded, setExpanded] = useState<number | 'all'>(0)

  useEffect(() => {
    if (lesson) touchLesson(lesson.id)
  }, [lessonId])

  useEffect(() => {
    return () => stopSpeech()
  }, [])

  if (!lesson) return <div className="text-center py-12">الدرس غير موجود</div>

  const stage = STAGES.find((s) => s.id === lesson.stageId)
  const stageLessons = LESSONS.filter((l) => l.stageId === lesson.stageId)
  const currentIndex = stageLessons.findIndex((l) => l.id === lesson.id)
  const prev = currentIndex > 0 ? stageLessons[currentIndex - 1] : null
  const next = currentIndex < stageLessons.length - 1 ? stageLessons[currentIndex + 1] : null

  const revealedCount = expanded === 'all' ? lesson.blocks.length : Math.min((expanded ?? 0) + 1, lesson.blocks.length)
  const isVisible = (i: number) => expanded === 'all' || i <= expanded
  const isNext = (i: number) => expanded !== 'all' && i === expanded + 1

  const fullSpeech = [lesson.title, lesson.subtitle, ...lesson.blocks.map(blockSpeech)].filter(Boolean).join('. ')

  const handleComplete = () => {
    if (lesson.id && !done) {
      completeLesson(lesson.id)
      setExpanded('all')
    }
  }

  return (
    <div className="space-y-6">
      <Link to={`/stages/${lesson.stageId}`} className="inline-flex items-center gap-1 text-sm font-bold text-blue-600 hover:underline dark:text-blue-400">
        <IconArrowLeft size={15} /> العودة: المرحلة {lesson.stageId} — {stage?.title}
      </Link>

      <div className={`relative overflow-hidden rounded-3xl bg-gradient-to-l ${STAGE_GRADIENT[lesson.stageId] ?? STAGE_GRADIENT[1]} p-6 text-white shadow-xl shadow-blue-700/20 sm:p-8`}>
        <div className="absolute -left-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-16 left-1/3 h-44 w-44 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute left-6 top-6 h-16 w-16 rounded-full border border-white/20" />
        <div className="absolute bottom-6 right-8 h-8 w-8 rounded-full bg-white/20" />
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur">
              <IconTarget size={13} /> المرحلة {lesson.stageId} — {stage?.title}
            </span>
            {done && (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/25 px-3 py-1 text-xs font-bold text-emerald-200">
                <IconCheckCircle size={13} /> مكتملة
              </span>
            )}
          </div>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">{lesson.title}</h1>
          {lesson.subtitle && <p className="mt-2 text-base text-blue-100 sm:text-lg">{lesson.subtitle}</p>}
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm font-bold text-blue-100">
            <span className="inline-flex items-center gap-1.5"><IconSpeaker size={15} /> استمع للدرس بصوت عربي</span>
            <span className="hidden text-blue-200/60 sm:inline">•</span>
            <span>الكتلة {currentIndex + 1} من {stageLessons.length}</span>
            <span className="hidden text-blue-200/60 sm:inline">•</span>
            <span>{lesson.blocks.length} أجزاء</span>
          </div>
          {expanded !== 'all' && (
            <div className="mt-5">
              <div className="mb-1 flex items-center justify-between text-xs font-bold text-blue-100">
                <span>تقدمك في الدرس</span>
                <span>{revealedCount} / {lesson.blocks.length}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/25">
                <div className="h-full rounded-full bg-white transition-all duration-500" style={{ width: `${(revealedCount / lesson.blocks.length) * 100}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-blue-500/20 dark:bg-blue-500/10">
        <div>
          <div className="text-base font-extrabold text-blue-900 dark:text-blue-100">استمع للدرس كامل</div>
          <div className="text-xs text-blue-600/80 dark:text-blue-300/70">قراءة عربية مسموعة للدرس من الأول لآخره، فقرة فقرة</div>
        </div>
        {speechAvailable() ? (
          <SpeakButton speechKey={`lesson-${lesson.id}`} text={fullSpeech} label="اقرأ الدرس كامل" size={17} />
        ) : (
          <SpeechUnsupported />
        )}
      </div>

      <div className="space-y-6">
        {lesson.blocks.map((block, i) => (
          <div key={i} className="space-y-3">
            {isVisible(i) && <LessonBlockView block={block} index={i + 1} />}
            {isNext(i) && (
              <Button onClick={() => setExpanded(i)} variant="secondary" className="w-full py-3">
                <IconDown size={16} /> تكمّل الدرس — {TYPE_LABEL[block.type] ?? 'جزء جديد'}
              </Button>
            )}
          </div>
        ))}
      </div>

      {expanded !== 'all' && (
        <div className="text-center">
          <Button onClick={() => setExpanded('all')} variant="ghost" className="w-full sm:w-auto">
            <IconEye size={16} /> استعرض باقي الدرس للمراجعة
          </Button>
        </div>
      )}

      {expanded === 'all' && (
        <div className="text-center space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          {!done ? (
            <Button onClick={handleComplete} variant="success" className="px-8">
              <IconCheck size={16} /> أتممت الدرس!
            </Button>
          ) : (
            <div className="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-600 dark:text-emerald-400">
              <IconCheckCircle size={16} /> انت خلّيت الدرس ده
            </div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        {prev ? (
          <Link to={`/lesson/${prev.id}`} className="flex-1">
            <Button variant="secondary" className="w-full"><IconArrowRight size={15} /> الدرس اللي فات</Button>
          </Link>
        ) : <div />}
        {next ? (
          <Link to={`/lesson/${next.id}`} className="flex-1">
            <Button className="w-full"><IconArrowLeft size={15} /> الدرس الجاي</Button>
          </Link>
        ) : (
          <Link to="/learn" className="flex-1">
            <Button variant="success" className="w-full"><IconTarget size={15} /> رجوع للمراحل</Button>
          </Link>
        )}
      </div>
    </div>
  )
}