import { EXERCISES } from '../data/exercises'
import type { Exercise } from '../types'

export interface GeneratorConfig {
  topic: string
  difficulty: number
  count: number
  level: 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'mixed'
}

export interface GeneratedBatch {
  exercises: Exercise[]
  usedIds: string[]
}

const TOPIC_ALIASES: Record<string, string[]> = {
  'أصول': ['asset'],
  'الأصول': ['asset'],
  'خصوم': ['liability'],
  'الخصوم': ['liability'],
  'حقوق الملكية': ['equity'],
  'حقوق ملكية': ['equity'],
  'إيرادات': ['revenue'],
  'الإيرادات': ['revenue'],
  'مصروفات': ['expense'],
  'المصروفات': ['expense'],
  'استخراج الحسابات': ['account-identification', 'استخراج'],
  'زيادة ونقص': ['incdec', 'increase-decrease'],
  'زيادة/نقص': ['incdec', 'increase-decrease'],
  'مدين دائن': ['debitcredit'],
  'مدين/دائن': ['debitcredit'],
  'قيود يومية': ['journal'],
  'القيد اليومي': ['journal'],
  'معاملات مختلطة': ['mixed'],
  'مختلطة': ['mixed'],
}

function normalizeTopic(topic: string): string {
  return topic.trim()
}

export function buildExercisePool(config: GeneratorConfig): Exercise[] {
  let pool = EXERCISES

  // Filter by topic (match either keyword in topic field or in aliases)
  const topic = normalizeTopic(config.topic)
  if (topic && topic !== 'all' && topic !== 'الكل') {
    const aliases = TOPIC_ALIASES[topic] || []
    pool = pool.filter((e) => {
      const eTopic = e.topic.toLowerCase()
      const eCategory = e.category.toLowerCase()
      return (
        eTopic.includes(topic.toLowerCase()) ||
        eCategory.includes(topic.toLowerCase()) ||
        aliases.some((a) => eTopic.includes(a.toLowerCase()) || eCategory.includes(a.toLowerCase()))
      )
    })
  }

  // Filter by difficulty
  pool = pool.filter((e) => e.difficulty === config.difficulty || config.difficulty === 0)

  // Filter by level
  if (config.level !== 'mixed') {
    pool = pool.filter((e) => e.level === config.level)
  }

  return pool
}

export function generateQuestions(config: GeneratorConfig): Exercise[] {
  const pool = buildExercisePool(config)
  const shuffled = [...pool].sort(() => Math.random() - 0.5)
  const count = Math.min(config.count, shuffled.length, 20)
  return shuffled.slice(0, count)
}

export function getAvailableTopics(): string[] {
  const topics = new Set(EXERCISES.map((e) => e.topic))
  return ['all', ...Array.from(topics)]
}

export function countForFilters(config: GeneratorConfig): number {
  return buildExercisePool(config).length
}