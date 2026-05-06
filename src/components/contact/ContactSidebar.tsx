import { Stack } from "@mui/material";
import { DirectContact } from "./DirectContact";
import { SocialChannels } from "./SocialChannels";

export const ContactSidebar = () => {
  return (
    <Stack spacing={8}>
      <DirectContact />
      <SocialChannels />
    </Stack>
  );
};
