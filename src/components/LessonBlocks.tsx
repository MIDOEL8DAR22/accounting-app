import type { LessonBlock } from '../types'
import { EntryTable } from './DecisionFlow'
import { cn } from '../lib/cn'
import { IconLightbulb, IconAlert, IconCheckCircle, IconRule, IconPen, IconListDot, IconBookMark, IconTarget } from './icons'

export function LessonBlockView({ block }: { block: LessonBlock }) {
  switch (block.type) {
    case 'text':
      return <p className="text-base leading-relaxed text-slate-700 dark:text-slate-200">{block.content}</p>

    case 'note': {
      const tones = {
        info: 'border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200',
        warn: 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200',
        success: 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-200',
      }
      const icons = {
        info: <IconLightbulb size={18} className="mt-0.5 shrink-0" />,
        warn: <IconAlert size={18} className="mt-0.5 shrink-0" />,
        success: <IconCheckCircle size={18} className="mt-0.5 shrink-0" />,
      }
      return (
        <div className={cn('flex items-start gap-2.5 rounded-xl border p-4 text-base font-semibold', tones[block.tone ?? 'info'])}>
          <span className="mt-0.5">{icons[block.tone ?? 'info']}</span>
          <span>{block.content}</span>
        </div>
      )
    }

    case 'table':
      return (
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {block.headers.map((h) => (
                  <th key={h} className="px-3 py-2 text-right font-extrabold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i} className="border-t border-slate-100 dark:border-slate-700/60">
                  {row.map((cell, j) => (
                    <td key={j} className={cn('px-3 py-2', j === 0 ? 'font-bold text-slate-800 dark:text-slate-100' : 'text-slate-600 dark:text-slate-300')}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )

    case 'rule':
      return (
        <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-4 dark:border-blue-500/40 dark:bg-blue-500/10">
          <div className="mb-1 flex items-center gap-1 text-xs font-bold text-blue-500 dark:text-blue-300">
            <IconRule size={14} /> القاعدة اللي مش هتنساها
          </div>
          <div className="text-base font-extrabold text-blue-900 dark:text-blue-100">{block.title}</div>
          <p className="mt-1 text-base text-blue-800 dark:text-blue-200">{block.content}</p>
        </div>
      )

    case 'list':
      return (
        <div>
          {block.title && <div className="mb-2 text-base font-extrabold text-slate-700 dark:text-slate-200">{block.title}</div>}
          <ul className="space-y-2">
            {block.items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-base text-slate-700 dark:text-slate-200">
                <IconListDot size={16} className="mt-1 shrink-0 text-blue-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )

    case 'example':
      return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/60">
          <div className="mb-2 flex items-center gap-1.5 text-base font-extrabold text-blue-700 dark:text-blue-400">
            <IconPen size={17} /> {block.title}
          </div>
          <div className="space-y-1.5">
            {block.content.map((c, i) => (
              <p key={i} className="text-base text-slate-700 dark:text-slate-200">{c}</p>
            ))}
          </div>
          {block.entry && (
            <div className="mt-3">
              <EntryTable debit={block.entry.debit} credit={block.entry.credit} />
            </div>
          )}
        </div>
      )

    case 'memory':
      return (
        <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-4 dark:border-amber-500/40 dark:bg-amber-500/10">
          <div className="mb-1 flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
            <IconBookMark size={14} /> اتحفظها كده
          </div>
          <div className="text-base font-extrabold text-amber-900 dark:text-amber-100">{block.title}</div>
          <p className="mt-1 text-base leading-relaxed text-amber-800 dark:text-amber-200">{block.content}</p>
        </div>
      )

    case 'steps':
      return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-800/60">
          {block.title && (
            <div className="mb-3 flex items-center gap-1.5 text-base font-extrabold text-slate-700 dark:text-slate-200">
              <IconTarget size={18} className="text-blue-600 dark:text-blue-400" /> {block.title}
            </div>
          )}
          <ol className="space-y-0">
            {block.steps.map((step, i) => (
              <li key={i} className="relative flex items-start gap-3 pb-4 last:pb-0">
                {i < block.steps.length - 1 && (
                  <span className="absolute top-7 right-[13px] h-[calc(100%-20px)] w-0.5 bg-slate-200 dark:bg-slate-700" />
                )}
                <span className="relative z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-extrabold text-white">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <div className="text-base font-extrabold text-slate-800 dark:text-slate-100">{step.label}</div>
                  {step.detail && <div className="mt-0.5 text-base leading-relaxed text-slate-600 dark:text-slate-300">{step.detail}</div>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )
  }
}