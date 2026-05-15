/**
 * Tests de getLanguageLogo
 *
 * ¿Por qué empezar aquí?
 * - Es una PURE FUNCTION: mismos inputs → mismos outputs.
 * - No necesita DOM, ni React, ni async, ni mocks.
 * - Es el tipo de test más simple y rápido que existe.
 */
import { describe, it, expect } from 'vitest'
import { getLanguageLogo } from '../languageLogos'

/**
 * Decodifica una data URI en base64 a su contenido SVG original.
 * Útil para verificar el contenido del fallback inline.
 *
 * Ejemplo:
 *   decodeDataUri('data:image/svg+xml;base64,PHN2Zy...')
 *   → '<svg xmlns="http://www.w3.org/2000/svg"...</svg>'
 */
const decodeDataUri = (uri: string): string => {
  const base64 = uri.split(',')[1]
  return atob(base64)
}

describe('getLanguageLogo', () => {
  // ── CASO FELIZ ────────────────────────────────────────────────────────

  it('retorna la URL de SimpleIcons para un lenguaje conocido', () => {
    const result = getLanguageLogo('TypeScript', 'white')

    expect(result).toBe('https://cdn.simpleicons.org/typescript/white')
  })

  // ── COLOR ─────────────────────────────────────────────────────────────

  it('reemplaza el sufijo de color correctamente', () => {
    const result = getLanguageLogo('JavaScript', 'black')

    expect(result).toBe('https://cdn.simpleicons.org/javascript/black')
  })

  it('usa white como color por defecto', () => {
    const result = getLanguageLogo('Python')

    expect(result).toBe('https://cdn.simpleicons.org/python/white')
  })

  // ── EDGE CASES ────────────────────────────────────────────────────────

  it('retorna fallback SVG cuando el lenguaje es null', () => {
    const result = getLanguageLogo(null)
    const svg = decodeDataUri(result)

    expect(result).toMatch(/^data:image\/svg\+xml/)
    // Verificamos el contenido REAL del SVG decodificado
    expect(svg).toContain('M16 18l6-6-6-6')
    expect(svg).toContain('stroke="#ffffff"')
  })

  it('retorna fallback SVG para un lenguaje desconocido', () => {
    const result = getLanguageLogo('LenguajeFake', 'white')
    const svg = decodeDataUri(result)

    expect(result).toMatch(/^data:image\/svg\+xml/)
    expect(svg).toContain('M16 18l6-6-6-6')
  })

  it('retorna fallback con el color correcto según el parámetro', () => {
    const result = getLanguageLogo(null, 'black')
    const svg = decodeDataUri(result)

    // black → el parámetro se pasa como color a getFallbackSvg
    // que internamente usa 'white' o '#222222' como hex
    expect(svg).toContain('stroke="#222222"')
  })
})
