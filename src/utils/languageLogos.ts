// Mapeo de lenguajes → URLs de logos desde SimpleIcons CDN
// SimpleIcons es el estándar para logos de tecnologías open source
export const languageLogos: Record<string, string> = {
  JavaScript: 'https://cdn.simpleicons.org/javascript/white',
  TypeScript: 'https://cdn.simpleicons.org/typescript/white',
  Python: 'https://cdn.simpleicons.org/python/white',
  Go: 'https://cdn.simpleicons.org/go/white',
  Rust: 'https://cdn.simpleicons.org/rust/white',
  Java: 'https://cdn.simpleicons.org/openjdk/white',
  'C#': 'https://cdn.simpleicons.org/csharp/white',
  'C++': 'https://cdn.simpleicons.org/cplusplus/white',
  C: 'https://cdn.simpleicons.org/c/white',
  Ruby: 'https://cdn.simpleicons.org/ruby/white',
  PHP: 'https://cdn.simpleicons.org/php/white',
  Swift: 'https://cdn.simpleicons.org/swift/white',
  Kotlin: 'https://cdn.simpleicons.org/kotlin/white',
  Dart: 'https://cdn.simpleicons.org/dart/white',
  HTML: 'https://cdn.simpleicons.org/html5/white',
  CSS: 'https://cdn.simpleicons.org/css3/white',
  SCSS: 'https://cdn.simpleicons.org/sass/white',
  Shell: 'https://cdn.simpleicons.org/gnubash/white',
  Dockerfile: 'https://cdn.simpleicons.org/docker/white',
  Nix: 'https://cdn.simpleicons.org/nixos/white',
  Lua: 'https://cdn.simpleicons.org/lua/white',
  Haskell: 'https://cdn.simpleicons.org/haskell/white',
  Elixir: 'https://cdn.simpleicons.org/elixir/white',
  Clojure: 'https://cdn.simpleicons.org/clojure/white',
  Scala: 'https://cdn.simpleicons.org/scala/white',
  R: 'https://cdn.simpleicons.org/r/white',
  Julia: 'https://cdn.simpleicons.org/julia/white',
  VimScript: 'https://cdn.simpleicons.org/vim/white',
  Zig: 'https://cdn.simpleicons.org/zig/white',
  Nim: 'https://cdn.simpleicons.org/nim/white',
  Crystal: 'https://cdn.simpleicons.org/crystal/white',
  Groovy: 'https://cdn.simpleicons.org/apachegroovy/white',
  Makefile: 'https://cdn.simpleicons.org/gnumakefile/white',
  Vue: 'https://cdn.simpleicons.org/vuejs/white',
  Svelte: 'https://cdn.simpleicons.org/svelte/white',
  Astro: 'https://cdn.simpleicons.org/astro/white',
  React: 'https://cdn.simpleicons.org/react/white',
  Angular: 'https://cdn.simpleicons.org/angular/white',
  Ember: 'https://cdn.simpleicons.org/emberjs/white',
  NextJS: 'https://cdn.simpleicons.org/nextjs/white',
  Remix: 'https://cdn.simpleicons.org/remix/white',
  NodeJS: 'https://cdn.simpleicons.org/nodedotjs/white',
  Bun: 'https://cdn.simpleicons.org/bun/white',
  Deno: 'https://cdn.simpleicons.org/deno/white',
  Express: 'https://cdn.simpleicons.org/express/white',
  Flask: 'https://cdn.simpleicons.org/flask/white',
  Django: 'https://cdn.simpleicons.org/django/white',
  FastAPI: 'https://cdn.simpleicons.org/fastapi/white',
  Spring: 'https://cdn.simpleicons.org/springboot/white',
  Rails: 'https://cdn.simpleicons.org/rubyonrails/white',
  Gatsby: 'https://cdn.simpleicons.org/gatsby/white',
  Prisma: 'https://cdn.simpleicons.org/prisma/white',
  PostgreSQL: 'https://cdn.simpleicons.org/postgresql/white',
  MySQL: 'https://cdn.simpleicons.org/mysql/white',
  SQLite: 'https://cdn.simpleicons.org/sqlite/white',
  MongoDB: 'https://cdn.simpleicons.org/mongodb/white',
  Redis: 'https://cdn.simpleicons.org/redis/white',
  GraphQL: 'https://cdn.simpleicons.org/graphql/white',
  Docker: 'https://cdn.simpleicons.org/docker/white',
  Kubernetes: 'https://cdn.simpleicons.org/kubernetes/white',
  Terraform: 'https://cdn.simpleicons.org/terraform/white',
  Ansible: 'https://cdn.simpleicons.org/ansible/white',
  AWS: 'https://cdn.simpleicons.org/amazonaws/white',
  Azure: 'https://cdn.simpleicons.org/microsoftazure/white',
  GCP: 'https://cdn.simpleicons.org/googlecloud/white',
  Vercel: 'https://cdn.simpleicons.org/vercel/white',
  Netlify: 'https://cdn.simpleicons.org/netlify/white',
  Figma: 'https://cdn.simpleicons.org/figma/white',
  Markdown: 'https://cdn.simpleicons.org/markdown/white',
  JSON: 'https://cdn.simpleicons.org/json/white',
  YAML: 'https://cdn.simpleicons.org/yaml/white',
  TOML: 'https://cdn.simpleicons.org/toml/white',
  XML: 'https://cdn.simpleicons.org/xml/white',
}

// ── Fallback SVG inline ────────────────────────────────────────────────
// SimpleIcons NO tiene un icono con slug "code" (retorna 404).
// En vez de depender de un CDN externo que puede fallar, usamos un SVG inline
// como data URI. Nunca dará 404, no depende de red, y se adapta al tema.
const getFallbackSvg = (color: string): string => {
  const hex = color === 'white' ? '#ffffff' : '#222222'
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${hex}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6"/></svg>`
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

/**
 * Obtiene la URL del logo para un lenguaje dado con el color según el tema.
 *
 * @param language - Nombre del lenguaje (null → logo genérico SVG inline)
 * @param color - Color del icono ('white' para tema dark, 'black' para tema light)
 *
 * SimpleIcons soporta colores como sufijo en la URL:
 *   /white → icono blanco (visible en fondo oscuro)
 *   /black → icono negro (visible en fondo claro)
 *
 * El fallback para lenguajes no mapeados es un SVG inline de un icono </>.
 * Nunca falla porque es autónomo — no depende de CDN externo.
 */
export const getLanguageLogo = (language: string | null, color: string = 'white'): string => {
  if (!language) return getFallbackSvg(color)
  const url = languageLogos[language]
  if (!url) return getFallbackSvg(color)
  // Reemplaza el sufijo de color (/white, /black, etc.) por el color solicitado
  return url.replace(/\/\w+$/, `/${color}`)
}
