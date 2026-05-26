/**
 * Tests de ContactForm — formulario con validación y envío
 *
 * Conceptos NUEVOS:
 *
 * 1. `vi.mock()` — mockea un módulo COMPLETO. Cada vez que cualquier archivo
 *    importe de ese módulo, recibe nuestra versión falsa.
 *
 * 2. `userEvent.setup()` — crea un "usuario virtual". Todas las interacciones
 *    (type, click) son ASÍNCRONAS y simulan comportamiento real.
 *
 * 3. `getByLabelText()` — busca un input por su etiqueta <label>.
 *    Es la forma MÁS ROBUSTA para encontrar campos de formulario.
 *
 * 4. ¿Por qué userEvent y NO fireEvent?
 *    fireEvent.change(input, {target: {value: 'x'}}) → simula UN evento
 *    user.type(input, 'x') → simula focus + keydown + keypress + input +
 *                                   keyup + blur (el ciclo REAL de escritura)
 */
import { describe, it, expect, vi } from 'vitest'
import { screen, waitFor, fireEvent, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { renderWithTheme } from '@/test/test-utils'
import { ContactForm } from '../ContactForm'

// ── MOCKS ──────────────────────────────────────────────────────────────

// Mockear fetch global para no enviar requests reales a /api/contact
const fetchMock = vi.fn()
global.fetch = fetchMock

// Mockear config con spam protection desactivada (minSubmitTime = 0)
// para no tener que esperar 5 segundos en cada test
vi.mock('@/config', () => ({
  config: {
    spamProtection: { minSubmitTime: 0 },
    social: { github: '', linkedin: '', email: '' },
    github: { username: '' },
    cv: { url: '' },
    portfolio: { title: '', description: '' },
  },
}))

// ── TESTS ──────────────────────────────────────────────────────────────

describe('ContactForm', () => {
  // Resetear mock de fetch antes de cada test
  beforeEach(() => {
    fetchMock.mockReset()
    fetchMock.mockResolvedValue({ ok: true, json: async () => ({ message: 'OK' }) })
  })
  // ── RENDERIZADO ───────────────────────────────────────────────────────

  it('renderiza el encabezado del formulario', () => {
    renderWithTheme(<ContactForm />)

    expect(screen.getByText(/contacto/i)).toBeInTheDocument()
    expect(screen.getByText(/extraordinario/i)).toBeInTheDocument()
  })

  it('renderiza todos los campos del formulario', () => {
    renderWithTheme(<ContactForm />)

    expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/asunto/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/cuéntame sobre tu proyecto/i)).toBeInTheDocument()
  })

  it('renderiza el botón de enviar', () => {
    renderWithTheme(<ContactForm />)

    expect(screen.getByRole('button', { name: /enviar mensaje/i })).toBeInTheDocument()
  })

  // ── VALIDACIÓN ────────────────────────────────────────────────────────

  it('muestra errores de validación al enviar el formulario vacío', async () => {
    // Arrange: crear usuario virtual y renderizar
    const user = userEvent.setup()
    renderWithTheme(<ContactForm />)

    // Act: hacer clic en enviar sin llenar campos
    await user.click(screen.getByRole('button', { name: /enviar mensaje/i }))

    // Assert: deben aparecer los mensajes de error
    await waitFor(() => {
      expect(screen.getByText(/el nombre es requerido/i)).toBeInTheDocument()
      expect(screen.getByText(/el correo electrónico es requerido/i)).toBeInTheDocument()
      expect(screen.getByText(/el asunto es requerido/i)).toBeInTheDocument()
      expect(screen.getByText(/el mensaje es requerido/i)).toBeInTheDocument()
    })
  })

  it('muestra error para correo electrónico inválido', async () => {
    const user = userEvent.setup()
    renderWithTheme(<ContactForm />)

    // Escribir email inválido
    const emailInput = screen.getByLabelText(/correo electrónico/i)
    await user.type(emailInput, 'email-invalido')

    // Enviar
    await user.click(screen.getByRole('button', { name: /enviar mensaje/i }))

    await waitFor(() => {
      expect(screen.getByText(/ingresa un correo electrónico válido/i)).toBeInTheDocument()
    })
  })

  it('muestra error si el asunto tiene menos de 5 caracteres', async () => {
    const user = userEvent.setup()
    renderWithTheme(<ContactForm />)

    await user.type(screen.getByLabelText(/asunto/i), 'Hola')

    await user.click(screen.getByRole('button', { name: /enviar mensaje/i }))

    await waitFor(() => {
      expect(screen.getByText(/el asunto debe tener al menos 5 caracteres/i)).toBeInTheDocument()
    })
  })

  // ── ENVÍO EXITOSO ─────────────────────────────────────────────────────

  it('envía el formulario exitosamente y muestra notificación', async () => {
    const user = userEvent.setup()
    renderWithTheme(<ContactForm />)

    // Llenar todos los campos con datos válidos
    await user.type(screen.getByLabelText(/nombre/i), 'Jefferson')
    await user.type(screen.getByLabelText(/correo electrónico/i), 'test@email.com')
    await user.type(screen.getByLabelText(/asunto/i), 'Hola, quería contactarte')
    await user.type(
      screen.getByLabelText(/cuéntame sobre tu proyecto/i),
      'Tengo un proyecto interesante para mostrarte'
    )

    // Enviar
    await user.click(screen.getByRole('button', { name: /enviar mensaje/i }))

    // Debe mostrar el snackbar de éxito
    await waitFor(() => {
      expect(screen.getByText(/mensaje enviado exitosamente/i)).toBeInTheDocument()
    })
  }, 15000)

  // ── ERROR DE ENVÍO ──────────────────────────────────────────────────

  // ── SPAM: HONEYPOT ──────────────────────────────────────────────────

  it('NO envía el formulario cuando el honeypot tiene contenido (validateSubmission lo detecta)', async () => {
    // CUBRE: validateSubmission detecta hp_field con contenido
    // y retorna false sin llamar a la API.
    //
    // ANTES: Zod tenía z.string().max(0) y bloqueaba antes de validateSubmission.
    // AHORA: Zod usa .optional() y DELEGA la validación a validateSubmission.
    // Esto es CORRECTO porque la lógica anti-span debe estar UNIFICADA en
    // validateSubmission, no dividida entre Zod y una función.
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    // skipPointerEventsCheck: 0 permite interactuar con elementos ocultos
    const user = userEvent.setup({ pointerEventsCheck: 0 })
    renderWithTheme(<ContactForm />)

    // Llenar campos válidos (userEvent.type dispara onFocus → hasInteracted = true)
    await user.type(screen.getByLabelText(/nombre/i), 'Jefferson')
    await user.type(screen.getByLabelText(/correo electrónico/i), 'test@email.com')
    await user.type(screen.getByLabelText(/asunto/i), 'Hola, quería contactarte')
    await user.type(
      screen.getByLabelText(/cuéntame sobre tu proyecto/i),
      'Tengo un proyecto interesante'
    )

    // Encontrar el campo honeypot oculto (autoComplete='off')
    const hpInput = document.querySelector('input[autocomplete="off"]') as HTMLInputElement
    expect(hpInput).not.toBeNull()

    // Escribir en el honeypot (userEvent.type respeta el onChange de RHF)
    await user.type(hpInput, 'spam_bot_content')

    // Enviar
    await user.click(screen.getByRole('button', { name: /enviar mensaje/i }))

    // validateSubmission detecta el honeypot → warn + retorna false
    // → onSubmit NO ejecuta fetch a /api/contact
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Spam detectado: honeypot activado')
    })
    expect(fetchMock).not.toHaveBeenCalled()

    consoleSpy.mockRestore()
  })

  // ── SPAM: SIN INTERACCIÓN ──────────────────────────────────────────

  it('muestra error de spam si no se interactuó con el formulario', async () => {
    // CUBRE: líneas 176-177 — if (!hasInteracted) → spamError
    // Usamos fireEvent.change para llenar campos SIN disparar onFocus.
    renderWithTheme(<ContactForm />)

    // Llenar campos SIN hacer focus (fireEvent.change no enfoca)
    fireEvent.change(screen.getByLabelText(/nombre/i), { target: { value: 'Jefferson' } })
    fireEvent.change(screen.getByLabelText(/correo electrónico/i), {
      target: { value: 'test@email.com' },
    })
    fireEvent.change(screen.getByLabelText(/asunto/i), {
      target: { value: 'Hola, quería contactarte' },
    })
    fireEvent.change(screen.getByLabelText(/cuéntame sobre tu proyecto/i), {
      target: { value: 'Tengo un proyecto interesante' },
    })

    // Click en enviar
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /enviar mensaje/i }))

    await waitFor(() => {
      expect(
        screen.getByText(/por favor, interactúa con el formulario antes de enviar/i)
      ).toBeInTheDocument()
    })
  })

  // ── SPAM: TIEMPO MÍNIMO ─────────────────────────────────────────────

  it('detecta envío demasiado rápido (spam de tiempo)', async () => {
    // CUBRE: líneas 171-172 — validación de tiempo mínimo
    // Configurar minSubmitTime alto para que el envío "rápido" falle.
    const configModule = await import('@/config')
    ;(
      configModule.config as { spamProtection: { minSubmitTime: number } }
    ).spamProtection.minSubmitTime = 9999

    const user = userEvent.setup()
    renderWithTheme(<ContactForm />)

    // Llenar campos (esto establece hasInteracted = true)
    await user.type(screen.getByLabelText(/nombre/i), 'Jefferson')
    await user.type(screen.getByLabelText(/correo electrónico/i), 'test@email.com')
    await user.type(screen.getByLabelText(/asunto/i), 'Hola, quería contactarte')
    await user.type(
      screen.getByLabelText(/cuéntame sobre tu proyecto/i),
      'Tengo un proyecto interesante'
    )

    // Enviar inmediatamente — el tiempo transcurrido es mucho menor a 9999s
    await user.click(screen.getByRole('button', { name: /enviar mensaje/i }))

    await waitFor(() => {
      expect(screen.getByText(/por favor, espera un momento antes de enviar/i)).toBeInTheDocument()
    })

    // Reset para no afectar otros tests
    ;(
      configModule.config as { spamProtection: { minSubmitTime: number } }
    ).spamProtection.minSubmitTime = 0
  })

  // ── SNACKBAR ONCLOSE ────────────────────────────────────────────────

  it('cierra el Snackbar al hacer clic en el botón de cerrar', async () => {
    // CUBRE: línea 273 — onClose={() => setOpenSnackbar(false)}
    const user = userEvent.setup()
    renderWithTheme(<ContactForm />)

    // Enviar formulario exitosamente
    await user.type(screen.getByLabelText(/nombre/i), 'Jefferson')
    await user.type(screen.getByLabelText(/correo electrónico/i), 'test@email.com')
    await user.type(screen.getByLabelText(/asunto/i), 'Hola, quería contactarte')
    await user.type(
      screen.getByLabelText(/cuéntame sobre tu proyecto/i),
      'Tengo un proyecto interesante'
    )

    await user.click(screen.getByRole('button', { name: /enviar mensaje/i }))

    // Esperar a que aparezca el Snackbar
    await waitFor(() => {
      expect(screen.getByText(/mensaje enviado exitosamente/i)).toBeInTheDocument()
    })

    // Cerrar el Snackbar (el Alert tiene un botón de cerrar cuando tiene onClose)
    const closeButton = screen.getByRole('button', { name: /close/i })
    await user.click(closeButton)

    // El Snackbar debería desaparecer
    await waitFor(() => {
      expect(screen.queryByText(/mensaje enviado exitosamente/i)).not.toBeInTheDocument()
    })
  }, 15000)

  it('NO muestra notificación si la API falla (catch block)', async () => {
    // Hacer que fetch rechace UNA VEZ (mockRejectedValueOnce)
    // Así no afecta otros tests en el mismo archivo
    fetchMock.mockRejectedValueOnce(new Error('API error'))

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

    const user = userEvent.setup()
    renderWithTheme(<ContactForm />)

    await user.type(screen.getByLabelText(/nombre/i), 'Jefferson')
    await user.type(screen.getByLabelText(/correo electrónico/i), 'test@email.com')
    await user.type(screen.getByLabelText(/asunto/i), 'Hola, quería contactarte')
    await user.type(
      screen.getByLabelText(/cuéntame sobre tu proyecto/i),
      'Tengo un proyecto interesante para mostrarte'
    )

    await user.click(screen.getByRole('button', { name: /enviar mensaje/i }))

    // El catch block loggea el error con console.error y NO muestra éxito
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(expect.any(Error))
    })
    expect(screen.queryByText(/mensaje enviado exitosamente/i)).not.toBeInTheDocument()

    consoleSpy.mockRestore()
  }, 15000)

  // ── MODO LIGHT ──────────────────────────────────────────────────────

  it('envía el formulario exitosamente en modo light (cubre línea 252)', async () => {
    // CUBRE: línea 252 — inputColor={theme.palette.mode === 'dark' ? '#ffffff' : '#000000'}
    // El branch false del ternary (mode='light' → '#000000') SOLO se cubre
    // renderizando con un ThemeProvider en light mode.
    //
    // renderWithTheme usa mode: 'dark' por defecto, así que necesitamos
    // un wrapper light mode manual para esta prueba.
    const lightTheme = createTheme({ palette: { mode: 'light' } })

    const user = userEvent.setup()
    render(
      <ThemeProvider theme={lightTheme}>
        <ContactForm />
      </ThemeProvider>
    )

    await user.type(screen.getByLabelText(/nombre/i), 'Jefferson')
    await user.type(screen.getByLabelText(/correo electrónico/i), 'test@email.com')
    await user.type(screen.getByLabelText(/asunto/i), 'Hola, quería contactarte')
    await user.type(
      screen.getByLabelText(/cuéntame sobre tu proyecto/i),
      'Tengo un proyecto interesante'
    )

    await user.click(screen.getByRole('button', { name: /enviar mensaje/i }))

    // Si el envío funciona en light mode, el ternary de línea 252 evaluó
    // '#000000' y el formulario pudo renderizarse correctamente.
    await waitFor(() => {
      expect(screen.getByText(/mensaje enviado exitosamente/i)).toBeInTheDocument()
    })
  })
})
