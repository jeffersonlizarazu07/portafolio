/**
 * Tests de Hero (test de integración)
 *
 * Conceptos NUEVOS:
 * 1. `renderWithRouter` — combina ThemeProvider + MemoryRouter
 * 2. `MemoryRouter` — provee contexto de ruta SIN navegador real
 * 3. `getByRole('heading')` — buscar por nivel de heading (h1, h2, etc.)
 * 4. `getAllByRole` — cuando hay MÚLTIPLES elementos con el mismo rol
 *
 * ¿Por qué esto es un test de INTEGRACIÓN (no unitario)?
 * Porque Hero renderiza sub-componentes (CodeImage, SocialLinks).
 * No los mocksamos — renderizamos el árbol real y verificamos
 * que TODO funcione junto.
 */
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '@/test/test-utils'
import { Hero } from '../Hero'

describe('Hero', () => {
  // ── CONTENIDO PRINCIPAL ───────────────────────────────────────────────

  it('muestra el badge "DISPONIBLE"', () => {
    renderWithRouter(<Hero />)

    expect(screen.getByText('DISPONIBLE')).toBeInTheDocument()
  })

  it('muestra el título principal "Full Stack Developer."', () => {
    renderWithRouter(<Hero />)

    // Buscar por rol de heading (h2) que contenga el texto
    const heading = screen.getByRole('heading', { level: 2 })

    expect(heading).toBeInTheDocument()
    expect(heading.textContent).toContain('Full Stack')
    expect(heading.textContent).toContain('Developer')
  })

  it('muestra la descripción profesional', () => {
    renderWithRouter(<Hero />)

    const descripcion = screen.getByText(/he trabajado en el desarrollo de soluciones web/i)

    expect(descripcion).toBeInTheDocument()
  })

  // ── BOTONES DE NAVEGACIÓN ─────────────────────────────────────────────

  it('tiene un botón "Ver mis proyectos" que navega a /projects', () => {
    renderWithRouter(<Hero />)

    const boton = screen.getByRole('link', { name: /ver mis proyectos/i })

    expect(boton).toBeInTheDocument()
    expect(boton).toHaveAttribute('href', '/projects')
  })

  it('tiene un botón "Contactarme" que navega a /contact', () => {
    renderWithRouter(<Hero />)

    const boton = screen.getByRole('link', { name: /contactarme/i })

    expect(boton).toBeInTheDocument()
    expect(boton).toHaveAttribute('href', '/contact')
  })

  // ── REDES SOCIALES ────────────────────────────────────────────────────

  it('muestra los enlaces a redes sociales', () => {
    renderWithRouter(<Hero />)

    // SocialLinks renderiza links externos con target="_blank"
    const github = screen.getByRole('link', { name: /github/i })
    const linkedin = screen.getByRole('link', { name: /linkedin/i })

    expect(github).toBeInTheDocument()
    expect(linkedin).toBeInTheDocument()
    expect(github).toHaveAttribute('target', '_blank')
    expect(linkedin).toHaveAttribute('target', '_blank')
  })
})
