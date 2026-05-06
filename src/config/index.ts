/**
 * Configuración centralizada del proyecto
 * Un solo lugar para cambiar configuraciones globales
 */

export const config = {
  github: {
    username: "jeffersonlizarazu07",
  },
  portfolio: {
    title: "Mi Portafolio",
    description: "Desarrollador Full Stack",
  },
} as const;

export type Config = typeof config;