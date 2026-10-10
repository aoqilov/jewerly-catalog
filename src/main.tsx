import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style/index.css'
import { getActiveNiche } from '@/lib/activeNiche'
import { applyNiche } from '@/lib/applyNiche'
import { initPwaInstall } from '@/lib/pwaInstall'
import { App } from './App'

// Rang palitrasi: foydalanuvchi tanlovi (localStorage) yoki config/niche.ts'dagi NICHE
applyNiche(getActiveNiche())
// O'rnatish hodisasi sahifa ochilishi bilan keladi: Profil sahifasi ochilmasdan oldin ushlab qolinadi
initPwaInstall()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
