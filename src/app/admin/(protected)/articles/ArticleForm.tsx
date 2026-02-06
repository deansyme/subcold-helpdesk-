'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Eye } from 'lucide-react'
import slugify from 'slugify'
import dynamic from 'next/dynamic'

const RichTextEditor = dynamic(
  () => import('@/components/admin/RichTextEditor').then((mod) => mod.RichTextEditor),
  { ssr: false, loading: () => <div className="h-[300px] bg-gray-100 rounded-lg animate-pulse" /> }
)

interface Category {
  id: string
  name: string
}

interface ArticleFormProps {
  article?: {
    id: string
    title: string
    slug: string
    content: string
    excerpt: string | null
    isPopular: boolean
    isPublished: boolean
    categoryId: string
    locale: string
  }
  categories: Category[]
}

export function ArticleForm({ article, categories }: ArticleFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [title, setTitle] = useState(article?.title || '')
  const [slug, setSlug] = useState(article?.slug || '')
  const [content, setContent] = useState(article?.content || '')
  const [excerpt, setExcerpt] = useState(article?.excerpt || '')
  const [categoryId, setCategoryId] = useState(article?.categoryId || categories[0]?.id || '')
  const [isPopular, setIsPopular] = useState(article?.isPopular ?? false)
  const [isPublished, setIsPublished] = useState(article?.isPublished ?? true)
  const [locale, setLocale] = useState(article?.locale || 'en-GB')

  const handleTitleChange = (value: string) => {
    setTitle(value)
    if (!article) {
      setSlug(slugify(value, { lower: true, strict: true }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const url = article 
        ? `/api/admin/articles/${article.id}`
        : '/api/admin/articles'
      
      const res = await fetch(url, {
        method: article ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          content,
          excerpt: excerpt || null,
          categoryId,
          isPopular,
          isPublished,
          locale,
        }),
      })

      if (res.ok) {
        router.push('/admin/articles')
        router.refresh()
      } else {
        const data = await res.json()
        setError(data.error || 'Failed to save article')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Link
            href="/admin/articles"
            className="mr-4 p-2 text-gray-500 hover:text-gray-700 rounded-lg hover:bg-gray-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {article ? 'Edit Article' : 'New Article'}
            </h1>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          {article && (
            <Link
              href={`/article/${article.slug}`}
              target="_blank"
              className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Eye className="h-5 w-5 mr-2" />
              Preview
            </Link>
          )}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-subcold-teal text-white rounded-lg hover:bg-subcold-teal-dark transition-colors disabled:opacity-50"
          >
            <Save className="h-5 w-5 mr-2" />
            {loading ? 'Saving...' : 'Save Article'}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-lg p-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-subcold-teal focus:border-transparent"
                  placeholder="e.g., How do I track my order?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-subcold-teal focus:border-transparent font-mono text-sm"
                  placeholder="how-do-i-track-my-order"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-subcold-teal focus:border-transparent"
                  placeholder="Brief summary of the article (shown in search results)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <RichTextEditor content={content} onChange={setContent} />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-subcold-teal focus:border-transparent"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={locale}
                  onChange={(e) => setLocale(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-subcold-teal focus:border-transparent"
                >
                  <option value="en-GB">English (UK)</option>
                  <option value="en-US">English (US)</option>
                  <option value="de">German</option>
                  <option value="fr">French</option>
                  <option value="es">Spanish</option>
                </select>
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="h-4 w-4 text-subcold-teal focus:ring-subcold-teal border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Published
                  </span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isPopular}
                    onChange={(e) => setIsPopular(e.target.checked)}
                    className="h-4 w-4 text-subcold-teal focus:ring-subcold-teal border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Show in Popular Questions
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
