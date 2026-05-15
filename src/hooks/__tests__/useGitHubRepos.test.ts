/**
 * Tests de useGitHubRepos — hook principal de obtención de datos.
 *
 * Conceptos NUEVOS:
 *
 * 1. `renderHook(() => useHook())` — renderiza un hook sin necesidad de un componente.
 *    Retorna { result } donde result.current tiene el valor actual del hook.
 *
 * 2. Mockear `fetch` global — interceptamos TODAS las llamadas a fetch() y
 *    devolvemos respuestas falsas. Así no golpeamos la API de GitHub real.
 *
 * 3. Mockear módulos — como el hook usa githubCache, mockeamos getCachedData
 *    para controlar si "hay caché" o no.
 *
 * 4. `waitFor(() => expect(...))` — espera a que el hook termine su efecto
 *    asíncrono (fetch) antes de hacer assertions.
 *
 * 5. ¿Por qué waitFor y NO act()?
 *    - act() es genérica para cualquier cambio de estado.
 *    - waitFor es específica para testing-library y más legible.
 *    - Internamente waitFor usa act() + retry hasta que pase o timeout.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { useGitHubRepos } from '../useGitHubRepos'
import type { GitHubRepo } from '@/types/GitHub'

// ── MOCKS ──────────────────────────────────────────────────────────────

// vi.hoisted() asegura que estas variables existan ANTES de que vi.mock()
// se ejecute (Vitest hoistea vi.mock al tope del archivo automáticamente)
const { mockGetCachedData, mockSetCachedData } = vi.hoisted(() => ({
  mockGetCachedData: vi.fn(),
  mockSetCachedData: vi.fn(),
}))

vi.mock('@/utils/githubCache', () => ({
  getCachedData: mockGetCachedData,
  setCachedData: mockSetCachedData,
}))

// ── MOCK DATA ──────────────────────────────────────────────────────────

const MOCK_USER = 'testuser'

// Respuesta de la API de repos de GitHub
const MOCK_API_REPOS = [
  {
    name: 'repo-uno',
    description: 'Primer repositorio de prueba',
    visibility: 'public',
    fork: false,
    language: 'TypeScript',
    html_url: 'https://github.com/testuser/repo-uno',
    stargazers_count: 10,
    languages_url: 'https://api.github.com/repos/testuser/repo-uno/languages',
  },
  {
    name: 'repo-dos',
    description: 'Segundo repositorio de prueba',
    visibility: 'public',
    fork: false,
    language: 'JavaScript',
    html_url: 'https://github.com/testuser/repo-dos',
    stargazers_count: 5,
    languages_url: 'https://api.github.com/repos/testuser/repo-dos/languages',
  },
  // Repo forkeado — debe ser filtrado
  {
    name: 'repo-fork',
    description: 'Un fork',
    visibility: 'public',
    fork: true,
    language: 'Python',
    html_url: 'https://github.com/testuser/repo-fork',
    stargazers_count: 0,
    languages_url: '',
  },
]

// Respuesta de languages_url para cada repo
const MOCK_LANGUAGES_REPO1 = { TypeScript: 5000, JavaScript: 2000 }
const MOCK_LANGUAGES_REPO2 = { JavaScript: 8000, HTML: 3000 }

// Árboles de Git (para búsqueda de preview.png)
const MOCK_TREE_NO_PREVIEW = {
  sha: 'abc',
  url: '',
  tree: [
    { path: 'src/index.ts', mode: '100644', type: 'blob', sha: 'aaa', url: '' },
    { path: 'README.md', mode: '100644', type: 'blob', sha: 'bbb', url: '' },
  ],
  truncated: false,
}

const MOCK_TREE_WITH_PREVIEW = {
  sha: 'def',
  url: '',
  tree: [
    { path: 'src/index.ts', mode: '100644', type: 'blob', sha: 'aaa', url: '' },
    { path: 'assets/preview.png', mode: '100644', type: 'blob', sha: 'bbb', url: '' },
    { path: 'README.md', mode: '100644', type: 'blob', sha: 'ccc', url: '' },
  ],
  truncated: false,
}

// Datos de repos ya procesados (como los devolvería el hook)
const MOCK_PROCESSED_REPOS: GitHubRepo[] = [
  {
    title: 'repo-uno',
    description: 'Primer repositorio de prueba',
    tech: ['TypeScript', 'JavaScript'],
    url: 'https://github.com/testuser/repo-uno',
    stars: 10,
    image: 'https://raw.githubusercontent.com/testuser/repo-uno/main/assets/preview.png',
    language: 'TypeScript',
  },
  {
    title: 'repo-dos',
    description: 'Segundo repositorio de prueba',
    tech: ['JavaScript', 'HTML'],
    url: 'https://github.com/testuser/repo-dos',
    stars: 5,
    image: '',
    language: 'JavaScript',
  },
]

// ── HELPERS ─────────────────────────────────────────────────────────────

/**
 * Configura el mock de fetch para responder a las URLs de la API de GitHub.
 *
 * El hook hace varias llamadas en cadena:
 * 1. GET /users/{user}/repos → lista de repos
 * 2. Por cada repo: languages_url → { lenguaje: bytes }
 * 3. Por cada repo: git/trees/{branch}?recursive=1 → árbol con/sin preview.png
 */
