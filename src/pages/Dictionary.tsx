import { useState } from 'react'
import { Card, Badge } from '../components/ui'
import { searchDictionary, SEARCH_HINTS } from '../data/accountDictionary'
import { TYPE_LABELS } from '../data/accountTypes'
import type { AccountMapping } from '../types'
import { recordDictionarySearch } from '../lib/progress'
import { IconSearch, IconPen, IconAlert, IconInfo } from '../components/icons'

export function Dictionary() {
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState<AccountMapping | null>(null)
  const results = query.trim() ? searchDictionary(query) : []

  const handleClick = () => {
    const hint = SEARCH_HINTS[Math.floor(Math.random() * SEARCH_HINTS.length)]
    setQuery(hint)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-800 dark:text-slate-100 sm:text-2xl">قاموس استخراج الحسابات</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          اكتب كلمة من الجملة المحاسبية وهنقولك الحساب اللي بتاعها
        </p>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <IconSearch size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelected(null) }}
            placeholder="اكتب مثلاً: مورد، عميل، إيجار، تأمين..."
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pr-10 text-sm font-semibold placeholder:text-slate-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
          />
        </div>
        <button onClick={handleClick} className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-700">
          عشوائي
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {SEARCH_HINTS.map((h) => (
          <button
            key={h}
            onClick={() => { setQuery(h); setSelected(null) }}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600 transition hover:border-blue-300 hover:text-blue-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
          >
            {h}
          </button>
        ))}
      </div>

      {results.length > 0 && (
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-500 dark:text-slate-400">
            {results.length} نتيجة
          </div>
          {results.map((m) => (
            <Card key={m.id} className="cursor-pointer transition hover:border-blue-300" onClick={() => { if (selected?.id !== m.id) recordDictionarySearch(); setSelected(selected?.id === m.id ? null : m) }}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-extrabold text-slate-800 dark:text-slate-100">{m.account}</div>
                  <div className="text-xs lang-en text-slate-500 dark:text-slate-400">{m.accountEn}</div>
                </div>
                <Badge color={m.type === 'asset' ? 'blue' : m.type === 'expense' ? 'red' : m.type === 'liability' ? 'green' : m.type === 'equity' ? 'purple' : 'amber'}>
                  {TYPE_LABELS[m.type]}
                </Badge>
              </div>

              {selected?.id === m.id && (
                <div className="mt-3 space-y-2 border-t border-slate-200 pt-3 dark:border-slate-700">
                  <div className="flex gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-slate-500 dark:text-slate-400">الكلمات المفتاحية:</span>
                    {m.keywords.map((k) => (
                      <span key={k} className="rounded-md bg-blue-50 px-2 py-0.5 text-xs text-blue-700 dark:bg-blue-500/20 dark:text-blue-300">
                        {k}
                      </span>
                    ))}
                  </div>
                  <div className="space-y-1">
                    {m.examples.map((ex, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-xs text-slate-600 dark:text-slate-300">
                        <IconPen size={12} className="mt-0.5 shrink-0 text-slate-400" />
                        <span>{ex}</span>
                      </div>
                    ))}
                  </div>
                  {m.note && (
                    <div className="flex items-start gap-1.5 rounded-lg bg-amber-50 p-2 text-xs font-bold text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
                      <IconAlert size={13} className="mt-0.5 shrink-0" />
                      <span>{m.note}</span>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-700">
                      <span className="text-slate-500 dark:text-slate-400">عند الزيادة:</span>
                      <span className="mr-1 font-bold text-blue-700 dark:text-blue-400">
                        {['asset', 'expense'].includes(m.type) ? 'مدين' : 'دائن'}
                      </span>
                    </div>
                    <div className="rounded-lg bg-slate-100 p-2 dark:bg-slate-700">
                      <span className="text-slate-500 dark:text-slate-400">عند النقص:</span>
                      <span className="mr-1 font-bold text-orange-700 dark:text-orange-400">
                        {['asset', 'expense'].includes(m.type) ? 'دائن' : 'مدين'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {query.trim() && results.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto mb-3 w-12 h-12 flex items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800">
            <IconInfo size={26} />
          </div>
          <div className="text-sm text-slate-500 dark:text-slate-400">مفيش نتيجة لكلمة "{query}" — جرّب كلمة تانية</div>
        </div>
      )}
    </div>
  )
}