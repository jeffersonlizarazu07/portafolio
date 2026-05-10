import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from './context/ThemeContext'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <CssBaseline />
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>
)
