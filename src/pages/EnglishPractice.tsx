import { useEffect, useMemo, useState } from 'react'
import { Card, Button, Badge, ProgressBar, StatCard } from '../components/ui'
import { ACCOUNTING_ENGLISH } from '../data/accountingEnglish'
import type { VocabTerm } from '../data/accountingEnglish'
import { WordArt } from '../data/englishVisuals'
import { recordExercise } from '../lib/progress'
import {
  getCards,
  getDueCards,
  getNewWords,
  dueCount,
  finishNew,
  recall,
  updateCard,
  resetCards,
  cardByLevel,
  markPracticeToday,
  markWordPracticed,
  getStreak,
  wordsPracticedToday,
  MAX_LEVEL,
  LEVEL_LABEL,
} from '../lib/englishSrs'
import type { SrsCard, RecallRating } from '../lib/englishSrs'
import { cn } from '../lib/cn'
import {
  IconSpeaker,
  IconPlay,
  IconCheck,
  IconCheckCircle,
  IconXCircle,
  IconRefresh,
  IconArrowRight,
  IconSearch,
  IconSpark,
  IconTarget,
  IconTrash,
} from '../components/icons'

type Phase = 'home' | 'new' | 'review'

type Round = 0 | 1 | 2

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '')

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

let voiceCache: SpeechSynthesisVoice | null | undefined

const VOICE_PREF = ['Google US English', 'Google UK English', 'Zira', 'Ava', 'Aria', 'Jenny', 'Michelle', 'Samantha', 'David', 'Daniel']

function pickVoice(): SpeechSynthesisVoice | null {
  if (voiceCache !== undefined) return voiceCache
  const synth = window.speechSynthesis
  if (!synth) {
    voiceCache = null
    return null
  }
  const voices = synth.getVoices()
  const enUs = voices.filter((v) => v.lang === 'en-US')
  const en = voices.filter((v) => v.lang.startsWith('en'))
  const all = [...enUs, ...en]
  const best = VOICE_PREF.reduce<SpeechSynthesisVoice | null>((found, name) => {
    if (found) return found
    return all.find((v) => v.name.includes(name)) ?? null
  }, null)
  const voice = best ?? enUs[0] ?? en[0] ?? null
  voiceCache = voice
  return voice
}

function speak(text: string, slow: boolean) {
  const synth = window.speechSynthesis
  if (!synth) return
  synth.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  u.rate = slow ? 0.55 : 0.85
  u.pitch = 1.05
  u.volume = 1
  const voice = pickVoice()
  if (voice) u.voice = voice
  synth.speak(u)
}

const isPhrase = (t: VocabTerm) => t.en.includes(' ')

const LEVEL_COLOR: Record<number, string> = {
  1: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/70 dark:text-emerald-200',
  2: 'bg-emerald-200 text-emerald-800 dark:bg-emerald-800/80 dark:text-emerald-100',
  3: 'bg-emerald-300 text-emerald-900 dark:bg-emerald-700/80 dark:text-emerald-50',
  4: 'bg-emerald-400 text-white',
  5: 'bg-emerald-500 text-white',
  6: 'bg-emerald-600 text-white',
}

function makeLetters(term: VocabTerm): string[] {
  return isPhrase(term)
    ? shuffle(term.en.split(' '))
    : shuffle(term.en.replace(/[^a-z0-9]/gi, '').split(''))
}

