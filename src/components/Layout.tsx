import { Outlet } from 'react-router-dom'
import { Navigation } from './Navigation'

export function Layout() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 dark:bg-slate-950 dark:text-slate-100">
      <Navigation />
      <main className="mx-auto max-w-6xl px-3 py-4 sm:px-4 sm:py-6">
        <Outlet />
      </main>
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-400 dark:border-slate-800 dark:text-slate-500">
        <p className="font-bold">منصة المحاسب الذكي</p>
        <p>اتعلم المحاسبة من الصفر إلى إتقان القيود اليومية</p>
        <p className="mt-1">"متتخّطش القيد — تعلّم تفكّر تفكير المحاسب."</p>
      </footer>
    </div>
  )
}