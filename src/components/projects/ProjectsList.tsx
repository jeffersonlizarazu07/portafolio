import { Grid, Typography, Skeleton, Snackbar } from '@mui/material'
import type { GitHubRepo } from '@/types/GitHub'
import { useImageFallback } from '@/hooks/useImageFallback'
import { useDeploymentNavigation } from '@/hooks/useDeploymentNavigation'
import { ProjectCard } from './ProjectCard'

// Recibe los proyectos DESDE Props (no del hook)
type ProjectsListProps = {
  projects: GitHubRepo[]
  loading: boolean
  error: string | null
}

export const ProjectsList = ({ projects, loading, error }: ProjectsListProps) => {
  const { getDisplayImage, handleImageError } = useImageFallback()
  const { openNotification, handleCardClick, closeNotification } = useDeploymentNavigation()

  if (loading) {
    return (
      <Grid container spacing={4}>
        {[1, 2, 3, 4, 5, 6].map(n => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={n}>
            <Skeleton variant='rectangular' height={320} sx={{ borderRadius: 3 }} />
          </Grid>
        ))}
      </Grid>
    )
  }

  if (error) {
    return (
      <Typography color='error' textAlign='center'>
        Error: {error}
      </Typography>
    )
  }

  return (
    <Grid container spacing={4}>
      {projects.map((project, index) => (
        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={index}>
          <ProjectCard
            project={project}
            index={index}
            displayImage={getDisplayImage(project)}
            onImageError={e => handleImageError(e, project.language)}
            onCardClick={() => handleCardClick(project.deployment_url)}
            onRocketClick={() => window.open(project.url, '_blank', 'noopener,noreferrer')}
          />
          <Snackbar
            open={openNotification}
            autoHideDuration={3000}
            onClose={closeNotification}
            message='Demo no disponible actualmente!'
            sx={{
              '& .MuiSnackbarContent-root': {
                bgcolor: theme =>
                  theme.palette.mode === 'dark' ? 'rgba(16,22,34,0.95)' : 'rgba(255,255,255,0.95)',
                color: 'text.primary',
                borderRadius: 2,
                boxShadow: 3,
                fontWeight: 600,
                display: 'flex',
                justifyContent: 'center',
              },
            }}
          />
        </Grid>
      ))}
    </Grid>
  )
}
