import { LuMenu } from 'react-icons/lu'

type ProfileTopBarProps = {
  title: string
  onOpenSettings: () => void
}

// Instagram kabi: chapda login, o'ngda menyu (sozlamalar). Mobilda eng tepada (Header yashirilgan), md'da Header ostida
export function ProfileTopBar({ title, onOpenSettings }: ProfileTopBarProps) {
  return (
    <div className="glass-bar sticky top-0 z-30 md:top-10">
      <div className="mx-auto flex h-14 max-w-2xl items-center justify-between gap-2 pr-2 pl-4">
        <h1 className="truncate text-xl font-bold text-text">{title}</h1>
        {/* glass-bar ichida: blur'siz, shaffof */}
        <button
          type="button"
          onClick={onOpenSettings}
          aria-label="Sozlamalar"
          aria-haspopup="dialog"
          className="flex size-11 shrink-0 items-center justify-center rounded-full text-text transition-colors hover:bg-fill focus-visible:outline-2 focus-visible:outline-brand"
        >
          <LuMenu aria-hidden className="size-6" />
        </button>
      </div>
      <div className="gline" />
    </div>
  )
}
