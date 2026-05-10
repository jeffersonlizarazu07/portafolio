/**
 * Theme Context - Manejo global del tema oscuro/claro.
 *
 * Provee:
 * - Estado actual del tema (dark/light)
 * - Función para togglear entre temas
 * - Persistencia en localStorage
 * - Detección de preferencia del sistema (prefers-color-scheme)
 */
import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { ThemeProvider as MuiThemeProvider, PaletteMode } from '@mui/material'
import { darkTheme, lightTheme } from '@/theme'

interface ThemeContextType {
  mode: PaletteMode
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const STORAGE_KEY = 'portfolio-theme-mode'

/**
 * Hook para usar el theme context.
 * Lanza error si se usa fuera del ThemeProvider.
 */
export const useThemeMode = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeMode must be used within a ThemeProvider')
  }
  return context
}

/**
 * Provider principal del tema.
 *
 * carga la preferencia desde localStorage o detecta la del sistema.
 * Guarda cambios en localStorage automáticamente.
 */
export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [mode, setMode] = useState<PaletteMode>(() => {
    // 1. Verificar localStorage
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'light' || stored === 'dark') {
      return stored
    }

    // 2. Detectar preferencia del sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light'
    }

    // 3. Default: oscuro
    return 'dark'
  })

  // Persistir cambios en localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, mode)
    // Actualizar atributo data-theme en body para CSS del scrollbar
    document.body.setAttribute('data-theme', mode)
  }, [mode])

  // Escuchar cambios en la preferencia del sistema (opcional)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)')
    const handleChange = (e: MediaQueryListEvent) => {
      // Solo auto-cambiar si el usuario no ha establecido preferencia manual
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) {
        setMode(e.matches ? 'light' : 'dark')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const toggleTheme = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const theme = useMemo(() => (mode === 'dark' ? darkTheme : lightTheme), [mode])

  const value = useMemo(
    () => ({
      mode,
      toggleTheme,
    }),
    [mode]
  )

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  )
}