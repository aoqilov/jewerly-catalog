import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style/index.css'
import { NICHE } from '@/config/niche'
import { applyNiche } from '@/lib/applyNiche'
import { App } from './App'

// Rang palitrasi config/niche.ts'dagi NICHE'dan olinadi
applyNiche(NICHE)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
