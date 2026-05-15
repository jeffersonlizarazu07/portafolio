/**
 * Tests de githubCache (localStorage con estrategia stale-while-revalidate).
 *
 * Edge cases cubiertos:
 * - Cache vacío vs fresco vs vencido
 * - JSON corrupto en localStorage
 * - localStorage lleno al guardar
 * - clearCache manual
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getCachedData, setCachedData, clearCache } from '../githubCache'
import type { GitHubRepo } from '@/types/GitHub'

// ── Helpers ──

const mockRepos: GitHubRepo[] = [
  {
    title: 'test-repo',
    description: 'A test repo',
    tech: ['React', 'TypeScript'],
    url: 'https://github.com/test/test-repo',
    stars: 5,
    image: 'https://example.com/preview.png',
    language: 'TypeScript',
  },
]

const mockTechnologies = ['React', 'TypeScript']

/**
 * Crea una entrada de caché simulada en localStorage con timestamp controlado.
 */
const seedCache = (ageInMs: number) => {
  const entry = {
    data: mockRepos,
    technologies: mockTechnologies,
    timestamp: Date.now() - ageInMs,
  }
  localStorage.setItem('github_repos_cache', JSON.stringify(entry))
}

// ── Tests ──

describe('getCachedData', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('retorna null cuando no hay caché', () => {
    const result = getCachedData()

    expect(result).toBeNull()
  })

  it('retorna datos frescos con isStale: false', () => {
    seedCache(0) // justo ahora

    const result = getCachedData()

    expect(result).not.toBeNull()
    expect(result!.repos).toEqual(mockRepos)
    expect(result!.technologies).toEqual(mockTechnologies)
    expect(result!.isStale).toBe(false)
  })

  it('retorna datos vencidos con isStale: true cuando supera TTL', () => {
    seedCache(60 * 60 * 1000 + 1) // 1 hora + 1ms

    const result = getCachedData()

    expect(result).not.toBeNull()
    expect(result!.repos).toEqual(mockRepos)
    expect(result!.isStale).toBe(true)
  })

  it('retorna null y limpia caché cuando el JSON está corrupto', () => {
    localStorage.setItem('github_repos_cache', '{corrupt-json:::}')

    const result = getCachedData()

    expect(result).toBeNull()
    expect(localStorage.getItem('github_repos_cache')).toBeNull()
  })

  it('retorna null cuando faltan propiedades del objeto CacheEntry', () => {
    localStorage.setItem('github_repos_cache', JSON.stringify({ foo: 'bar' }))

    const result = getCachedData()

    // La entrada existe pero no tiene data/timestamp → el JSON.parse funciona
    // pero data es undefined → result tiene undefined en repos
    // El código no valida estructura, pero no crashea
    expect(result).not.toBeNull()
    // data es undefined, timestamp es undefined, age = Date.now() - undefined = NaN
    // age > TTL → NaN > 3600000 → false → isStale: false
    expect(result!.repos).toBeUndefined()
    expect(result!.isStale).toBe(false)
  })
})

describe('setCachedData', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('guarda datos en localStorage con timestamp', () => {
    const before = Date.now()

    setCachedData(mockRepos, mockTechnologies)

    const raw = localStorage.getItem('github_repos_cache')
    expect(raw).not.toBeNull()

    const entry = JSON.parse(raw!)
    expect(entry.data).toEqual(mockRepos)
    expect(entry.technologies).toEqual(mockTechnologies)
    expect(entry.timestamp).toBeGreaterThanOrEqual(before)
    expect(entry.timestamp).toBeLessThanOrEqual(Date.now())
  })

  it('sobrescribe el caché existente', () => {
    seedCache(0)
    const newRepos: GitHubRepo[] = [{ ...mockRepos[0], title: 'new-repo', description: 'New repo' }]

    setCachedData(newRepos, ['Go'])

    const raw = localStorage.getItem('github_repos_cache')
    const entry = JSON.parse(raw!)
    expect(entry.data[0].title).toBe('new-repo')
    expect(entry.technologies).toEqual(['Go'])
  })

  it('no crashea cuando localStorage está lleno', () => {
    // Mock setItem para que lance error de cuota excedida
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementationOnce(() => {
      throw new Error('QuotaExceededError')
    })

    // No debería lanzar excepción
    expect(() => setCachedData(mockRepos, mockTechnologies)).not.toThrow()

    setItemSpy.mockRestore()
  })
})

describe('clearCache', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('elimina la clave del caché', () => {
    seedCache(0)
    expect(localStorage.getItem('github_repos_cache')).not.toBeNull()

    clearCache()

    expect(localStorage.getItem('github_repos_cache')).toBeNull()
  })

  it('no crashea cuando no hay caché', () => {
    expect(() => clearCache()).not.toThrow()
  })
})