const setupFetchMock = ({
  repos = MOCK_API_REPOS,
  languages = { 'repo-uno': MOCK_LANGUAGES_REPO1, 'repo-dos': MOCK_LANGUAGES_REPO2 },
  previewIn = 'repo-uno', // qué repo tiene preview.png
  failRepos = false,
  failLanguages = false,
  failTrees = false,
}: {
  repos?: typeof MOCK_API_REPOS
  languages?: Record<string, Record<string, number>>
  previewIn?: string | null
  failRepos?: boolean
  failLanguages?: boolean
  failTrees?: boolean
} = {}) => {
  const fetchMock = vi.fn<(url: string) => Promise<Response>>()

  fetchMock.mockImplementation(async (url: string) => {
    // ── 1. Lista de repos del usuario ──
    if (url.includes('/repos?sort=updated')) {
      if (failRepos) {
        return { ok: false, status: 500, json: async () => ({}) } as Response
      }
      return {
        ok: true,
        status: 200,
        json: async () => repos,
      } as Response
    }

    // ── 2. Languages de un repo específico ──
    if (url.includes('/languages')) {
      if (failLanguages) {
        // Lanzar error para que el catch del hook maneje el fallback
        throw new Error('Network error')
      }
      // Extraer el nombre del repo de la URL
      const repoName = url.split('/').at(-2) ?? ''
      return {
        ok: true,
        status: 200,
        json: async () => languages[repoName] ?? {},
      } as Response
    }

    // ── 3. Git Trees API (búsqueda de preview.png) ──
    if (url.includes('/git/trees/')) {
      if (failTrees) {
        // Lanzar error para cubrir el catch block de findPreviewImage
        throw new Error('Error en Git Trees API')
      }
      const repoName = url.split('/').at(-4) ?? ''
      const hasPreview = previewIn === repoName
      return {
        ok: true,
        status: 200,
        json: async () => (hasPreview ? MOCK_TREE_WITH_PREVIEW : MOCK_TREE_NO_PREVIEW),
      } as Response
    }

    // Fallback
    return { ok: false, status: 404, json: async () => ({}) } as Response
  })

  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

// ── TESTS ──────────────────────────────────────────────────────────────

describe('useGitHubRepos', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  // ── ESTADO INICIAL ──────────────────────────────────────────────────

  describe('estado inicial', () => {
    it('inicia con loading=true cuando NO hay caché', () => {
      mockGetCachedData.mockReturnValue(null)

      const { result } = renderHook(() => useGitHubRepos(MOCK_USER))

      expect(result.current.loading).toBe(true)
      expect(result.current.repos).toEqual([])
      expect(result.current.technologies).toEqual([])
      expect(result.current.error).toBeNull()
      expect(result.current.filter).toBe('Todos')
    })

    it('inicia con loading=false cuando hay caché fresco', () => {
      mockGetCachedData.mockReturnValue({
        repos: MOCK_PROCESSED_REPOS,
        technologies: ['JavaScript', 'TypeScript', 'HTML'],
        isStale: false,
      })

      const { result } = renderHook(() => useGitHubRepos(MOCK_USER))

      expect(result.current.loading).toBe(false)
      expect(result.current.repos).toEqual(MOCK_PROCESSED_REPOS)
      expect(result.current.technologies).toEqual(['JavaScript', 'TypeScript', 'HTML'])
    })

    it('inicia con loading=false cuando hay caché vencido (stale)', () => {
      mockGetCachedData.mockReturnValue({
        repos: MOCK_PROCESSED_REPOS,
        technologies: ['JavaScript', 'TypeScript'],
        isStale: true,
      })

      const { result } = renderHook(() => useGitHubRepos(MOCK_USER))

      // Muestra datos vencidos inmediatamente, sin loading
      expect(result.current.loading).toBe(false)
      expect(result.current.repos).toEqual(MOCK_PROCESSED_REPOS)
    })
  })

  // ── FETCH EXITOSO ──────────────────────────────────────────────────

  describe('fetch exitoso', () => {
    it('carga repositorios públicos no forkados', async () => {
      mockGetCachedData.mockReturnValue(null)
      setupFetchMock()

      const { result } = renderHook(() => useGitHubRepos(MOCK_USER))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // 3 repos en la API, 1 es fork → solo 2 deben aparecer
      expect(result.current.repos).toHaveLength(2)
      expect(result.current.repos[0].title).toBe('repo-uno')
      expect(result.current.repos[1].title).toBe('repo-dos')
    })

    it('extrae tecnologías únicas de todos los repos', async () => {
      mockGetCachedData.mockReturnValue(null)
      setupFetchMock()

      const { result } = renderHook(() => useGitHubRepos(MOCK_USER))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // repo-uno: TypeScript, JavaScript | repo-dos: JavaScript, HTML
      // Únicas ordenadas: HTML, JavaScript, TypeScript
      expect(result.current.technologies).toEqual(['HTML', 'JavaScript', 'TypeScript'])
    })

    it('asigna preview.png cuando existe en el repo', async () => {
      mockGetCachedData.mockReturnValue(null)
      setupFetchMock({ previewIn: 'repo-uno' })

      const { result } = renderHook(() => useGitHubRepos(MOCK_USER))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.repos[0].image).toBe(
        'https://raw.githubusercontent.com/testuser/repo-uno/main/assets/preview.png'
      )
      // repo-dos no tiene preview
      expect(result.current.repos[1].image).toBe('')
    })

    it('guarda datos en caché después del fetch', async () => {
      mockGetCachedData.mockReturnValue(null)
      setupFetchMock()

      const { result } = renderHook(() => useGitHubRepos(MOCK_USER))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(mockSetCachedData).toHaveBeenCalledTimes(1)
      expect(mockSetCachedData).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ title: 'repo-uno' })]),
        expect.arrayContaining(['HTML', 'JavaScript', 'TypeScript'])
      )
    })

    it('NO hace fetch cuando el caché está fresco', async () => {
      mockGetCachedData.mockReturnValue({
        repos: MOCK_PROCESSED_REPOS,
        technologies: ['JavaScript', 'TypeScript'],
        isStale: false,
      })
      const fetchMock = setupFetchMock()

      const { result } = renderHook(() => useGitHubRepos(MOCK_USER))

      // El hook no debería llamar a fetch en absoluto
      expect(fetchMock).not.toHaveBeenCalled()
      expect(result.current.loading).toBe(false)
    })
  })

  // ── ERRORES DE FETCH ──────────────────────────────────────────────

  describe('errores de fetch', () => {
    it('setea error cuando el fetch de repos falla y no hay caché', async () => {
      mockGetCachedData.mockReturnValue(null)
      setupFetchMock({ failRepos: true })

      const { result } = renderHook(() => useGitHubRepos(MOCK_USER))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.error).toBe('Error al obtener repositorios')
      expect(result.current.repos).toEqual([])
    })

    it('NO setea error cuando hay caché y el fetch falla (silencio)', async () => {
      mockGetCachedData.mockReturnValue({
        repos: MOCK_PROCESSED_REPOS,
        technologies: ['JavaScript', 'TypeScript'],
        isStale: true,
      })
      setupFetchMock({ failRepos: true })

      const { result } = renderHook(() => useGitHubRepos(MOCK_USER))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // Error silencioso: el usuario sigue viendo los datos cacheados
      expect(result.current.error).toBeNull()
      expect(result.current.repos).toEqual(MOCK_PROCESSED_REPOS)
    })

    it('no crashea si falla el fetch de languages de un repo individual', async () => {
      mockGetCachedData.mockReturnValue(null)
      setupFetchMock({ failLanguages: true })

      const { result } = renderHook(() => useGitHubRepos(MOCK_USER))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // Los repos se cargan con fallback: usan repo.language como tech
      expect(result.current.repos).toHaveLength(2)
      expect(result.current.repos[0].tech).toEqual(['TypeScript'])
    })

    it('no crashea si falla la búsqueda de preview tree', async () => {
      mockGetCachedData.mockReturnValue(null)
      setupFetchMock({ failTrees: true })

      const { result } = renderHook(() => useGitHubRepos(MOCK_USER))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // Los repos se cargan sin preview image
      expect(result.current.repos[0].image).toBe('')
      expect(result.current.repos[1].image).toBe('')
    })
  })

  // ── FILTRO ─────────────────────────────────────────────────────────

  describe('filtro', () => {
    it('filtra repos por tecnología', async () => {
      mockGetCachedData.mockReturnValue(null)
      setupFetchMock()

      const { result } = renderHook(() => useGitHubRepos(MOCK_USER))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // Sin filtro: todos los repos
      expect(result.current.filteredRepos).toHaveLength(2)

      // Filtrar por TypeScript (solo repo-uno)
      // waitFor asegura que el estado de React se actualice después de setFilter
      await waitFor(() => {
        result.current.setFilter('TypeScript')
        expect(result.current.filter).toBe('TypeScript')
      })

      expect(result.current.filteredRepos).toHaveLength(1)
      expect(result.current.filteredRepos[0].title).toBe('repo-uno')
    })

    it('retorna todos los repos con filtro "Todos"', async () => {
      mockGetCachedData.mockReturnValue(null)
      setupFetchMock()

      const { result } = renderHook(() => useGitHubRepos(MOCK_USER))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      // El filtro default es "Todos"
      await waitFor(() => {
        expect(result.current.filter).toBe('Todos')
      })
      expect(result.current.filteredRepos).toHaveLength(2)

      // Cambiar y volver
      await waitFor(() => {
        result.current.setFilter('HTML')
        expect(result.current.filter).toBe('HTML')
      })
      await waitFor(() => {
        result.current.setFilter('Todos')
        expect(result.current.filter).toBe('Todos')
      })

      expect(result.current.filteredRepos).toHaveLength(2)
    })

    it('retorna array vacío para tecnología sin repos', async () => {
      mockGetCachedData.mockReturnValue(null)
      setupFetchMock()

      const { result } = renderHook(() => useGitHubRepos(MOCK_USER))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      await waitFor(() => {
        result.current.setFilter('Python')
        expect(result.current.filter).toBe('Python')
      })

      expect(result.current.filteredRepos).toHaveLength(0)
    })
  })

  // ── CLEANUP ────────────────────────────────────────────────────────

  describe('cleanup', () => {
    it('no actualiza estado si el componente se desmonta antes del fetch', async () => {
      mockGetCachedData.mockReturnValue(null)
      const fetchMock = setupFetchMock()

      // Hacer que el fetch sea lento para tener tiempo de desmontar
      fetchMock.mockImplementation(
        () =>
          new Promise(resolve =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  status: 200,
                  json: async () => MOCK_API_REPOS,
                } as Response),
              5000
            )
          )
      )

      const { result, unmount } = renderHook(() => useGitHubRepos(MOCK_USER))

      // Desmontar antes de que el fetch termine
      unmount()

      // Esperar a que el timeout del fetch pase
      await new Promise(resolve => setTimeout(resolve, 5100))

      // El estado no debería haber cambiado después del unmount
      expect(result.current.repos).toEqual([])
      expect(result.current.loading).toBe(true)
    }, 15000)
  })
})
