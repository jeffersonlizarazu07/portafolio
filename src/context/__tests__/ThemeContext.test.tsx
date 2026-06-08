/**
 * Tests de ThemeContext
 *
 * Conceptos NUEVOS:
 *
 * 1. `window.matchMedia` — API del browser para detectar prefers-color-scheme.
 *    jsdom NO la implementa, así que debemos mockearla ANTES de renderizar.
 *
 * 2. Componente CONSUMIDOR — creamos un componente inline que use el contexto
 *    para poder inspeccionar su estado (mode) y disparar acciones (toggle).
 *
 * 3. `data-testid` — atributo para identificar elementos en tests.
 *    Útil cuando no hay un rol semántico o texto visible adecuado.
 *
 * 4. ¿Por qué NO usamos renderWithTheme aquí?
 *    Porque ThemeProvider YA incluye MuiThemeProvider adentro.
 *    renderWithTheme agregaría otro ThemeProvider anidado.
 *
 * 5. `document.body.getAttribute()` — para verificar que el provider
 *    actualiza el atributo data-theme en el body.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { act, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, useThemeMode } from '../ThemeContext'

// ── HELPERS ────────────────────────────────────────────────────────────

/** Componente que CONSUME el contexto para exponer mode y toggle en el DOM.
 *  Sin esto, no podemos inspeccionar el valor del contexto. */
const ThemeConsumer = () => {
  const { mode, toggleTheme } = useThemeMode()
  return (
    <div>
      <span data-testid='theme-mode'>{mode}</span>
      <button onClick={toggleTheme}>Toggle theme</button>
    </div>
  )
}

/** Componente que NO está envuelto en ThemeProvider → debe lanzar error */
const OrphanConsumer = () => {
  useThemeMode() // Esto debe tirar error
  return <div>No debería verse</div>
}

