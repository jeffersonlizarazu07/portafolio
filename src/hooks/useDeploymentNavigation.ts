/**
 * Hook que encapsula la navegación al deployment de un proyecto
 * y la notificación cuando no hay URL disponible.
 *
 * Separa la lógica de navegación (window.open + Snackbar) del
 * componente de presentación, cumpliendo SRP y haciendo el
 * componente testeable sin mockear window.open.
 */
import { useState } from 'react'

export const useDeploymentNavigation = () => {
  const [openNotification, setOpenNotification] = useState(false)

  /**
   * Maneja el click en la tarjeta: si hay deployment_url navega a ella,
   * si no, muestra el Snackbar de notificación.
   */
  const handleCardClick = (url: string | null | undefined) => {
    if (!url) {
      setOpenNotification(true)
      return
    }
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const closeNotification = () => setOpenNotification(false)

  return { openNotification, handleCardClick, closeNotification }
}
