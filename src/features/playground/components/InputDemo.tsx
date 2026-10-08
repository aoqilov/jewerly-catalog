import { CusInput } from '@/shared/ui/CusInput'
import { PlaygroundSection } from './PlaygroundSection'

export function InputDemo() {
  return (
    <PlaygroundSection title="Input">
      <CusInput label="Ism" placeholder="Ismingiz" autoComplete="given-name" />
      <CusInput label="Telefon raqam" type="tel" placeholder="+998 90 123 45 67" hint="Masalan: 90 123 45 67" />
      <CusInput label="Xato holati" defaultValue="90 12" error="Raqam to'liq emas" />
    </PlaygroundSection>
  )
}
