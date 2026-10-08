import { useId } from 'react'
import type { ReactNode } from 'react'
import { SECTION_LABEL_CLASS } from '@/config/ui'

type ProfileSectionProps = {
  label: string
  children: ReactNode
}

// Bo'lim: sarlavha + chegarali ro'yxat (ro'yxat bo'lgani uchun bg-tile, blur'siz). Qatorlar orasiga chiziq qo'yiladi
export function ProfileSection({ label, children }: ProfileSectionProps) {
  const labelId = useId()

  return (
    <section aria-labelledby={labelId} className="flex flex-col gap-2">
      <h2 id={labelId} className={`px-1 ${SECTION_LABEL_CLASS}`}>
        {label}
      </h2>
      <div className="flex flex-col divide-y divide-line overflow-hidden rounded-md border border-line bg-tile">
        {children}
      </div>
    </section>
  )
}
