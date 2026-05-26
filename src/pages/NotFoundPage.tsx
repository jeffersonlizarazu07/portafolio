/**
 * Página 404 - Page Not Found
 *
 * ¿Por qué diseñada así?
 * - Mensaje claro que explica qué pasó.
 * - Botón para volver al inicio (mejor que "Not Found" a secas).
 * - Diseño minimalista que no confunde al usuario.
 * - Consistente con el theme oscuro del portfolio.
 */
import { Box, Typography, Button } from '@mui/material'
import { Link } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home'

export const NotFoundPage = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100dvh',
        width: '100%',
        bgcolor: 'background.default',
        color: 'text.primary',
        px: 3,
      }}
    >
      {/* Código 404 */}
      <Typography
        sx={{
          fontSize: { xs: '5rem', sm: '8rem' },
          fontWeight: 800,
          fontFamily: 'monospace',
          color: 'primary.main',
          lineHeight: 1,
          mb: 2,
        }}
      >
        404
      </Typography>

      {/* Título */}
      <Typography variant='h4' fontWeight={700} mb={2} textAlign='center'>
        Página no encontrada
      </Typography>

      {/* Descripción */}
      <Typography color='text.secondary' mb={5} textAlign='center' maxWidth={400}>
        Lo siento, la página que buscas no existe o fue movida.
      </Typography>

      {/* Botón volver al inicio */}
      <Button
        component={Link}
        to='/'
        variant='contained'
        size='large'
        startIcon={<HomeIcon />}
        sx={{ width: { xs: '100%', sm: 'auto' } }}
      >
        Volver a la página principal
      </Button>
    </Box>
  )
}
