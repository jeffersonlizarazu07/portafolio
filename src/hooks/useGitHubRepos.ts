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
 */
import { useState, useEffect } from 'react'
import type { GitHubRepo, UseGitHubReposReturn } from '@/types/GitHub'

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

// Árbol de archivos del repo - necesario para buscar preview.png sin saber su ubicación
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

// URLs hardcoded porque son APIs públicas de GitHub que no cambian
const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com'
const GITHUB_API_BASE = 'https://api.github.com'

/**
 * Busca la ruta de preview.png en el árbol del repositorio.
 * El árbol recursivo incluye TODOS los archivos, no solo los del root.
 * Busca cualquier archivo que termine en preview.png.
 */
const findPreviewImagePath = async (
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

    // Busca cualquier archivo que termine en preview.png
    const previewFile = treeData.tree.find(
      item => item.type === 'blob' && item.path.endsWith('preview.png')
    )

    return previewFile?.path ?? null
  } catch {
    return null
  }
}

/**
 * Construye la URL para acceder a la imagen raw.
 * Si no hay imagen, retorna null para que el componente muestre el fallback.
 */
const buildImageUrl = (
  username: string,
  repoName: string,
  branch: string,
  imagePath: string | null
): string | null => {
  if (!imagePath) return null
  return `${GITHUB_RAW_BASE}/${username}/${repoName}/${branch}/${imagePath}`
}

// ── Hook ───────────────────────────────────────────────────────

/**
 * Obtiene repositorios de GitHub con sus lenguajes e imágenes.
 *
 * @param username - Usuario de GitHub whose repositorios obtener
 * @returns Estado y datos de repositorios para filtrar y mostrar
 *
 * Retorna filteredRepos porque el filtrado es parte de la lógica de datos,
 * no de presentación. Mantiene el componente dumb y reusable.
 * Las tecnologías son un array porque necesitamos listar todos los lenguajes
 * únicos para generar los filtros, y se calcula una vez memoizado en el estado.
 */
export const useGitHubRepos = (username: string): UseGitHubReposReturn => {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [technologies, setTechnologies] = useState<string[]>([])
  const [filter, setFilter] = useState<string>('Todos')

  // El filtrado se hace en memoria porque no hay muchos repos
  // Evitamos una llamada adicional a la API solo para filtrar
  const filteredRepos: GitHubRepo[] =
    filter === 'Todos' ? repos : repos.filter(repo => repo.tech.includes(filter))

  useEffect(() => {
    const fetchRepos = async (): Promise<void> => {
      try {
        // Token opcional para aumentar rate limit en desarrollo
        // El portfolio funciona sin él para repos públicos
        const options: RequestInit = {}
        if (import.meta.env.VITE_GITHUB_TOKEN) {
          options.headers = {
            Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`,
          }
        }

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

              // Buscar preview.png en main primero, luego master
              // main es el nuevo default en GitHub, pero algunos repos antiguos usan master
              let imagePath: string | null = null
              let image: string | null = null

              for (const branch of ['main', 'master']) {
                imagePath = await findPreviewImagePath(username, repo.name, branch, options)
                if (imagePath) {
                  image = buildImageUrl(username, repo.name, branch, imagePath)
                  break
                }
              }

              return {
                title: repo.name,
                description: repo.description || 'Sin descripción disponible',
                tech: tech,
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

        setRepos(reposWithAllLanguages)

        // Extraer lenguajes únicos y ordenar alfabéticamente
        // Sorted para UX consistente en los filtros
        const allTechs = reposWithAllLanguages.flatMap(repo => repo.tech)
        const uniqueTechs = [...new Set(allTechs)].sort()
        setTechnologies(uniqueTechs)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchRepos()
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