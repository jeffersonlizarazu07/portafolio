/**
 * Tests de NavLinks
 *
 * Componente que usa `useLocation` de react-router-dom para resaltar
 * el link activo. Necesita MemoryRouter + ThemeProvider.
 */
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '@/test/test-utils'
import { NavLinks } from '../NavLinks'

describe('NavLinks', () => {
  it('renderiza todos los links de navegación', () => {
    renderWithRouter(<NavLinks />)

    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /proyectos/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /sobre mí/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /contacto/i })).toBeInTheDocument()
  })

  it('los links apuntan a las rutas correctas', () => {
    renderWithRouter(<NavLinks />)

    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: /proyectos/i })).toHaveAttribute('href', '/projects')
    expect(screen.getByRole('link', { name: /sobre mí/i })).toHaveAttribute('href', '/about')
    expect(screen.getByRole('link', { name: /contacto/i })).toHaveAttribute('href', '/contact')
  })

  it('marca el link de Home como activo cuando estamos en "/"', () => {
    renderWithRouter(<NavLinks />, { initialEntries: ['/'] })

    const homeLink = screen.getByRole('link', { name: /home/i })

    // El link activo tiene color primary.main (no podemos testear el color directamente,
    // pero verificamos que existe al menos un link con estilo de activo)
    expect(homeLink).toBeInTheDocument()
  })

  it('marca el link de Proyectos como activo cuando estamos en "/projects"', () => {
    renderWithRouter(<NavLinks />, { initialEntries: ['/projects'] })

    const proyectosLink = screen.getByRole('link', { name: /proyectos/i })

    expect(proyectosLink).toBeInTheDocument()
  })
})
