'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ReturnStatusFormProps {
  requestId: string
  currentStatus: string
  currentNotes: string
}

const STATUSES = [
  { value: 'pending', label: 'Pending', description: 'Awaiting review' },
  { value: 'in-review', label: 'In Review', description: 'Currently being reviewed' },
  { value: 'approved', label: 'Approved', description: 'Return approved, awaiting item' },
  { value: 'rejected', label: 'Rejected', description: 'Return rejected' },
  { value: 'completed', label: 'Completed', description: 'Return processed' }
]

export default function ReturnStatusForm({ requestId, currentStatus, currentNotes }: ReturnStatusFormProps) {
  const router = useRouter()
  const [status, setStatus] = useState(currentStatus)
  const [notes, setNotes] = useState(currentNotes)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage(null)

    try {
      const response = await fetch(`/api/admin/returns/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, adminNotes: notes })
      })

      if (!response.ok) {
        throw new Error('Failed to update')
      }

      setMessage({ type: 'success', text: 'Status updated successfully' })
      router.refresh()
    } catch {
      setMessage({ type: 'error', text: 'Failed to update status' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Update Status</h2>
      
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.text}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          >
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">
            {STATUSES.find(s => s.value === status)?.description}
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Admin Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            placeholder="Internal notes about this return..."
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className={`w-full py-2 px-4 rounded-lg font-medium text-white transition ${
            isSaving 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-teal-500 hover:bg-teal-600'
          }`}
        >
          {isSaving ? 'Saving...' : 'Update Status'}
        </button>
      </div>
    </form>
  )
}
