import { Typography } from '@mui/material'

export const NotFoundPage = () => {
  return (
    <Typography
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100%',
        fontSize: { xs: '2rem', sm: '4rem' },
      }}
    >
      Not Found
    </Typography>
  )
}
