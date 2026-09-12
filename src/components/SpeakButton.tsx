import { useEffect, useState } from 'react'
import { speak, stopSpeech, isSpeaking, subscribeSpeech, speechAvailable } from '../lib/speech'
import { IconSpeaker, IconPause, IconXCircle } from './icons'
import { cn } from '../lib/cn'

interface SpeakButtonProps {
  /** unique key for this narration target */
  speechKey: string
  text: string
  label?: string
  className?: string
  size?: number
}

export function SpeakButton({ speechKey, text, label, className, size = 18 }: SpeakButtonProps) {
  const [active, setActive] = useState(() => isSpeaking(speechKey))

  useEffect(() => subscribeSpeech(() => setActive(isSpeaking(speechKey))), [speechKey])

  if (!speechAvailable() || !text.trim()) return null

  return (
    <button
      onClick={() => (active ? stopSpeech() : speak(speechKey, text))}
      aria-label={active ? 'إيقاف القراءة' : label ?? 'استمع'}
      title={active ? 'إيقاف القراءة' : 'استمع بالعربي'}
      className={cn(
        'inline-flex shrink-0 items-center justify-center gap-1.5 rounded-full font-bold transition-all',
        active
          ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
          : 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-500/15 dark:text-blue-300 dark:hover:bg-blue-500/25',
        label ? 'px-3 py-1.5 text-sm' : 'h-9 w-9',
        className
      )}
    >
      {active ? <IconPause size={size} /> : <IconSpeaker size={size} />}
      {label && <span>{active ? 'وقف القراءة' : label}</span>}
    </button>
  )
}

export function SpeechUnsupported() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-400 dark:bg-slate-800">
      <IconXCircle size={14} /> المتصفح لا يدعم القراءة الصوتية
    </span>
  )
}