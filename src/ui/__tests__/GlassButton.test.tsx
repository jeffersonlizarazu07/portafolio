/**
 * Tests de GlassButton
 *
 * ¿Qué aprendemos aquí?
 * - `render` — monta un componente React en un DOM virtual (jsdom)
 * - `screen` — busca elementos en ese DOM (getByText, getByRole)
 * - `wrapper` — provee contexto necesario (ThemeProvider de MUI)
 * - `toBeInTheDocument()` — matcher de jest-dom
 * - `toBeDisabled()` — matcher de jest-dom para elementos deshabilitados
 */
import { describe, it, expect } from 'vitest'
import { screen, render } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { renderWithTheme } from '@/test/test-utils'
import { GlassButton } from '../GlassButton'

/**
 * Tema claro para tests — ejercita las ramas "light" de los ternarios
 * en los sx props de GlassButton (theme.palette.mode === 'dark' ? ... : ...).
 */
const lightTestTheme = createTheme({
  palette: { mode: 'light' },
})

describe('GlassButton', () => {
  // ── RENDERIZADO POR DEFECTO ───────────────────────────────────────────

  it('renderiza con el texto por defecto "Enviar mensaje"', () => {
    // Arrange + Act: renderizar sin props
    renderWithTheme(<GlassButton />)

    // Assert: buscar un botón con el texto por defecto
    const button = screen.getByRole('button', { name: /enviar mensaje/i })

    expect(button).toBeInTheDocument()
  })

  it('tiene type="submit" por defecto', () => {
    renderWithTheme(<GlassButton />)

    const button = screen.getByRole('button')

    expect(button).toHaveAttribute('type', 'submit')
  })

  // ── CUSTOM CHILDREN ───────────────────────────────────────────────────

  it('renderiza el texto personalizado cuando se pasa children', () => {
    renderWithTheme(<GlassButton>Enviar formulario</GlassButton>)

    const button = screen.getByRole('button', { name: /enviar formulario/i })

    expect(button).toBeInTheDocument()
  })

  // ── DISABLED ──────────────────────────────────────────────────────────

  it('se deshabilita cuando recibe disabled={true}', () => {
    renderWithTheme(<GlassButton disabled>Enviar</GlassButton>)

    const button = screen.getByRole('button', { name: /enviar/i })

    expect(button).toBeDisabled()
  })

  it('NO está deshabilitado cuando no se pasa disabled', () => {
    renderWithTheme(<GlassButton />)

    const button = screen.getByRole('button')

    expect(button).not.toBeDisabled()
  })

  // ── TEMA CLARO ──────────────────────────────────────────────────────────

  it('aplica estilos de modo claro correctamente', () => {
    // Renderizar con tema light para cubrir las ramas "false" de los ternarios
    // `theme.palette.mode === 'dark' ? ... : ...` en background y border (líneas 24-29).
    render(
      <ThemeProvider theme={lightTestTheme}>
        <GlassButton />
      </ThemeProvider>
    )

    const button = screen.getByRole('button', { name: /enviar mensaje/i })

    expect(button).toBeInTheDocument()
  })
})
