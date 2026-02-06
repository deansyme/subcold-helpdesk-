import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

interface ArticleCardProps {
  title: string
  slug: string
  excerpt?: string | null
  categoryName?: string
  categorySlug?: string
  viewCount?: number
}

export function ArticleCard({ 
  title, 
  slug, 
  excerpt,
  categoryName,
  categorySlug,
  viewCount
}: ArticleCardProps) {
  return (
    <Link href={`/article/${slug}`}>
      <div className="group flex items-start justify-between p-4 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all cursor-pointer">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 group-hover:text-subcold-teal transition-colors">
            {title}
          </h4>
          {excerpt && (
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{excerpt}</p>
          )}
          {categoryName && (
            <p className="text-xs text-gray-400 mt-2">
              in {categoryName}
            </p>
          )}
        </div>
        <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-subcold-teal flex-shrink-0 ml-4 transition-colors" />
      </div>
    </Link>
  )
}
