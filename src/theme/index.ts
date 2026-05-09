/**
 * MUI Theme Configuration
 *
 * Sistema de diseño centralizado para el portfolio.
 * Permite cambiar colores y estilos desde un solo lugar.
 *
 * No usar directamente colores hex en componentes.
 * Si necesitas cambiar el color primario, cambias aquí y se actualiza en todo.
 * Para implementar dark/light mode, solo cambias el theme activo.
 */
import { createTheme } from '@mui/material/styles'

/**
 * Paleta de colores del tema.
 *
 * Colores específicos para mantener coherencia visual:
 * - background.default (#0B1623): Azul muy oscuro, no negro puro.
 *   Un negro puro puede sentirse "agresivo", este tono es más profesional.
 * - primary (#2b6cee): Azul eléctrico que contrasta bien con el fondo oscuro.
 *   Es moderno pero no agresivo.
 * - text.secondary (#64748b): Gris que no compite con el texto principal.
 *
 * Separar background en default, secondary, paper, tech, contact:
 * Cada sección tiene un propósito visual diferente.
 * Projects necesita menor contraste que Home.
 * Tech y Contact tienen elementos más densos que necesitan fondos sutilmente distintos.
 */
export const palette = {
  primary: {
    main: '#2b6cee',
    light: '#4a7cd2',
  },
  background: {
    default: '#0B1623', // Home, Contact, About
    secondary: '#101622', // Projects - un poco más claro para variar
    paper: '#1A2233', // Cards y elementos elevados
    tech: '#16223a', // Sección de tecnologías - cards con borde
    contact: '#1e293b', // Items de contacto - ligeramente diferenciado
  },
  text: {
    primary: '#ffffff',
    secondary: '#64748b', // Texto que no es главный pero necesita ser legible
    disabled: '#94a3b8', // Estados disabled
    label: '#94a3b8', // Labels de formularios, placeholders
  },
  error: {
    main: '#f44336',
  },
  success: {
    main: '#27c93f',
  },
  warning: {
    main: '#ffbd2e',
  },
} as const

/**
 * Tema oscuro (default del portfolio).
 *
 * borderRadius: 12 para buttons - redondeado pronunciado que se siente moderno
 * pero no infantil. Un buen balance entre moderno y profesional.
 *
 * textTransform: 'none' - evitamos que MUI uppercase los botones automáticamente.
 * Queremos controlar el texto visible nosotros.
 *
 * maxWidth: 'xl' en Container default - evita que el contenido se estire demasiado
 * en pantallas grandes. xl = 1920px, suficiente para la mayoría de monitores.
 */
export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: palette.primary.main,
      light: palette.primary.light,
    },
    background: {
      default: palette.background.default,
      paper: palette.background.paper,
    },
    text: {
      primary: palette.text.primary,
      secondary: palette.text.secondary,
      disabled: palette.text.disabled,
    },
    error: {
      main: palette.error.main,
    },
  },
  typography: {
    fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
    MuiContainer: {
      defaultProps: {
        maxWidth: 'xl',
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
        },
      },
    },
  },
})

/**
 * Tema claro (para futuro).
 *
 * Invierte los colores de background pero mantiene text.secondary.
 * En modo claro, el texto secundario debe ser menos visible que en modo oscuro.
 * Los grises funcionan bien en ambos temas sin cambios.
 */
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: palette.primary.main,
      light: palette.primary.light,
    },
    background: {
      default: '#ffffff',
      paper: '#f5f5f5',
    },
    text: {
      primary: '#1A2233',
      secondary: '#64748b',
      disabled: '#94a3b8',
    },
    error: {
      main: palette.error.main,
    },
  },
  typography: {
    fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
})

/**
 * Exportar tema activo por defecto.
 *
 * Para implementar el toggle futuro sin cambiar imports en toda la app.
 * Solo cambias aquí el tema activo.
 */
export const theme = darkTheme