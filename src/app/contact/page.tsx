import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import Script from 'next/script'
import Link from 'next/link'
import { RotateCcw } from 'lucide-react'

export const metadata = {
  title: 'Contact Us - Subcold Support',
  description: 'Get in touch with the Subcold support team. We\'re here to help with any questions about your Subcold products.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Header Section */}
      <section className="bg-subcold-black text-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Breadcrumbs 
            items={[
              { label: 'Contact Us' }
            ]} 
          />
          <h1 className="text-3xl md:text-4xl font-bold mt-6">
            Contact Us
          </h1>
          <p className="text-gray-400 mt-2">
            Can&apos;t find what you&apos;re looking for? Get in touch with our support team.
          </p>
        </div>
      </section>

      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Return Item Banner */}
          <div className="bg-subcold-teal text-white rounded-xl p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center">
                <RotateCcw className="h-8 w-8 mr-4" />
                <div>
                  <h2 className="text-xl font-bold">Need to return an item?</h2>
                  <p className="text-white/90">No problem! Start your return process quickly and easily.</p>
                </div>
              </div>
              <Link
                href="https://subcold.com/pages/self-return-request-form"
                target="_blank"
                className="px-6 py-3 bg-white text-subcold-teal font-semibold rounded-lg hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                Start Return HERE
              </Link>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a message</h2>
            
            {/* Globo Form */}
            <div className="globo-formbuilder" data-id="MTI4NzI4"></div>
            
            {/* Contact Info */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Other ways to reach us</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">Phone</p>
                  <p className="text-gray-600">01506 440557</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-900">Email</p>
                  <p className="text-gray-600">sales@subcold.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Globo Form Builder Script */}
      <Script 
        src="https://app.globo.io/formbuilder/embed.js" 
        strategy="lazyOnload"
      />
    </div>
  )
}
