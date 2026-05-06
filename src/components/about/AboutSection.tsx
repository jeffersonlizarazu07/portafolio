import {
  Grid,
  Box,
  Typography,
  Button,
  Stack,
  Chip,
  Link,
} from "@mui/material";
import { Link as Router } from "react-router-dom";
import DownloadIcon from "@mui/icons-material/Download";
import { CVLink } from "../../constants/curriculumVitaeLink";
import photo from "../../assets/photo.jpg";
import { navLinksArray } from "@/constants/navLinksArray";

export const AboutSection = () => {
  return (
    <Grid container spacing={10} alignItems="center" mb={20}>
      {/* Image */}
      <Grid size={{ xs: 12, lg: 5 }}>
        <Box sx={{ position: "relative", maxWidth: 400, mx: "auto" }}>
          <Box
            component="img"
            src={photo}
            sx={{
              width: "100%",
              borderRadius: 3,
              objectFit: "cover",
              filter: "grayscale(100%)",
              transition: "0.6s",
              "&:hover": {
                filter: "grayscale(0%)",
              },
            }}
          />

          {/* Experience Badge */}
          <Box
            sx={{
              position: "absolute",
              bottom: -20,
              right: -20,
              bgcolor: "primary.main",
              color: "white",
              p: 3,
              borderRadius: 3,
              textAlign: "center",
              boxShadow: "0 10px 40px rgba(0,0,0,0.4)",
            }}
          >
            <Typography variant="h4" fontWeight={800}>
              1
            </Typography>
            <Typography variant="caption" sx={{ letterSpacing: 2 }}>
              YEARS EXP
            </Typography>
          </Box>
        </Box>
      </Grid>

      {/* Content */}
      <Grid size={{ xs: 12, lg: 7 }}>
        <Stack spacing={5}>
          <Chip
            label="About me"
            sx={{
              bgcolor: "primary.main",
              color: "white",
              width: "fit-content",
              fontWeight: 700,
            }}
          />

          <Typography variant="h3" fontWeight={800}>
            Desarrollador de software enfocado en crear experiencias web{" "}
            <Box component="span" color="primary.main">
              modernas, rápidas y escalables.
            </Box>
          </Typography>

          <Typography color="#ffffff" fontSize={18}>
            Desarrollador de software enfocado en crear experiencias web
            modernas, rápidas y escalables. Trabajo principalmente con React,
            TypeScript, Node.js y otras tecnologías del ecosistema web,
            desarrollando interfaces limpias y soluciones full stack orientadas
            a la experiencia del usuario.
          </Typography>

          <Typography color="#ffffff" fontSize={18}>
            Me apasiona construir productos intuitivos y escalables, combinando
            diseño, lógica de negocio y buenas prácticas de desarrollo para
            crear soluciones funcionales, mantenibles y centradas en el usuario.
          </Typography>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={3} flexWrap="wrap">
            <Button
              variant="contained"
              size="large"
              startIcon={<DownloadIcon />}
              href={CVLink}
              target="_blank"
            >
              Descargar HV
            </Button>

            <Button variant="outlined" size="large">
              <Link
                to={navLinksArray[3].to}
                component={Router}
                underline="none"
              >
                Contacto
              </Link>
            </Button>
          </Stack>
        </Stack>
      </Grid>
    </Grid>
  );
};
