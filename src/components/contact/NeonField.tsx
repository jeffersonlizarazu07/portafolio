import { type FC } from "react";
import { TextField, type TextFieldProps } from "@mui/material";
import type { UseFormRegisterReturn } from "react-hook-form";

interface NeonFieldProps extends Omit<TextFieldProps, "color" | "name"> {
  label: string;
  name: string;
  color?: string;
  inputColor?: string;
  multiline?: boolean;
  rows?: number;
  type?: string;
  // React Hook Form props
  registerProps?: UseFormRegisterReturn;
  error?: boolean;
  helperText?: string;
}

export const NeonField: FC<NeonFieldProps> = ({
  label,
  name,
  multiline = false,
  rows = 1,
  type = "text",
  color,
  inputColor = "#ffffff",
  registerProps,
  error,
  helperText,
}) => {
  // registerProps ya viene con el nombre incluido (resultado de register("name"))
  // No necesita llamarse de nuevo
  const registerFn = registerProps || { name, onChange: () => {}, onBlur: () => {}, ref: null };

  return (
    <TextField
      fullWidth
      label={label}
      name={name}
      error={error}
      helperText={helperText}
      multiline={multiline}
      rows={rows}
      type={type}
      onChange={registerFn.onChange}
      onBlur={registerFn.onBlur}
      ref={registerFn.ref}
      sx={{
        "& .MuiInputLabel-root": { color: color },
        "& .MuiInputLabel-root.Mui-focused": { color: color },
        "& .MuiInputLabel-root.Mui-error": { color: "#f44336" },
        "& .MuiInputBase-input": { color: inputColor },
        "& .MuiFormHelperText-root": { color: error ? "#f44336" : color },
        "& .MuiOutlinedInput-root": {
          transition: "0.3s",
          "& fieldset": {
            borderColor: error ? "#f44336" : color || "divider",
          },
          "&:hover fieldset": {
            borderColor: error ? "#f44336" : "primary.main",
          },
          "&.Mui-focused fieldset": {
            borderColor: error ? "#f44336" : "primary.main",
            boxShadow: error
              ? "0 0 10px rgba(244,67,54,0.4)"
              : "0 0 10px rgba(43,108,238,0.4)",
          },
          "&.Mui-error fieldset": {
            borderColor: "#f44336",
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