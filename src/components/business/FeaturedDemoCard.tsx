/**
 * FeaturedDemoCard — Sección hero para la solución destacada.
 *
 * Componente presentacional puro.
 * Muestra la solución "ready" con:
 * - Layout asimétrico (texto | métricas)
 * - Problema vs Solución
 * - Tecnologías con razón comercial
 * - CTAs a demo y contacto
 */
import { Box, Typography, Stack, Button, Grid } from '@mui/material'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import SendIcon from '@mui/icons-material/Send'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import { Link as Router } from 'react-router-dom'
import { getNavPath } from '@/constants/navLinksArray'
import { config } from '@/config'
import { subtleBorder, subtleBg, accentBorder, accentBgSoft } from '@/utils/themeStyles'
import type { BusinessSolution } from '@/types/Business'

type FeaturedDemoCardProps = {
  solution: BusinessSolution
}

export const FeaturedDemoCard = ({ solution }: FeaturedDemoCardProps) => {
  const contactPath = getNavPath('Contacto')

  return (
    <Box
      sx={{
        position: 'relative',
        borderRadius: 4,
        overflow: 'hidden',
        bgcolor: 'background.paper',
        border: subtleBorder,
        p: { xs: 3, md: 6 },
      }}
    >
      {/* Decorative gradient accent */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: 'linear-gradient(90deg, primary.main, #60a5fa)',
        }}
      />

      <Grid container spacing={{ xs: 4, md: 6 }} alignItems='stretch'>
        {/* ── LEFT: Problem / Solution / Tech ── */}
        <Grid size={{ xs: 12, md: 7 }}>
          <Stack spacing={4}>
            {/* Title */}
            <Box>
              <Typography
                variant='h4'
                fontWeight={700}
                mb={1}
                sx={{ fontSize: { xs: '1.5rem', md: '1.75rem' } }}
              >
                {solution.title}
              </Typography>
              <Typography variant='h6' color='primary.light' fontWeight={500}>
                {solution.subtitle}
              </Typography>
            </Box>

            {/* Problem / Solution */}
            <Box>
              <Typography
                variant='overline'
                color='text.secondary'
                fontWeight={700}
                sx={{ letterSpacing: 1 }}
              >
                Problema
              </Typography>
              <Typography color='text.secondary' mb={2.5}>
                {solution.problemDescription}
              </Typography>

              <Typography
                variant='overline'
                color='success.main'
                fontWeight={700}
                sx={{ letterSpacing: 1 }}
              >
                Solución
              </Typography>
              <Typography>{solution.solutionDescription}</Typography>
            </Box>

            {/* Tech with business reasoning */}
            <Box>
              <Typography
                variant='overline'
                color='text.secondary'
                fontWeight={700}
                sx={{ letterSpacing: 1 }}
                mb={1.5}
                display='block'
              >
                Tecnología aplicada a tu negocio
              </Typography>
              <Stack spacing={1.5}>
                {solution.techReasoning.map(tech => (
                  <Box key={tech.name} sx={{ display: 'flex', gap: 1.5, alignItems: 'flex-start' }}>
                    <CheckCircleOutlineIcon
                      sx={{ fontSize: 20, color: 'primary.main', mt: 0.3, flexShrink: 0 }}
                    />
                    <Box>
                      <Typography variant='body2' fontWeight={700}>
                        {tech.name}
                      </Typography>
                      <Typography variant='body2' color='text.secondary'>
                        {tech.reason}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Box>
          </Stack>
        </Grid>

        {/* ── RIGHT: Metrics + CTAs ── */}
        <Grid size={{ xs: 12, md: 5 }}>
          <Stack
            spacing={4}
            sx={{
              height: '100%',
              justifyContent: 'space-between',
            }}
          >
            {/* Metrics Grid */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 2,
              }}
            >
              {solution.metrics.map(metric => (
                <Box
                  key={metric.label}
                  sx={{
                    p: 2.5,
                    borderRadius: 3,
                    bgcolor: subtleBg,
                    border: subtleBorder,
                    textAlign: 'center',
                  }}
                >
                  <Typography
                    variant='h4'
                    fontWeight={800}
                    color='primary.main'
                    sx={{ fontSize: { xs: '1.5rem', md: '1.75rem' } }}
                  >
                    {metric.value}
                  </Typography>
                  <Typography variant='body2' color='text.secondary' mt={0.5}>
                    {metric.label}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Business Value */}
            <Box
              sx={{
                p: 3,
                borderRadius: 3,
                bgcolor: accentBgSoft,
                border: accentBorder,
              }}
            >
              <Typography variant='body2' fontWeight={700} mb={0.5}>
                Propuesta de valor
              </Typography>
              <Typography variant='body2' color='text.secondary'>
                {solution.businessValue}
              </Typography>
            </Box>

            {/* CTAs */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <Button
                variant='contained'
                size='large'
                endIcon={<OpenInNewIcon />}
                href={solution.demoUrl ?? config.business.catalogDemoUrl}
                target='_blank'
                rel='noopener noreferrer'
                fullWidth
              >
                Probar Demo Interactiva
              </Button>
              <Button
                component={Router}
                to={`${contactPath}?mensaje=${encodeURIComponent(solution.contactPreFill)}`}
                variant='outlined'
                size='large'
                endIcon={<SendIcon />}
                fullWidth
                sx={{ color: 'text.primary' }}
              >
                Cotizar / Personalizar
              </Button>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  )
}
