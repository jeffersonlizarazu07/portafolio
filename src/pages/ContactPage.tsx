import { Box, Container, Grid } from "@mui/material";
import { ContactForm } from "../components/contact/ContactForm";
import { ContactSidebar } from "../components/contact/ContactSidebar";

export const ContactPage = () => {
  return (
    <Box
      sx={{
        bgcolor: "#0B1623",
        color: "white",
        overflowX: "hidden",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        p: 6,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Watermark */}
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.03,
          fontSize: "12rem",
          fontWeight: 800,
          transform: "rotate(12deg)",
          pointerEvents: "none",
          userSelect: "none",
        }}
      ></Box>

      <Container
        maxWidth="xl"
        sx={{ position: "relative", zIndex: 2, marginTop: "6.25rem" }}
      >
        <Grid container spacing={10} alignItems="center" marginBottom="3rem">
          <Grid size={{ xs: 12, lg: 7 }}>
            <ContactForm />
          </Grid>

          <Grid size={{ xs: 12, lg: 5 }}>
            <ContactSidebar />
          </Grid>
        </Grid>
      </Container>

      {/* Background Glow */}
      <Box
        sx={{
          position: "fixed",
          top: "10%",
          left: "5%",
          width: 300,
          height: 300,
          bgcolor: "primary.main",
          opacity: 0.05,
          borderRadius: "50%",
          filter: "blur(120px)",
          zIndex: -1,
        }}
      />
    </Box>
  );
};
