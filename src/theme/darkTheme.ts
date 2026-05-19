import { createTheme } from '@mui/material/styles'
import { palette } from './palette'
import { components, typography } from './componentOverrides'

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: palette.primary.main,
      light: palette.primary.light,
    },
    techAccent: {
      main: palette.techAccent.main,
      light: palette.techAccent.light,
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
  typography,
  components,
})
