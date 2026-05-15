/**
 * Tests de DirectContact
 *
 * Renderiza ContactItems con emails y ubicación.
 * Solo necesita MUI ThemeProvider.
 */
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme } from '@/test/test-utils'
import { DirectContact } from '../DirectContact'

describe('DirectContact', () => {
  it('muestra el título "Contacto directo"', () => {
    renderWithTheme(<DirectContact />)

    expect(screen.getByText(/contacto directo/i)).toBeInTheDocument()
  })

  it('muestra los correos electrónicos', () => {
    renderWithTheme(<DirectContact />)

    expect(screen.getByText('jeffersonlizarazu@hotmail.com')).toBeInTheDocument()
    expect(screen.getByText('jeffersonliza21@gmail.com')).toBeInTheDocument()
  })

  it('los emails tienen links con mailto', () => {
    renderWithTheme(<DirectContact />)

    expect(screen.getByRole('link', { name: /jeffersonlizarazu@hotmail/i })).toHaveAttribute(
      'href',
      'mailto:jeffersonlizarazu@hotmail.com'
    )
  })

  it('muestra la ubicación', () => {
    renderWithTheme(<DirectContact />)

    expect(screen.getByText(/bogotá d\.c, colombia/i)).toBeInTheDocument()
  })
})
