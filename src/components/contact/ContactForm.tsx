import { useState } from "react";
import { useForm, UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Box, Grid, Stack, Snackbar, Alert, Typography } from "@mui/material";
import { NeonField } from "./NeonField";
import { GlassButton } from "../../ui/GlassButton";
import { ContactHeader } from "./ContactHeader";
import { emailConfig, spamProtection } from "@/constants/emailConfig";
import emailjs from "@emailjs/browser";

// Schema de validación con Zod
const contactSchema = z.object({
  from_name: z
    .string()
    .min(1, "El nombre es requerido")
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder 50 caracteres"),
  from_email: z
    .string()
    .min(1, "El correo electrónico es requerido")
    .email("Ingresa un correo electrónico válido"),
  title: z
    .string()
    .min(1, "El asunto es requerido")
    .min(5, "El asunto debe tener al menos 5 caracteres")
    .max(100, "El asunto no puede exceder 100 caracteres"),
  message: z
    .string()
    .min(1, "El mensaje es requerido")
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .max(500, "El mensaje no puede exceder 500 caracteres"),
  // Honeypot - campo oculto para detectar bots
  hp_field: z.string().max(0, "Spam detectado"),
});

type ContactFormData = z.infer<typeof contactSchema>;

// Configuración de campos del formulario
const FORM_FIELDS: Array<{
  name: "from_name" | "from_email" | "title" | "message";
  label: string;
  color: string;
  type?: string;
  multiline?: boolean;
  rows?: number;
}> = [
  { name: "from_name", label: "Nombre", color: "#94a3b8" },
  { name: "from_email", label: "Correo Electrónico", color: "#94a3b8", type: "email" },
  { name: "title", label: "Asunto", color: "#94a3b8" },
  { name: "message", label: "Cuéntame sobre tu proyecto...", color: "#94a3b8", multiline: true, rows: 5 },
];

// Componente: Honeypot field - tipo genérico para cualquier función de registro
const HoneypotField = ({ register }: { register: UseFormRegister<ContactFormData> }) => {
  const hpRegister = register("hp_field");
  return (
    <Box
      component="input"
      type="text"
      onChange={hpRegister.onChange}
      onBlur={hpRegister.onBlur}
      ref={hpRegister.ref}
      sx={{
        position: "absolute",
        left: "-9999px",
        opacity: 0,
        pointerEvents: "none",
      }}
      tabIndex={-1}
      autoComplete="off"
    />
  );
};

// Componente: Notificación de éxito
const SuccessNotification = ({ open, onClose }: { open: boolean; onClose: () => void }) => (
  <Snackbar
    open={open}
    autoHideDuration={6000}
    onClose={onClose}
    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
  >
    <Alert onClose={onClose} severity="success" variant="filled" sx={{ width: "100%" }}>
      ¡Mensaje enviado exitosamente! Te contactaré pronto.
    </Alert>
  </Snackbar>
);

// Hook: Validaciones anti-spam
const useSpamProtection = () => {
  const [submitTime] = useState(() => Date.now());
  const [spamError, setSpamError] = useState("");
  const [hasInteracted, setHasInteracted] = useState(false);

  const validateSubmission = (data: ContactFormData) => {
    // Honeypot
    if (data.hp_field) {
      console.log("Spam detectado: honeypot activado");
      return false;
    }

    // Tiempo mínimo
    if ((Date.now() - submitTime) / 1000 < spamProtection.minSubmitTime) {
      setSpamError("Por favor, espera un momento antes de enviar.");
      return false;
    }

    // Interacción del usuario
    if (!hasInteracted) {
      setSpamError("Por favor, interactúa con el formulario antes de enviar.");
      return false;
    }

    setSpamError("");
    return true;
  };

  const handleInteraction = () => {
    if (!hasInteracted) setHasInteracted(true);
  };

  return { spamError, validateSubmission, handleInteraction };
};

export const ContactForm = () => {
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const { spamError, validateSubmission, handleInteraction } = useSpamProtection();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: ContactFormData) => {
    if (!validateSubmission(data)) return;

    try {
      await emailjs.send(emailConfig.serviceId, emailConfig.templateId, data, emailConfig.publicKey);
      console.log("Email enviado a Outlook - SUCCESS!");
      reset();
      setOpenSnackbar(true);
    } catch (error) {
      console.log("FAILED...", error);
    }
  };

  return (
    <Stack spacing={6}>
      <ContactHeader />

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={4}>
          {FORM_FIELDS.map((field) => (
            <Grid key={field.name} size={field.name === "message" ? { xs: 12 } : { xs: 12, md: 6 }}>
              <NeonField
                label={field.label}
                name={field.name}
                color={field.color}
                type={field.type}
                multiline={field.multiline}
                rows={field.rows}
                registerProps={register(field.name)}
                error={!!errors[field.name]}
                helperText={errors[field.name]?.message}
                onClick={handleInteraction}
              />
            </Grid>
          ))}

          <Grid size={{ xs: 12 }}>
            <HoneypotField register={register} />
            
            {spamError && (
              <Typography color="error" sx={{ mb: 2 }}>{spamError}</Typography>
            )}
            
            <GlassButton
              type="submit"
              disabled={isSubmitting}
              onMouseEnter={handleInteraction}
            />
          </Grid>
        </Grid>
      </Box>

      <SuccessNotification open={openSnackbar} onClose={() => setOpenSnackbar(false)} />
    </Stack>
  );
};