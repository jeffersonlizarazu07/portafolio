/**
 * Tests de ExpansionModules — grid de módulos de expansión.
 *
 * Cubre:
 * - Renderizado de módulos disponibles y no disponibles
 * - Estado "Próximamente" en módulos no disponibles
 * - CTA habilitado/deshabilitado según disponibilidad
 * - Empty state (modules vacío retorna null)
 */
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithRouter } from '@/test/test-utils'
import { ExpansionModules } from '../ExpansionModules'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PaymentsIcon from '@mui/icons-material/Payments'
import type { ExpansionModule } from '@/types/Business'

const mockModules: ExpansionModule[] = [
  {
    id: 'admin-panel',
    title: 'Panel Admin',
    description: 'Gestiona tus productos y precios.',
    Icon: DashboardIcon,
    isAvailable: true,
  },
  {
    id: 'payments',
    title: 'Pasarela de Pagos',
    description: 'Recibe pagos con tarjeta.',
    Icon: PaymentsIcon,
    isAvailable: false,
  },
]

describe('ExpansionModules', () => {
  it('renderiza el encabezado de la sección', () => {
    renderWithRouter(<ExpansionModules modules={mockModules} />)

    expect(screen.getByText('Expansiones Personalizables')).toBeInTheDocument()
  })

  it('renderiza todos los módulos', () => {
    renderWithRouter(<ExpansionModules modules={mockModules} />)

    expect(screen.getByText('Panel Admin')).toBeInTheDocument()
    expect(screen.getByText('Pasarela de Pagos')).toBeInTheDocument()
  })

  it('renderiza la descripción de cada módulo', () => {
    renderWithRouter(<ExpansionModules modules={mockModules} />)

    expect(screen.getByText('Gestiona tus productos y precios.')).toBeInTheDocument()
    expect(screen.getByText('Recibe pagos con tarjeta.')).toBeInTheDocument()
  })

  it('muestra el badge "Próximamente" solo en módulos no disponibles', () => {
    renderWithRouter(<ExpansionModules modules={mockModules} />)

    const proximamente = screen.getAllByText('Próximamente')
    expect(proximamente).toHaveLength(1)
  })

  it('el CTA del módulo disponible está habilitado (sin aria-disabled)', () => {
    renderWithRouter(<ExpansionModules modules={mockModules} />)

    const ctaDisponible = screen.getByRole('link', { name: /solicitar este módulo/i })
    expect(ctaDisponible).not.toHaveAttribute('aria-disabled')
  })

  it('el CTA del módulo no disponible tiene aria-disabled="true"', () => {
    renderWithRouter(<ExpansionModules modules={mockModules} />)

    const ctaNoDisponible = screen.getByRole('link', {
      name: /disponible próximamente/i,
    })
    expect(ctaNoDisponible).toHaveAttribute('aria-disabled', 'true')
  })

  it('retorna null cuando modules está vacío', () => {
    const { container } = renderWithRouter(<ExpansionModules modules={[]} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('incluye el mensaje preFill en el link de contacto', () => {
    const preFill = 'Mensaje de prueba'

    renderWithRouter(<ExpansionModules modules={mockModules} preFillMessage={preFill} />)

    const cta = screen.getByRole('link', { name: /solicitar este módulo/i })
    expect(cta).toHaveAttribute('href', expect.stringContaining(encodeURIComponent(preFill)))
  })
})
