/**
 * Card de experiencia.
 *
 * Muestra los años de experiencia + descripción.
 * Cambia solo si cambia el contenido o diseño de esta card.
 */
import { Box, Stack, Typography } from '@mui/material'

export const ExperienceCard = () => (
  <Box
    sx={{
      p: 4,
      height: '100%',
      backgroundColor: 'background.tech',
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 2,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}
  >
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems='center'>
      <Typography variant='h2' fontWeight={800} color='primary.main'>
        1+
      </Typography>
      <Typography variant='h5' color='text.primary'>
        años de experiencia
      </Typography>
    </Stack>
    <Typography variant='body1' color='text.secondary' mt={2}>
      Desarrollando soluciones web modernas y escalables
    </Typography>
  </Box>
)
