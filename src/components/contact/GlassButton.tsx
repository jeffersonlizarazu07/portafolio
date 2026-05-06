import { Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

export const GlassButton = () => {
  return (
    <Button
      type="submit"
      endIcon={<SendIcon />}
      sx={{
        px: 6,
        py: 2,
        borderRadius: 3,
        fontWeight: 600,
        color: "primary.main",
        background: "rgba(43,108,238,0.1)",
        backdropFilter: "blur(8px)",
        border: "1px solid rgba(43,108,238,0.2)",
        transition: "0.3s",
        "&:hover": {
          bgcolor: "primary.main",
          color: "white",
        },
      }}
    >
      Enviar mensaje
    </Button>
  );
};
