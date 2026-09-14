import type { CoursePart } from '../data/course'
import { IconLightbulb } from './icons'

function PointPart({ part, index }: { part: Extract<CoursePart, { kind: 'point' }>; index: number }) {
  return (
    <li className="flex items-start gap-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-100 text-[10px] font-extrabold text-orange-600 dark:bg-orange-500/15 dark:text-orange-400">
        {index + 1}
      </span>
      <span>{part.text}</span>
    </li>
  )
}

function NotePart({ part }: { part: Extract<CoursePart, { kind: 'note' }> }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-3.5 dark:border-amber-500/20 dark:bg-amber-500/10">
      <IconLightbulb size={18} className="mt-0.5 shrink-0 text-amber-600 dark:text-amber-400" />
      <div>
        <div className="text-sm font-extrabold text-amber-800 dark:text-amber-200">{part.title}</div>
        <div className="mt-0.5 text-sm leading-relaxed text-amber-800/90 dark:text-amber-200/80">{part.text}</div>
      </div>
    </div>
  )
}

function TablePart({ part }: { part: Extract<CoursePart, { kind: 'table' }> }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
      {part.title && (
        <div className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-sm font-extrabold text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
          {part.title}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 text-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
              {part.headers.map((h) => (
                <th key={h} className="whitespace-nowrap border-b border-slate-200 px-3 py-2 text-right font-extrabold dark:border-slate-700">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {part.rows.map((row, i) => (
              <tr key={i} className={i % 2 ? 'bg-slate-50/60 dark:bg-slate-800/20' : ''}>
                {row.map((cell, j) => (
                  <td key={j} className={`border-b border-slate-100 px-3 py-2 text-right leading-relaxed text-slate-600 dark:border-slate-800 dark:text-slate-300 ${j === 0 ? 'font-bold text-slate-700 dark:text-slate-200' : ''}`}>
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function EquationPart({ part }: { part: Extract<CoursePart, { kind: 'equation' }> }) {
  return (
    <div className="rounded-2xl border-2 border-dashed border-blue-200 bg-blue-50/60 p-4 text-center dark:border-blue-500/25 dark:bg-blue-500/10">
      <div className="text-lg font-extrabold text-blue-800 dark:text-blue-200">{part.formula}</div>
      {part.hint && (
        <div className="mt-1 font-mono text-xs tracking-wide text-blue-500/80 dark:text-blue-300/60" dir="ltr">
          {part.hint}
        </div>
      )}
    </div>
  )
}

function TAccountPart({ part }: { part: Extract<CoursePart, { kind: 'taccount' }> }) {
  return (
    <div className="overflow-hidden rounded-2xl border-2 border-slate-300 dark:border-slate-600">
      <div className="border-b-2 border-slate-300 bg-slate-100 px-3 py-2 text-center text-sm font-extrabold text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">
        {part.label}
      </div>
      <div className="grid grid-cols-2 divide-x-2 divide-slate-300 dark:divide-slate-600">
        <div className="bg-emerald-50 p-3 dark:bg-emerald-500/10">
          <div className="mb-1.5 text-center text-xs font-extrabold text-emerald-700 dark:text-emerald-300">
            مدين — يمين (+)
          </div>
          <ul className="space-y-1">
            {part.debit.map((item) => (
              <li key={item} className="text-right text-sm font-bold text-emerald-800 dark:text-emerald-200">
                • {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-rose-50 p-3 dark:bg-rose-500/10">
          <div className="mb-1.5 text-center text-xs font-extrabold text-rose-700 dark:text-rose-300">
            دائن — شمال (−)
          </div>
          <ul className="space-y-1">
            {part.credit.map((item) => (
              <li key={item} className="text-right text-sm font-bold text-rose-800 dark:text-rose-200">
                • {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {part.result && (
        <div className="border-t-2 border-slate-300 bg-slate-100 px-3 py-2 text-center text-xs font-bold text-slate-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {part.result}
        </div>
      )}
    </div>
  )
}

export function CourseParts({ parts }: { parts: CoursePart[] }) {
  return (
    <div className="mt-3 space-y-3">
      <ul className="space-y-2.5">
        {parts.map((part, i) =>
          part.kind === 'point' ? <PointPart key={i} part={part} index={i} /> : null
        )}
      </ul>
      {parts.map((part, i) => {
        if (part.kind === 'point') return null
        if (part.kind === 'note') return <NotePart key={i} part={part} />
        if (part.kind === 'table') return <TablePart key={i} part={part} />
        if (part.kind === 'equation') return <EquationPart key={i} part={part} />
        if (part.kind === 'taccount') return <TAccountPart key={i} part={part} />
        return null
      })}
    </div>
  )
}