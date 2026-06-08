/**
 * BusinessSolutionsPage — Vista de "Soluciones para Negocio".
 *
 * Exposición de soluciones digitales para potenciales clientes.
 * Sigue el patrón de las demás páginas del portafolio:
 * - Box con bgcolor y glow orbs decorativos
 * - Container con maxWidth='xl'
 * - Secciones envueltas en AnimatedSection
 * - Espaciado para el footer
 *
 * @see AboutPage.tsx — inspiración de layout
 */
import { Box, Container, Typography } from '@mui/material'
import { AnimatedSection } from '@/ui/AnimatedSection'
import { BusinessHeader } from '@/components/business/BusinessHeader'
import { FeaturedDemoCard } from '@/components/business/FeaturedDemoCard'
import { ExpansionModules } from '@/components/business/ExpansionModules'
import { businessSolutions, getFeaturedSolution } from '@/data/businessSolutions'
import { subtleBorder, subtleBg, warningBg } from '@/utils/themeStyles'

export const BusinessSolutionsPage = () => {
  const featured = getFeaturedSolution()

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        py: { xs: 6, md: 12 },
        px: { xs: 2, sm: 4, md: 6 },
        position: 'relative',
        overflow: 'hidden',
        bgcolor: 'background.default',
        color: 'text.primary',
      }}
    >
      {/* Glow Orbs decorativos */}
      <Box
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'absolute',
          top: -100,
          left: -100,
          width: 400,
          height: 400,
          bgcolor: 'primary.main',
          opacity: 0.08,
          filter: 'blur(120px)',
          borderRadius: '50%',
        }}
      />
      <Box
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'absolute',
          bottom: 0,
          right: -100,
          width: 300,
          height: 300,
          bgcolor: 'primary.main',
          opacity: 0.05,
          filter: 'blur(100px)',
          borderRadius: '50%',
        }}
      />

      <Container maxWidth='xl'>
        {/* Header */}
        <AnimatedSection variant='slideUp' delay={0}>
          <BusinessHeader />
        </AnimatedSection>

        {/* Featured Solution */}
        {featured && (
          <AnimatedSection variant='slideUp' delay={150}>
            <FeaturedDemoCard solution={featured} />
          </AnimatedSection>
        )}

        {/* Expansion Modules */}
        {featured && featured.expansionModules.length > 0 && (
          <AnimatedSection variant='slideUp' delay={300}>
            <ExpansionModules
              modules={featured.expansionModules}
              preFillMessage={featured.contactPreFill}
            />
          </AnimatedSection>
        )}

        {/* Other on-demand solutions teaser */}
        {businessSolutions.filter(s => s.status !== 'ready').length > 0 && (
          <AnimatedSection variant='slideUp' delay={450}>
            <Box sx={{ mt: { xs: 5, md: 10 } }}>
              <Box
                sx={{
                  p: { xs: 3, md: 5 },
                  borderRadius: 4,
                  bgcolor: 'background.paper',
                  border: subtleBorder,
                  textAlign: 'center',
                }}
              >
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    px: 2,
                    py: 0.75,
                    borderRadius: 5,
                    bgcolor: warningBg,
                    color: 'warning.main',
                    typography: 'body2',
                    fontWeight: 600,
                    mb: 3,
                  }}
                >
                  🚀 EN DESARROLLO
                </Box>

                <Typography variant='h5' fontWeight={700} mb={2}>
                  ¿Necesitas una solución diferente?
                </Typography>
                <Typography color='text.secondary' maxWidth={600} mx='auto' mb={4}>
                  Además del Catálogo Digital, desarrollo soluciones a medida. Cuéntame qué necesita
                  tu negocio y te propongo la mejor estrategia tecnológica.
                </Typography>

                <Box
                  sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    justifyContent: 'center',
                  }}
                >
                  {businessSolutions
                    .filter(s => s.status !== 'ready')
                    .map(s => (
                      <Box
                        key={s.id}
                        sx={{
                          p: 2.5,
                          borderRadius: 2,
                          bgcolor: subtleBg,
                          border: subtleBorder,
                          textAlign: 'left',
                          flex: {
                            xs: '1 1 100%',
                            sm: '1 1 calc(50% - 8px)',
                            md: '0 1 calc(33.33% - 11px)',
                          },
                          minWidth: { md: 240 },
                        }}
                      >
                        <Typography variant='subtitle2' fontWeight={700} mb={0.5}>
                          {s.title}
                        </Typography>
                        <Typography variant='body2' color='text.secondary'>
                          {s.subtitle}
                        </Typography>
                      </Box>
                    ))}
                </Box>
              </Box>
            </Box>
          </AnimatedSection>
        )}
      </Container>

      {/* Spacer para el footer */}
      <Box sx={{ height: 80 }} />
    </Box>
  )
}
