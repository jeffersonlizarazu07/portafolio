import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Box, Grid, Stack } from "@mui/material";
import { NeonField } from "./NeonField";
import { GlassButton } from "../../ui/GlassButton";
import { ContactHeader } from "./ContactHeader";
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
});

type ContactFormData = z.infer<typeof contactSchema>;

// Variables de entorno tipadas
const PUBLIC_KEY_EMAILJS = import.meta.env.VITE_API_KEY_EMAILJS as string;
const OUTLOOK_SERVICE_ID = import.meta.env.VITE_OUTLOOK_SERVICE_ID as string;
const TEMPLATE_ID = import.meta.env.VITE_TEMPLATE_ID as string;

export const ContactForm = () => {
  // React Hook Form con Zod
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
    try {
      await emailjs.send(
        OUTLOOK_SERVICE_ID,
        TEMPLATE_ID,
        data,
        PUBLIC_KEY_EMAILJS,
      );
      console.log("Email enviado a Outlook - SUCCESS!");
      reset();
    } catch (error) {
      console.log("FAILED...", error);
    }
  };

  return (
    <Stack spacing={6}>
      <ContactHeader />

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <NeonField
              label="Nombre"
              name="from_name"
              color="#94a3b8"
              registerProps={register("from_name")}
              error={!!errors.from_name}
              helperText={errors.from_name?.message}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <NeonField
              label="Correo Electrónico"
              name="from_email"
              type="email"
              color="#94a3b8"
              registerProps={register("from_email")}
              error={!!errors.from_email}
              helperText={errors.from_email?.message}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <NeonField
              label="Asunto"
              name="title"
              color="#94a3b8"
              registerProps={register("title")}
              error={!!errors.title}
              helperText={errors.title?.message}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <NeonField
              label="Cuéntame sobre tu proyecto..."
              name="message"
              multiline
              rows={5}
              color="#94a3b8"
              registerProps={register("message")}
              error={!!errors.message}
              helperText={errors.message?.message}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <GlassButton type="submit" disabled={isSubmitting} />
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
};
