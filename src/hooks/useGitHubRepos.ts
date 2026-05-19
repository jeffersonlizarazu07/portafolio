/**
 * Hook para obtener y filtrar repositorios de GitHub del usuario.
 *
 * Orquesta la obtención de datos (githubApi), transformación (githubMapper),
 * búsqueda de preview (githubPreview), y caché (githubCache).
 *
 * Los proyectos del portafolio se muestran directamente desde GitHub,
 * evitando mantener manualmente una lista de proyectos.
 * Si el usuario actualiza su GitHub, el portafolio se actualiza automáticamente.
 *
 * OPTIMIZACIÓN DE PERFORMANCE (v2):
 * - Caché en localStorage con stale-while-revalidate:
 *   - 1ra visita: fetch normal + guarda en caché
 *   - 2da visita (caché fresco): render INSTANTÁNEO, 0 llamadas API
 *   - 3ra visita (caché vencido): render instantáneo + refresh silencioso en background
 */
import { useState, useEffect } from 'react'
import type { GitHubRepo, UseGitHubReposReturn } from '@/types/GitHub'
import { getCachedData, setCachedData } from '@/utils/githubCache'
import { fetchUserRepos } from '@/services/github/githubApi'
import { mapRepos, extractTechnologies } from '@/services/github/githubMapper'

// ── Hook ──

/**
 * Obtiene repositorios de GitHub con sus lenguajes e imágenes.
 *
 * @param username - Usuario de GitHub cuyos repositorios obtener
 * @returns Estado y datos de repositorios para filtrar y mostrar
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

    const fetchAndMap = async (): Promise<void> => {
      try {
        const data = await fetchUserRepos(username)
        if (ignore) return

        const mappedRepos = await mapRepos(data, username)
        if (ignore) return

        setRepos(mappedRepos)

        // Extraer lenguajes únicos y ordenar alfabéticamente
        // Sorted para UX consistente en los filtros
        const techs = extractTechnologies(mappedRepos)
        setTechnologies(techs)

        // Guardar en caché para la próxima visita
        setCachedData(mappedRepos, techs)
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

    fetchAndMap()

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
