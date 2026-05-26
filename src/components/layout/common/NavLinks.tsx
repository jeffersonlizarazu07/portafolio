import { Stack, StackProps, Link } from '@mui/material'
import { Link as Router, useLocation } from 'react-router-dom'
import { navLinksArray } from '@/constants/navLinksArray'

type NavLinksProps = {
  direction?: StackProps['direction']
  spacing?: number
  hideOnXs?: boolean
  sx?: any
}

export const NavLinks = ({
  direction = 'row',
  spacing = 4,
  hideOnXs = true,
  sx,
}: NavLinksProps) => {
  const location = useLocation()

  return (
    <Stack
      direction={direction}
      spacing={spacing}
      sx={{
        display: hideOnXs ? { xs: 'none', sm: 'flex' } : { xs: 'flex' },
        '& a:hover': { color: theme => theme.palette.grey[500] },
        ...sx,
      }}
    >
      {navLinksArray.map(({ to, label }) => {
        const isActive = location.pathname === to
        return (
          <Link
            key={to}
            to={to}
            component={Router}
            underline='none'
            sx={{
              color: isActive ? 'primary.main' : 'white',
              borderBottom: isActive ? '2px solid' : '2px solid transparent',
              borderColor: isActive ? 'primary.main' : 'transparent',
              borderRadius: 0,
              px: 1,
              py: 0.5,
              transition: 'all 0.3s ease',
              '&:hover': {
                color: 'primary.main',
                borderColor: 'primary.main',
              },
            }}
          >
            {label}
          </Link>
        )
      })}
    </Stack>
  )
}
