/**
 * Transforma respuestas de la API de GitHub en el modelo GitHubRepo.
 *
 * - Filtra forks y repos privados (solo muestra repos originales públicos).
 * - Paraleliza llamadas a languages y preview para cada repo.
 * - Maneja fallbacks graceful: si un repo individual falla, no falla todo.
 */
import type { GitHubRepo } from '@/types/GitHub'
import type { GitHubAPIResponse } from './githubApi'
import { fetchRepoLanguages } from './githubApi'
import { findPreviewImage } from './githubPreview'

/**
 * Convierte la respuesta de la API de GitHub en nuestro modelo GitHubRepo.
 * - Filtra forks y repos privados
 * - Busca languages y preview para cada repo en paralelo
 * - Fallback graceful si alguno falla
 */
export const mapRepos = async (
  repos: GitHubAPIResponse[],
  username: string
): Promise<GitHubRepo[]> => {
  // Solo repos públicos y no forkados - son los relevantes para el portafolio
  const publicRepos = repos.filter((repo): boolean => repo.visibility === 'public' && !repo.fork)

  // Promise.all para paralelizar - cada repo tiene su propia llamada
  return Promise.all(
    publicRepos.map(async (repo): Promise<GitHubRepo> => {
      try {
        // languages_url retorna {JavaScript: 1234, TypeScript: 5678}
        // Object.keys() extrae solo los nombres de los lenguajes
        const langData = await fetchRepoLanguages(repo.languages_url)
        const tech = Object.keys(langData)

        // Buscar preview.png en cualquier ruta del repo usando Git Trees API
        // main es el nuevo default en GitHub, pero algunos repos antiguos usan master
        let image = ''

        for (const branch of ['main', 'master']) {
          const result = await findPreviewImage(username, repo.name, branch)
          if (result) {
            image = result
            break
          }
        }

        return {
          title: repo.name,
          description: repo.description || 'Sin descripción disponible',
          tech,
          url: repo.html_url,
          stars: repo.stargazers_count,
          image,
          language: repo.language || tech[0] || null,
        }
      } catch {
        // Fallback graceful: si falla, mostramos lo que tenemos de GitHub API
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
}

/**
 * Extrae tecnologías únicas de todos los repos y las ordena alfabéticamente.
 * Útil para generar los filtros en la UI.
 */
export const extractTechnologies = (repos: GitHubRepo[]): string[] => {
  const allTechs = repos.flatMap(repo => repo.tech)
  return [...new Set(allTechs)].sort()
}
