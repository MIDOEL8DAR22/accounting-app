import { useEffect, useMemo, useState } from 'react'
import { Card, Button, Badge, ProgressBar } from '../components/ui'
import { ACCOUNTING_ENGLISH } from '../data/accountingEnglish'
import type { VocabTerm } from '../data/accountingEnglish'
import { recordExercise } from '../lib/progress'
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
} from '../components/icons'

type Phase = 'idle' | 'run' | 'done'

interface Step {
  term: VocabTerm
  round: 0 | 1 | 2
}

const MAX_HEARTS = 3

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

function pickVoice(): SpeechSynthesisVoice | null {
  if (voiceCache !== undefined) return voiceCache
  const synth = window.speechSynthesis
  if (!synth) {
    voiceCache = null
    return null
  }
  const voices = synth.getVoices()
  const voice =
    voices.find((v) => v.lang === 'en-US') ??
    voices.find((v) => v.lang.startsWith('en-US')) ??
    voices.find((v) => v.lang.startsWith('en')) ??
    null
  voiceCache = voice
  return voice
}

function speak(text: string, slow: boolean) {
  const synth = window.speechSynthesis
  if (!synth) return
  synth.cancel()
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  u.rate = slow ? 0.55 : 1
  u.pitch = 1
  const voice = pickVoice()
  if (voice) u.voice = voice
  synth.speak(u)
}

