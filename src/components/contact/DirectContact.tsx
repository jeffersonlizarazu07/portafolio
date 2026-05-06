import { type FC } from "react";
import { Stack, Typography, Link } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import EmailIcon from "@mui/icons-material/AlternateEmail";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { ContactItem } from "./ContactItem";

interface Email {
  status: string;
  label: string;
  href: string;
}

export const DirectContact: FC = () => {
  const emails: Email[] = [
    {
      status: "principal",
      label: "jeffersonlizarazu@hotmail.com",
      href: "mailto:jeffersonlizarazu@hotmail.com",
    },
    {
      status: "secundario",
      label: "jeffersonliza21@gmail.com",
      href: "mailto:jeffersonliza21@gmail.com",
    },
  ];

  return (
    <Stack spacing={4}>
      <Typography
        variant="h6"
        fontWeight={700}
        sx={{ display: "flex", alignItems: "center", color: "primary.main" }}
      >
        <RemoveIcon sx={{ width: "100px", fontSize: "80px" }} />
        Contacto directo
      </Typography>

      <Stack spacing={3}>
        <ContactItem
          icon={<EmailIcon sx={{ color: "#2b6cee" }} />}
          title="Correos electrónicos"
          value={
            <span>
              {emails.map((email, index) => (
                <span key={index}>
                  <Link
                    href={email.href}
                    underline="none"
                    sx={{ color: "#ffffff" }}
                  >
                    {email.label}
                  </Link>
                  {index < emails.length - 1 && " "}
                </span>
              ))}
            </span>
          }
        />

        <ContactItem
          icon={<LocationOnIcon sx={{ color: "#2b6cee" }} />}
          title="Localización actual"
          value="Bogotá D.C, Colombia"
        />
      </Stack>
    </Stack>
  );
};
