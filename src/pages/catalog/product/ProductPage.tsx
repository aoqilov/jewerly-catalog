import { useParams } from 'react-router'
import { FeatureProduct } from '@/features/products/FeatureProduct'

export function ProductPage() {
  const { id } = useParams()

  if (!id) return null

  return <FeatureProduct id={id} />
}
