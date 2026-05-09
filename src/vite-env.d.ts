/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />
declare module '*.png'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.svg'
declare module '*.webp'

interface ImportMetaEnv {
  readonly VITE_API_KEY_EMAILJS: string
  readonly VITE_GMAIL_SERVICE_ID: string
  readonly VITE_OUTLOOK_SERVICE_ID: string
  readonly VITE_TEMPLATE_ID: string
  readonly VITE_MY_TOKEN: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
