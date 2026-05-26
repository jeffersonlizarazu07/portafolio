/**
 * Hook que encapsula la lógica de obtención y fallback de imágenes
 * de los proyectos, dependiente del tema (dark/light).
 *
 * Separa la responsabilidad de "cómo mostrar la imagen" del componente
 * de presentación, cumpliendo SRP y DIP.
 */
import { useThemeMode } from '@/context/ThemeContext'
import { getLanguageLogo } from '@/utils/languageLogos'
import type { GitHubRepo } from '@/types/GitHub'

type ImageErrorEvent = React.SyntheticEvent<HTMLImageElement>

export const useImageFallback = () => {
  const { mode } = useThemeMode()
  const logoColor = mode === 'dark' ? 'white' : 'black'

  /**
   * Determina qué imagen mostrar: usa project.image si existe,
   * de lo contrario usa el logo del lenguaje con el color del tema.
   */
  const getDisplayImage = (project: GitHubRepo): string =>
    project.image || getLanguageLogo(project.language, logoColor)

  /**
   * Maneja error de carga de imagen reemplazando con un fallback
   * de SimpleIcons. Previene loop infinito si el fallback también falla
   * comparando la URL actual antes de reemplazar.
   */
  const handleImageError = (event: ImageErrorEvent, language: string | null) => {
    const fallback = getLanguageLogo(language, logoColor)
    if (event.currentTarget.src === fallback) return
    event.currentTarget.src = fallback
  }

  return { getDisplayImage, handleImageError }
}
