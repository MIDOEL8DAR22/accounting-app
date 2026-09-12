import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Button, ProgressBar } from '../components/ui'
import { LessonBlockView } from '../components/LessonBlocks'
import { LESSONS, STAGES } from '../data/stages'
import { getProgress, completeLesson, touchLesson } from '../lib/progress'
import { IconCheck, IconCheckCircle, IconArrowRight, IconArrowLeft, IconDown, IconTarget, IconEye } from '../components/icons'

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

export function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>()
  const lesson = LESSONS.find((l) => l.id === lessonId)
  const progress = getProgress()
  const done = lesson ? progress.completedLessons.includes(lesson.id) : false
  const [expanded, setExpanded] = useState<number | 'all'>(0)

  useEffect(() => {
    if (lesson) touchLesson(lesson.id)
  }, [lessonId])

  if (!lesson) return <div className="text-center py-12">الدرس غير موجود</div>

  const stage = STAGES.find((s) => s.id === lesson.stageId)
  const stageLessons = LESSONS.filter((l) => l.stageId === lesson.stageId)
  const currentIndex = stageLessons.findIndex((l) => l.id === lesson.id)
  const prev = currentIndex > 0 ? stageLessons[currentIndex - 1] : null
  const next = currentIndex < stageLessons.length - 1 ? stageLessons[currentIndex + 1] : null

  const revealedCount = expanded === 'all' ? lesson.blocks.length : Math.min((expanded ?? 0) + 1, lesson.blocks.length)
  const isVisible = (i: number) => expanded === 'all' || i <= expanded
  const isNext = (i: number) => expanded !== 'all' && i === expanded + 1

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

      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 sm:text-2xl">{lesson.title}</h1>
          {lesson.subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{lesson.subtitle}</p>}
        </div>
        {expanded !== 'all' && (
          <button
            onClick={() => setExpanded('all')}
            className="shrink-0 inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <IconEye size={14} /> عرض كل الدرس
          </button>
        )}
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
          <span>محتوى الدرس</span>
          <span>{revealedCount} / {lesson.blocks.length}</span>
        </div>
        <ProgressBar value={(revealedCount / lesson.blocks.length) * 100} />
      </div>

      <div className="space-y-4">
        {lesson.blocks.map((block, i) => (
          <div key={i} className="space-y-3">
            {isVisible(i) && <LessonBlockView block={block} />}
            {isNext(i) && (
              <Button onClick={() => setExpanded(i)} variant="ghost" className="w-full border border-dashed border-slate-300 dark:border-slate-600">
                <IconDown size={16} /> اضغط كمان عشان تكمل — {TYPE_LABEL[block.type] ?? 'جزء جديد'}
              </Button>
            )}
          </div>
        ))}
      </div>

      {expanded !== 'all' && (
        <div className="text-center">
          <Button onClick={() => setExpanded('all')} variant="secondary" className="w-full sm:w-auto">
            <IconEye size={16} /> استعرض باقي الدرس
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