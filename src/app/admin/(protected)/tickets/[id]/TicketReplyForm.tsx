'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Send, Loader2, CheckCircle, AlertCircle, StickyNote, MessageSquare } from 'lucide-react'
import { RichTextEditor } from '@/components/admin/RichTextEditor'

interface TicketReplyFormProps {
  ticketId: string
  customerEmail: string
}

type FormType = 'reply' | 'note'

export default function TicketReplyForm({ ticketId, customerEmail }: TicketReplyFormProps) {
  const router = useRouter()
  const [formType, setFormType] = useState<FormType>('reply')
  const [message, setMessage] = useState('')
  const [updateStatus, setUpdateStatus] = useState('awaiting-customer')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  // Check if editor has actual content (not just empty tags)
  const hasContent = () => {
    const stripped = message.replace(/<[^>]*>/g, '').trim()
    return stripped.length > 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!hasContent()) return
    
    setSending(true)
    setResult(null)

    try {
      const response = await fetch(`/api/admin/tickets/${ticketId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          type: formType,
          updateStatus: formType === 'reply' ? updateStatus : undefined
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send')
      }

      if (formType === 'note') {
        setResult({
          success: true,
          message: 'Internal note added'
        })
      } else {
        setResult({
          success: true,
          message: data.emailSent 
            ? 'Reply sent and email delivered to customer'
            : 'Reply saved (email not configured)'
        })
      }
      setMessage('')
      router.refresh()
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send'
      })
    } finally {
      setSending(false)
    }
  }

  const handleTabChange = (type: FormType) => {
    setFormType(type)
    setResult(null)
  }

  const statusOptions = [
    { value: 'awaiting-customer', label: 'Awaiting Customer Response' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' }
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        <button
          type="button"
          onClick={() => handleTabChange('reply')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
            formType === 'reply'
              ? 'text-teal-600 border-b-2 border-teal-600 bg-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Reply
        </button>
        <button
          type="button"
          onClick={() => handleTabChange('note')}
          className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-colors ${
            formType === 'note'
              ? 'text-amber-600 border-b-2 border-amber-500 bg-white'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
          }`}
        >
          <StickyNote className="w-4 h-4" />
          Internal Note
        </button>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-4">
        {/* Context Info */}
        {formType === 'reply' ? (
          <div className="bg-blue-50 rounded-lg px-4 py-3 text-sm">
            <span className="text-blue-700">Sending to:</span>{' '}
            <span className="font-medium text-blue-900">{customerEmail}</span>
          </div>
        ) : (
          <div className="bg-amber-50 rounded-lg px-4 py-3 text-sm text-amber-800">
            <strong>Internal note</strong> — Only visible to team members, not sent to customer
          </div>
        )}

        {/* Message */}
        <div>
          <RichTextEditor
            content={message}
            onChange={setMessage}
            placeholder={formType === 'reply' 
              ? "Type your reply to the customer..." 
              : "Add an internal note..."
            }
            minHeight="120px"
          />
        </div>

        {/* Status Update (only for replies) */}
        {formType === 'reply' && (
          <div>
            <label htmlFor="status-update" className="block text-sm font-medium text-gray-700 mb-1">
              Update ticket status to
            </label>
            <select
              id="status-update"
              value={updateStatus}
              onChange={(e) => setUpdateStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Result Message */}
        {result && (
          <div className={`flex items-start gap-3 p-4 rounded-lg ${
            result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {result.success ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            <p className="text-sm">{result.message}</p>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={sending || !hasContent()}
            className={`inline-flex items-center gap-2 px-6 py-2.5 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
              formType === 'reply' 
                ? 'bg-teal-600 hover:bg-teal-700' 
                : 'bg-amber-600 hover:bg-amber-700'
            }`}
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {formType === 'reply' ? 'Sending...' : 'Saving...'}
              </>
            ) : (
              <>
                {formType === 'reply' ? (
                  <>
                    <Send className="w-4 h-4" />
                    Send Reply
                  </>
                ) : (
                  <>
                    <StickyNote className="w-4 h-4" />
                    Add Note
                  </>
                )}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
