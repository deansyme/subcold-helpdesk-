import { prisma } from '@/lib/prisma'
import { ArticleForm } from '../ArticleForm'
import { redirect } from 'next/navigation'

async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    select: { id: true, name: true }
  })
}

export default async function NewArticlePage() {
  const categories = await getCategories()

  if (categories.length === 0) {
    redirect('/admin/categories/new')
  }

  return <ArticleForm categories={categories} />
}
