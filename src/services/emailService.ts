/**
 * Servicio de envío de email para el formulario de contacto.
 *
 * Separa la lógica de envío (EmailJS) del componente de formulario.
 * El componente solo llama a sendContactEmail(data) y maneja el resultado.
 */
import emailjs from '@emailjs/browser'
import { config } from '@/config'
import type { ContactFormData } from '@/validations/contactSchema'

export const sendContactEmail = async (data: ContactFormData): Promise<void> => {
  await emailjs.send(config.email.serviceId, config.email.templateId, data, config.email.publicKey)
}
