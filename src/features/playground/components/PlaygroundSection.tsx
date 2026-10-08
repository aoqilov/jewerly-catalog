import type { ReactNode } from 'react'

type PlaygroundSectionProps = {
  title: string
  children: ReactNode
}

export function PlaygroundSection({ title, children }: PlaygroundSectionProps) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-[17px] font-bold text-text">{title}</h2>
      {children}
    </section>
  )
}
