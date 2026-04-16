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

// When served via the hub's pretty URL (/<client>/voorstel/<slug>),
// the proposal UUID is injected as window.__PROPOSAL_ID. Rewrite the
// URL to /v/<id> so React Router's /v/:id route matches and the
// ProposalViewer renders. The browser address bar keeps the pretty URL
// because replaceState doesn't trigger a visible navigation.
// NOTE: replaceState DOES change what's shown in the address bar, but
// since this fires before the first paint, the user never sees the
// original pretty URL flash — they just see the voorstel content.
try {
  if ((window as any).__PROPOSAL_ID) {
    window.history.replaceState({}, '', '/v/' + (window as any).__PROPOSAL_ID)
  } else {
    const p = window.location.pathname
    if (
      /\/tools\/voorstel(\/.*)?$/i.test(p) ||
      /index\.html$/i.test(p)
    ) {
      window.history.replaceState({}, '', '/agensea-admin')
    }
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
