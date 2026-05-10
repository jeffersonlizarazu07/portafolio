import {
  Box,
  Typography,
  IconButton,
  AppBar,
  Container,
  Toolbar,
  Stack,
  Button,
} from '@mui/material'
import { Link } from 'react-router-dom'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import { config } from '@/config'
import { NavLinks } from './common/NavLinks'
import { useThemeMode } from '@/context/ThemeContext'

export const Header = () => {
  const { mode, toggleTheme } = useThemeMode()

  return (
    <AppBar
      position='fixed'
      elevation={0}
      sx={{
        backdropFilter: 'blur(12px)',
        background: theme =>
          theme.palette.mode === 'dark' ? 'rgba(15,31,48,0.7)' : 'rgba(255,255,255,0.7)',
        borderBottom: theme =>
          theme.palette.mode === 'dark'
            ? '1px solid rgba(255,255,255,0.1)'
            : '1px solid rgba(0,0,0,0.1)',
      }}
    >
      <Container maxWidth='xl'>
        <Toolbar
          disableGutters
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: 80,
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          {/* Logo */}
          <Stack direction='row' spacing={1} alignItems='center'>
            <Box
              sx={{
                width: 32,
                height: 32,
                bgcolor: 'primary.main',
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
              }}
            >
              J
            </Box>
            <Link to='/' style={{ textDecoration: 'none' }}>
              <Typography
                variant='h6'
                sx={{
                  display: { xs: 'none', sm: 'block' },
                  color: 'text.primary',
                  textDecoration: 'none',
                }}
              >
                PORTAFOLIO
              </Typography>
            </Link>
          </Stack>
          <NavLinks />

          {/* Right Actions */}
          <Stack direction='row' spacing={2} alignItems='center'>
            <IconButton
              onClick={toggleTheme}
              sx={{
                color: 'text.primary',
              }}
              aria-label='Cambiar tema'
            >
              {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
            </IconButton>
            <Button href={config.cv.url} variant='contained' target='_blank'>
              Resume
            </Button>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  )
}
