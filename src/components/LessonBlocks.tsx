import type { LessonBlock } from '../types'
import { EntryTable } from './DecisionFlow'
import { cn } from '../lib/cn'
import { SpeakButton } from './SpeakButton'
import { IconLightbulb, IconAlert, IconCheckCircle, IconRule, IconPen, IconListDot, IconBookMark, IconTarget, IconGraph, IconBookOpen } from './icons'

const HEADERS: Record<string, { label: string; icon: React.ReactNode; accent: string }> = {
  text: { label: 'شرح', icon: <IconBookOpen size={16} />, accent: 'text-sky-600 dark:text-sky-400' },
  note: { label: 'ملاحظة', icon: <IconLightbulb size={16} />, accent: 'text-amber-600 dark:text-amber-400' },
  table: { label: 'جدول توضيحي', icon: <IconGraph size={16} />, accent: 'text-violet-600 dark:text-violet-400' },
  example: { label: 'مثال عملي', icon: <IconPen size={16} />, accent: 'text-blue-600 dark:text-blue-400' },
  rule: { label: 'قاعدة', icon: <IconRule size={16} />, accent: 'text-blue-600 dark:text-blue-400' },
  list: { label: 'قائمة', icon: <IconListDot size={16} />, accent: 'text-emerald-600 dark:text-emerald-400' },
  memory: { label: 'تذكّر', icon: <IconBookMark size={16} />, accent: 'text-amber-600 dark:text-amber-400' },
  steps: { label: 'خطوات', icon: <IconTarget size={16} />, accent: 'text-blue-600 dark:text-blue-400' },
}

export function blockSpeech(block: LessonBlock): string {
  switch (block.type) {
    case 'text':
      return block.content
    case 'note':
      return block.content
    case 'table': {
      const head = `جدول: ${block.headers.join(' ، ')}`
      const rows = block.rows.map((r) => r.join(' ، '))
      return `${head} . ${rows.join(' . ')}`
    }
    case 'example': {
      const base = `${block.title}. ${block.content.join(' ')}`
      if (!block.entry) return base
      return `${base} القيد: من حـ ${block.entry.debit} إلى حـ ${block.entry.credit}`
    }
    case 'rule':
      return `${block.title}. ${block.content}`
    case 'list':
      return `${block.title ? block.title + '. ' : ''}${block.items.join(' ، ')}`
    case 'memory':
      return `${block.title}. ${block.content}`
    case 'steps': {
      const steps = block.steps.map((s, i) => `الخطوة ${i + 1}: ${s.label}${s.detail ? '، ' + s.detail : ''}`)
      return `${block.title ? block.title + '. ' : ''}${steps.join(' ')}`
    }
  }
}

function BlockHeader({ type, index, text }: { type: string; index: number; text: string }) {
  const meta = HEADERS[type] ?? HEADERS.text
  return (
    <div className="mb-3 flex items-center justify-between gap-2 border-b border-slate-100 pb-2.5 dark:border-slate-700/70">
      <span className={cn('inline-flex items-center gap-1.5 text-sm font-extrabold', meta.accent)}>
        {meta.icon} {meta.label}
        <span className="mr-1 rounded-md bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-400 dark:bg-slate-800 dark:text-slate-500">{index}</span>
      </span>
      <SpeakButton speechKey={`block-${text.slice(0, 24)}`} text={text} />
    </div>
  )
}

