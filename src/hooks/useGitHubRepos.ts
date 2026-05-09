import { useState, useEffect } from 'react'
import type { GitHubRepo, UseGitHubReposReturn } from '@/types/GitHub'

// ── Tipos internos (solo para el hook) ──────────────────────────────────────────────

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

// ── Helpers ───────────────────────────────────────────────────────

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com'
const GITHUB_API_BASE = 'https://api.github.com'
const IMAGE_FILENAME = 'preview.png'

/**
 * Obtiene la ruta relativa de preview.png buscando en el árbol del repo.
 * Funciona con cualquier profundidad: assets/preview.png, frontend/src/assets/preview.png, etc.
 */
const findPreviewImagePath = async (
  username: string,
  repoName: string,
  branch: string,
  options: RequestInit
): Promise<string | null> => {
  try {
    // Obtener el árbol completo del repo (incluye todos los archivos recursivamente)
    const treeUrl = `${GITHUB_API_BASE}/repos/${username}/${repoName}/git/trees/${branch}?recursive=1`
    const treeResponse = await fetch(treeUrl, options)

    if (!treeResponse.ok) return null

    const treeData = (await treeResponse.json()) as GitHubTree

    // Buscar el archivo preview.png en cualquier ubicación
    const previewFile = treeData.tree.find(
      item => item.type === 'blob' && item.path.endsWith(IMAGE_FILENAME)
    )

    return previewFile?.path ?? null
  } catch {
    return null
  }
}

/**
 * Construye la URL raw para una imagen.
 * Si se pasa la ruta del archivo (buscada dinámicamente), la usa.
 * Si no, retorna null para que el componente sepa que no hay imagen.
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

export const useGitHubRepos = (username: string): UseGitHubReposReturn => {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [technologies, setTechnologies] = useState<string[]>([])
  const [filter, setFilter] = useState<string>('Todos')

  // Filtrar repos basados en la tecnología seleccionada
  const filteredRepos: GitHubRepo[] =
    filter === 'Todos' ? repos : repos.filter(repo => repo.tech.includes(filter))

  useEffect(() => {
    const fetchRepos = async (): Promise<void> => {
      try {
        // Opciones para la API request (incluye token si está disponible)
        const options: RequestInit = {}
        if (import.meta.env.VITE_GITHUB_TOKEN) {
          options.headers = {
            Authorization: `token ${import.meta.env.VITE_GITHUB_TOKEN}`,
          }
        }

        // 1. Obtener lista de repositorios
        const response = await fetch(
          `${GITHUB_API_BASE}/users/${username}/repos?sort=updated&per_page=100`
        )

        if (!response.ok) {
          throw new Error('Error al obtener repositorios')
        }

        const data = (await response.json()) as GitHubAPIResponse[]

        // Filtrar solo repos públicos y no forkados
        const publicRepos = data.filter(
          (repo): boolean => repo.visibility === 'public' && !repo.fork
        )

        // 2. Por cada repo, obtener TODOS sus lenguajes y buscar preview.png
        const reposWithAllLanguages = await Promise.all(
          publicRepos.map(async (repo: GitHubAPIResponse): Promise<GitHubRepo> => {
            try {
              // Llamada a languages_ur l para obtener todos los lenguajes
              const langResponse = await fetch(repo.languages_url, options)
              const langData = (await langResponse.json()) as Record<string, number>

              // Object.ke ys() extrae solo los nombres: ["TypeScript", "JavaScript", "CSS"]
              const tech: string[] = Object.keys(langData)

              // Buscar preview.png en cualquier profundidad del repo (prueba main y master)
              let imagePath: string | null = null
              let image: string | null = null

              // Probar "main" primero, luego "master"
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
                image: image ?? '', // string vacía = sin imagen = fallback en componente
                language: repo.language || tech[0] || null,
              }
            } catch {
              // Si falla la llamada de lenguajes, usar el principal
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

        // Extraer TODAS las tecnologías únicas de todos los repos
        const allTechs = reposWithAllLanguages.flatMap(repo => repo.tech)
        // Set para eliminar duplicados, luego ordenar alfabéticamente
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
