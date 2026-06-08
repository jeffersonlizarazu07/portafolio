/**
 * Configuración centralizada del proyecto.
 *
 * ¿Por qué centralizar aquí?
 * - Un solo lugar para cambiar cualquier configuración.
 * - Reduce imports dispersos en el proyecto.
 * - Easy de encontrar y modificar valores.
 *
 * ¿Por qué no todo en .env?
 * - Las variables de .env son para secrets (API keys, tokens).
 * - Los valores que no cambian (URLs, usernames) van aquí.
 */
export const config = {
  // GitHub - usuario cuyos repos se muestran
  // NOTA: No usamos token de autenticación.
  // La API pública de GitHub da 60 req/hora POR IP visitante,
  // y el caché en localStorage reduce las llamadas a ~1 por visitante.
  // Un token VITE_ se expondría en el bundle del cliente y no es seguro.
  github: {
    username: 'jeffersonlizarazu07',
  },

  // Protección anti-spam
  // ¿Por qué estos valores específicos?
  // - 5 segundos mínimo: suficiente para un humano, muy rápido para bots
  spamProtection: {
    minSubmitTime: 5,
  },

  // Links a redes sociales
  social: {
    github: 'https://github.com/jeffersonlizarazu07',
    linkedin: 'https://www.linkedin.com/in/jefferson-lizarazu/',
    email: 'mailto:jeffersonlizarazu@hotmail.com?cc=jeffersonliza21@gmail.com',
  },

  // Demo de catálogo para Soluciones B2B
  // Actualizar con URL real del deploy cuando esté lista
  business: {
    catalogDemoUrl: 'https://demo-storage-catalog.vercel.app/',
  },

  // Link al CV
  cv: {
    url: '/cv/CV-Jefferson-Lizarazu.pdf',
  },

  // Información del portfolio
  portfolio: {
    title: 'Mi Portafolio',
    description: 'Desarrollador Full Stack',
  },
} as const

export type Config = typeof config
