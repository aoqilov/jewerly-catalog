import { useId, useState } from 'react'
import type { ReactNode } from 'react'
import { LuChevronDown } from 'react-icons/lu'

type AccordionItem = {
  id: string | number
  title: string
  icon?: ReactNode
  content: ReactNode
}

type CusAccordionProps = {
  items: AccordionItem[]
  // Boshida ochiq turadigan band. Bir vaqtda faqat bitta band ochiq bo'ladi
  defaultOpenId?: AccordionItem['id']
}

export function CusAccordion({ items, defaultOpenId }: CusAccordionProps) {
  const baseId = useId()
  const [openId, setOpenId] = useState(defaultOpenId)

  return (
    <ul>
      {items.map((item, index) => {
        const isOpen = item.id === openId
        const buttonId = `${baseId}-button-${item.id}`
        const panelId = `${baseId}-panel-${item.id}`

        return (
          <li key={item.id}>
            {index > 0 && <div className="gline" />}
            <h3>
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? undefined : item.id)}
                className="flex min-h-14 w-full items-center gap-3 px-3 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand"
              >
                {item.icon && (
                  <span
                    className={`flex size-9 shrink-0 items-center justify-center rounded-full bg-fill transition-colors ${
                      isOpen ? 'text-accent' : 'text-muted'
                    }`}
                  >
                    {item.icon}
                  </span>
                )}
                <span className="flex-1 text-[15px] font-semibold text-text">{item.title}</span>
                <LuChevronDown
                  aria-hidden
                  className={`size-5 shrink-0 text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
            </h3>

            {/* grid-rows 0fr → 1fr: balandlik 'auto'gacha silliq ochiladi. Yopiq panel inert: fokus va screen reader'dan yashirin */}
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!isOpen}
              className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
                isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-3 pb-4 pl-15">{item.content}</div>
              </div>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
