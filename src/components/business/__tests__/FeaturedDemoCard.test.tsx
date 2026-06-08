/**
 * Tests de FeaturedDemoCard — componente presentacional con datos mock.
 *
 * Necesita:
 * - MemoryRouter (usa Link de react-router-dom para "Cotizar")
 * - Config mockeada (usa config.business.catalogDemoUrl)
 *
 * Patrón: render con datos controlados, verificar salida.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '@/test/test-utils'
import { FeaturedDemoCard } from '../FeaturedDemoCard'
import type { BusinessSolution } from '@/types/Business'
import DashboardIcon from '@mui/icons-material/Dashboard'

// Mock de config para catalogDemoUrl
vi.mock('@/config', () => ({
  config: {
    business: { catalogDemoUrl: 'https://demo-test.vercel.app' },
    social: { github: '', linkedin: '', email: '' },
    cv: { url: '' },
    portfolio: { title: '', description: '' },
    github: { username: '' },
    spamProtection: { minSubmitTime: 0 },
  },
}))

const mockSolution: BusinessSolution = {
  id: 'test-solution',
  title: 'Catálogo Test',
  subtitle: 'Subtítulo de prueba',
  problemDescription: 'Problema de ejemplo que resuelve esta solución.',
  solutionDescription: 'Solución de ejemplo con valor para el negocio.',
  businessValue: 'Valor comercial de prueba.',
  metrics: [
    { label: 'Rendimiento', value: '< 1s' },
    { label: 'Conversión', value: 'Directa' },
  ],
  techReasoning: [
    { name: 'React', reason: 'App ultrarrápida' },
    { name: 'TypeScript', reason: 'Código robusto' },
  ],
  contactPreFill: 'Hola, quiero saber más sobre Catálogo Test.',
  isFeatured: true,
  status: 'ready',
  expansionModules: [
    {
      id: 'admin-panel',
      title: 'Panel Admin',
      description: 'Gestiona productos',
      Icon: DashboardIcon,
      isAvailable: true,
    },
  ],
}

describe('FeaturedDemoCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renderiza el título y subtítulo de la solución', () => {
    renderWithRouter(<FeaturedDemoCard solution={mockSolution} />)

    expect(screen.getByText('Catálogo Test')).toBeInTheDocument()
    expect(screen.getByText('Subtítulo de prueba')).toBeInTheDocument()
  })

  it('renderiza las métricas de negocio', () => {
    renderWithRouter(<FeaturedDemoCard solution={mockSolution} />)

    expect(screen.getByText('< 1s')).toBeInTheDocument()
    expect(screen.getByText('Rendimiento')).toBeInTheDocument()
    expect(screen.getByText('Directa')).toBeInTheDocument()
    expect(screen.getByText('Conversión')).toBeInTheDocument()
  })

  it('renderiza la propuesta de valor', () => {
    renderWithRouter(<FeaturedDemoCard solution={mockSolution} />)

    expect(screen.getByText('Valor comercial de prueba.')).toBeInTheDocument()
  })

  it('renderiza la descripción del problema y la solución', () => {
    renderWithRouter(<FeaturedDemoCard solution={mockSolution} />)

    expect(screen.getByText(/problema de ejemplo/i)).toBeInTheDocument()
    expect(screen.getByText(/solución de ejemplo/i)).toBeInTheDocument()
  })

  it('renderiza los tech reasoning items', () => {
    renderWithRouter(<FeaturedDemoCard solution={mockSolution} />)

    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('App ultrarrápida')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('Código robusto')).toBeInTheDocument()
  })

  it('renderiza el botón "Probar Demo" con la URL del config', () => {
    renderWithRouter(<FeaturedDemoCard solution={mockSolution} />)

    const demoBtn = screen.getByRole('link', { name: /probar demo/i })
    expect(demoBtn).toBeInTheDocument()
    expect(demoBtn).toHaveAttribute('href', 'https://demo-test.vercel.app')
  })

  it('renderiza el botón "Cotizar / Personalizar" apuntando a contacto', () => {
    renderWithRouter(<FeaturedDemoCard solution={mockSolution} />)

    const cotizarBtn = screen.getByRole('link', { name: /cotizar/i })
    expect(cotizarBtn).toBeInTheDocument()
    // Debe redirigir a /contact con el mensaje pre-rellenado
    expect(cotizarBtn).toHaveAttribute('href', expect.stringContaining('/contact'))
    expect(cotizarBtn).toHaveAttribute(
      'href',
      expect.stringContaining(encodeURIComponent(mockSolution.contactPreFill))
    )
  })
})
