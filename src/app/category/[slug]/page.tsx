import { prisma } from '@/lib/prisma'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { ArticleCard } from '@/components/ui/ArticleCard'
import { CategorySwitcher } from '@/components/ui/CategorySwitcher'
import { notFound } from 'next/navigation'
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

interface CategoryPageProps {
  params: { slug: string }
}

async function getCategory(slug: string) {
  return prisma.category.findUnique({
    where: { slug, isActive: true },
    include: {
      articles: {
        where: { isPublished: true },
        orderBy: [
          { isPopular: 'desc' },
          { viewCount: 'desc' },
        ]
      }
    }
  })
}

async function getAllCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    select: { id: true, name: true, slug: true }
  })
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const category = await getCategory(params.slug)
  
  if (!category) {
    return { title: 'Category Not Found' }
  }

  return {
    title: `${category.name} - Subcold Support`,
    description: category.description || `Help articles about ${category.name}`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const [category, allCategories] = await Promise.all([
    getCategory(params.slug),
    getAllCategories()
  ])

  if (!category) {
    notFound()
  }

  const Icon = iconMap[category.icon] || HelpCircle

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Category Switcher & Search */}
      <CategorySwitcher 
        categories={allCategories} 
        currentCategorySlug={params.slug} 
      />

      {/* Hero Section */}
      <section className="bg-gray-800 text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center">
            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mr-6">
              <Icon className="h-8 w-8 text-subcold-teal" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold">{category.name}</h1>
              {category.description && (
                <p className="text-gray-400 mt-2">{category.description}</p>
              )}
            </div>
          </div>
        </div>
      </section>

      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Articles */}
          {category.articles.length > 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200">
              {category.articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  title={article.title}
                  slug={article.slug}
                  excerpt={article.excerpt}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <HelpCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No articles yet
              </h3>
              <p className="text-gray-500">
                We&apos;re working on adding content to this category.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
