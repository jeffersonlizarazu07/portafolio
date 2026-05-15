/**
 * Tests de Footer
 *
 * Renderiza nombre, año, NavLinks + SocialLinks.
 * Necesita MemoryRouter (NavLinks) + ThemeProvider (MUI).
 */
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '@/test/test-utils'
import { Footer } from '../Footer'

describe('Footer', () => {
  it('muestra el nombre del desarrollador', () => {
    renderWithRouter(<Footer />)

    expect(screen.getByRole('heading', { name: /jefferson johan lizarazu/i })).toBeInTheDocument()
  })

  it('muestra el año actual en el copyright', () => {
    renderWithRouter(<Footer />)

    const currentYear = new Date().getFullYear()
    expect(screen.getByText(new RegExp(String(currentYear)))).toBeInTheDocument()
  })

  it('muestra "Desarrollador Full Stack"', () => {
    renderWithRouter(<Footer />)

    expect(screen.getByText(/desarrollador full stack/i)).toBeInTheDocument()
  })

  it('renderiza los links de navegación', () => {
    renderWithRouter(<Footer />)

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /proyectos/i })).toBeInTheDocument()
  })

  it('renderiza los links de redes sociales (sin label)', () => {
    renderWithRouter(<Footer />)

    // SocialLinks con showLabels=false → solo iconos con aria-label
    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument()
  })
})
