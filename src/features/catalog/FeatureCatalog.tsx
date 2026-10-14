import { useState } from 'react'
import { useGetCategories } from './api-hooks/useGetCategories'
import { CatalogToolbar } from './components/CatalogToolbar'
import { FilterSheet } from './components/FilterSheet'
import { CategoryPicker } from './components/picker/CategoryPicker'
import { PickerSkeleton } from './components/picker/PickerSkeleton'
import { CatalogResults } from './components/results/CatalogResults'
import { NewsResults } from './components/results/NewsResults'
import { useCatalogParams } from './hooks/useCatalogParams'
import { useScopeSubcategories } from './hooks/useScopeSubcategories'

// Katalog: kategoriya/subkategoriyalarni belgilash → "Ko'rsatish" → mahsulotlar.
// Yangilik oynasidan kelinsa (?news=<id>) o'sha yangilikka bog'langan mahsulotlar ko'rsatiladi.
// Filtr oynasi (kategoriya + rang) va qidiruv tanlovni toraytiradi.
// Holat URL query'da (useCatalogParams), shuning uchun sahifa props bermaydi
export function FeatureCatalog() {
  const {
    step,
    selection,
    columns,
    newsId,
    activeSubIds,
    colorIds,
    search,
    apply,
    applyFilters,
    showPicker,
    showResults,
    setActiveSubs,
    setSearch,
    setColumns,
  } = useCatalogParams()
  const categories = useGetCategories()
  const isPicker = step === 'picker'
  const [isFilterOpen, setFilterOpen] = useState(false)
  // Har ochilishda yangi key: filtr qoralamasi joriy tanlovdan boshlanadi
  const [filterKey, setFilterKey] = useState(0)

  // Tasma faqat kategoriya natijalarida; tanlov doirasidan tashqaridagi active e'tiborsiz qoldiriladi
  const { subcategories: scope, groups } = useScopeSubcategories(categories.data, selection)
  const showChips = !isPicker && newsId === null
  const activeChips = activeSubIds.filter((id) => scope.some((item) => item.id === id))
  const narrowing = { colorIds, search }
  const resultsSelection =
    activeChips.length === 0
      ? { ...selection, ...narrowing }
      : { categoryIds: [], subcategoryIds: activeChips, ...narrowing }

  const openFilter = () => {
    setFilterKey((key) => key + 1)
    setFilterOpen(true)
  }

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
        search={search}
        onSearchChange={setSearch}
        filterCount={colorIds.length}
        onOpenFilter={openFilter}
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
                narrowing={narrowing}
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

      <FilterSheet
        key={filterKey}
        isOpen={isFilterOpen}
        onClose={() => setFilterOpen(false)}
        categories={categories.data ?? []}
        selection={selection}
        colorIds={colorIds}
        search={search}
        onApply={applyFilters}
      />
    </>
  )
}
