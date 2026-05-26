/**
 * Sección de tecnologías, experiencia y certificaciones.
 *
 * Orquestador que compone los subcomponentes.
 * Cambia solo si cambia el layout general de la sección.
 */
import { Box, Stack, Typography, Grid } from '@mui/material'
import { AnimatedSection } from '@/ui/AnimatedSection'
import { TechStackGrid } from './TechStackGrid'
import { ExperienceCard } from './ExperienceCard'
import { CertificationsGrid } from './CertificationsGrid'

export const TechSection = () => (
  <AnimatedSection variant='slideUp' delay={100}>
    <Box>
      <Stack spacing={{ xs: 4, md: 10 }}>
        {/* Header */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems='center'
          spacing={{ xs: 2, md: 4 }}
        >
          <Box>
            <Typography variant='h4' fontWeight={800}>
              Mi Ecosistema
            </Typography>
            <Typography color='text.primary' maxWidth={500}>
              Me especializo en el desarrollo full stack con JavaScript y tecnologías modernas del
              ecosistema web, complementando mi experiencia con conocimientos en otras herramientas
              y lenguajes orientados a la construcción de software.
            </Typography>
          </Box>
        </Stack>

        {/* Tech Grid */}
        <TechStackGrid />

        {/* Experience & Certifications */}
        <Grid container spacing={4} sx={{ mb: { xs: 6, md: 15 } }}>
          <Grid size={{ xs: 12, md: 4 }}>
            <ExperienceCard />
          </Grid>
          <Grid size={{ xs: 12, md: 8 }}>
            <CertificationsGrid />
          </Grid>
        </Grid>
      </Stack>
    </Box>
  </AnimatedSection>
)
