import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SearchBar } from '@/components/ui/SearchBar'
import { CategoryCard } from '@/components/ui/CategoryCard'
import { ArticleCard } from '@/components/ui/ArticleCard'
import Link from 'next/link'
import { MessageCircle } from 'lucide-react'
import { getTranslations, getLocale } from 'next-intl/server'
import { getCategoriesWithTranslations, getPopularArticlesWithTranslations } from '@/lib/translations'

export default async function HomePage() {
  const locale = await getLocale()
  const [categories, popularArticles, t] = await Promise.all([
    getCategoriesWithTranslations(locale),
    getPopularArticlesWithTranslations(locale),
    getTranslations()
  ])

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-subcold-black text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            {t('home.heroTitle')}
          </h1>
          <p className="text-gray-400 mb-8 text-lg">
            {t('home.heroSubtitle')}
          </p>
          <SearchBar 
            size="large" 
            placeholder={t('common.searchPlaceholder')}
            className="max-w-2xl mx-auto"
          />
        </div>
      </section>

      {/* Featured Action */}
      <section className="bg-subcold-teal text-white py-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm md:text-base">
            <span className="font-semibold">NEED TO RETURN AN ITEM?</span>
            {' '}No problem! Start your return{' '}
            <Link 
              href="/contact" 
              className="underline font-semibold hover:no-underline"
            >
              HERE
            </Link>
          </p>
        </div>
      </section>

      <main className="flex-1 bg-gray-50">
        {/* Categories Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  name={category.name}
                  slug={category.slug}
                  description={category.description}
                  icon={category.icon}
                  articleCount={category._count.articles}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Popular Questions Section */}
        {popularArticles.length > 0 && (
          <section className="py-16 bg-white">
            <div className="max-w-4xl mx-auto px-4">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
                POPULAR QUESTIONS
              </h2>
              <p className="text-gray-500 text-center mb-8">
                Got a question? Check out our popular articles below to find the answer you&apos;re looking for.
              </p>
              <div className="bg-gray-50 rounded-xl divide-y divide-gray-200">
                {popularArticles.map((article) => (
                  <ArticleCard
                    key={article.id}
                    title={article.title}
                    slug={article.slug}
                    categoryName={article.category.name}
                    categorySlug={article.category.slug}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Need More Help Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-200">
              <div className="w-16 h-16 bg-subcold-teal rounded-full flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                NEED MORE HELP?
              </h2>
              <p className="text-gray-500 mb-8">
                Please contact our support team and we&apos;ll be happy to assist you.
              </p>
              <Link 
                href="https://subcold.com/pages/contact-us1"
                target="_blank"
                className="inline-flex items-center justify-center px-8 py-3 bg-subcold-black text-white font-semibold rounded-lg hover:bg-subcold-gray transition-colors"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
