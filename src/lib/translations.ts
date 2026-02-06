import { prisma } from './prisma'

export const supportedLocales = ['en', 'de', 'fr', 'es', 'it', 'nl'] as const
export type SupportedLocale = (typeof supportedLocales)[number]

/**
 * Get article with translation for the specified locale
 * Falls back to the original article content if no translation exists
 */
export async function getArticleWithTranslation(slug: string, locale: string) {
  const article = await prisma.article.findUnique({
    where: { slug, isPublished: true },
    include: {
      category: {
        select: { id: true, name: true, slug: true }
      },
      translations: {
        where: { locale }
      }
    }
  })

  if (!article) return null

  // If translation exists, merge it with the article
  const translation = article.translations[0]
  if (translation && locale !== 'en') {
    return {
      ...article,
      title: translation.title,
      content: translation.content,
      excerpt: translation.excerpt || article.excerpt,
      isTranslated: true,
      originalTitle: article.title
    }
  }

  return {
    ...article,
    isTranslated: false
  }
}

/**
 * Get category with translation for the specified locale
 */
export async function getCategoryWithTranslation(slug: string, locale: string) {
  const category = await prisma.category.findUnique({
    where: { slug, isActive: true },
    include: {
      translations: {
        where: { locale }
      },
      articles: {
        where: { isPublished: true },
        include: {
          translations: {
            where: { locale }
          }
        },
        orderBy: [
          { isPopular: 'desc' },
          { viewCount: 'desc' }
        ]
      }
    }
  })

  if (!category) return null

  // Apply category translation
  const categoryTranslation = category.translations[0]
  const translatedCategory = {
    ...category,
    name: categoryTranslation?.name || category.name,
    description: categoryTranslation?.description || category.description,
    isTranslated: !!categoryTranslation
  }

  // Apply article translations
  const translatedArticles = category.articles.map(article => {
    const articleTranslation = article.translations[0]
    if (articleTranslation && locale !== 'en') {
      return {
        ...article,
        title: articleTranslation.title,
        content: articleTranslation.content,
        excerpt: articleTranslation.excerpt || article.excerpt,
        isTranslated: true
      }
    }
    return { ...article, isTranslated: false }
  })

  return {
    ...translatedCategory,
    articles: translatedArticles
  }
}

/**
 * Get all categories with translations
 */
export async function getCategoriesWithTranslations(locale: string) {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    include: {
      translations: {
        where: { locale }
      },
      _count: {
        select: { articles: { where: { isPublished: true } } }
      }
    }
  })

  return categories.map(category => {
    const translation = category.translations[0]
    return {
      ...category,
      name: translation?.name || category.name,
      description: translation?.description || category.description,
      isTranslated: !!translation
    }
  })
}

/**
 * Get popular articles with translations
 */
export async function getPopularArticlesWithTranslations(locale: string) {
  const articles = await prisma.article.findMany({
    where: { 
      isPublished: true, 
      isPopular: true 
    },
    include: {
      category: {
        select: { name: true, slug: true },
      },
      translations: {
        where: { locale }
      }
    },
    orderBy: { viewCount: 'desc' },
    take: 6
  })

  return articles.map(article => {
    const translation = article.translations[0]
    if (translation && locale !== 'en') {
      return {
        ...article,
        title: translation.title,
        excerpt: translation.excerpt || article.excerpt,
        isTranslated: true
      }
    }
    return { ...article, isTranslated: false }
  })
}

/**
 * Search articles with translations
 */
export async function searchArticlesWithTranslations(query: string, locale: string) {
  // Search in both original content and translations
  const articles = await prisma.article.findMany({
    where: {
      isPublished: true,
      OR: [
        { title: { contains: query, mode: 'insensitive' } },
        { content: { contains: query, mode: 'insensitive' } },
        { excerpt: { contains: query, mode: 'insensitive' } },
        {
          translations: {
            some: {
              locale,
              OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { content: { contains: query, mode: 'insensitive' } },
                { excerpt: { contains: query, mode: 'insensitive' } }
              ]
            }
          }
        }
      ]
    },
    include: {
      category: {
        select: { name: true, slug: true }
      },
      translations: {
        where: { locale }
      }
    },
    take: 20
  })

  return articles.map(article => {
    const translation = article.translations[0]
    if (translation && locale !== 'en') {
      return {
        ...article,
        title: translation.title,
        content: translation.content,
        excerpt: translation.excerpt || article.excerpt,
        isTranslated: true
      }
    }
    return { ...article, isTranslated: false }
  })
}
