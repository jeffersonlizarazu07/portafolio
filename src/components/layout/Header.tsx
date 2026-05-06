import {
  Box,
  Typography,
  IconButton,
  AppBar,
  Container,
  Toolbar,
  Stack,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { CVLink } from "../../constants/curriculumVitaeLink";
import { NavLinks } from "./common/NavLinks";

export const Header = () => {
  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backdropFilter: "blur(12px)",
        background: "rgba(15,31,48,0.7)",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: 80,
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
          {/* Logo */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              sx={{
                width: 32,
                height: 32,
                bgcolor: "primary.main",
                borderRadius: 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
              }}
            >
              J
            </Box>
            <Link to="/">
              <Typography
                variant="h6"
                sx={{ display: { xs: "none", sm: "block", color: "#ffffff" } }}
              >
                PORTAFOLIO
              </Typography>
            </Link>
          </Stack>
          <NavLinks />

          {/* Right Actions */}
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton color="inherit">
              <DarkModeIcon />
            </IconButton>
            <Button href={CVLink} variant="contained" target="_blank">
              Resume
            </Button>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
