import { createTheme } from '@mui/material/styles'
import { palette } from './palette'
import { components, typography } from './componentOverrides'

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: palette.primary.main,
      light: palette.primary.light,
    },
    techAccent: {
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
  typography,
  components,
})
