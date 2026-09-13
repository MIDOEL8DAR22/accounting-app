import { useState } from 'react'
import type { ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useTheme } from '../context/theme'
import {
  IconHome,
  IconBookOpen,
  IconTag,
  IconPen,
  IconClipboard,
  IconBrain,
  IconNotebook,
  IconSearch,
  IconLayers,
  IconList,
  IconChartUp,
  IconSettings,
  IconBookMark,
  IconSun,
  IconMoon,
  IconMenu,
  IconX,
  IconDown,
  IconBriefcase,
  IconQuestion,
  IconSpeaker,
} from './icons'

const MAIN_ITEMS: { to: string; label: string; icon: ReactNode }[] = [
  { to: '/', label: 'الرئيسية', icon: <IconHome size={17} /> },
  { to: '/learn', label: 'ابدأ التعلم', icon: <IconBookOpen size={17} /> },
  { to: '/summary', label: 'التلخيص', icon: <IconBookMark size={17} /> },
  { to: '/exercises', label: 'تمارين', icon: <IconPen size={17} /> },
  { to: '/quiz', label: 'اختبار', icon: <IconClipboard size={17} /> },
]

const TOOL_ITEMS: { to: string; label: string; icon: ReactNode }[] = [
  { to: '/accountant', label: 'المحاسب الخبير', icon: <IconQuestion size={17} /> },
  { to: '/practical', label: 'التطبيق العملي', icon: <IconBriefcase size={17} /> },
  { to: '/account-types', label: 'أنواع الحسابات', icon: <IconTag size={17} /> },
  { to: '/english', label: 'إنجليزي محاسبي', icon: <IconSpeaker size={17} /> },
  { to: '/solver', label: 'حل أي سؤال', icon: <IconBrain size={17} /> },
  { to: '/builder', label: 'منشئ القيد', icon: <IconNotebook size={17} /> },
  { to: '/dictionary', label: 'قاموس الحسابات', icon: <IconSearch size={17} /> },
  { to: '/flashcards', label: 'بطاقات الحفظ', icon: <IconLayers size={17} /> },
  { to: '/reference', label: 'المرجع السريع', icon: <IconList size={17} /> },
  { to: '/progress', label: 'تقدمك', icon: <IconChartUp size={17} /> },
  { to: '/settings', label: 'الإعدادات', icon: <IconSettings size={17} /> },
]

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm font-semibold transition-colors ${
    isActive
      ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
  }`

export function Navigation() {
  const [open, setOpen] = useState(false)
  const [toolsOpen, setToolsOpen] = useState(false)
  const { theme, toggle } = useTheme()
  const { pathname } = useLocation()
  const toolsActive = TOOL_ITEMS.some((item) => item.to === pathname)

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-3 py-2 sm:px-4">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-600/30">
            <IconBookOpen size={20} />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-extrabold text-slate-800 dark:text-slate-100">المحاسب الذكي</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">اتعلم المحاسبة صح</div>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-0.5 md:flex">
          {MAIN_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={linkClass}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}

          <div className="relative mx-1">
            <button
              onClick={() => setToolsOpen(!toolsOpen)}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-semibold transition-colors ${
                toolsOpen || toolsActive
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
                  : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <IconDown size={14} className={toolsOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />
              الأدوات
            </button>

            {toolsOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setToolsOpen(false)} />
                <div className="absolute right-0 top-full z-20 mt-2 w-60 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10 dark:border-slate-700 dark:bg-slate-800">
                  <div className="grid gap-0.5">
                    {TOOL_ITEMS.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        onClick={() => setToolsOpen(false)}
                        className={linkClass}
                      >
                        <span className="text-slate-400">{item.icon}</span>
                        {item.label}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-lg dark:bg-slate-800"
            aria-label="تبديل الوضع"
            title="تبديل الوضع الليلي/النهاري"
          >
            {theme === 'dark' ? <IconSun size={19} /> : <IconMoon size={19} />}
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-lg dark:bg-slate-800 md:hidden"
            aria-label="القائمة"
          >
            {open ? <IconX size={19} /> : <IconMenu size={19} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-slate-200 bg-white pb-3 dark:border-slate-700 dark:bg-slate-900 md:hidden">
          <div className="mx-auto max-w-6xl px-3 sm:px-4">
            <div className="pt-2 text-[11px] font-extrabold text-slate-400 dark:text-slate-500">التعلّم</div>
            <div className="grid grid-cols-2 gap-1 pt-1">
              {MAIN_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setOpen(false)}
                  className={linkClass}
                >
                  <span className="text-slate-400">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </div>
            <div className="pt-3 text-[11px] font-extrabold text-slate-400 dark:text-slate-500">الأدوات</div>
            <div className="grid grid-cols-2 gap-1 pt-1">
              {TOOL_ITEMS.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={linkClass}
                >
                  <span className="text-slate-400">{item.icon}</span>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        </nav>
      )}
    </header>
  )
}