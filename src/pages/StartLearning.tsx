import { Link } from 'react-router-dom'
import { Card, ProgressBar } from '../components/ui'
import { IconStage, IconCheck, IconTarget } from '../components/icons'
import { STAGES } from '../data/stages'
import { getProgress } from '../lib/progress'

export function StartLearning() {
  const progress = getProgress()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 sm:text-2xl">ابدأ التعلم</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          امشي خطوة خطوة — كل مرحلة بتبنّي على اللي قبلها
        </p>
      </div>

      <ProgressBar value={(progress.completedStages.length / STAGES.length) * 100} className="max-w-xl" />

      <div className="space-y-4">
        {STAGES.map((stage) => {
          const done = progress.completedStages.includes(stage.id)
          const lessonsDone = stage.lessons.filter((l) => progress.completedLessons.includes(l)).length
          const pct = Math.round((lessonsDone / stage.lessons.length) * 100)

          return (
            <Card key={stage.id} className="overflow-hidden">
              <Link to={`/stages/${stage.id}`} className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
                  <IconStage name={stage.icon} size={24} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
                      المرحلة {stage.id}: {stage.title}
                    </h2>
                    {done && (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        <IconCheck size={13} /> مكتمل
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{stage.tagline}</p>
                  <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                    <IconTarget size={12} className="shrink-0" /> {stage.goal}
                  </p>
                  <div className="mt-2 flex items-center gap-3">
                    <ProgressBar value={pct} className="flex-1" />
                    <span className="text-xs font-bold text-slate-400">{lessonsDone}/{stage.lessons.length}</span>
                  </div>
                </div>
              </Link>
            </Card>
          )
        })}
      </div>
    </div>
  )
}