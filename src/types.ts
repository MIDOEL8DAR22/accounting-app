export type AccountType = 'asset' | 'expense' | 'liability' | 'equity' | 'revenue'

export type Side = 'debit' | 'credit'

export type Change = 'increase' | 'decrease'

export interface AccountInfo {
  id: string
  nameAr: string
  nameEn: string
  type: AccountType
  /** When increase -> which side */
  increaseSide: Side
  /** When decrease -> which side */
  decreaseSide: Side
}

export interface JournalLine {
  accountId: string
  accountNameAr: string
  side: Side
  amount: number
}

export interface JournalEntry {
  lines: JournalLine[]
}

export interface StepResult {
  transaction: string
  explanation: string
  accounts: string[]
  accountTypes: { account: string; type: AccountType; typeAr: string; typeEn?: string }[]
  changes: { account: string; change: Change; changeAr: string }[]
  sides: { account: string; side: Side; sideAr: string; reason: string }[]
  entry: JournalLine[]
  why: string
  memoryRule: string
  assumptions?: string[]
}

export interface Exercise {
  id: string
  level: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'
  difficulty: 1 | 2 | 3 | 4 | 5
  category: string
  question: string
  options?: string[]
  correctIndex?: number
  correctAnswer?: string[]
  explanation: string
  topic: string
}

export interface Lesson {
  id: string
  stageId: number
  title: string
  subtitle?: string
  blocks: LessonBlock[]
}

export type LessonBlock =
  | { type: 'text'; content: string }
  | { type: 'note'; content: string; tone?: 'info' | 'warn' | 'success' }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'example'; title: string; content: string[]; entry?: { debit?: string; credit?: string } }
  | { type: 'rule'; title: string; content: string }
  | { type: 'list'; title?: string; items: string[] }
  | { type: 'memory'; title: string; content: string }
  | { type: 'steps'; title?: string; steps: { label: string; detail?: string }[] }

export interface Flashcard {
  id: string
  front: string
  back: string
  hint?: string
}

export interface QuizQuestion {
  id: string
  topic: string
  difficulty: 1 | 2 | 3 | 4 | 5
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  mistakeCategory: string
}

export interface Stage {
  id: number
  title: string
  tagline: string
  icon: string
  goal: string
  lessons: string[]
}

export interface AccountMapping {
  id: string
  keywords: string[]
  account: string
  accountEn: string
  type: AccountType
  examples: string[]
  note?: string
}