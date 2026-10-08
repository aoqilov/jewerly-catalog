type SectionHeaderProps = {
  id: string
  title: string
}

// Sarlavha va undan o'ngga cho'zilgan ingichka chiziq
export function SectionHeader({ id, title }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-3">
      <h2 id={id} className="text-[17px] font-bold text-text">
        {title}
      </h2>
      <div className="gline flex-1" />
    </div>
  )
}
