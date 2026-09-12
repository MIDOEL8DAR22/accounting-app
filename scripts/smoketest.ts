import { solveTransaction } from '../src/lib/solver'
import { EXERCISES } from '../src/data/exercises'
import { QUIZ_QUESTIONS } from '../src/data/quizzes'
import { FLASHCARDS } from '../src/data/flashcards'
import { LESSONS, STAGES } from '../src/data/stages'
import { ACCOUNT_DICTIONARY } from '../src/data/accountDictionary'

const tests = [
  'سددنا 20,000 للمورد نقدًا',
  'اشترينا بضاعة نقدًا بمبلغ 30,000',
  'اشترينا بضاعة من المورد بالأجل بمبلغ 50,000',
  'بعنا بضاعة نقدًا بمبلغ 15,000',
  'بعنا بضاعة للعميل بالأجل بمبلغ 25,000',
  'قبضنا 10,000 من العميل',
  'دفعنا إيجار 5,000 نقدًا',
  'أخذت الشركة قرضًا من البنك 100,000',
  'سددنا جزءًا من القرض 20,000',
  'أودع صاحب المنشأة 200,000 كرأس مال',
  'دفعنا إيجار 12,000 عن سنة قادمة',
  'استلمنا مقدم 10,000 من العميل',
  'استلمنا 10,000 من العميل عن مديونية سابقة',
  'دفعنا مرتبات 45,000',
  'اشترينا سيارة للاستخدام في الشركة بمبلغ 350,000',
  'سحب صاحب المنشأة 15,000 لاستخدام شخصي',
  'دفعنا فاتورة الكهرباء 3,500',
  'اشترينا أرض 500,000 نقدًا',
  'استلمنا تأمين 8,000 من الغير',
  'دفعنا تأمين 6,000 لجهة تأمينية',
  'بعنا بضاعة نقدًا 90,000',
]

let pass = 0
for (const t of tests) {
  const r = solveTransaction(t)
  if (r) {
    const debit = r.entry.filter((l) => l.side === 'debit').map((l) => l.accountNameAr)
    const credit = r.entry.filter((l) => l.side === 'credit').map((l) => l.accountNameAr)
    console.log(`✓ ${t}\n  مدين: [${debit.join(', ')}] دائن: [${credit.join(', ')}]`)
    pass++
  } else {
    console.log(`✗ ${t}`)
  }
}
console.log(`\n== Solver: ${pass}/${tests.length} transactions solved ==`)

console.log(`\n== Data checks ==`)
console.log(`Exercises: ${EXERCISES.length}`)
console.log(`Quiz questions: ${QUIZ_QUESTIONS.length}`)
console.log(`Flashcards: ${FLASHCARDS.length}`)
console.log(`Lessons: ${LESSONS.length}`)
console.log(`Stages: ${STAGES.length}`)
console.log(`Dictionary keywords: ${ACCOUNT_DICTIONARY.length}`)

// check exercise IDs unique
const ids = EXERCISES.map((e) => e.id)
const dupes = ids.filter((id, i) => ids.indexOf(id) !== i)
console.log(`Exercise duplicate IDs: ${dupes.length}`)
console.log(`Quiz duplicate IDs: ${QUIZ_QUESTIONS.length - new Set(QUIZ_QUESTIONS.map((q) => q.id)).size}`)
console.log(`Flashcard duplicate IDs: ${FLASHCARDS.length - new Set(FLASHCARDS.map((f) => f.id)).size}`)
console.log(`Lesson duplicate IDs: ${LESSONS.length - new Set(LESSONS.map((l) => l.id)).size}`)

// validity: each lesson's stageId corresponds to STAGES, stage.lessons references existing lessons
const stageIds = new Set(STAGES.map((s) => s.id))
const badStageRefs = LESSONS.filter((l) => !stageIds.has(l.stageId))
console.log(`Lessons referencing missing stages: ${badStageRefs.length}`)
const lessonIds = new Set(LESSONS.map((l) => l.id))
const missingLessonRefs = STAGES.flatMap((s) => s.lessons.filter((l) => !lessonIds.has(l)))
console.log(`Stages referencing missing lessons: ${missingLessonRefs.length}`)