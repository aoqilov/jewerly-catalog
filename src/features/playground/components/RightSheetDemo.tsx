import { useState } from 'react'
import { CusButton } from '@/shared/ui/CusButton'
import type { CusRightSheetWidth } from '@/shared/ui/CusRightSheet'
import { CusRightSheet } from '@/shared/ui/CusRightSheet'
import { PlaygroundSection } from './PlaygroundSection'

const WIDTH_OPTIONS: { value: CusRightSheetWidth; label: string }[] = [
  { value: 'quarter', label: '25%' },
  { value: 'half', label: '50%' },
  { value: 'full', label: 'To\'liq' },
]

export function RightSheetDemo() {
  const [openWidth, setOpenWidth] = useState<CusRightSheetWidth | null>(null)

  return (
    <PlaygroundSection title="RightSheet">
      <div className="flex flex-wrap gap-2">
        {WIDTH_OPTIONS.map((option) => (
          <CusButton key={option.value} variant="secondary" onClick={() => setOpenWidth(option.value)}>
            {option.label}
          </CusButton>
        ))}
      </div>

      <CusRightSheet
        isOpen={openWidth !== null}
        onClose={() => setOpenWidth(null)}
        title={`Panel (${WIDTH_OPTIONS.find((o) => o.value === openWidth)?.label ?? ''})`}
        width={openWidth ?? 'half'}
      >
        <p className="text-sm text-muted">O'ngdan chiqadigan panel mazmuni shu yerda.</p>
      </CusRightSheet>
    </PlaygroundSection>
  )
}
