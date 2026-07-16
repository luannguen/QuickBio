import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "./styles/index.css"
import App from './App.tsx'
import { ThemeProvider } from "@/components/ThemeProvider"
import { GlobalErrorBoundary } from '@/shared/components/error/GlobalErrorBoundary'
import { ToastProvider } from '@/shared/components/ui/ToastProvider'
import { ModalProvider } from '@/shared/components/ui/ModalProvider'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <ThemeProvider defaultTheme="dark" storageKey="quickbio-theme">
        <App />
        <ToastProvider />
        <ModalProvider />
      </ThemeProvider>
    </GlobalErrorBoundary>
  </StrictMode>,
)
