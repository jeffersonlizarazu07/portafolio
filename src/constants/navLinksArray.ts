/**
 * Enlaces de navegación del portfolio.
 *
 * Centraliza las rutas de navegación en un solo lugar.
 * Permite agregar/modificar rutas sin tocar componentes.
 * El tipo NavLink asegura consistencia en la estructura.
 *
 * Orden específico: Home, Proyectos, Sobre mí, Contacto.
 * - Home primero: página de entrada default.
 * - Proyectos segundo: lo más relevante del portfolio.
 * - Sobre mí: información personal.
 * - Contacto último: menos frecuente pero importante.
 */
import type { NavLink } from '@/types/Navigation'

export const navLinksArray: NavLink[] = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Proyectos' },
  { to: '/solutions', label: 'Soluciones' },
  { to: '/about', label: 'Sobre mí' },
  { to: '/contact', label: 'Contacto' },
]

/**
 * Obtiene la ruta de navegación a partir de la label.
 * Lanza error en DEVELOPMENT si la label no existe — evita crashes silenciosos en runtime.
 * En producción, el throw es tan válido como en dev: es un error de programación.
 */
export const getNavPath = (label: NavLink['label']): string => {
  const link = navLinksArray.find(n => n.label === label)
  if (!link) {
    throw new Error(
      `[navLinksArray] No se encontró ruta para label: "${label}". Revisa que exista en navLinksArray.`
    )
  }
  return link.to
}
