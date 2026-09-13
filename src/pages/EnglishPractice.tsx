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
  IconPen,
  IconSpark,
} from '../components/icons'

type QType = 'write' | 'letters' | 'complete'
type Phase = 'idle' | 'run' | 'done'

interface DrillItem {
  term: VocabTerm
  type: QType
  letterTiles: string[]
  masked: string
  isPhrase: boolean
}

const SESSION_SIZE = 8
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

function buildMasked(en: string): string {
  return en
    .split(' ')
    .map((w) => {
      const letters = w.replace(/[^a-z0-9]/gi, '')
      if (letters.length < 3) return w
      const hide = letters.length >= 6 ? 2 : 1
      const picks = new Set<number>()
      let guard = 0
      while (picks.size < hide && guard < 30) {
        const r = 1 + Math.floor(Math.random() * (w.length - 2))
        if (/[a-z0-9]/i.test(w[r])) picks.add(r)
        guard++
      }
      const out = w.split('')
      picks.forEach((r) => {
        out[r] = '＿'
      })
      return out.join('')
    })
    .join(' ')
}

function makeDrill(term: VocabTerm): DrillItem {
  const isPhrase = term.en.includes(' ')
  const choices: QType[] = ['write', 'complete']
  if (!isPhrase || term.en.split(' ').length <= 3) choices.push('letters')
  const type = choices[Math.floor(Math.random() * choices.length)]
  const letterTiles = isPhrase
    ? shuffle(term.en.split(' '))
    : shuffle(term.en.replace(/[^a-z0-9]/gi, '').split(''))
  return { term, type, letterTiles, masked: buildMasked(term.en), isPhrase }
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

const TYPE_LABEL: Record<QType, string> = {
  write: 'اكتب المصطلح بالإنجليزي',
  letters: 'رتّب الحروف / الكلمات صح',
  complete: 'كمّل الكلمة الناقصة',
}

export function EnglishPractice() {
  const [phase, setPhase] = useState<Phase>('idle')
  const [drill, setDrill] = useState<DrillItem[]>([])
  const [index, setIndex] = useState(0)
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

  const current = drill[index] ?? null

  const canSubmit = useMemo(() => {
    if (!current || answered) return false
    if (current.type === 'letters') return picked.length > 0
    return input.trim().length > 0
  }, [current, answered, picked, input])

  const builtAnswer = useMemo(() => {
    if (!current) return ''
    if (current.type === 'letters') {
      return current.isPhrase ? picked.join(' ') : picked.join('')
    }
    return input
  }, [current, picked, input])

  const startSession = () => {
    const items = shuffle(ACCOUNTING_ENGLISH).slice(0, SESSION_SIZE).map(makeDrill)
    setDrill(items)
    setIndex(0)
    setHearts(MAX_HEARTS)
    setCorrect(0)
    setAnswered(false)
    setOk(null)
    setInput('')
    setPicked([])
    setPhase('run')
  }

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
    recordExercise(`en-${current.term.id}`, match, 'إنجليزي محاسبي')
  }

  const nextQuestion = () => {
    if (hearts <= 0) {
      setPhase('done')
      return
    }
    if (index >= drill.length - 1) {
      setPhase('done')
      return
    }
    setIndex((i) => i + 1)
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

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1 py-1">
        <h1 className="text-2xl font-extrabold">تعلم الإنجليزي المحاسبي</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {ACCOUNTING_ENGLISH.length} مصطلح محاسبي بالإنجليزي — اكتب، رتّب، وكمّل بنفس أسلوب Duolingo
        </p>
      </div>

      {supportsSpeech && (
        <Card className="p-4">
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <IconSpeaker size={16} />
            النطق شغال: اسمع الكلمة بمعدل عادي أو بطيء
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
              <h2 className="text-lg font-extrabold">جولة تدريبية</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                كل جولة {SESSION_SIZE} كلمات عشوائية بثلاثة أنواع: اكتب، رتّب الحروف، كمل الكلمة. عندك {MAX_HEARTS} أرواح.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {(['write', 'letters', 'complete'] as QType[]).map((t) => (
                <Badge key={t} color="green">
                  {t === 'write' && <IconPen size={12} />}
                  {t === 'letters' && <span className="font-mono">A–Z</span>}
                  {t === 'complete' && <span className="font-mono">＿＿</span>}
                  {TYPE_LABEL[t]}
                </Badge>
              ))}
            </div>
            <Button onClick={startSession} className="px-6">
              <IconPlay size={16} />
              ابدأ الجولة
            </Button>
          </div>
        )}

        {phase === 'run' && current && (
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  {index + 1} / {drill.length}
                </span>
                <span className="flex items-center gap-1.5">{heartsDot(0)}{heartsDot(1)}{heartsDot(2)}</span>
              </div>
              <ProgressBar value={((index + (answered ? 1 : 0)) / drill.length) * 100} />
            </div>

            <div className="space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900/50">
              <div className="text-center space-y-2">
                <div className="text-2xl font-extrabold">{current.term.ar}</div>
                <Badge color="blue">{TYPE_LABEL[current.type]}</Badge>
                {current.type === 'complete' && (
                  <div
                    dir="ltr"
                    className="pt-1 font-mono text-lg tracking-[0.2em] text-emerald-600 dark:text-emerald-400"
                  >
                    {current.masked}
                  </div>
                )}
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

              {current.type === 'letters' ? (
                <div className="space-y-3">
                  {picked.length > 0 && (
                    <div
                      dir="ltr"
                      className="flex flex-wrap items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-300 bg-white p-3 font-mono text-lg font-bold dark:border-slate-600 dark:bg-slate-800"
                    >
                      {picked.join(current.isPhrase ? '  ' : '')}
                    </div>
                  )}
                  {picked.length === 0 && (
                    <div className="rounded-xl border-2 border-dashed border-slate-300 p-3 text-center text-sm text-slate-400 dark:border-slate-600">
                      دوس على الحروف تحتها بالترتيب الصحيح
                    </div>
                  )}
                  <div dir="ltr" className="flex flex-wrap justify-center gap-1.5">
                    {current.letterTiles.map((tile, ti) => (
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
                    placeholder={current.type === 'complete' ? 'اكتب الكلمة كاملة...' : 'Type the English term...'}
                    className="w-full rounded-xl border-2 border-slate-200 bg-white px-3 py-2.5 text-center font-mono text-lg outline-none focus:border-blue-500 dark:border-slate-600 dark:bg-slate-800"
                  />
                </div>
              )}
            </div>

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
                        اجابة صحيحة هي:
                      </div>
                      <div dir="ltr" className="pt-1 font-mono font-bold">{current.term.en}</div>
                      <div className="text-xs opacity-80">{current.term.ar}</div>
                    </div>
                  )}
                </>
              )}
            </div>

            {answered && (
              <div className="text-center">
                <Button variant={ok ? 'success' : 'primary'} onClick={nextQuestion}>
                  {index >= drill.length - 1 || hearts <= 0 ? 'شوف النتيجة' : 'التالي'}
                  <IconArrowRight size={16} />
                </Button>
              </div>
            )}
          </div>
        )}

        {phase === 'done' && (
          <div className="flex flex-col items-center gap-4 py-4 text-center">
            <div
              className={cn(
                'flex h-16 w-16 items-center justify-center rounded-2xl text-white shadow-md',
                'bg-green-500',
              )}
            >
              <IconSpark size={28} />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-extrabold">خلصت الجولة</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                أجبت صح على {correct} من {drill.length} والأرواح المتبقية {hearts}
              </p>
            </div>
            <ProgressBar value={(correct / drill.length) * 100} className="max-w-xs" />
            <div className="flex gap-2">
              <Button variant="ghost" onClick={() => setPhase('idle')}>
                رجوع
              </Button>
              <Button onClick={startSession}>
                <IconRefresh size={16} />
                جولة تانية
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
              <div className="min-w-0">
                <div dir="ltr" className="truncate text-right font-mono text-sm font-bold text-slate-700 dark:text-slate-200">
                  {t.en}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{t.ar}</div>
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