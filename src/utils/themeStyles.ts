/**
 * Utilidades de estilos que dependen del theme MUI.
 *
 * Centralizan patrones visuales que se repiten en múltiples componentes
 * para evitar CSS duplicado y mantener consistencia.
 *
 * Uso: <Box sx={{ border: subtleBorder, bgcolor: subtleBg, ... }} />
 *
 * Todas son funciones que reciben el tema MUI como argumento (inyectado por sx).
 */
import type { Theme } from '@mui/material'

/** Borde sutil para tarjetas y contenedores */
export const subtleBorder = (theme: Theme) =>
  theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)'

/** Borde con acento primario */
export const accentBorder = (theme: Theme) =>
  theme.palette.mode === 'dark'
    ? '1px solid rgba(43,108,238,0.15)'
    : '1px solid rgba(43,108,238,0.1)'

/** Fondo s sutil para tarjetas secundarias */
export const subtleBg = (theme: Theme) =>
  theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.02)'

/** Fondo con acento primario sutil */
export const accentBg = (theme: Theme) =>
  theme.palette.mode === 'dark' ? 'rgba(43,108,238,0.15)' : 'rgba(43,108,238,0.1)'

/** Fondo con acento primario extra sutil (para áreas más grandes) */
export const accentBgSoft = (theme: Theme) =>
  theme.palette.mode === 'dark' ? 'rgba(43,108,238,0.08)' : 'rgba(43,108,238,0.05)'

/** Fondo con acento de advertencia */
export const warningBg = (theme: Theme) =>
  theme.palette.mode === 'dark' ? 'rgba(255,183,77,0.12)' : 'rgba(255,183,77,0.1)'

/** Sombra sutil en hover para tarjetas */
export const subtleHoverShadow = (theme: Theme) =>
  theme.palette.mode === 'dark' ? '0 8px 24px rgba(0,0,0,0.3)' : '0 8px 24px rgba(0,0,0,0.08)'
