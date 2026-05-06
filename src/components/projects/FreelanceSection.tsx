import { CVLink } from "@/constants/curriculumVitaeLink";
import { Box, Typography, Stack, Button, Link } from "@mui/material";
import { navLinksArray } from "@/constants/navLinksArray";
import { Link as Router } from "react-router-dom";

export const FreelanceSection = () => {
  return (
    <Box
      textAlign="center"
      mt={20}
      pt={10}
      borderTop="1px solid rgba(255,255,255,0.1)"
    >
      <Typography variant="h4" fontWeight={700} mb={3}>
        ¿Tienes un proyecto en mente?
      </Typography>

      <Typography color="grey.400" maxWidth={600} mx="auto" mb={5}>
        Actualmente me encuentro disponible como desarrollador freelance. Puedo
        ayudarte a convertir tu idea en una aplicación web funcional y
        escalable.
      </Typography>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={3}
        justifyContent="center"
      >
        <Link to={navLinksArray[3].to} component={Router} underline="none">
          <Button variant="contained" size="large">
            Iniciar Proyecto
          </Button>
        </Link>
        <Button href={CVLink} variant="outlined" size="large" target="_blank">
          Ver CV
        </Button>
      </Stack>
    </Box>
  );
};
