/**
 * Tests de useDeploymentNavigation — hook de navegación a deployments.
 *
 * NO depende de contextos — se testea sin wrapper.
 * Verifica:
 *   - Estado inicial
 *   - Navegación con URL (window.open)
 *   - Notificación sin URL
 *   - Cierre de notificación
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useDeploymentNavigation } from '../useDeploymentNavigation'

// ── TESTS ──────────────────────────────────────────────────────────────

describe('useDeploymentNavigation', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('inicia con openNotification = false', () => {
    const { result } = renderHook(() => useDeploymentNavigation())

    expect(result.current.openNotification).toBe(false)
  })

  describe('handleCardClick', () => {
    it('abre ventana con la URL cuando existe', () => {
      const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
      const { result } = renderHook(() => useDeploymentNavigation())

      act(() => {
        result.current.handleCardClick('https://midemo.com')
      })

      expect(openSpy).toHaveBeenCalledWith('https://midemo.com', '_blank', 'noopener,noreferrer')
      expect(result.current.openNotification).toBe(false)
    })

    it('activa la notificacion cuando la URL es null', () => {
      const { result } = renderHook(() => useDeploymentNavigation())

      act(() => {
        result.current.handleCardClick(null)
      })

      expect(result.current.openNotification).toBe(true)
    })

    it('activa la notificacion cuando la URL es undefined', () => {
      const { result } = renderHook(() => useDeploymentNavigation())

      act(() => {
        result.current.handleCardClick(undefined)
      })

      expect(result.current.openNotification).toBe(true)
    })

    it('NO abre ventana cuando la URL es null', () => {
      const openSpy = vi.spyOn(window, 'open')
      const { result } = renderHook(() => useDeploymentNavigation())

      act(() => {
        result.current.handleCardClick(null)
      })

      expect(openSpy).not.toHaveBeenCalled()
    })
  })

  describe('closeNotification', () => {
    it('desactiva la notificacion', () => {
      const { result } = renderHook(() => useDeploymentNavigation())

      // Primero activamos
      act(() => {
        result.current.handleCardClick(null)
      })
      expect(result.current.openNotification).toBe(true)

      // Luego cerramos
      act(() => {
        result.current.closeNotification()
      })
      expect(result.current.openNotification).toBe(false)
    })
  })
})
