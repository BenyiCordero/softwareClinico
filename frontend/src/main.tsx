import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/main.css'
import './styles/login.css'
import './styles/dashboard.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)