export function LessonBlockView({ block, index = 0 }: { block: LessonBlock; index?: number }) {
  const speech = blockSpeech(block)

  switch (block.type) {
    case 'text':
      return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/70">
          <BlockHeader type="text" index={index} text={speech} />
          <p className="text-lg leading-loose text-slate-700 dark:text-slate-200">{block.content}</p>
        </section>
      )

    case 'note': {
      const tones = {
        info: 'border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-500/30 dark:bg-sky-500/10 dark:text-sky-100',
        warn: 'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-100',
        success: 'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-100',
      }
      const icons = {
        info: <IconLightbulb size={18} className="mt-0.5 shrink-0" />,
        warn: <IconAlert size={18} className="mt-0.5 shrink-0" />,
        success: <IconCheckCircle size={18} className="mt-0.5 shrink-0" />,
      }
      return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/70">
          <BlockHeader type="note" index={index} text={speech} />
          <div className={cn('flex items-start gap-2.5 rounded-xl border p-4 text-lg font-semibold leading-relaxed', tones[block.tone ?? 'info'])}>
            <span className="mt-0.5">{icons[block.tone ?? 'info']}</span>
            <span>{block.content}</span>
          </div>
        </section>
      )
    }

    case 'table':
      return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/70">
          <BlockHeader type="table" index={index} text={speech} />
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="min-w-full text-base">
              <thead>
                <tr className="bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-300">
                  {block.headers.map((h) => (
                    <th key={h} className="px-3 py-2.5 text-right font-extrabold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, i) => (
                  <tr key={i} className="border-t border-slate-100 dark:border-slate-700/60">
                    {row.map((cell, j) => (
                      <td key={j} className={cn('px-3 py-2.5', j === 0 ? 'font-bold text-slate-800 dark:text-slate-100' : 'text-slate-600 dark:text-slate-300')}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )

    case 'rule':
      return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/70">
          <BlockHeader type="rule" index={index} text={speech} />
          <div className="rounded-xl border-2 border-blue-200 bg-blue-50 p-5 dark:border-blue-500/40 dark:bg-blue-500/10">
            <div className="text-xl font-extrabold leading-relaxed text-blue-900 dark:text-blue-100">{block.title}</div>
            <p className="mt-1.5 text-lg leading-relaxed text-blue-800 dark:text-blue-200">{block.content}</p>
          </div>
        </section>
      )

    case 'list':
      return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/70">
          <BlockHeader type="list" index={index} text={speech} />
          {block.title && <div className="mb-3 text-lg font-extrabold text-slate-700 dark:text-slate-200">{block.title}</div>}
          <ul className="space-y-2.5">
            {block.items.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-lg leading-relaxed text-slate-700 dark:text-slate-200">
                <IconListDot size={18} className="mt-1.5 shrink-0 text-emerald-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>
      )

    case 'example':
      return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/70">
          <BlockHeader type="example" index={index} text={speech} />
          <div className="mb-2 flex items-center gap-1.5 text-lg font-extrabold text-blue-700 dark:text-blue-400">
            <IconPen size={18} /> {block.title}
          </div>
          <div className="space-y-2">
            {block.content.map((c, i) => (
              <p key={i} className="text-lg leading-relaxed text-slate-700 dark:text-slate-200">{c}</p>
            ))}
          </div>
          {block.entry && (
            <div className="mt-4">
              <EntryTable debit={block.entry.debit} credit={block.entry.credit} />
            </div>
          )}
        </section>
      )

    case 'memory':
      return (
        <section className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-5 shadow-sm dark:border-amber-500/40 dark:bg-amber-500/10">
          <BlockHeader type="memory" index={index} text={speech} />
          <div className="rounded-xl border border-amber-200/70 bg-white/60 p-4 dark:border-amber-500/20 dark:bg-slate-900/40">
            <div className="text-xl font-extrabold leading-relaxed text-amber-900 dark:text-amber-100">{block.title}</div>
            <p className="mt-1.5 text-lg leading-loose text-amber-800 dark:text-amber-200">{block.content}</p>
          </div>
        </section>
      )

    case 'steps':
      return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800/70">
          <BlockHeader type="steps" index={index} text={speech} />
          {block.title && (
            <div className="mb-3 flex items-center gap-1.5 text-lg font-extrabold text-slate-700 dark:text-slate-200">
              <IconTarget size={20} className="text-blue-600 dark:text-blue-400" /> {block.title}
            </div>
          )}
          <ol className="space-y-0">
            {block.steps.map((step, i) => (
              <li key={i} className="relative flex items-start gap-3 pb-5 last:pb-0">
                {i < block.steps.length - 1 && (
                  <span className="absolute top-7 right-[15px] h-[calc(100%-20px)] w-0.5 bg-slate-200 dark:bg-slate-700" />
                )}
                <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-base font-extrabold text-white shadow-md shadow-blue-600/30">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <div className="text-lg font-extrabold text-slate-800 dark:text-slate-100">{step.label}</div>
                  {step.detail && <div className="mt-1 text-lg leading-relaxed text-slate-600 dark:text-slate-300">{step.detail}</div>}
                </div>
              </li>
            ))}
          </ol>
        </section>
      )
  }
}