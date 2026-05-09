/**
 * MUI Theme Configuration
 * 
 * Sistema de diseño centralizado para el portfolio.
 * Soporta dark/light mode via theme provider.
 */
import { createTheme } from "@mui/material/styles";

/**
 * Paleta de colores del tema
 * Usar con: theme.palette.primary.main, etc.
 * O importar directamente: import { palette } from "@/theme"
 */
export const palette = {
  primary: {
    main: "#2b6cee",
    light: "#4a7cd2",
  },
  background: {
    default: "#0B1623",
    secondary: "#101622",
    paper: "#1A2233",
    tech: "#16223a",
    contact: "#1e293b",
  },
  text: {
    primary: "#ffffff",
    secondary: "#64748b",
    disabled: "#94a3b8",
    label: "#94a3b8",
  },
  error: {
    main: "#f44336",
  },
  success: {
    main: "#27c93f",
  },
  warning: {
    main: "#ffbd2e",
  },
} as const;

/**
 * Tema oscuro (default del portfolio)
 */
export const darkTheme = createTheme({
  palette: {
    mode: "dark",
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
    fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        variant: "outlined",
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
        maxWidth: "xl",
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
});

/**
 * Tema claro (para futuro)
 */
export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: palette.primary.main,
      light: palette.primary.light,
    },
    background: {
      default: "#ffffff",
      paper: "#f5f5f5",
    },
    text: {
      primary: "#1A2233",
      secondary: "#64748b",
      disabled: "#94a3b8",
    },
    error: {
      main: palette.error.main,
    },
  },
  typography: {
    fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          textTransform: "none",
          fontWeight: 600,
        },
      },
    },
  },
});

/**
 * Exportar tema activo por defecto (para uso futuro con toggle)
 */
export const theme = darkTheme;
