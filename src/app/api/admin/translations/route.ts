import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Get translations for an article or category
export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') // 'article' or 'category'
  const id = searchParams.get('id')

  if (!type || !id) {
    return NextResponse.json({ error: 'Missing type or id' }, { status: 400 })
  }

  try {
    if (type === 'article') {
      const translations = await prisma.articleTranslation.findMany({
        where: { articleId: id },
        orderBy: { locale: 'asc' }
      })
      return NextResponse.json(translations)
    } else if (type === 'category') {
      const translations = await prisma.categoryTranslation.findMany({
        where: { categoryId: id },
        orderBy: { locale: 'asc' }
      })
      return NextResponse.json(translations)
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  } catch (error) {
    console.error('Error fetching translations:', error)
    return NextResponse.json({ error: 'Failed to fetch translations' }, { status: 500 })
  }
}

// Create or update a translation
export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { type, id, locale, ...data } = body

    if (!type || !id || !locale) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (type === 'article') {
      const translation = await prisma.articleTranslation.upsert({
        where: {
          articleId_locale: { articleId: id, locale }
        },
        update: {
          title: data.title,
          content: data.content,
          excerpt: data.excerpt
        },
        create: {
          articleId: id,
          locale,
          title: data.title,
          content: data.content || '',
          excerpt: data.excerpt
        }
      })
      return NextResponse.json(translation)
    } else if (type === 'category') {
      const translation = await prisma.categoryTranslation.upsert({
        where: {
          categoryId_locale: { categoryId: id, locale }
        },
        update: {
          name: data.name,
          description: data.description
        },
        create: {
          categoryId: id,
          locale,
          name: data.name,
          description: data.description
        }
      })
      return NextResponse.json(translation)
    }

    return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  } catch (error) {
    console.error('Error saving translation:', error)
    return NextResponse.json({ error: 'Failed to save translation' }, { status: 500 })
  }
}

// Delete a translation
export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')
  const id = searchParams.get('id')
  const locale = searchParams.get('locale')

  if (!type || !id || !locale) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
  }

  try {
    if (type === 'article') {
      await prisma.articleTranslation.delete({
        where: {
          articleId_locale: { articleId: id, locale }
        }
      })
    } else if (type === 'category') {
      await prisma.categoryTranslation.delete({
        where: {
          categoryId_locale: { categoryId: id, locale }
        }
      })
    } else {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting translation:', error)
    return NextResponse.json({ error: 'Failed to delete translation' }, { status: 500 })
  }
}
