import { useState } from 'react'
import { CusChipBar } from '@/shared/ui/CusChipBar'
import { PlaygroundSection } from './PlaygroundSection'

const options = [
  { value: 0, label: 'Hammasi' },
  { value: 1, label: "Sirg'a" },
  { value: 2, label: 'Uzuk' },
  { value: 3, label: 'Marjon' },
  { value: 4, label: 'Bilaguzuk' },
  { value: 5, label: "Taqinchoq to'plami" },
  { value: 6, label: 'Zanjir' },
]

export function ChipBarDemo() {
  const [selected, setSelected] = useState<number[]>([0])

  // 0 ("Hammasi") tanlovni tozalaydi, qolganlari qo'shiladi/olinadi, bo'sh qolsa yana "Hammasi"
  const handleSelect = (value: number) => {
    if (value === 0) return setSelected([0])
    const rest = selected.filter((item) => item !== 0)
    const next = rest.includes(value) ? rest.filter((item) => item !== value) : [...rest, value]
    setSelected(next.length ? next : [0])
  }

  return (
    <PlaygroundSection title="ChipBar">
      {/* Haqiqiy joyida .glass-bar ichida turadi */}
      <div className="glass-bar rounded-md p-2">
        <CusChipBar aria-label="Subkategoriya" options={options} selected={selected} onSelect={handleSelect} />
      </div>
    </PlaygroundSection>
  )
}
