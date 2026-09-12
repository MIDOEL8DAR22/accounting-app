import type { ReactNode } from 'react'
import { cn } from '../lib/cn'

export function Card({ children, className, onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 shadow-sm p-4 sm:p-5',
        onClick && 'cursor-pointer transition hover:shadow-md hover:-translate-y-0.5',
        className
      )}
    >
      {children}
    </div>
  )
}

export function Button({
  children,
  variant = 'primary',
  className,
  disabled,
  onClick,
  type = 'button',
}: {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'danger' | 'ghost' | 'warning'
  className?: string
  disabled?: boolean
  onClick?: () => void
  type?: 'button' | 'submit'
}) {
  const variants: Record<string, string> = {
    primary:
      'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm shadow-blue-600/20',
    secondary:
      'bg-slate-100 text-slate-800 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600',
    success:
      'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-600/20',
    danger: 'bg-rose-600 text-white hover:bg-rose-700',
    warning: 'bg-amber-500 text-white hover:bg-amber-600',
    ghost:
      'bg-transparent text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700',
  }
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400/50',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        className
      )}
    >
      {children}
    </button>
  )
}

export function Badge({ children, color = 'slate', className }: { children: ReactNode; color?: string; className?: string }) {
  const colors: Record<string, string> = {
    slate: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
    blue: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
    green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
    red: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
    amber: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
    purple: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300',
  }
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold', colors[color], className)}>
      {children}
    </span>
  )
}

export function ProgressBar({ value, color = 'bg-blue-600', className }: { value: number; color?: string; className?: string }) {
  return (
    <div className={cn('h-2.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700', className)}>
      <div
        className={cn('h-full rounded-full transition-all duration-500', color)}
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  )
}

export function DifficultyStars({ level }: { level: number }) {
  return (
    <span className="text-amber-500" title={`الصعوبة ${level}/5`}>
      {'⭐'.repeat(level)}{'☆'.repeat(5 - level)}
    </span>
  )
}

export function StatCard({ icon, label, value, sub, color = 'blue' }: { icon: string; label: string; value: ReactNode; sub?: string; color?: string }) {
  const ring: Record<string, string> = {
    blue: 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400',
    green: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400',
    red: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400',
    purple: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400',
  }
  return (
    <Card className="flex items-center gap-3">
      <div className={cn('flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-2xl', ring[color])}>{icon}</div>
      <div className="min-w-0">
        <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</div>
        <div className="text-xl font-extrabold text-slate-800 dark:text-slate-100">{value}</div>
        {sub && <div className="text-xs text-slate-400 dark:text-slate-500">{sub}</div>}
      </div>
    </Card>
  )
}

export function EmptyState({ icon, title, subtitle, action }: { icon: string; title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
      <div className="text-5xl">{icon}</div>
      <div className="text-lg font-bold text-slate-700 dark:text-slate-200">{title}</div>
      {subtitle && <div className="max-w-sm text-sm text-slate-500 dark:text-slate-400">{subtitle}</div>}
      {action}
    </div>
  )
}