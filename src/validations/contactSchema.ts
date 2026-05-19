/**
 * Schema de validación Zod para el formulario de contacto.
 *
 * Múltiples .min() en cadena permiten mensajes de error específicos:
 * - .min(1) detecta si está vacío y muestra "requerido".
 * - .min(2) luego valida la longitud real.
 *
 * max() en todos los campos previene payloads enormes que podrían romper EmailJS.
 * Límite de 500 caracteres en mensaje es suficiente para un email.
 */
import { z } from 'zod'

export const contactSchema = z.object({
  from_name: z
    .string()
    .min(1, 'El nombre es requerido')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede exceder 50 caracteres'),
  from_email: z
    .string()
    .min(1, 'El correo electrónico es requerido')
    .email('Ingresa un correo electrónico válido'),
  title: z
    .string()
    .min(1, 'El asunto es requerido')
    .min(5, 'El asunto debe tener al menos 5 caracteres')
    .max(100, 'El asunto no puede exceder 100 caracteres'),
  message: z
    .string()
    .min(1, 'El mensaje es requerido')
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(500, 'El mensaje no puede exceder 500 caracteres'),
  // Honeypot: campo oculto para detectar bots.
  // Usamos .optional() en vez de .max(0) porque la validación anti-span
  // DEBE manejarse en validateSubmission, no en Zod.
  // Zod solo necesita permitir que el valor pase para que RHF lo incluya
  // en data. Si usáramos .max(0), Zod rechazaría antes de que
  // validateSubmission pueda verificar el honeypot.
  hp_field: z.string().optional(),
})

export type ContactFormData = z.infer<typeof contactSchema>
