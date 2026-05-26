/**
 * Tests de ProjectsList — componente que orquesta ProjectCard,
 * useImageFallback y useDeploymentNavigation.
 *
 * Verifica que:
 *   - Loading → skeletons
 *   - Error → mensaje
 *   - Normal → tarjetas con datos correctos
 *   - Click en cohete → abre GitHub
 *   - Click en tarjeta con deployment → abre URL
 *   - Click en tarjeta sin deployment → Snackbar
 *   - Fallback de imágenes funciona
 *   - Modo light + lista larga cubre branches
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithTheme } from '@/test/test-utils'
import { ThemeProvider } from '@/context/ThemeContext'
import { ProjectsList } from '../ProjectsList'
import type { GitHubRepo } from '@/types/GitHub'

// ── SETUP ──────────────────────────────────────────────────────────────

beforeEach(() => {
  localStorage.clear()
  vi.restoreAllMocks()
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
    deployment_url: 'https://midemo.com',
  },
  {
    title: 'repo-dos',
    description: 'Segundo proyecto',
    tech: ['JavaScript'],
    url: 'https://github.com/test/repo-dos',
    stars: 5,
    image: '',
    language: 'JavaScript',
    deployment_url: null,
  },
]

// ── TESTS ──────────────────────────────────────────────────────────────

describe('ProjectsList', () => {
  // ── LOADING ───────────────────────────────────────────────────────

  it('muestra skeletons cuando está cargando', () => {
    renderProjectsList([], true, null)

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

  // ── DEPLOYMENT NAVIGATION ──────────────────────────────────────────

  it('el icono de cohete abre el repositorio de GitHub en nueva pestaña', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    renderProjectsList([mockProjects[0]], false, null)

    const rocket = document.querySelector('.rocket-icon')
    expect(rocket).toBeInTheDocument()
    fireEvent.click(rocket!)

    expect(openSpy).toHaveBeenCalledWith(
      'https://github.com/test/repo-uno',
      '_blank',
      'noopener,noreferrer'
    )
  })

  it('el click en tarjeta CON deployment_url abre el deployment', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
    renderProjectsList([mockProjects[0]], false, null)

    // Click en el título que está dentro del CardActionArea
    fireEvent.click(screen.getByText('repo-uno'))

    expect(openSpy).toHaveBeenCalledWith('https://midemo.com', '_blank', 'noopener,noreferrer')
  })

  it('el click en tarjeta SIN deployment_url muestra snackbar', () => {
    renderProjectsList([mockProjects[1]], false, null)

    // Click en tarjeta sin deployment
    fireEvent.click(screen.getByText('repo-dos'))

    expect(screen.getByText('Demo no disponible actualmente!')).toBeInTheDocument()
  })

  // ── IMAGE ERROR ───────────────────────────────────────────────────

  it('reemplaza src con fallback cuando la imagen falla', () => {
    renderProjectsList([mockProjects[0]], false, null)

    const img = screen.getByRole('img')
    fireEvent.error(img)

    expect(img).toHaveAttribute('src', 'https://cdn.simpleicons.org/typescript/white')
  })

  it('no entra en loop infinito si el fallback también falla', () => {
    renderProjectsList([mockProjects[0]], false, null)

    const img = screen.getByRole('img')

    fireEvent.error(img)
    const firstSrc = img.getAttribute('src')

    fireEvent.error(img)
    expect(img).toHaveAttribute('src', firstSrc)
  })

  // ── MODO LIGHT + LISTA LARGA ────────────────────────────────────────

  it('renderiza en modo light con 4 proyectos', () => {
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
        deployment_url: null,
      },
      {
        title: 'repo-cuatro',
        description: 'Cuarto proyecto',
        tech: ['Go'],
        url: 'https://github.com/test/repo-cuatro',
        stars: 1,
        image: '',
        language: 'Go',
        deployment_url: null,
      },
    ]

    renderProjectsList(longMockProjects, false, null)

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
    expect(images[1]).toHaveAttribute('src', 'https://cdn.simpleicons.org/javascript/black')
    expect(images[3]).toHaveAttribute('src', 'https://cdn.simpleicons.org/go/black')
  })
})
