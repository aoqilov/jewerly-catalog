import { formatPrice } from '@/lib/formatPrice'
import { OFFER_LABELS } from '@/lib/productDisplay'
import type { Offer, OfferType } from '@/lib/productDisplay'
import { CusSegment } from '@/shared/ui/CusSegment'
import { SECTION_LABEL_CLASS } from '@/config/ui'
import { OFFER_NOTES } from '../constants'

type ProductOffersProps = {
  offers: Offer[]
  offer: Offer
  onChange: (type: OfferType) => void
}

// Taklif turi (ijara / sotuv / tikish) va tanlangan turning narxi
export function ProductOffers({ offers, offer, onChange }: ProductOffersProps) {
  return (
    <section aria-label="Narx" className="flex flex-col gap-3">
      {offers.length > 1 && (
        <CusSegment
          aria-label="Xizmat turi"
          options={offers.map((item) => ({ value: item.type, label: OFFER_LABELS[item.type] }))}
          value={offer.type}
          onChange={onChange}
        />
      )}
      <div className="flex flex-col gap-1 rounded-md border border-line bg-tile p-4">
        {offers.length === 1 && <span className={SECTION_LABEL_CLASS}>{OFFER_LABELS[offer.type]}</span>}
        <p className="text-[26px] font-bold text-text">{formatPrice(offer.price)}</p>
        <p className="text-sm text-muted">{OFFER_NOTES[offer.type]}</p>
      </div>
    </section>
  )
}
