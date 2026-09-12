import { Link } from 'react-router-dom'
import type { ReactElement } from 'react'
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
  IconRocket,
  IconLayers,
  IconSearch,
  IconList,
  IconBookOpen,
  IconBookMark,
  IconClock,
  IconFlame,
  IconBriefcase,
  IconSpark,
  IconArrowLeft,
} from '../components/icons'

interface QuickAction {
  to: string
  title: string
  desc: string
  icon: ReactElement
  grad?: string
  hot?: boolean
  chip?: string
  wide?: boolean
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    to: '/accountant',
    title: 'اسأل المحاسب الخبير',
    desc: 'رد حي مجاني على أي سؤال محاسبي',
    icon: <IconSpark size={18} />,
    grad: 'linear-gradient(to left, #7c3aed, #6d28d9)',
    hot: true,
  },
  {
    to: '/practical',
    title: 'التطبيق العملي على الشغل',
    desc: '8 سيناريوهات شغل حقيقي كاملة',
    icon: <IconBriefcase size={18} />,
    grad: 'linear-gradient(to left, #0d9488, #059669)',
    hot: true,
  },
  {
    to: '/builder',
    title: 'منشئ القيد اليومي',
    desc: 'حوّل العملية لقيد مظبوط',
    icon: <IconRocket size={17} />,
    chip: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
  },
  {
    to: '/summary',
    title: 'تلخيص المحاسبة',
    desc: 'أهم المفاهيم في لمحة',
    icon: <IconBookMark size={17} />,
    chip: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  },
  {
    to: '/flashcards',
    title: 'بطاقات الحفظ السريع',
    desc: 'ذاكر بالتكرار المتباعد',
    icon: <IconLayers size={17} />,
    chip: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
  },
  {
    to: '/dictionary',
    title: 'قاموس استخراج الحسابات',
    desc: 'ابحث عن اسم أي حساب',
    icon: <IconSearch size={17} />,
    chip: 'bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300',
  },
  {
    to: '/reference',
    title: 'المرجع السريع',
    desc: 'القواعد والنماذج الجاهزة',
    icon: <IconList size={17} />,
    chip: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300',
    wide: true,
  },
]

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

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Stages list */}
        <Card>
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
            <div className="grid grid-cols-1 gap-2">
              {QUICK_ACTIONS.slice(0, 2).map((a) => (
                <Link key={a.to} to={a.to} className="group relative flex items-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-l p-4 text-white shadow-md transition hover:brightness-110 hover:shadow-lg active:scale-[0.99]" style={a.grad ? { backgroundImage: a.grad } : undefined}>
                  <div className="absolute -left-6 -top-6 h-20 w-20 rounded-full bg-white/10 blur-xl" />
                  {a.hot && (
                    <span className="absolute top-2 left-2 rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold">
                      الأكثر استخدامًا
                    </span>
                  )}
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 text-white">
                    {a.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-extrabold sm:text-base">{a.title}</div>
                    <div className="text-xs text-white/85">{a.desc}</div>
                  </div>
                  <IconArrowLeft size={16} className="shrink-0 text-white/70 transition group-hover:-translate-x-0.5" />
                </Link>
              ))}
            </div>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {QUICK_ACTIONS.slice(2).map((a) => (
                <Link
                  key={a.to}
                  to={a.to}
                  className={`group flex items-center gap-2.5 rounded-xl border border-slate-200 bg-white p-3 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-sm active:scale-[0.99] dark:border-slate-700 dark:bg-slate-800/70 ${
                    a.wide ? 'col-span-2' : ''
                  }`}
                >
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${a.chip ?? ''}`}>
                    {a.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-extrabold text-slate-800 dark:text-slate-100 sm:text-sm">
                      {a.title}
                    </div>
                    <div className="text-[11px] leading-tight text-slate-500 dark:text-slate-400">{a.desc}</div>
                  </div>
                  <IconArrowLeft size={14} className="shrink-0 text-slate-300 transition group-hover:text-blue-500 dark:text-slate-600" />
                </Link>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}