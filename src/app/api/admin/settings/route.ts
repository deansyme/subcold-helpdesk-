import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let settings = await prisma.siteSettings.findUnique({
    where: { id: 'default' }
  })

  // Create default settings if they don't exist
  if (!settings) {
    settings = await prisma.siteSettings.create({
      data: {
        id: 'default',
        siteName: 'Subcold Support',
        heroTitle: 'HOW CAN WE HELP?',
        heroSubtitle: 'Find answers to your questions about Subcold products and services',
        logoUrl: 'https://subcold.com/cdn/shop/files/subcold-logo-white_39563153-4a05-4674-b976-f96a36b48c2c.png?v=1760517416&width=156',
      }
    })
  }

  return NextResponse.json(settings)
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions)
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { siteName, heroTitle, heroSubtitle, contactFormEmbed, footerText, primaryColor, logoUrl } = body

    const settings = await prisma.siteSettings.upsert({
      where: { id: 'default' },
      update: {
        siteName,
        heroTitle,
        heroSubtitle,
        contactFormEmbed,
        footerText,
        primaryColor,
        logoUrl,
      },
      create: {
        id: 'default',
        siteName,
        heroTitle,
        heroSubtitle,
        contactFormEmbed,
        footerText,
        primaryColor,
        logoUrl,
      }
    })

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 })
  }
}
