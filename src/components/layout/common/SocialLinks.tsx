import { Stack, Link, Typography } from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import GitHubIcon from '@mui/icons-material/GitHub'
import LinkedInIcon from '@mui/icons-material/LinkedIn'
import { config } from '@/config'

type SocialLinksProps = {
  showLabels?: boolean
}

export const SocialLinks = ({ showLabels = true }: SocialLinksProps) => {
  const socialLinksArray = [
    {
      Icon: GitHubIcon,
      label: 'GitHub',
      href: config.social.github,
      ariaLabel: 'GitHub',
    },
    {
      Icon: LinkedInIcon,
      label: 'LinkedIn',
      href: config.social.linkedin,
      ariaLabel: 'LinkedIn',
    },
    {
      Icon: EmailIcon,
      label: 'Correo electrónico',
      href: config.social.email,
      ariaLabel: 'Email',
    },
  ]

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={{ xs: 2, sm: 4 }}
      color='text.secondary'
      sx={{
        '& a:hover': {
          color: { color: theme => theme.palette.grey[500] },
          transform: 'scale(1.2)',
        },
      }}
    >
      {socialLinksArray.map(({ Icon, label, href, ariaLabel }) => (
        <Link
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
          }}
          underline='none'
          key={label}
          href={href}
          aria-label={ariaLabel}
          target='_blank'
          rel='noopener noreferrer'
        >
          <Icon />
          {showLabels && <Typography>{label}</Typography>}
        </Link>
      ))}
    </Stack>
  )
}
