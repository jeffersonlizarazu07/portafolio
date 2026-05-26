/**
 * AnimatedSection — Envuelve contenido con animación de entrada al hacer scroll.
 *
 * Usa IntersectionObserver + CSS @keyframes para ser completamente declarativo
 * y no agregar dependencias. La animación se dispara UNA vez cuando el elemento
 * entra al viewport (triggerOnce=true).
 *
 * @param delay — Delay en ms antes de iniciar la animación (para efectos stagger)
 * @param variant — 'fadeIn' | 'slideUp' (default: 'slideUp')
 */
import { type ReactNode } from 'react'
import { Box, type BoxProps } from '@mui/material'
import { useInView } from '@/hooks/useInView'

type AnimatedSectionProps = BoxProps & {
  children: ReactNode
  delay?: number
  variant?: 'fadeIn' | 'slideUp'
}

export const AnimatedSection = ({
  children,
  delay = 0,
  variant = 'slideUp',
  sx,
  ...props
}: AnimatedSectionProps) => {
  const [ref, isInView] = useInView<HTMLDivElement>({ threshold: 0.1, triggerOnce: true })

  return (
    <Box
      ref={ref}
      sx={{
        ...sx,
        opacity: 0,
        ...(isInView && {
          animation: `${variant} 0.6s ease-out ${delay}ms forwards`,
          '@keyframes fadeIn': {
            from: { opacity: 0 },
            to: { opacity: 1 },
          },
          '@keyframes slideUp': {
            from: { opacity: 0, transform: 'translateY(30px)' },
            to: { opacity: 1, transform: 'translateY(0)' },
          },
        }),
      }}
      {...props}
    >
      {children}
    </Box>
  )
}
