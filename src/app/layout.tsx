import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/components/providers/AuthProvider'

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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
