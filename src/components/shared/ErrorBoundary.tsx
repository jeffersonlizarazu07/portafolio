/**
 * Error Boundary - Captura errores de componentes hijos.
 * 
 * ¿Por qué existe este componente?
 * - Si un componente falla durante el render, no crashea toda la app.
 * - Muestra una UI de fallback en vez de pantalla en blanco.
 * - Permite al usuario navegar a otras páginas si una sección falla.
 * 
 * ¿Cuándo se activa?
 * - Errores durante el render de componentes hijos.
 * - Errores en hooks de componentes hijos.
 * - El boundary NO captura errores en eventos (onClick) ni async (setTimeout).
 * 
 * ¿Por qué class component?
 * - Error Boundaries SOLO pueden ser class components.
 * - Los hooks (useEffect) no pueden capturar errores de render.
 */
import { Component, type ReactNode, useState } from 'react'
import { Box, Typography, Button } from '@mui/material'
import RefreshIcon from '@mui/icons-material/Refresh'

interface ErrorBoundaryProps {
  children: ReactNode
  /** Componente fallback personalizado por sección */
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  errorMessage: string
}

/**
 * Fallback UI cuando ocurre un error.
 * 
 * ¿Por qué diseñado así?
 * - Muestra mensaje genérico (no exponemos detalles técnicos).
 * - Botón para recargar la página (recovery).
 * - Diseño consistente con el theme del portfolio.
 */
const FallbackUI = ({ message = 'Algo salió mal', onRetry }: { message?: string; onRetry?: () => void }) => (
  <Box
    sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      p: 6,
      textAlign: 'center',
      bgcolor: 'background.paper',
      borderRadius: 3,
      m: 4,
    }}
  >
    <Typography variant='h6' color='error' gutterBottom>
      {message}
    </Typography>
    <Typography color='text.secondary' mb={3}>
      Intenta recargar la página o vuelve al inicio.
    </Typography>
    <Button variant='contained' startIcon={<RefreshIcon />} onClick={onRetry}>
      Recargar página
    </Button>
  </Box>
)

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, errorMessage: '' }
  }

  // Se llama cuando un error es thrown en un descendant
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, errorMessage: error.message }
  }

  // Para logging de errores (en producción sería un servicio como Sentry)
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, errorMessage: '' })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      // Si hay un fallback personalizado, usarlo; si no, usar el default
      if (this.props.fallback) {
        return this.props.fallback
      }
      return <FallbackUI onRetry={this.handleRetry} />
    }

    return this.props.children
  }
}

/**
 * Hook para crear un error boundary inline.
 * 
 * ¿Cuándo usarlo?
 * - Para envolver secciones específicas que podrían fallar.
 * - No sustituye el ErrorBoundary global en App.
 */
export const useErrorBoundary = () => {
  const [error, setError] = useState<Error | null>(null)

  const throwError = (err: Error) => {
    setError(err)
    throw err
  }

  if (error) {
    throw error
  }

  return { throwError }
}