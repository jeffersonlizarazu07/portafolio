/**
 * Card individual de tecnología.
 *
 * Renderiza un icono y nombre con efecto hover consistente.
 * Cambia solo si cambia el diseño visual de una tech card.
 */
import { Card, CardContent, Box, Typography } from '@mui/material'
import type { TechItem } from './aboutData'

export const TechCard = ({ tech }: { tech: TechItem }) => {
  const Icon = tech.Icon

  return (
    <Card
      sx={{
        backgroundColor: 'background.tech',
        textAlign: 'center',
        transition: '0.3s',
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          transform: 'translateY(-10px)',
          borderColor: 'primary.main',
          boxShadow: theme =>
            theme.palette.mode === 'dark'
              ? '0 20px 40px rgba(0,0,0,0.3)'
              : '0 20px 40px rgba(0,0,0,0.1)',
        },
      }}
    >
      <CardContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          p: 3,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '& svg': {
              width: '100%',
              height: '100%',
              color: theme =>
                theme.palette.mode === 'dark'
                  ? theme.palette.primary.main
                  : theme.palette.text.primary,
              fill: 'currentColor',
            },
            '& img': {
              width: '100%',
              height: '100%',
              objectFit: 'contain',
            },
          }}
        >
          <Icon />
        </Box>
        <Typography fontWeight={700} color='text.secondary'>
          {tech.name}
        </Typography>
      </CardContent>
    </Card>
  )
}
