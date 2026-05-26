/**
 * PageLoader - Spinner animado para cuando carga una página.
 *
 * ¿Por qué diseñado así?
 * - El spinner circular es el indicador de loading universal.
 * - Animación suave que no distrae.
 * - Mensaje claro para el usuario ("Cargando...").
 * - Usa el tema (background.default, primary.main) para consistencia.
 */
import { Box, CircularProgress, Typography } from '@mui/material'

export const PageLoader = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100dvh',
        bgcolor: 'background.default',
        gap: 3,
      }}
    >
      <CircularProgress color='primary' size={48} thickness={4} />
      <Typography color='text.secondary' fontSize={20}>
        Cargando...
      </Typography>
    </Box>
  )
}
