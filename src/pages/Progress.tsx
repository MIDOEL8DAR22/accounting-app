import { Link } from 'react-router-dom'
import { Card, ProgressBar, Button, Badge } from '../components/ui'
import {
  getProgress,
  getProgressPercentage,
  getWeakTopics,
  resetProgress,
} from '../lib/progress'
import { STAGES } from '../data/stages'
import { useState } from 'react'
import { IconChartUp, IconTrash, IconFlame, IconTarget, IconShield, IconBook, IconAlert } from '../components/icons'

export function Progress() {
  const [refresh, setRefresh] = useState(0)
  const progress = getProgress()
  const pct = getProgressPercentage()
  const weak = getWeakTopics()

  const accuracy = progress.exercisesSolved > 0
    ? Math.round((progress.correctAnswers / progress.exercisesSolved) * 100)
    : 0

  const handleReset = () => {
    if (window.confirm('متأكد إنك عايز تمسح كل تقدمك؟')) {
      resetProgress()
      setRefresh(refresh + 1)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-xl font-extrabold text-slate-800 dark:text-slate-100">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"><IconChartUp size={18} /></span>
          تقدمك
        </h1>
        <Button variant="danger" onClick={handleReset} className="text-xs"><IconTrash size={13} /> إعادة التقدم</Button>
      </div>

      <Card>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-bold text-slate-600 dark:text-slate-300">إجمالي التقدم</span>
          <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">{pct}%</span>
        </div>
        <ProgressBar value={pct} />
        <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">
          {progress.completedStages.length} من {STAGES.length} مراحل مكتملة
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Card className="text-center">
          <div className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">{progress.exercisesSolved}</div>
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400">الأسئلة اتحلّت</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{accuracy}%</div>
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400">نسبة الدقة</div>
        </Card>
        <Card className="text-center">
          <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{progress.totalPoints}</div>
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400">نقاط</div>
        </Card>
        <Card className="text-center">
          <div className="flex items-center justify-center gap-1 text-2xl font-extrabold text-purple-600 dark:text-purple-400">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-50 text-purple-500 dark:bg-purple-500/10 dark:text-purple-400"><IconFlame size={20} /></span>
            <span>{progress.currentStreak}</span>
          </div>
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400">أيام السلسلة</div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-700 dark:text-slate-200"><span className="text-rose-500"><IconTarget size={16} /></span> مناطق الضعف</h2>
          {weak.length > 0 ? (
            <div className="space-y-2">
              {weak.map((topic) => (
                <div key={topic} className="flex items-center justify-between rounded-lg bg-rose-50 px-3 py-2 dark:bg-rose-500/10">
                  <span className="flex items-center gap-2 text-sm font-bold text-rose-700 dark:text-rose-300"><IconAlert size={14} /> {topic}</span>
                  <Link to="/exercises">
                    <Button variant="ghost" className="text-xs">راجع دلوقتي</Button>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-slate-500 dark:text-slate-400">لسه مفيش أخطاء — استمر!</div>
          )}
        </Card>

        <Card>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-700 dark:text-slate-200"><span className="text-emerald-500"><IconShield size={16} /></span> نقاط القوة</h2>
          {Object.entries(progress.strongTopics).length > 0 ? (
            <div className="space-y-2">
              {Object.entries(progress.strongTopics)
                .sort((a, b) => b[1] - a[1])
                .slice(0, 5)
                .map(([topic, count]) => (
                  <div key={topic} className="flex items-center justify-between rounded-lg bg-emerald-50 px-3 py-2 dark:bg-emerald-500/10">
                    <span className="text-sm font-bold text-emerald-700 dark:text-emerald-300">{topic}</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{count} صح</span>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-sm text-slate-500 dark:text-slate-400">ابدأ التمارين عشان تشوف نقاط قوتك</div>
          )}
        </Card>
      </div>

      <Card>
        <h2 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-700 dark:text-slate-200"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"><IconBook size={16} /></span> المراحل</h2>
        <div className="space-y-3">
          {STAGES.map((s) => {
            const done = progress.completedStages.includes(s.id)
            const lessonsDone = s.lessons.filter((l) => progress.completedLessons.includes(l)).length
            const p = Math.round((lessonsDone / s.lessons.length) * 100)
            return (
              <div key={s.id} className="flex items-center gap-3">
                <Badge color={done ? 'green' : p > 0 ? 'blue' : 'slate'} className="w-10 justify-center">{s.id}</Badge>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold truncate text-slate-700 dark:text-slate-200">{s.title}</span>
                    <span className="text-slate-400">{lessonsDone}/{s.lessons.length}</span>
                  </div>
                  <ProgressBar value={p} className="mt-1 h-1.5" />
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}