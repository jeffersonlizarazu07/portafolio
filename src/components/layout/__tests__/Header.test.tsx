/**
 * Tests de Header
 *
 * Renderiza logo, NavLinks, theme toggle y botón Resume.
 * Necesita:
 * - App's ThemeProvider (useThemeMode)
 * - MemoryRouter (NavLinks con useLocation)
 * - matchMedia mock (ThemeProvider en inicialización)
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '@/test/test-utils'
import { ThemeProvider } from '@/context/ThemeContext'
import { Header } from '../Header'

describe('Header', () => {
  beforeEach(() => {
    localStorage.clear()
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
  })

  const renderHeader = () =>
    renderWithRouter(
      <ThemeProvider>
        <Header />
      </ThemeProvider>
    )

  it('muestra el logo con la letra "J"', () => {
    renderHeader()

    expect(screen.getByText('J')).toBeInTheDocument()
  })

  it('muestra el texto "PORTAFOLIO"', () => {
    renderHeader()

    expect(screen.getByText('PORTAFOLIO')).toBeInTheDocument()
  })

  it('renderiza los links de navegación', () => {
    renderHeader()

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /proyectos/i })).toBeInTheDocument()
  })

  it('tiene un botón de cambio de tema', () => {
    renderHeader()

    expect(screen.getByRole('button', { name: /cambiar tema/i })).toBeInTheDocument()
  })

  it('tiene un botón "Resume" que abre el CV en nueva pestaña', () => {
    renderHeader()

    const resumeLink = screen.getByRole('link', { name: /resume/i })
    expect(resumeLink).toBeInTheDocument()
    expect(resumeLink).toHaveAttribute('target', '_blank')
  })
})
