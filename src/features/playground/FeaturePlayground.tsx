import { useTheme } from '@/hooks/useTheme'
import { ThemeToggle } from '@/shared/components/ThemeToggle'
import { ButtonsDemo } from './components/ButtonsDemo'
import { InputDemo } from './components/InputDemo'
import { NicheDemo } from './components/NicheDemo'
import { PlaygroundSection } from './components/PlaygroundSection'
import { RightSheetDemo } from './components/RightSheetDemo'
import { SegmentedDemo } from './components/SegmentedDemo'

// Dizayn-tizim komponentlarini haqiqiy ekranlarga qo'yishdan oldin ko'rib chiqish uchun
export function FeaturePlayground() {
  const { theme } = useTheme()

  return (
    <div className="mx-auto flex max-w-md flex-col gap-8 px-4 py-6">
      <h1 className="text-[22px] font-bold text-text">Playground</h1>

      <PlaygroundSection title="Mavzu">
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <p className="text-sm text-muted">
            Hozirgi mavzu: <span className="font-semibold text-accent">{theme}</span>
          </p>
        </div>
      </PlaygroundSection>

      <NicheDemo />
      <ButtonsDemo />
      <SegmentedDemo />
      <InputDemo />
      <RightSheetDemo />

      <PlaygroundSection title="BottomNav">
        <p className="text-sm text-muted">
          Mobil kenglikda (md dan kichik) ekran pastida ko'rinadi.
        </p>
      </PlaygroundSection>
    </div>
  )
}
