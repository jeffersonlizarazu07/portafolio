import './augmentation'
import type { PortfolioBackground } from './augmentation'

export const palette: {
  primary: { main: string; light: string }
  techAccent: { main: string; light: string }
  background: PortfolioBackground
  text: { primary: string; secondary: string; disabled: string; label: string }
  error: { main: string }
  success: { main: string }
  warning: { main: string }
} = {
  primary: {
    main: '#3b82f6',
    light: '#60a5fa',
  },
  techAccent: {
    main: '#61DAFB',
    light: '#88E1FC',
  },
  background: {
    default: '#0B1623',
    secondary: '#101622',
    paper: '#1A2233',
    tech: '#16223a',
    contact: '#1e293b',
  },
  text: {
    primary: '#ffffff',
    secondary: '#94a3b8',
    disabled: '#94a3b8',
    label: '#94a3b8',
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
