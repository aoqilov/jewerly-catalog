import { useEffect, useRef, useState } from 'react'
import { LuChevronLeft, LuChevronRight, LuX } from 'react-icons/lu'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import type { ReactZoomPanPinchRef } from 'react-zoom-pan-pinch'
import type { ProductPhoto } from '@/api/routes/products/products.types'
import { useLockBodyScroll } from '@/hooks/useLockBodyScroll'
import { usePresence } from '@/hooks/usePresence'
import { CusButton } from '@/shared/ui/CusButton'
import { useSwipe } from '../hooks/useSwipe'

// Kutubxona standart holatda o'lchamni kontentga moslaydi, bizga butun maydon kerak
const FILL = { width: '100%', height: '100%' }
// motion.css'dagi fade-out davomiyligi
const EXIT_MS = 200
// Ikki marta tegilganda kattalashish darajasi va animatsiyasi
const DOUBLE_TAP_SCALE = 2.5
const ZOOM_ANIMATION_MS = 200
// Shundan katta bo'lsa rasm kattalashtirilgan hisoblanadi (pinch'dan keyingi yaxlitlash xatosi uchun zaxira)
const ZOOMED_SCALE = 1.01

type ProductImageViewerProps = {
  photos: ProductPhoto[]
  name: string
  // null: yopiq, raqam: shu rasmdan ochiladi
  openIndex: number | null
  onClose: () => void
}

// To'liq ekranli ko'rish: kattalashtirib, surib har bir detalni ko'rish uchun
export function ProductImageViewer({ photos, name, openIndex, onClose }: ProductImageViewerProps) {
  const isOpen = openIndex !== null
  const { isMounted, state } = usePresence(isOpen, EXIT_MS)
  useLockBodyScroll(isOpen)

  if (!isMounted) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${name} rasmlari`}
      data-state={state}
      className="fixed inset-0 z-60 flex animate-fade-in flex-col bg-black text-white data-[state=closed]:pointer-events-none data-[state=closed]:animate-fade-out"
    >
      {/* Yopilayotganda openIndex null bo'ladi, lekin ViewerContent startIndex'ni faqat mount paytida o'qiydi */}
      <ViewerContent photos={photos} name={name} startIndex={openIndex ?? 0} onClose={onClose} />
    </div>
  )
}

type ViewerContentProps = {
  photos: ProductPhoto[]
  name: string
  startIndex: number
  onClose: () => void
}

// Faqat ochiq paytda mount bo'ladi: har ochilganda indeks va kattalashtirish boshidan boshlanadi
function ViewerContent({ photos, name, startIndex, onClose }: ViewerContentProps) {
  const [index, setIndex] = useState(startIndex)
  const [isZoomed, setZoomed] = useState(false)
  const zoomRef = useRef<ReactZoomPanPinchRef>(null)
  const last = photos.length - 1

  const swipe = useSwipe({
    disabled: isZoomed,
    onLeft: () => go(index + 1),
    onRight: () => go(index - 1),
    onDown: onClose,
    onDoubleTap: toggleZoom,
  })

  // Ikki marta tegish: kattalashtirilgan bo'lsa (qanchalik bo'lishidan qat'i nazar) asl holiga,
  // aks holda tegilgan nuqta joyida qolib DOUBLE_TAP_SCALE'gacha kattalashadi
  function toggleZoom(clientX: number, clientY: number) {
    const zoom = zoomRef.current
    const wrapper = zoom?.instance.wrapperComponent
    if (!zoom || !wrapper) return

    const { scale, positionX, positionY } = zoom.instance.state
    if (scale > ZOOMED_SCALE) {
      zoom.resetTransform(ZOOM_ANIMATION_MS)
      return
    }

    const rect = wrapper.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top
    const contentX = (x - positionX) / scale
    const contentY = (y - positionY) / scale
    zoom.setTransform(x - contentX * DOUBLE_TAP_SCALE, y - contentY * DOUBLE_TAP_SCALE, DOUBLE_TAP_SCALE, ZOOM_ANIMATION_MS)
  }

  // Rasm almashganda TransformWrapper key orqali qayta mount bo'ladi — kattalashtirish o'zi tushadi
  function go(next: number) {
    if (next < 0 || next > last) return
    setIndex(next)
    setZoomed(false)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') go(index + 1)
      if (event.key === 'ArrowLeft') go(index - 1)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })

  const photo = photos[index]
  if (!photo) return null

  return (
    <>
      <div className="flex items-center justify-between gap-3 px-3 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-3">
        <span className="text-sm font-semibold text-white/85">
          {index + 1} / {photos.length}
        </span>
        <CusButton
          variant="onImage"
          aria-label="Yopish"
          autoFocus
          onClick={onClose}
          icon={<LuX aria-hidden className="size-5" />}
        />
      </div>

      <div className="relative min-h-0 flex-1">
        {/* Pinch, surish, g'ildirak — react-zoom-pan-pinch; chapga/o'ngga/pastga surish va ikki marta tegish — useSwipe.
            Kutubxonaning o'z double-click'i o'chiq: u kichraytirishni qadam bilan qiladi va teginish oynasi 200ms */}
        <div
          {...swipe}
          className={`size-full touch-none select-none ${isZoomed ? 'cursor-grab' : 'cursor-zoom-in'}`}
        >
          <TransformWrapper
            key={photo.id}
            ref={zoomRef}
            minScale={1}
            maxScale={4}
            centerOnInit
            doubleClick={{ disabled: true }}
            onTransform={(_, state) => setZoomed(state.scale > ZOOMED_SCALE)}
          >
            <TransformComponent wrapperStyle={FILL} contentStyle={FILL}>
              <img
                src={photo.large}
                alt={`${name}, ${index + 1}-rasm`}
                draggable={false}
                className="size-full object-contain"
              />
            </TransformComponent>
          </TransformWrapper>
        </div>

        {/* Kompyuterda: strelka tugmalari (mobilda surish bilan) */}
        {index > 0 && (
          <div className="absolute top-1/2 left-3 hidden -translate-y-1/2 md:block">
            <CusButton
              variant="onImage"
              aria-label="Oldingi rasm"
              onClick={() => go(index - 1)}
              icon={<LuChevronLeft aria-hidden className="size-5" />}
            />
          </div>
        )}
        {index < last && (
          <div className="absolute top-1/2 right-3 hidden -translate-y-1/2 md:block">
            <CusButton
              variant="onImage"
              aria-label="Keyingi rasm"
              onClick={() => go(index + 1)}
              icon={<LuChevronRight aria-hidden className="size-5" />}
            />
          </div>
        )}
      </div>

      <p className="px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] text-center text-xs text-white/70">
        Kattalashtirish uchun ikki marta bosing yoki ikki barmoq bilan cho'zing
      </p>
    </>
  )
}
