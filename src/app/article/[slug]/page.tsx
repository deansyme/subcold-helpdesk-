import { prisma } from '@/lib/prisma'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import { ArticleCard } from '@/components/ui/ArticleCard'
import { notFound } from 'next/navigation'
import { Eye, Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { getLocale } from 'next-intl/server'
import { getArticleWithTranslation } from '@/lib/translations'

interface ArticlePageProps {
  params: { slug: string }
}

async function getRelatedArticles(categoryId: string, currentArticleId: string, locale: string) {
  const articles = await prisma.article.findMany({
    where: {
      categoryId,
      isPublished: true,
      id: { not: currentArticleId }
    },
    include: {
      translations: {
        where: { locale }
      }
    },
    take: 3,
    orderBy: [
      { isPopular: 'desc' },
      { viewCount: 'desc' }
    ]
  })

  return articles.map(article => {
    const translation = article.translations[0]
    return {
      ...article,
      title: translation?.title || article.title,
      excerpt: translation?.excerpt || article.excerpt
    }
  })
}

export async function generateMetadata({ params }: ArticlePageProps) {
  const article = await prisma.article.findUnique({
    where: { slug: params.slug, isPublished: true },
  })
  
  if (!article) {
    return { title: 'Article Not Found' }
  }

  return {
    title: `${article.title} - Subcold Support`,
    description: article.excerpt || article.title,
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const locale = await getLocale()
  const article = await getArticleWithTranslation(params.slug, locale)

  if (!article) {
    notFound()
  }

  const relatedArticles = await getRelatedArticles(article.categoryId, article.id, locale)

  const formattedDate = new Date(article.updatedAt).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Breadcrumbs */}
      <section className="bg-gray-50 border-b border-gray-200 py-4">
        <div className="max-w-4xl mx-auto px-4">
          <Breadcrumbs 
            items={[
              { label: article.category.name, href: `/category/${article.category.slug}` },
              { label: article.title }
            ]} 
          />
        </div>
      </section>

      <main className="flex-1 bg-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Back link */}
          <Link 
            href={`/category/${article.category.slug}`}
            className="inline-flex items-center text-sm text-gray-500 hover:text-subcold-teal mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {article.category.name}
          </Link>

          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Updated {formattedDate}
              </div>
              <div className="flex items-center">
                <Eye className="h-4 w-4 mr-2" />
                {article.viewCount.toLocaleString()} views
              </div>
            </div>
          </header>

          {/* Article Content */}
          <article 
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section className="mt-16 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Related Articles
              </h2>
              <div className="bg-gray-50 rounded-xl divide-y divide-gray-200">
                {relatedArticles.map((related) => (
                  <ArticleCard
                    key={related.id}
                    title={related.title}
                    slug={related.slug}
                    excerpt={related.excerpt}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Helpful Section */}
          <section className="mt-12 p-6 bg-gray-50 rounded-xl text-center">
            <p className="text-gray-600 mb-4">Was this article helpful?</p>
            <div className="flex justify-center gap-4">
              <button className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                👍 Yes
              </button>
              <button className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                👎 No
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Still need help?{' '}
              <Link 
                href="https://subcold.com/pages/contact-us1"
                target="_blank"
                className="text-subcold-teal hover:underline"
              >
                Contact Support
              </Link>
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
