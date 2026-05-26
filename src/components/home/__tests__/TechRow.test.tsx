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

    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('Express')).toBeInTheDocument()
    expect(screen.getByText('Java')).toBeInTheDocument()
    expect(screen.getByText('Vite')).toBeInTheDocument()
    expect(screen.getByText('Tailwind CSS')).toBeInTheDocument()
    expect(screen.getByText('Vercel')).toBeInTheDocument()
  })
})
