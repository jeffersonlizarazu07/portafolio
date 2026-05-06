import { useRef, type FormEvent } from "react";
import { Box, Grid, Stack } from "@mui/material";
import { NeonField } from "./NeonField";
import { GlassButton } from "./GlassButton";
import { ContactHeader } from "./ContactHeader";
import emailjs from "@emailjs/browser";

// Variables de entorno tipadas
const PUBLIC_KEY_EMAILJS = import.meta.env.VITE_API_KEY_EMAILJS as string;
const OUTLOOK_SERVICE_ID = import.meta.env.VITE_OUTLOOK_SERVICE_ID as string;
const TEMPLATE_ID = import.meta.env.VITE_TEMPLATE_ID as string;

export const ContactForm = () => {
  const formRef = useRef<HTMLFormElement>(null);

  const sendEmail = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formRef.current) return;

    // Extraer datos del formulario
    const formData = new FormData(formRef.current);
    const templateParams = Object.fromEntries(formData.entries());

    try {
      // Enviar a Outlook
      await emailjs.send(
        OUTLOOK_SERVICE_ID,
        TEMPLATE_ID,
        templateParams,
        PUBLIC_KEY_EMAILJS,
      );
      console.log("Email enviado a Outlook - SUCCESS!");
    } catch (error) {
      console.log("FAILED...", error);
    }
  };

  return (
    <Stack spacing={6}>
      <ContactHeader />

      <Box component="form" ref={formRef} onSubmit={sendEmail}>
        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 6 }}>
            <NeonField label="Nombre" name="from_name" color="#94a3b8" />
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <NeonField
              label="Correo Electrónico"
              name="from_email"
              type="email"
              color="#94a3b8"
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <NeonField label="Asunto" name="title" color="#94a3b8" />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <NeonField
              label="Cuéntame sobre tu proyecto..."
              name="message"
              multiline
              rows={5}
              color="#94a3b8"
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <GlassButton />
          </Grid>
        </Grid>
      </Box>
    </Stack>
  );
};
