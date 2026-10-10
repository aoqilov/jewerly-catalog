import { useEffect, useId, useRef, useState } from 'react'

type ProductDescriptionProps = {
  text: string
}

// Tavsif: boshida ko'pi bilan 2 qator, 2-qator oxirida "… yana" (Instagram kabi). Bosilsa to'liq matn ochiladi,
// pastida "Yopish". Matn 2 qatorga sig'sa "yana" chiqmaydi.
// "… yana" matn ustiga bg-bg (panel foni) bilan qo'yiladi: panel yaxlit rangda, shuning uchun kesilgan so'z ko'rinmaydi
export function ProductDescription({ text }: ProductDescriptionProps) {
  const textId = useId()
  const textRef = useRef<HTMLParagraphElement>(null)
  const [isExpanded, setExpanded] = useState(false)
  // Yopiq holatda matn kesilganmi (line-clamp)
  const [isClamped, setClamped] = useState(false)

  useEffect(() => {
    const element = textRef.current
    if (!element || isExpanded) return

    const measure = () => setClamped(element.scrollHeight > element.clientHeight + 1)
    measure()

    // Kenglik o'zgarsa (aylantirish, oyna o'lchami) qatorlar soni ham o'zgaradi
    const observer = new ResizeObserver(measure)
    observer.observe(element)
    return () => observer.disconnect()
  }, [text, isExpanded])

  return (
    <div className="flex flex-col items-start">
      <div className="relative w-full">
        <p
          ref={textRef}
          id={textId}
          className={`text-[15px] leading-relaxed text-muted ${isExpanded ? '' : 'line-clamp-2'}`}
        >
          {text}
        </p>
        {!isExpanded && isClamped && (
          <button
            type="button"
            aria-expanded={false}
            aria-controls={textId}
            onClick={() => setExpanded(true)}
            // before: bosiladigan maydon 44px'ga cho'ziladi, ko'rinishi esa bitta qator bo'lib qoladi
            className="absolute right-0 bottom-0 bg-linear-to-r from-transparent to-bg to-35% pl-8 text-[15px] leading-relaxed font-semibold text-accent before:absolute before:-inset-y-2.5 before:-inset-x-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            … yana
          </button>
        )}
      </div>
      {isExpanded && (
        <button
          type="button"
          aria-expanded
          aria-controls={textId}
          onClick={() => setExpanded(false)}
          className="min-h-11 text-sm font-semibold text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
        >
          Yopish
        </button>
      )}
    </div>
  )
}
