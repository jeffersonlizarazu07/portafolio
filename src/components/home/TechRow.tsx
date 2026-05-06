import { Box, Container, Stack, Typography } from "@mui/material";

export const TechRow = () => {
  return (
    <Box
      sx={{
        borderTop: "1px solid rgba(255,255,255,0.1)",
        py: 10,
      }}
    >
      <Container maxWidth="xl">
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={{ xs: 2, sm: 8 }}
          justifyContent="space-between"
          flexWrap="wrap"
          sx={{ opacity: 0.5 }}
        >
          <Typography variant="h6">REACT</Typography>
          <Typography variant="h6">EXPRESS</Typography>
          <Typography variant="h6">JAVA</Typography>
          <Typography variant="h6">VITE</Typography>
          <Typography variant="h6">TAILWIND</Typography>
          <Typography variant="h6">VERCEL</Typography>
        </Stack>
      </Container>
    </Box>
  );
};
