/**
 * Formulario de contacto con validación robusta y protección anti-spam.
 * 
 * ¿Por qué usar React Hook Form + Zod?
 * - RHF maneja el estado del formulario y reduce re-renders.
 * - Zod proporciona validación declarativa y tipado automático.
 * - Juntos son el estándar actual para formularios en React.
 * 
 * ¿Por qué validación en el cliente si el backend podría validar?
 * - Feedback inmediato para el usuario (sin esperar round-trip).
 * - Reduce carga en el servidor.
 * - UX superior en formularios complejos.
 */
import { useState } from 'react'
import { useForm, UseFormRegister } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Box, Grid, Stack, Snackbar, Alert, Typography } from '@mui/material'
import { NeonField } from './NeonField'
import { GlassButton } from '../../ui/GlassButton'
import { ContactHeader } from './ContactHeader'
import { emailConfig, spamProtection } from '@/constants/emailConfig'
import emailjs from '@emailjs/browser'

/**
 * Schema de validación con Zod.
 * 
 * ¿Por qué múltiples .min() en cadena?
 * - .min(1) detecta si está vacío y muestra "requerido".
 * - .min(2) luego valida la longitud real.
 * - Esto permite mensajes de error específicos para cada caso.
 * 
 * ¿Por qué max() en todos los campos?
 * - Previene payloads enormes que podrían romper EmailJS.
 * - Límite de 500 caracteres en mensaje es suficiente para un email.
 */
const contactSchema = z.object({
  from_name: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  from_email: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('Ingresa un correo electrónico válido'),
  title: z
    .string()
    .min(1, 'El asunto es requerido')
    .min(5, 'El asunto debe tener al menos 5 caracteres')
    .max(100, 'El asunto no puede exceder 100 caracteres'),
  message: z
    .string()
    .min(1, 'El mensaje es requerido')
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(500, 'El mensaje no puede exceder 500 caracteres'),
  // Honeypot: campo oculto que los bots llenan y humanos no ven
  hp_field: z.string().max(0, 'Spam detectado'),
})

type ContactFormData = z.infer<typeof contactSchema>

/**
 * Configuración de campos del formulario.
 * 
 * ¿Por qué separar la config de los componentes?
 * - Fácil de agregar/modificar campos sin tocar JSX.
 * - Permite iterar sobre los campos en vez de escribir código repetitivo.
 * - Los estilos se mantienen consistentes (mismo color para todos los labels).
 */
const FORM_FIELDS: Array<{
  name: 'from_name' | 'from_email' | 'title' | 'message'
  label: string
  color: string
  type?: string
  multiline?: boolean
  rows?: number
}> = [
  { name: 'from_name', label: 'Nombre', color: '#94a3b8' },
  { name: 'from_email', label: 'Correo Electrónico', color: '#94a3b8', type: 'email' },
  { name: 'title', label: 'Asunto', color: '#94a3b8' },
  {
    name: 'message',
    label: 'Cuéntame sobre tu proyecto...',
    color: '#94a3b8',
    multiline: true,
    rows: 5,
  },
]

/**
 * Campo honeypot para detectar bots.
 * 
 * ¿Cómo funciona?
 * - Los bots scrapers ven todos los inputs y los llenan automáticamente.
 * - Los humanos no ven este campo (hidden, fuera de pantalla).
 * - Si hp_field tiene contenido, es un bot.
 * 
 * ¿Por qué estilizado con position: absolute y left: -9999px?
 * - Oculta el campo visualmente pero sigue siendo parte del DOM.
 * - Los bots no distinguen CSS de contenido visible.
 */
const HoneypotField = ({ register }: { register: UseFormRegister<ContactFormData> }) => {
  const hpRegister = register('hp_field')
  return (
    <Box
      component='input'
      type='text'
      onChange={hpRegister.onChange}
      onBlur={hpRegister.onBlur}
      ref={hpRegister.ref}
      sx={{
        position: 'absolute',
        left: '-9999px',
        opacity: 0,
        pointerEvents: 'none',
      }}
      tabIndex={-1}
      autoComplete='off'
    />
  )
}

/**
 * Notificación de éxito al enviar mensaje.
 * 
 * ¿Por qué Snackbar en lugar de Alert/Toast inline?
 * - No interrumpe el flujo del formulario.
 * - Desaparece automáticamente después de 6 segundos.
 * - No requiere clicks adicionales para cerrar.
 */
