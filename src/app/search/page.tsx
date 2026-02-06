import { prisma } from '@/lib/prisma'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { ArticleCard } from '@/components/ui/ArticleCard'
import { SearchBar } from '@/components/ui/SearchBar'
import { Search } from 'lucide-react'

interface SearchPageProps {
  searchParams: { q?: string }
}

async function searchArticles(query: string) {
  if (!query || query.length < 2) return []

  // Simple search - in production you might want to use full-text search
  return prisma.article.findMany({
    where: {
      isPublished: true,
      OR: [
        { title: { contains: query } },
        { content: { contains: query } },
        { excerpt: { contains: query } },
      ]
    },
    include: {
      category: {
        select: { name: true, slug: true }
      }
    },
    orderBy: [
      { isPopular: 'desc' },
      { viewCount: 'desc' }
    ],
    take: 20
  })
}

export async function generateMetadata({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ''
  return {
    title: query ? `Search: ${query} - Subcold Support` : 'Search - Subcold Support',
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || ''
  const results = await searchArticles(query)

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Search Header */}
      <section className="bg-subcold-black text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Breadcrumbs 
            items={[
              { label: 'Search' }
            ]} 
          />
          <h1 className="text-3xl md:text-4xl font-bold mt-6 mb-6">
            Search Results
          </h1>
          <SearchBar 
            placeholder="Search for help articles..."
            className="max-w-2xl"
          />
        </div>
      </section>

      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          {query ? (
            <>
              <p className="text-gray-600 mb-6">
                {results.length > 0 
                  ? `Found ${results.length} result${results.length === 1 ? '' : 's'} for "${query}"`
                  : `No results found for "${query}"`
                }
              </p>

              {results.length > 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200">
                  {results.map((article) => (
                    <ArticleCard
                      key={article.id}
                      title={article.title}
                      slug={article.slug}
                      excerpt={article.excerpt}
                      categoryName={article.category.name}
                      categorySlug={article.category.slug}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
                  <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No results found
                  </h3>
                  <p className="text-gray-500 mb-4">
                    Try different keywords or browse our categories.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
              <Search className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Search for help
              </h3>
              <p className="text-gray-500">
                Enter a search term above to find help articles.
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
