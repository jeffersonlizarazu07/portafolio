/**
 * Hook para protección anti-spam del formulario de contacto.
 *
 * Recibe minSubmitTime como parámetro en vez de importar config globalmente,
 * lo que reduce el acoplamiento y facilita los tests.
 *
 * Protege contra bots que usan HTTP requests directos al endpoint.
 * Honeypot atrapa bots scrapers, pero no bots que envían forms directamente.
 *
 * Validación de tiempo mínimo (minSubmitTime):
 * Un humano tarda al menos unos segundos en completar el form,
 * mientras que bots pueden enviar instantáneamente.
 *
 * Validación de interacción:
 * Algunos bots ejecutan JS y pueden enviar el form, pero si no interactuaron
 * con los campos, probablemente son automatizados.
 * onFocus (hacer click en un campo) = interacción confirmada.
 */
import { useState } from 'react'

export const useSpamProtection = ({ minSubmitTime }: { minSubmitTime: number }) => {
  // Tiempo cuando se montó el componente
  const [submitTime] = useState(() => Date.now())
  const [spamError, setSpamError] = useState('')
  const [hasInteracted, setHasInteracted] = useState(false)

  const validateSubmission = (data: { hp_field?: string }) => {
    // Honeypot: si tiene contenido, es bot
    if (data.hp_field) {
      if (import.meta.env.DEV) {
        console.warn('Spam detectado: honeypot activado')
      }
      return false
    }

    // Tiempo mínimo: menos de minSubmitTime segundos = sospechoso
    if ((Date.now() - submitTime) / 1000 < minSubmitTime) {
      setSpamError('Por favor, espera un momento antes de enviar.')
      return false
    }

    // Interacción: no marcó ningún campo = sospechoso
    if (!hasInteracted) {
      setSpamError('Por favor, interactúa con el formulario antes de enviar.')
      return false
    }

    setSpamError('')
    return true
  }

  // Se llama cuando el usuario hace focus en cualquier campo
  const handleInteraction = () => {
    if (!hasInteracted) setHasInteracted(true)
  }

  return { spamError, validateSubmission, handleInteraction }
}
