/**
 * Test Utilities — Helpers reutilizables para tests.
 *
 * `renderWithTheme` — para componentes que solo necesitan MUI
 * `renderWithRouter` — para componentes que necesitan MUI + React Router
 *
 * Uso:
 *   renderWithTheme(<GlassButton />)
 *   renderWithRouter(<Hero />)
 */
import { type ReactElement } from 'react'
import { render, type RenderOptions } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { MemoryRouter } from 'react-router-dom'

/**
 * Tema por defecto para tests.
 * Usamos valores fijos (no dependemos de prefers-color-scheme ni localStorage).
 */
const testTheme = createTheme({
  palette: {
    mode: 'dark',
  },
})

// ── TIPOS ──────────────────────────────────────────────────────────────

interface WrapperProps {
  children: React.ReactNode
}

// ── WRAPPERS ───────────────────────────────────────────────────────────

/**
 * Wrapper que provee contexto de MUI.
 */
const ThemeWrapper = ({ children }: WrapperProps) => {
  return <ThemeProvider theme={testTheme}>{children}</ThemeProvider>
}

// ── RENDER HELPERS ─────────────────────────────────────────────────────

/**
 * Renderiza un componente envuelto en ThemeProvider de MUI.
 * Para componentes que NO usan React Router.
 */
export const renderWithTheme = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => {
  return render(ui, { wrapper: ThemeWrapper, ...options })
}

/**
 * Renderiza un componente envuelto en ThemeProvider + MemoryRouter.
 * Para componentes que SÍ usan React Router (Links, useNavigate, etc.).
 *
 * @param initialEntries - Rutas iniciales del MemoryRouter (default: ['/'])
 */
export const renderWithRouter = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { initialEntries?: string[] }
) => {
  const { initialEntries, ...renderOptions } = options ?? {}

  const CustomRouterWrapper = ({ children }: WrapperProps) => (
    <MemoryRouter initialEntries={initialEntries ?? ['/']}>
      <ThemeProvider theme={testTheme}>{children}</ThemeProvider>
    </MemoryRouter>
  )

  return render(ui, { wrapper: CustomRouterWrapper, ...renderOptions })
}
