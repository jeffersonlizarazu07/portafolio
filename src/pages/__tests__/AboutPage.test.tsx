/**
 * Tests de AboutPage
 *
 * Renderiza AboutSection + TechSection.
 * AboutSection necesita: MemoryRouter (Link), @/config (CV url).
 * TechSection es puramente presentacional.
 */
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '@/test/test-utils'

// Mock para config (AboutSection usa config.cv.url)
vi.mock('@/config', () => ({
  config: {
    cv: { url: 'https://example.com/cv.pdf' },
    social: {
      linkedin: 'https://linkedin.com/in/test',
      github: 'https://github.com/test',
    },
    github: { username: '' },
    email: { publicKey: '', serviceId: '', templateId: '' },
    spamProtection: { minSubmitTime: 0 },
    portfolio: { title: '', description: '' },
  },
}))

import { AboutPage } from '../AboutPage'

describe('AboutPage', () => {
  it('renderiza el chip "About me"', () => {
    renderWithRouter(<AboutPage />)

    expect(screen.getByText('About me')).toBeInTheDocument()
  })

  it('renderiza el título de desarrollador', () => {
    renderWithRouter(<AboutPage />)

    expect(
      screen.getByRole('heading', {
        name: /desarrollador de software enfocado en crear experiencias web/i,
      })
    ).toBeInTheDocument()
  })

  it('renderiza TechSection con el título "Mi Ecosistema"', () => {
    renderWithRouter(<AboutPage />)

    // "Mi Ecosistema" es único de TechSection (no aparece en AboutSection)
    expect(screen.getByRole('heading', { name: /mi ecosistema/i })).toBeInTheDocument()
  })

  it('tiene enlace de descarga de HV y contacto', () => {
    renderWithRouter(<AboutPage />)

    expect(screen.getByRole('link', { name: /descargar hv/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /contacto/i })).toBeInTheDocument()
  })
})
