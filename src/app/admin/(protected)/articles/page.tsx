import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Plus, Edit, Eye, EyeOff, Star, StarOff } from 'lucide-react'
import { DeleteArticleButton } from './DeleteArticleButton'

async function getArticles() {
  return prisma.article.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      category: {
        select: { name: true }
      }
    }
  })
}

export default async function ArticlesPage() {
  const articles = await getArticles()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
          <p className="text-gray-600">Manage help center articles</p>
        </div>
        <Link
          href="/admin/articles/new"
          className="inline-flex items-center px-4 py-2 bg-subcold-teal text-white rounded-lg hover:bg-subcold-teal-dark transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Article
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Article
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Views
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Updated
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {articles.map((article) => (
              <tr key={article.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    {article.isPopular && (
                      <Star className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0" />
                    )}
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                        {article.title}
                      </div>
                      <div className="text-sm text-gray-500 font-mono truncate max-w-xs">
                        {article.slug}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {article.category.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {article.isPublished ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Eye className="h-3 w-3 mr-1" />
                      Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      <EyeOff className="h-3 w-3 mr-1" />
                      Draft
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {article.viewCount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(article.updatedAt).toLocaleDateString('en-GB')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      href={`/article/${article.slug}`}
                      target="_blank"
                      className="text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                    <Link
                      href={`/admin/articles/${article.id}`}
                      className="text-subcold-teal hover:text-subcold-teal-dark p-2 rounded-lg hover:bg-gray-100"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <DeleteArticleButton id={article.id} title={article.title} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No articles yet.</p>
            <Link
              href="/admin/articles/new"
              className="text-subcold-teal hover:underline mt-2 inline-block"
            >
              Create your first article
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
