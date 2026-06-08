/**
 * Tests de BusinessHeader — componente presentacional puro.
 *
 * No necesita Router ni ThemeContext providers porque solo usa MUI Box/Typography.
 * renderWithTheme es suficiente.
 */
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme } from '@/test/test-utils'
import { BusinessHeader } from '../BusinessHeader'

describe('BusinessHeader', () => {
  it('renderiza el badge B2B', () => {
    renderWithTheme(<BusinessHeader />)

    expect(screen.getByText(/b2b/i)).toBeInTheDocument()
  })

  it('renderiza el título principal', () => {
    renderWithTheme(<BusinessHeader />)

    expect(screen.getByRole('heading', { name: /soluciones a la medida/i })).toBeInTheDocument()
  })

  it('renderiza el subtítulo de propuesta de valor', () => {
    renderWithTheme(<BusinessHeader />)

    expect(screen.getByText(/comienza con un prototipo funcional/i)).toBeInTheDocument()
  })
})
