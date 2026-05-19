import type { PaletteColor, SimplePaletteColorOptions } from '@mui/material/styles'

export interface PortfolioBackground {
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
  interface Palette {
    techAccent: PaletteColor
  }
  interface PaletteOptions {
    techAccent?: SimplePaletteColorOptions
  }
}
