import { HeaderSection } from "./HeaderSection";
import { ProjectsList } from "./ProjectsList";
import { FreelanceSection } from "./FreelanceSection";
import { useGitHubRepos } from "../../hooks/useGitHubRepos";
import { config } from "@/config";

// Este componente ENVUELVE a HeaderSection y ProjectsList
// Comparte el mismo hook (mismo estado) con ambos
export const ProjectsContainer = () => {
  // UNA sola instancia del hook para TODOS los hijos
  const { filteredRepos, loading, error, technologies, filter, setFilter } = 
    useGitHubRepos(config.github.username);

  return (
    <>
      {/* Pasa las props a HeaderSection */}
      <HeaderSection 
        technologies={technologies} 
        filter={filter} 
        setFilter={setFilter} 
      />
      
      {/* Pasa los repos filtrados a ProjectsList */}
      <ProjectsList 
        projects={filteredRepos} 
        loading={loading} 
        error={error} 
      />
      
      <FreelanceSection />
    </>
  );
};