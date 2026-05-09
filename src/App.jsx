import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/layout/Layout'
import { ErrorBoundary } from './components/shared/ErrorBoundary'
import { PageLoader } from './components/shared/PageLoader'

// Lazy load de páginas - se cargan bajo demanda
// Nota: pages usan named exports, por eso el .then()
const HomePage = lazy(() => import('./pages/HomePage').then(m => ({ default: m.HomePage })))
const AboutPage = lazy(() => import('./pages/AboutPage').then(m => ({ default: m.AboutPage })))
const ContactPage = lazy(() =>
  import('./pages/ContactPage').then(m => ({ default: m.ContactPage }))
)
const ProjectsPage = lazy(() =>
  import('./pages/ProjectsPage').then(m => ({ default: m.ProjectsPage }))
)
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then(m => ({ default: m.NotFoundPage }))
)

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path='/' element={<HomePage />} />
            <Route path='/about' element={<AboutPage />} />
            <Route path='/projects' element={<ProjectsPage />} />
            <Route path='/contact' element={<ContactPage />} />
          </Route>
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}

export default App