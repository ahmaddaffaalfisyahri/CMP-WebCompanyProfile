import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './motion.css'
import App from './App.jsx'
import { jumpToScrollPosition } from './utils/scroll.js'

const navigation = performance.getEntriesByType('navigation')[0]
if (window.location.pathname === '/' && navigation?.type === 'reload') {
  const { history, location } = window
  const previousRestoration = history.scrollRestoration
  history.scrollRestoration = 'manual'
  if (location.hash) {
    history.replaceState(history.state, '', location.pathname + location.search)
  }
  jumpToScrollPosition(0)

  // Let the browser finish loading before restoring its history navigation behavior.
  window.addEventListener('pageshow', () => {
    requestAnimationFrame(() => { history.scrollRestoration = previousRestoration })
  }, { once: true })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
