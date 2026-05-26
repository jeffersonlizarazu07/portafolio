import { memo } from 'react'
import { Box, Typography, Paper } from '@mui/material'
import { useTheme } from '@mui/material/styles'

export const CodeImage = memo(function CodeImage() {
  const theme = useTheme()
  const sym = theme.palette.mode === 'dark' ? '#89ddff' : '#1a1a1a' // Color para símbolos (Azul/Gris)
  const key = theme.palette.mode === 'dark' ? '#82aaff' : '#086527' // Color para propiedades
  const val = theme.palette.mode === 'dark' ? '#c3e88d' : '#24292e' // Color para valores (Strings)
  const kw = theme.palette.mode === 'dark' ? '#c792ea' : '#1a1a1a' // Color para palabras reservadas
  const themeNameColor = theme.palette.mode === 'dark' ? '#ffcb6b' : '#b07d0a'

  return (
    <Box sx={{ position: 'relative' }}>
      <Paper
        elevation={1}
        sx={{
          width: { xs: '100%', sm: '90%', md: '70%', lg: '34.375rem' },
          maxWidth: '100%',
          overflowX: 'auto',
          p: { xs: 2, sm: 3, md: 3 },
          borderRadius: 2,
          bgcolor: theme => (theme.palette.mode === 'dark' ? '#242527' : '#e2f0cd'),
          border: theme =>
            theme.palette.mode === 'dark'
              ? '1px solid rgba(255, 255, 255, 0.05)'
              : '1px solid rgba(0, 0, 0, 0.1)',
          transition: 'transform 0.3s',
          '&:hover': { transform: 'scale(1.01)' },
        }}
      >
        {/* Cabecera Estilo Mac */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: { xs: 1.5, sm: 2, md: 3 } }}>
          <Box
            sx={{
              width: { xs: 8, sm: 10, md: 12 },
              height: { xs: 8, sm: 10, md: 12 },
              borderRadius: '50%',
              bgcolor: '#ff5f56',
            }}
          />
          <Box
            sx={{
              width: { xs: 8, sm: 10, md: 12 },
              height: { xs: 8, sm: 10, md: 12 },
              borderRadius: '50%',
              bgcolor: '#ffbd2e',
            }}
          />
          <Box
            sx={{
              width: { xs: 8, sm: 10, md: 12 },
              height: { xs: 8, sm: 10, md: 12 },
              borderRadius: '50%',
              bgcolor: '#27c93f',
            }}
          />
          <Typography
            variant='caption'
            sx={{
              ml: { xs: 1, sm: 1.5, md: 2 },
              color: theme => (theme.palette.mode === 'dark' ? '#ffffff99' : '#24292e'),
              fontFamily: 'monospace',
              fontSize: { xs: '0.75rem', sm: '0.85rem', md: '0.85rem' },
            }}
          >
            ThemeConfig.ts
          </Typography>
        </Box>

        {/* Bloque de Código - Usamos etiquetas span nativas para mayor estabilidad */}
        <Box
          component='pre'
          sx={{
            fontFamily: '"Fira Code", monospace',
            fontSize: { xs: '0.7rem', sm: '0.75rem', md: '0.85rem' },
            lineHeight: 1.6,
            color: theme => (theme.palette.mode === 'dark' ? '#a6accd' : '#24292e'),
            margin: 0,
            overflowX: 'auto',
            whiteSpace: 'pre',
          }}
        >
          <span style={{ color: kw }}>export const</span>{' '}
          <span style={{ color: themeNameColor }}>theme</span> ={' '}
          <span style={{ color: kw }}>createTheme</span>
          <span style={{ color: sym }}>{'({'}</span>
          {`
   `}
          <span style={{ color: key }}>palette</span>
          <span style={{ color: sym }}>: {'{'}</span>
          {`
     `}
          <span style={{ color: key }}>mode</span>
          <span style={{ color: sym }}>:</span> <span style={{ color: val }}>'dark'</span>
          <span style={{ color: sym }}>,</span>
          {`
     `}
          <span style={{ color: key }}>primary</span>
          <span style={{ color: sym }}>: {'{'}</span>
          {`
   `}
          <span style={{ color: key }}>main</span>
          <span style={{ color: sym }}>:</span> <span style={{ color: val }}>'#2196f3'</span>
          {`
     `}
          <span style={{ color: sym }}>{'},'}</span>
          {`
     `}
          <span style={{ color: key }}>background</span>
          <span style={{ color: sym }}>: {'{'}</span>
          {`
   `}
          <span style={{ color: key }}>default</span>
          <span style={{ color: sym }}>:</span> <span style={{ color: val }}>'#121212'</span>
          {`
     `}
          <span style={{ color: sym }}>{'}'}</span>
          {`
   `}
          <span style={{ color: sym }}>{'},'}</span>
          {`
   `}
          <span style={{ color: key }}>typography</span>
          <span style={{ color: sym }}>: {'{'}</span>
          {`
     `}
          <span style={{ color: key }}>fontFamily</span>
          <span style={{ color: sym }}>:</span> <span style={{ color: val }}>'Roboto'</span>
          {`
   `}
          <span style={{ color: sym }}>{'}'}</span>
          {`
 `}
          <span style={{ color: sym }}>{'});'}</span>
        </Box>
      </Paper>
    </Box>
  )
})
