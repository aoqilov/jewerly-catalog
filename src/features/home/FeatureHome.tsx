import { useCallback, useState } from 'react'
import { useGetCategories } from './api-hooks/useGetCategories'
import { useGetNews } from './api-hooks/useGetNews'
import { useGetStore } from './api-hooks/useGetStore'
import { CategoryGrid } from './components/CategoryGrid'
import { ContactSheet } from './components/ContactSheet'
import { HomeSkeleton } from './components/HomeSkeleton'
import { NewsSection } from './components/NewsSection'
import { PromotionsSection } from './components/PromotionsSection'
import { QuickActions } from './components/QuickActions'
import { ServicesAccordion } from './components/ServicesAccordion'
import { StoreHero } from './components/StoreHero'
import type { ContactKind } from './types'

const errorClass = 'py-6 text-center text-sm text-muted'
// Bosh sahifa boshqa sahifalardan 0.9x kichikroq: barcha o'lcham (px ham) bir xil kichrayadi.
// Modal oynalar portal orqali body'da, ularga ta'sir qilmaydi
const zoomClass = 'zoom-[0.9]'

export function FeatureHome() {
  const store = useGetStore()
  const categories = useGetCategories()
  const news = useGetNews()
  const [contactKind, setContactKind] = useState<ContactKind | null>(null)

  const closeContacts = useCallback(() => setContactKind(null), [])

  if (store.isPending) {
    return (
      <div className={zoomClass}>
        <HomeSkeleton />
      </div>
    )
  }

  if (store.isError) {
    return <p className={errorClass}>Do'kon ma'lumotlari yuklanmadi</p>
  }

  // "Aksiyalar" bo'limi newsType === 'discount' bo'lgan yangiliklardan, qolganlari "Yangiliklar"da
  const newsItems = news.data?.filter((item) => item.newsType !== 'discount') ?? []
  const promotionItems = news.data?.filter((item) => item.newsType === 'discount') ?? []
  // Kategoriyalardan keyingi chiziq faqat ostida biror bo'lim (yoki yuklanayotgan yangiliklar) bo'lsa
  const hasLowerSections =
    store.data.services.length > 0 || !news.isSuccess || newsItems.length > 0 || promotionItems.length > 0

  return (
    <div className={`mx-auto flex max-w-2xl flex-col pb-8 ${zoomClass}`}>
      <StoreHero store={store.data} />

      <div className="mt-4 flex flex-col gap-5 px-4">
        <div className="gline" />
        <QuickActions store={store.data} onSelect={setContactKind} />
        <div className="gline" />

        {categories.isPending && <div className="h-24 animate-pulse rounded-md bg-fill" />}
        {categories.isError && <p className={errorClass}>Kategoriyalar yuklanmadi</p>}
        {categories.isSuccess && <CategoryGrid categories={categories.data} />}

        {hasLowerSections && <div className="gline" />}

        {store.data.services.length > 0 && <ServicesAccordion services={store.data.services} />}

        {/* Bo'sh ro'yxat bo'lsa bo'lim umuman chiqmaydi */}
        {news.isPending && <div className="h-80 animate-pulse rounded-md bg-fill" />}
        {news.isError && <p className={errorClass}>Yangiliklar yuklanmadi</p>}
        {news.isSuccess && newsItems.length > 0 && <NewsSection news={newsItems} />}

        {news.isSuccess && promotionItems.length > 0 && (
          <PromotionsSection promotions={promotionItems} />
        )}
      </div>

      <ContactSheet kind={contactKind} store={store.data} onClose={closeContacts} />
    </div>
  )
}
