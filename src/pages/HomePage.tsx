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
        pt: 6,
        px: 6,
        pb: 0,
      }}
    >
      <Hero />
      <TechRow />
    </Box>
  )
}
