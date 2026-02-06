import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface RouteParams {
  params: { id: string }
}

export async function GET(request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const article = await prisma.article.findUnique({
    where: { id: params.id },
    include: {
      category: {
        select: { name: true, slug: true }
      }
    }
  })

  if (!article) {
    return NextResponse.json({ error: 'Article not found' }, { status: 404 })
  }

  return NextResponse.json(article)
}

export async function PUT(request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, slug, content, excerpt, categoryId, isPopular, isPublished, locale } = body

    // Check if slug already exists (excluding current article)
    const existing = await prisma.article.findFirst({
      where: { 
        slug,
        NOT: { id: params.id }
      }
    })
    if (existing) {
      return NextResponse.json({ error: 'An article with this slug already exists' }, { status: 400 })
    }

    const article = await prisma.article.update({
      where: { id: params.id },
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
    console.error('Error updating article:', error)
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await prisma.article.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting article:', error)
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 })
  }
}
