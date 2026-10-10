import { useLayoutEffect } from 'react'
import { appScrollElement } from '@/lib/appScroll'
import { useGetProduct } from './api-hooks/useGetProduct'
import { ProductDetails } from './components/ProductDetails'
import { ProductSkeleton } from './components/ProductSkeleton'

type FeatureProductProps = {
  id: string
}

export function FeatureProduct({ id }: FeatureProductProps) {
  const { data, isPending, isError } = useGetProduct(id)

  // Ilova #root ichida suriladi: oldingi sahifaning scroll'i qolmasin, mahsulot doim tepadan ochiladi
  useLayoutEffect(() => {
    appScrollElement().scrollTo(0, 0)
  }, [id])

  if (isPending) return <ProductSkeleton />

  if (isError) {
    return <p className="py-10 text-center text-accent">Mahsulot yuklanmadi</p>
  }

  return <ProductDetails product={data} />
}
