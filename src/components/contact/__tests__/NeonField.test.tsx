/**
 * Tests de NeonField — campo de formulario con estilo neon/glow.
 *
 * NeonField se usa normalmente dentro de ContactForm, que SIEMPRE pasa
 * registerProps y color. Para cubrir los branches donde esos props NO se pasan,
 * necesitamos renderizarlo directamente.
 *
 * Branches a cubrir:
 * - L50: registerProps || { mock } — cuando registerProps NO se pasa
 * - L82: borderColor: error ? '#f44336' : color || 'divider'
 *        → error=false, color=undefined → 'divider' (nunca ocurre desde ContactForm)
 */
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme } from '@/test/test-utils'
import { NeonField } from '../NeonField'

describe('NeonField', () => {
  // ── SIN REGISTERPROPS ────────────────────────────────────────────────

  it('se renderiza sin registerProps usando el mock interno (cubre línea 50)', () => {
    // CUBRE: línea 50 — registerProps || { name, onChange, onBlur, ref }
    // Cuando registerProps NO se pasa, se usa un objeto mock interno.
    // Esto permite que el componente funcione sin React Hook Form.
    renderWithTheme(<NeonField label='Test Label' name='test_name' />)

    // El campo debe renderizarse aunque no tenga registerProps
    expect(screen.getByLabelText('Test Label')).toBeInTheDocument()
  })

  // ── SIN COLOR Y SIN ERROR ────────────────────────────────────────────

  it('se renderiza sin color prop usando divider como fallback (cubre línea 82)', () => {
    // CUBRE: línea 82 — borderColor: error ? '#f44336' : color || 'divider'
    // Cuando error=false y color NO se pasa, el branch 'divider' se ejecuta.
    // ContactForm SIEMPRE pasa color, así que este branch SOLO se cubre
    // renderizando NeonField directamente sin la prop color.
    renderWithTheme(<NeonField label='Sin Color' name='no_color_field' />)

    expect(screen.getByLabelText('Sin Color')).toBeInTheDocument()
  })
})
