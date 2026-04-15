import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'

// When embedded inside the Agensea hub iframe, add a flag on the root
// element so CSS can hide chrome the hub already shows (logo, nav, etc).
try {
  if (window.self !== window.top) {
    document.documentElement.classList.add('embedded')
  }
} catch {
  document.documentElement.classList.add('embedded')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
