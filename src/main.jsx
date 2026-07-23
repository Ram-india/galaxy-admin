
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { NotificationProvider } from './context/NotificationContext.jsx'
import { BrandingProvider } from './context/BrandingContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <ThemeProvider>
    {/* Public branding — also brands the login screen, so it sits above auth */}
    <BrandingProvider>
      <AuthProvider>
        {/* Depends on AuthProvider: polling only runs for a signed-in admin */}
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </AuthProvider>
    </BrandingProvider>
  </ThemeProvider>
  </BrowserRouter>,
)
