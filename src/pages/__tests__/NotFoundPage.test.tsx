/**
 * Tests de NotFoundPage (404)
 *
 * Página simple con mensaje de error y botón para volver al inicio.
 * Necesita MemoryRouter para el Link + ThemeProvider para MUI.
 */
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '@/test/test-utils'
import { NotFoundPage } from '../NotFoundPage'

describe('NotFoundPage', () => {
  it('muestra el código 404', () => {
    renderWithRouter(<NotFoundPage />)

    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('muestra el mensaje "Página no encontrada"', () => {
    renderWithRouter(<NotFoundPage />)

    expect(screen.getByText(/página no encontrada/i)).toBeInTheDocument()
  })

  it('muestra la descripción', () => {
    renderWithRouter(<NotFoundPage />)

    expect(screen.getByText(/la página que buscas no existe o fue movida/i)).toBeInTheDocument()
  })

  it('tiene un botón que navega a la página principal', () => {
    renderWithRouter(<NotFoundPage />)

    const button = screen.getByRole('link', { name: /volver a la página principal/i })

    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('href', '/')
  })
})
