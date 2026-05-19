/**
 * Card individual de certificación.
 *
 * Muestra institución, plataforma, enlace y título.
 * Cambia solo si cambia el diseño visual de una certificación.
 */
import { Box, Stack, Chip, Button, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import type { Certification } from './aboutData'

export const CertificationCard = ({ cert }: { cert: Certification }) => {
  const Icon = cert.Icon

  return (
    <Box
      sx={{
        p: 2,
        height: '100%',
        minHeight: 140,
        backgroundColor: theme => alpha(theme.palette.techAccent.main, 0.05),
        border: '1px solid',
        borderColor: theme =>
          theme.palette.mode === 'dark'
            ? alpha(theme.palette.techAccent.main, 0.2)
            : alpha(theme.palette.techAccent.main, 0.15),
        borderRadius: 2,
      }}
    >
      <Stack spacing={2}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent='space-between'
          alignItems={{ xs: 'flex-start', sm: 'center' }}
        >
          <Box>
            <Chip
              label={cert.institution}
              size='small'
              sx={{
                bgcolor: theme => alpha(theme.palette.techAccent.main, 0.1),
                color: 'primary.main',
                fontWeight: 600,
              }}
            />
            <Chip
              label={cert.plataform}
              size='small'
              sx={{
                bgcolor: theme => alpha(theme.palette.techAccent.main, 0.1),
                color: 'primary.main',
                fontWeight: 600,
              }}
            />
          </Box>
          <Button
            variant='text'
            size='small'
            startIcon={<Icon />}
            href={cert.url}
            target='_blank'
            rel='noopener noreferrer'
            sx={{
              color: 'primary.main',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: theme => alpha(theme.palette.techAccent.main, 0.1),
              },
            }}
          >
            {cert.buttonLabel}
          </Button>
        </Stack>
        <Typography variant='body2' color='text.primary' fontWeight={500}>
          {cert.title}
        </Typography>
      </Stack>
    </Box>
  )
}
