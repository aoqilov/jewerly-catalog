import type { IconType } from 'react-icons'
import { LuLayers, LuMapPin, LuTag } from 'react-icons/lu'

type ProductSpecsProps = {
  manufacture: string
  brand: string
  materials: string[]
}

type SpecItemProps = {
  icon: IconType
  label: string
  value: string
  wide?: boolean
}

function SpecItem({ icon: Icon, label, value, wide = false }: SpecItemProps) {
  return (
    <div className={`flex flex-col gap-1 rounded-md border border-line bg-tile p-3 ${wide ? 'col-span-2' : ''}`}>
      <dt className="flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-muted uppercase">
        <Icon aria-hidden className="size-4 text-accent" />
        {label}
      </dt>
      <dd className="text-[15px] text-text">{value}</dd>
    </div>
  )
}

export function ProductSpecs({ manufacture, brand, materials }: ProductSpecsProps) {
  return (
    <section aria-labelledby="product-specs" className="flex flex-col gap-3">
      <h2 id="product-specs" className="text-[17px] font-bold text-text">
        Xususiyatlari
      </h2>
      <dl className="grid grid-cols-2 gap-2">
        {manufacture && <SpecItem icon={LuMapPin} label="Ishlab chiqarilgan" value={manufacture} />}
        {brand && <SpecItem icon={LuTag} label="Brend" value={brand} />}
        {materials.length > 0 && <SpecItem icon={LuLayers} label="Material" value={materials.join(', ')} wide />}
      </dl>
    </section>
  )
}
