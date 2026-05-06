import { Box, Typography, Stack, Button } from "@mui/material";

// Recibe las tecnologías y filter DESDE Props (no del hook)
type HeaderSectionProps = {
  technologies: string[];
  filter: string;
  setFilter: (filter: string) => void;
};

export const HeaderSection = ({ technologies, filter, setFilter }: HeaderSectionProps) => {

  return (
    <Box maxWidth={600} mb={8} marginTop={6}>
      <Typography variant="h3" fontWeight={700} gutterBottom>
        Mis{" "}
        <Box component="span" color="primary.main">
          proyectos
        </Box>
      </Typography>
      <Typography color="grey.400" marginBottom="2rem">
        A continuación se presentan algunos de los proyectos que he desarrollado
        y en los que he participado, enfoados en el desarrollo de aplicaciones
        web modernas.
      </Typography>

      {/* FILTER BUTTONS - DINÁMICOS BASADOS EN TECNOLOGÍAS */}
      <Stack direction={{ xs: "column", sm: "row" }} flexWrap="wrap" mb={8} sx={{ gap: 2 }}>
        {/* Botón "Todos" siempre primero */}
        <Button 
          variant={filter === "Todos" ? "contained" : "outlined"}
          onClick={() => setFilter("Todos")}
        >
          Todos
        </Button>
        
        {/* Botones dinámicos por cada tecnología */}
        {technologies.map((tech) => (
          <Button
          
            key={tech}
            variant={filter === tech ? "contained" : "outlined"}
            onClick={() => setFilter(tech)}
          >
            {tech}
          </Button>
        ))}
      </Stack>
    </Box>
  );
};
