import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { Button } from '../components/ui'
import { LessonBlockView } from '../components/LessonBlocks'
import { LESSONS, STAGES } from '../data/stages'
import { getProgress, completeLesson } from '../lib/progress'

export function LessonPage() {
  const { lessonId } = useParams<{ lessonId: string }>()
  const lesson = LESSONS.find((l) => l.id === lessonId)
  const progress = getProgress()
  const done = lesson ? progress.completedLessons.includes(lesson.id) : false
  const [expanded, setExpanded] = useState<number | null>(0)

  if (!lesson) return <div className="text-center py-12">الدرس غير موجود</div>

  const stage = STAGES.find((s) => s.id === lesson.stageId)
  const stageLessons = LESSONS.filter((l) => l.stageId === lesson.stageId)
  const currentIndex = stageLessons.findIndex((l) => l.id === lesson.id)
  const prev = currentIndex > 0 ? stageLessons[currentIndex - 1] : null
  const next = currentIndex < stageLessons.length - 1 ? stageLessons[currentIndex + 1] : null

  const handleComplete = () => {
    if (lesson.id && !done) {
      completeLesson(lesson.id)
      setExpanded(null)
    }
  }

  return (
    <div className="space-y-6">
      <Link to={`/stages/${lesson.stageId}`} className="text-sm font-bold text-blue-600 hover:underline dark:text-blue-400">
        ← العودة: المرحلة {lesson.stageId} — {stage?.title}
      </Link>

      <div>
        <h1 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 sm:text-2xl">{lesson.title}</h1>
        {lesson.subtitle && <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{lesson.subtitle}</p>}
      </div>

      <div className="space-y-4">
        {lesson.blocks.map((block, i) => {
          const isVisible = i <= (expanded ?? 0)
          const isNext = i === (expanded ?? 0) + 1
          return (
            <div key={i} className="space-y-3">
              {isVisible && <LessonBlockView block={block} />}
              {isNext && (
                <Button onClick={() => setExpanded(i)} variant="ghost" className="w-full border border-dashed border-slate-300 dark:border-slate-600">
                  ▼ اضغط كمان عشان تكمل
                </Button>
              )}
            </div>
          )
        })}
      </div>

      {expanded !== null && expanded >= lesson.blocks.length - 1 && (
        <div className="text-center space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          {!done ? (
            <Button onClick={handleComplete} variant="success" className="px-8">
              ✅ أتممت الدرس!
            </Button>
          ) : (
            <div className="text-sm font-bold text-emerald-600 dark:text-emerald-400">✅ انت خلّيت الدرس ده</div>
          )}
        </div>
      )}

      <div className="flex items-center justify-between gap-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        {prev ? (
          <Link to={`/lesson/${prev.id}`} className="flex-1">
            <Button variant="secondary" className="w-full">← الدرس اللي فات</Button>
          </Link>
        ) : <div />}
        {next ? (
          <Link to={`/lesson/${next.id}`} className="flex-1">
            <Button className="w-full">الدرس الجاي ←</Button>
          </Link>
        ) : (
          <Link to="/learn" className="flex-1">
            <Button variant="success" className="w-full">🎯 رجوع للمراحل</Button>
          </Link>
        )}
      </div>
    </div>
  )
}