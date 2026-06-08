/**
 * BusinessHeader — Encabezado de propuesta de valor B2B.
 *
 * Componente presentacional puro.
 * Muestra el título principal y la propuesta de valor
 * de la sección "Soluciones para Negocio".
 */
import { Typography, Box } from '@mui/material'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import { accentBg } from '@/utils/themeStyles'

export const BusinessHeader = () => {
  return (
    <Box textAlign='center' mb={{ xs: 6, md: 10 }}>
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 1,
          px: 2,
          py: 0.75,
          borderRadius: 5,
          bgcolor: accentBg,
          color: 'primary.light',
          mb: 3,
          typography: 'body2',
          fontWeight: 600,
        }}
      >
        <RocketLaunchIcon sx={{ fontSize: 18 }} />
        B2B — SOLUCIONES DIGITALES
      </Box>

      <Typography
        variant='h2'
        sx={{
          fontWeight: 800,
          fontSize: { xs: '2rem', sm: '2.5rem', md: '3.25rem' },
          lineHeight: 1.15,
          mb: 2,
        }}
      >
        Soluciones a la Medida
        <Box component='span' color='primary.main' display='block'>
          de tu Negocio
        </Box>
      </Typography>

      <Typography
        color='text.secondary'
        sx={{
          maxWidth: 680,
          mx: 'auto',
          fontSize: { xs: '1rem', md: '1.125rem' },
          lineHeight: 1.7,
        }}
      >
        Comienza con un prototipo funcional y expande tu plataforma según las necesidades reales de
        tu empresa. Sin pagar por características que no usas.
      </Typography>
    </Box>
  )
}
