'use client'

import { User, Headphones } from 'lucide-react'

interface Reply {
  id: string
  sender: string
  senderName: string
  senderEmail: string
  message: string
  emailSent: boolean
  createdAt: Date | string
}

interface TicketConversationProps {
  initialMessage: string
  customerName: string
  createdAt: Date | string
  replies: Reply[]
}

export default function TicketConversation({ 
  initialMessage, 
  customerName, 
  createdAt,
  replies 
}: TicketConversationProps) {
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
        <Headphones className="w-5 h-5 text-gray-500" />
        Conversation
      </h3>

      <div className="space-y-6">
        {/* Initial Customer Message */}
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-gray-900">{customerName}</span>
              <span className="text-xs text-gray-500">{formatDate(createdAt)}</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                Customer
              </span>
            </div>
            <div className="bg-blue-50 rounded-lg p-4 text-gray-700 whitespace-pre-wrap">
              {initialMessage}
            </div>
          </div>
        </div>

        {/* Replies */}
        {replies.map((reply) => (
          <div key={reply.id} className="flex gap-4">
            <div className="flex-shrink-0">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                reply.sender === 'admin' 
                  ? 'bg-teal-100' 
                  : 'bg-blue-100'
              }`}>
                {reply.sender === 'admin' ? (
                  <Headphones className="w-5 h-5 text-teal-600" />
                ) : (
                  <User className="w-5 h-5 text-blue-600" />
                )}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="font-medium text-gray-900">{reply.senderName}</span>
                <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${
                  reply.sender === 'admin'
                    ? 'bg-teal-100 text-teal-700'
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {reply.sender === 'admin' ? 'Support' : 'Customer'}
                </span>
                {reply.sender === 'admin' && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    reply.emailSent
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {reply.emailSent ? 'Email Sent' : 'Email Pending'}
                  </span>
                )}
              </div>
              <div className={`rounded-lg p-4 text-gray-700 ${
                reply.sender === 'admin'
                  ? 'bg-teal-50'
                  : 'bg-blue-50'
              }`}>
                {reply.sender === 'admin' ? (
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: reply.message }} 
                  />
                ) : (
                  <div className="whitespace-pre-wrap">{reply.message}</div>
                )}
              </div>
            </div>
          </div>
        ))}

        {replies.length === 0 && (
          <p className="text-center text-gray-500 text-sm py-4">
            No replies yet. Use the form below to respond to the customer.
          </p>
        )}
      </div>
    </div>
  )
}
