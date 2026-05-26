/**
 * Container para la sección de proyectos.
 *
 * Existe para coordinar el estado entre HeaderSection (filtros) y ProjectsList (lista).
 * Centraliza la llamada al hook useGitHubRepos.
 * Evita que cada componente haga su propia llamada a la API.
 *
 * Usa Container/Presentational pattern:
 * - El container (este archivo) maneja lógica y estado.
 * - Los componentes hijos (HeaderSection, ProjectsList) solo renderizan.
 * - Si necesitara los proyectos en otra página, solo cambio el container.
 *
 * FreelanceSection no recibe props porque es contenido estático que no depende
 * de los datos de GitHub. No necesita saber nada del estado del container.
 */
import { AnimatedSection } from '@/ui/AnimatedSection'
import { HeaderSection } from './HeaderSection'
import { ProjectsList } from './ProjectsList'
import { FreelanceSection } from './FreelanceSection'
import { useGitHubRepos } from '@/hooks/useGitHubRepos'
import { config } from '@/config'

export const ProjectsContainer = () => {
  // UNA sola instancia del hook para TODOS los hijos.
  // No separar en dos containers porque:
  // - Mantiene un solo lugar donde se consultan los repos.
  // - Si GitHub API falla, el error se maneja centralmente.
  // - Los filtros de HeaderSection afectan a ProjectsList directamente.
  const { filteredRepos, loading, error, technologies, filter, setFilter } = useGitHubRepos(
    config.github.username
  )

  return (
    <>
      {/* Filtros: tecnologías disponibles + filtro activo + setter */}
      <AnimatedSection variant='slideUp' delay={0}>
        <HeaderSection technologies={technologies} filter={filter} setFilter={setFilter} />
      </AnimatedSection>

      {/* Lista: repos filtrados + estados loading/error */}
      <AnimatedSection variant='slideUp' delay={150}>
        <ProjectsList projects={filteredRepos} loading={loading} error={error} />
      </AnimatedSection>

      {/* Sección estática: proyectos freelance */}
      <AnimatedSection variant='slideUp' delay={300}>
        <FreelanceSection />
      </AnimatedSection>
    </>
  )
}
