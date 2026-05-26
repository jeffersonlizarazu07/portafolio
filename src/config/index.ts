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
  github: {
    username: 'jeffersonlizarazu07',
    // Token opcional: aumenta rate limit de 60 a 5000 req/hora
    // Se configura en .env como VITE_GITHUB_TOKEN
    token: import.meta.env.VITE_GITHUB_TOKEN as string | undefined,
  },

  // EmailJS - servicio para formulario de contacto
  // Los valores vienen de variables de entorno para seguridad
  email: {
    publicKey: import.meta.env.VITE_API_KEY_EMAILJS as string,
    serviceId: import.meta.env.VITE_OUTLOOK_SERVICE_ID as string,
    templateId: import.meta.env.VITE_TEMPLATE_ID as string,
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
