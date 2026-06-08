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
import { renderWithRouter } from '@/test/test-utils'
import { MemoryRouter } from 'react-router-dom'
import { ContactForm } from '@/components/contact/ContactForm'

// Mock para fetch global (ContactForm.sendContactEmail)
const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ message: 'OK' }) })
global.fetch = fetchMock

// Mock para config (ContactForm + SocialChannels)
vi.mock('@/config', () => ({
  config: {
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
  renderWithRouter(<ContactPage ContactFormComponent={ContactForm} />, {
    initialEntries: ['/contact'],
  })
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
