/**
 * Data de tecnologías y certificaciones de TechSection.
 *
 * Separada del componente porque la data cambia por razones distintas
 * al layout o al diseño visual.
 */
import type { ElementType } from 'react'
import { ReactIcon } from '@/assets/tech-icons/React'
import { TypeScriptIcon } from '@/assets/tech-icons/TypeScript'
import { NodeIcon } from '@/assets/tech-icons/Node'
import { TailwindIcon } from '@/assets/tech-icons/Tailwind'
import { ExpressIcon } from '@/assets/tech-icons/Express'
import { DockerIcon } from '@/assets/tech-icons/Docker'
import LinkIcon from '@mui/icons-material/Link'

export interface TechItem {
  name: string
  Icon: ElementType
}

export interface Certification {
  institution: string
  title: string
  url: string
  Icon: ElementType
  buttonLabel: string
  plataform: string
}

export const techStack: TechItem[] = [
  { name: 'React', Icon: ReactIcon },
  { name: 'TypeScript', Icon: TypeScriptIcon },
  { name: 'Node.js', Icon: NodeIcon },
  { name: 'Express.js', Icon: ExpressIcon },
  { name: 'Tailwind', Icon: TailwindIcon },
  { name: 'Docker', Icon: DockerIcon },
]

export const certifications: Certification[] = [
  {
    institution: 'Duke University',
    title: 'Programming Foundations with JavaScript, HTML and CSS.',
    url: 'https://coursera.org/verify/YTAQCYJK66NM',
    Icon: LinkIcon,
    buttonLabel: 'URL',
    plataform: 'Coursera',
  },
  {
    institution: 'Meta',
    title: 'Introducción al desarrollo de back-end.',
    url: 'https://coursera.org/verify/SWRQLLIUVW5B',
    Icon: LinkIcon,
    buttonLabel: 'URL',
    plataform: 'Coursera',
  },
]
