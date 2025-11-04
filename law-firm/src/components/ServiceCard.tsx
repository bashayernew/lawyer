"use client"
import { ArrowRight, FileText, Briefcase, Users, Scale, Building, Phone, Shield, Lock, Globe } from 'lucide-react'

const iconMap: Record<string, any> = {
  '🧩': FileText,
  '📜': FileText,
  '🏛️': Building,
  '👔': Users,
  '™️': Shield,
  '⚖️': Scale,
}

type Props = {
  icon?: string
  title: string
  description: string
}

export default function ServiceCard({ icon, title, description }: Props) {
  const IconComponent = icon && iconMap[icon] ? iconMap[icon] : Scale
  
  return (
    <div className="group relative overflow-hidden rounded-xl border border-primary/25 bg-white/90 backdrop-blur-md p-6 shadow-sm transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
      <div className="flex items-start gap-4">
        <div className="relative h-11 w-11 rounded-lg bg-gradient-to-br from-primary/15 to-forest/15 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
          <IconComponent className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base text-ink mb-2 group-hover:text-forest transition-colors">{title}</h3>
          <p className="text-sm text-neutral-700 leading-relaxed line-clamp-3 mb-3">{description}</p>
          <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      </div>
    </div>
  )
}


