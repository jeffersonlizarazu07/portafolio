/**
 * Serverless function para envío de emails desde el formulario de contacto.
 *
 * ¿Por qué una serverless function en vez de EmailJS directo desde el cliente?
 * - Las credenciales de EmailJS (private key) viven del lado del servidor.
 * - Sin prefijo VITE_ → no se filtran al bundle del cliente.
 * - Podemos implementar rate limiting real por IP.
 * - Validación server-side como defensa en profundidad.
 *
 * Flujo:
 *   Cliente → POST /api/contact → validación → rate limit check → EmailJS API
 *
 * Variables de entorno (configurar en Vercel, SIN prefijo VITE_):
 *   EMAILJS_OUTLOOK_SERVICE_ID  — ID del servicio Outlook en EmailJS
 *   EMAILJS_TEMPLATE_ID         — ID del template de email
 *   EMAILJS_PUBLIC_KEY          — User ID / public key de EmailJS
 *   EMAILJS_PRIVATE_KEY         — Private key para API calls server-side
 */

// ── Orígenes permitidos para CORS ──
// Solo requests desde estos dominios pueden usar la API.
// Requests sin header Origin (curl, scripts server-side) son bloqueados.
// Los navegadores modernos siempre envían Origin en POST.
const ALLOWED_ORIGINS = [
  'https://jefferson-lizarazu-dev.vercel.app',
  'http://localhost:5173',
  'http://localhost:3000',
]

/**
 * Valida que el origen del request esté en la lista de permitidos.
 * Retorna true si el origen es válido o si hay múltiples orígenes
 * (caso edge de algunos proxies). Requests sin Origin son bloqueados.
 */
const isOriginAllowed = origin => {
  if (!origin) return false
  // Algunos proxies envían múltiples orígenes separados por espacio
  return origin.split(/\s+/).every(o => ALLOWED_ORIGINS.includes(o))
}

// ── Rate limiting simple (in-memory, best-effort) ──
// Vercel serverless es stateless, pero esto frena burst de requests
// dentro de una misma instancia. Para un portafolio es suficiente.
const rateLimitMap = new Map()
const RATE_LIMIT_WINDOW = 10 * 60 * 1000 // 10 minutos
const RATE_LIMIT_MAX = 3 // máx 3 envíos por ventana

/**
 * Valida el cuerpo de la request contra el schema esperado.
 * No usamos Zod aquí para evitar dependencias y problemas de ruta.
 * La validación es simple pero suficiente para este propósito.
 */
const validateBody = body => {
  const errors = []

  if (!body.from_name || typeof body.from_name !== 'string' || body.from_name.length < 2) {
    errors.push('El nombre debe tener al menos 2 caracteres')
  }
  if (body.from_name && body.from_name.length > 50) {
    errors.push('El nombre no puede exceder 50 caracteres')
  }

  if (
    !body.from_email ||
    typeof body.from_email !== 'string' ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.from_email)
  ) {
    errors.push('Ingresa un correo electrónico válido')
  }

  if (!body.title || typeof body.title !== 'string' || body.title.length < 5) {
    errors.push('El asunto debe tener al menos 5 caracteres')
  }
  if (body.title && body.title.length > 100) {
    errors.push('El asunto no puede exceder 100 caracteres')
  }

  if (!body.message || typeof body.message !== 'string' || body.message.length < 10) {
    errors.push('El mensaje debe tener al menos 10 caracteres')
  }
  if (body.message && body.message.length > 500) {
    errors.push('El mensaje no puede exceder 500 caracteres')
  }

  return errors
}

/**
 * Verifica rate limit por IP.
 * Retorna true si el request está dentro del límite, false si excede.
 */
const checkRateLimit = ip => {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry) {
    rateLimitMap.set(ip, { count: 1, windowStart: now })
    return true
  }

  // Limpiar ventana si expiró
  if (now - entry.windowStart > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, windowStart: now })
    return true
  }

  // Limpiar entries viejas cada tanto (prevenir memory leak)
  // Se ejecuta aproximadamente cada 10 requests
  if (rateLimitMap.size > 1000) {
    for (const [key, value] of rateLimitMap) {
      if (now - value.windowStart > RATE_LIMIT_WINDOW) {
        rateLimitMap.delete(key)
      }
    }
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false
  }

  entry.count++
  return true
}

export default async function handler(req, res) {
  // ── Solo aceptar POST ──
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' })
    return
  }

  // ── Validación de origen ──
  const origin = req.headers['origin']

  if (!isOriginAllowed(origin)) {
    console.warn(`Origen no autorizado: ${origin}`)
    res.status(403).json({ message: 'Origen no autorizado' })
    return
  }

  // ── Rate limiting por IP ──
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown'

  if (!checkRateLimit(ip)) {
    console.warn(`Rate limit excedido para IP: ${ip}`)
    res.status(429).json({ message: 'Demasiados intentos. Intenta de nuevo más tarde.' })
    return
  }

  // ── Validar body ──
  const errors = validateBody(req.body || {})

  if (errors.length > 0) {
    res.status(400).json({ message: errors.join('. ') })
    return
  }

  // ── Enviar email vía EmailJS API ──
  const { from_name, from_email, title, message } = req.body

  try {
    const emailjsResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: process.env.EMAILJS_OUTLOOK_SERVICE_ID,
        template_id: process.env.EMAILJS_TEMPLATE_ID,
        user_id: process.env.EMAILJS_PUBLIC_KEY,
        accessToken: process.env.EMAILJS_PRIVATE_KEY,
        template_params: {
          from_name,
          from_email,
          title,
          message,
        },
      }),
    })

    if (!emailjsResponse.ok) {
      const errorText = await emailjsResponse.text()
      console.error(`EmailJS error: ${emailjsResponse.status} — ${errorText}`)
      res.status(500).json({ message: 'Error al enviar el mensaje. Intenta de nuevo.' })
      return
    }

    res.status(200).json({ message: 'Mensaje enviado exitosamente' })
  } catch (error) {
    console.error('Error en serverless function:', error)
    res.status(500).json({ message: 'Error interno del servidor. Intenta de nuevo.' })
  }
}
