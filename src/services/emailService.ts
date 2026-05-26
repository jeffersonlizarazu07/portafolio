/**
 * Servicio de envío de email para el formulario de contacto.
 *
 * Envía los datos a la serverless function /api/contact en Vercel.
 * La función se encarga de validar, aplicar rate limiting y llamar a EmailJS
 * con las credenciales server-side (sin exponer private key al cliente).
 *
 * El componente solo llama a sendContactEmail(data) y maneja el resultado.
 */
import type { ContactFormData } from '@/validations/contactSchema'

export const sendContactEmail = async (data: ContactFormData): Promise<void> => {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from_name: data.from_name,
      from_email: data.from_email,
      title: data.title,
      message: data.message,
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }))
    throw new Error(errorData.message || 'Error al enviar el mensaje')
  }
}
