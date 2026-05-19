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
