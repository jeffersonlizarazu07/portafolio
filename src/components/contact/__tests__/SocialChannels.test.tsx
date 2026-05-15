/**
 * Tests de SocialChannels
 *
 * Renderiza cards de LinkedIn y GitHub con links externos.
 * Necesita MUI ThemeProvider + config mockeada.
 */
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme } from '@/test/test-utils'

// Mockear config con URLs de prueba
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

import { SocialChannels } from '../SocialChannels'

describe('SocialChannels', () => {
  it('muestra "Canales de contacto"', () => {
    renderWithTheme(<SocialChannels />)

    expect(screen.getByText(/canales de contacto/i)).toBeInTheDocument()
  })

  it('muestra los nombres de las redes sociales', () => {
    renderWithTheme(<SocialChannels />)

    expect(screen.getByText('LinkedIn')).toBeInTheDocument()
    expect(screen.getByText('GitHub')).toBeInTheDocument()
  })

  it('los links abren en nueva pestaña', () => {
    renderWithTheme(<SocialChannels />)

    const links = screen.getAllByRole('link')
    links.forEach(link => {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', 'noopener noreferrer')
    })
  })

  it('los links apuntan a las URLs correctas', () => {
    renderWithTheme(<SocialChannels />)

    expect(screen.getByRole('link', { name: /linkedin/i })).toHaveAttribute(
      'href',
      'https://linkedin.com/in/test'
    )
    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
      'href',
      'https://github.com/test'
    )
  })
})
