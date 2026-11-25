
import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'

const App = lazy(() => import('./App.jsx'))
const AdminApp = lazy(() => import('./pages/AdminApp.jsx'))

const isAdminPage =
  window.location.pathname === '/admin' ||
  window.location.pathname.startsWith('/admin/')

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Suspense
      fallback={
        <div
          style={{
            minHeight: '100vh',
            display: 'grid',
            placeItems: 'center',
            background: '#101014',
            color: '#b9a0f5',
            fontFamily: 'sans-serif',
          }}
        >
          Loading portfolio...
        </div>
      }
    >
      {isAdminPage ? <AdminApp /> : <App />}
    </Suspense>
  </StrictMode>
)
