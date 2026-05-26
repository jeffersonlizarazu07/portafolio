/**
 * useInView — Hook para detectar cuando un elemento entra en el viewport.
 *
 * Usa IntersectionObserver en lugar de scroll events porque:
 * - Es más performante (no bloquea el main thread).
 * - El browser optimiza cuándo disparar la callback.
 * - No requiere librerías externas.
 *
 * @param options.threshold — 0 a 1, qué porcentaje del elemento debe ser visible (default: 0.1)
 * @param options.triggerOnce — Si true, deja de observar después de la primera detección (default: true)
 * @returns [ref, isInView] — ref para asignar al elemento, booleano si está visible
 */
import { useRef, useState, useEffect, type RefObject } from 'react'

interface UseInViewOptions {
  threshold?: number
  triggerOnce?: boolean
}

export const useInView = <T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {}
): [RefObject<T | null>, boolean] => {
  const { threshold = 0.1, triggerOnce = true } = options
  const ref = useRef<T | null>(null)
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Si ya estamos en un servidor o el browser no soporta IO, mostrar
    if (typeof IntersectionObserver === 'undefined') {
      setIsInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (triggerOnce) {
            observer.unobserve(element)
          }
        } else if (!triggerOnce) {
          setIsInView(false)
        }
      },
      { threshold }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold, triggerOnce])

  return [ref, isInView]
}
