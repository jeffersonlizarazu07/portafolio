import { Box, Button, Container, Grid, Stack, Typography } from '@mui/material'
import { Link } from 'react-router-dom'
import CircleIcon from '@mui/icons-material/Circle'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import { AnimatedSection } from '@/ui/AnimatedSection'
import { CodeImage } from '../home/CodeImage'
import { SocialLinks } from '../layout/common/SocialLinks'
import { getNavPath } from '@/constants/navLinksArray'

export const Hero = () => {
  return (
    <Box
      component='main'
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        pt: { xs: 4, lg: 10 },
        marginTop: { xs: '64px', md: '6.25rem' },
      }}
    >
      <Container maxWidth='xl'>
        <Grid container spacing={{ xs: 4, lg: 10 }} alignItems='center'>
          {/* LEFT CONTENT */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Stack spacing={4}>
              <AnimatedSection variant='fadeIn' delay={0}>
                <Typography
                  sx={{
                    background: theme =>
                      theme.palette.mode === 'dark' ? 'rgba(15,31,48,0.7)' : 'rgba(43,108,238,0.1)',
                    px: 2,
                    py: 1,
                    borderRadius: 5,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    color: 'primary.light',
                    fontFamily: 'sans-serif',
                  }}
                >
                  <CircleIcon sx={{ fontSize: '17px' }} />
                  DISPONIBLE
                </Typography>
              </AnimatedSection>

              <AnimatedSection variant='slideUp' delay={100}>
                <Typography
                  variant='h1'
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', lg: '4rem' },
                    lineHeight: 1.1,
                  }}
                >
                  Full Stack{' '}
                  <Box component='span' color='primary.main'>
                    <br />
                    Developer.
                  </Box>
                  <br />
                  Creación de experiencias
                  <br />
                  digitales.
                </Typography>
              </AnimatedSection>

              <AnimatedSection variant='slideUp' delay={200}>
                <Typography color='text.secondary' maxWidth={500}>
                  He trabajado en el desarrollo de soluciones web utilizando React en el frontend y
                  Node.js (Express) en el backend. Me enfoco en crear aplicaciones funcionales,
                  escalables y orientadas a resolver problemas reales.
                </Typography>
              </AnimatedSection>

              <AnimatedSection variant='slideUp' delay={300}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                  <Button
                    component={Link}
                    to={getNavPath('Proyectos')}
                    variant='contained'
                    size='large'
                    endIcon={<ArrowForwardIcon />}
                  >
                    Ver mis proyectos
                  </Button>

                  <Button
                    component={Link}
                    to={getNavPath('Contacto')}
                    variant='outlined'
                    size='large'
                    sx={{ color: 'text.primary' }}
                  >
                    Contactarme
                  </Button>
                </Stack>
              </AnimatedSection>

              <AnimatedSection variant='slideUp' delay={400}>
                <SocialLinks />
              </AnimatedSection>
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <AnimatedSection variant='fadeIn' delay={250}>
              <CodeImage />
            </AnimatedSection>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}
