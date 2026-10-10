import { useState } from 'react'
import { LuCheck, LuImage } from 'react-icons/lu'
import { SECTION_LABEL_CLASS } from '@/config/ui'
import { CusButton } from '@/shared/ui/CusButton'
import { CusLeftSheet } from '@/shared/ui/CusLeftSheet'
import type { SubcategoryGroup } from '../hooks/useScopeSubcategories'

type SubcategorySheetProps = {
  isOpen: boolean
  onClose: () => void
  groups: SubcategoryGroup[]
  // Hozir tanlanganlar (bo'sh: hammasi)
  selectedIds: number[]
  onApply: (ids: number[]) => void
}

// Tasmadagi subkategoriyalarni kategoriya bo'yicha bo'lib, rasmli ro'yxat qilib ko'rsatadi; bir nechtasini belgilab
// "Ko'rsatish" bosiladi. Qoralama (draft) panel ochilganda tanlovdan boshlanadi; yopilsa tashlab yuboriladi
export function SubcategorySheet({ isOpen, onClose, groups, selectedIds, onApply }: SubcategorySheetProps) {
  return (
    <CusLeftSheet isOpen={isOpen} onClose={onClose} title="Subkategoriyalar">
      {/* Panel yopilgach element DOM'dan olinadi, shuning uchun qoralama har ochilganda yangidan boshlanadi */}
      <SubcategoryList
        groups={groups}
        initialIds={selectedIds}
        onApply={(ids) => {
          onApply(ids)
          onClose()
        }}
      />
    </CusLeftSheet>
  )
}

type SubcategoryListProps = {
  groups: SubcategoryGroup[]
  initialIds: number[]
  onApply: (ids: number[]) => void
}

function SubcategoryList({ groups, initialIds, onApply }: SubcategoryListProps) {
  const [draft, setDraft] = useState(initialIds)

  const toggle = (id: number) =>
    setDraft((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))

  // Bo'limning hammasi tanlangan bo'lsa olib tashlanadi, aks holda yetishmaganlari qo'shiladi
  const toggleGroup = (ids: number[]) =>
    setDraft((prev) =>
      ids.every((id) => prev.includes(id))
        ? prev.filter((id) => !ids.includes(id))
        : [...prev, ...ids.filter((id) => !prev.includes(id))],
    )

  return (
    <>
      <div className="flex flex-col gap-4 px-4 py-3">
        {/* Bo'limlardan alohida: tanlovni butunlay tozalaydi (hamma kategoriya bo'yicha ko'rsatadi) */}
        <div className="overflow-hidden rounded-md border border-line bg-tile">
          <Row label="Hammasi" isChecked={draft.length === 0} onClick={() => setDraft([])} />
        </div>

        {groups.map(({ category, subcategories }) => {
          const ids = subcategories.map((item) => item.id)
          const selectedCount = ids.filter((id) => draft.includes(id)).length
          const isAll = selectedCount === ids.length

          return (
            <section key={category.id} aria-label={category.name} className="flex flex-col gap-2">
              {/* Scroll paytida tepada qotib turadi; sheet foni (bg-fill) bilan, blur'siz */}
              <div className="sticky top-0 z-10 -mx-4 flex items-center gap-2 bg-fill px-4">
                <h3 className={`min-w-0 flex-1 truncate ${SECTION_LABEL_CLASS}`}>{category.name}</h3>
                <span className="shrink-0 text-xs text-muted">
                  {selectedCount} / {ids.length}
                </span>
                <button
                  type="button"
                  aria-pressed={isAll}
                  onClick={() => toggleGroup(ids)}
                  className="h-11 shrink-0 px-1 text-sm font-semibold text-accent focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
                >
                  {isAll ? 'Olib tashlash' : 'Hammasini tanlash'}
                </button>
              </div>

              <ul className="flex flex-col divide-y divide-line overflow-hidden rounded-md border border-line bg-tile">
                {subcategories.map((item) => (
                  <li key={item.id}>
                    <Row
                      label={item.name}
                      image={item.image}
                      isChecked={draft.includes(item.id)}
                      onClick={() => toggle(item.id)}
                    />
                  </li>
                ))}
              </ul>
            </section>
          )
        })}
      </div>

      {/* Qotib turadigan panel: ro'yxat uning ostidan suriladi */}
      <div className="glass-bar sticky bottom-0 mt-auto">
        <div className="gline" />
        <div className="flex items-center gap-2 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={() => setDraft([])}
            disabled={draft.length === 0}
            className="h-12 shrink-0 rounded-md border border-line px-4 text-[15px] font-semibold text-text transition-colors hover:bg-fill focus-visible:outline-2 focus-visible:outline-brand disabled:opacity-50"
          >
            Tozalash
          </button>
          <CusButton fullWidth onClick={() => onApply(draft)}>
            {draft.length > 0 ? `Ko'rsatish (${draft.length})` : "Hammasini ko'rsatish"}
          </CusButton>
        </div>
      </div>
    </>
  )
}

type RowProps = {
  label: string
  image?: string | null
  isChecked: boolean
  onClick: () => void
}

function Row({ label, image, isChecked, onClick }: RowProps) {
  return (
    <button
      type="button"
      aria-pressed={isChecked}
      onClick={onClick}
      className="flex min-h-16 w-full items-center gap-3 px-3 py-2 text-left transition-colors hover:bg-fill focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
    >
      {/* "Hammasi" qatorida rasm yo'q: joy qoldirilmaydi */}
      {image !== undefined && (
        <span className="flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-placeholder">
          {image ? (
            <img src={image} alt="" loading="lazy" className="size-full object-cover" />
          ) : (
            <LuImage aria-hidden className="size-5 text-muted" />
          )}
        </span>
      )}
      <span className="min-w-0 flex-1 text-[15px] font-semibold text-text">{label}</span>
      <span
        aria-hidden
        className={`flex size-6 shrink-0 items-center justify-center rounded-sm border ${
          isChecked ? 'border-brand bg-brand text-brand-ink' : 'border-line'
        }`}
      >
        {isChecked && <LuCheck className="size-4" />}
      </span>
    </button>
  )
}
