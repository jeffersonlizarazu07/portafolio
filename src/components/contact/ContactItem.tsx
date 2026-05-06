import type { ContactItemProps } from "@/types/Contact";
import { Stack, Box, Typography } from '@mui/material';

export const ContactItem = ({
  icon,
  title,
  value,
}: ContactItemProps) => {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={3}
      alignItems={{ xs: "flex-start", sm: "center" }}
      sx={{
        p: 2,
        borderRadius: 2,
        transition: "0.3s",
        "&:hover": {
          bgcolor: "action.hover",
        },
      }}
    >
      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: 2,
          bgcolor: "#1e293b",

          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "primary.main",
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography variant="caption" color="#64748b" fontSize="15px">
          {title}
        </Typography>
        <Typography fontWeight={600}>{value}</Typography>
      </Box>
    </Stack>
  );
};
