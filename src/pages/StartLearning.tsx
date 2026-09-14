import { Link } from 'react-router-dom'
import { Card, ProgressBar, Button, Badge } from '../components/ui'
import { IconStage, IconCheck, IconTarget, IconPlay, IconBookOpen, IconSpeaker } from '../components/icons'
import { STAGES } from '../data/stages'
import { COURSE, COURSE_LESSONS } from '../data/course'
import { getProgress } from '../lib/progress'

export function StartLearning() {
  const progress = getProgress()
  const courseDone = COURSE_LESSONS.filter((l) => progress.completedLessons.includes(l.id)).length
  const coursePct = Math.round((courseDone / COURSE_LESSONS.length) * 100)
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 sm:text-2xl">ابدأ التعلم</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          امشي خطوة خطوة — كل مرحلة بتبنّي على اللي قبلها
        </p>
      </div>

      <section className="space-y-3">
        <div className="text-[11px] font-extrabold uppercase tracking-wide text-slate-400 dark:text-slate-500">كورسات</div>
        <Link to="/course" className="block">
          <Card className="relative overflow-hidden border-2 border-orange-200 bg-gradient-to-l from-orange-50 to-amber-50 dark:border-orange-500/30 dark:from-orange-500/10 dark:to-amber-500/10">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-rose-500 text-white shadow-md shadow-orange-500/30">
                <IconBookOpen size={24} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-base font-extrabold text-slate-800 dark:text-slate-100">{COURSE.title}</h2>
                  <Badge color="amber">الجديدة</Badge>
                </div>
                <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{COURSE.tagline}</p>
                <div className="mt-2 flex items-center gap-3">
                  <ProgressBar value={coursePct} color="bg-gradient-to-r from-amber-500 to-rose-500" className="flex-1" />
                  <span className="text-xs font-bold text-slate-400">{courseDone}/{COURSE_LESSONS.length} دروس خلصتها</span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold text-slate-500 dark:text-slate-400">
                  <span className="inline-flex items-center gap-1"><IconSpeaker size={13} className="text-orange-500" /> صوت عربي لكل درس</span>
                  <span className="inline-flex items-center gap-1"><IconTarget size={13} className="text-orange-500" /> اختبار على المحاضرة</span>
                </div>
              </div>
              <Button variant="warning" className="shrink-0 gap-1.5">
                <IconPlay size={15} /> شوف الكورس
              </Button>
            </div>
          </Card>
        </Link>
      </section>

      <section className="space-y-3">
        <div className="text-[11px] font-extrabold uppercase tracking-wide text-slate-400 dark:text-slate-500">المراحل</div>
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
      </section>
    </div>
  )
}