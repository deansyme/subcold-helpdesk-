'use client'

import { User, Headphones, StickyNote, FileText, Download, Mail } from 'lucide-react'

interface Reply {
  id: string
  type: string  // "reply" or "note"
  sender: string
  senderName: string
  senderEmail: string
  message: string
  attachments: string[]
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
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
              <Mail className="w-5 h-5 text-gray-500" />
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-gray-900">{customerName}</span>
              <span className="text-xs text-gray-500">{formatDate(createdAt)}</span>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-4 text-gray-700 whitespace-pre-wrap">
              {initialMessage}
            </div>
          </div>
        </div>

        {/* Replies and Notes */}
        {replies.map((reply) => {
          const isNote = reply.type === 'note'
          const isAdmin = reply.sender === 'admin'
          
          return (
            <div key={reply.id} className={`flex gap-4 ${isNote ? 'opacity-90' : ''}`}>
              <div className="flex-shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isNote 
                    ? 'bg-amber-100'
                    : isAdmin 
                      ? 'bg-orange-100' 
                      : 'bg-gray-100'
                }`}>
                  {isNote ? (
                    <StickyNote className="w-5 h-5 text-amber-600" />
                  ) : isAdmin ? (
                    <Headphones className="w-5 h-5 text-orange-600" />
                  ) : (
                    <Mail className="w-5 h-5 text-gray-500" />
                  )}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="font-medium text-gray-900">{reply.senderName}</span>
                  <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
                  {isNote ? (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                      Internal Note
                    </span>
                  ) : (
                    <>
                      {isAdmin && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          reply.emailSent
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {reply.emailSent ? 'Email Sent' : 'Email Pending'}
                        </span>
                      )}
                    </>
                  )}
                </div>
                <div className={`rounded-lg p-4 text-gray-700 ${
                  isNote
                    ? 'bg-amber-50 border border-amber-200 border-dashed'
                    : isAdmin
                      ? 'bg-gray-100 border-l-4 border-l-orange-400 border border-gray-200'
                      : 'bg-white border border-gray-200'
                }`}>
                  {isAdmin || isNote ? (
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: reply.message }} 
                    />
                  ) : (
                    <div className="whitespace-pre-wrap">{reply.message}</div>
                  )}
                  
                  {/* Attachments */}
                  {reply.attachments && reply.attachments.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                      <p className="text-xs text-gray-500 font-medium">Attachments:</p>
                      <div className="flex flex-wrap gap-2">
                        {reply.attachments.map((url, idx) => {
                          const filename = url.split('/').pop() || 'file'
                          const displayName = filename.includes('-') 
                            ? filename.substring(filename.indexOf('-') + 1) 
                            : filename
                          const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(url)
                          
                          return isImage ? (
                            <a
                              key={idx}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block"
                            >
                              <img
                                src={url}
                                alt={displayName}
                                className="max-h-40 rounded-lg border border-gray-200 hover:border-teal-500 transition-colors"
                              />
                            </a>
                          ) : (
                            <a
                              key={idx}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-2 bg-white rounded-lg border border-gray-200 hover:border-teal-500 hover:bg-teal-50 transition-colors text-sm"
                            >
                              <FileText className="w-4 h-4 text-gray-500" />
                              <span className="truncate max-w-xs">{displayName}</span>
                              <Download className="w-4 h-4 text-gray-400" />
                            </a>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}

        {replies.length === 0 && (
          <p className="text-center text-gray-500 text-sm py-4">
            No replies yet. Use the form below to respond to the customer.
          </p>
        )}
      </div>
    </div>
  )
}
