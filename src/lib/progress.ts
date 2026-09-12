import { LESSONS } from '../data/stages'
import { FLASHCARDS } from '../data/flashcards'

const STORAGE_KEY = 'accounting-app-progress'
const BACKUP_KEY = 'accounting-app-progress-bak'
const VERSION = 1

export interface UserProgress {
  version?: number
  completedStages: number[]
  completedLessons: string[]
  exercisesSolved: number
  correctAnswers: number
  wrongAnswers: number
  currentStreak: number
  bestStreak: number
  totalPoints: number
  quizScores: { quizId: string; score: number; total: number; date: string }[]
  weakTopics: Record<string, number>
  strongTopics: Record<string, number>
  lastActivity: string
  lastLessonId: string | null
  currentStage: number
  exerciseHistory: { exerciseId: string; correct: boolean; date: string }[]
  solverSolved: number
  flashcardsReviewed: number
  flashcardsKnown: number
  entriesBuilt: number
  dictionarySearches: number
  summaryViews: number
  dailyCards: { date: string; cardId: number; known: boolean }[]
  accountTypesCompleted: string[]
  accountMixedCompleted: boolean
}

const defaultProgress: UserProgress = {
  version: VERSION,
  completedStages: [],
  completedLessons: [],
  exercisesSolved: 0,
  correctAnswers: 0,
  wrongAnswers: 0,
  currentStreak: 0,
  bestStreak: 0,
  totalPoints: 0,
  quizScores: [],
  weakTopics: {},
  strongTopics: {},
  lastActivity: '',
  lastLessonId: null,
  currentStage: 1,
  exerciseHistory: [],
  solverSolved: 0,
  flashcardsReviewed: 0,
  flashcardsKnown: 0,
  entriesBuilt: 0,
  dictionarySearches: 0,
  summaryViews: 0,
  dailyCards: [],
  accountTypesCompleted: [],
  accountMixedCompleted: false,
}

export function getProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const backup = localStorage.getItem(BACKUP_KEY)
      return backup ? { ...defaultProgress, ...JSON.parse(backup) } : { ...defaultProgress }
    }
    const parsed = { ...defaultProgress, ...JSON.parse(raw) }
    if (parsed.version !== VERSION) {
      // still usable, just prop the version forward
      parsed.version = VERSION
    }
    return parsed
  } catch {
    return { ...defaultProgress }
  }
}

export function saveProgress(p: UserProgress): void {
  p.version = VERSION
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p))
    // keep a backup copy for resilience
    localStorage.setItem(BACKUP_KEY, JSON.stringify(p))
  } catch {
    // storage full or unavailable — still functional in-memory
  }
}

export function recordExercise(exerciseId: string, correct: boolean, topic: string): void {
  const progress = getProgress()
  const now = new Date().toISOString()

  progress.exercisesSolved++
  progress.lastActivity = now
  progress.exerciseHistory.push({ exerciseId, correct, date: now })

  if (correct) {
    progress.correctAnswers++
    progress.totalPoints += 10
    progress.currentStreak++
    progress.strongTopics[topic] = (progress.strongTopics[topic] || 0) + 1
  } else {
    progress.wrongAnswers++
    progress.totalPoints += 2
    progress.currentStreak = 0
    progress.weakTopics[topic] = (progress.weakTopics[topic] || 0) + 1
  }

  if (progress.currentStreak > progress.bestStreak) {
    progress.bestStreak = progress.currentStreak
  }

  saveProgress(progress)
}

export function recordQuiz(score: number, total: number): void {
  const progress = getProgress()
  const now = new Date().toISOString()

  progress.quizScores.push({
    quizId: `quiz-${Date.now()}`,
    score,
    total,
    date: now,
  })

  progress.totalPoints += score * 5
  progress.lastActivity = now

  saveProgress(progress)
}

export function completeLesson(lessonId: string): void {
  const progress = getProgress()

  if (!progress.completedLessons.includes(lessonId)) {
    progress.completedLessons.push(lessonId)
  }

  progress.lastLessonId = lessonId
  progress.lastActivity = new Date().toISOString()

  saveProgress(progress)
}

export function touchLesson(lessonId: string): void {
  const progress = getProgress()
  progress.lastLessonId = lessonId
  progress.lastActivity = new Date().toISOString()
  saveProgress(progress)
}

export function recordSolver(): void {
  const progress = getProgress()
  progress.solverSolved++
  progress.totalPoints += 5
  progress.lastActivity = new Date().toISOString()
  saveProgress(progress)
}

export function recordFlashcard(known: boolean): void {
  const progress = getProgress()
  progress.flashcardsReviewed++
  if (known) {
    progress.flashcardsKnown++
    progress.totalPoints += 3
  } else {
    progress.totalPoints += 1
  }
  progress.lastActivity = new Date().toISOString()
  saveProgress(progress)
}

function todayKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function getDailyCard(): { cardId: number; known: boolean | null } {
  const progress = getProgress()
  const today = todayKey()
  const todayEntry = progress.dailyCards.find((d) => d.date === today)
  if (todayEntry) return { cardId: todayEntry.cardId, known: todayEntry.known }
  const last = progress.dailyCards[progress.dailyCards.length - 1]
  const nextId = last ? (last.cardId + 1) % FLASHCARDS.length : 0
  return { cardId: nextId, known: null }
}

export function judgeDailyCard(known: boolean): void {
  const progress = getProgress()
  const today = todayKey()
  if (progress.dailyCards.some((d) => d.date === today)) return
  const { cardId } = getDailyCard()
  progress.dailyCards.push({ date: today, cardId, known })
  saveProgress(progress)
  recordFlashcard(known)
}

export function recordEntry(): void {
  const progress = getProgress()
  progress.entriesBuilt++
  progress.totalPoints += 10
  progress.lastActivity = new Date().toISOString()
  saveProgress(progress)
}

export function recordDictionarySearch(): void {
  const progress = getProgress()
  progress.dictionarySearches++
  progress.totalPoints += 1
  progress.lastActivity = new Date().toISOString()
  saveProgress(progress)
}

export function recordSummaryView(): void {
  const progress = getProgress()
  progress.summaryViews++
  progress.lastActivity = new Date().toISOString()
  saveProgress(progress)
}

export function resumeTarget(): { lessonId: string; lessonTitle: string; stageId: number } | null {
  const progress = getProgress()
  if (!progress.lastLessonId) return null
  const lesson = LESSONS.find((l) => l.id === progress.lastLessonId)
  if (!lesson) return null
  return { lessonId: lesson.id, lessonTitle: lesson.title, stageId: lesson.stageId }
}

export function completeStage(stageId: number): void {
  const progress = getProgress()

  if (!progress.completedStages.includes(stageId)) {
    progress.completedStages.push(stageId)
  }

  progress.lastActivity = new Date().toISOString()

  saveProgress(progress)
}

export function getCurrentStage(): number {
  const progress = getProgress()
  if (progress.completedStages.length === 0) return 1
  return Math.max(...progress.completedStages) + 1
}

export function getProgressPercentage(): number {
  const progress = getProgress()
  const stagesFraction = progress.completedStages.length / 6
  const lessonsFraction = progress.completedLessons.length / LESSONS.length
  const exercisesFraction = Math.min(1, progress.exercisesSolved / 60)
  const activities =
    progress.quizScores.length +
    progress.solverSolved +
    progress.flashcardsReviewed +
    progress.entriesBuilt +
    progress.dictionarySearches +
    progress.summaryViews
  const activityFraction = Math.min(1, activities / 50)
  const total =
    (stagesFraction * 0.4 + lessonsFraction * 0.3 + exercisesFraction * 0.15 + activityFraction * 0.15) *
    100
  return Math.round(Math.min(100, total))
}

export function completeAccountType(type: string): void {
  const progress = getProgress()
  if (!progress.accountTypesCompleted.includes(type)) {
    progress.accountTypesCompleted.push(type)
  }
  progress.lastActivity = new Date().toISOString()
  saveProgress(progress)
}

export function completeAccountMixed(): void {
  const progress = getProgress()
  progress.accountMixedCompleted = true
  progress.lastActivity = new Date().toISOString()
  saveProgress(progress)
}

export function resetProgress(): void {
  localStorage.removeItem(STORAGE_KEY)
  localStorage.removeItem(BACKUP_KEY)
}

export function getWeakTopics(): string[] {
  const progress = getProgress()
  return Object.entries(progress.weakTopics)
    .sort((a, b) => b[1] - a[1])
    .map(([topic]) => topic)
}

export function getStats() {
  const progress = getProgress()
  const totalAnswered = progress.correctAnswers + progress.wrongAnswers

  return {
    completedStages: progress.completedStages.length,
    completedLessons: progress.completedLessons.length,
    exercisesSolved: progress.exercisesSolved,
    correctAnswers: progress.correctAnswers,
    wrongAnswers: progress.wrongAnswers,
    accuracy: totalAnswered > 0 ? Math.round((progress.correctAnswers / totalAnswered) * 100) : 0,
    currentStreak: progress.currentStreak,
    bestStreak: progress.bestStreak,
    totalPoints: progress.totalPoints,
    totalQuizzes: progress.quizScores.length,
    averageQuizScore:
      progress.quizScores.length > 0
        ? Math.round(
            progress.quizScores.reduce((sum, q) => sum + (q.score / q.total) * 100, 0) /
              progress.quizScores.length
          )
        : 0,
    progressPercentage: getProgressPercentage(),
    weakTopics: getWeakTopics(),
    lastActivity: progress.lastActivity,
    lastLessonId: progress.lastLessonId,
    solverSolved: progress.solverSolved,
    flashcardsReviewed: progress.flashcardsReviewed,
    flashcardsKnown: progress.flashcardsKnown,
    entriesBuilt: progress.entriesBuilt,
    dictionarySearches: progress.dictionarySearches,
    summaryViews: progress.summaryViews,
  }
}
