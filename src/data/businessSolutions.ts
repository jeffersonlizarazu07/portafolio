/**
 * Datos estáticos de la sección "Soluciones para Negocio".
 *
 * Centralizados aquí para:
 * - Agregar nuevas soluciones sin tocar componentes.
 * - Mantener consistencia en la información comercial.
 * - Facilidad de traducción o actualización de contenido.
 *
 * Cuando desarrolles una nueva solución, solo agregas un objeto
 * a este array y la vista se actualiza automáticamente.
 */

import DashboardIcon from '@mui/icons-material/Dashboard'
import PaymentsIcon from '@mui/icons-material/Payments'
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive'
import PeopleIcon from '@mui/icons-material/People'
import type { BusinessSolution } from '@/types/Business'

export const businessSolutions: BusinessSolution[] = [
  {
    id: 'catalogo-whatsapp',
    title: 'Catálogo Digital con Pedidos a WhatsApp',
    subtitle: 'Muestra tus productos y recibe pedidos al instante',
    problemDescription:
      'Muchos negocios pequeños aún comparten sus productos por WhatsApp o PDF, perdiendo clientes porque la experiencia es lenta, desordenada y nada profesional.',
    solutionDescription:
      'Un catálogo web moderno, ultrarrápido y optimizado para móviles donde tus clientes exploran tus productos y envían su pedido directamente a tu WhatsApp con un solo clic.',
    businessValue:
      'Transforma tu celular en un canal de ventas profesional sin necesidad de apps complejas ni inversiones iniciales.',
    metrics: [
      { label: 'Carga inicial', value: '< 1.5s' },
      { label: 'Optimizado', value: '100% Móvil' },
      { label: 'Conversión', value: '1 Click a WhatsApp' },
      { label: 'Mantenimiento', value: 'Sin servidor' },
    ],
    techReasoning: [
      {
        name: 'React + Vite',
        reason:
          'App ultrarrápida que carga al instante en cualquier dispositivo, incluso en redes lentas.',
      },
      {
        name: 'TypeScript',
        reason:
          'Código robusto y sin errores inesperados. Tu catálogo nunca se caerá por un error de programación.',
      },
      {
        name: 'Diseño Responsive',
        reason:
          'Se ve profesional en celulares, tablets y computadoras. Sin necesidad de desarrollar una app nativa.',
      },
    ],
    contactPreFill:
      'Hola, vi tu Catálogo Digital y me gustaría saber más sobre cómo implementarlo en mi negocio.',
    isFeatured: true,
    status: 'ready',
    expansionModules: [
      {
        id: 'admin-panel',
        title: 'Panel de Administración',
        description:
          'Gestiona tus productos, precios y categorías desde un panel sencillo. Sin necesidad de editar código.',
        Icon: DashboardIcon,
        isAvailable: true,
      },
      {
        id: 'payments',
        title: 'Pasarela de Pagos',
        description:
          'Recibe pagos con tarjeta, transferencia o billetera digital directamente en tu catálogo.',
        Icon: PaymentsIcon,
        isAvailable: true,
      },
      {
        id: 'notifications',
        title: 'Notificaciones Automáticas',
        description:
          'Tus clientes reciben confirmación de pedido y factura por correo o SMS automáticamente.',
        Icon: NotificationsActiveIcon,
        isAvailable: false,
      },
      {
        id: 'client-management',
        title: 'Gestión de Clientes',
        description:
          'Tus clientes recurrentes guardan sus datos y ven el historial de pedidos anteriores.',
        Icon: PeopleIcon,
        isAvailable: false,
      },
    ],
  },
  {
    id: 'ecommerce-full',
    title: 'Tienda Online Completa',
    subtitle: 'Vende en línea con pagos integrados y envíos automatizados',
    problemDescription:
      'Los negocios que quieren vender por internet terminan en plataformas genéricas que cobran comisiones altas y limitan la personalización.',
    solutionDescription:
      'Una tienda online profesional con carrito de compras, pasarela de pagos integrada y panel de administración de pedidos.',
    businessValue:
      'Tu propia tienda online sin comisiones abusivas. Personaliza cada detalle de la experiencia de compra.',
    metrics: [
      { label: 'Plataforma', value: 'Propia 100%' },
      { label: 'Comisiones', value: '0% por venta' },
      { label: 'Pasarelas', value: 'Stripe / PayPal' },
      { label: 'Panel', value: 'Admin incluido' },
    ],
    techReasoning: [
      {
        name: 'React + Node.js',
        reason:
          'Aplicación completa con frontend moderno y backend escalable. Preparada para crecer con tu negocio.',
      },
      {
        name: 'Base de Datos',
        reason:
          'Todos tus productos, pedidos y clientes almacenados de forma segura y accesible desde cualquier lugar.',
      },
    ],
    contactPreFill:
      'Hola, vi tu Tienda Online Completa y me interesa saber cómo puedo implementarla en mi negocio.',
    isFeatured: false,
    status: 'on-demand',
    expansionModules: [],
  },
  {
    id: 'admin-dashboard',
    title: 'Panel Administrativo',
    subtitle: 'Controla tu negocio con datos en tiempo real',
    problemDescription:
      'Dueños de negocio que toman decisiones basadas en corazonadas porque no tienen datos concretos de ventas, inventario ni clientes.',
    solutionDescription:
      'Un dashboard ejecutivo con gráficos de ventas, control de inventario, gestión de clientes y reportes descargables.',
    businessValue:
      'Decisiones basadas en datos, no en suposiciones. Ahorra horas de trabajo manual cada semana.',
    metrics: [
      { label: 'Reportes', value: 'En tiempo real' },
      { label: 'Inventario', value: 'Control total' },
      { label: 'Acceso', value: 'Desde cualquier lugar' },
      { label: 'Exportación', value: 'PDF / Excel' },
    ],
    techReasoning: [
      {
        name: 'Interfaz Intuitiva',
        reason:
          'Panel fácil de usar que cualquier persona en tu equipo puede manejar sin conocimientos técnicos.',
      },
      {
        name: 'Datos en Vivo',
        reason:
          'La información se actualiza automáticamente. Siempre ves el estado real de tu negocio.',
      },
    ],
    contactPreFill:
      'Hola, vi tu Panel Administrativo y me gustaría saber cómo implementarlo para controlar mejor mi negocio.',
    isFeatured: false,
    status: 'on-demand',
    expansionModules: [],
  },
]

/**
 * Helper: obtiene la solución destacada (isFeatured).
 * Útil si en el futuro hay más de una.
 */
export const getFeaturedSolution = (): BusinessSolution | undefined =>
  businessSolutions.find(s => s.isFeatured)

/**
 * Helper: filtra soluciones por estado.
 */
export const getSolutionsByStatus = (status: BusinessSolution['status']): BusinessSolution[] =>
  businessSolutions.filter(s => s.status === status)
