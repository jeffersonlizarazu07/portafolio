import { Container, Box } from '@mui/material'
import { ProjectsContainer } from '../components/projects/ProjectsContainer'

export const ProjectsPage = () => {
  return (
    <Box
      sx={{
        bgcolor: 'background.secondary',
        color: 'text.primary',
        minHeight: '100vh',
        px: { xs: 2, sm: 4, md: 6 },
      }}
    >
      <Container maxWidth='xl' sx={{ py: { xs: 4, md: 10 } }}>
        <ProjectsContainer />
      </Container>
    </Box>
  )
}
