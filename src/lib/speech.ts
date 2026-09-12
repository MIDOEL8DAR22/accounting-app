let currentKey: string | null = null
let voices: SpeechSynthesisVoice[] = []
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((fn) => fn())
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const loadVoices = () => {
    voices = window.speechSynthesis.getVoices()
  }
  loadVoices()
  window.speechSynthesis.onvoiceschanged = loadVoices
}

function pickArabicVoice(): SpeechSynthesisVoice | undefined {
  const arabic = voices.filter((v) => v.lang.toLowerCase().startsWith('ar'))
  return (
    arabic.find((v) => /ar[-_]EG/i.test(v.lang)) ??
    arabic.find((v) => /ar[-_]SA/i.test(v.lang)) ??
    arabic.find((v) => /ar[-_]/i.test(v.lang)) ??
    arabic[0]
  )
}

export function speechAvailable(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

export function speak(key: string, text: string) {
  if (!speechAvailable() || !text) return
  window.speechSynthesis.cancel()
  currentKey = key
  const utterance = new SpeechSynthesisUtterance(text)
  const voice = pickArabicVoice()
  if (voice) utterance.voice = voice
  utterance.lang = voice?.lang ?? 'ar-EG'
  utterance.rate = 0.9
  utterance.pitch = 0.95
  utterance.onend = () => {
    if (currentKey === key) {
      currentKey = null
      emit()
    }
  }
  utterance.onerror = () => {
    if (currentKey === key) {
      currentKey = null
      emit()
    }
  }
  window.speechSynthesis.speak(utterance)
  emit()
}

export function stopSpeech() {
  if (!speechAvailable()) return
  window.speechSynthesis.cancel()
  currentKey = null
  emit()
}

export function isSpeaking(key: string): boolean {
  return currentKey === key
}

export function subscribeSpeech(fn: () => void): () => void {
  listeners.add(fn)
  return () => listeners.delete(fn)
}