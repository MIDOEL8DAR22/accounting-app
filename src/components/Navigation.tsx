import { useState } from 'react'
import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
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
} from './icons'

const NAV_ITEMS: { to: string; label: string; icon: ReactNode }[] = [
  { to: '/', label: 'الرئيسية', icon: <IconHome size={17} /> },
  { to: '/learn', label: 'ابدأ التعلم', icon: <IconBookOpen size={17} /> },
  { to: '/account-types', label: 'أنواع الحسابات', icon: <IconTag size={17} /> },
  { to: '/exercises', label: 'تمارين', icon: <IconPen size={17} /> },
  { to: '/quiz', label: 'اختبار', icon: <IconClipboard size={17} /> },
  { to: '/solver', label: 'حل أي سؤال', icon: <IconBrain size={17} /> },
  { to: '/builder', label: 'منشئ القيد', icon: <IconNotebook size={17} /> },
  { to: '/dictionary', label: 'قاموس الحسابات', icon: <IconSearch size={17} /> },
  { to: '/flashcards', label: 'بطاقات الحفظ', icon: <IconLayers size={17} /> },
  { to: '/reference', label: 'المرجع السريع', icon: <IconList size={17} /> },
  { to: '/summary', label: 'تلخيص المحاسبة', icon: <IconBookMark size={17} /> },
  { to: '/progress', label: 'تقدمك', icon: <IconChartUp size={17} /> },
  { to: '/settings', label: 'الإعدادات', icon: <IconSettings size={17} /> },
]

export function Navigation() {
  const [open, setOpen] = useState(false)
  const { theme, toggle } = useTheme()

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-3 py-2.5 sm:px-4">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-600/30">
            <IconBookOpen size={20} />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-extrabold text-slate-800 dark:text-slate-100">المحاسب الذكي</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">اتعلم المحاسبة صح</div>
          </div>
        </NavLink>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
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
        <nav className="border-t border-slate-200 bg-white pb-2 dark:border-slate-700 dark:bg-slate-900 md:hidden">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-1 px-3 pt-2 sm:px-4">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
                      : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`
                }
              >
                <span className="text-slate-400">{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}