/**
 * Tests de BusinessSolutionsPage — página completa de "Soluciones para Negocio".
 *
 * La página usa datos estáticos (businessSolutions), no hooks.
 * Verificamos que renderice:
 * - El header con propuesta de valor
 * - La solución destacada (Catálogo Digital)
 * - Los módulos de expansión
 * - La sección de soluciones bajo demanda
 *
 * Necesita:
 * - Config mockeada (para catalogDemoUrl en FeaturedDemoCard)
 * - ThemeProvider (para AnimatedSection con useInView)
 * - MemoryRouter (para Links internos)
 */
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '@/test/test-utils'
import { ThemeProvider } from '@/context/ThemeContext'
import { BusinessSolutionsPage } from '../BusinessSolutionsPage'

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

describe('BusinessSolutionsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()
    window.matchMedia = vi.fn().mockImplementation(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
  })

  const renderPage = () =>
    renderWithRouter(
      <ThemeProvider>
        <BusinessSolutionsPage />
      </ThemeProvider>
    )

  it('renderiza el header con el título principal', () => {
    renderPage()

    expect(screen.getByRole('heading', { name: /soluciones a la medida/i })).toBeInTheDocument()
  })

  it('renderiza la solución destacada (Catálogo Digital)', () => {
    renderPage()

    expect(screen.getByText('Catálogo Digital con Pedidos a WhatsApp')).toBeInTheDocument()

    // Subtítulo
    expect(
      screen.getByText(/muestra tus productos y recibe pedidos al instante/i)
    ).toBeInTheDocument()
  })

  it('renderiza las métricas de la solución destacada', () => {
    renderPage()

    expect(screen.getByText('< 1.5s')).toBeInTheDocument()
    expect(screen.getByText('100% Móvil')).toBeInTheDocument()
    expect(screen.getByText('1 Click a WhatsApp')).toBeInTheDocument()
    expect(screen.getByText('Sin servidor')).toBeInTheDocument()
  })

  it('renderiza los módulos de expansión', () => {
    renderPage()

    expect(screen.getByText('Expansiones Personalizables')).toBeInTheDocument()
    expect(screen.getByText('Panel de Administración')).toBeInTheDocument()
    expect(screen.getByText('Pasarela de Pagos')).toBeInTheDocument()
  })

  it('renderiza los CTAs de demo y cotización', () => {
    renderPage()

    const demoBtn = screen.getByRole('link', { name: /probar demo/i })
    expect(demoBtn).toBeInTheDocument()
    expect(demoBtn).toHaveAttribute('href', 'https://demo-test.vercel.app')

    expect(screen.getByRole('link', { name: /cotizar/i })).toBeInTheDocument()
  })

  it('renderiza la sección de soluciones bajo demanda con sus títulos', () => {
    renderPage()

    expect(screen.getByText(/en desarrollo/i)).toBeInTheDocument()
    expect(screen.getByText('Tienda Online Completa')).toBeInTheDocument()
    expect(screen.getByText('Panel Administrativo')).toBeInTheDocument()
  })
})
