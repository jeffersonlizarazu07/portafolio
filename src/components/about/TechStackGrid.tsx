/**
 * Grilla de tecnologías.
 *
 * Renderiza el grid responsivo de TechCards.
 * Cambia solo si cambia el layout de la grilla (columnas, espaciado).
 */
import { Grid } from '@mui/material'
import { techStack } from './aboutData'
import { TechCard } from './TechCard'

export const TechStackGrid = () => (
  <Grid container spacing={4}>
    {techStack.map((tech) => (
      <Grid size={{ xs: 6, md: 4, lg: 2 }} key={tech.name}>
        <TechCard tech={tech} />
      </Grid>
    ))}
  </Grid>
)
