/**
 * Tests de useImageFallback — hook de obtención y fallback de imágenes.
 *
 * Depende de ThemeContext, así que necesita el ThemeProvider de la app.
 * Los tests verifican TODOS los caminos:
 *   - image del proyecto vs fallback por lenguaje
 *   - error handler con reemplazo de src
 *   - prevención de loop infinito
 *   - modo light (logoColor = 'black')
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { ThemeProvider } from '@/context/ThemeContext'
import { useImageFallback } from '../useImageFallback'

// ── SETUP ──────────────────────────────────────────────────────────────

beforeEach(() => {
  localStorage.clear()
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
})

const renderUseImageFallback = () =>
  renderHook(() => useImageFallback(), {
    wrapper: ({ children }) => <ThemeProvider>{children}</ThemeProvider>,
  })

const baseProject = {
  title: 'test',
  description: 'desc',
  tech: ['React'],
  url: 'https://github.com/test/test',
  stars: 5,
  image: '',
  language: null,
}

// ── TESTS ──────────────────────────────────────────────────────────────

describe('useImageFallback', () => {
  it('retorna getDisplayImage y handleImageError', () => {
    const { result } = renderUseImageFallback()

    expect(result.current.getDisplayImage).toBeDefined()
    expect(result.current.handleImageError).toBeDefined()
  })

  describe('getDisplayImage', () => {
    it('usa project.image cuando existe', () => {
      const { result } = renderUseImageFallback()

      const project = { ...baseProject, image: 'https://ejemplo.com/img.png' }

      expect(result.current.getDisplayImage(project)).toBe(
        'https://ejemplo.com/img.png'
      )
    })

    it('usa fallback de lenguaje cuando no hay image (dark mode)', () => {
      localStorage.setItem('portfolio-theme-mode', 'dark')
      const { result } = renderUseImageFallback()

      const project = { ...baseProject, language: 'TypeScript' }

      expect(result.current.getDisplayImage(project)).toBe(
        'https://cdn.simpleicons.org/typescript/white'
      )
    })

    it('usa fallback de lenguaje con color black en light mode', () => {
      localStorage.setItem('portfolio-theme-mode', 'light')
      const { result } = renderUseImageFallback()

      const project = { ...baseProject, language: 'JavaScript' }

      expect(result.current.getDisplayImage(project)).toBe(
        'https://cdn.simpleicons.org/javascript/black'
      )
    })

    it('retorna SVG inline para lenguaje desconocido o null', () => {
      const { result } = renderUseImageFallback()

      const project = { ...baseProject, language: null }

      const url = result.current.getDisplayImage(project)
      expect(url).toMatch(/^data:image\/svg\+xml;base64,/)
    })
  })

  describe('handleImageError', () => {
    it('reemplaza src con fallback del lenguaje', () => {
      const { result } = renderUseImageFallback()

      const img = document.createElement('img')
      img.src = 'https://example.com/broken.png'
      const event = { currentTarget: img } as React.SyntheticEvent<HTMLImageElement>

      result.current.handleImageError(event, 'TypeScript')

      expect(img.src).toBe('https://cdn.simpleicons.org/typescript/white')
    })

    it('NO cambia src si ya es el fallback (previene loop infinito)', () => {
      const { result } = renderUseImageFallback()

      const img = document.createElement('img')
      img.src = 'https://cdn.simpleicons.org/typescript/white'
      const event = { currentTarget: img } as React.SyntheticEvent<HTMLImageElement>

      result.current.handleImageError(event, 'TypeScript')

      expect(img.src).toBe('https://cdn.simpleicons.org/typescript/white')
    })
  })
})
