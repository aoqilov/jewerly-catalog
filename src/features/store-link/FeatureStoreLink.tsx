import { useEffect } from 'react'
import { useNavigate } from 'react-router'
import { ROUTES } from '@/config/routes'
import { useSwitchStore } from '@/hooks/useSwitchStore'
import { useFindStore } from './api-hooks/useFindStore'

type FeatureStoreLinkProps = {
  // URL'ning birinchi qismi: /mercurycouz/catalog?cat=3 → "mercurycouz"
  slug: string
  // Qolgan qismi (query bilan): "/catalog?cat=3", bo'sh bo'lsa bosh sahifa
  rest: string
}

// Do'kon havolasi: /<do'kon-nomi>[/sahifa]. Do'kon topilsa shu tanlanadi va qolgan manzilga o'tiladi.
// Topilmasa (yoki xato bo'lsa) joriy tanlov o'zgarmay bosh sahifaga o'tiladi
export function FeatureStoreLink({ slug, rest }: FeatureStoreLinkProps) {
  const navigate = useNavigate()
  const switchStore = useSwitchStore()
  const { data, isPending } = useFindStore(slug.toLowerCase())

  useEffect(() => {
    if (isPending) return
    if (data) switchStore(data.id)
    navigate(data && rest ? rest : ROUTES.home, { replace: true })
  }, [isPending, data, rest, switchStore, navigate])

  return (
    <div role="status" className="app-bg flex min-h-dvh items-center justify-center text-sm text-muted">
      Yuklanmoqda…
    </div>
  )
}
