# Portafolio Profesional | Jefferson Lizarazu

> **Desarrollador Full Stack**

Este repositorio no es un template genérico para clonar o reutilizar. Ha sido diseñado específicamente como una **pieza de comunicación de ingeniería de software** y un lienzo técnico vivo. Su propósito es demostrar de forma transparente mis capacidades de arquitectura, optimización de rendimiento, buenas prácticas y toma de decisiones tecnológicas en proyectos del ecosistema moderno de React.

---

## 🎯 Propósito de este Repositorio

En lugar de construir una web simple basada puramente en lo visual, este proyecto se concibió bajo estándares de producción. Sirve como prueba de concepto para:

1. **Demostrar Arquitectura Limpia y Modular**: Modularización lógica que facilita la mantenibilidad del código sin sobrecargar la estructura de carpetas.
2. **Exhibir Patrones de Optimización**: Soluciones reales a problemas comunes de consumo de APIs y carga inicial.
3. **Comunicar Decisiones Técnicas**: Toda implementación tiene un "por qué" bien fundamentado en lugar de usar librerías por inercia.

---

## 🏗️ Soluciones de Ingeniería & Decisiones de Diseño

### 1. Estrategia SWR (Stale-While-Revalidate) para la API de GitHub

Un problema común de los portafolios es el uso excesivo de _loading skeletons_ o bloqueos de renderizado cada vez que el usuario navega a la sección de proyectos.

- **La Solución**: En `src/hooks/useGitHubRepos.ts` y `src/utils/githubCache.ts` implementé una estrategia de caché en `localStorage` con enfoque _Stale-While-Revalidate_.
- **El Flujo**:
  - **Render Síncrono**: Durante el ciclo inicial del render (no dentro de un efecto), se lee síncronamente `localStorage` para hidratar el estado al instante. Esto elimina cualquier _flash of unstyled content_ (FOUC).
  - **Caché Fresco**: Si la información guardada tiene menos de 1 hora de antigüedad, el render es inmediato y no se realiza ninguna llamada de red externa.
  - **Caché Vencido (Stale)**: Si el caché expiró, se muestran los datos cacheados inmediatamente para dar una UX instantánea, mientras que en segundo plano (silenciosamente) se ejecuta una petición a la API de GitHub. Al finalizar, el estado se actualiza suavemente y el nuevo caché se guarda.
  - **Resiliencia ante Errores**: Si la petición de fondo falla debido a cuotas de la API o pérdida de conexión, el error se traga silenciosamente y el usuario sigue visualizando la data almacenada.

### 2. Optimización de Bundle: Lazy Loading Eficiente

Cargar todo el código de una sola vez penaliza severamente el tiempo de primera interacción (FID / TTI).

- **La Solución**: Implementación rigurosa de `React.lazy()` y `Suspense` en `App.jsx` para el enrutamiento.
- **El Impacto**: El tamaño del bundle de carga inicial se redujo en un **28%** (de `~490 KB` a `~355 KB`), logrando que cada página (Home, About, Projects, Contact) se compile en un chunk independiente que solo se descarga bajo demanda.

### 3. Sistema de Estilos Unificado: Single Source of Truth

Evito a toda costa la fragmentación de estilos (mezclar CSS Modules, inline styles, Styled Components y Tailwind). El desorden visual es el primer indicador de una mala base de código.

- **La Solución**: Unificación completa bajo el sistema de temas de **Material UI (MUI)**.
- **La Regla**:
  - Se utiliza exclusivamente la propiedad `sx` de MUI para adaptaciones locales rápidas de layouts y el `ThemeProvider` global (`ThemeContext.tsx`) para gestionar las paletas de colores (Dark & Light mode) de forma centralizada.
  - `index.css` queda relegado únicamente a resets mínimos del navegador, animaciones globales y personalización estricta del scrollbar.

### 4. Formulario Seguro con Validación Estricta e Inmunidad Anti-Spam

Los formularios de contacto son la principal puerta de entrada para bots maliciosos y entradas mal estructuradas.

