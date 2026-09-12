import { Link } from 'react-router-dom'
import { Card, StatCard, Button, ProgressBar } from '../components/ui'
import { getProgress, getProgressPercentage, getCurrentStage } from '../lib/progress'
import { STAGES, LESSONS } from '../data/stages'
import {
  IconChartUp,
  IconCheck,
  IconPlay,
  IconPin,
  IconTarget,
  IconBrain,
  IconNotebook,
  IconLayers,
  IconSearch,
  IconList,
  IconBookOpen,
  IconBookMark,
  IconClock,
  IconFlame,
} from '../components/icons'

export function Dashboard() {
  const progress = getProgress()
  const pct = getProgressPercentage()
  const stage = getCurrentStage()
  const currentStage = STAGES.find((s) => s.id === stage)
  const lastLessonId = progress.lastLessonId
  const accuracy = progress.exercisesSolved > 0
    ? Math.round((progress.correctAnswers / progress.exercisesSolved) * 100)
    : 0

  const resumeText = lastLessonId ? 'تكمّل التعلم' : 'ابدأ التعلم'
  const resumeLink = lastLessonId ? `/lesson/${lastLessonId}` : `/stages/${stage}`

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-l from-blue-700 via-blue-600 to-indigo-700 p-6 text-white shadow-lg shadow-blue-700/20 sm:p-8">
        <div className="absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-indigo-400/20 blur-2xl" />
        <div className="relative">
          <h1 className="text-2xl font-extrabold sm:text-3xl">المحاسب الذكي</h1>
          <p className="mt-1 text-sm text-blue-100 sm:text-base">
            اتعلم المحاسبة من الصفر إلى إتقان القيود اليومية
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to={resumeLink}>
              <Button variant="hero">
                <IconPlay size={16} /> {resumeText}
              </Button>
            </Link>
            <Link to="/solver">
              <Button variant="frost">
                <IconBrain size={16} /> حل أي سؤال محاسبي
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          icon={<IconPin size={22} />}
          label="المرحلة الحالية"
          value={currentStage ? `المرحلة ${currentStage.id}` : '—'}
          sub={currentStage?.title}
          color="blue"
        />
        <StatCard
          icon={<IconChartUp size={22} />}
          label="نسبة التقدم"
          value={`${pct}%`}
          sub="لكل المراحل"
          color="green"
        />
        <StatCard
          icon={<IconTarget size={22} />}
          label="تمارين محلولة"
          value={progress.exercisesSolved}
          sub={progress.correctAnswers + progress.wrongAnswers > 0 ? `دقة ${accuracy}%` : 'ابدأ حلّ دلوقتي'}
          color="amber"
        />
        <StatCard
          icon={<IconFlame size={22} />}
          label="النقاط"
          value={progress.totalPoints}
          sub={`ستريك ${progress.currentStreak} أيام`}
          color="purple"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Stages list */}
        <Card className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm font-extrabold text-slate-700 dark:text-slate-200">
              <IconBookOpen size={16} className="text-blue-500" /> المراحل الدراسية
            </h2>
            <Link to="/learn" className="text-xs font-bold text-blue-600 hover:underline dark:text-blue-400">عرض الكل</Link>
          </div>
          <ProgressBar value={pct} className="mb-4" />
          <div className="space-y-3">
            {STAGES.map((s) => {
              const done = progress.completedStages.includes(s.id)
              const at = s.id === stage
              return (
                <Link key={s.id} to={`/stages/${s.id}`}>
                  <div
                    className={`flex items-center gap-3 rounded-xl border p-3 transition ${
                      done
                        ? 'border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10'
                        : at
                          ? 'border-blue-300 bg-blue-50 dark:border-blue-500/40 dark:bg-blue-500/10'
                          : 'border-slate-200 bg-white hover:border-blue-300 dark:border-slate-700 dark:bg-slate-800/60'
                    }`}
                  >
                    <div className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold ${
                      done
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400'
                        : at
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400'
                    }`}>
                      {done ? <IconCheck size={18} /> : at ? <IconPlay size={16} /> : s.id}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-extrabold text-slate-800 dark:text-slate-100">
                        {s.title}
                      </div>
                      <div className="truncate text-xs text-slate-500 dark:text-slate-400">{s.tagline}</div>
                    </div>
                    <div className="text-xs font-bold text-slate-400">{s.lessons.length} دروس</div>
                  </div>
                </Link>
              )
            })}
          </div>
        </Card>

        <div className="space-y-4">
          {/* Resume */}
          <Card>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-700 dark:text-slate-200">
              <IconClock size={15} className="text-slate-400" /> آخر درس
            </h2>
            {lastLessonId ? (
              <div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                  {LESSONS.find((l) => l.id === lastLessonId)?.title ?? 'درس'}
                </div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  {progress.completedLessons.includes(lastLessonId) ? 'مكتمل — راجع أو ابدأ أول حاجة جديدة' : 'في انتظارك'}
                </div>
                <Link to={`/lesson/${lastLessonId}`} className="mt-3 block">
                  <Button className="w-full"><IconPlay size={15} /> تكمّل من هنا</Button>
                </Link>
              </div>
            ) : (
              <div className="text-sm text-slate-500 dark:text-slate-400">
                لسه مبدأتش. ابدأ أول درس وهيكون واصل هنا.
              </div>
            )}
          </Card>

          {/* Quick actions */}
          <Card>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-700 dark:text-slate-200">
              <IconTarget size={15} className="text-blue-500" /> أنشطة سريعة
            </h2>
            <div className="space-y-2">
              <Link to="/builder">
                <Button variant="secondary" className="w-full"><IconNotebook size={15} /> منشئ القيد اليومي</Button>
              </Link>
              <Link to="/summary">
                <Button variant="secondary" className="w-full"><IconBookMark size={15} /> تلخيص المحاسبة</Button>
              </Link>
              <Link to="/flashcards">
                <Button variant="secondary" className="w-full"><IconLayers size={15} /> بطاقات الحفظ السريع</Button>
              </Link>
              <Link to="/dictionary">
                <Button variant="secondary" className="w-full"><IconSearch size={15} /> قاموس استخراج الحسابات</Button>
              </Link>
              <Link to="/reference">
                <Button variant="secondary" className="w-full"><IconList size={15} /> المرجع السريع</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}