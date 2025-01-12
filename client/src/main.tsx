import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { UploadPage } from './UploadPage.tsx' 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UploadPage />
  </StrictMode>,
)

