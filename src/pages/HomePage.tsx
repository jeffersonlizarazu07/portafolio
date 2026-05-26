import { Box } from '@mui/material'
import { TechRow } from '../components/home/TechRow.js'
import { Hero } from '../components/home/Hero.js'

export const HomePage = () => {
  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        overflowX: 'hidden',
        pt: { xs: 0, md: 6 },
        px: { xs: 2, sm: 4, md: 6 },
        pb: 0,
      }}
    >
      <Hero />
      <TechRow />
    </Box>
  )
}
