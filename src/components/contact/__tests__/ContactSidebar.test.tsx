/**
 * Tests de ContactSidebar
 *
 * Componente que combina DirectContact + SocialChannels.
 * Necesita MUI ThemeProvider + config mockeada (SocialChannels).
 */
import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme } from '@/test/test-utils'

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

import { ContactSidebar } from '../ContactSidebar'

describe('ContactSidebar', () => {
  it('renderiza la sección de contacto directo', () => {
    renderWithTheme(<ContactSidebar />)

    expect(screen.getByText(/contacto directo/i)).toBeInTheDocument()
  })

  it('renderiza la sección de canales de contacto', () => {
    renderWithTheme(<ContactSidebar />)

    expect(screen.getByText(/canales de contacto/i)).toBeInTheDocument()
  })

  it('muestra los emails de contacto', () => {
    renderWithTheme(<ContactSidebar />)

    expect(screen.getByText('jeffersonlizarazu@hotmail.com')).toBeInTheDocument()
  })
})
