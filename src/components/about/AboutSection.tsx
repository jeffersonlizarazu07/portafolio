import { Grid, Box, Typography, Button, Stack, Chip, Link } from '@mui/material'
import { Link as Router } from 'react-router-dom'
import DownloadIcon from '@mui/icons-material/Download'
import { AnimatedSection } from '@/ui/AnimatedSection'
import { config } from '@/config'
import photo from '@/assets/photo.jpg'
import { getNavPath } from '@/constants/navLinksArray'

export const AboutSection = () => {
  return (
    <Grid container spacing={{ xs: 4, lg: 10 }} alignItems='center' mb={{ xs: 8, md: 20 }}>
      {/* Image */}
      <Grid size={{ xs: 12, lg: 5 }}>
        <AnimatedSection variant='slideUp' delay={0}>
          <Box sx={{ position: 'relative', maxWidth: 400, mx: 'auto' }}>
            <Box
              component='img'
              src={photo}
              loading='lazy'
              fetchPriority='low'
              sx={{
                width: '100%',
                borderRadius: 3,
                objectFit: 'cover',
                filter: 'grayscale(100%)',
                transition: '0.6s',
                '&:hover': {
                  filter: 'grayscale(0%)',
                },
              }}
            />

            {/* Experience Badge */}
            <Box
              sx={{
                position: 'absolute',
                bottom: { xs: -10, sm: -20 },
                right: { xs: -10, sm: -20 },
                bgcolor: 'primary.main',
                color: 'white',
                p: 3,
                borderRadius: 3,
                textAlign: 'center',
                boxShadow: theme =>
                  theme.palette.mode === 'dark'
                    ? '0 10px 40px rgba(0,0,0,0.4)'
                    : '0 10px 40px rgba(0,0,0,0.15)',
              }}
            >
              <Typography variant='h4' component='span' fontWeight={800}>
                1
              </Typography>
              <Typography variant='caption' sx={{ letterSpacing: 2, p: 1 }}>
                YEAR EXP
              </Typography>
            </Box>
          </Box>
        </AnimatedSection>
      </Grid>

      {/* Content */}
      <Grid size={{ xs: 12, lg: 7 }}>
        <AnimatedSection variant='slideUp' delay={150}>
          <Stack spacing={5}>
            <Chip
              label='About me'
              sx={{
                bgcolor: 'primary.main',
                color: 'white',
                width: 'fit-content',
                fontWeight: 700,
              }}
            />

            <Typography variant='h3' fontWeight={800}>
              Desarrollador de software enfocado en crear experiencias web{' '}
              <Box component='span' color='primary.main'>
                modernas, rápidas y escalables.
              </Box>
            </Typography>

            <Typography color='text.primary' fontSize={18}>
              Desarrollador de software enfocado en crear experiencias web modernas, rápidas y
              escalables. Trabajo principalmente con React, TypeScript, Node.js y otras tecnologías
              del ecosistema web, desarrollando interfaces limpias y soluciones full stack
              orientadas a la experiencia del usuario.
            </Typography>

            <Typography color='text.primary' fontSize={18}>
              Me apasiona construir productos intuitivos y escalables, combinando diseño, lógica de
              negocio y buenas prácticas de desarrollo para crear soluciones funcionales,
              mantenibles y centradas en el usuario.
            </Typography>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} flexWrap='wrap'>
              {config.cv.url && (
                <Button
                  variant='contained'
                  size='large'
                  startIcon={<DownloadIcon />}
                  href={config.cv.url}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  Descargar HV
                </Button>
              )}

              <Button variant='outlined' size='large'>
                <Link to={getNavPath('Contacto')} component={Router} underline='none'>
                  Contacto
                </Link>
              </Button>
            </Stack>
          </Stack>
        </AnimatedSection>
      </Grid>
    </Grid>
  )
}
