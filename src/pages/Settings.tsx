import { useState } from 'react'
import { Card, Button, Badge } from '../components/ui'
import { useTheme } from '../context/theme'
import { resetProgress } from '../lib/progress'
import { IconSettings, IconSun, IconMoon, IconCheckCircle, IconTrash } from '../components/icons'

export function Settings() {
  const { theme, toggle } = useTheme()
  const [resetDone, setResetDone] = useState(false)
  const [voice, setVoice] = useState(true)
  const [autoAdvance, setAutoAdvance] = useState(true)

  const handleReset = () => {
    if (window.confirm('متأكد؟ ده هيمسح كل تقدمك والنقاط.')) {
      resetProgress()
      setResetDone(true)
      setTimeout(() => setResetDone(false), 2500)
    }
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <h1 className="flex items-center gap-2 text-xl font-extrabold text-slate-800 dark:text-slate-100">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"><IconSettings size={18} /></span>
        الإعدادات
      </h1>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-extrabold text-slate-700 dark:text-slate-200">الوضع الليلي</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">بدّل بين الوضع النهاري والليلي</div>
          </div>
          <Badge color={theme === 'dark' ? 'slate' : 'amber'}>
            {theme === 'dark' ? (<span className="inline-flex items-center gap-1"><IconMoon size={12} /> ليلي</span>) : (<span className="inline-flex items-center gap-1"><IconSun size={12} /> نهاري</span>)}
          </Badge>
        </div>
        <Button
          variant={theme === 'dark' ? 'secondary' : 'primary'}
          className="mt-3 w-full"
          onClick={toggle}
        >
          {theme === 'dark' ? (<span className="inline-flex items-center gap-1"><IconSun size={15} /> بدّل للنهاري</span>) : (<span className="inline-flex items-center gap-1"><IconMoon size={15} /> بدّل لليلي</span>)}
        </Button>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-extrabold text-slate-700 dark:text-slate-200">الرجوع التلقائي</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">يرجّع إجاباتك فورًا في التمارين</div>
          </div>
          <button
            onClick={() => setAutoAdvance(!autoAdvance)}
            className={`relative h-6 w-11 rounded-full transition ${autoAdvance ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${autoAdvance ? 'right-0.5' : 'right-[22px]'}`} />
          </button>
        </div>
      </Card>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-extrabold text-slate-700 dark:text-slate-200">التذكير بالتعلم</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">مشغّل (مبدئي — هيتفعل في النسخة الجاية)</div>
          </div>
          <button
            onClick={() => setVoice(!voice)}
            className={`relative h-6 w-11 rounded-full transition ${voice ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'}`}
          >
            <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${voice ? 'right-0.5' : 'right-[22px]'}`} />
          </button>
        </div>
      </Card>

      <Card>
        <div className="text-sm font-extrabold text-slate-700 dark:text-slate-200 mb-1">بيانات التقدم</div>
        <div className="text-xs text-slate-500 dark:text-slate-400 mb-3">
          كل تقدمك محفوظ محليًا على جهازك (LocalStorage). مش بنبعت بيانات لأي حد.
        </div>
        <Button variant="danger" className="w-full" onClick={handleReset}>
          {resetDone ? (<span className="inline-flex items-center gap-1"><IconCheckCircle size={15} /> اتمسح</span>) : (<span className="inline-flex items-center gap-1"><IconTrash size={15} /> امسح كل التقدم</span>)}
        </Button>
      </Card>
    </div>
  )
}