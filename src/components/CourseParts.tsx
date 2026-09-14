import { Fragment, type ReactNode } from 'react'
import type { CoursePart, CourseTone } from '../data/course'
import { IconLightbulb } from './icons'

const TONES: Record<CourseTone, string> = {
  emerald: 'border-emerald-200 bg-emerald-50 dark:border-emerald-500/30 dark:bg-emerald-500/10',
  rose: 'border-rose-200 bg-rose-50 dark:border-rose-500/30 dark:bg-rose-500/10',
  sky: 'border-sky-200 bg-sky-50 dark:border-sky-500/30 dark:bg-sky-500/10',
  amber: 'border-amber-200 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10',
  violet: 'border-violet-200 bg-violet-50 dark:border-violet-500/30 dark:bg-violet-500/10',
}

const TONES_TEXT: Record<CourseTone, string> = {
  emerald: 'text-emerald-800 dark:text-emerald-200',
  rose: 'text-rose-800 dark:text-rose-200',
  sky: 'text-sky-800 dark:text-sky-200',
  amber: 'text-amber-800 dark:text-amber-200',
  violet: 'text-violet-800 dark:text-violet-200',
}

function Panel({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">
      {title && (
        <div className="border-b border-slate-200 bg-slate-50 px-3 py-2 text-sm font-extrabold text-slate-700 dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200">
          {title}
        </div>
      )}
      {children}
    </div>
  )
}

function TextPart({ part }: { part: Extract<CoursePart, { kind: 'text' }> }) {
  return <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{part.text}</p>
}

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

function BoxesPart({ part }: { part: Extract<CoursePart, { kind: 'boxes' }> }) {
  return (
    <Panel title={part.title}>
      <div className="grid gap-2 p-2.5 sm:grid-cols-2">
        {part.items.map((box, i) => (
          <div key={i} className={`rounded-xl border-2 p-3 ${TONES[box.tone ?? 'sky']}`}>
            <div className={`text-sm font-extrabold ${TONES_TEXT[box.tone ?? 'sky']}`}>{box.title}</div>
            <div className={`mt-1 text-xs leading-relaxed ${TONES_TEXT[box.tone ?? 'sky']} opacity-80`}>{box.text}</div>
          </div>
        ))}
      </div>
    </Panel>
  )
}

function FlowPart({ part }: { part: Extract<CoursePart, { kind: 'flow' }> }) {
  return (
    <Panel title={part.title}>
      <div className="flex flex-wrap items-center gap-2 p-3">
        {part.nodes.map((node, i) => (
          <Fragment key={i}>
            {i > 0 && (
              <span className="text-lg font-extrabold text-slate-400 dark:text-slate-500">←</span>
            )}
            <div className="rounded-xl border-2 border-blue-200 bg-blue-50 px-3 py-2 text-xs font-bold leading-relaxed text-blue-800 dark:border-blue-500/30 dark:bg-blue-500/10 dark:text-blue-200">
              {node}
            </div>
          </Fragment>
        ))}
      </div>
    </Panel>
  )
}

function TreePart({ part }: { part: Extract<CoursePart, { kind: 'tree' }> }) {
  return (
    <Panel title={part.title}>
      <div className="space-y-3 p-3">
        <div className="mx-auto w-fit max-w-full rounded-xl border-2 border-slate-300 bg-slate-100 px-4 py-2 text-center text-sm font-extrabold text-slate-700 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200">
          {part.root}
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {part.branches.map((branch, i) => (
            <div key={i} className={`rounded-xl border-2 p-3 ${TONES[branch.tone ?? 'sky']}`}>
              <div className={`text-sm font-extrabold ${TONES_TEXT[branch.tone ?? 'sky']}`}>{branch.label}</div>
              {branch.notes && (
                <div className={`mt-0.5 text-xs ${TONES_TEXT[branch.tone ?? 'sky']} opacity-70`}>{branch.notes}</div>
              )}
              <ul className="mt-1.5 space-y-1">
                {branch.items.map((item) => (
                  <li key={item} className={`flex items-start gap-1.5 text-right text-xs font-bold ${TONES_TEXT[branch.tone ?? 'sky']}`}>
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  )
}

export function CourseParts({ parts }: { parts: CoursePart[] }) {
  return (
    <div className="mt-3 space-y-3">
      {parts.map((part, i) => {
        if (part.kind === 'text') return <TextPart key={i} part={part} />
        if (part.kind === 'point') return <PointPart key={i} part={part} index={i} />
        if (part.kind === 'note') return <NotePart key={i} part={part} />
        if (part.kind === 'table') return <TablePart key={i} part={part} />
        if (part.kind === 'equation') return <EquationPart key={i} part={part} />
        if (part.kind === 'taccount') return <TAccountPart key={i} part={part} />
        if (part.kind === 'boxes') return <BoxesPart key={i} part={part} />
        if (part.kind === 'flow') return <FlowPart key={i} part={part} />
        if (part.kind === 'tree') return <TreePart key={i} part={part} />
        return null
      })}
    </div>
  )
}