import { useEffect, useRef, useState } from 'react'
import { Card, Button, Badge } from '../components/ui'
import { askAccountant, askLiveAI, INTERVIEW, gradeInterviewAnswer, type EntryReply, type ChatMsg } from '../lib/accountant'
import { getProgress, setAiAssistant } from '../lib/progress'
import { cn } from '../lib/cn'
import {
  IconQuestion,
  IconArrowLeft,
  IconRefresh,
  IconBookOpen,
  IconCheckCircle,
  IconXCircle,
  IconLightbulb,
  IconCheck,
  IconSpark,
} from '../components/icons'

interface Msg {
  id: number
  role: 'user' | 'bot'
  text: string
  entry?: EntryReply
}

interface InterviewState {
  active: boolean
  ix: number
  correct: number
  answered: number
}

const SUGGESTIONS = ['السلام عليكم يا أستاذ', 'بعت بضاعة 10,000 نقدًا', 'مشتريات بالدين 5,000', 'ابدأ المقابلة', 'إيه الفرق بين الخصم التجاري والنقدي؟']

const firstId = Date.now()
const initial: Msg[] = [
  {
    id: firstId,
    role: 'bot',
    text: 'أهلاً بيك. أنا المحاسب عادل — محاسب أستاذ، اشتغلت في دفاتر الشركات ومكاتب المراجعة أكتر من 15 سنة.\n\nاكتبلي عملية شغل حقيقية وأنا أكتبلك قيدها، أو اسألني عن أي مفهوم محاسبي، أو قول "ابدأ المقابلة" وهقابلك زي مدير توظيف.',
  },
]

