import {
  Box,
  Stack,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
} from "@mui/material";
import { ReactIcon } from "../../assets/tech-icons/React";
import { TypeScriptIcon } from "../../assets/tech-icons/TypeScript";
import { NodeIcon } from "../../assets/tech-icons/Node";
import { TailwindIcon } from "../../assets/tech-icons/Tailwind";
import { ExpressIcon } from "../../assets/tech-icons/Express";
import { DockerIcon } from "../../assets/tech-icons/Docker";
import LinkIcon from "@mui/icons-material/Link";

const techStack = [
  { name: "React", icon: <ReactIcon /> },
  { name: "TypeScript", icon: <TypeScriptIcon /> },
  { name: "Node.js", icon: <NodeIcon /> },
  { name: "Express.js", icon: <ExpressIcon /> },
  { name: "Tailwind", icon: <TailwindIcon /> },
  { name: "Docker", icon: <DockerIcon /> },
];

const certifications = [
  {
    institution: "Duke University",
    title: "Programming Foundations with JavaScript, HTML and CSS.",
    url: "https://coursera.org/verify/YTAQCYJK66NM",
    icon: <LinkIcon />,
    buttonLabel: "URL",
    plataform: "Coursera",
  },
  {
    institution: "Meta",
    title: "Introducción al desarrollo de back-end.",
    url: "https://coursera.org/verify/SWRQLLIUVW5B",
    icon: <LinkIcon />,
    buttonLabel: "URL",
    plataform: "Coursera",
  },
];

export const TechSection = () => {
  return (
    <Box>
      <Stack spacing={10}>
        {/* Header */}
        <Stack direction={{ xs: "column", md: "row" }} alignItems="center" spacing={{ xs: 2, md: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight={800}>
              Mi Ecosistema
            </Typography>
            <Typography color="#ffffff" maxWidth={500}>
              Me especializo en el desarrollo full stack con JavaScript y
              tecnologías modernas del ecosistema web, complementando mi
              experiencia con conocimientos en otras herramientas y lenguajes
              orientados a la construcción de software.
            </Typography>
          </Box>
        </Stack>

        {/* Tech Grid */}
        <Grid container spacing={4}>
          {techStack.map((tech, index) => (
            <Grid size={{ xs: 6, md: 4, lg: 2 }} key={index}>
              <Card
                sx={{
                  backgroundColor: "#16223a",
                  textAlign: "center",
                  transition: "0.3s",
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    borderColor: "primary.main",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
                  },
                }}
              >
                <CardContent
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 2,
                    p: 3,
                  }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      "& svg": {
                        width: "100%",
                        height: "100%",
                        color: "primary.main",
                      },
                      "& img": {
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      },
                    }}
                  >
                    {tech.icon}
                  </Box>
                  <Typography fontWeight={700} color="#64748b">
                    {tech.name}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Experience & Certifications */}
        <Grid container spacing={4} sx={{ mb: 15 }}>
          {/* Experience Card */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                p: 4,
                height: "100%",
                backgroundColor: "#16223a",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
                <Typography variant="h2" fontWeight={800} color="primary.main">
                  1+
                </Typography>
                <Typography variant="h5" color="#ffffff">
                  años de experiencia
                </Typography>
              </Stack>
              <Typography variant="body1" color="#64748b" mt={2}>
                Desarrollando soluciones web modernas y escalables
              </Typography>
            </Box>
          </Grid>

          {/* Certifications */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Box
              sx={{
                p: 4,
                height: "100%",
                backgroundColor: "#16223a",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
              }}
            >
              <Stack spacing={3}>
                <Typography
                  variant="caption"
                  color="#64748b"
                  fontWeight={700}
                  letterSpacing={2}
                >
                  CERTIFICACIONES
                </Typography>

                <Grid container spacing={3}>
                  {certifications.map((cert, index) => (
                    <Grid size={{ xs: 12, sm: 6 }} key={index}>
                      <Box
                        sx={{
                          p: 2,
                          height: "100%",
                          minHeight: 140,
                          backgroundColor: "rgba(97, 218, 251, 0.05)",
                          border: "1px solid",
                          borderColor: "rgba(97, 218, 251, 0.2)",
                          borderRadius: 2,
                        }}
                      >
                        <Stack spacing={2}>
                          <Stack
                            direction={{ xs: "column", sm: "row" }}
                            justifyContent="space-between"
                            alignItems={{ xs: "flex-start", sm: "center" }}
                          >
                            <Box>
                              <Chip
                                label={cert.institution}
                                size="small"
                                sx={{
                                  bgcolor: "rgba(97, 218, 251, 0.1)",
                                  color: "primary.main",
                                  fontWeight: 600,
                                }}
                              />
                              <Chip
                                label={cert.plataform}
                                size="small"
                                sx={{
                                  bgcolor: "rgba(97, 218, 251, 0.1)",
                                  color: "primary.main",
                                  fontWeight: 600,
                                }}
                              />
                            </Box>
                            <Button
                              variant="text"
                              size="small"
                              startIcon={<LinkIcon />}
                              href={cert.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              sx={{
                                color: "primary.main",
                                textTransform: "none",
                                "&:hover": {
                                  backgroundColor: "rgba(97, 218, 251, 0.1)",
                                },
                              }}
                            >
                              {cert.buttonLabel}
                            </Button>
                          </Stack>
                          <Typography
                            variant="body2"
                            color="#ffffff"
                            fontWeight={500}
                          >
                            {cert.title}
                          </Typography>
                        </Stack>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  );
};
