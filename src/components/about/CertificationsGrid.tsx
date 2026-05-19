/**
 * Grilla de certificaciones.
 *
 * Renderiza el contenedor con título y grid de CertificationCards.
 * Cambia solo si cambia el layout de certificaciones.
 */
import { Grid, Box, Stack, Typography } from '@mui/material'
import { certifications } from './aboutData'
import { CertificationCard } from './CertificationCard'

export const CertificationsGrid = () => (
  <Box
    sx={{
      p: 4,
      height: '100%',
      backgroundColor: 'background.tech',
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: 2,
    }}
  >
    <Stack spacing={3}>
      <Typography variant='caption' color='text.secondary' fontWeight={700} letterSpacing={2}>
        CERTIFICACIONES
      </Typography>
      <Grid container spacing={3}>
        {certifications.map((cert) => (
          <Grid size={{ xs: 12, sm: 6 }} key={cert.url}>
            <CertificationCard cert={cert} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  </Box>
)
