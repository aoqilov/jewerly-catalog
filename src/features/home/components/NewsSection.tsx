import { useCallback, useState } from 'react'
import type { News } from '@/api/routes/news/news.types'
import { formatDate } from '@/lib/formatDate'
import { CusCarousel } from '@/shared/ui/CusCarousel'
import { PostCard } from './PostCard'
import { PostSheet } from './PostSheet'
import { SectionHeader } from './SectionHeader'

type NewsSectionProps = {
  news: News[]
}

export function NewsSection({ news }: NewsSectionProps) {
  const [selected, setSelected] = useState<News | null>(null)
  const close = useCallback(() => setSelected(null), [])

  return (
    <section aria-labelledby="home-news" className="flex flex-col gap-3">
      <SectionHeader id="home-news" title="Yangiliklar" />

      <CusCarousel
        aria-label="Yangiliklar"
        items={news}
        getKey={(item) => item.id}
        renderItem={(item, index) => (
          <PostCard
            cover={item.image?.medium ?? null}
            title={item.title}
            excerpt={item.description}
            label={formatDate(item.startsAt)}
            corner={`${index + 1} / ${news.length}`}
            actionLabel="O'qish"
            onOpen={() => setSelected(item)}
          />
        )}
      />

      <PostSheet
        post={
          selected && {
            title: selected.title,
            meta: formatDate(selected.startsAt),
            body: selected.description,
            cover: selected.image?.large ?? null,
          }
        }
        onClose={close}
      />
    </section>
  )
}