- **La Solución**:
  - **Estructura y Validación**: Formulario construido con `react-hook-form` acoplado con `Zod` (`contactSchema.ts`) mediante resolvers. Esto garantiza un tipado estático end-to-end de los datos recolectados y validación en tiempo de ejecución en tiempo real antes del envío.
  - **Protección Anti-Spam Silenciosa (Mínimo de Interacción)**: En lugar de obligar al usuario a resolver molestos captchas visuales que arruinan la conversión, el custom hook `useSpamProtection.ts` mide el tiempo transcurrido desde el montaje del formulario. Si un envío es gatillado en menos de 5 segundos, se asume que es una automatización robótica (un bot) y la petición es abortada de forma silenciosa.

---

## 📂 Organización de Carpetas (Clean Directory Tree)

El directorio `src` está estructurado bajo principios de responsabilidad única y alta cohesión:

```
src/
├── assets/           # Recursos estáticos (imágenes de interfaz, logos de tecnologías)
├── components/       # Componentes de presentación divididos lógicamente por sección
│   ├── about/
│   ├── contact/
│   ├── home/
│   ├── layout/       # Componentes estructurales (Header, Footer, Layout global)
│   ├── projects/
│   └── shared/       # Componentes cross-cutting reutilizables (ErrorBoundary, PageLoader)
├── config/           # Configuración centralizada no sensible (usernames, variables del entorno)
├── constants/        # Constantes estáticas globales (rutas de navegación, enlaces fijos)
├── context/          # Contextos globales (Manejo de estado de temas Dark/Light)
├── hooks/            # Hooks personalizados reutilizables (useGitHubRepos, useSpamProtection)
├── pages/            # Páginas de la SPA preparadas para importación perezosa (lazy-load)
├── services/         # Clientes de servicios externos (API de GitHub, EmailJS)
├── test/             # Configuración del entorno de pruebas unitarias/integración
├── theme/            # Configuración visual del tema MUI (paleta, tipografías, overrides de componentes)
├── types/            # Definición centralizada de tipos TypeScript para todo el dominio
├── ui/               # Componentes atómicos de diseño personalizado (ej: GlassButton)
├── utils/            # Funciones puras utilitarias y manejadores auxiliares (githubCache)
└── validations/      # Esquemas de validación de datos con esquemas Zod
```

---

## 🔍 Auditorías de Calidad y Mantenibilidad

El proyecto cuenta con procesos formales de análisis de código documentados en la carpeta `/docs`:

1. **[Auditoría de Arquitectura](./docs/ARCHITECTURE-AUDIT.md)**: Análisis formal del estado del código, la modularidad de carpetas, estándares de unificación de estilos de componentes y pautas de imports para evitar dependencias circulares y barrel files innecesarios.
2. **[Auditoría de Responsive Design](./docs/RESPIVE-AUDIT.md)**: Manual de control y script automatizado (`scripts/check-responsive.js`) utilizado para auditar y corregir problemas de desbordamiento horizontal y layouts rotos en vistas de dispositivos móviles, logrando adaptabilidad perfecta en pantallas de `xs` (mobile) hasta `xl` (desktop).

---

## 🧪 Estrategia de Pruebas (Test Suite)

La calidad no es negociable en proyectos de ingeniería. El portafolio está cubierto a múltiples niveles:

- **Pruebas Unitarias y de Integración**: Desarrolladas con **Vitest** + **React Testing Library** + **JSDom** para verificar de forma aislada el comportamiento de hooks customizados, lógica utilitaria y la correcta integración de los componentes en respuesta a interacciones del usuario.
- **Pruebas End-to-End (E2E)**: Configuradas con **Playwright** para simular la navegación completa de un usuario real, validando la interacción entre vistas, transiciones de temas y el flujo del formulario de contacto.

---

## 📧 Información de Contacto y Enlaces

Si estás interesado en conocer más sobre mi forma de diseñar y estructurar software, puedes revisar el portafolio en producción o ponerte en contacto directamente:

- **LinkedIn**: [Jefferson Lizarazu](https://www.linkedin.com/in/jefferson-lizarazu/)
- **Email**: [jeffersonlizarazu@hotmail.com](mailto:jeffersonlizarazu@hotmail.com) | [jeffersonliza21@gmail.com](mailto:jeffersonliza21@gmail.com)
- **GitHub**: [@jeffersonlizarazu07](https://github.com/jeffersonlizarazu07)
