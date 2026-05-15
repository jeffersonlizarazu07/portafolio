/**
 * Configuración global de tests.
 *
 * `@testing-library/jest-dom/vitest` agrega matchers personalizados a `expect`:
 *   - toBeInTheDocument()
 *   - toHaveTextContent()
 *   - toBeVisible()
 *   - toHaveAttribute()
 *   - y muchos más…
 *
 * Sin este import, `expect(screen.getByText('foo')).toBeInTheDocument()`
 * lanzaría "matcher not found".
 */
import '@testing-library/jest-dom/vitest'
