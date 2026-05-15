/**
 * Tests de ContactItem
 *
 * Componente simple que recibe icon, title y value por props.
 * Solo necesita MUI ThemeProvider.
 */
import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme } from '@/test/test-utils'
import { ContactItem } from '../ContactItem'
import EmailIcon from '@mui/icons-material/Email'

describe('ContactItem', () => {
  it('renderiza el título y el valor', () => {
    renderWithTheme(
      <ContactItem
        icon={<EmailIcon data-testid='icon' />}
        title='Correo electrónico'
        value='test@email.com'
      />
    )

    expect(screen.getByText('Correo electrónico')).toBeInTheDocument()
    expect(screen.getByText('test@email.com')).toBeInTheDocument()
  })

  it('renderiza nodes React como value', () => {
    renderWithTheme(
      <ContactItem
        icon={<EmailIcon data-testid='icon' />}
        title='Links'
        value={<a href='/test'>Link personalizado</a>}
      />
    )

    expect(screen.getByText('Link personalizado')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /link personalizado/i })).toHaveAttribute(
      'href',
      '/test'
    )
  })
})
