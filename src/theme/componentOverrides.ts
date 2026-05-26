import type { Components, Theme } from '@mui/material/styles'

export const typography = {
  fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif',
}

export const components: Components<Theme> = {
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
      root: ({ theme }: { theme: Theme }) => ({
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: theme.palette.divider,
          },
          '&:hover fieldset': {
            borderColor: theme.palette.primary.main,
          },
          '&.Mui-focused fieldset': {
            borderColor: theme.palette.primary.main,
          },
        },
        '& .MuiInputLabel-root': {
          color: theme.palette.text.secondary,
        },
        '& .MuiOutlinedInput-input': {
          color: theme.palette.text.primary,
        },
      }),
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
}
