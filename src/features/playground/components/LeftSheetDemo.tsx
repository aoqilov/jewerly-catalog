import { useState } from 'react'
import { CusButton } from '@/shared/ui/CusButton'
import { CusLeftSheet } from '@/shared/ui/CusLeftSheet'
import { PlaygroundSection } from './PlaygroundSection'

export function LeftSheetDemo() {
  const [isOpen, setOpen] = useState(false)

  return (
    <PlaygroundSection title="LeftSheet">
      <CusButton variant="secondary" onClick={() => setOpen(true)} className="w-fit">
        Ochish
      </CusButton>

      <CusLeftSheet isOpen={isOpen} onClose={() => setOpen(false)} title="Panel">
        <p className="px-4 py-3 text-sm text-muted">Chapdan chiqadigan panel mazmuni shu yerda.</p>
      </CusLeftSheet>
    </PlaygroundSection>
  )
}
