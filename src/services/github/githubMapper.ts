/**
 * Transforma respuestas de la API de GitHub en el modelo GitHubRepo.
 *
 * - Filtra forks y repos privados (solo muestra repos originales públicos).
 * - Paraleliza llamadas a languages y preview para cada repo.
 * - Maneja fallbacks graceful: si un repo individual falla, no falla todo.
 */
import type { GitHubRepo } from '@/types/GitHub'
import type { GitHubAPIResponse } from './githubApi'
import { fetchRepoLanguages, fetchRepoDeploymentUrl } from './githubApi'
import { findPreviewImage } from './githubPreview'

/**
 * Procesa un batch de repos con Promise.all para paralelizar,
 * pero limitado a {batchSize} a la vez para no saturar la API de GitHub.
 */
const BATCH_SIZE = 5

async function processRepo(repo: GitHubAPIResponse, username: string): Promise<GitHubRepo> {
  try {
    const langData = await fetchRepoLanguages(repo.languages_url)
    const tech = Object.keys(langData)

    const [image, deploymentUrl] = await Promise.all([
      findPreviewImage(username, repo.name, repo.default_branch).then(r => r ?? ''),
      fetchRepoDeploymentUrl(username, repo.name),
    ])

    return {
      title: repo.name,
      description: repo.description || 'Sin descripción disponible',
      tech,
      url: repo.html_url,
      stars: repo.stargazers_count,
      image,
      language: repo.language || tech[0] || null,
      deployment_url: deploymentUrl,
    }
  } catch {
    return {
      title: repo.name,
      description: repo.description || 'Sin descripción disponible',
      tech: repo.language ? [repo.language] : [],
      url: repo.html_url,
      stars: repo.stargazers_count,
      image: '',
      language: repo.language || null,
      deployment_url: null,
    }
  }
}

/**
 * Itera sobre los repos en batches de {BATCH_SIZE}.
 * Evita lanzar N llamadas simultáneas que saturarían el rate limit.
 */
async function processInBatches(
  repos: GitHubAPIResponse[],
  username: string
): Promise<GitHubRepo[]> {
  const results: GitHubRepo[] = []
  for (let i = 0; i < repos.length; i += BATCH_SIZE) {
    const batch = repos.slice(i, i + BATCH_SIZE)
    const batchResults = await Promise.all(batch.map(r => processRepo(r, username)))
    results.push(...batchResults)
  }
  return results
}

/**
 * Convierte la respuesta de la API de GitHub en nuestro modelo GitHubRepo.
 * - Filtra forks y repos privados
 * - Procesa en batches de {BATCH_SIZE} para no saturar rate limit
 * - Fallback graceful si alguno falla
 */
export const mapRepos = async (
  repos: GitHubAPIResponse[],
  username: string
): Promise<GitHubRepo[]> => {
  const publicRepos = repos.filter((repo): boolean => repo.visibility === 'public' && !repo.fork)

  const mapped = await processInBatches(publicRepos, username)

  return mapped
}

/**
 * Extrae tecnologías únicas de todos los repos y las ordena alfabéticamente.
 * Útil para generar los filtros en la UI.
 */
export const extractTechnologies = (repos: GitHubRepo[]): string[] => {
  const allTechs = repos.flatMap(repo => repo.tech)
  return [...new Set(allTechs)].sort()
}
