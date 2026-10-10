import { useGetCategories } from './api-hooks/useGetCategories'
import { CatalogToolbar } from './components/CatalogToolbar'
import { CategoryPicker } from './components/picker/CategoryPicker'
import { PickerSkeleton } from './components/picker/PickerSkeleton'
import { CatalogResults } from './components/results/CatalogResults'
import { NewsResults } from './components/results/NewsResults'
import { useCatalogParams } from './hooks/useCatalogParams'
import { useScopeSubcategories } from './hooks/useScopeSubcategories'

// Katalog: kategoriya/subkategoriyalarni belgilash → "Ko'rsatish" → mahsulotlar.
// Yangilik oynasidan kelinsa (?news=<id>) o'sha yangilikka bog'langan mahsulotlar ko'rsatiladi.
// Holat URL query'da (useCatalogParams), shuning uchun sahifa props bermaydi
export function FeatureCatalog() {
  const { step, selection, columns, newsId, activeSubIds, apply, showPicker, showResults, setActiveSubs, setColumns } =
    useCatalogParams()
  const categories = useGetCategories()
  const isPicker = step === 'picker'

  // Tasma faqat kategoriya natijalarida; tanlov doirasidan tashqaridagi active e'tiborsiz qoldiriladi
  const { subcategories: scope, groups } = useScopeSubcategories(categories.data, selection)
  const showChips = !isPicker && newsId === null
  const activeChips = activeSubIds.filter((id) => scope.some((item) => item.id === id))
  const resultsSelection = activeChips.length === 0 ? selection : { categoryIds: [], subcategoryIds: activeChips }

  return (
    <>
      <CatalogToolbar
        isPickerOpen={isPicker}
        onTogglePicker={isPicker ? showResults : showPicker}
        selectedCount={selection.categoryIds.length + selection.subcategoryIds.length}
        columns={isPicker ? undefined : columns}
        onColumnsChange={setColumns}
        chips={showChips ? scope : undefined}
        groups={groups}
        activeChips={activeChips}
        onChipsChange={setActiveSubs}
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
        ) : newsId !== null ? (
          <NewsResults newsId={newsId} columns={columns} onOpenPicker={showPicker} />
        ) : (
          <CatalogResults selection={resultsSelection} columns={columns} onOpenPicker={showPicker} />
        )}
      </div>
    </>
  )
}