export function EnglishPractice() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [stepIndex, setStepIndex] = useState(0)
  const [hearts, setHearts] = useState(MAX_HEARTS)
  const [correct, setCorrect] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [ok, setOk] = useState<boolean | null>(null)
  const [input, setInput] = useState('')
  const [picked, setPicked] = useState<string[]>([])
  const [query, setQuery] = useState('')

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

  const supportsSpeech = useMemo(() => {
    try {
      return typeof window !== 'undefined' && 'speechSynthesis' in window
    } catch {
      return false
    }
  }, [])

  const steps = useMemo<Step[]>(() => {
    const s: Step[] = []
    for (const t of ACCOUNTING_ENGLISH) {
      for (let r = 0; r < 3; r++) s.push({ term: t, round: r as 0 | 1 | 2 })
    }
    return s
  }, [])

  const current = steps[stepIndex]
  const isPhrase = (t: VocabTerm) => t.en.includes(' ')
  const letterTiles = useMemo<string[]>(() => {
    if (!current || current.round !== 1) return []
    return isPhrase(current.term)
      ? shuffle(current.term.en.split(' '))
      : shuffle(current.term.en.replace(/[^a-z0-9]/gi, '').split(''))
  }, [current])

  useEffect(() => {
    if (phase !== 'run' || !current) return
    if (current.round === 0) {
      const timer = setTimeout(() => speak(current.term.en, false), 300)
      return () => clearTimeout(timer)
    }
  }, [phase, current])

  const startSession = () => {
    setStepIndex(0)
    setHearts(MAX_HEARTS)
    setCorrect(0)
    setAnswered(false)
    setOk(null)
    setInput('')
    setPicked([])
    setPhase('run')
  }

  const canSubmit = useMemo(() => {
    if (!current || current.round === 0 || answered) return false
    if (current.round === 1) return picked.length > 0
    return input.trim().length > 0
  }, [current, answered, picked, input])

  const builtAnswer = useMemo(() => {
    if (!current) return ''
    if (current.round === 1) return isPhrase(current.term) ? picked.join(' ') : picked.join('')
    return input
  }, [current, picked, input])

  const pickTile = (tile: string) => {
    if (answered) return
    setPicked((p) => [...p, tile])
  }

  const undoPick = () => {
    if (answered) return
    setPicked((p) => p.slice(0, -1))
  }

  const submit = () => {
    if (!current || !canSubmit) return
    const match = norm(builtAnswer) === norm(current.term.en)
    setAnswered(true)
    setOk(match)
    if (match) setCorrect((c) => c + 1)
    else setHearts((h) => h - 1)
    recordExercise(current.round === 1 ? `en-l-${current.term.id}` : `en-w-${current.term.id}`, match, 'إنجليزي محاسبي')
  }

  const nextStep = () => {
    if (hearts <= 0 || stepIndex >= steps.length - 1) {
      setPhase('done')
      return
    }
    setStepIndex((i) => i + 1)
    setAnswered(false)
    setOk(null)
    setInput('')
    setPicked([])
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ACCOUNTING_ENGLISH
    return ACCOUNTING_ENGLISH.filter(
      (t) => t.en.toLowerCase().includes(q) || t.ar.includes(q),
    )
  }, [query])

  const heartsDot = (i: number) => (
    <span
      key={i}
      className={cn(
        'inline-block h-2.5 w-2.5 rounded-full',
        i < hearts ? 'bg-red-400' : 'bg-slate-300 dark:bg-slate-700',
      )}
    />
  )

  const challengeRounds = 2
  const totalScore = ACCOUNTING_ENGLISH.length * challengeRounds

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1 py-1">
        <h1 className="text-2xl font-extrabold">تعلم الإنجليزي المحاسبي</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {ACCOUNTING_ENGLISH.length} مصطلح محاسبي — كل كلمة بتمر بـ 3 مراحل بالترتيب
        </p>
      </div>

      {supportsSpeech && (
        <Card className="p-4">
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <IconSpeaker size={16} />
            النطق شغال: في المرحلة الأولى الكلمة بتتنطق لوحدها، وساعات في أي وقت عادي أو بطيء
            <button
              onClick={() => speak('accounting accounting', true)}
              className="text-xs font-bold text-blue-600 dark:text-blue-400 underline"
            >
              جرّب النطق
            </button>
          </div>
        </Card>
      )}

      <Card className="p-4 sm:p-6">
        {phase === 'idle' && (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md">
              <IconSpeaker size={28} />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-extrabold">إزاي بتيجي الجولة؟</h2>
              <p className="max-w-lg text-sm text-slate-500 dark:text-slate-400">
                الكلمات جاية بالترتيب (من 1 لـ {ACCOUNTING_ENGLISH.length}). كل كلمة بتعدي على 3 مراحل:
              </p>
            </div>
            <div className="grid w-full max-w-md gap-2 text-right">
              <div className="flex items-center gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-3 dark:border-blue-500/20 dark:bg-blue-500/10">
                <Badge color="blue">1</Badge>
                <div className="text-sm">
                  <div className="font-bold">اسمع النطق</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">الكلمة بتتكتب عادي وتتنطق لوحدها — بس اسمع وخلاص</div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-3 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                <Badge color="green">2</Badge>
                <div className="text-sm">
                  <div className="font-bold">رتّب الحروف</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">المعنى بالعربي وتجمع الحروف (أو الكلمات) من الاختيارات</div>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-3 dark:border-amber-500/20 dark:bg-amber-500/10">
                <Badge color="amber">3</Badge>
                <div className="text-sm">
                  <div className="font-bold">اكتب بالإنجليزي</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">المعنى بالعربي وتكتب المصطلح بالإنجليزي من حفظك</div>
                </div>
              </div>
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500">
              عندك {MAX_HEARTS} أرواح — أي غلط في مرحلة الحروف أو الكتابة بيخسر قلب
            </div>
            <Button onClick={startSession} className="px-6">
              <IconPlay size={16} />
              ابدأ من أول كلمة
            </Button>
          </div>
        )}

        {phase === 'run' && current && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                كلمة {steps.indexOf(current) / 3 + 1} من {ACCOUNTING_ENGLISH.length} · المرحلة {current.round + 1} / 3
              </span>
              <span className="flex items-center gap-1.5">{heartsDot(0)}{heartsDot(1)}{heartsDot(2)}</span>
            </div>
            <ProgressBar value={(stepIndex / steps.length) * 100} />

            <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
              {current.round === 0 ? (
                <div className="space-y-4 py-2 text-center">
                  <Badge color="blue">1) اسمع النطق</Badge>
                  <div dir="ltr" className="pt-2 font-mono text-3xl font-extrabold tracking-wide text-slate-800 dark:text-slate-100">
                    {current.term.en}
                  </div>
                  <div className="text-base text-slate-500 dark:text-slate-400">{current.term.ar}</div>
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="secondary" className="px-3 py-2 text-xs" onClick={() => speak(current.term.en, false)}>
                      <IconSpeaker size={14} />
                      عادي
                    </Button>
                    <Button variant="secondary" className="px-3 py-2 text-xs" onClick={() => speak(current.term.en, true)}>
                      <IconSpeaker size={14} />
                      بطيء
                    </Button>
                  </div>
                  <div className="text-xs text-slate-400 dark:text-slate-500">اسمع كويس النطق وتابع</div>
                  <Button onClick={nextStep}>
                    متابعة
                    <IconArrowRight size={16} />
                  </Button>
                </div>
              ) : (
                <>
                  <div className="text-center space-y-2">
                    <div className="text-2xl font-extrabold">{current.term.ar}</div>
                    <Badge color={current.round === 1 ? 'green' : 'amber'}>
                      {current.round === 1 ? '2) رتّب الحروف / الكلمات صح' : '3) اكتب المصطلح بالإنجليزي'}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <Button variant="secondary" className="px-3 py-2 text-xs" onClick={() => speak(current.term.en, false)}>
                      <IconSpeaker size={14} />
                      عادي
                    </Button>
                    <Button variant="secondary" className="px-3 py-2 text-xs" onClick={() => speak(current.term.en, true)}>
                      <IconSpeaker size={14} />
                      بطيء
                    </Button>
                  </div>

                  {current.round === 1 ? (
                    <div className="space-y-3">
                      {picked.length > 0 && (
                        <div
                          dir="ltr"
                          className="flex flex-wrap items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-300 bg-white p-3 font-mono text-lg font-bold dark:border-slate-600 dark:bg-slate-800"
                        >
                          {picked.join(isPhrase(current.term) ? '  ' : '')}
                        </div>
                      )}
                      {picked.length === 0 && (
                        <div className="rounded-xl border-2 border-dashed border-slate-300 p-3 text-center text-sm text-slate-400 dark:border-slate-600">
                          دوس على الحروف تحتها بالترتيب الصحيح
                        </div>
                      )}
                      <div dir="ltr" className="flex flex-wrap justify-center gap-1.5">
                        {letterTiles.map((tile, ti) => (
                          <button
                            key={`${tile}-${ti}`}
                            onClick={() => pickTile(tile)}
                            className="flex h-11 items-center justify-center rounded-lg border-2 border-slate-200 bg-white px-2.5 font-mono text-base font-bold text-slate-700 shadow-sm transition-colors hover:border-emerald-400 hover:text-emerald-600 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
                          >
                            {tile}
                          </button>
                        ))}
                      </div>
                      <div className="flex items-center justify-center gap-2">
                        {picked.length > 0 && (
                          <Button variant="ghost" className="px-3 py-2 text-xs" onClick={undoPick}>
                            مسح آخر
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div dir="ltr" className="mx-auto max-w-md text-center">
                      <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') submit()
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

            {current.round !== 0 && (
              <div className="flex items-center justify-center gap-2">
                {!answered && (
                  <Button onClick={submit} disabled={!canSubmit} className="min-w-36">
                    <IconCheck size={16} />
                    اتأكد
                  </Button>
                )}
                {answered && (
                  <>
                    {ok ? (
                      <div className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                        <IconCheckCircle size={16} />
                        صحيح! أحسنت
                      </div>
                    ) : (
                      <div className="rounded-xl bg-red-50 px-4 py-2 text-red-700 dark:bg-red-500/10 dark:text-red-300">
                        <div className="flex items-center gap-2">
                          <IconXCircle size={16} />
                          الإجابة الصحيحة:
                        </div>
                        <div dir="ltr" className="pt-1 font-mono font-bold">{current.term.en}</div>
                        <div className="text-xs opacity-80">{current.term.ar}</div>
                      </div>
                    )}
                  </>
                )}
                {answered && (
                  <Button variant={ok ? 'success' : 'primary'} onClick={nextStep}>
                    {hearts <= 0 || stepIndex >= steps.length - 1 ? 'شوف النتيجة' : 'الكلمة الجاية'}
                    <IconArrowRight size={16} />
                  </Button>
                )}
              </div>
            )}
          </div>
        )}

        {phase === 'done' && (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-green-500 text-white shadow-md">
              <IconSpark size={28} />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-extrabold">
                {hearts <= 0 ? 'خلصت الأرواح' : 'خلصت كل الكلمات!'}
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                عدّيت على {ACCOUNTING_ENGLISH.length} كلمة · صحِّحت {correct} من {totalScore} مرحلة تحدّي
              </p>
            </div>
            <ProgressBar value={(correct / totalScore) * 100} className="max-w-xs" />
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setPhase('idle')}>
                رجوع
              </Button>
              <Button onClick={startSession}>
                <IconRefresh size={16} />
                ابدأ من الأول
              </Button>
            </div>
          </div>
        )}
      </Card>

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
          {filtered.map((t) => (
            <div key={t.id} className="flex items-center justify-between gap-2 py-2">
              <div className="flex items-center gap-2">
                <span className="w-8 shrink-0 text-center text-xs font-bold text-slate-400">{t.id}</span>
                <div className="min-w-0">
                  <div dir="ltr" className="truncate text-right font-mono text-sm font-bold text-slate-700 dark:text-slate-200">
                    {t.en}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">{t.ar}</div>
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
          ))}
          {filtered.length === 0 && (
            <div className="py-6 text-center text-sm text-slate-400">مفيش نتائج للبحث</div>
          )}
        </div>
      </Card>
    </div>
  )
}