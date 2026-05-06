import { Box, Container } from "@mui/material";
import { AboutSection } from "../components/about/AboutSection";
import { TechSection } from "../components/about/TechSection";

export const AboutPage = () => {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 12,
        px: 6,
        position: "relative",
        overflow: "hidden",
        bgcolor: "#0B1623",
        color: "white",
        overflowX: "hidden",
      }}
    >
      {/* Glow Orbs */}
      <Box
        sx={{
          position: "absolute",
          top: -100,
          left: -100,
          width: 400,
          height: 400,
          bgcolor: "primary.main",
          opacity: 0.08,
          filter: "blur(120px)",
          borderRadius: "50%",
        }}
      />
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          right: -100,
          width: 300,
          height: 300,
          bgcolor: "primary.main",
          opacity: 0.05,
          filter: "blur(100px)",
          borderRadius: "50%",
        }}
      />

      <Container maxWidth="xl">
        <AboutSection />
        <TechSection />
      </Container>
      
      {/* Spacer para separar el contenido del footer */}
      <Box sx={{ height: 80 }} />
    </Box>
  );
};
