import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { CategoryForm } from '../CategoryForm'

interface EditCategoryPageProps {
  params: { id: string }
}

async function getCategory(id: string) {
  return prisma.category.findUnique({
    where: { id }
  })
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const category = await getCategory(params.id)

  if (!category) {
    notFound()
  }

  return <CategoryForm category={category} />
}
