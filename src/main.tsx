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

// When the bundle is loaded directly via `/tools/voorstel/index.html`
// (e.g. the hub's staff-facing /voorstel wrapper iframe), rewrite the
// URL to the admin dashboard before React Router mounts, otherwise no
// route matches and the app renders a blank screen.
try {
  const p = window.location.pathname
  if (
    /\/tools\/voorstel(\/.*)?$/i.test(p) ||
    /index\.html$/i.test(p)
  ) {
    window.history.replaceState({}, '', '/agensea-admin')
  }
} catch {
  /* noop */
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
