import { Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import { Header } from './Header'
import { Footer } from './Footer'
import { SkipToContent } from './SkipToContent'

/**
 * Layout global que envuelve todas las páginas.
 * Incluye Header (menú de navegación) y Footer.
 *
 * IMPORTANTE: Cada página mantiene su propio contenedor (colors, efectos, etc.)
 * porque tienen diseños visuales distintos.
 */
export const Layout = () => {
  return (
    <>
      <SkipToContent />
      <Header />
      <Box component='main' id='main-content'>
        <Outlet />
      </Box>
      <Footer />
    </>
  )
}
