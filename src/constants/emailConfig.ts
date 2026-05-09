// Configuración de EmailJS para el formulario de contacto
export const emailConfig = {
  publicKey: import.meta.env.VITE_API_KEY_EMAILJS as string,
  serviceId: import.meta.env.VITE_OUTLOOK_SERVICE_ID as string,
  templateId: import.meta.env.VITE_TEMPLATE_ID as string,
} as const

// Constantes de protección anti-spam
export const spamProtection = {
  minSubmitTime: 5, // segundos mínimos antes de permitir envío
} as const
