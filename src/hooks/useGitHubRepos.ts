/**
 * Hook para obtener y filtrar repositorios de GitHub del usuario.
 *
 * Los proyectos del portafolio se muestran directamente desde GitHub,
 * evitando mantener manualmente una lista de proyectos.
 * Si el usuario actualiza su GitHub, el portafolio se actualiza automáticamente.
 *
 * Usa la API pública de GitHub (sin autenticación) para repositorios públicos.
 * El rate limit es manejable para portfolios con máximo 100 repos.
 *
 * Busca preview.png dinámicamente en cada repo porque los proyectos pueden
 * tener su captura en cualquier ubicación (src/assets/preview.png, docs/preview.png, etc.),
 * permitiendo que cualquier repo tenga un preview sin convenciones obligatorias.
 *
 * OPTIMIZACIÓN DE PERFORMANCE (v2):
 * - Caché en localStorage con stale-while-revalidate:
 *   - 1ra visita: fetch normal + guarda en caché
 *   - 2da visita (caché fresco): render INSTANTÁNEO, 0 llamadas API
 *   - 3ra visita (caché vencido): render instantáneo + refresh silencioso en background
 * - Búsqueda de preview.png con Git Trees API (recursive=1):
 *   - Busca preview.png en CUALQUIER ruta del repositorio
 *   - No asume ubicación fija (ni raíz, ni assets/, ni src/assets/)
 *   - No usa HEAD request: raw.githubusercontent.com no envía
 *     Access-Control-Allow-Origin en respuestas HEAD (solo GET)
 */
import { useState, useEffect } from 'react'
import type { GitHubRepo, UseGitHubReposReturn } from '@/types/GitHub'
import { getCachedData, setCachedData } from '@/utils/githubCache'

// ── Tipos internos (solo para el hook) ──────────────────────────────────────────────

// Respuesta real de GitHub API - no duplicamos campos que no usamos
interface GitHubAPIResponse {
  name: string
  description: string | null
  visibility: string
  fork: boolean
  language: string | null
  html_url: string
  stargazers_count: number
  languages_url: string
}

// Árbol de archivos del repo - necesario para buscar preview.png en todo el árbol
interface GitHubTreeItem {
  path: string
  mode: string
  type: string
  sha: string
  size?: number
  url: string
}

interface GitHubTree {
  sha: string
  url: string
  tree: GitHubTreeItem[]
  truncated: boolean
}

// ── Constantes ───────────────────────────────────────────────────────

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com'
const GITHUB_API_BASE = 'https://api.github.com'

/**
 * Busca preview.png en el repositorio usando Git Trees API.
 *
 * Usa GET /repos/{user}/{repo}/git/trees/{branch}?recursive=1 para buscar
 * preview.png en CUALQUIER ruta del repositorio, sin asumir una ubicación fija.
 *
 * ¿Por qué no HEAD request a raw.githubusercontent.com?
 * Intentamos esa optimización, pero raw.githubusercontent.com NO envía
 * el header Access-Control-Allow-Origin en respuestas HEAD (solo en GET).
 * El navegador bloquea la respuesta por CORS y el HEAD siempre falla.
 * Probado empíricamente — ver curl output en los comentarios del PR.
 *
 * La optimización REAL está en el caché en localStorage (githubCache.ts),
 * que elimina todas las llamadas API en visitas subsecuentes.
 *
 * @returns La URL completa de la imagen si existe, null si no.
 */
const findPreviewImage = async (
  username: string,
  repoName: string,
  branch: string,
  options: RequestInit
): Promise<string | null> => {
  try {
    const treeUrl = `${GITHUB_API_BASE}/repos/${username}/${repoName}/git/trees/${branch}?recursive=1`
    const treeResponse = await fetch(treeUrl, options)

    if (!treeResponse.ok) return null

    const treeData = (await treeResponse.json()) as GitHubTree

    // Busca cualquier archivo que termine en preview.png en TODO el árbol
    const previewFile = treeData.tree.find(
      item => item.type === 'blob' && item.path.endsWith('preview.png')
    )

    if (!previewFile?.path) return null

    return `${GITHUB_RAW_BASE}/${username}/${repoName}/${branch}/${previewFile.path}`
  } catch {
    return null
  }
}

// ── Hook ───────────────────────────────────────────────────────

/**
 * Obtiene repositorios de GitHub con sus lenguajes e imágenes.
 *
 * @param username - Usuario de GitHub cuyos repositorios obtener
 * @returns Estado y datos de repositorios para filtrar y mostrar
 *
 * Retorna filteredRepos porque el filtrado es parte de la lógica de datos,
 * no de presentación. Mantiene el componente dumb y reusable.
 * Las tecnologías son un array porque necesitamos listar todos los lenguajes
 * únicos para generar los filtros, y se calcula una vez memoizado en el estado.
 */
