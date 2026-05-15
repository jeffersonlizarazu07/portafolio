/**
 * Tests de SocialLinks — enlaces a redes sociales.
 *
 * Conceptos:
 *
 * 1. getByRole('link') — busca elementos <a> por su rol ARIA.
 *    Es más robusto que getByTestId porque refleja cómo los usuarios
 *    reales (y lectores de pantalla) interactúan con los links.
 *
 * 2. toHaveAttribute + toHaveTextContent — matchers específicos
 *    de @testing-library/jest-dom para verificar atributos y texto.
 *
 * 3. Cobertura de línea 40: la función `theme => theme.palette.grey[500]`
 *    ahora es invocada por MUI durante el render del sx prop (ANTES estaba
 *    anidada dentro de un objeto extra y nunca se ejecutaba).
 *    Al renderizar con ThemeProvider, MUI resuelve la función automáticamente.
 */
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme } from '@/test/test-utils'
import { SocialLinks } from '../SocialLinks'

describe('SocialLinks', () => {
  // ── RENDERIZADO CON SHOWLABELS (DEFAULT) ─────────────────────────────

  it('renderiza los tres enlaces sociales con labels visibles por defecto', () => {
    renderWithTheme(<SocialLinks />)

    // Deben existir tres links
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(3)

    // Cada link debe tener su label visible
    expect(screen.getByText('GitHub')).toBeInTheDocument()
    expect(screen.getByText('LinkedIn')).toBeInTheDocument()
    expect(screen.getByText('Correo electrónico')).toBeInTheDocument()
  })

  it('cada link tiene el href y aria-label correctos', () => {
    renderWithTheme(<SocialLinks />)

    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
      'href',
      'https://github.com/jeffersonlizarazu07'
    )
    expect(screen.getByRole('link', { name: /linkedin/i })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/jefferson-lizarazu/'
    )
    expect(screen.getByRole('link', { name: /email/i })).toHaveAttribute(
      'href',
      expect.stringContaining('mailto:')
    )
  })

  // ── SHOWLABELS = FALSE ───────────────────────────────────────────────

  it('oculta las labels cuando showLabels es false', () => {
    // CUBRE: línea 60 — {showLabels && <Typography>{label}</Typography>}
    // La rama false de este ternario (showLabels = false) no se cubría.
    renderWithTheme(<SocialLinks showLabels={false} />)

    // Los links deben existir
    expect(screen.getAllByRole('link')).toHaveLength(3)

    // Las labels NO deben estar visibles
    expect(screen.queryByText('GitHub')).not.toBeInTheDocument()
    expect(screen.queryByText('LinkedIn')).not.toBeInTheDocument()
    expect(screen.queryByText('Correo electrónico')).not.toBeInTheDocument()
  })

  it('los iconos siguen siendo accesibles sin labels', () => {
    // Incluso sin labels, los links deben tener aria-label para accesibilidad
    renderWithTheme(<SocialLinks showLabels={false} />)

    expect(screen.getByRole('link', { name: /github/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /linkedin/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /email/i })).toBeInTheDocument()
  })
})
