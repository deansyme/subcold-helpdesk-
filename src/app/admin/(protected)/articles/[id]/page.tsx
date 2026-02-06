import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { ArticleForm } from '../ArticleForm'

interface EditArticlePageProps {
  params: { id: string }
}

async function getArticle(id: string) {
  return prisma.article.findUnique({
    where: { id }
  })
}

async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    select: { id: true, name: true }
  })
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const [article, categories] = await Promise.all([
    getArticle(params.id),
    getCategories()
  ])

  if (!article) {
    notFound()
  }

  return <ArticleForm article={article} categories={categories} />
}
