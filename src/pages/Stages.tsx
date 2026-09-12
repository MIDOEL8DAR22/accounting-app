import { useParams, Link } from 'react-router-dom'
import { Card, Button, ProgressBar } from '../components/ui'
import { STAGES, LESSONS } from '../data/stages'
import { getProgress, completeStage } from '../lib/progress'

export function Stages() {
  const { stageId } = useParams<{ stageId: string }>()
  const id = parseInt(stageId ?? '1', 10)
  const stage = STAGES.find((s) => s.id === id)
  const progress = getProgress()

  if (!stage) return <div className="text-center py-12">المرحلة غير موجودة</div>

  const stageLessons = LESSONS.filter((l) => l.stageId === id)
  const lessonsDone = stage.lessons.filter((l) => progress.completedLessons.includes(l)).length
  const pct = Math.round((lessonsDone / stage.lessons.length) * 100)

  return (
    <div className="space-y-6">
      <Link to="/learn" className="text-sm font-bold text-blue-600 hover:underline dark:text-blue-400">← العودة لمراحل التعلم</Link>

      <div>
        <div className="flex items-center gap-3">
          <span className="text-3xl">{stage.icon}</span>
          <div>
            <h1 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 sm:text-2xl">
              المرحلة {stage.id}: {stage.title}
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{stage.tagline}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center gap-3">
          <ProgressBar value={pct} className="flex-1" />
          <span className="text-xs font-bold text-slate-500">{lessonsDone}/{stage.lessons.length}</span>
        </div>
      </div>

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-500/30 dark:bg-blue-500/10">
        <div className="text-sm font-bold text-blue-800 dark:text-blue-200">
          🎯 الهدف: {stage.goal}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {stageLessons.map((lesson, i) => {
          const done = progress.completedLessons.includes(lesson.id)
          return (
            <Link key={lesson.id} to={`/lesson/${lesson.id}`}>
              <Card className="flex items-center gap-3 transition hover:border-blue-300 dark:hover:border-blue-500/40">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-extrabold ${
                  done ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300'
                }`}>
                  {done ? '✓' : i + 1}
                </div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-bold text-slate-800 dark:text-slate-100">{lesson.title}</div>
                  {lesson.subtitle && <div className="truncate text-xs text-slate-500 dark:text-slate-400">{lesson.subtitle}</div>}
                </div>
              </Card>
            </Link>
          )
        })}
      </div>

      {!progress.completedStages.includes(id) && (
        <div className="text-center">
          <Button onClick={() => { completeStage(id) }} variant="success">
            ✅ أنجز المرحلة {stage.id}
          </Button>
        </div>
      )}
    </div>
  )
}