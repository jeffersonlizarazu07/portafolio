/**
 * Campo honeypot para detectar bots en el formulario de contacto.
 *
 * Cómo funciona:
 * - Los bots scrapers ven todos los inputs y los llenan automáticamente.
 * - Los humanos no ven este campo (hidden, fuera de pantalla).
 * - Si hp_field tiene contenido, es un bot.
 *
 * Estilizado con position: absolute y left: -9999px para ocultar visualmente
 * pero seguir siendo parte del DOM. Los bots no distinguen CSS de contenido visible.
 */
import { Box } from '@mui/material'
import { UseFormRegister } from 'react-hook-form'
import type { ContactFormData } from '@/validations/contactSchema'

export const HoneypotField = ({ register }: { register: UseFormRegister<ContactFormData> }) => {
  const hpRegister = register('hp_field')
  return (
    <Box
      component='input'
      type='text'
      name={hpRegister.name}
      onChange={hpRegister.onChange}
      onBlur={hpRegister.onBlur}
      ref={hpRegister.ref}
      sx={{
        position: 'absolute',
        left: '-9999px',
        opacity: 0,
        pointerEvents: 'none',
      }}
      tabIndex={-1}
      autoComplete='off'
    />
  )
}
