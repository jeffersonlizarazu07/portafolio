/**
 * Tests de ContactPage — composición de ContactForm + ContactSidebar.
 *
 * ContactForm se testea aisladamente en ContactForm.test.tsx.
 * Aquí solo verificamos que la página renderiza ambos sub-componentes.
 *
 * NOTA: ContactPage acepta un prop `ContactFormComponent` para inyectar
 * el componente directamente en lugar de usar React.lazy + Suspense,
 * que no resuelve correctamente en jsdom. Ver ContactPage.tsx.
 */
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme } from '@/test/test-utils'
import { ContactForm } from '@/components/contact/ContactForm'

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

/** Helper: renderiza ContactPage con ContactForm inyectado (sin lazy) */
const renderContactPage = () => {
  renderWithTheme(<ContactPage ContactFormComponent={ContactForm} />)
}

describe('ContactPage', () => {
  it('renderiza el encabezado del formulario', () => {
    renderContactPage()

    expect(
      screen.getByRole('heading', { name: /vamos a construir algo extraordinario/i })
    ).toBeInTheDocument()
  })

  it('renderiza los campos del formulario', () => {
    renderContactPage()

    const messageLabels = screen.getAllByText(/cuéntame sobre tu proyecto/i)
    expect(messageLabels.length).toBeGreaterThanOrEqual(1)
  })

  it('renderiza la sección de canales de contacto', () => {
    renderContactPage()

    expect(screen.getByText(/canales de contacto/i)).toBeInTheDocument()
  })

  it('renderiza el botón de envío', () => {
    renderContactPage()

    expect(screen.getByRole('button', { name: /enviar mensaje/i })).toBeInTheDocument()
  })
})
