import { useState } from 'react'
import { Button } from '../components/ui'
import { FLASHCARDS } from '../data/flashcards'

export function Flashcards() {
  const [current, setCurrent] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [known, setKnown] = useState<Record<number, boolean>>({})

  const card = FLASHCARDS[current]
  const knownCount = Object.values(known).filter(Boolean).length

  if (!card) return null

  const next = () => {
    setCurrent((c) => (c + 1) % FLASHCARDS.length)
    setFlipped(false)
  }
  const prev = () => {
    setCurrent((c) => (c - 1 + FLASHCARDS.length) % FLASHCARDS.length)
    setFlipped(false)
  }
  const markKnown = (known: boolean) => {
    setKnown((prev) => ({ ...prev, [current]: known }))
    next()
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">🗃️ بطاقات الحفظ</h1>
        <span className="text-sm font-bold text-slate-500">
          {knownCount}/{FLASHCARDS.length} عرفتها
        </span>
      </div>

      <div className="relative perspective">
        <div
          onClick={() => setFlipped(!flipped)}
          className={`min-h-[250px] cursor-pointer select-none rounded-2xl p-6 text-center transition-all duration-300 ${
            flipped
              ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 text-white shadow-xl shadow-emerald-500/20'
              : 'bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-xl shadow-blue-500/20'
          }`}
        >
          {!flipped ? (
            <div>
              <div className="text-sm font-semibold text-blue-200 mb-4">السؤال</div>
              <div className="text-lg font-extrabold leading-relaxed">{card.front}</div>
              <div className="mt-6 text-xs text-blue-200">اضغط للإجابة</div>
            </div>
          ) : (
            <div>
              <div className="text-sm font-semibold text-emerald-200 mb-4">الإجابة</div>
              <div className="text-lg font-extrabold leading-relaxed">{card.back}</div>
              {card.hint && (
                <div className="mt-4 rounded-xl bg-white/20 p-2 text-xs text-emerald-100">💡 {card.hint}</div>
              )}
              <div className="mt-4 text-xs text-emerald-200">اضغط عشان ترجّع</div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={prev} className="flex-1">← السابق</Button>
        {!flipped ? (
          <Button onClick={() => setFlipped(true)} className="flex-1">🔄 اقلب البطاقة</Button>
        ) : (
          <>
            <Button variant="danger" onClick={() => markKnown(false)} className="flex-1">❌ مش عارف</Button>
            <Button variant="success" onClick={() => markKnown(true)} className="flex-1">✅ عرفت</Button>
          </>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 justify-center">
        {FLASHCARDS.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrent(i); setFlipped(false) }}
            className={`h-7 w-7 rounded-lg text-xs font-bold transition ${
              i === current
                ? 'bg-blue-600 text-white'
                : known[i] === true
                  ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                  : known[i] === false
                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
                    : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  )
}