import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useTheme } from '../context/theme'

const NAV_ITEMS = [
  { to: '/', label: 'الرئيسية', icon: '🏠' },
  { to: '/learn', label: 'ابدأ التعلم', icon: '📚' },
  { to: '/account-types', label: 'أنواع الحسابات', icon: '🏷️' },
  { to: '/exercises', label: 'تمارين', icon: '✏️' },
  { to: '/quiz', label: 'اختبار', icon: '📝' },
  { to: '/solver', label: 'حل أي سؤال', icon: '🧠' },
  { to: '/builder', label: 'منشئ القيد', icon: '📒' },
  { to: '/dictionary', label: 'قاموس الحسابات', icon: '🔎' },
  { to: '/flashcards', label: 'بطاقات الحفظ', icon: '🗃️' },
  { to: '/reference', label: 'المرجع السريع', icon: '📋' },
  { to: '/progress', label: 'تقدمك', icon: '📈' },
  { to: '/settings', label: 'الإعدادات', icon: '⚙️' },
]

export function Navigation() {
  const [open, setOpen] = useState(false)
  const { theme, toggle } = useTheme()

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-700 dark:bg-slate-900/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-3 py-2.5 sm:px-4">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-lg text-white shadow-sm shadow-blue-600/30">
            💼
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
                `rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                }`
              }
            >
              <span className="ml-1">{item.icon}</span>
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
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-lg dark:bg-slate-800 md:hidden"
            aria-label="القائمة"
          >
            {open ? '✕' : '☰'}
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
                <span>{item.icon}</span>
                {item.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}