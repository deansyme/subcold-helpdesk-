import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { Breadcrumbs } from '@/components/ui/Breadcrumbs'
import ReturnRequestForm from '@/components/public/ReturnRequestForm'

export const metadata = {
  title: 'Returns & Contact - Subcold Support',
  description: 'Submit a return request or get in touch with the Subcold support team. We\'re here to help with any questions about your Subcold products.',
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
              { label: 'Returns & Contact' }
            ]} 
          />
          <h1 className="text-3xl md:text-4xl font-bold mt-6">
            Returns & Contact
          </h1>
          <p className="text-gray-400 mt-2">
            Submit a return request or get in touch with our support team.
          </p>
        </div>
      </section>

      <main className="flex-1 bg-gray-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Return Request Form */}
          <ReturnRequestForm />

          {/* Contact Info */}
          <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Other ways to reach us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-gray-50 rounded-lg text-center">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <p className="font-semibold text-gray-900">Phone</p>
                <p className="text-gray-600 mt-1">01506 440557</p>
                <p className="text-sm text-gray-500 mt-2">Mon-Fri 9am-5pm</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg text-center">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="font-semibold text-gray-900">Email</p>
                <p className="text-gray-600 mt-1">sales@subcold.com</p>
                <p className="text-sm text-gray-500 mt-2">24-48hr response</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg text-center">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="font-semibold text-gray-900">Help Center</p>
                <p className="text-gray-600 mt-1">Browse FAQs</p>
                <p className="text-sm text-gray-500 mt-2">Available 24/7</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

