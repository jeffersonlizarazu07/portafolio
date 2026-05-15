/**
 * Tests de ProjectsContainer (capa de integración con hook mockeado)
 *
 * Este es nuestro test más COMPLETO porque prueba:
 * - Hook mockeado a nivel de módulo
 * - 3 estados distintos: loading, error, data
 * - Interacción del usuario con filtros
 * - Integración con ThemeContext (via ProjectsList)
 * - Integración con Router (via FreelanceSection)
 *
 * Concepto NUEVO:
 * `vi.mock()` a nivel de HOOK — reemplazamos `useGitHubRepos` COMPLETAMENTE
 * y en cada test decidimos qué valor devuelve con `mockReturnValue`.
 * Así probamos el CONTAINER en aislamiento sin tocar la API real ni el caché.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithRouter } from '@/test/test-utils'

// ── MOCKS ──────────────────────────────────────────────────────────────

// Mockear el hook ANTES de importar el componente
vi.mock('@/hooks/useGitHubRepos')

// Mockear config para que las URLs no dependan de env vars
vi.mock('@/config', () => ({
  config: {
    github: { username: 'test-user' },
    email: { publicKey: '', serviceId: '', templateId: '' },
    spamProtection: { minSubmitTime: 0 },
    social: { github: '', linkedin: '', email: '' },
    cv: { url: '/cv/test.pdf' },
    portfolio: { title: '', description: '' },
  },
}))

// Importamos desPUÉS de los mocks (vi.mock se hoistea automáticamente)
import { ProjectsContainer } from '../ProjectsContainer'
import { useGitHubRepos } from '@/hooks/useGitHubRepos'
import { ThemeProvider } from '@/context/ThemeContext'

// ── MOCK DATA ──────────────────────────────────────────────────────────

const mockRepos = [
  {
    title: 'mi-portafolio',
    description: 'Mi portafolio personal',
    tech: ['TypeScript', 'React'],
    url: 'https://github.com/test/mi-portafolio',
    stars: 5,
    image: '',
    language: 'TypeScript',
  },
  {
    title: 'backend-api',
    description: 'API REST en Node.js',
    tech: ['Node.js', 'Express'],
    url: 'https://github.com/test/backend-api',
    stars: 3,
    image: 'https://example.com/preview.png',
    language: 'JavaScript',
  },
]

// ── SETUP ──────────────────────────────────────────────────────────────

beforeEach(() => {
  vi.clearAllMocks()
  localStorage.clear()

  // Mock de matchMedia para que ThemeProvider funcione
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
})

/** Helper: configura el mock del hook con valores específicos */
const mockUseGitHubRepos = (overrides: Partial<ReturnType<typeof useGitHubRepos>> = {}) => {
  const defaults = {
    filteredRepos: [],
    repos: [],
    loading: false,
    error: null,
    technologies: [],
    filter: 'Todos',
    setFilter: vi.fn(),
  }

  vi.mocked(useGitHubRepos).mockReturnValue({
    ...defaults,
    ...overrides,
  } as ReturnType<typeof useGitHubRepos>)
}

// ── TESTS ──────────────────────────────────────────────────────────────

