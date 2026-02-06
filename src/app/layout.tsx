import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/providers/AuthProvider'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'

export const metadata: Metadata = {
  title: 'Subcold Support - How Can We Help?',
  description: 'Find answers to your questions about Subcold products and services. Get help with orders, delivery, returns, and technical support.',
  keywords: 'Subcold, support, help, mini fridge, faq, customer service',
  openGraph: {
    title: 'Subcold Support',
    description: 'Find answers to your questions about Subcold products and services.',
    type: 'website',
  },
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale()
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body className="min-h-screen bg-white">
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
