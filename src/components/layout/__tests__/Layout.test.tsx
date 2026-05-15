/**
 * Tests de Layout — el wrapper global con Header + Outlet + Footer.
 *
 * Conceptos NUEVOS:
 *
 * 1. `<Routes>` + `<Route>` anidados para renderizar `<Outlet />`.
 *    Sin una ruta hija, Outlet no renderiza nada.
 *    Esto es un patrón común: el Layout es el Route padre con Outlet,
 *    y las páginas son rutas hijas.
 *
 * 2. `renderWithRouter` ya incluye MemoryRouter, pero necesitamos
 *    Routes anidados para que Outlet funcione.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '@/test/test-utils'
import { Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/context/ThemeContext'
import { Layout } from '../Layout'

// Header usa useThemeMode, necesita el ThemeProvider de la app
beforeEach(() => {
  localStorage.clear()
  window.matchMedia = vi.fn().mockImplementation(() => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
})

const renderLayout = () =>
  renderWithRouter(
    <ThemeProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path='/' element={<div data-testid='child'>Contenido hijo</div>} />
        </Route>
      </Routes>
    </ThemeProvider>
  )

describe('Layout', () => {
  it('renderiza el Header con el logo', () => {
    renderLayout()

    expect(screen.getByText('J')).toBeInTheDocument()
    expect(screen.getByText('PORTAFOLIO')).toBeInTheDocument()
  })

  it('renderiza el Footer con el nombre del desarrollador', () => {
    renderLayout()

    expect(screen.getByRole('heading', { name: /jefferson johan lizarazu/i })).toBeInTheDocument()
  })

  it('renderiza el contenido hijo via Outlet', () => {
    renderLayout()

    expect(screen.getByTestId('child')).toBeInTheDocument()
    expect(screen.getByText('Contenido hijo')).toBeInTheDocument()
  })
})
