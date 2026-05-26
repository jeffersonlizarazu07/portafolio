import { type FC } from 'react'
import { Stack, Typography, Card, Avatar, Box, Link } from '@mui/material'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import RemoveIcon from '@mui/icons-material/Remove'
import GitHubIcon from '@mui/icons-material/GitHub'
import { config } from '@/config'

export const SocialChannels: FC = () => {
  const socialsAndIcons = [
    { name: 'LinkedIn', Icon: LinkedInIcon, href: config.social.linkedin },
    { name: 'GitHub', Icon: GitHubIcon, href: config.social.github },
  ]

  return (
    <Stack spacing={3}>
      <Typography
        variant='h6'
        fontWeight={900}
        sx={{ display: 'flex', alignItems: 'center', color: 'primary.main' }}
      >
        <RemoveIcon
          sx={{ width: { xs: '50px', md: '100px' }, fontSize: { xs: '40px', md: '80px' } }}
        />
        Canales de contacto
      </Typography>
      {socialsAndIcons.map((item, index) => {
        const { Icon, name, href } = item
        return (
          <Link key={index} href={href} target='_blank' rel='noopener noreferrer' underline='none'>
            <Card
              sx={{
                p: 2,
                border: '1px solid',
                borderRadius: 2,
                borderColor: 'text.label',
                transition: '0.3s',
                bgcolor: 'background.default',
                cursor: 'pointer',

                '&:hover': {
                  transform: 'translateX(8px)',
                  borderColor: 'primary.main',
                },
              }}
            >
              <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent='space-between'>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    alignContent: 'center',
                    gap: 2,
                  }}
                >
                  <Avatar
                    variant='rounded'
                    sx={{
                      backgroundColor: 'background.contact',
                      padding: '1px',
                      width: 45,
                      height: 45,
                      transition: '0.3s',
                    }}
                  >
                    <Icon sx={{ color: 'text.label', fontSize: '2rem', boxShadow: 5 }} />
                  </Avatar>
                  <Typography fontWeight={500} color='text.primary'>
                    {name}
                  </Typography>
                </Box>
              </Stack>
            </Card>
          </Link>
        )
      })}
    </Stack>
  )
}
