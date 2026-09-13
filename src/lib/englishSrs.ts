import { ACCOUNTING_ENGLISH } from '../data/accountingEnglish'
import type { VocabTerm } from '../data/accountingEnglish'

const STORAGE_KEY = 'accounting-app-english-srs'
const DAYS_KEY = 'accounting-app-english-days'
const TODAY_WORDS_KEY = 'accounting-app-english-today-words'
const NEW_BATCH = 10
const REVIEW_CAP = 15

const MIN10 = 10 * 60 * 1000
const DAY = 24 * 60 * 60 * 1000

function dateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function markPracticeToday(): void {
  try {
    const today = dateStr(new Date())
    const days = new Set(localStorageDays())
    days.add(today)
    localStorage.setItem(DAYS_KEY, JSON.stringify([...days]))
  } catch {
    // ignore
  }
}

function localStorageDays(): string[] {
  try {
    const raw = localStorage.getItem(DAYS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((s: unknown): s is string => typeof s === 'string') : []
  } catch {
    return []
  }
}

export function getStreak(): number {
  const days = normalizeDays(localStorageDays())
  if (days.length === 0) return 0
  const today = startOfDay(new Date())
  const yesterday = today - DAY
  let cursor = days.includes(dateStr(new Date(today)))
    ? today
    : days.includes(dateStr(new Date(yesterday)))
      ? yesterday
      : null
  if (cursor === null) return 0
  let streak = 0
  while (days.includes(dateStr(new Date(cursor)))) {
    streak++
    cursor -= DAY
  }
  return streak
}

export function getPracticedToday(): string[] {
  const today = dateStr(new Date())
  return localStorageDays().filter((d) => d === today)
}

function normalizeDays(days: string[]): string[] {
  return [...new Set(days)].filter((d) => !Number.isNaN(Date.parse(d)))
}

function startOfDay(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime()
}

export function markWordPracticed(id: number): void {
  try {
    const today = dateStr(new Date())
    const raw = localStorage.getItem(TODAY_WORDS_KEY)
    let entries: string[] = raw ? JSON.parse(raw) : []
    entries = entries.filter((e) => e.startsWith(today))
    const key = `${today}:${id}`
    if (!entries.includes(key)) entries.push(key)
    localStorage.setItem(TODAY_WORDS_KEY, JSON.stringify(entries))
  } catch {
    // ignore
  }
}

export function wordsPracticedToday(): number {
  const today = dateStr(new Date())
  try {
    const raw = localStorage.getItem(TODAY_WORDS_KEY)
    const entries: string[] = raw ? JSON.parse(raw) : []
    return entries.filter((e) => e.startsWith(today)).length
  } catch {
    return 0
  }
}

export const INTERVALS = [MIN10, MIN10, 1 * DAY, 3 * DAY, 7 * DAY, 14 * DAY, 30 * DAY]

export const MAX_LEVEL = INTERVALS.length - 1

export interface SrsCard {
  id: number
  level: number
  due: number
  introduced: number
  reviews: number
}

export const LEVEL_LABEL = [
  'جديدة',
  'بذرة',
  'برعم صغير',
  'برعم',
  'زهرة',
  'زهرة كاملة',
  'ناضجة',
]

export function getCards(): SrsCard[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as SrsCard[]
    return parsed.filter((c) => ACCOUNTING_ENGLISH.some((t) => t.id === c.id))
  } catch {
    return []
  }
}

function saveCards(cards: SrsCard[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cards))
  } catch {
    // storage unavailable
  }
}

export function getDueCards(): SrsCard[] {
  const now = Date.now()
  return getCards()
    .filter((c) => c.level >= 1 && c.due <= now)
    .sort((a, b) => a.due - b.due)
    .slice(0, REVIEW_CAP)
}

export function dueCount(): number {
  const now = Date.now()
  return getCards().filter((c) => c.level >= 1 && c.due <= now).length
}

export function getNewWords(): VocabTerm[] {
  const cards = getCards()
  return ACCOUNTING_ENGLISH.filter((t) => !cards.some((c) => c.id === t.id))
    .slice(0, NEW_BATCH)
}

export function finishNew(term: VocabTerm): void {
  const cards = getCards()
  const idx = cards.findIndex((c) => c.id === term.id)
  const now = Date.now()
  if (idx >= 0) {
    cards[idx] = { ...cards[idx], level: 1, due: now + INTERVALS[1], reviews: cards[idx].reviews + 1 }
  } else {
    cards.push({ id: term.id, level: 1, due: now + INTERVALS[1], introduced: now, reviews: 1 })
  }
  saveCards(cards)
  markPracticeToday()
  markWordPracticed(term.id)
}

export type RecallRating = 'easy' | 'good' | 'hard' | 'miss'

export function recall(card: SrsCard, rating: RecallRating): SrsCard {
  const now = Date.now()
  const next: SrsCard = { ...card, reviews: card.reviews + 1 }
  if (rating === 'miss') {
    next.level = Math.max(0, card.level - 1)
    next.due = now + (next.level <= 1 ? MIN10 : DAY)
    return next
  }
  const boost = rating === 'easy' ? 2 : rating === 'good' ? 1 : 0
  next.level = Math.min(MAX_LEVEL, card.level + boost)
  next.due = now + INTERVALS[next.level]
  return next
}

export function updateCard(card: SrsCard): void {
  const cards = getCards()
  const idx = cards.findIndex((c) => c.id === card.id)
  if (idx >= 0) {
    cards[idx] = card
  } else {
    cards.push(card)
  }
  saveCards(cards)
}

export function resetCards(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
}

export function cardByLevel(): Record<number, number> {
  const counts: Record<number, number> = {}
  getCards().forEach((c) => {
    counts[c.level] = (counts[c.level] || 0) + 1
  })
  return counts
}