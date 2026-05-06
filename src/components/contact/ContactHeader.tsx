import { Box, Typography } from "@mui/material";

export const ContactHeader = () => {
  return (
    <Box>
      <Typography
        sx={{
          color: "primary.main",
          fontWeight: 600,
          letterSpacing: 3,
          textTransform: "uppercase",
          fontSize: 14,
        }}
      >
        Contacto
      </Typography>

      <Typography variant="h2" fontWeight={800} mt={2}>
        Vamos a construir algo{" "}
        <Box component="span" sx={{ color: "primary.main" }}>
          extraordinario
        </Box>
        .
      </Typography>

      <Typography color="#94a3b8" mt={2} maxWidth={500}>
        ¿Tienes algún proyecto en mente o simplemente quieres saludar? Mi
        bandeja de entrada siempre está abierta.
      </Typography>
    </Box>
  );
};