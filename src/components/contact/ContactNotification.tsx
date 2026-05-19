/**
 * Notificaciones de resultado del formulario de contacto.
 *
 * Snackbar en lugar de Alert/Toast inline porque:
 * - No interrumpe el flujo del formulario.
 * - Desaparece automáticamente (6s éxito, 8s error).
 * - No requiere clicks adicionales para cerrar.
 */
import { Snackbar, Alert } from '@mui/material'

type NotificationProps = {
  open: boolean
  onClose: () => void
}

export const SuccessNotification = ({ open, onClose }: NotificationProps) => (
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

export const ErrorNotification = ({ open, onClose }: NotificationProps) => (
  <Snackbar
    open={open}
    autoHideDuration={8000}
    onClose={onClose}
    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
  >
    <Alert onClose={onClose} severity='error' variant='filled' sx={{ width: '100%' }}>
      Error al enviar el mensaje. Por favor, intentá de nuevo más tarde.
    </Alert>
  </Snackbar>
)
