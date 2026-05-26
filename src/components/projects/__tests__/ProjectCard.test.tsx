/**
 * Tests de ProjectCard — componente presentacional puro.
 *
 * Recibe todo por props, NO tiene lógica interna.
 * Verifica que renderiza correctamente y que las callbacks se disparan.
 */
import { describe, it, expect, vi } from 'vitest'
import { screen, fireEvent } from '@testing-library/react'
import { renderWithTheme } from '@/test/test-utils'
import { ProjectCard } from '../ProjectCard'
import type { GitHubRepo } from '@/types/GitHub'

// ── MOCKS ──────────────────────────────────────────────────────────────

const mockProject: GitHubRepo = {
  title: 'repo-uno',
  description: 'Primer proyecto',
  tech: ['React', 'TypeScript'],
  url: 'https://github.com/test/repo-uno',
  stars: 10,
  image: 'https://example.com/preview.png',
  language: 'TypeScript',
  deployment_url: 'https://midemo.com',
}

const mockProjectNoDeploy: GitHubRepo = {
  ...mockProject,
  title: 'repo-sin-deploy',
  deployment_url: null,
}

const defaultProps = {
  project: mockProject,
  index: 0,
  displayImage: 'https://example.com/preview.png',
  onImageError: vi.fn(),
  onCardClick: vi.fn(),
  onRocketClick: vi.fn(),
}

// ── TESTS ──────────────────────────────────────────────────────────────

describe('ProjectCard', () => {
  it('renderiza título, descripción y tecnologías', () => {
    renderWithTheme(<ProjectCard {...defaultProps} />)

    expect(screen.getByText('repo-uno')).toBeInTheDocument()
    expect(screen.getByText('Primer proyecto')).toBeInTheDocument()
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })

  it('muestra la imagen con la URL pasada por props', () => {
    renderWithTheme(<ProjectCard {...defaultProps} />)

    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', 'https://example.com/preview.png')
  })

  it('llama onImageError cuando la imagen falla al cargar', () => {
    const onImageError = vi.fn()
    renderWithTheme(<ProjectCard {...defaultProps} onImageError={onImageError} />)

    fireEvent.error(screen.getByRole('img'))
    expect(onImageError).toHaveBeenCalledTimes(1)
  })

  it('llama onCardClick al hacer click en tarjeta SIN deployment', () => {
    const onCardClick = vi.fn()
    renderWithTheme(
      <ProjectCard {...defaultProps} project={mockProjectNoDeploy} onCardClick={onCardClick} />
    )

    fireEvent.click(screen.getByText('repo-sin-deploy'))
    expect(onCardClick).toHaveBeenCalledTimes(1)
  })

  it('llama onRocketClick al hacer click en el icono de cohete', () => {
    const onRocketClick = vi.fn()
    renderWithTheme(<ProjectCard {...defaultProps} onRocketClick={onRocketClick} />)

    const rocket = screen.getByTestId('RocketLaunchIcon')
    expect(rocket).toBeInTheDocument()
    fireEvent.click(rocket)
    expect(onRocketClick).toHaveBeenCalledTimes(1)
  })

  it('el click en el cohete NO propaga al CardActionArea', () => {
    const onCardClick = vi.fn()
    const onRocketClick = vi.fn()
    renderWithTheme(
      <ProjectCard {...defaultProps} onCardClick={onCardClick} onRocketClick={onRocketClick} />
    )

    const rocket = screen.getByTestId('RocketLaunchIcon')
    fireEvent.click(rocket)
    expect(onRocketClick).toHaveBeenCalledTimes(1)
    expect(onCardClick).not.toHaveBeenCalled()
  })

  describe('loading priorities', () => {
    it('usa loading eager y fetchPriority high para index < 3', () => {
      renderWithTheme(<ProjectCard {...defaultProps} index={0} />)

      const img = screen.getByRole('img')
      expect(img).toHaveAttribute('loading', 'eager')
      expect(img).toHaveAttribute('fetchpriority', 'high')
    })

    it('usa loading lazy y fetchPriority auto para index >= 3', () => {
      renderWithTheme(<ProjectCard {...defaultProps} index={3} />)

      const img = screen.getByRole('img')
      expect(img).toHaveAttribute('loading', 'lazy')
      expect(img).toHaveAttribute('fetchpriority', 'auto')
    })
  })

  describe('cursor style', () => {
    it('muestra cursor pointer cuando hay deployment_url', () => {
      renderWithTheme(<ProjectCard {...defaultProps} />)

      const card = screen.getByText('repo-uno').closest('a')
      expect(card).toHaveStyle('cursor: pointer')
    })

    it('muestra cursor help cuando NO hay deployment_url', () => {
      renderWithTheme(<ProjectCard {...defaultProps} project={mockProjectNoDeploy} />)

      const card = screen.getByText('repo-sin-deploy').closest('a')
      expect(card).toHaveStyle('cursor: help')
    })
  })
})
