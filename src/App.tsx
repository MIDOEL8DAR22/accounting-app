import { lazy, Suspense } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from './context/theme'
import { Layout } from './components/Layout'

const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })))
const StartLearning = lazy(() => import('./pages/StartLearning').then(m => ({ default: m.StartLearning })))
const Stages = lazy(() => import('./pages/Stages').then(m => ({ default: m.Stages })))
const LessonPage = lazy(() => import('./pages/LessonPage').then(m => ({ default: m.LessonPage })))
const AccountTypes = lazy(() => import('./pages/AccountTypes').then(m => ({ default: m.AccountTypes })))
const Dictionary = lazy(() => import('./pages/Dictionary').then(m => ({ default: m.Dictionary })))
const Exercises = lazy(() => import('./pages/Exercises').then(m => ({ default: m.Exercises })))
const Quiz = lazy(() => import('./pages/Quiz').then(m => ({ default: m.Quiz })))
const Solver = lazy(() => import('./pages/Solver').then(m => ({ default: m.Solver })))
const Flashcards = lazy(() => import('./pages/Flashcards').then(m => ({ default: m.Flashcards })))
const Progress = lazy(() => import('./pages/Progress').then(m => ({ default: m.Progress })))
const Reference = lazy(() => import('./pages/Reference').then(m => ({ default: m.Reference })))
const Settings = lazy(() => import('./pages/Settings').then(m => ({ default: m.Settings })))
const Builder = lazy(() => import('./pages/Builder').then(m => ({ default: m.Builder })))
const Summary = lazy(() => import('./pages/Summary').then(m => ({ default: m.SummaryPage })))
const Practical = lazy(() => import('./pages/Practical').then(m => ({ default: m.Practical })))
const Accountant = lazy(() => import('./pages/Accountant').then(m => ({ default: m.Accountant })))
const EnglishPractice = lazy(() => import('./pages/EnglishPractice').then(m => ({ default: m.EnglishPractice })))

function Loader() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="text-center space-y-3">
        <div className="inline-block w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500 dark:text-slate-400">جاري التحميل...</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/learn" element={<StartLearning />} />
              <Route path="/stages/:stageId" element={<Stages />} />
              <Route path="/lesson/:lessonId" element={<LessonPage />} />
              <Route path="/account-types" element={<AccountTypes />} />
              <Route path="/dictionary" element={<Dictionary />} />
              <Route path="/exercises" element={<Exercises />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/solver" element={<Solver />} />
              <Route path="/flashcards" element={<Flashcards />} />
              <Route path="/progress" element={<Progress />} />
              <Route path="/reference" element={<Reference />} />
              <Route path="/summary" element={<Summary />} />
              <Route path="/practical" element={<Practical />} />
              <Route path="/accountant" element={<Accountant />} />
              <Route path="/english" element={<EnglishPractice />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/builder" element={<Builder />} />
              <Route path="*" element={<Dashboard />} />
            </Route>
          </Routes>
        </Suspense>
      </HashRouter>
    </ThemeProvider>
  )
}