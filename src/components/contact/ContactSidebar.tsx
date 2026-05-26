import { Stack } from '@mui/material'
import { DirectContact } from './DirectContact'
import { SocialChannels } from './SocialChannels'

export const ContactSidebar = () => {
  return (
    <Stack spacing={{ xs: 4, md: 8 }}>
      <DirectContact />
      <SocialChannels />
    </Stack>
  )
}
