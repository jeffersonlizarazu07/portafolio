/**
 * Container para la sección de proyectos.
 * 
 * ¿Por qué existe este componente?
 * - Coordina el estado entre HeaderSection (filtros) y ProjectsList (lista).
 * - Centraliza la llamada al hook useGitHubRepos.
 * - Evita que cada componente haga su propia llamada a la API.
 * 
 * ¿Por qué Container/Presentational pattern aquí?
 * - El container (este archivo) maneja lógica y estado.
 * - Los componentes hijos (HeaderSection, ProjectsList) solo renderizan.
 * - Si necesitara los proyectos en otra página, solo cambio el container.
 * 
 * ¿Por qué FreelanceSection no recibe props?
 * - Es contenido estático que no depende de los datos de GitHub.
 * - No necesita saber nada del estado del container.
 */
import { HeaderSection } from './HeaderSection'
import { ProjectsList } from './ProjectsList'
import { FreelanceSection } from './FreelanceSection'
import { useGitHubRepos } from '../../hooks/useGitHubRepos'
import { config } from '@/config'

export const ProjectsContainer = () => {
  // UNA sola instancia del hook para TODOS los hijos
  // ¿Por qué no separar en dos containers?
  // - Para mantener un solo lugar donde se consultan los repos.
  // - Si GitHub API falla, el error se maneja centralmente.
  // - Los filtros de HeaderSection afectan a ProjectsList directamente.
  const { filteredRepos, loading, error, technologies, filter, setFilter } = useGitHubRepos(
    config.github.username
  )

  return (
    <>
      {/* Filtros: tecnologías disponibles + filtro activo + setter */}
      <HeaderSection technologies={technologies} filter={filter} setFilter={setFilter} />

      {/* Lista: repos filtrados + estados loading/error */}
      <ProjectsList projects={filteredRepos} loading={loading} error={error} />

      {/* Sección estática: proyectos freelance */}
      <FreelanceSection />
    </>
  )
}