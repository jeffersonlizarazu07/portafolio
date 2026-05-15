/**
 * Tests de ProjectsPage — página completa con ProjectsContainer.
 *
 * ProjectsContainer usa useGitHubRepos internamente.
 * Mockeamos el hook para controlar datos/loading/error.
 *
 * Concepto NUEVO:
 * - `vi.mock()` de un hook → cualquier componente que lo importe
 *   recibe la versión mockeada (incluso imports transitivos).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '@/test/test-utils'
import { ThemeProvider } from '@/context/ThemeContext'
import type { UseGitHubReposReturn } from '@/types/GitHub'

// vi.hoisted() para que mockUseGitHubRepos exista antes del vi.mock()
const { mockUseGitHubRepos } = vi.hoisted(() => ({
  mockUseGitHubRepos: vi.fn(),
}))

vi.mock('@/hooks/useGitHubRepos', () => ({
  useGitHubRepos: mockUseGitHubRepos,
}))

// Mockear config (ProjectsContainer usa config.github.username)
vi.mock('@/config', () => ({
  config: {
    github: { username: 'testuser' },
    social: { linkedin: '', github: '' },
    email: { publicKey: '', serviceId: '', templateId: '' },
    spamProtection: { minSubmitTime: 0 },
    cv: { url: '' },
    portfolio: { title: '', description: '' },
  },
}))

import { ProjectsPage } from '../ProjectsPage'

const defaultMockReturn: UseGitHubReposReturn = {
  repos: [],
  filteredRepos: [],
  loading: false,
  error: null,
  technologies: [],
  filter: 'Todos',
  setFilter: vi.fn(),
}

// ProjectsList usa useThemeMode, necesita ThemeProvider de la app
beforeEach(() => {
  vi.clearAllMocks()
  mockUseGitHubRepos.mockReturnValue(defaultMockReturn)
  localStorage.clear()
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
})

const renderProjectsPage = () =>
  renderWithRouter(
    <ThemeProvider>
      <ProjectsPage />
    </ThemeProvider>
  )

describe('ProjectsPage', () => {
  it('renderiza "Proyectos" cuando hay datos', () => {
    mockUseGitHubRepos.mockReturnValue({
      ...defaultMockReturn,
      technologies: ['TypeScript', 'JavaScript'],
    })

    renderProjectsPage()

    // HeaderSection muestra las tecnologías como filtros
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('JavaScript')).toBeInTheDocument()
  })

  it('muestra skeletons mientras carga', () => {
    mockUseGitHubRepos.mockReturnValue({
      ...defaultMockReturn,
      loading: true,
    })

    renderProjectsPage()

    const skeletons = document.querySelectorAll('.MuiSkeleton-root')
    expect(skeletons.length).toBe(6)
  })

  it('muestra mensaje de error cuando hay error', () => {
    mockUseGitHubRepos.mockReturnValue({
      ...defaultMockReturn,
      error: 'Error al cargar proyectos',
    })

    renderProjectsPage()

    expect(screen.getByText(/error al cargar proyectos/i)).toBeInTheDocument()
  })

  it('muestra contenido cuando hay proyectos', () => {
    mockUseGitHubRepos.mockReturnValue({
      ...defaultMockReturn,
      filteredRepos: [
        {
          title: 'mi-app',
          description: 'Una app genial',
          tech: ['React'],
          url: 'https://github.com/test/mi-app',
          stars: 10,
          image: '',
          language: 'React',
        },
      ],
    })

    renderProjectsPage()

    expect(screen.getByText('mi-app')).toBeInTheDocument()
  })
})