export function EnglishPractice() {
  const [phase, setPhase] = useState<Phase>('home')
  const [tick, setTick] = useState(0)
  const [query, setQuery] = useState('')

  const [newWords, setNewWords] = useState<VocabTerm[]>([])
  const [nIdx, setNIdx] = useState(0)
  const [round, setRound] = useState<Round>(0)
  const [letters, setLetters] = useState<string[]>([])
  const [answered, setAnswered] = useState(false)
  const [ok, setOk] = useState<boolean | null>(null)
  const [input, setInput] = useState('')
  const [picked, setPicked] = useState<string[]>([])

  const [revCards, setRevCards] = useState<SrsCard[]>([])
  const [rIdx, setRIdx] = useState(0)

  useEffect(() => {
    const synth = window.speechSynthesis
    if (!synth) return
    const onVoices = () => {
      voiceCache = undefined
      pickVoice()
    }
    synth.addEventListener?.('voiceschanged', onVoices)
    return () => synth.removeEventListener?.('voiceschanged', onVoices)
  }, [])

  const refresh = () => setTick((t) => t + 1)

  const cards = useMemo(() => shuffle(getCards()), [tick])
  const due = useMemo(() => dueCount(), [tick])
  const pendingNew = useMemo(() => getNewWords().length, [tick])
  const streak = useMemo(() => getStreak(), [tick])
  const todayWords = useMemo(() => wordsPracticedToday(), [tick])
  const mastered = useMemo(
    () =>
      getCards()
        .filter((c) => c.level >= 1)
        .sort((a, b) => a.id - b.id)
        .map((card) => ({ card, t: ACCOUNTING_ENGLISH.find((t) => t.id === card.id)! })),
    [tick],
  )

  const currentNew = newWords[nIdx]
  const currentRev = revCards[rIdx]
  const currentRevTerm = currentRev
    ? ACCOUNTING_ENGLISH.find((t) => t.id === currentRev.id) ?? null
    : null

  useEffect(() => {
    if (phase === 'new' && currentNew && round === 0) {
      const timer = setTimeout(() => speak(currentNew.en, false), 300)
      return () => clearTimeout(timer)
    }
  }, [phase, currentNew, round])

  useEffect(() => {
    if (phase === 'review' && currentRevTerm) {
      setInput('')
      setAnswered(false)
      setOk(null)
    }
  }, [phase, currentRev, rIdx])
  
  const startNew = () => {
    const words = getNewWords()
    if (words.length === 0) return
    setNewWords(words)
    setNIdx(0)
    setRound(0)
    setAnswered(false)
    setOk(null)
    setInput('')
    setPicked([])
    setPhase('new')
  }

  const startReview = () => {
    const list = getDueCards()
    if (list.length === 0) return
    setRevCards(list)
    setRIdx(0)
    setInput('')
    setAnswered(false)
    setOk(null)
    setPhase('review')
  }

  const nextRound = () => {
    if (!currentNew) return
    if (round < 2) {
      setRound((r) => (r + 1) as Round)
      setAnswered(false)
      setOk(null)
      setInput('')
      setPicked([])
      setLetters(makeLetters(currentNew))
      return
    }
    finishNew(currentNew)
    refresh()
    if (nIdx >= newWords.length - 1) {
      setPhase('home')
      return
    }
    const next = newWords[nIdx + 1]
    setNIdx((i) => i + 1)
    setRound(0)
    setAnswered(false)
    setOk(null)
    setInput('')
    setPicked([])
    if (next) setLetters(makeLetters(next))
  }

  const retryRound = () => {
    if (!currentNew) return
    setAnswered(false)
    setOk(null)
    setInput('')
    setPicked([])
    if (round === 1) setLetters(makeLetters(currentNew))
  }

  const pickTile = (tile: string) => {
    if (answered) return
    setPicked((p) => [...p, tile])
  }

  const undoPick = () => {
    if (answered) return
    setPicked((p) => p.slice(0, -1))
  }

  const availableTiles = useMemo(() => {
    const remaining = [...letters]
    picked.forEach((l) => {
      const idx = remaining.indexOf(l)
      if (idx >= 0) remaining.splice(idx, 1)
    })
    return remaining
  }, [letters, picked])

  const builtAnswer = (term: VocabTerm) => (round === 1 ? picked.join(isPhrase(term) ? ' ' : '') : input)

  const canSubmitNew = useMemo(() => {
    if (!currentNew || answered || round === 0) return false
    if (round === 1) return picked.length > 0
    return input.trim().length > 0
  }, [currentNew, answered, round, picked, input])

  const submitNew = () => {
    if (!currentNew || !canSubmitNew) return
    const match = norm(builtAnswer(currentNew)) === norm(currentNew.en)
    setAnswered(true)
    setOk(match)
    recordExercise(`en-new-${currentNew.id}-${round}`, match, 'إنجليزي محاسبي')
  }

  const canSubmitRev = useMemo(() => {
    if (!currentRev || answered) return false
    return input.trim().length > 0
  }, [currentRev, answered, input])

  const submitReview = () => {
    if (!currentRev || !currentRevTerm || !canSubmitRev) return
    const match = norm(input) === norm(currentRevTerm.en)
    setAnswered(true)
    setOk(match)
    recordExercise(`en-rv-${currentRevTerm.id}`, match, 'إنجليزي محاسبي')
  }

  const rateReview = (rating: RecallRating) => {
    if (!currentRev) return
    const updated = recall(currentRev, rating)
    updateCard(updated)
    markPracticeToday()
    markWordPracticed(currentRev.id)
    refresh()
    if (rIdx >= revCards.length - 1) {
      setPhase('home')
      return
    }
    setRIdx((i) => i + 1)
    setAnswersReset()
  }

  const setAnswersReset = () => {
    setInput('')
    setAnswered(false)
    setOk(null)
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ACCOUNTING_ENGLISH
    return ACCOUNTING_ENGLISH.filter(
      (t) => t.en.toLowerCase().includes(q) || t.ar.includes(q),
    )
  }, [query])

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1 py-1">
        <h1 className="text-2xl font-extrabold">تعلم الإنجليزي المحاسبي</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {ACCOUNTING_ENGLISH.length} مصطلح محاسبي — نظام تكرار متباعد زي Memrise و Anki
        </p>
      </div>

      {phase === 'home' && (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard
              icon={<IconSpark size={22} />}
              label="كلمات بدأتها"
              value={cards.length}
              sub={`من ${ACCOUNTING_ENGLISH.length} مصطلح`}
              color="blue"
            />
            <StatCard
              icon={<IconTarget size={22} />}
              label="مراجعات مستحقة"
              value={due}
              sub={due > 0 ? 'راجعها الأول بأذن الله' : 'خلاص — متابع بدون مراجعة'}
              color="amber"
            />
            <StatCard
              icon={<IconCheckCircle size={22} />}
              label="كلمات نضجت"
              value={cardByLevel()[MAX_LEVEL] || 0}
              sub="وصلت لمستوى الزهرة الناضجة"
              color="green"
            />
            <StatCard
              icon={<span className="text-lg">🔥</span>}
              label="أيام متواصلة"
              value={streak}
              sub={todayWords > 0 ? `النهاردة كمّلت ${todayWords} كلمة` : 'قوم اكمّل كلمة النهاردة'}
              color="orange"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Button
              onClick={startNew}
              disabled={pendingNew === 0}
              variant="hero"
              className="justify-center py-4"
            >
              <IconPlay size={18} />
              اتعلم كلمات جديدة ({pendingNew})
            </Button>
            <Button
              onClick={startReview}
              disabled={due === 0}
              className="justify-center py-4"
            >
              <IconRefresh size={18} />
              راجع اللي مستحق ({due})
            </Button>
          </div>

          <Card className="p-4 sm:p-6">
            <div className="flex items-center justify-between pb-3">
              <h2 className="text-base font-extrabold">حديقة كلماتك</h2>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                أتقنت {mastered.length} من {ACCOUNTING_ENGLISH.length}
              </span>
              <button
                onClick={() => {
                  if (confirm('تأكيد؟ هتحذف كل تقدمك في الإنجليزي.')) {
                    resetCards()
                    refresh()
                  }
                }}
                className="flex items-center gap-1 text-xs font-bold text-red-500 hover:underline"
              >
                <IconTrash size={13} />
                إعادة ضبط الإنجليزية
              </button>
            </div>
            <ProgressBar value={(mastered.length / ACCOUNTING_ENGLISH.length) * 100} />
            {mastered.length === 0 ? (
              <div className="flex flex-col items-center gap-2 py-8 text-center">
                <span className="text-4xl">🌱</span>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  حديقتك فاضية لسه… كل مرة تنجح في كلمة، هيظهر هنا اسم الكلمة
                </p>
              </div>
            ) : (
              <div className="flex flex-wrap gap-1.5 pt-3">
                {mastered.map(({ t, card }) => (
                  <button
                    key={t.id}
                    onClick={() => speak(t.en, false)}
                    title={`${LEVEL_LABEL[Math.min(card.level, MAX_LEVEL)]} — ${t.ar}`}
                    className={cn(
                      'flex items-center gap-1 rounded-full py-1 pl-2 pr-1.5 text-xs font-bold text-white transition-transform hover:scale-105',
                      LEVEL_COLOR[Math.min(card.level, MAX_LEVEL)],
                    )}
                  >
                    <span dir="ltr" className="font-mono">{t.en}</span>
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/25 text-[10px]">
                      {Math.min(card.level, MAX_LEVEL)}
                    </span>
                  </button>
                ))}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-3 pt-3 text-xs text-slate-500 dark:text-slate-400">
              {[1, 3, 5, MAX_LEVEL].map((l) => (
                <span key={l} className="flex items-center gap-1">
                  <span className={cn('h-3 w-3 rounded-full', LEVEL_COLOR[l])} />
                  {LEVEL_LABEL[l]}
                </span>
              ))}
              <span className="text-slate-400">دوس على الكلمة عشان تسمع نطقها</span>
            </div>
          </Card>

          <Card className="p-4">
            <div className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-start gap-2">
                <IconXCircle size={16} className="mt-0.5 shrink-0 text-rose-500" />
                <span>
                  <b className="text-slate-700 dark:text-slate-200">قاعدة التقدّم:</b> ما تنتقلش للكلمة اللي بعدها غير لما تجاوب صح في مرحلة الحروف ومرحلة الكتابة — المحاولة بتتكرر لحد النجاح. وكل كلمة ليها رسمة متحركة على معناها.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <IconSpeaker size={16} className="mt-0.5 shrink-0" />
                <span>
                  <b className="text-slate-700 dark:text-slate-200">النظام:</b> التكرار المتباعد — كل مرة تتذكر الكلمة صح، موعد المراجعة الجاية بيتبعد (١٠ د → يوم → ٣ أيام → أسبوع...). اللي تنساه بيمرجعلك بسرعة.
                  <button
                    onClick={() => speak('accounting accounting', true)}
                    className="mr-2 text-xs font-bold text-blue-600 dark:text-blue-400 underline"
                  >
                    جرّب النطق
                  </button>
                </span>
              </div>
            </div>
          </Card>
        </>
      )}

      {phase === 'new' && currentNew && (
        <Card className="p-4 sm:p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                كلمة جديدة {nIdx + 1} من {newWords.length} · المرحلة {round + 1} / 3
              </span>
              <Button variant="ghost" className="px-3 py-2 text-xs" onClick={() => setPhase('home')}>
                خروج
              </Button>
            </div>
            <ProgressBar value={((nIdx * 3 + round) / (newWords.length * 3)) * 100} />

            <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
              {round === 0 ? (
                <div className="space-y-4 py-2 text-center">
                  <WordArt term={currentNew} />
                  <Badge color="blue">1) اسمع النطق</Badge>
                  <div dir="ltr" className="pt-2 font-mono text-3xl font-extrabold tracking-wide text-slate-800 dark:text-slate-100">
                    {currentNew.en}
                  </div>
                  <div className="text-base text-slate-500 dark:text-slate-400">{currentNew.ar}</div>
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="secondary" className="px-3 py-2 text-xs" onClick={() => speak(currentNew.en, false)}>
                      <IconSpeaker size={14} />
                      عادي
                    </Button>
                    <Button variant="secondary" className="px-3 py-2 text-xs" onClick={() => speak(currentNew.en, true)}>
                      <IconSpeaker size={14} />
                      بطيء
                    </Button>
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500">لو حدك صوت، شغّل «المتابعة»</div>
                  <Button onClick={nextRound}>
                    متابعة
                    <IconArrowRight size={16} />
                  </Button>
                </div>
              ) : (
                <>
                  <div className="space-y-2 text-center">
                    <div className="flex justify-center"><WordArt term={currentNew} size="sm" /></div>
                    <div className="text-2xl font-extrabold">{currentNew.ar}</div>
                    <Badge color={round === 1 ? 'green' : 'amber'}>
                      {round === 1 ? '2) رتّب الحروف / الكلمات صح' : '3) اكتب المصطلح بالإنجليزي'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <Button variant="secondary" className="px-3 py-2 text-xs" onClick={() => speak(currentNew.en, false)}>
                      <IconSpeaker size={14} />
                      عادي
                    </Button>
                    <Button variant="secondary" className="px-3 py-2 text-xs" onClick={() => speak(currentNew.en, true)}>
                      <IconSpeaker size={14} />
                      بطيء
                    </Button>
                  </div>

                  {round === 1 ? (
                    <div className="space-y-3">
                      {picked.length > 0 && (
                        <div
                          dir="ltr"
                          className="flex flex-wrap items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-300 bg-white p-3 font-mono text-lg font-bold dark:border-slate-600 dark:bg-slate-800"
                        >
                          {picked.join(isPhrase(currentNew) ? '  ' : '')}
                        </div>
                      )}
                      {picked.length === 0 && (
                        <div className="rounded-xl border-2 border-dashed border-slate-300 p-3 text-center text-sm text-slate-400 dark:border-slate-600">
                          دوس على الحروف تحتها بالترتيب الصحيح
                        </div>
                      )}
                      <div dir="ltr" className="flex flex-wrap justify-center gap-1.5">
                        {availableTiles.map((tile, ti) => (
                          <button
                            key={`${tile}-${ti}`}
                            onClick={() => pickTile(tile)}
                            className="flex h-11 items-center justify-center rounded-lg border-2 border-slate-200 bg-white px-2.5 font-mono text-base font-bold text-slate-700 shadow-sm transition-colors hover:border-emerald-400 hover:text-emerald-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                          >
                            {tile}
                          </button>
                        ))}
                      </div>
                      {picked.length > 0 && (
                        <div className="flex items-center justify-center gap-2">
                          <Button variant="ghost" className="px-3 py-2 text-xs" onClick={undoPick}>
                            مسح آخر
                          </Button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div dir="ltr" className="mx-auto max-w-md text-center">
                      <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') submitNew()
                        }}
                        dir="ltr"
                        placeholder="اكتب المصطلح بالإنجليزي..."
                        className="w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2.5 text-center font-mono text-lg outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-800"
                      />
                    </div>
                  )}
                </>
              )}
            </div>

            {round !== 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2">
                {!answered && (
                  <Button onClick={submitNew} disabled={!canSubmitNew} className="min-w-32">
                    <IconCheck size={16} />
                    اتأكد
                  </Button>
                )}
                {answered && (
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {ok ? (
                      <>
                        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                          <IconCheckCircle size={16} />
                          صحيح!
                        </div>
                        <Button variant="primary" onClick={nextRound}>
                          {round >= 2 ? 'الكلمة الجاية' : 'التالية'}
                          <IconArrowRight size={16} />
                        </Button>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-2 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
                          <IconXCircle size={16} />
                          الإجابة الصحيحة: <span className="font-mono font-bold">{currentNew.en}</span>
                        </div>
                        <Button variant="warning" onClick={retryRound}>
                          <IconRefresh size={16} />
                          أعيد المحاولة
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </Card>
      )}

      {phase === 'review' && currentRev && currentRevTerm && (
        <Card className="p-4 sm:p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                مراجعة {rIdx + 1} من {revCards.length}
              </span>
              <Button variant="ghost" className="px-3 py-2 text-xs" onClick={() => setPhase('home')}>
                خروج
              </Button>
            </div>
            <ProgressBar value={(rIdx / revCards.length) * 100} />

            <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-center dark:border-slate-700 dark:bg-slate-900/50">
              <div className="flex justify-center"><WordArt term={currentRevTerm} size="sm" /></div>
              <div className="text-2xl font-extrabold">{currentRevTerm.ar}</div>
              <Badge color="amber">اكتب المصطلح بالإنجليزي</Badge>

              <div dir="ltr" className="mx-auto max-w-md text-center">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') submitReview()
                  }}
                  dir="ltr"
                  placeholder="اكتب بالإنجليزي..."
                  className="w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2.5 text-center font-mono text-lg outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-800"
                />
              </div>

              <div className="flex items-center justify-center gap-2">
                <Button variant="secondary" className="px-3 py-2 text-xs" onClick={() => speak(currentRevTerm.en, true)}>
                  <IconSpeaker size={14} />
                  بطيء
                </Button>
                <Button variant="secondary" className="px-3 py-2 text-xs" onClick={() => speak(currentRevTerm.en, false)}>
                  <IconSpeaker size={14} />
                  عادي
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2">
              {!answered && (
                <Button onClick={submitReview} disabled={!canSubmitRev} className="min-w-32">
                  <IconCheck size={16} />
                  اتأكد
                </Button>
              )}
              {answered && (
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {ok ? (
                    <>
                      <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                        <IconCheckCircle size={16} />
                        صحيح! كان إزاي؟
                      </div>
                      <Button variant="warning" className="px-3 py-2 text-xs" onClick={() => rateReview('hard')}>
                        صعبة
                      </Button>
                      <Button variant="secondary" className="px-3 py-2 text-xs" onClick={() => rateReview('good')}>
                        عادية
                      </Button>
                      <Button variant="success" className="px-3 py-2 text-xs" onClick={() => rateReview('easy')}>
                        سهلة
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 rounded-xl bg-rose-50 px-4 py-2 text-rose-700 dark:bg-rose-500/10 dark:text-rose-300">
                        <IconXCircle size={16} />
                        الإجابة الصحيحة: <span className="font-mono font-bold">{currentRevTerm.en}</span>
                      </div>
                      <Button variant="primary" onClick={() => rateReview('miss')}>
                        فهمت
                        <IconArrowRight size={16} />
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      <Card className="p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3">
          <h2 className="text-base font-extrabold">كل المصطلحات ({filtered.length})</h2>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
              <IconSearch size={14} />
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث بالإنجليزي أو العربي..."
              className="w-56 rounded-lg border border-slate-200 bg-white py-1.5 pl-3 pr-9 text-sm outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-800"
            />
          </div>
        </div>
        <div className="max-h-96 divide-y divide-slate-100 overflow-y-auto dark:divide-slate-800">
          {filtered.map((t) => {
            const card = cards.find((c) => c.id === t.id)
            return (
              <div key={t.id} className="flex items-center justify-between gap-2 py-2">
                <div className="flex items-center gap-2">
                  <span className="w-8 shrink-0 text-center text-xs font-bold text-slate-400">{t.id}</span>
                  <div className="min-w-0">
                    <div dir="ltr" className="truncate text-right font-mono text-sm font-bold text-slate-700 dark:text-slate-200">
                      {t.en}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {t.ar}
                      {card && <span className="text-emerald-500"> · {LEVEL_LABEL[Math.min(card.level, MAX_LEVEL)]}</span>}
                      {card && card.level >= 1 && card.due > Date.now() && <span className="text-slate-400"> · موعدها يجي</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => speak(t.en, false)}
                    className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-slate-500 transition-colors hover:bg-blue-100 hover:text-blue-600 dark:bg-slate-800 dark:text-slate-300"
                    title="نطق عادي"
                  >
                    <IconSpeaker size={14} />
                  </button>
                  <button
                    onClick={() => speak(t.en, true)}
                    className="flex h-7 w-7 items-center justify-center rounded-md bg-slate-100 text-slate-500 transition-colors hover:bg-emerald-100 hover:text-emerald-600 dark:bg-slate-800 dark:text-slate-300"
                    title="نطق بطيء"
                  >
                    <IconSpeaker size={14} />
                    <span className="text-[8px] font-bold">x0.5</span>
                  </button>
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div className="py-6 text-center text-sm text-slate-400">مفيش نتائج للبحث</div>
          )}
        </div>
      </Card>
    </div>
  )
}