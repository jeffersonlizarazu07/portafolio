import {
  Box,
  Typography,
  IconButton,
  AppBar,
  Container,
  Toolbar,
  Stack,
  Button,
  Drawer,
} from '@mui/material'
import { Link } from 'react-router-dom'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import MenuIcon from '@mui/icons-material/Menu'
import { config } from '@/config'
import { NavLinks } from './common/NavLinks'
import { useThemeMode } from '@/context/ThemeContext'
import { useState } from 'react'

export const Header = () => {
  const { mode, toggleTheme } = useThemeMode()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
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
              height: { xs: 64, md: 80 },
              px: { xs: 2, sm: 3, md: 4 },
            }}
          >
            {/* Logo */}
            <Stack direction='row' spacing={1} alignItems='center'>
              <Box
                component='svg'
                viewBox='0 0 32 32'
                sx={{
                  width: 32,
                  height: 32,
                  transition: 'transform 0.3s ease',
                  '&:hover': { transform: 'scale(1.1)' },
                }}
              >
                <defs>
                  <linearGradient id='logo-gradient' x1='0%' y1='0%' x2='100%' y2='100%'>
                    <stop offset='0%' stopColor='#3b82f6' />
                    <stop offset='100%' stopColor='#60a5fa' />
                  </linearGradient>
                </defs>
                <rect width='32' height='32' rx='8' fill='url(#logo-gradient)' />
                <text
                  x='16'
                  y='22'
                  textAnchor='middle'
                  fill='white'
                  fontSize='18'
                  fontWeight='bold'
                  fontFamily='system-ui, sans-serif'
                >
                  J
                </text>
              </Box>
              <Link to='/' style={{ textDecoration: 'none' }}>
                <Typography
                  variant='h6'
                  sx={{
                    display: { xs: 'none', sm: 'block' },
                    color: 'text.primary',
                    textDecoration: 'none',
                    fontWeight: 800,
                    letterSpacing: 2,
                  }}
                >
                  JL
                </Typography>
              </Link>
            </Stack>

            {/* Mobile Menu Button */}
            <IconButton
              edge='start'
              sx={{ display: { xs: 'flex', sm: 'none' } }}
              onClick={() => setMobileOpen(true)}
              aria-label='Abrir menú'
            >
              <MenuIcon />
            </IconButton>

            {/* Desktop NavLinks */}
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
              <Button
                href={config.cv.url}
                variant='contained'
                target='_blank'
                rel='noopener noreferrer'
              >
                Resume
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        sx={{ width: 250 }}
        variant='temporary'
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Toolbar>
          <Typography variant='h6' noWrap>
            PORTAFOLIO
          </Typography>
          <IconButton
            sx={{ position: 'absolute', right: 8, top: 8 }}
            onClick={() => setMobileOpen(false)}
          >
            <MenuIcon fontSize='small' />
          </IconButton>
        </Toolbar>
        <Box sx={{ mt: 3, ml: 2 }}>
          <NavLinks direction='column' spacing={3} hideOnXs={false} />
        </Box>
      </Drawer>
    </>
  )
}
