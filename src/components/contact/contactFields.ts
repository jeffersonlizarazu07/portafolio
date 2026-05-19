/**
 * Configuración de campos del formulario de contacto.
 *
 * Separar la config de los componentes facilita agregar/modificar campos sin tocar JSX.
 * Permite iterar sobre los campos en vez de escribir código repetitivo.
 * Los estilos se mantienen consistentes (mismo color para todos los labels).
 */

export interface FieldConfig {
  name: 'from_name' | 'from_email' | 'title' | 'message'
  label: string
  color: string
  type?: string
  multiline?: boolean
  rows?: number
}

export const FORM_FIELDS: FieldConfig[] = [
  { name: 'from_name', label: 'Nombre', color: '#94a3b8' },
  { name: 'from_email', label: 'Correo Electrónico', color: '#94a3b8', type: 'email' },
  { name: 'title', label: 'Asunto', color: '#94a3b8' },
  {
    name: 'message',
    label: 'Cuéntame sobre tu proyecto...',
    color: '#94a3b8',
    multiline: true,
    rows: 5,
  },
]
