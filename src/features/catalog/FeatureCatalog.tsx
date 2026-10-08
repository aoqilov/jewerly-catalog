import { useGetCategories } from './api-hooks/useGetCategories'
import { CatalogToolbar } from './components/CatalogToolbar'
import { CategoryPicker } from './components/picker/CategoryPicker'
import { PickerSkeleton } from './components/picker/PickerSkeleton'
import { CatalogResults } from './components/results/CatalogResults'
import { useCatalogParams } from './hooks/useCatalogParams'

// Katalog: kategoriya/subkategoriyalarni belgilash → "Ko'rsatish" → mahsulotlar.
// Holat URL query'da (useCatalogParams), shuning uchun sahifa props bermaydi
export function FeatureCatalog() {
  const { step, selection, columns, apply, showPicker, showResults, setColumns } = useCatalogParams()
  const categories = useGetCategories()
  const isPicker = step === 'picker'

  return (
    <>
      <CatalogToolbar
        isPickerOpen={isPicker}
        onTogglePicker={isPicker ? showResults : showPicker}
        selectedCount={selection.categoryIds.length + selection.subcategoryIds.length}
        columns={isPicker ? undefined : columns}
        onColumnsChange={setColumns}
      />

      {/* Picker'da pastki padding yo'q: tasma harakatlar paneligacha cho'ziladi, ortiqcha scroll chiqmasin */}
      <div className={`mx-auto max-w-2xl px-4 pt-4 ${isPicker ? '' : 'pb-6'}`}>
        {isPicker ? (
          <>
            {categories.isPending && <PickerSkeleton />}
            {categories.isError && (
              <p className="py-10 text-center text-sm text-muted">Kategoriyalar yuklanmadi</p>
            )}
            {categories.isSuccess && (
              <CategoryPicker
                categories={categories.data}
                initialSelection={selection}
                onApply={apply}
              />
            )}
          </>
        ) : (
          <CatalogResults selection={selection} columns={columns} onOpenPicker={showPicker} />
        )}
      </div>
    </>
  )
}
