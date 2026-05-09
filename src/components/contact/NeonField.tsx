/**
 * Campo de formulario con estilo neon/glow.
 * 
 * ¿Por qué un componente custom en lugar de TextField directo?
 * - Los campos tienen un estilo distintivo que no viene con MUI por defecto.
 * - Necesitamos integración con React Hook Form para validación.
 * - El efecto glow en focus es parte de la identidad visual del contacto.
 * 
 * ¿Por qué los sx styles son tan complejos?
 * - MUI TextField tiene múltiples partes (label, input, helperText, fieldset).
 * - Cada estado (normal, hover, focus, error) necesita estilos específicos.
 * - El efecto glow usa boxShadow de CSS, no hay token MUI para esto.
 */
import { type FC } from 'react'
import { TextField, type TextFieldProps } from '@mui/material'
import type { UseFormRegisterReturn } from 'react-hook-form'

interface NeonFieldProps extends Omit<TextFieldProps, 'color' | 'name'> {
  label: string
  name: string
  color?: string
  inputColor?: string
  multiline?: boolean
  rows?: number
  type?: string
  // React Hook Form props
  registerProps?: UseFormRegisterReturn
  error?: boolean
  helperText?: string
  onFocus?: () => void
}

export const NeonField: FC<NeonFieldProps> = ({
  label,
  name,
  multiline = false,
  rows = 1,
  type = 'text',
  color,
  inputColor = '#ffffff',
  registerProps,
  error,
  helperText,
  onFocus,
}) => {
  // ¿Por qué este fallback?
  // Si registerProps no viene, creamos un mock para que el componente funcione
  // sin React Hook Form (útil para testing o uso fuera del formulario)
  const registerFn = registerProps || { name, onChange: () => {}, onBlur: () => {}, ref: null }

  return (
    <TextField
      fullWidth
      label={label}
      name={name}
      error={error}
      helperText={helperText}
      multiline={multiline}
      rows={rows}
      type={type}
      onChange={registerFn.onChange}
      onBlur={registerFn.onBlur}
      onFocus={onFocus}
      ref={registerFn.ref}
      sx={{
        // Label: cambia de color según el prop (permite theming不一致)
        '& .MuiInputLabel-root': { color: color },
        '& .MuiInputLabel-root.Mui-focused': { color: color },
        '& .MuiInputLabel-root.Mui-error': { color: '#f44336' },

        // Input: texto blanco por defecto
        '& .MuiInputBase-input': { color: inputColor },

        // HelperText: rojo en error, normal otherwise
        '& .MuiFormHelperText-root': { color: error ? '#f44336' : color },

        // Fieldset: el borde del input
        '& .MuiOutlinedInput-root': {
          transition: '0.3s',
          '& fieldset': {
            borderColor: error ? '#f44336' : color || 'divider',
          },
          '&:hover fieldset': {
            borderColor: error ? '#f44336' : 'primary.main',
          },
          // Focus: aquí está el efecto glow característico
          '&.Mui-focused fieldset': {
            borderColor: error ? '#f44336' : 'primary.main',
            boxShadow: error
              ? '0 0 10px rgba(244,67,54,0.4)'
              : '0 0 10px rgba(43,108,238,0.4)',
          },
          '&.Mui-error fieldset': {
            borderColor: '#f44336',
          },
          // Autofill: el browser sugiere credenciales con fondo blanco
          // Este override hace que el autofill tenga el color del theme
          '& input:-webkit-autofill': {
            WebkitBoxShadow: '0 0 0 1000px #0b1a2b inset',
            WebkitTextFillColor: inputColor,
            borderRadius: 'inherit',
            // Trampa: el transition de 9999s evita el flash de color al autofillear
            transition: 'background-color 9999s ease-in-out 0s',
          },
        },
      }}
    />
  )
}