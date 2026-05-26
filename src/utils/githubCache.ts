/**
 * Caché en localStorage para datos de repositorios de GitHub.
 *
 * Estrategia stale-while-revalidate:
 * - Si hay caché fresco → render instantáneo, 0 llamadas API
 * - Si hay caché vencido → render instantáneo + refresh en background
 * - Si no hay caché → loading skeleton + fetch normal
 *
 * - Los repos de GitHub no cambian a cada rato.
 * - El usuario no quiere ver skeletons cada vez que abre una pestaña nueva.
 * - localStorage sobrevive a refrescos y cierres del navegador.
 *
 * ¿Por qué 1 hora de TTL?
 * - Suficiente para no notar data desactualizada en un portafolio.
 * - Si el usuario pushea a GitHub, el cambio se refleja en máx 1 hora.
 * - El background refresh es silencioso — el usuario no percibe la espera.
 */
import type { GitHubRepo } from '@/types/GitHub'

// ── Tipos internos ──

interface CacheEntry {
  data: GitHubRepo[]
  technologies: string[]
  timestamp: number
}

// ── Constantes ──

const CACHE_KEY = 'github_repos_cache'
const TTL = 60 * 60 * 1000 // 1 hora en milisegundos

// ── Helpers ──

/**
 * Lee los datos del caché si existen y no han expirado.
 *
 * Retorna:
 * - `{ repos, technologies, isStale: false }` → caché fresco, no necesita refresh
 * - `{ repos, technologies, isStale: true }` → caché vencido, usar + refrescar
 * - `null` → no hay caché
 */
export const getCachedData = (): {
  repos: GitHubRepo[]
  technologies: string[]
  isStale: boolean
} | null => {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null

    const entry: CacheEntry = JSON.parse(raw)
    const age = Date.now() - entry.timestamp

    return {
      repos: entry.data,
      technologies: entry.technologies,
      isStale: age > TTL,
    }
  } catch {
    // Si el JSON está corrupto (raro, pero posible), ignoramos y volvemos a fetchear
    localStorage.removeItem(CACHE_KEY)
    return null
  }
}

/**
 * Guarda los datos en el caché con timestamp actual.
 * Se llama DESPUÉS de un fetch exitoso.
 */
export const setCachedData = (repos: GitHubRepo[], technologies: string[]): void => {
  try {
    const entry: CacheEntry = {
      data: repos,
      technologies,
      timestamp: Date.now(),
    }
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry))
  } catch {
    // Si localStorage está lleno (raro), simplemente no cacheamos
    if (import.meta.env.DEV) {
      console.warn('No se pudo guardar en caché (localStorage lleno?)')
    }
  }
}

/**
 * Limpia el caché manualmente. Útil si el usuario quiere forzar un refresh.
 */
export const clearCache = (): void => {
  localStorage.removeItem(CACHE_KEY)
}
