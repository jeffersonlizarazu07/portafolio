/**
 * SkipToContent — Enlace de accesibilidad para navegación por teclado.
 *
 * ¿Por qué existe?
 * - El primer elemento focusable al presionar Tab debe ser "Saltar al contenido".
 * - Usuarios de teclado y screen readers no tienen que tabular todo el Header.
 * - Es el requisito #1 de WCAG 2.1 (2.4.1 - Bypass Blocks).
 *
 * Está oculto visualmente por defecto y aparece al recibir foco (Tab).
 */
import { Box } from '@mui/material'

export const SkipToContent = () => (
  <Box
    component='a'
    href='#main-content'
    sx={{
      position: 'fixed',
      top: -9999,
      left: -9999,
      zIndex: 9999,
      p: 2,
      bgcolor: 'primary.main',
      color: 'white',
      textDecoration: 'none',
      fontWeight: 700,
      fontSize: '0.875rem',
      borderRadius: 1,
      '&:focus': {
        top: 16,
        left: 16,
      },
    }}
  >
    Saltar al contenido principal
  </Box>
)
