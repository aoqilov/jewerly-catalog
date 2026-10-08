import { useId } from 'react'
import type { ComponentPropsWithoutRef } from 'react'

type CusInputProps = ComponentPropsWithoutRef<'input'> & {
  label: string
  // Berilsa maydon xato holatida ko'rinadi va matn ostida chiqadi
  error?: string
  hint?: string
}

// Ko'rinadigan label + maydon. Ro'yxat elementi emas, shuning uchun bg-tile (blur'siz)
export function CusInput({ label, error, hint, id, className = '', ...rest }: CusInputProps) {
  const autoId = useId()
  const inputId = id ?? autoId
  const noteId = `${inputId}-note`
  const note = error ?? hint

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={inputId} className="text-sm font-semibold text-text">
        {label}
      </label>
      <input
        id={inputId}
        aria-invalid={error ? true : undefined}
        aria-describedby={note ? noteId : undefined}
        className={`h-12 rounded-md border bg-tile px-3 text-[15px] text-text placeholder:text-muted focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-brand ${
          error ? 'border-brand' : 'border-line'
        }`}
        {...rest}
      />
      {note && (
        <p id={noteId} className={`text-xs ${error ? 'font-semibold text-accent' : 'text-muted'}`}>
          {note}
        </p>
      )}
    </div>
  )
}
