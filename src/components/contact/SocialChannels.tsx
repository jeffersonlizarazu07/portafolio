import { type FC } from "react";
import { Stack, Typography, Card, Avatar, Box, Link } from "@mui/material";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import RemoveIcon from "@mui/icons-material/Remove";
import GitHubIcon from "@mui/icons-material/GitHub";
import { socialLinks } from "@/constants/socialLinks";

export const SocialChannels: FC = () => {
  const socialsAndIcons = [
    { name: "LinkedIn", Icon: LinkedInIcon, href: socialLinks.linkedin },
    { name: "GitHub", Icon: GitHubIcon, href: socialLinks.github },
  ];

  return (
    <Stack spacing={3}>
      <Typography
        variant="h6"
        fontWeight={900}
        sx={{ display: "flex", alignItems: "center", color: "primary.main" }}
      >
        <RemoveIcon sx={{ width: "100px", fontSize: "80px" }} />
        Canales de contacto
      </Typography>
      {socialsAndIcons.map((item, index) => {
        const { Icon, name, href } = item;
        return (
          <Link
            key={index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            underline="none"
          >
            <Card
              sx={{
                p: 2,
                border: "1px solid",
                borderRadius: 2,
                borderColor: "#94a3b8",
                transition: "0.3s",
                bgcolor: "#0B1623",
                cursor: "pointer",

                "&:hover": {
                  transform: "translateX(8px)",
                  borderColor: "primary.main",
                },
              }}
            >
              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    alignContent: "center",
                    gap: 2,
                  }}
                >
                  <Avatar
                    variant="rounded"
                    sx={{
                      backgroundColor: "#1e293b",
                      padding: "1px",
                      width: 45,
                      height: 45,
                      transition: "0.3s",
                    }}
                  >
                    <Icon
                      sx={{ color: "#94a3b8", fontSize: "2rem", boxShadow: 5 }}
                    />
                  </Avatar>
                  <Typography fontWeight={500} color="#ffffff">
                    {name}
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Link>
        );
      })}
    </Stack>
  );
};
