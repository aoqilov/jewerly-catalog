import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style/index.css'
import { NICHE } from '@/config/niche'
import { applyNiche } from '@/lib/applyNiche'
import { initPwaInstall } from '@/lib/pwaInstall'
import { App } from './App'

// Rang palitrasi config/niche.ts'dagi NICHE'dan olinadi
applyNiche(NICHE)
// O'rnatish hodisasi sahifa ochilishi bilan keladi: Profil sahifasi ochilmasdan oldin ushlab qolinadi
initPwaInstall()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
