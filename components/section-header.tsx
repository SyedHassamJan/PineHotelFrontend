interface SectionHeaderProps {
  title: string
  subtitle?: string
  centered?: boolean
  className?: string
}

export function SectionHeader({ title, subtitle, centered = false, className = "" }: SectionHeaderProps) {
  return (
    <div className={`${centered ? "text-center" : ""} mb-12 ${className}`}>
      <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 animate-fadeInUp">{title}</h2>
      {subtitle && <p className="text-lg text-muted-foreground max-w-2xl animate-fadeInUp">{subtitle}</p>}
    </div>
  )
}
