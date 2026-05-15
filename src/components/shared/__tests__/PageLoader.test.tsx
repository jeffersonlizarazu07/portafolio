/**
 * Tests de PageLoader
 *
 * Conceptos nuevos:
 * - `getByRole('progressbar')` — MUI renderiza CircularProgress con este rol.
 * - `getByText` como alternativa cuando no hay un rol semántico claro.
 * - Mismo wrapper `renderWithTheme` que usamos para GlassButton.
 */
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme } from '@/test/test-utils'
import { PageLoader } from '../PageLoader'

describe('PageLoader', () => {
  it('muestra el texto "Cargando..."', () => {
    renderWithTheme(<PageLoader />)

    expect(screen.getByText('Cargando...')).toBeInTheDocument()
  })

  it('muestra un indicador de progreso (spinner)', () => {
    renderWithTheme(<PageLoader />)

    // MUI CircularProgress tiene role="progressbar"
    const spinner = screen.getByRole('progressbar')

    expect(spinner).toBeInTheDocument()
  })

  it('renderiza el texto y el spinner juntos', () => {
    renderWithTheme(<PageLoader />)

    expect(screen.getByRole('progressbar')).toBeInTheDocument()
    expect(screen.getByText('Cargando...')).toBeInTheDocument()
  })
})
