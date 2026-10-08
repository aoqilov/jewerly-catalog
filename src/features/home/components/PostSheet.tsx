import { LuImages } from 'react-icons/lu'
import { useNavigate } from 'react-router'
import { ROUTES } from '@/config/routes'
import { CusBottomSheet } from '@/shared/ui/CusBottomSheet'
import { CusButton } from '@/shared/ui/CusButton'

export type PostSheetData = {
  id: number
  title: string
  meta: string
  body: string
  cover: string | null
  // Bog'langan mahsulotlar soni: 0 bo'lsa tugma chiqmaydi
  productCount: number
}

type PostSheetProps = {
  post: PostSheetData | null
  onClose: () => void
}

// Yangilik yoki aksiyaning to'liq matni. Tugma bog'langan mahsulotlarni katalog natijalarida (3 ustun) ochadi
export function PostSheet({ post, onClose }: PostSheetProps) {
  const navigate = useNavigate()

  return (
    <CusBottomSheet isOpen={post !== null} onClose={onClose} title={post?.title ?? ''}>
      {post && (
        <div className="flex flex-col gap-3">
          {post.cover && (
            <img src={post.cover} alt="" className="aspect-video w-full rounded-tile object-cover" />
          )}
          <p className="text-xs font-semibold text-accent">{post.meta}</p>
          <p className="text-[15px] leading-relaxed text-text">{post.body}</p>
          {post.productCount > 0 && (
            <CusButton
              fullWidth
              icon={<LuImages aria-hidden className="size-5" />}
              onClick={() => navigate(ROUTES.catalogByNews(post.id))}
            >
              Mahsulotlarni ko'rish ({post.productCount})
            </CusButton>
          )}
        </div>
      )}
    </CusBottomSheet>
  )
}
