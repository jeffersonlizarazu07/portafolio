/**
 * ProjectCard — Componente presentacional puro.
 *
 * Renderiza una tarjeta de proyecto con imagen, overlay de datos
 * y dos comportamientos de click:
 *   - Icono de cohete → abre el repositorio en GitHub
 *   - Click en la tarjeta → abre la URL de despliegue (si existe)
 *
 * NO maneja lógica, NO usa hooks, NO tiene estado.
 * Todas las funciones y datos vienen por props.
 */
import {
  Box,
  Card,
  CardMedia,
  Typography,
  Stack,
  Chip,
  CardActionArea,
  Tooltip,
  Button,
} from '@mui/material'
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import type { GitHubRepo } from '@/types/GitHub'

type ProjectCardProps = {
  project: GitHubRepo
  index: number
  displayImage: string
  onImageError: (event: React.SyntheticEvent<HTMLImageElement>) => void
  onCardClick: () => void
  onRocketClick: () => void
}

export const ProjectCard = ({
  project,
  index,
  displayImage,
  onImageError,
  onCardClick,
  onRocketClick,
}: ProjectCardProps) => (
  <Card
    sx={{
      position: 'relative',
      overflow: 'hidden',
      borderRadius: 3,
      bgcolor: 'background.paper',
      '&:hover .overlay': { opacity: 1 },
      '&:hover img': { transform: 'scale(1.05)' },
    }}
  >
    <Tooltip title='Repositorio en GitHub' placement='left'>
      <RocketLaunchIcon
        sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          cursor: 'pointer',
          zIndex: 1,
          fontSize: 28,
          color: 'primary.main',
          bgcolor: theme =>
            theme.palette.mode === 'dark' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.9)',
          borderRadius: '50%',
          p: 0.5,
          transition: 'transform 0.3s ease',
          '&:hover': { transform: 'scale(1.15)' },
        }}
        onClick={e => {
          e.stopPropagation()
          onRocketClick()
        }}
      />
    </Tooltip>

    <CardActionArea
      component='a'
      href={project.deployment_url || undefined}
      onClick={(e: React.MouseEvent) => {
        if (!project.deployment_url) {
          e.preventDefault()
          onCardClick()
        }
      }}
      target='_blank'
      rel='noopener noreferrer'
      sx={{ cursor: !project.deployment_url ? 'help' : 'pointer' }}
    >
      <CardMedia
        component='img'
        image={displayImage}
        alt={project.title}
        loading={index < 3 ? 'eager' : 'lazy'}
        fetchPriority={index < 3 ? 'high' : 'auto'}
        onError={onImageError}
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          boxSizing: 'border-box',
          height: { xs: 200, md: 320 },
          objectFit: 'contain',
          transition: 'transform .5s ease',
          padding: 2,
        }}
      />

      {/* OVERLAY */}
      <Box
        className='overlay'
        sx={{
          position: 'absolute',
          inset: 0,
          bgcolor: theme =>
            theme.palette.mode === 'dark' ? 'rgba(16,22,34,0.95)' : 'rgba(255,255,255,0.95)',
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          opacity: { xs: 1, md: 0 },
          transition: 'opacity .3s ease',
        }}
      >
        <Box>
          <Typography variant='h6' fontWeight={700} mb={1} color='text.primary'>
            {project.title}
          </Typography>

          <Typography variant='body2' color='text.secondary' mb={2}>
            {project.description}
          </Typography>

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} flexWrap='wrap'>
            {project.tech.map((tech, i) => (
              <Chip
                key={i}
                label={tech}
                size='small'
                sx={{
                  bgcolor: theme =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(43,108,238,0.2)'
                      : 'rgba(43,108,238,0.15)',
                  color: 'primary.main',
                  fontWeight: 600,
                }}
              />
            ))}
          </Stack>
        </Box>

        {/* Call-to-action: visible en mobile y desktop al hover */}
        {/*
          NOTA: Usamos component="span" + window.open() en lugar de href
          porque este Button vive DENTRO de CardActionArea component="a".
          HTML no permite <a> dentro de <a> (ni <button> por ser interactive content).
          El span con role button + teclado mantiene la accesibilidad.
        */}
        <Button
          variant='contained'
          size='small'
          startIcon={<OpenInNewIcon />}
          component='span'
          role='button'
          tabIndex={0}
          onClick={e => {
            e.stopPropagation()
            const url = project.deployment_url || project.url
            window.open(url, '_blank', 'noopener,noreferrer')
          }}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              e.stopPropagation()
              const url = project.deployment_url || project.url
              window.open(url, '_blank', 'noopener,noreferrer')
            }
          }}
          sx={{ alignSelf: 'flex-start', mt: 2 }}
        >
          {project.deployment_url ? 'Ver demo' : 'Ver repositorio'}
        </Button>
      </Box>
    </CardActionArea>
  </Card>
)
