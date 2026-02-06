import Link from 'next/link'
import {
  Package,
  RotateCcw,
  CreditCard,
  Settings,
  Box,
  Info,
  HelpCircle,
  LucideIcon,
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  Package,
  RotateCcw,
  CreditCard,
  Settings,
  Box,
  Info,
  HelpCircle,
}

interface CategoryCardProps {
  name: string
  slug: string
  description?: string | null
  icon: string
  articleCount?: number
}

export function CategoryCard({ 
  name, 
  slug, 
  description, 
  icon,
  articleCount 
}: CategoryCardProps) {
  const Icon = iconMap[icon] || HelpCircle

  return (
    <Link href={`/category/${slug}`}>
      <div className="category-card bg-white border border-gray-200 rounded-xl p-6 hover:border-subcold-teal cursor-pointer h-full">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-subcold-black rounded-full flex items-center justify-center mb-4">
            <Icon className="h-8 w-8 text-subcold-teal" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">{name}</h3>
          {description && (
            <p className="text-sm text-gray-500 line-clamp-2">{description}</p>
          )}
          {typeof articleCount === 'number' && (
            <p className="text-xs text-gray-400 mt-2">
              {articleCount} {articleCount === 1 ? 'article' : 'articles'}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}
