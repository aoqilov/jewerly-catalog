import { Link } from 'react-router'
import { ROUTES } from '@/config/routes'
import { SITE } from '@/config/site'

export function Logo() {
  return (
    <Link
      to={ROUTES.home}
      className="font-logo text-lg leading-none font-semibold tracking-tight text-accent"
    >
      {SITE.name}
    </Link>
  )
}