/** Mock por defecto de matchMedia (prefiere dark) */
const createMatchMediaMock = (prefersLight: boolean = false) => {
  return vi.fn().mockImplementation((query: string) => ({
    matches: prefersLight,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
}

// ── Setup ──────────────────────────────────────────────────────────────

beforeEach(() => {
  // localStorage limpio entre tests
  localStorage.clear()
  // matchMedia por defecto: NO prefiere light (modo oscuro)
  window.matchMedia = createMatchMediaMock(false)
})

// ── Tests ──────────────────────────────────────────────────────────────

describe('ThemeContext', () => {
  // ── MODO POR DEFECTO ─────────────────────────────────────────────────

  it('usa "dark" como modo por defecto cuando no hay preferencia guardada', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    )

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark')
  })

  it('usa "light" desde localStorage si está guardado', () => {
    // Guardar preferencia ANTES de renderizar
    localStorage.setItem('portfolio-theme-mode', 'light')

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    )

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('light')
  })

  it('detecta prefers-color-scheme: light cuando no hay localStorage', () => {
    // matchMedia mock: prefiere light
    window.matchMedia = createMatchMediaMock(true)

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    )

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('light')
  })

  // ── TOGGLE ───────────────────────────────────────────────────────────

  it('cambia de dark a light al hacer toggle', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    )

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark')

    await user.click(screen.getByRole('button', { name: /toggle theme/i }))

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('light')
  })

  it('vuelve de light a dark al hacer toggle desde light', async () => {
    // CUBRE: rama "false" del ternary en toggleTheme (línea 81)
    // prev === 'dark' ? 'light' : 'dark' → cuando prev NO es dark
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    )

    // Primer toggle: dark → light
    await user.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(screen.getByTestId('theme-mode')).toHaveTextContent('light')

    // Segundo toggle: light → dark (prev !== 'dark' → toma rama false)
    await user.click(screen.getByRole('button', { name: /toggle theme/i }))
    expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark')
  })

  it('persiste el modo en localStorage después de hacer toggle', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    )

    expect(localStorage.getItem('portfolio-theme-mode')).toBe('dark')

    await user.click(screen.getByRole('button', { name: /toggle theme/i }))

    expect(localStorage.getItem('portfolio-theme-mode')).toBe('light')
  })

  // ── DATA ATTRIBUTE ───────────────────────────────────────────────────

  it('actualiza data-theme en document.body al hacer toggle', async () => {
    const user = userEvent.setup()
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    )

    expect(document.body.getAttribute('data-theme')).toBe('dark')

    await user.click(screen.getByRole('button', { name: /toggle theme/i }))

    expect(document.body.getAttribute('data-theme')).toBe('light')
  })

  // ── MATCHMEDIA CHANGE LISTENER ───────────────────────────────────────

  it('cambia al modo light cuando la preferencia del sistema cambia (sin localStorage)', async () => {
    // CUBRE: líneas 70-72 — matchMedia change event sin localStorage
    //
    // NOTA: El primer useEffect (persist) escribe localStorage ANTES de que
    // el listener de matchMedia se registre. Para probar el auto-cambio,
    // necesitamos que localStorage.getItem devuelva null cuando el handler
    // se ejecute, por eso espiaremos getItem.
    const addEventListenerMock = vi.fn()
    const mediaQueryObj = {
      matches: false,
      media: '(prefers-color-scheme: light)',
      onchange: null,
      addEventListener: addEventListenerMock,
      removeEventListener: vi.fn(),
    }

    window.matchMedia = vi.fn().mockReturnValue(mediaQueryObj)

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    )

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark')

    // Obtener el handler que se registró en addEventListener('change', handler)
    expect(addEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function))
    const handleChange = addEventListenerMock.mock.calls[0][1]

    // Forzar que localStorage.getItem devuelva null para la key del tema
    // (el useEffect persist ya la escribió, pero necesitamos simular que no hay)
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      if (key === 'portfolio-theme-mode') return null
      return null
    })

    // Simular que la preferencia del sistema cambia a light
    act(() => {
      handleChange({ matches: true } as MediaQueryListEvent)
    })

    await waitFor(() => {
      expect(screen.getByTestId('theme-mode')).toHaveTextContent('light')
    })

    getItemSpy.mockRestore()
  })

  it('NO cambia automáticamente cuando hay preferencia guardada en localStorage', async () => {
    // CUBRE: rama "else" de la línea 71 — if (!stored)
    localStorage.setItem('portfolio-theme-mode', 'dark')

    const addEventListenerMock = vi.fn()
    const mediaQueryObj = {
      matches: true,
      media: '(prefers-color-scheme: light)',
      onchange: null,
      addEventListener: addEventListenerMock,
      removeEventListener: vi.fn(),
    }

    window.matchMedia = vi.fn().mockReturnValue(mediaQueryObj)

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    )

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark')

    // Obtener el handler de addEventListener
    expect(addEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function))
    const handleChange = addEventListenerMock.mock.calls[0][1]

    // Simular que la preferencia del sistema cambia (matches: false = dark)
    handleChange({ matches: false } as MediaQueryListEvent)

    // Debería SEGUIR siendo dark porque hay preferencia en localStorage
    await waitFor(() => {
      expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark')
    })
  })

  it('cambia al modo dark cuando la preferencia del sistema cambia de light a dark (sin localStorage)', async () => {
    // CUBRE: rama "false" del ternary e.matches ? 'light' : 'dark' (línea 72)
    // Inicial: sistema prefiere light → modo light
    // Cambio: sistema prefiere dark → setMode('dark')
    const addEventListenerMock = vi.fn()
    const mediaQueryObj = {
      matches: true, // inicial: light
      media: '(prefers-color-scheme: light)',
      onchange: null,
      addEventListener: addEventListenerMock,
      removeEventListener: vi.fn(),
    }

    window.matchMedia = vi.fn().mockReturnValue(mediaQueryObj)

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    )

    expect(screen.getByTestId('theme-mode')).toHaveTextContent('light')

    expect(addEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function))
    const handleChange = addEventListenerMock.mock.calls[0][1]

    // Forzar localStorage.getItem a null (el persist effect ya escribió)
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      if (key === 'portfolio-theme-mode') return null
      return null
    })

    // Simular que el sistema cambia a dark
    act(() => {
      handleChange({ matches: false } as MediaQueryListEvent)
    })

    await waitFor(() => {
      expect(screen.getByTestId('theme-mode')).toHaveTextContent('dark')
    })

    getItemSpy.mockRestore()
  })

  // ── ERROR BOUNDARY ───────────────────────────────────────────────────

  it('lanza error cuando useThemeMode se usa fuera de ThemeProvider', () => {
    // En React 19, los errores lanzados durante render son capturados
    // por el ErrorBoundary más cercano. Pero podemos verificar que el
    // componente NO renderiza su contenido.
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})

    expect(() => {
      render(<OrphanConsumer />)
    }).toThrow('useThemeMode must be used within a ThemeProvider')

    spy.mockRestore()
  })
})
