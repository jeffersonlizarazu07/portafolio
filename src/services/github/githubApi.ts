/**
 * Llamadas a la API pública de GitHub para obtener repositorios.
 *
 * Usa la API pública sin autenticación porque solo necesitamos
 * repositorios públicos. El rate limit es suficiente para un portafolio.
 */

// ── Tipos de respuesta de la API ──

export interface GitHubAPIResponse {
  name: string
  description: string | null
  visibility: string
  fork: boolean
  language: string | null
  html_url: string
  stargazers_count: number
  languages_url: string
}

export interface GitHubTreeItem {
  path: string
  mode: string
  type: string
  sha: string
  size?: number
  url: string
}

export interface GitHubTree {
  sha: string
  url: string
  tree: GitHubTreeItem[]
  truncated: boolean
}

// ── Constantes ──

export const GITHUB_API_BASE = 'https://api.github.com'

// ── Funciones ──

/**
 * Obtiene los repositorios públicos de un usuario de GitHub.
 * Ordenados por última actualización, máximo 100.
 */
export const fetchUserRepos = async (username: string): Promise<GitHubAPIResponse[]> => {
  const response = await fetch(
    `${GITHUB_API_BASE}/users/${username}/repos?sort=updated&per_page=100`
  )

  if (!response.ok) {
    throw new Error('Error al obtener repositorios')
  }

  return response.json() as Promise<GitHubAPIResponse[]>
}

/**
 * Obtiene los lenguajes de un repositorio específico.
 * Retorna un objeto { lenguaje: bytes, ... }.
 */
export const fetchRepoLanguages = async (url: string): Promise<Record<string, number>> => {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('Error al obtener lenguajes del repositorio')
  }

  return response.json() as Promise<Record<string, number>>
}
