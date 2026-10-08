import { useGetProduct } from './api-hooks/useGetProduct'
import { ProductDetails } from './components/ProductDetails'

type FeatureProductProps = {
  id: string
}

export function FeatureProduct({ id }: FeatureProductProps) {
  const { data, isPending, isError } = useGetProduct(id)

  if (isPending) {
    return <p className="py-10 text-center text-muted">Yuklanmoqda...</p>
  }

  if (isError) {
    return <p className="py-10 text-center text-accent">Mahsulot yuklanmadi</p>
  }

  return <ProductDetails product={data} />
}
