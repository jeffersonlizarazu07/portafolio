import { type FC } from "react";
import { TextField } from "@mui/material";

interface NeonFieldProps {
  label: string;
  name: string;
  color?: string;
  inputColor?: string;
  multiline?: boolean;
  rows?: number;
  type?: string;
}

export const NeonField: FC<NeonFieldProps> = ({
  label,
  name,
  multiline = false,
  rows = 1,
  type = "text",
  color,
  inputColor = "#ffffff",
}) => {
  return (
    <TextField
      fullWidth
      label={label}
      name={name}
      multiline={multiline}
      rows={rows}
      type={type}
      sx={{
        "& .MuiInputLabel-root": { color: color },
        "& .MuiInputLabel-root.Mui-focused": { color: color },
        "& .MuiInputBase-input": { color: inputColor },
        "& .MuiOutlinedInput-root": {
          transition: "0.3s",
          "& fieldset": {
            borderColor: color || "divider",
          },
          "&:hover fieldset": {
            borderColor: "primary.main",
          },
          "&.Mui-focused fieldset": {
            borderColor: "primary.main",
            boxShadow: "0 0 10px rgba(43,108,238,0.4)",
          },
          "& input:-webkit-autofill": {
      WebkitBoxShadow: "0 0 0 1000px #0b1a2b inset",
      WebkitTextFillColor: inputColor,
      borderRadius: "inherit",
      transition: "background-color 9999s ease-in-out 0s",
          },
        },
      }}
    />
  );
};