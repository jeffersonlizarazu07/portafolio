/**
 * Tests de HomePage
 *
 * Renderiza Hero + TechRow.
 * Hero necesita: MemoryRouter (Link as Router), @/config (SocialLinks).
 * TechRow es puramente presentacional.
 */
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '@/test/test-utils'

// Mock necesario para SocialLinks (usa config.social)
vi.mock('@/config', () => ({
  config: {
    social: {
      linkedin: 'https://linkedin.com/in/test',
      github: 'https://github.com/test',
    },
    github: { username: '' },
    email: { publicKey: '', serviceId: '', templateId: '' },
    spamProtection: { minSubmitTime: 0 },
    cv: { url: '' },
    portfolio: { title: '', description: '' },
  },
}))

import { HomePage } from '../HomePage'

describe('HomePage', () => {
  it('renderiza el Hero con el estado disponible', () => {
    renderWithRouter(<HomePage />)

    expect(screen.getByText('DISPONIBLE')).toBeInTheDocument()
  })

  it('renderiza el título principal', () => {
    renderWithRouter(<HomePage />)

    expect(screen.getByRole('heading', { name: /full stack developer/i })).toBeInTheDocument()
  })

  it('renderiza TechRow con tecnologías', () => {
    renderWithRouter(<HomePage />)

    expect(screen.getByText('REACT')).toBeInTheDocument()
    expect(screen.getByText('EXPRESS')).toBeInTheDocument()
  })

  it('tiene enlace a proyectos y contacto', () => {
    renderWithRouter(<HomePage />)

    expect(screen.getByRole('link', { name: /ver mis proyectos/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /contactarme/i })).toBeInTheDocument()
  })
})
