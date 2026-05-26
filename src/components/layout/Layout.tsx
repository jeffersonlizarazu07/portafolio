import { useLocation, Outlet } from 'react-router-dom'
import { Box } from '@mui/material'
import { Header } from './Header'
import { Footer } from './Footer'
import { SkipToContent } from './SkipToContent'

/**
 * Layout global que envuelve todas las páginas.
 * Incluye Header (menú de navegación) y Footer.
 *
 * La page transition usa key={location.pathname} para que React monte/desmonte
 * el Outlet en cada navegación y dispare la animación CSS de entrada.
 * Para exit animations completas se necesitaría AnimatePresence (Framer Motion).
 */
export const Layout = () => {
  const location = useLocation()

  return (
    <>
      <SkipToContent />
      <Header />
      <Box component='main' id='main-content'>
        <Box
          key={location.pathname}
          sx={{
            animation: 'pageEnter 0.4s ease-out',
            '@keyframes pageEnter': {
              from: { opacity: 0, transform: 'translateY(12px)' },
              to: { opacity: 1, transform: 'translateY(0)' },
            },
          }}
        >
          <Outlet />
        </Box>
      </Box>
      <Footer />
    </>
  )
}
