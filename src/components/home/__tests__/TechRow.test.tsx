/**
 * Tests de TechRow
 *
 * Componente simple que renderiza nombres de tecnologías.
 * Solo necesita MUI ThemeProvider (sin Router, sin Context).
 */
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme } from '@/test/test-utils'
import { TechRow } from '../TechRow'

describe('TechRow', () => {
  it('renderiza todas las tecnologías', () => {
    renderWithTheme(<TechRow />)

    expect(screen.getByText('REACT')).toBeInTheDocument()
    expect(screen.getByText('EXPRESS')).toBeInTheDocument()
    expect(screen.getByText('JAVA')).toBeInTheDocument()
    expect(screen.getByText('VITE')).toBeInTheDocument()
    expect(screen.getByText('TAILWIND')).toBeInTheDocument()
    expect(screen.getByText('VERCEL')).toBeInTheDocument()
  })
})
