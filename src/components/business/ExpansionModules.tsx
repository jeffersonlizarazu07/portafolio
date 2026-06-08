/**
 * ExpansionModules — Grid de módulos de expansión personalizables.
 *
 * Componente presentacional puro.
 * Muestra las funcionalidades adicionales que el cliente puede contratar
 * para robustecer su solución base.
 *
 * Patrón visual:
 * - Tarjetas asimétricas con estado (disponible / próximamente).
 * - Cada módulo tiene icono, título, descripción y CTA.
 */
import { Box, Typography, Stack, Button, Chip } from '@mui/material'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import LockIcon from '@mui/icons-material/Lock'
import { Link as Router } from 'react-router-dom'
import { getNavPath } from '@/constants/navLinksArray'
import { subtleBorder, subtleHoverShadow, accentBg, subtleBg } from '@/utils/themeStyles'
import type { ExpansionModule } from '@/types/Business'

type ExpansionModulesProps = {
  modules: ExpansionModule[]
  preFillMessage?: string
}

/**
 * Construye la URL de contacto con mensaje pre-rellenado para un módulo específico.
 */
const buildModuleContactUrl = (contactPath: string, preFill: string, moduleTitle: string) => {
  const message = `${preFill} — Estoy interesado en el módulo: ${moduleTitle}`
  return `${contactPath}?mensaje=${encodeURIComponent(message)}`
}

export const ExpansionModules = ({ modules, preFillMessage }: ExpansionModulesProps) => {
  const contactPath = getNavPath('Contacto')

  if (modules.length === 0) return null

  return (
    <Box sx={{ mt: { xs: 5, md: 10 } }}>
      {/* Section Header */}
      <Typography
        variant='h4'
        fontWeight={700}
        mb={2}
        sx={{ fontSize: { xs: '1.5rem', md: '1.75rem' } }}
      >
        Expansiones Personalizables
      </Typography>
      <Typography color='text.secondary' mb={5} maxWidth={600}>
        Comienza con lo esencial y agrega funcionalidades a medida que tu negocio crece. Cada módulo
        se integra sin afectar lo que ya funciona.
      </Typography>

      {/* Modules Grid */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: '1fr 1fr',
          },
          gap: 3,
        }}
      >
        {modules.map(mod => (
          <Box
            key={mod.id}
            sx={{
              p: 3,
              borderRadius: 3,
              bgcolor: 'background.paper',
              border: subtleBorder,
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: subtleHoverShadow,
              },
              opacity: mod.isAvailable ? 1 : 0.6,
            }}
          >
            <Stack spacing={2}>
              {/* Header: Icon + Badge */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: accentBg,
                    color: 'primary.main',
                  }}
                >
                  <mod.Icon />
                </Box>
                {!mod.isAvailable && (
                  <Chip
                    icon={<LockIcon sx={{ fontSize: 14 }} />}
                    label='Próximamente'
                    size='small'
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.7rem',
                      bgcolor: subtleBg,
                    }}
                  />
                )}
              </Box>

              {/* Title */}
              <Typography variant='h6' fontWeight={700} sx={{ fontSize: '1.05rem' }}>
                {mod.title}
              </Typography>

              {/* Description */}
              <Typography variant='body2' color='text.secondary' sx={{ flex: 1 }}>
                {mod.description}
              </Typography>

              {/* CTA */}
              <Button
                component={Router}
                to={
                  preFillMessage
                    ? buildModuleContactUrl(contactPath, preFillMessage, mod.title)
                    : contactPath
                }
                variant='text'
                size='small'
                startIcon={<AddCircleOutlineIcon />}
                sx={{
                  alignSelf: 'flex-start',
                  fontWeight: 600,
                  color: mod.isAvailable ? 'primary.light' : 'text.disabled',
                }}
                disabled={!mod.isAvailable}
              >
                {mod.isAvailable ? 'Solicitar este módulo' : 'Disponible próximamente'}
              </Button>
            </Stack>
          </Box>
        ))}
      </Box>
    </Box>
  )
}
