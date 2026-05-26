import { Box, Container, Stack, Typography, useTheme } from '@mui/material'
import { getLanguageLogo } from '@/utils/languageLogos'

const techs = [
  { name: 'React', iconKey: 'React' },
  { name: 'Express', iconKey: 'Express' },
  { name: 'Java', iconKey: 'Java' },
  { name: 'Vite', iconKey: 'Vite' },
  { name: 'Tailwind CSS', iconKey: 'Tailwind CSS' },
  { name: 'Vercel', iconKey: 'Vercel' },
]

export const TechRow = () => {
  const theme = useTheme()
  const iconColor = theme.palette.mode === 'dark' ? 'white' : 'black'

  return (
    <Box
      sx={{
        borderTop: theme =>
          theme.palette.mode === 'dark'
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(0, 0, 0, 0.1)',
        borderBottom: theme =>
          theme.palette.mode === 'dark'
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '1px solid rgba(0, 0, 0, 0.1)',
        py: { xs: 4, md: 8 },
        mt: 5,
        width: '100vw',
        position: 'relative',
        left: '50%',
        mx: '-50vw',
        maxWidth: '100%',
      }}
    >
      <Container maxWidth='xl'>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 3, sm: 6, md: 10 }}
          justifyContent='space-between'
          alignItems='center'
          flexWrap='wrap'
          useFlexGap
          sx={{
            opacity: 0.6,
            transition: 'opacity 0.3s ease',
            '&:hover': { opacity: 1 },
          }}
        >
          {techs.map(({ name, iconKey }) => (
            <Stack
              key={name}
              direction='row'
              spacing={1.5}
              alignItems='center'
              sx={{
                transition: 'transform 0.3s ease',
                '&:hover': { transform: 'translateY(-2px)' },
              }}
            >
              <Box
                component='img'
                src={getLanguageLogo(iconKey, iconColor)}
                alt={name}
                sx={{ width: 24, height: 24 }}
              />
              <Typography variant='h6'>{name}</Typography>
            </Stack>
          ))}
        </Stack>
      </Container>
    </Box>
  )
}
