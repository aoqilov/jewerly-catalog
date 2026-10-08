import type { IconType } from 'react-icons'
import { LuCalendarCheck, LuScissors, LuTag } from 'react-icons/lu'
import { TbHanger } from 'react-icons/tb'
import type { StoreService } from '@/api/routes/store/store.types'
import { CusAccordion } from '@/shared/ui/CusAccordion'

type ServicesAccordionProps = {
  services: StoreService[]
}

// iconId: backendning "icons" katalogidagi id (1=ijara, 2=sotuv, 3=tikish, 4=kiyib ko'rish)
const SERVICE_ICONS: Record<number, IconType> = {
  1: TbHanger,
  2: LuTag,
  3: LuScissors,
  4: LuCalendarCheck,
}

export function ServicesAccordion({ services }: ServicesAccordionProps) {
  const items = services.map((service) => {
    const Icon = SERVICE_ICONS[service.iconId] ?? LuTag
    return {
      id: service.id,
      title: service.title,
      icon: <Icon aria-hidden className="size-5" />,
      content: <p className="text-sm text-muted">{service.description}</p>,
    }
  })

  return (
    <section aria-labelledby="home-services" className="flex flex-col gap-3">
      <h2 id="home-services" className="text-[17px] font-bold text-text">
        Xizmatlar
      </h2>
      {/* glass emas: .glass'ning :active (scale) va :hover (filter) holatlari butun kartaga tushadi,
          blur esa balandlik animatsiyasining har kadrida qayta hisoblanadi — accordion qotadi */}
      <div className="rounded-md border border-line bg-tile">
        <CusAccordion items={items} defaultOpenId={services[0]?.id} />
      </div>
    </section>
  )
}
