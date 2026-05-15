/**
 * Tests de ContactPage
 *
 * Renderiza ContactForm + ContactSidebar.
 * ContactForm necesita: @/config (email), @emailjs/browser (send).
 * ContactSidebar necesita: @/config (social urls).
 */
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme } from '@/test/test-utils'

// Mock para emailjs (ContactForm.send)
vi.mock('@emailjs/browser', () => ({
  default: {
    send: vi.fn().mockResolvedValue({ status: 200, text: 'OK' }),
  },
}))

// Mock para config (ContactForm + SocialChannels)
vi.mock('@/config', () => ({
  config: {
    email: {
      publicKey: 'test-key',
      serviceId: 'test-service',
      templateId: 'test-template',
    },
    spamProtection: { minSubmitTime: 0 },
    social: {
      linkedin: 'https://linkedin.com/in/test',
      github: 'https://github.com/test',
    },
    github: { username: '' },
    cv: { url: '' },
    portfolio: { title: '', description: '' },
  },
}))

import { ContactPage } from '../ContactPage'

describe('ContactPage', () => {
  it('renderiza el encabezado del formulario', () => {
    renderWithTheme(<ContactPage />)

    // ContactHeader muestra "Vamos a construir algo extraordinario"
    expect(
      screen.getByRole('heading', { name: /vamos a construir algo extraordinario/i })
    ).toBeInTheDocument()
  })

  it('renderiza los campos del formulario', () => {
    renderWithTheme(<ContactPage />)

    // Label aparece también en <legend>, usamos getAllByText
    const messageLabels = screen.getAllByText(/cuéntame sobre tu proyecto/i)
    expect(messageLabels.length).toBeGreaterThanOrEqual(1)
  })

  it('renderiza la sección de canales de contacto', () => {
    renderWithTheme(<ContactPage />)

    expect(screen.getByText(/canales de contacto/i)).toBeInTheDocument()
  })

  it('renderiza el botón de envío', () => {
    renderWithTheme(<ContactPage />)

    expect(screen.getByRole('button', { name: /enviar mensaje/i })).toBeInTheDocument()
  })
})
