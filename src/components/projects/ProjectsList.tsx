import {
  Box,
  Grid,
  Card,
  CardMedia,
  Typography,
  Stack,
  Chip,
  Skeleton,
  CardActionArea,
} from "@mui/material";
import { getLanguageLogo } from "../../utils/languageLogos";
import type { GitHubRepo } from "../../types/GitHub";

// Recibe los proyectos DESDE Props (no del hook)
type ProjectsListProps = {
  projects: GitHubRepo[];
  loading: boolean;
  error: string | null;
};

export const ProjectsList = ({
  projects,
  loading,
  error,
}: ProjectsListProps) => {
  if (loading) {
    return (
      <Grid container spacing={4}>
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <Grid size={{ xs: 12, md: 6, lg: 4 }} key={n}>
            <Skeleton
              variant="rectangular"
              height={320}
              sx={{ borderRadius: 3 }}
            />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (error) {
    return (
      <Typography color="error" textAlign="center">
        Error: {error}
      </Typography>
    );
  }

  // Fallback a logo del lenguaje cuando la imagen no carga (404)
  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement>,
    language: string | null,
  ) => {
    event.currentTarget.src = getLanguageLogo(language);
  };

  // Determina la imagen a mostrar: usa project.image si existe, si no usa el logo del lenguaje
  const getDisplayImage = (project: GitHubRepo): string => {
    return project.image || getLanguageLogo(project.language);
  };

  return (
    <Grid container spacing={4}>
      {projects.map((project, index) => (
        <Grid size={{ xs: 12, md: 6, lg: 4 }} key={index}>
          <Card
            sx={{
              position: "relative",
              overflow: "hidden",
              borderRadius: 3,
              bgcolor: "#1A2233",
              "&:hover .overlay": {
                opacity: 1,
              },
              "&:hover img": {
                transform: "scale(1.05)",
              },
            }}
          >
            <CardActionArea
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              <CardMedia
                component="img"
                image={getDisplayImage(project)}
                alt={project.title}
                onError={(e) => handleImageError(e, project.language)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  boxSizing: "border-box",
                  height: 320,
                  objectFit: "contain",
                  transition: "transform .5s ease",
                  padding: 2,
                }}
              />

              {/* OVERLAY */}
              <Box
                className="overlay"
                sx={{
                  position: "absolute",
                  inset: 0,
                  bgcolor: "rgba(16,22,34,0.95)",
                  p: 4,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  opacity: 0,
                  transition: "opacity .3s ease",
                }}
              >
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={700}
                    mb={1}
                    color="#ffffff"
                  >
                    {project.title}
                  </Typography>

                  <Typography variant="body2" color="grey.400" mb={2}>
                    {project.description}
                  </Typography>

                  <Stack direction={{ xs: "column", sm: "row" }} spacing={1} flexWrap="wrap">
                    {project.tech.map((tech, i) => (
                      <Chip
                        key={i}
                        label={tech}
                        size="small"
                        sx={{
                          bgcolor: "rgba(43,108,238,0.2)",
                          color: "#2b6cee",
                          fontWeight: 600,
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              </Box>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};
