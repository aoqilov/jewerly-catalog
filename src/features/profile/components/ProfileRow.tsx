import type { ReactNode } from 'react'

type ProfileRowProps = {
  icon: ReactNode
  label: string
  // Qatorning o'ng qismi: qiymat, boshqaruv yoki strelka
  trailing?: ReactNode
  // Berilsa qator tugma bo'ladi
  onClick?: () => void
  disabled?: boolean
}

const rowClass = 'flex min-h-14 w-full items-center gap-3 px-3 py-2 text-left'

export function ProfileRow({ icon, label, trailing, onClick, disabled = false }: ProfileRowProps) {
  const content = (
    <>
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-fill text-accent">{icon}</span>
      <span className="min-w-0 flex-1 truncate text-[15px] font-semibold text-text">{label}</span>
      {trailing}
    </>
  )

  if (!onClick) return <div className={rowClass}>{content}</div>

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${rowClass} transition-colors hover:bg-fill focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand disabled:pointer-events-none disabled:opacity-60`}
    >
      {content}
    </button>
  )
}