export function Accountant() {
  const [messages, setMessages] = useState<Msg[]>(initial)
  const [input, setInput] = useState('')
  const [interview, setInterview] = useState<InterviewState | null>(null)
  const [aiOn, setAiOn] = useState(() => getProgress().aiAssistant !== false)
  const [aiLoading, setAiLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages])

  const push = (m: Msg) => setMessages((prev) => [...prev, m])

  const send = async (raw: string) => {
    const text = raw.trim()
    if (!text) return
    setInput('')
    push({ id: Date.now(), role: 'user', text })

    if (interview && interview.active) {
      const q = INTERVIEW[interview.ix]
      const ok = gradeInterviewAnswer(text, interview.ix)
      const nextIx = interview.ix + 1
      const finishedRound = nextIx >= INTERVIEW.length
      push({
        id: Date.now(),
        role: 'bot',
        text: ok
          ? 'إجابة ممتازة عشان مطابق للتقني!\n\nالنموذج الكامل للرد المحترف:\n' + q.model
          : 'مش مظبوطة أوي كتفاصيل.\n\nالنموذج الكامل للرد المحترف:\n' + q.model,
      })
      if (finishedRound) {
        const correct = interview.correct + (ok ? 1 : 0)
        const pct = Math.round((correct / INTERVIEW.length) * 100)
        const verdict =
          pct === 100
            ? 'رأيك محترم وقوي — أنت جاهز لمسك دفاتر فعلاً، خبراء الفاهمة في الشغل الحقيقي.'
            : pct >= 70
              ? 'ممتاز جدًا! عندك أساس قوي بربلك شوية تفاصيل زيادة وهتبقى جاهز بالكامل.'
              : pct >= 40
                ? 'ماشي تمام بس محتاج تراجع شوية — قول "ابدأ المقابلة" مرة تانية ولا روح سيناريوهات التطبيق العملي وارجع.'
                : 'لسه محتاج تدريب كتير — اقعش دورة "ابدأ التعلم" من غير ما تطيح، وجرّب المقابلة تاني.'
        push({
          id: Date.now(),
          role: 'bot',
          text: `خلّصنا المقابلة!\n\nنتيجتك: ${correct} من ${INTERVIEW.length} (${pct}%)\n\n${verdict}`,
        })
        setInterview({ active: false, ix: nextIx, correct, answered: INTERVIEW.length })
      } else {
        setInterview({ active: true, ix: nextIx, correct: interview.correct + (ok ? 1 : 0), answered: interview.answered + 1 })
        push({ id: Date.now(), role: 'bot', text: INTERVIEW[nextIx].q })
      }
      return
    }

    if (text.includes('مقابلة') || text.includes('انترفيو') || text.includes('قابلني') || text.includes('توظيف')) {
      const answerText = 'تمام، هعتبرك مرشح للقسم المالي بكرة الصبح. خلّنا نبدأ فورًا — كل سؤال هتجاوب عليه وأنا هقيّمك.\n\n' + INTERVIEW[0].q
      push({ id: Date.now(), role: 'bot', text: answerText })
      setInterview({ active: true, ix: 0, correct: 0, answered: 0 })
      return
    }

    const reply = askAccountant(text)
    if (reply.entry || !aiOn) {
      push({ id: Date.now(), role: 'bot', text: reply.text, entry: reply.entry })
      return
    }

    // no local answer → ask the live free AI
    setAiLoading(true)
    const controller = new AbortController()
    const timer = window.setTimeout(() => controller.abort(), 60000)
    const history: ChatMsg[] = messages
      .filter((m) => m.text && m.id !== 0)
      .slice(-10)
      .map((m) => ({ role: m.role === 'user' ? 'user' : 'assistant', content: m.text }))
    try {
      const aiText = await askLiveAI([...history, { role: 'user', content: text }], controller.signal)
      push({ id: Date.now(), role: 'bot', text: aiText })
    } catch {
      push({
        id: Date.now(),
        role: 'bot',
        text: 'مع الأسف خدمة الذكاء الحي مش متاحة دلوقتي (نيّت مش وصل أو حد إستخدام). هنا ردّ من القواعد المحلية:\n\n' + reply.text,
      })
    } finally {
      window.clearTimeout(timer)
      setAiLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card className="border-violet-200 border-2">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-violet-600 text-white flex items-center justify-center">
            <IconBookOpen size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">المحاسب الخبير</h1>
            <p className="text-sm text-slate-600">المحاسب عادل — خبرة 15 سنة في الشغل الحقيقي، اكتبله أي عملية أو اسأله سؤال</p>
          </div>
          <div className="mr-auto flex items-center gap-2">
            <button
              onClick={() => {
                const next = !aiOn
                setAiOn(next)
                setAiAssistant(next)
              }}
              title={aiOn ? 'الذكاء الحي شغال — إجابات برة القواعد بتيجي من خدمة مجانية خارجية' : 'الذكاء الحي مطفى — ردود من القواعد المحلية بس'}
              className={cn(
                'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors',
                aiOn
                  ? 'bg-violet-600 text-white border-violet-600 hover:bg-violet-700'
                  : 'bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200'
              )}
            >
              <IconSpark size={13} />
              الذكاء الحي: {aiOn ? 'شغال' : 'مطفى'}
            </button>
            {interview?.active && (
              <Badge color="green">مقابلة جارية</Badge>
            )}
          </div>
        </div>
      </Card>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => send(s === 'بعت بضاعة 10,000 نقدًا' ? 'بعت بضاعة 10,000 نقدًا' : s)}
            className="shrink-0 rounded-full bg-slate-100 border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>

      <Card className="border-slate-200 p-0 overflow-hidden">
        <div
          ref={scrollRef}
          className="h-[52vh] overflow-y-auto p-4 space-y-3 bg-slate-50/60 dark:bg-slate-900/40"
        >
          {messages.map((m) => (
            <div key={m.id} className={cn('flex', m.role === 'user' ? 'justify-start' : 'justify-end')}>
              <div
                className={cn(
                  'max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-line shadow-sm',
                  m.role === 'user'
                    ? 'bg-slate-800 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-100'
                )}
              >
                {m.text}
                {m.entry && (
                  <div className="mt-2 rounded-xl bg-violet-50 border border-violet-200 p-3 text-violet-900">
                    <div className="flex items-center gap-1.5 font-bold text-violet-800 mb-1.5">
                      <IconCheck size={14} /> القيد الصح
                    </div>
                    <div className="space-y-1 text-sm">
                      <div><b>من حـ</b> {m.entry.debit}{m.entry.amountLabel ? ` ${m.entry.amountLabel}` : ''}</div>
                      <div><b>إلى حـ</b> {m.entry.credit}{m.entry.amountLabel ? ` ${m.entry.amountLabel}` : ''}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {aiLoading && (
            <div className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed bg-white border border-slate-200 text-slate-500 shadow-sm dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300 flex items-center gap-2">
                <IconSpark size={14} className="animate-spin" />
                المحاسب بيفكر في الإجابة...
              </div>
            </div>
          )}
        </div>

        <div className="p-3 border-t border-slate-200 bg-white dark:bg-slate-900">
          <div className="flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  send(input)
                }
              }}
              rows={1}
              placeholder={interview?.active ? 'اكتب إجابتك على سؤال المقابلة...' : 'اكتب عملية شغل حقيقي أو اسأل سؤال...'}
              className="flex-1 resize-none rounded-xl border-2 border-slate-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-300 dark:bg-slate-800 dark:border-slate-700"
            />
            <Button variant="primary" onClick={() => send(input)} className="h-10 px-4 shrink-0">
              <IconArrowLeft size={18} />
            </Button>
          </div>
          <div className="mt-2 flex items-center justify-between gap-2">
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <IconLightbulb size={12} /> مثال: "بعت بضاعة 5,000 نقدًا" — هيقترحلك القيد فورًا
              {aiOn && <> · الأسئلة من برة القواعد بتروح لخدمة مجانية عامة (Pollinations) — ممكن تطفّيها من الزرار فوق</>}
            </p>
            <Button variant="ghost" className="text-xs" onClick={() => { setMessages(initial); setInterview(null) }}>
              <IconRefresh size={13} /> مسح المحادثة
            </Button>
          </div>
        </div>
      </Card>

      {interview?.answered !== undefined && interview.answered > 0 && !interview.active && (
        <ScoreCard correct={interview.correct} onReplay={() => {
          push({ id: Date.now(), role: 'bot', text: 'تمام، عدنا تاني من الأول.\n\n' + INTERVIEW[0].q })
          setInterview({ active: true, ix: 0, correct: 0, answered: 0 })
        }} />
      )}
    </div>
  )
}

function ScoreCard({ correct, onReplay }: { correct: number; onReplay: () => void }) {
  const pct = Math.round((correct / INTERVIEW.length) * 100)
  return (
    <Card className="border-violet-200 space-y-3">
      <div className="flex items-center gap-2 font-extrabold text-violet-900">
        <IconQuestion size={20} /> تقييم المقابلة
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-2">
          <div className="text-xl font-extrabold text-emerald-700 flex items-center justify-center gap-1">
            <IconCheckCircle size={17} /> {correct}
          </div>
          <div className="text-xs text-emerald-600">صح</div>
        </div>
        <div className="rounded-xl bg-red-50 border border-red-200 p-2">
          <div className="text-xl font-extrabold text-red-600 flex items-center justify-center gap-1">
            <IconXCircle size={17} /> {INTERVIEW.length - correct}
          </div>
          <div className="text-xs text-red-500">غلط</div>
        </div>
        <div className="rounded-xl bg-violet-50 border border-violet-200 p-2">
          <div className="text-xl font-extrabold text-violet-700">{pct}%</div>
          <div className="text-xs text-violet-600">النسبة</div>
        </div>
      </div>
      <Button variant="secondary" className="w-full" onClick={onReplay}>
        <IconRefresh size={15} /> إعادة المقابلة من جديد
      </Button>
    </Card>
  )
}