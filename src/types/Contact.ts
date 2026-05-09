/**
 * Tipos relacionados con contacto
 */

import { ReactNode } from 'react'

/**
 * Propiedades para ContactItem (componente de contacto)
 */
export interface ContactItemProps {
  icon: ReactNode
  title: string
  value: ReactNode
  titleColor?: string
  valueColor?: string
}
