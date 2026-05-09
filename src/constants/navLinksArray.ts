/**
 * Enlaces de navegación del portfolio.
 * 
 * ¿Por qué existe este archivo?
 * - Centraliza las rutas de navegación en un solo lugar.
 * - Permite agregar/modificar rutas sin tocar componentes.
 * - El tipo NavLink asegura consistencia en la estructura.
 * 
 * ¿Por qué el orden es Home, Proyectos, Sobre mí, Contacto?
 * - Home primero: página de entrada default.
 * - Proyectos segundo: lo más relevante del portfolio.
 * - Sobre mí: información personal.
 * - Contacto último: menos frecuente pero importante.
 */
import type { NavLink } from '@/types/Navigation'

export const navLinksArray: NavLink[] = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Proyectos' },
  { to: '/about', label: 'Sobre mí' },
  { to: '/contact', label: 'Contacto' },
]