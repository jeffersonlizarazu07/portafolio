/**
 * Tipos relacionados con repositorios de GitHub
 */

/**
 * Representa un repositorio de GitHub
 */
export interface GitHubRepo {
  title: string
  description: string
  tech: string[]
  url: string
  stars: number
  image: string
  language: string | null
  deployment_url?: string | null
}

/**
 * Return type del hook useGitHubRepos
 */
export interface UseGitHubReposReturn {
  repos: GitHubRepo[]
  filteredRepos: GitHubRepo[]
  loading: boolean
  error: string | null
  technologies: string[]
  filter: string
  setFilter: (filter: string) => void
}
