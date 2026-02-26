'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { RichTextEditor } from '@/components/admin/RichTextEditor'

interface TicketReplyFormProps {
  ticketId: string
  customerEmail: string
}

export default function TicketReplyForm({ ticketId, customerEmail }: TicketReplyFormProps) {
  const router = useRouter()
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
          updateStatus
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send reply')
      }

      setResult({
        success: true,
        message: data.emailSent 
          ? 'Reply sent and email delivered to customer'
          : 'Reply saved (email not configured)'
      })
      setMessage('')
      router.refresh()
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send reply'
      })
    } finally {
      setSending(false)
    }
  }

  const statusOptions = [
    { value: 'awaiting-customer', label: 'Awaiting Customer Response' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' }
  ]

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Send className="w-5 h-5 text-gray-500" />
        Reply to Customer
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Recipient Info */}
        <div className="bg-gray-50 rounded-lg px-4 py-3 text-sm">
          <span className="text-gray-500">Sending to:</span>{' '}
          <span className="font-medium text-gray-900">{customerEmail}</span>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <RichTextEditor
            content={message}
            onChange={setMessage}
            placeholder="Type your reply to the customer..."
            minHeight="150px"
          />
        </div>

        {/* Status Update */}
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
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-teal-600 text-white font-medium rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Reply
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