describe('ProjectsContainer', () => {
  // ── LOADING ───────────────────────────────────────────────────────────

  it('muestra skeletons mientras carga', () => {
    mockUseGitHubRepos({ loading: true })

    const { container } = renderWithRouter(
      <ThemeProvider>
        <ProjectsContainer />
      </ThemeProvider>
    )

    // MUI Skeleton renderiza como <span> con clase MuiSkeleton-root
    const skeletons = container.querySelectorAll('.MuiSkeleton-root')
    expect(skeletons).toHaveLength(6)
  })

  // ── ERROR ─────────────────────────────────────────────────────────────

  it('muestra mensaje de error cuando el fetch falla', () => {
    mockUseGitHubRepos({ loading: false, error: 'Error al cargar los proyectos' })

    renderWithRouter(
      <ThemeProvider>
        <ProjectsContainer />
      </ThemeProvider>
    )

    expect(screen.getByText(/error al cargar los proyectos/i)).toBeInTheDocument()
  })

  // ── DATA ──────────────────────────────────────────────────────────────

  it('muestra las tarjetas de proyectos cuando hay datos', () => {
    mockUseGitHubRepos({
      filteredRepos: mockRepos,
      technologies: ['TypeScript', 'React', 'Node.js', 'Express'],
    })

    renderWithRouter(
      <ThemeProvider>
        <ProjectsContainer />
      </ThemeProvider>
    )

    expect(screen.getByText('mi-portafolio')).toBeInTheDocument()
    expect(screen.getByText('backend-api')).toBeInTheDocument()
  })

  it('muestra la descripción de cada proyecto', () => {
    mockUseGitHubRepos({ filteredRepos: mockRepos })

    renderWithRouter(
      <ThemeProvider>
        <ProjectsContainer />
      </ThemeProvider>
    )

    expect(screen.getByText('Mi portafolio personal')).toBeInTheDocument()
    expect(screen.getByText(/api rest en node\.js/i)).toBeInTheDocument()
  })

  // ── FILTROS ───────────────────────────────────────────────────────────

  it('renderiza el botón "Todos" y los filtros de tecnología', () => {
    mockUseGitHubRepos({
      filteredRepos: mockRepos,
      technologies: ['TypeScript', 'React', 'Node.js'],
    })

    renderWithRouter(
      <ThemeProvider>
        <ProjectsContainer />
      </ThemeProvider>
    )

    expect(screen.getByRole('button', { name: /todos/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /typescript/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /react/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /node\.js/i })).toBeInTheDocument()
  })

  it('llama a setFilter cuando se hace clic en un filtro', async () => {
    const setFilterMock = vi.fn()
    mockUseGitHubRepos({
      filteredRepos: mockRepos,
      technologies: ['TypeScript', 'React'],
      setFilter: setFilterMock,
    })

    const user = userEvent.setup()
    renderWithRouter(
      <ThemeProvider>
        <ProjectsContainer />
      </ThemeProvider>
    )

    await user.click(screen.getByRole('button', { name: /react/i }))

    expect(setFilterMock).toHaveBeenCalledWith('React')
  })

  it('llama a setFilter con "Todos" al hacer clic en el botón Todos', async () => {
    // CUBRE: HeaderSection línea 29 — onClick={() => setFilter('Todos')}
    // Hasta ahora solo se testeaba el click en filtros de tecnología.
    const setFilterMock = vi.fn()
    mockUseGitHubRepos({
      filteredRepos: mockRepos,
      technologies: ['TypeScript', 'React'],
      setFilter: setFilterMock,
    })

    const user = userEvent.setup()
    renderWithRouter(
      <ThemeProvider>
        <ProjectsContainer />
      </ThemeProvider>
    )

    await user.click(screen.getByRole('button', { name: /todos/i }))

    expect(setFilterMock).toHaveBeenCalledWith('Todos')
  })

  it('muestra el botón "Todos" como outlined cuando hay un filtro activo', () => {
    // CUBRE: rama "false" de `filter === 'Todos' ? 'contained' : 'outlined'`
    // en HeaderSection línea 28. Los tests existentes solo usaban filter='Todos'.
    mockUseGitHubRepos({
      filteredRepos: mockRepos,
      technologies: ['TypeScript', 'React'],
      filter: 'React', // filtro activo → "Todos" debería ser outlined
    })

    renderWithRouter(
      <ThemeProvider>
        <ProjectsContainer />
      </ThemeProvider>
    )

    const todosBtn = screen.getByRole('button', { name: /todos/i })

    // En MUI, variant="outlined" agrega la clase MuiButton-outlined
    expect(todosBtn.className).toContain('MuiButton-outlined')
  })

  // ── FRONT MATTER ──────────────────────────────────────────────────────

  it('muestra el título "Mis proyectos"', () => {
    mockUseGitHubRepos()

    renderWithRouter(
      <ThemeProvider>
        <ProjectsContainer />
      </ThemeProvider>
    )

    // El texto está dividido en "Mis " y "proyectos" (con color primary).
    // getByRole('heading', { name }) usa el accessible name COMPLETO.
    expect(screen.getByRole('heading', { name: /mis proyectos/i })).toBeInTheDocument()
  })
})