export const useGitHubRepos = (username: string): UseGitHubReposReturn => {
  // ── INICIALIZACIÓN SÍNCRONA DESDE CACHÉ ──
  // Leemos localStorage DURANTE el render (no en un efecto).
  // Esto permite que el PRIMER render ya tenga datos, evitando el flash de skeletons.
  // Es seguro porque localStorage es síncrono y no bloquea el render.
  const cached = getCachedData()

  const [repos, setRepos] = useState<GitHubRepo[]>(cached?.repos ?? [])
  const [loading, setLoading] = useState<boolean>(!cached) // false si hay caché
  const [error, setError] = useState<string | null>(null)
  const [technologies, setTechnologies] = useState<string[]>(cached?.technologies ?? [])
  const [filter, setFilter] = useState<string>('Todos')

  // El filtrado se hace en memoria porque no hay muchos repos
  // Evitamos una llamada adicional a la API solo para filtrar
  const filteredRepos: GitHubRepo[] =
    filter === 'Todos' ? repos : repos.filter(repo => repo.tech.includes(filter))

  useEffect(() => {
    // Si el caché está fresco, NO hacemos ninguna llamada API
    if (cached && !cached.isStale) return

    let ignore = false

    const fetchRepos = async (): Promise<void> => {
      try {
        const options: RequestInit = {}

        // 100 repos es suficiente para un portafolio
        // ordenar por updated muestra los más recientes primero
        const response = await fetch(
          `${GITHUB_API_BASE}/users/${username}/repos?sort=updated&per_page=100`
        )

        if (!response.ok) {
          throw new Error('Error al obtener repositorios')
        }

        const data = (await response.json()) as GitHubAPIResponse[]

        // Solo repos públicos y no forkados - son los relevantes para el portafolio
        // Los forks muestran trabajo de otros, los privados no son accesibles
        const publicRepos = data.filter(
          (repo): boolean => repo.visibility === 'public' && !repo.fork
        )

        // Promise.all para paralelizar - cada repo tiene su propia llamada a languages_url
        // Esto es mucho más rápido que sequentially await
        const reposWithAllLanguages = await Promise.all(
          publicRepos.map(async (repo: GitHubAPIResponse): Promise<GitHubRepo> => {
            try {
              // languages_url retorna {JavaScript: 1234, TypeScript: 5678}
              // Object.keys() extrae solo los nombres de los lenguajes
              const langResponse = await fetch(repo.languages_url, options)
              const langData = (await langResponse.json()) as Record<string, number>
              const tech: string[] = Object.keys(langData)

              // Buscar preview.png en cualquier ruta del repo usando Git Trees API
              // main es el nuevo default en GitHub, pero algunos repos antiguos usan master
              let image: string | null = null

              for (const branch of ['main', 'master']) {
                image = await findPreviewImage(username, repo.name, branch, options)
                if (image) break
              }

              return {
                title: repo.name,
                description: repo.description || 'Sin descripción disponible',
                tech,
                url: repo.html_url,
                stars: repo.stargazers_count,
                image: image ?? '',
                language: repo.language || tech[0] || null,
              }
            } catch {
              // Fallback graceful: si falla languages, mostramos lo que tenemos de GitHub API
              // No fallamos todo el hook por un repo individual
              return {
                title: repo.name,
                description: repo.description || 'Sin descripción disponible',
                tech: repo.language ? [repo.language] : [],
                url: repo.html_url,
                stars: repo.stargazers_count,
                image: '',
                language: repo.language || null,
              }
            }
          })
        )

        if (ignore) return

        setRepos(reposWithAllLanguages)

        // Extraer lenguajes únicos y ordenar alfabéticamente
        // Sorted para UX consistente en los filtros
        const allTechs = reposWithAllLanguages.flatMap(repo => repo.tech)
        const uniqueTechs = [...new Set(allTechs)].sort()
        setTechnologies(uniqueTechs)

        // Guardar en caché para la próxima visita
        setCachedData(reposWithAllLanguages, uniqueTechs)
        setError(null)
      } catch (err) {
        if (ignore) return

        // Solo mostramos error si NO hay datos en caché visible.
        // Si el usuario ya está viendo datos cacheados, el error del
        // background refresh se traga silenciosamente.
        if (!cached) {
          setError(err instanceof Error ? err.message : 'Error desconocido')
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }

    fetchRepos()

    return () => {
      ignore = true
    }
    // cached no va en dependencias porque es un objeto que cambiaría en cada render.
    // Solo nos interesa si HABÍA caché al montar el hook.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [username])

  return {
    repos,
    filteredRepos,
    loading,
    error,
    technologies,
    filter,
    setFilter,
  }
}
