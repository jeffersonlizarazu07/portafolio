/**
 * Formulario de contacto con validación robusta y protección anti-spam.
 *
 * Usa React Hook Form + Zod porque:
 * - RHF maneja el estado del formulario y reduce re-renders.
 * - Zod proporciona validación declarativa y tipado automático.
 * - Juntos son el estándar actual para formularios en React.
 *
 * Validación en el cliente aunque el backend podría validar:
 * - Feedback inmediato para el usuario (sin esperar round-trip).
 * - Reduce carga en el servidor.
 * - UX superior en formularios complejos.
 */
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useSearchParams } from 'react-router-dom'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { NeonField } from './NeonField'
import { GlassButton } from '@/ui/GlassButton'
import { ContactHeader } from './ContactHeader'
import { HoneypotField } from './HoneypotField'
import { SuccessNotification, ErrorNotification } from './ContactNotification'
import { useSpamProtection } from '@/hooks/useSpamProtection'
import { config } from '@/config'
import { contactSchema, ContactFormData } from '@/validations/contactSchema'
import { FORM_FIELDS } from './contactFields'
import { sendContactEmail } from '@/services/emailService'

/**
 * Componente principal del formulario de contacto.
 *
 * mode: 'onTouched' - valida campos solo después de que el usuario los toca.
 * Evita mensajes de error al cargar la página.
 * Mejor UX que 'onChange' (valida mientras escribís).
 */
export const ContactForm = () => {
  const theme = useTheme()
  const [searchParams] = useSearchParams()
  const prefillMessage = searchParams.get('mensaje') || ''
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [openErrorSnackbar, setOpenErrorSnackbar] = useState(false)
  const { spamError, validateSubmission, handleInteraction } = useSpamProtection({
    minSubmitTime: config.spamProtection.minSubmitTime,
  })

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: 'onTouched',
    defaultValues: {
      message: prefillMessage,
    },
  })

  const onSubmit = async (data: ContactFormData) => {
    // Validar spam antes de enviar
    if (!validateSubmission(data)) return

    try {
      await sendContactEmail(data)
      // Resetear formulario después de éxito
      reset()
      setOpenSnackbar(true)
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('ContactForm: send failed', error)
      }
      setOpenErrorSnackbar(true)
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
                inputColor={theme.palette.mode === 'dark' ? '#ffffff' : '#000000'}
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
      <ErrorNotification open={openErrorSnackbar} onClose={() => setOpenErrorSnackbar(false)} />
    </Stack>
  )
}
