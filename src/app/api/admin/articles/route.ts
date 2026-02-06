import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const articles = await prisma.article.findMany({
    orderBy: { updatedAt: 'desc' },
    include: {
      category: {
        select: { name: true, slug: true }
      }
    }
  })

  return NextResponse.json(articles)
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, slug, content, excerpt, categoryId, isPopular, isPublished, locale } = body

    // Check if slug already exists
    const existing = await prisma.article.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json({ error: 'An article with this slug already exists' }, { status: 400 })
    }

    const article = await prisma.article.create({
      data: {
        title,
        slug,
        content,
        excerpt,
        categoryId,
        isPopular,
        isPublished,
        locale,
      }
    })

    return NextResponse.json(article)
  } catch (error) {
    console.error('Error creating article:', error)
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 })
  }
}
