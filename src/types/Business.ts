/**
 * Tipos para la sección "Soluciones para Negocio" (B2B Showcase).
 *
 * Separados del resto porque este módulo crece independientemente
 * al agregar nuevas soluciones base y módulos de expansión.
 *
 * Filosofía de diseño:
 * - No usamos términos técnicos (React, Node) en los textos comerciales.
 * - Cada métrica responde a: "¿qué gana el cliente con esto?"
 * - Los módulos de expansión son el upsell: lo que el cliente PUEDE agregar.
 */

import type { ElementType } from 'react'

/**
 * Métrica de negocio — dato concreto que demuestra valor comercial.
 * Ejemplos: "Carga < 1s", "+20% Conversión", "Sin servidor"
 */
export interface BusinessMetric {
  label: string
  value: string
}

/**
 * Tecnología con su razón comercial.
 * Al cliente no le interesa la versión de React,
 * le interesa POR QUÉ esa tecnología beneficia SU negocio.
 */
export interface TechReason {
  name: string
  reason: string
}

/**
 * Módulo de expansión personalizable.
 * Representa una feature que se puede contratar por separado
 * para robustecer la solución base.
 */
export interface ExpansionModule {
  id: string
  title: string
  description: string
  Icon: ElementType
  isAvailable: boolean
}

/**
 * Solución de negocio completa.
 * Una solución base (el catálogo demo) con sus módulos expandibles.
 */
export interface BusinessSolution {
  id: string
  title: string
  subtitle: string
  problemDescription: string
  solutionDescription: string
  businessValue: string
  metrics: BusinessMetric[]
  techReasoning: TechReason[]
  demoUrl?: string
  contactPreFill: string
  imageUrl?: string
  isFeatured: boolean
  status: 'ready' | 'development' | 'on-demand'
  expansionModules: ExpansionModule[]
}
