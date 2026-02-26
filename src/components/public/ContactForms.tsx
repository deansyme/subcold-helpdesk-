'use client'

import { useState } from 'react'
import { RotateCcw, MessageSquare } from 'lucide-react'
import ReturnRequestForm from './ReturnRequestForm'
import GeneralEnquiryForm from './GeneralEnquiryForm'

type FormType = 'return' | 'enquiry'

export default function ContactForms() {
  const [activeForm, setActiveForm] = useState<FormType>('enquiry')

  return (
    <div>
      {/* Form Type Tabs */}
      <div className="flex bg-gray-100 rounded-xl p-1.5 mb-6">
        <button
          onClick={() => setActiveForm('enquiry')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
            activeForm === 'enquiry'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          General Enquiry
        </button>
        <button
          onClick={() => setActiveForm('return')}
          className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
            activeForm === 'return'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <RotateCcw className="w-5 h-5" />
          Return Request
        </button>
      </div>

      {/* Active Form */}
      {activeForm === 'enquiry' ? <GeneralEnquiryForm /> : <ReturnRequestForm />}
    </div>
  )
}
