import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
  Link,
} from "@mui/material";
import { Link as Router } from "react-router-dom";
import CircleIcon from "@mui/icons-material/Circle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { CodeImage } from "../home/CodeImage";
import { SocialLinks } from "../layout/common/SocialLinks";
import { navLinksArray } from "@/constants/navLinksArray";

export const Hero = () => {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        pt: 10,
        marginTop: "6.25rem",
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={10} alignItems="center">
          {/* LEFT CONTENT */}
          <Grid size={{ xs: 12, lg: 6 }}>
            <Stack spacing={4}>
              <Typography
                sx={{
                  background: "rgba(15,31,48,0.7)",
                  px: 2,
                  py: 1,
                  borderRadius: 5,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 1,
                  color: "#4a7cd2",
                  fontFamily: "sans-serif",
                }}
              >
                <CircleIcon sx={{ fontSize: "17px" }} />
                DISPONIBLE
              </Typography>

              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  fontSize: { xs: "2.5rem", lg: "4rem" },
                  lineHeight: 1.1,
                }}
              >
                Full Stack{" "}
                <Box component="span" color="primary.main">
                  <br />
                  Developer.
                </Box>
                <br />
                Creación de experiencias
                <br />
                digitales.
              </Typography>

              <Typography color="grey.400" maxWidth={500}>
                He trabajado en el desarrollo de soluciones web utilizando React
                en el frontend y Node.js (Express) en el backend. Me enfoco en
                crear aplicaciones funcionales, escalables y orientadas a
                resolver problemas reales.
              </Typography>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                <Link
                  to={navLinksArray[1].to}
                  component={Router}
                  underline="none"
                >
                  <Button
                    variant="contained"
                    size="large"
                    endIcon={<ArrowForwardIcon />}
                  >
                    Ver mis proyectos
                  </Button>
                </Link>

                <Link
                  to={navLinksArray[3].to}
                  component={Router}
                  underline="none"
                >
                  <Button
                    variant="outlined"
                    size="large"
                    sx={{ color: "#ffffff" }}
                  >
                    Contactarme
                  </Button>
                </Link>
              </Stack>
              <SocialLinks />
            </Stack>
          </Grid>
          <CodeImage />
        </Grid>
      </Container>
    </Box>
  );
};
