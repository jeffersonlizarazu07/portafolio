import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// import App from './App.jsx'
import {FrontPage} from './pages/pages1'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FrontPage />
  </StrictMode>,
)
