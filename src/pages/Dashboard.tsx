import { Link } from 'react-router-dom'
import { Card, StatCard, Button, ProgressBar } from '../components/ui'
import { getProgress, getProgressPercentage, getCurrentStage } from '../lib/progress'
import { STAGES, LESSONS } from '../data/stages'

export function Dashboard() {
  const progress = getProgress()
  const pct = getProgressPercentage()
  const stage = getCurrentStage()
  const currentStage = STAGES.find((s) => s.id === stage)
  const lastLesson = progress.lastLessonId
    ? LESSONS.find((l) => l.id === progress.lastLessonId)
    : null
  const accuracy = progress.exercisesSolved > 0
    ? Math.round((progress.correctAnswers / progress.exercisesSolved) * 100)
    : 0

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-l from-blue-700 via-blue-600 to-indigo-700 p-6 text-white shadow-lg shadow-blue-700/20 sm:p-8">
        <div className="mb-1 text-sm font-semibold text-blue-200">أهلاً بيك 👋</div>
        <h1 className="text-2xl font-extrabold sm:text-3xl">منصة المحاسب الذكي</h1>
        <p className="mt-1 text-sm text-blue-100 sm:text-base">
          اتعلم المحاسبة من الصفر إلى إتقان القيود اليومية
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to={lastLesson ? `/lesson/${lastLesson.id}` : `/stages/${stage}`}>
            <Button className="bg-white text-blue-700 hover:bg-blue-50">
              {lastLesson ? '▶️ تكمّل التعلم' : '🚀 ابدأ التعلم'}
            </Button>
          </Link>
          <Link to="/solver">
            <Button variant="secondary" className="bg-blue-900/40 text-white hover:bg-blue-900/60 dark:bg-slate-800/60">
              🧠 حل أي سؤال محاسبي
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard icon="📍" label="المرحلة الحالية" value={currentStage ? `المرحلة ${currentStage.id}` : '—'} sub={currentStage?.title} color="blue" />
        <StatCard icon="📊" label="نسبة التقدم" value={`${pct}%`} sub="لكل المراحل" color="green" />
        <StatCard icon="✅" label="الأسئلة اللي اتحلّت" value={progress.exercisesSolved} sub={progress.correctAnswers + progress.wrongAnswers > 0 ? `دقة ${accuracy}%` : 'ابدأ حلّ دلوقتي'} color="amber" />
        <StatCard icon="⭐" label="نقاطك" value={progress.totalPoints} sub={`ستريك ${progress.currentStreak} أيام 🔥`} color="purple" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-700 dark:text-slate-200">📚 المراحل الدراسية</h2>
            <Link to="/learn" className="text-xs font-bold text-blue-600 hover:underline dark:text-blue-400">عرض الكل ←</Link>
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
                    <div className="text-2xl">{done ? '✅' : at ? '▶️' : s.icon}</div>
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
          <Card>
            <h2 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-700 dark:text-slate-200">🕐 آخر درس</h2>
            {lastLesson ? (
              <div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-100">{lastLesson.title}</div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  المرحلة {lastLesson.stageId}
                </div>
                <Link to={`/lesson/${lastLesson.id}`} className="mt-3 block">
                  <Button className="w-full">تكمّل من هنا</Button>
                </Link>
              </div>
            ) : (
              <div className="text-sm text-slate-500 dark:text-slate-400">
                لسه مبدأتش. ابدأ أول درس وهيكون واصل هنا.
              </div>
            )}
          </Card>

          <Card>
            <h2 className="mb-3 text-sm font-extrabold text-slate-700 dark:text-slate-200">🎯 أنشطة سريعة</h2>
            <div className="space-y-2">
              <Link to="/builder">
                <Button variant="secondary" className="w-full">📒 منشئ القيد اليومي</Button>
              </Link>
              <Link to="/flashcards">
                <Button variant="secondary" className="w-full">🗃️ بطاقات الحفظ السريع</Button>
              </Link>
              <Link to="/dictionary">
                <Button variant="secondary" className="w-full">🔎 قاموس استخراج الحسابات</Button>
              </Link>
              <Link to="/reference">
                <Button variant="secondary" className="w-full">📋 الجدول الذهبي</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}