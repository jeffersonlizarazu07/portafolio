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
  deployments_url: string
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
const MAX_REPOS = 30 // Suficiente para un portafolio — reduce calls y rate limit

// ── Helpers ──

/**
 * Retorna headers con autenticación opcional.
 * Si hay token configurado, el rate limit sube de 60 a 5000 req/hora.
 */
export const getHeaders = (): HeadersInit => {
  const token = import.meta.env.VITE_GITHUB_TOKEN as string | undefined
  if (!token) return {}
  return { Authorization: `token ${token}` }
}

// ── Funciones ──

/**
 * Obtiene los repositorios públicos de un usuario de GitHub.
 * Limitado a los {MAX_REPOS} más recientes por actualización.
 */
export const fetchUserRepos = async (username: string): Promise<GitHubAPIResponse[]> => {
  const response = await fetch(
    `${GITHUB_API_BASE}/users/${username}/repos?sort=updated&per_page=${MAX_REPOS}`,
    { headers: getHeaders() }
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
  const response = await fetch(url, { headers: getHeaders() })

  if (!response.ok) {
    throw new Error('Error al obtener lenguajes del repositorio')
  }

  return response.json() as Promise<Record<string, number>>
}

/**
 * Obtiene la URL de despliegue (environment_url) de un repositorio.
 *
 * Flujo de la API de Deployments de GitHub:
 *   1. GET /repos/{owner}/{repo}/deployments → lista de deployments
 *   2. GET .../deployments/{id}/statuses → status del deployment activo
 *   3. El status más reciente contiene environment_url si el repo está desplegado
 *
 * @param username - Dueño del repositorio
 * @param repoName - Nombre del repositorio
 * @returns La URL del entorno desplegado, o null si no hay deployment activo
 */
export const fetchRepoDeploymentUrl = async (
  username: string,
  repoName: string
): Promise<string | null> => {
  const deployRes = await fetch(`${GITHUB_API_BASE}/repos/${username}/${repoName}/deployments`, {
    headers: getHeaders(),
  })

  // 404 = el repo no tiene despliegues, no es un error
  if (deployRes.status === 404) return null

  if (!deployRes.ok) {
    throw new Error(`Error al obtener despliegues para ${repoName}: ${deployRes.status}`)
  }

  const deployments = await deployRes.json()

  if (!Array.isArray(deployments) || deployments.length === 0) {
    return null
  }

  const statusRes = await fetch(`${deployments[0].url}/statuses`, { headers: getHeaders() })

  if (!statusRes.ok) return null

  const statuses = await statusRes.json()

  return statuses[0]?.environment_url ?? null
}
