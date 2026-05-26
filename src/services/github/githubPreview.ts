/**
 * Búsqueda de imágenes preview en repositorios de GitHub.
 *
 * Busca preview.png dinámicamente en cada repo porque los proyectos pueden
 * tener su captura en cualquier ubicación (src/assets/preview.png, docs/preview.png, etc.),
 * permitiendo que cualquier repo tenga un preview sin convenciones obligatorias.
 *
 * Usa Git Trees API con recursive=1 para buscar en TODO el árbol del repo.
 * No asume ubicación fija (ni raíz, ni assets/, ni src/assets/).
 *
 * ¿Por qué no HEAD request a raw.githubusercontent.com?
 * Intentamos esa optimización, pero raw.githubusercontent.com NO envía
 * el header Access-Control-Allow-Origin en respuestas HEAD (solo en GET).
 * El navegador bloquea la respuesta por CORS y el HEAD siempre falla.
 */
import { GITHUB_API_BASE } from './githubApi'
import type { GitHubTree } from './githubApi'

const GITHUB_RAW_BASE = 'https://raw.githubusercontent.com'

/**
 * Busca preview.png en el repositorio usando Git Trees API.
 *
 * @returns La URL completa de la imagen si existe, null si no.
 */
export const findPreviewImage = async (
  username: string,
  repoName: string,
  branch: string
): Promise<string | null> => {
  try {
    const treeUrl = `${GITHUB_API_BASE}/repos/${username}/${repoName}/git/trees/${branch}?recursive=1`
    const treeResponse = await fetch(treeUrl, {})

    if (!treeResponse.ok) return null

    const treeData = (await treeResponse.json()) as GitHubTree

    // Busca cualquier archivo que termine en preview.png en TODO el árbol
    const previewFile = treeData.tree.find(
      item => item.type === 'blob' && item.path.endsWith('preview.png')
    )

    if (!previewFile?.path) return null

    return `${GITHUB_RAW_BASE}/${username}/${repoName}/${branch}/${previewFile.path}`
  } catch {
    return null
  }
}
