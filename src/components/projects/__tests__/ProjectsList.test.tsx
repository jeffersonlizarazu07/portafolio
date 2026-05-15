/**
 * Tests de ProjectsList — presentacional, recibe props.
 *
 * Conceptos NUEVOS:
 *
 * 1. Componente presentacional puro — recibe todo por props.
 *    No importa hooks, no llama APIs. Fácil de testear.
 *
 * 2. Loading state → esqueletos (Skeleton de MUI).
 *    No tienen role específico, así que contamos cuántos hay.
 *
 * 3. Error state → mensaje de error centrado.
 *
 * 4. Normal state → tarjetas con imagen, título, descripción, chips.
 *
 * 5. handleImageError → si la imagen no carga, reemplaza src con fallback.
 *    Probamos disparando el evento onError nativo.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithTheme } from '@/test/test-utils'
import { ThemeProvider } from '@/context/ThemeContext'
import { ProjectsList } from '../ProjectsList'
import type { GitHubRepo } from '@/types/GitHub'

// ProjectsList usa useThemeMode, necesita ThemeProvider de la app
beforeEach(() => {
  localStorage.clear()
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
})

const renderProjectsList = (projects: GitHubRepo[], loading: boolean, error: string | null) =>
  renderWithTheme(
    <ThemeProvider>
      <ProjectsList projects={projects} loading={loading} error={error} />
    </ThemeProvider>
  )

const mockProjects: GitHubRepo[] = [
  {
    title: 'repo-uno',
    description: 'Primer proyecto',
    tech: ['React', 'TypeScript'],
    url: 'https://github.com/test/repo-uno',
    stars: 10,
    image: 'https://example.com/preview.png',
    language: 'TypeScript',
  },
  {
    title: 'repo-dos',
    description: 'Segundo proyecto',
    tech: ['JavaScript'],
    url: 'https://github.com/test/repo-dos',
    stars: 5,
    image: '',
    language: 'JavaScript',
  },
]

describe('ProjectsList', () => {
  // ── LOADING ───────────────────────────────────────────────────────

  it('muestra skeletons cuando está cargando', () => {
    renderProjectsList([], true, null)

    // MUI Skeleton no tiene role="img" con aria-busy.
    // Buscamos por clase CSS porque es la forma más confiable aquí.
    const skeletons = document.querySelectorAll('.MuiSkeleton-root')
    expect(skeletons.length).toBe(6)
  })

  it('no muestra mensaje de error cuando está cargando', () => {
    renderProjectsList([], true, 'Algo salió mal')

    expect(screen.queryByText(/algo salió mal/i)).not.toBeInTheDocument()
  })

  // ── ERROR ─────────────────────────────────────────────────────────

  it('muestra mensaje de error cuando hay error', () => {
    renderProjectsList([], false, 'Error de red')

    expect(screen.getByText(/error de red/i)).toBeInTheDocument()
  })

  it('no muestra skeletons cuando hay error', () => {
    renderProjectsList([], false, 'Error de red')

    const skeletons = document.querySelectorAll('.MuiSkeleton-root')
    expect(skeletons.length).toBe(0)
  })

  // ── NORMAL ────────────────────────────────────────────────────────

  it('renderiza tarjetas de proyectos', () => {
    renderProjectsList(mockProjects, false, null)

    expect(screen.getByText('repo-uno')).toBeInTheDocument()
    expect(screen.getByText('repo-dos')).toBeInTheDocument()
  })

  it('muestra las tecnologías como chips', () => {
    renderProjectsList(mockProjects, false, null)

    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('JavaScript')).toBeInTheDocument()
  })

  it('cada tarjeta enlaza al repo en nueva pestaña', () => {
    renderProjectsList(mockProjects, false, null)

    const links = screen.getAllByRole('link')
    expect(links[0]).toHaveAttribute('href', 'https://github.com/test/repo-uno')
    expect(links[0]).toHaveAttribute('target', '_blank')
    expect(links[0]).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('usa image del proyecto cuando existe', () => {
    renderProjectsList(mockProjects, false, null)

    const images = screen.getAllByRole('img')
    expect(images[0]).toHaveAttribute('src', 'https://example.com/preview.png')
  })

  it('usa fallback de logo del lenguaje cuando no hay image', () => {
    renderProjectsList(mockProjects, false, null)

    const images = screen.getAllByRole('img')
    // repo-dos no tiene image → usa getLanguageLogo('JavaScript', 'white') en dark mode
    expect(images[1]).toHaveAttribute('src', 'https://cdn.simpleicons.org/javascript/white')
  })

  // ── IMAGE ERROR ───────────────────────────────────────────────────

  it('reemplaza src con fallback cuando la imagen falla', () => {
    renderProjectsList([mockProjects[0]], false, null)

    const img = screen.getByRole('img')
    // Disparar onError manualmente
    fireEvent.error(img)

    // Debería cambiar al fallback de lenguaje (TypeScript → simpleicons)
    expect(img).toHaveAttribute('src', 'https://cdn.simpleicons.org/typescript/white')
  })

  it('no entra en loop infinito si el fallback también falla', () => {
    renderProjectsList([mockProjects[0]], false, null)

    const img = screen.getByRole('img')

    // Disparar onError una vez (cambia a fallback)
    fireEvent.error(img)
    const firstSrc = img.getAttribute('src')

    // Disparar onError de nuevo — no debería cambiar porque ya es el fallback
    fireEvent.error(img)
    expect(img).toHaveAttribute('src', firstSrc)
  })

  // ── MODO LIGHT + LISTA LARGA ────────────────────────────────────────

  it('renderiza en modo light con 4 proyectos (cubre líneas 25, 87-88, 108-111, 136-139)', () => {
    // CUBRE:
    // L25:  const logoColor = mode === 'dark' ? 'white' : 'black'  → 'black'
    // L87:  loading={index < 3 ? 'eager' : 'lazy'}                 → 'lazy'
    // L88:  fetchPriority={index < 3 ? 'high' : 'auto'}            → 'auto'
    // L108-111: sx ternario mode === 'dark' → light branch
    // L136-139: sx ternario mode === 'dark' → light branch
    //
    // Forzamos modo light escribiendo en localStorage ANTES del render.
    // beforeEach() limpia localStorage, así que esto NO afecta otros tests.
    localStorage.setItem('portfolio-theme-mode', 'light')

    const longMockProjects: GitHubRepo[] = [
      ...mockProjects,
      {
        title: 'repo-tres',
        description: 'Tercer proyecto',
        tech: ['Python'],
        url: 'https://github.com/test/repo-tres',
        stars: 3,
        image: 'https://example.com/preview3.png',
        language: 'Python',
      },
      {
        title: 'repo-cuatro',
        description: 'Cuarto proyecto',
        tech: ['Go'],
        url: 'https://github.com/test/repo-cuatro',
        stars: 1,
        image: '',
        language: 'Go',
      },
    ]

    renderProjectsList(longMockProjects, false, null)

    // Verificar que los 4 proyectos se renderizan
    expect(screen.getByText('repo-uno')).toBeInTheDocument()
    expect(screen.getByText('repo-dos')).toBeInTheDocument()
    expect(screen.getByText('repo-tres')).toBeInTheDocument()
    expect(screen.getByText('repo-cuatro')).toBeInTheDocument()

    const images = screen.getAllByRole('img')

    // index < 3 (0, 1, 2) → eager + high
    expect(images[0]).toHaveAttribute('loading', 'eager')
    expect(images[2]).toHaveAttribute('loading', 'eager')
    // index >= 3 (3) → lazy + auto
    expect(images[3]).toHaveAttribute('loading', 'lazy')
    expect(images[3]).toHaveAttribute('fetchpriority', 'auto')

    // En light mode, logoColor = 'black'
    // repo-dos (index=1, image='') → fallback con 'black'
    expect(images[1]).toHaveAttribute('src', 'https://cdn.simpleicons.org/javascript/black')

    // repo-cuatro (index=3, image='') → fallback con 'black'
    expect(images[3]).toHaveAttribute('src', 'https://cdn.simpleicons.org/go/black')
  })
})
