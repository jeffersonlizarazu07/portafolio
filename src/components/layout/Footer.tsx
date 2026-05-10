import { Box, Container, Stack, Typography } from '@mui/material'
import { SocialLinks } from './common/SocialLinks'
import { NavLinks } from './common/NavLinks'

export const Footer = () => {
  const name = 'Jefferson Johan Lizarazu Rondon'
  const actualYear = new Date().getFullYear()

  return (
    <Box
      component='footer'
      sx={{
        bgcolor: 'background.default',
        borderTop: (theme) =>
          theme.palette.mode === 'dark'
            ? '1px solid rgba(255,255,255,0.1)'
            : '1px solid rgba(0,0,0,0.1)',
        py: 4,
        color: 'text.primary',
      }}
    >
      <Container maxWidth='xl'>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent='space-between'
          alignItems={{ xs: 'flex-start', md: 'center' }}
          spacing={2}
        >
          <Box>
            <Typography variant='h6' fontWeight='bold' color='inherit'>
              {name}
            </Typography>

            <Typography variant='body2' color='text.secondary'>
              Desarrollador Full Stack
            </Typography>
          </Box>

          <NavLinks direction='row' spacing={4} />

          <SocialLinks showLabels={false} />
        </Stack>
        <Box pt={1.5}>
          <Typography variant='caption' color='text.secondary'>
            © {actualYear} {name}.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}