const SuccessNotification = ({ open, onClose }: { open: boolean; onClose: () => void }) => (
  <Snackbar
    open={open}
    autoHideDuration={6000}
    onClose={onClose}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
  >
    <Alert onClose={onClose} severity='success' variant='filled' sx={{ width: '100%' }}>
      ¡Mensaje enviado exitosamente! Te contactaré pronto.
    </Alert>
  </Snackbar>
)

/**
 * Hook para protección anti-spam.
 * 
 * ¿Por qué proteger si ya hay honeypot?
 * - Honeypot atrapa bots scrapers, pero no bots que envían forms directamente.
 * - Hay bots que usan HTTP requests directos al endpoint.
 * 
 * ¿Por qué validar tiempo mínimo (5 segundos)?
 * - Un humano tarda al menos unos segundos en completar el form.
 * - Bots pueden enviar instantly.
 * 
 * ¿Por qué validar interacción?
 * - Algunos bots ejecutan JS y pueden enviar el form.
 * - Pero si no interactuaron con los campos, probablemente son automatizados.
 * - onFocus (hacer click en un campo) = interacción confirmada.
 */
const useSpamProtection = () => {
  // Tiempo cuando se montó el componente
  const [submitTime] = useState(() => Date.now())
  const [spamError, setSpamError] = useState('')
  const [hasInteracted, setHasInteracted] = useState(false)

  const validateSubmission = (data: ContactFormData) => {
    // Honeypot: si tiene contenido, es bot
    if (data.hp_field) {
      console.log('Spam detectado: honeypot activado')
      return false
    }

    // Tiempo mínimo: menos de spamProtection.minSubmitTime segundos = sospechoso
    if ((Date.now() - submitTime) / 1000 < spamProtection.minSubmitTime) {
      setSpamError('Por favor, espera un momento antes de enviar.')
      return false
    }

    // Interacción: no marcó ningún campo = sospechoso
    if (!hasInteracted) {
      setSpamError('Por favor, interactúa con el formulario antes de enviar.')
      return false
    }

    setSpamError('')
    return true
  }

  // Se llama cuando el usuario hace focus en cualquier campo
  const handleInteraction = () => {
    if (!hasInteracted) setHasInteracted(true)
  }

  return { spamError, validateSubmission, handleInteraction }
}

/**
 * Componente principal del formulario de contacto.
 * 
 * ¿Por qué mode: 'onTouched'?
 * - Valida campos solo después de que el usuario los toca.
 * - Evita mensajes de error al cargar la página.
 * - Mejor UX que 'onChange' (valida mientras escribís).
 */
export const ContactForm = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const { spamError, validateSubmission, handleInteraction } = useSpamProtection()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: 'onTouched',
  })

  const onSubmit = async (data: ContactFormData) => {
    // Validar spam antes de enviar
    if (!validateSubmission(data)) return

    try {
      await emailjs.send(emailConfig.serviceId, emailConfig.templateId, data, emailConfig.publicKey)
      console.log('Email enviado a Outlook - SUCCESS!')
      // Resetear formulario después de éxito
      reset()
      setOpenSnackbar(true)
    } catch (error) {
      console.log('FAILED...', error)
    }
  }

  return (
    <Stack spacing={6}>
      <ContactHeader />

      <Box component='form' onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={4}>
          {FORM_FIELDS.map(field => (
            <Grid key={field.name} size={field.name === 'message' ? { xs: 12 } : { xs: 12, md: 6 }}>
              <NeonField
                label={field.label}
                name={field.name}
                color={field.color}
                type={field.type}
                multiline={field.multiline}
                rows={field.rows}
                registerProps={register(field.name)}
                error={!!errors[field.name]}
                helperText={errors[field.name]?.message}
                onFocus={handleInteraction}
              />
            </Grid>
          ))}

          <Grid size={{ xs: 12 }}>
            <HoneypotField register={register} />

            {spamError && (
              <Typography color='error' sx={{ mb: 2 }}>
                {spamError}
              </Typography>
            )}

            {/* onMouseEnter como fallback extra de interacción */}
            <GlassButton type='submit' disabled={isSubmitting} onMouseEnter={handleInteraction} />
          </Grid>
        </Grid>
      </Box>

      <SuccessNotification open={openSnackbar} onClose={() => setOpenSnackbar(false)} />
    </Stack>
  )
}