import { CusBottomSheet } from '@/shared/ui/CusBottomSheet'

export type PostSheetData = {
  title: string
  meta: string
  body: string
  cover: string | null
}

type PostSheetProps = {
  post: PostSheetData | null
  onClose: () => void
}

// Yangilik yoki aksiyaning to'liq matni
export function PostSheet({ post, onClose }: PostSheetProps) {
  return (
    <CusBottomSheet isOpen={post !== null} onClose={onClose} title={post?.title ?? ''}>
      {post && (
        <div className="flex flex-col gap-3">
          {post.cover && (
            <img src={post.cover} alt="" className="aspect-video w-full rounded-tile object-cover" />
          )}
          <p className="text-xs font-semibold text-accent">{post.meta}</p>
          <p className="text-[15px] leading-relaxed text-text">{post.body}</p>
        </div>
      )}
    </CusBottomSheet>
  )
}
