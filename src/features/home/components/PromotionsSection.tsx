import { useCallback, useState } from 'react'
import type { News } from '@/api/routes/news/news.types'
import { formatDate } from '@/lib/formatDate'
import { CusCarousel } from '@/shared/ui/CusCarousel'
import { PostCard } from './PostCard'
import { PostSheet } from './PostSheet'
import { SectionHeader } from './SectionHeader'

type PromotionsSectionProps = {
  // newsType === 'discount' bo'lgan yangiliklar
  promotions: News[]
}

const untilLabel = (endsAt: string) => `${formatDate(endsAt, { year: false })} gacha`

export function PromotionsSection({ promotions }: PromotionsSectionProps) {
  const [selected, setSelected] = useState<News | null>(null)
  const close = useCallback(() => setSelected(null), [])

  return (
    <section aria-labelledby="home-promotions" className="flex flex-col gap-3">
      <SectionHeader id="home-promotions" title="Aksiyalar" />

      <CusCarousel
        aria-label="Aksiyalar"
        items={promotions}
        getKey={(item) => item.id}
        renderItem={(item) => (
          <PostCard
            cover={item.image?.medium ?? null}
            title={item.title}
            excerpt={item.description}
            label={untilLabel(item.endsAt)}
            actionLabel="Batafsil"
            onOpen={() => setSelected(item)}
          />
        )}
      />

      <PostSheet
        post={
          selected && {
            title: selected.title,
            meta: `Aksiya ${untilLabel(selected.endsAt)} amal qiladi`,
            body: selected.description,
            cover: selected.image?.large ?? null,
          }
        }
        onClose={close}
      />
    </section>
  )
}
