import { useState } from 'react'
import { Button, Card, Badge } from '../components/ui'
import { FLASHCARDS } from '../data/flashcards'
import { getDailyCard, judgeDailyCard, getProgress } from '../lib/progress'
import { IconLayers, IconLightbulb, IconClock, IconBookMark, IconCheckCircle, IconXCircle, IconRefresh } from '../components/icons'

export function Flashcards() {
  const [flipped, setFlipped] = useState(false)
  const { cardId, known } = getDailyCard()
  const judged = known !== null
  const card = FLASHCARDS[cardId]
  const progress = getProgress()
  const daysCount = progress.dailyCards.length

  const dateLabel = new Date().toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' })
  const recent = [...progress.dailyCards].slice(-5).reverse()

  const handleJudge = (k: boolean) => {
    judgeDailyCard(k)
    setFlipped(true)
  }

  if (!card) return <div className="text-center py-12">مفيش بطاقات متاحة</div>

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="flex items-center gap-2 text-lg font-extrabold text-slate-800 dark:text-slate-100">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"><IconLayers size={18} /></span>
          بطاقة اليوم
        </h1>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <IconClock size={14} /> {dateLabel}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Badge color="blue">{cardId + 1} / {FLASHCARDS.length}</Badge>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {daysCount > 0 ? `حكمت على ${daysCount} ${daysCount === 1 ? 'بطاقة' : 'بطاقات'}` : 'دي أول بطاقة'}
        </span>
      </div>

      <Card
        className="cursor-pointer select-none text-center"
        onClick={() => !flipped && setFlipped(true)}
      >
        {!judged && !flipped && (
          <div className="text-xs font-bold text-slate-400 dark:text-slate-500">اضغط عشان تشوف الإجابة</div>
        )}
        {!flipped ? (
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400">
              <IconLightbulb size={28} />
            </div>
            <div className="mt-4 text-lg font-extrabold text-slate-800 dark:text-slate-100">{card.front}</div>
          </div>
        ) : (
          <div>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
              <IconBookMark size={28} />
            </div>
            <div className="mt-4 text-base font-bold leading-relaxed text-slate-700 dark:text-slate-200">{card.back}</div>
            {card.hint && (
              <div className="mt-3 rounded-xl bg-amber-50 px-3 py-2 text-xs font-bold text-amber-800 dark:bg-amber-500/10 dark:text-amber-300">
                <IconLightbulb size={13} className="ml-1 inline" /> {card.hint}
              </div>
            )}
          </div>
        )}
      </Card>

      {judged ? (
        <Card className={`text-center ${known ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10' : 'border-rose-300 bg-rose-50 dark:border-rose-500/40 dark:bg-rose-500/10'}`}>
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-white text-xl dark:bg-slate-800">
            {known ? <IconCheckCircle size={26} className="text-emerald-500" /> : <IconXCircle size={26} className="text-rose-500" />}
          </div>
          <div className="text-sm font-extrabold text-slate-800 dark:text-slate-100">
            {known ? 'عرفت القلب — تمام!' : 'ولّت عليه النهارده — هتراجعها تاني'}
          </div>
          <div className="mt-1 flex items-center justify-center gap-1 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <IconClock size={13} /> البطاقة دي اتفلتك لليوم — بطاقة جديدة هتوصل بكرة
          </div>
        </Card>
      ) : (
        !flipped ? (
          <div className="text-center">
            <Button variant="ghost" className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-300" onClick={() => setFlipped(true)}>
              <IconLayers size={14} /> شوف الإجابة الأول
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Button variant="success" className="w-full" onClick={() => handleJudge(true)}>
              <IconCheckCircle size={16} /> عرفت
            </Button>
            <Button variant="danger" className="w-full" onClick={() => handleJudge(false)}>
              <IconXCircle size={16} /> مش عارف
            </Button>
          </div>
        )
      )}

      {(judged || daysCount > 1) && (
        <Card>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-700 dark:text-slate-200">
            <IconBookMark size={15} className="text-blue-500" /> آخر البطاقات
          </h2>
          {recent.length > 0 ? (
            <div className="space-y-1.5">
              {recent.map((d) => {
                const c = FLASHCARDS[d.cardId]
                const dLabel = new Date(`${d.date}T12:00:00`).toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' })
                return (
                  <div key={d.date} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800/70">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                      {d.known ? <IconCheckCircle size={15} className="text-emerald-500" /> : <IconXCircle size={15} className="text-rose-500" />}
                      <span className="truncate">{c?.front ?? 'بطاقة'}</span>
                    </div>
                    <span className="shrink-0 text-xs font-bold text-slate-400">{dLabel}</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-sm text-slate-500 dark:text-slate-400">لسه مفيش تاريخ — جاي تلخّص أول بطاقة؟</div>
          )}
          <div className="mt-3 flex items-start gap-2 rounded-xl bg-blue-50 p-3 text-xs font-bold text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
            <IconRefresh size={14} className="mt-0.5 shrink-0" />
            <span>كل يوم بيمر، بتوصل بطاقة جديدة. لو فاتك يوم، متقلقش — هتكمل من اليوم اللي بعده.</span>
          </div>
        </Card>
      )}
    </div>
  )
}