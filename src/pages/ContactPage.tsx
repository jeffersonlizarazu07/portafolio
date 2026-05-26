import { lazy, Suspense, type ComponentType } from 'react'
import { Box, Container, Grid, CircularProgress } from '@mui/material'
import { AnimatedSection } from '@/ui/AnimatedSection'
import { ContactSidebar } from '@/components/contact/ContactSidebar'

const LazyContactForm = lazy(() =>
  import('@/components/contact/ContactForm').then(m => ({ default: m.ContactForm }))
)

const formFallback = (
  <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
    <CircularProgress />
  </Box>
)

interface ContactPageProps {
  /** Override para tests — permite inyectar ContactForm sin React.lazy */
  ContactFormComponent?: ComponentType
}

export const ContactPage = ({ ContactFormComponent = LazyContactForm }: ContactPageProps) => {
  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        p: { xs: 2, sm: 4, md: 6 },
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Watermark */}
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.03,
          fontSize: '12rem',
          fontWeight: 800,
          transform: 'rotate(12deg)',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      ></Box>

      <Container maxWidth='xl' sx={{ position: 'relative', zIndex: 2, marginTop: '6.25rem' }}>
        <Grid container spacing={{ xs: 4, lg: 10 }} alignItems='center' marginBottom='3rem'>
          <Grid size={{ xs: 12, lg: 7 }}>
            <AnimatedSection variant='slideUp' delay={0}>
              <Suspense fallback={formFallback}>
                <ContactFormComponent />
              </Suspense>
            </AnimatedSection>
          </Grid>

          <Grid size={{ xs: 12, lg: 5 }}>
            <AnimatedSection variant='slideUp' delay={200}>
              <ContactSidebar />
            </AnimatedSection>
          </Grid>
        </Grid>
      </Container>

      {/* Background Glow */}
      <Box
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'fixed',
          top: '10%',
          left: '5%',
          width: 300,
          height: 300,
          bgcolor: 'primary.main',
          opacity: 0.05,
          borderRadius: '50%',
          filter: 'blur(120px)',
          zIndex: -1,
        }}
      />
    </Box>
  )
}
