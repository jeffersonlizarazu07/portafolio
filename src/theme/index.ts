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
 * Tipos personalizados para backgrounds del portfolio.
 *
 * MUI solo define default y paper por defecto. Agregamos properties adicionales
 * para diferenciar visualmente cada sección del portfolio.
 */
interface PortfolioBackground {
  default: string
  secondary: string
  paper: string
  tech: string
  contact: string
}

declare module '@mui/material/styles' {
  interface TypeBackground {
    secondary: string
    tech: string
    contact: string
  }
  interface TypeText {
    label: string
  }
}

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
export const palette: {
  primary: { main: string; light: string }
  background: PortfolioBackground
  text: { primary: string; secondary: string; disabled: string; label: string }
  error: { main: string }
  success: { main: string }
  warning: { main: string }
} = {
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
}

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
      secondary: palette.background.secondary,
      paper: palette.background.paper,
      tech: palette.background.tech,
      contact: palette.background.contact,
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
/**
 * Tema claro del portfolio - Paleta Beige.
 *
 * Fondos (Base Beige):
 * - default (#FDFBFA): Fondo principal "Hueso/Almendra" - cálido y claro para Home, About
 * - secondary (#F7F3F0): Fondo "arena suave" - crea profundidad entre secciones (Projects)
 * - paper (#FFFFFF): Blanco puro - las tarjetas resaltan naturalmente sobre beige
 * - tech (#F2ECE7): Beige más terroso - identidad distinta para la cuadrícula de tecnologías
 * - contact (#EAE4DE): Beige más oscuro - base sólida y elegante para contacto
 *
 * Textos:
 * - primary (#0F172A): Azul marino profundo - elegante y legible sobre beige
 * - secondary (#475569): Gris azulado medio - para descripciones largas
 * - disabled (#94a3b8): Gris neutro - mantiene coherencia con modo oscuro
 *
 * Sombras: rgba(60, 50, 40, 0.05) - mezcla gris con toque café, natural sobre beige
 * Bordes: #E2E8F0 - muy tenues, casi desaparecen contra el fondo
 */
export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: palette.primary.main,
      light: palette.primary.light,
    },
    background: {
      default: '#FDFBFA',
      secondary: '#F7F3F0',
      paper: '#FFFFFF',
      tech: '#F2ECE7',
      contact: '#EAE4DE',
    },
    text: {
      primary: '#0F172A',
      secondary: '#475569',
      disabled: '#94a3b8',
      label: '#64748B',
    },
    error: {
      main: palette.error.main,
    },
    success: {
      main: palette.success.main,
    },
    warning: {
      main: palette.warning.main,
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
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#E2E8F0',
            },
            '&:hover fieldset': {
              borderColor: '#2b6cee',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2b6cee',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#64748B',
          },
          '& .MuiOutlinedInput-input': {
            color: '#0F172A',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(60, 50, 40, 0.08)',
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
    MuiPaper: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
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
