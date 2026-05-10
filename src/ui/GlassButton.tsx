import { Button, type ButtonProps } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'

type GlassButtonProps = ButtonProps

export const GlassButton = ({
  children = 'Enviar mensaje',
  type = 'submit',
  disabled,
  ...props
}: GlassButtonProps) => {
  return (
    <Button
      type={type}
      disabled={disabled}
      endIcon={<SendIcon />}
      sx={{
        px: 6,
        py: 2,
        borderRadius: 3,
        fontWeight: 600,
        color: 'primary.main',
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(43,108,238,0.1)'
            : 'rgba(43,108,238,0.08)',
        backdropFilter: 'blur(8px)',
        border: (theme) =>
          theme.palette.mode === 'dark'
            ? '1px solid rgba(43,108,238,0.2)'
            : '1px solid rgba(43,108,238,0.15)',
        transition: '0.3s',
        '&:hover': {
          bgcolor: 'primary.main',
          color: 'white',
        },
        ...props.sx,
      }}
    >
      {children}
    </Button>
  )
}
