import type { CSSProperties } from 'react'
import { NICHE } from '@/config/niche'
import { PlaygroundSection } from './PlaygroundSection'

// Faol nishaning asosiy ranglari. Nisha config/niche.ts'dagi NICHE qatorida almashtiriladi
export function NicheDemo() {
  return (
    <PlaygroundSection title={`Nisha: ${NICHE.name}`}>
      <ul className="grid grid-cols-3 gap-2">
        {Object.entries(NICHE.colors).map(([name, color]) => (
          <li key={name} className="flex flex-col gap-1">
            <span
              className="h-10 rounded-md border border-line bg-(--swatch)"
              style={{ '--swatch': color } as CSSProperties}
            />
            <span className="text-xs font-semibold text-text">{name}</span>
            <span className="text-xs text-muted">{color}</span>
          </li>
        ))}
      </ul>
      <span className="badge-new w-fit">Yangi</span>
    </PlaygroundSection>
  )
}
