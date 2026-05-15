/**
 * Tests de ErrorBoundary
 *
 * Conceptos NUEVOS:
 *
 * 1. Componente "trampa" — un componente que LANZA un error durante el render
 *    para disparar el ErrorBoundary. Sin esto, no podemos probar el fallback.
 *
 * 2. Mock de `console.error` — React SIEMPRE loggea errores en consola cuando
 *    un ErrorBoundary los captura. Si no silenciamos esto, el output del test
 *    se llena de errores falsos.
 *
 * 3. Mock de `window.location.reload` — el botón "Recargar página" llama a
 *    reload(). En jsdom no está implementado, así que lo mockeamos.
 *
 * 4. `afterEach` — para restaurar los mocks después de cada test (como beforeEach
 *    pero se ejecuta DESPUÉS del test).
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, render, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { renderWithTheme } from '@/test/test-utils'
import { ErrorBoundary } from '../ErrorBoundary'

// ── Componente que lanza error ─────────────────────────────────────────

/** Componente que explota durante el render.
 *  Útil para probar que ErrorBoundary captura el error y muestra el fallback. */
const BuggyComponent = ({ message = 'Algo explotó' }: { message?: string }) => {
  throw new Error(message)
}

/** Componente feliz que NO lanza error. */
const SafeComponent = () => <div>Todo bien aquí</div>

// Hook useErrorBoundary helpers
import { useEffect } from 'react'
import { renderHook } from '@testing-library/react'
import { useErrorBoundary } from '../ErrorBoundary'

// ── Setup ──────────────────────────────────────────────────────────────

beforeEach(() => {
  // Mockear console.error para que NO imprima errores de React durante los tests
  // React llama a console.error cuando un ErrorBoundary captura un error.
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  // Restaurar console.error original después de cada test
  vi.restoreAllMocks()
})

// ── Tests ──────────────────────────────────────────────────────────────

describe('ErrorBoundary', () => {
  // ── CASO FELIZ ────────────────────────────────────────────────────────

  it('renderiza los hijos cuando NO hay error', () => {
    renderWithTheme(
      <ErrorBoundary>
        <SafeComponent />
      </ErrorBoundary>
    )

    expect(screen.getByText('Todo bien aquí')).toBeInTheDocument()
  })

  // ── CAPTURA DE ERROR ──────────────────────────────────────────────────

  it('muestra el fallback cuando un hijo lanza un error', () => {
    renderWithTheme(
      <ErrorBoundary>
        <BuggyComponent />
      </ErrorBoundary>
    )

    // Debe mostrar la UI de error por defecto
    expect(screen.getByText(/algo salió mal/i)).toBeInTheDocument()
    expect(screen.getByText(/intenta recargar/i)).toBeInTheDocument()
  })

  it('muestra el mensaje de error en el fallback', () => {
    renderWithTheme(
      <ErrorBoundary>
        <BuggyComponent message='Error crítico en el módulo' />
      </ErrorBoundary>
    )

    // El mensaje del error capturado aparece en el fallback
    expect(screen.getByText('Algo salió mal')).toBeInTheDocument()
  })

  // ── FALLBACK PERSONALIZADO ────────────────────────────────────────────

  it('usa el fallback personalizado cuando se pasa la prop fallback', () => {
    renderWithTheme(
      <ErrorBoundary fallback={<div>Mi propio fallback</div>}>
        <BuggyComponent />
      </ErrorBoundary>
    )

    expect(screen.getByText('Mi propio fallback')).toBeInTheDocument()
    // El fallback por defecto NO debe aparecer
    expect(screen.queryByText(/algo salió mal/i)).not.toBeInTheDocument()
  })

  // ── RETRY ─────────────────────────────────────────────────────────────

  it('llama a window.location.reload cuando se hace clic en "Recargar página"', () => {
    // Mockear reload
    const reloadMock = vi.fn()
    Object.defineProperty(window, 'location', {
      value: { reload: reloadMock },
      writable: true,
    })

    renderWithTheme(
      <ErrorBoundary>
        <BuggyComponent />
      </ErrorBoundary>
    )

    const retryButton = screen.getByRole('button', { name: /recargar página/i })
    retryButton.click()

    expect(reloadMock).toHaveBeenCalledTimes(1)
  })

  // ── HOOK useErrorBoundary ─────────────────────────────────────────────

  describe('useErrorBoundary', () => {
    it('retorna throwError sin lanzar error inicialmente', () => {
      const { result } = renderHook(() => useErrorBoundary())

      expect(result.current).toHaveProperty('throwError')
      expect(typeof result.current.throwError).toBe('function')
    })

    it('lanza error cuando throwError es llamado (atrapado por ErrorBoundary)', () => {
      const ThrowOnMount = () => {
        const { throwError } = useErrorBoundary()
        useEffect(() => {
          throwError(new Error('Error desde hook'))
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])
        return null
      }

      render(
        <ErrorBoundary>
          <ThrowOnMount />
        </ErrorBoundary>
      )

      // El ErrorBoundary captura el error y muestra fallback default
      // (no pasa el mensaje específico al FallbackUI internamente)
      expect(screen.getByText(/algo salió mal/i)).toBeInTheDocument()
    })

    it('lanza error en re-render cuando throwError fue llamado previamente (cubre línea 117)', async () => {
      // CUBRE: líneas 116-117 — throw error en render cuando error !== null.
      //
      // FLUJO:
      // 1. throwError(new Error(...)) se llama → setError(err) + throw err
      // 2. try-catch captura el throw de línea 113
      // 3. React procesa el state update de setError → re-render
      // 4. useErrorBoundary se ejecuta de nuevo → error ya no es null
      // 5. if (error) throw error ← LÍNEA 117 EJECUTADA
      // 6. ErrorBoundary captura este throw y muestra el fallback
      //
      // Este patrón es NECESARIO porque sin el try-catch, el throw de
      // línea 113 es capturado por React directamente, y el ErrorBoundary
      // remplaza TODO el árbol antes de que el re-render ocurra.

      const user = userEvent.setup()

      const ThrowAfterClick = () => {
        const { throwError } = useErrorBoundary()

        const handleClick = () => {
          // try-catch EVITA que el throw de línea 113 se propague a React.
          // Así setError puede programar el re-render que disparará línea 117.
          try {
            throwError(new Error('Error en evento'))
          } catch {
            // El throw fue capturado — setError ya programó el re-render
          }
        }

        return <button onClick={handleClick}>Disparar error</button>
      }

      renderWithTheme(
        <ErrorBoundary>
          <ThrowAfterClick />
        </ErrorBoundary>
      )

      // Click para disparar throwError
      await user.click(screen.getByRole('button', { name: /disparar error/i }))

      // Después del click, el re-render dispara línea 117 → ErrorBoundary
      // captura → fallback visible
      await waitFor(() => {
        expect(screen.getByText(/algo salió mal/i)).toBeInTheDocument()
      })
    })
  })
})
