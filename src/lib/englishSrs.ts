import { ACCOUNTING_ENGLISH } from '../data/accountingEnglish'
import type { VocabTerm } from '../data/accountingEnglish'

const STORAGE_KEY = 'accounting-app-english-srs'
const NEW_BATCH = 10
const REVIEW_CAP = 15

const MIN10 = 10 * 60 * 1000
const DAY = 24 * 60 * 60 * 1000

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