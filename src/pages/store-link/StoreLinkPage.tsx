import { useLocation, useParams } from 'react-router'
import { FeatureStoreLink } from '@/features/store-link/FeatureStoreLink'

export function StoreLinkPage() {
  const { slug = '', '*': path = '' } = useParams()
  const { search } = useLocation()

  return <FeatureStoreLink slug={slug} rest={path ? `/${path}${search}` : ''} />
}
