import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { 
  FileText, 
  FolderOpen, 
  Users, 
  Eye,
  TrendingUp,
  Plus
} from 'lucide-react'

async function getStats() {
  const [articleCount, categoryCount, userCount, totalViews, recentArticles] = await Promise.all([
    prisma.article.count({ where: { isPublished: true } }),
    prisma.category.count({ where: { isActive: true } }),
    prisma.user.count(),
    prisma.article.aggregate({ _sum: { viewCount: true } }),
    prisma.article.findMany({
      take: 5,
      orderBy: { updatedAt: 'desc' },
      include: { category: { select: { name: true } } }
    })
  ])

  return {
    articleCount,
    categoryCount,
    userCount,
    totalViews: totalViews._sum.viewCount || 0,
    recentArticles
  }
}

async function getPopularArticles() {
  return prisma.article.findMany({
    take: 5,
    orderBy: { viewCount: 'desc' },
    include: { category: { select: { name: true } } }
  })
}

export default async function AdminDashboard() {
  const stats = await getStats()
  const popularArticles = await getPopularArticles()

  const statCards = [
    { name: 'Total Articles', value: stats.articleCount, icon: FileText, href: '/admin/articles', color: 'bg-blue-500' },
    { name: 'Categories', value: stats.categoryCount, icon: FolderOpen, href: '/admin/categories', color: 'bg-green-500' },
    { name: 'Admin Users', value: stats.userCount, icon: Users, href: '/admin/users', color: 'bg-purple-500' },
    { name: 'Total Views', value: stats.totalViews.toLocaleString(), icon: Eye, href: '#', color: 'bg-orange-500' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Welcome to the Subcold Support admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <Link key={stat.name} href={stat.href}>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Link href="/admin/articles/new">
          <div className="bg-subcold-teal rounded-xl p-6 text-white hover:bg-subcold-teal-dark transition-colors cursor-pointer">
            <div className="flex items-center">
              <Plus className="h-8 w-8 mr-4" />
              <div>
                <h3 className="font-semibold text-lg">Create New Article</h3>
                <p className="text-white/80 text-sm">Add a new help article</p>
              </div>
            </div>
          </div>
        </Link>
        <Link href="/admin/categories/new">
          <div className="bg-subcold-black rounded-xl p-6 text-white hover:bg-subcold-gray transition-colors cursor-pointer">
            <div className="flex items-center">
              <FolderOpen className="h-8 w-8 mr-4" />
              <div>
                <h3 className="font-semibold text-lg">Create New Category</h3>
                <p className="text-white/80 text-sm">Add a new help category</p>
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Articles */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Recent Articles</h2>
              <Link href="/admin/articles" className="text-subcold-teal text-sm hover:underline">
                View all
              </Link>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {stats.recentArticles.map((article) => (
              <Link key={article.id} href={`/admin/articles/${article.id}`}>
                <div className="p-4 hover:bg-gray-50 transition-colors">
                  <p className="font-medium text-gray-900 truncate">{article.title}</p>
                  <p className="text-sm text-gray-500">{article.category.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Popular Articles */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                Popular Articles
              </h2>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {popularArticles.map((article) => (
              <Link key={article.id} href={`/admin/articles/${article.id}`}>
                <div className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-gray-900 truncate">{article.title}</p>
                      <p className="text-sm text-gray-500">{article.category.name}</p>
                    </div>
                    <div className="flex items-center text-gray-500 ml-4">
                      <Eye className="h-4 w-4 mr-1" />
                      <span className="text-sm">{article.viewCount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
