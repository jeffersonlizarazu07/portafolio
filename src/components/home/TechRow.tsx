import { Box, Container, Stack, Typography } from '@mui/material'

export const TechRow = () => {
  return (
    <Box
      sx={{
        borderTop: theme =>
          theme.palette.mode === 'dark'
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '3px solid #E2E8F0',
        borderBottom: theme =>
          theme.palette.mode === 'dark'
            ? '1px solid rgba(255, 255, 255, 0.1)'
            : '2px solid #E2E8F0',
        py: 10,
        mt: 5,
        width: '100vw',
        position: 'relative',
        left: '50%',
        mx: '-50vw',
      }}
    >
      <Container maxWidth='xl'>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 2, sm: 8 }}
          justifyContent='space-between'
          flexWrap='wrap'
          sx={{ opacity: 0.5 }}
        >
          <Typography variant='h6'>REACT</Typography>
          <Typography variant='h6'>EXPRESS</Typography>
          <Typography variant='h6'>JAVA</Typography>
          <Typography variant='h6'>VITE</Typography>
          <Typography variant='h6'>TAILWIND</Typography>
          <Typography variant='h6'>VERCEL</Typography>
        </Stack>
      </Container>
    </Box>
  )
}
